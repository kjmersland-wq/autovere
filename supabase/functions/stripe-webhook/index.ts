import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@16.10.0';
import { getStripeClient, getStripeWebhookSecret } from '../_shared/stripe.ts';

type WebhookEventRow = {
  id: number;
  processed: boolean;
};

type SubscriptionUserLookup = {
  user_id: string;
};

const getServiceClient = () =>
  createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

const toIso = (unixTime: number | null | undefined): string | null =>
  unixTime ? new Date(unixTime * 1000).toISOString() : null;

const billingIntervalFromSubscription = (subscription: Stripe.Subscription): string | null =>
  subscription.items.data[0]?.price.recurring?.interval ?? null;

const extractUserIdFromMetadata = (metadata: Stripe.Metadata | null | undefined): string | null => {
  const value = metadata?.user_id;
  return typeof value === 'string' && value.length > 0 ? value : null;
};

const getExistingUserBySubscriptionId = async (subscriptionId: string): Promise<string | null> => {
  const serviceClient = getServiceClient();
  const { data, error } = await serviceClient
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscriptionId)
    .limit(1)
    .maybeSingle<SubscriptionUserLookup>();
  if (error) throw error;
  return data?.user_id ?? null;
};

const getExistingUserByCustomerId = async (customerId: string): Promise<string | null> => {
  const serviceClient = getServiceClient();
  const { data, error } = await serviceClient
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<SubscriptionUserLookup>();
  if (error) throw error;
  return data?.user_id ?? null;
};

const resolveUserIdForSubscription = async (
  stripe: Stripe,
  subscription: Stripe.Subscription,
): Promise<string | null> => {
  const metadataUserId = extractUserIdFromMetadata(subscription.metadata);
  if (metadataUserId) return metadataUserId;

  const userBySubscription = await getExistingUserBySubscriptionId(subscription.id);
  if (userBySubscription) return userBySubscription;

  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;

  const userByCustomer = await getExistingUserByCustomerId(customerId);
  if (userByCustomer) return userByCustomer;

  const customer = await stripe.customers.retrieve(customerId);
  if (!('deleted' in customer) || customer.deleted !== true) {
    const userFromCustomerMeta = extractUserIdFromMetadata(customer.metadata);
    if (userFromCustomerMeta) return userFromCustomerMeta;
  }

  return null;
};

const upsertSubscription = async (
  userId: string,
  subscription: Stripe.Subscription,
  livemode: boolean,
): Promise<void> => {
  const serviceClient = getServiceClient();
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;
  const firstItem = subscription.items.data[0];
  const priceId = firstItem?.price?.id ?? 'unknown';
  const productId = typeof firstItem?.price?.product === 'string'
    ? firstItem.price.product
    : firstItem?.price?.product?.id ?? 'unknown';
  const status = subscription.status;

  const { error } = await serviceClient.from('subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    subscription_status: status,
    status,
    billing_interval: billingIntervalFromSubscription(subscription),
    current_period_start: toIso(subscription.current_period_start),
    current_period_end: toIso(subscription.current_period_end),
    cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
    price_id: priceId,
    product_id: productId,
    environment: livemode ? 'live' : 'sandbox',
    updated_at: new Date().toISOString(),
  }, { onConflict: 'stripe_subscription_id' });
  if (error) throw error;
};

const markSubscriptionStatusByInvoice = async (
  subscriptionId: string,
  status: 'active' | 'past_due',
): Promise<void> => {
  const serviceClient = getServiceClient();
  const { error } = await serviceClient
    .from('subscriptions')
    .update({
      status,
      subscription_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);
  if (error) throw error;
};

const recordWebhookEvent = async (event: Stripe.Event): Promise<WebhookEventRow> => {
  const serviceClient = getServiceClient();
  const { data, error } = await serviceClient
    .from('stripe_webhook_events')
    .insert({
      event_id: event.id,
      event_type: event.type,
      livemode: event.livemode,
      payload: event as unknown as Record<string, unknown>,
      processed: false,
    })
    .select('id,processed')
    .single<WebhookEventRow>();

  if (!error && data) return data;

  if (error?.code === '23505') {
    const { data: existing, error: existingError } = await serviceClient
      .from('stripe_webhook_events')
      .select('id,processed')
      .eq('event_id', event.id)
      .limit(1)
      .single<WebhookEventRow>();
    if (existingError) throw existingError;
    return existing;
  }

  throw error;
};

const updateWebhookState = async (
  eventId: string,
  update: { processed: boolean; userId?: string | null; errorMessage?: string | null },
): Promise<void> => {
  const serviceClient = getServiceClient();
  const payload: Record<string, unknown> = {
    processed: update.processed,
    processed_at: update.processed ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
    error_message: update.errorMessage ?? null,
  };
  if (update.userId !== undefined) payload.user_id = update.userId;

  const { error } = await serviceClient
    .from('stripe_webhook_events')
    .update(payload)
    .eq('event_id', eventId);
  if (error) throw error;
};

const handleEvent = async (stripe: Stripe, event: Stripe.Event): Promise<string | null> => {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;
      const userId = session.client_reference_id
        ?? extractUserIdFromMetadata(session.metadata)
        ?? null;
      if (!subscriptionId || !userId) {
        throw new Error('Missing subscriptionId or userId in checkout.session.completed');
      }
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      await upsertSubscription(userId, subscription, event.livemode);
      return userId;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = await resolveUserIdForSubscription(stripe, subscription);
      if (!userId) throw new Error(`Unable to resolve user for subscription ${subscription.id}`);
      await upsertSubscription(userId, subscription, event.livemode);
      return userId;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = typeof invoice.subscription === 'string'
        ? invoice.subscription
        : invoice.subscription?.id;
      if (!subscriptionId) throw new Error('Missing subscription id in invoice.payment_failed');
      await markSubscriptionStatusByInvoice(subscriptionId, 'past_due');
      return null;
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = typeof invoice.subscription === 'string'
        ? invoice.subscription
        : invoice.subscription?.id;
      if (!subscriptionId) throw new Error('Missing subscription id in invoice.payment_succeeded');
      await markSubscriptionStatusByInvoice(subscriptionId, 'active');
      return null;
    }
    default:
      console.info('[stripe-webhook] unhandled event', { eventType: event.type, eventId: event.id });
      return null;
  }
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const requestId = crypto.randomUUID();
  const stripe = getStripeClient();

  let eventIdForFailure: string | null = null;

  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) throw new Error('Missing stripe-signature header');

    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(body, signature, getStripeWebhookSecret());
    eventIdForFailure = event.id;

    const eventRow = await recordWebhookEvent(event);
    if (eventRow.processed) {
      console.info('[stripe-webhook] duplicate processed event', {
        requestId,
        eventId: event.id,
        eventType: event.type,
      });
      return new Response(JSON.stringify({ received: true, duplicate: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = await handleEvent(stripe, event);
    await updateWebhookState(event.id, { processed: true, userId });

    console.info('[stripe-webhook] processed', {
      requestId,
      eventId: event.id,
      eventType: event.type,
      userId,
    });

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[stripe-webhook] failed', {
      requestId,
      eventId: eventIdForFailure,
      error: String(error),
    });
    if (eventIdForFailure) {
      await updateWebhookState(eventIdForFailure, {
        processed: false,
        errorMessage: String(error),
      }).catch((stateError) => {
        console.error('[stripe-webhook] failed to persist error state', {
          requestId,
          eventId: eventIdForFailure,
          stateError: String(stateError),
        });
      });
    }
    return new Response(JSON.stringify({ error: 'Webhook error' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
