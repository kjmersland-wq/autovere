import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@16.10.0';
import { getStripe, getStripeModeFromSecret, getWebhookSecret } from '../_shared/stripe.ts';

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const stripe = getStripe();
const mode = getStripeModeFromSecret();

type SubscriptionSnapshot = {
  stripeCustomerId: string | null;
  stripeSubscriptionId: string;
  status: string;
  priceId: string;
  productId: string;
  billingInterval: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

const isoFromEpoch = (value?: number | null): string | null =>
  typeof value === 'number' ? new Date(value * 1000).toISOString() : null;

const getUserIdFromSubscription = (sub: Stripe.Subscription): string | null => {
  const fromSubMeta = sub.metadata?.user_id;
  if (fromSubMeta) return fromSubMeta;
  const fromItemMeta = sub.items.data[0]?.metadata?.user_id;
  if (fromItemMeta) return fromItemMeta;
  return null;
};

const snapshotFromSubscription = (sub: Stripe.Subscription): SubscriptionSnapshot => {
  const firstItem = sub.items.data[0];
  const stripePriceId = typeof firstItem?.price?.id === 'string' ? firstItem.price.id : '';
  const stripeProductId = typeof firstItem?.price?.product === 'string'
    ? firstItem.price.product
    : (firstItem?.price?.product as Stripe.Product | null)?.id || '';

  return {
    stripeCustomerId: typeof sub.customer === 'string' ? sub.customer : sub.customer?.id || null,
    stripeSubscriptionId: sub.id,
    status: sub.status,
    priceId: stripePriceId,
    productId: stripeProductId,
    billingInterval: firstItem?.price?.recurring?.interval ?? null,
    currentPeriodStart: isoFromEpoch(sub.current_period_start),
    currentPeriodEnd: isoFromEpoch(sub.current_period_end),
    cancelAtPeriodEnd: sub.cancel_at_period_end,
  };
};

const recordEvent = async (event: Stripe.Event): Promise<boolean> => {
  const { error } = await supabase
    .from('stripe_webhook_events')
    .insert({ event_id: event.id, event_type: event.type, payload: event as unknown as Record<string, unknown> });

  if (!error) return true;

  if (error.code === '23505') {
    console.info('[stripe-webhook] duplicate_event_skipped', { eventId: event.id, type: event.type });
    return false;
  }

  throw new Error(`Failed to persist webhook event idempotency key: ${error.message}`);
};

const upsertSubscription = async (userId: string, sub: Stripe.Subscription) => {
  const s = snapshotFromSubscription(sub);
  const { error } = await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: s.stripeCustomerId,
      stripe_subscription_id: s.stripeSubscriptionId,
      product_id: s.productId,
      price_id: s.priceId,
      status: s.status,
      billing_interval: s.billingInterval,
      current_period_start: s.currentPeriodStart,
      current_period_end: s.currentPeriodEnd,
      cancel_at_period_end: s.cancelAtPeriodEnd,
      environment: mode,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_subscription_id' },
  );

  if (error) {
    throw new Error(`Failed to upsert subscription: ${error.message}`);
  }

  console.info('[stripe-webhook] subscription_upserted', {
    userId,
    stripeSubscriptionId: s.stripeSubscriptionId,
    status: s.status,
    billingInterval: s.billingInterval,
    currentPeriodEnd: s.currentPeriodEnd,
  });
};

const updateSubscriptionByStripeId = async (
  stripeSubscriptionId: string,
  patch: Record<string, unknown>,
) => {
  const { error } = await supabase
    .from('subscriptions')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', stripeSubscriptionId)
    .eq('environment', mode);

  if (error) throw new Error(`Failed to update subscription: ${error.message}`);
};

const handleCheckoutSessionCompleted = async (event: Stripe.Event) => {
  const session = event.data.object as Stripe.Checkout.Session;
  const subscriptionId = typeof session.subscription === 'string'
    ? session.subscription
    : session.subscription?.id;

  if (!subscriptionId) {
    console.warn('[stripe-webhook] checkout_completed_missing_subscription', {
      eventId: event.id,
      sessionId: session.id,
    });
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['items.data.price.product'],
  });

  const userId = session.client_reference_id || session.metadata?.user_id || getUserIdFromSubscription(subscription);
  if (!userId) {
    console.error('[stripe-webhook] checkout_completed_missing_user_id', {
      eventId: event.id,
      sessionId: session.id,
      subscriptionId,
    });
    return;
  }

  await upsertSubscription(userId, subscription);
};

const handleSubscriptionUpdated = async (event: Stripe.Event) => {
  const sub = event.data.object as Stripe.Subscription;
  const userId = getUserIdFromSubscription(sub);
  if (userId) {
    await upsertSubscription(userId, sub);
    return;
  }

  await updateSubscriptionByStripeId(sub.id, {
    status: sub.status,
    billing_interval: sub.items.data[0]?.price?.recurring?.interval ?? null,
    current_period_start: isoFromEpoch(sub.current_period_start),
    current_period_end: isoFromEpoch(sub.current_period_end),
    cancel_at_period_end: sub.cancel_at_period_end,
    price_id: sub.items.data[0]?.price?.id ?? null,
    product_id: typeof sub.items.data[0]?.price?.product === 'string'
      ? sub.items.data[0].price.product
      : (sub.items.data[0]?.price?.product as Stripe.Product | null)?.id || null,
  });

  console.info('[stripe-webhook] subscription_updated_without_user_meta', {
    eventId: event.id,
    subscriptionId: sub.id,
  });
};

const handleSubscriptionDeleted = async (event: Stripe.Event) => {
  const sub = event.data.object as Stripe.Subscription;
  await updateSubscriptionByStripeId(sub.id, {
    status: sub.status || 'canceled',
    cancel_at_period_end: true,
    current_period_end: isoFromEpoch(sub.current_period_end),
  });

  console.info('[stripe-webhook] subscription_deleted', {
    eventId: event.id,
    subscriptionId: sub.id,
    status: sub.status,
  });
};

const handleInvoicePaymentFailed = async (event: Stripe.Event) => {
  const invoice = event.data.object as Stripe.Invoice;
  const stripeSubscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : invoice.subscription?.id;

  if (!stripeSubscriptionId) {
    console.warn('[stripe-webhook] invoice_payment_failed_missing_subscription', {
      eventId: event.id,
      invoiceId: invoice.id,
    });
    return;
  }

  await updateSubscriptionByStripeId(stripeSubscriptionId, {
    status: 'past_due',
  });

  console.info('[stripe-webhook] invoice_payment_failed', {
    eventId: event.id,
    invoiceId: invoice.id,
    subscriptionId: stripeSubscriptionId,
  });
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: { code: 'method_not_allowed', message: 'Method not allowed' } }, 405);

  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) return json({ error: { code: 'missing_signature', message: 'Missing Stripe signature' } }, 400);

    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(body, signature, getWebhookSecret());

    console.info('[stripe-webhook] incoming', { eventId: event.id, type: event.type, mode });

    const shouldProcess = await recordEvent(event);
    if (!shouldProcess) return json({ received: true, duplicate: true }, 200);

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event);
        break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event);
        break;
      default:
        console.info('[stripe-webhook] unhandled_event', { eventId: event.id, type: event.type });
        break;
    }

    return json({ received: true }, 200);
  } catch (err) {
    if (err instanceof Error) {
      console.error('[stripe-webhook] error', { message: err.message, stack: err.stack });
      return json({ error: { code: 'webhook_failed', message: err.message } }, 400);
    }

    console.error('[stripe-webhook] unknown_error', err);
    return json({ error: { code: 'webhook_failed', message: 'Webhook failed' } }, 400);
  }
});
