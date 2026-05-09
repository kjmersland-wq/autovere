import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@16.9.0';
import { getStripe, getWebhookSecret, getBillingInterval, stripeEnvironment, toIso } from '../_shared/stripe.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const isPremiumStatus = (status: string, periodEndIso: string | null) => {
  const periodEnd = periodEndIso ? new Date(periodEndIso).getTime() : null;
  const now = Date.now();
  if (['active', 'trialing', 'past_due'].includes(status)) {
    return !periodEnd || periodEnd > now;
  }
  if (status === 'canceled') {
    return !!periodEnd && periodEnd > now;
  }
  return false;
};

const toPlanType = (billingInterval: 'month' | 'year' | null, premium: boolean) => {
  if (!premium) return 'free';
  if (billingInterval === 'month') return 'premium_monthly';
  if (billingInterval === 'year') return 'premium_yearly';
  return 'premium';
};

const pickUserId = async (
  subscription: Stripe.Subscription,
  customerId: string
): Promise<string | null> => {
  const fromMetadata = subscription.metadata?.supabase_user_id;
  if (fromMetadata) return fromMetadata;

  const { data: existing } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .maybeSingle();

  if (existing?.user_id) return existing.user_id;

  const { data: byCustomer } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (byCustomer?.user_id) return byCustomer.user_id;

  const stripe = getStripe();
  const customer = await stripe.customers.retrieve(customerId);
  if (!('deleted' in customer) && customer.metadata?.supabase_user_id) {
    return customer.metadata.supabase_user_id;
  }

  return null;
};

const upsertFromSubscription = async (subscription: Stripe.Subscription) => {
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
  const userId = await pickUserId(subscription, customerId);
  if (!userId) return;

  const price = subscription.items.data[0]?.price;
  const billingInterval = getBillingInterval(subscription);
  const status = subscription.status;
  const currentPeriodEnd = toIso(subscription.current_period_end);
  const premium = isPremiumStatus(status, currentPeriodEnd);
  const planType = toPlanType(billingInterval, premium);

  await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      subscription_status: status,
      status,
      current_period_end: currentPeriodEnd,
      billing_interval: billingInterval,
      price_id: price?.id ?? 'unknown_price',
      product_id: typeof price?.product === 'string' ? price.product : (price?.product?.id ?? 'unknown_product'),
      plan_type: planType,
      environment: stripeEnvironment(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_subscription_id' }
  );

  await supabase.from('profiles').upsert(
    {
      id: userId,
      is_premium: premium,
      subscription_status: status,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      current_period_end: currentPeriodEnd,
      plan_type: planType,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );
};

const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
  if (!session.subscription) return;
  const stripe = getStripe();
  const subscription = await stripe.subscriptions.retrieve(String(session.subscription));
  await upsertFromSubscription(subscription);
};

const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
  const userId = await pickUserId(subscription, customerId);
  const currentPeriodEnd = toIso(subscription.current_period_end);
  const premium = isPremiumStatus('canceled', currentPeriodEnd);
  await supabase
    .from('subscriptions')
    .update({
      subscription_status: 'canceled',
      status: 'canceled',
      current_period_end: currentPeriodEnd,
      plan_type: toPlanType(getBillingInterval(subscription), premium),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (userId) {
    await supabase
      .from('profiles')
      .update({
        is_premium: premium,
        subscription_status: 'canceled',
        current_period_end: currentPeriodEnd,
        plan_type: toPlanType(getBillingInterval(subscription), premium),
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
  }
};

const handlePaymentFailed = async (invoice: Stripe.Invoice) => {
  const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
  if (!subscriptionId) return;

  await supabase
    .from('subscriptions')
    .update({
      subscription_status: 'past_due',
      status: 'past_due',
      last_payment_error: invoice.last_finalization_error?.message ?? 'Payment failed',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);
};

const markEventProcessed = async (event: Stripe.Event): Promise<boolean> => {
  const { error } = await supabase
    .from('stripe_webhook_events')
    .insert({ id: event.id, event_type: event.type });

  if (!error) return true;
  if (error.code === '23505') return false;
  throw error;
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  const requestId = crypto.randomUUID();

  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) return new Response('Missing signature', { status: 400 });

    const body = await req.text();
    const stripe = getStripe();
    const event = await stripe.webhooks.constructEventAsync(body, signature, getWebhookSecret());
    console.info('stripe-webhook event received', {
      requestId,
      eventId: event.id,
      eventType: event.type,
    });

    const shouldProcess = await markEventProcessed(event);
    if (!shouldProcess) {
      console.info('stripe-webhook duplicate skipped', { requestId, eventId: event.id, eventType: event.type });
      return new Response(JSON.stringify({ received: true, idempotent: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        console.info('analytics_event', { requestId, name: 'checkout_completed', eventId: event.id });
        console.info('analytics_event', { requestId, name: 'premium_activated', eventId: event.id });
        break;
      case 'customer.subscription.created':
        await upsertFromSubscription(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.updated':
        await upsertFromSubscription(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        console.info('analytics_event', { requestId, name: 'subscription_cancelled', eventId: event.id });
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.info('stripe-webhook ignored event', { requestId, eventId: event.id, eventType: event.type });
        break;
    }

    console.info('stripe-webhook event processed', {
      requestId,
      eventId: event.id,
      eventType: event.type,
    });
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('stripe-webhook failed to process event', { requestId, error });
    return new Response('Failed to process webhook event', { status: 400 });
  }
});
