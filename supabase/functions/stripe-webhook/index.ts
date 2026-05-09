import { createClient } from 'npm:@supabase/supabase-js@2';
import { getStripeMode, verifyStripeWebhook } from '../_shared/stripe.ts';

let supabase: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabase) {
    supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
  }
  return supabase;
}

type StripeSubscription = {
  id: string;
  customer: string;
  status: string;
  cancel_at_period_end?: boolean;
  current_period_start?: number;
  current_period_end?: number;
  metadata?: Record<string, string | undefined>;
  items?: {
    data?: Array<{
      price?: {
        id?: string;
        product?: string;
      };
    }>;
  };
};

function toIso(value?: number) {
  return value ? new Date(value * 1000).toISOString() : null;
}

async function upsertSubscription(subscription: StripeSubscription) {
  const firstItem = subscription.items?.data?.[0];
  const userId = subscription.metadata?.user_id;
  const priceId = subscription.metadata?.price_id ?? firstItem?.price?.id;
  const productId = typeof firstItem?.price?.product === 'string' ? firstItem.price.product : null;

  if (!userId || !priceId || !productId) {
    console.warn('[payments] stripe subscription skipped', {
      reason: 'missing required metadata',
      subscriptionId: subscription.id,
      userId,
      priceId,
      productId,
    });
    return;
  }

  await getSupabase().from('subscriptions').upsert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer,
    product_id: productId,
    price_id: priceId,
    status: subscription.status,
    current_period_start: toIso(subscription.current_period_start),
    current_period_end: toIso(subscription.current_period_end),
    cancel_at_period_end: subscription.cancel_at_period_end ?? false,
    environment: getStripeMode(),
    updated_at: new Date().toISOString(),
  }, { onConflict: 'stripe_subscription_id' });
}

async function cancelSubscription(subscription: StripeSubscription) {
  await getSupabase().from('subscriptions')
    .update({
      status: 'canceled',
      cancel_at_period_end: true,
      current_period_start: toIso(subscription.current_period_start),
      current_period_end: toIso(subscription.current_period_end),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const event = await verifyStripeWebhook(req);
    console.info('[payments] webhook received', {
      provider: 'stripe',
      endpoint: 'stripe-webhook',
      mode: getStripeMode(),
      type: event.type,
    });

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await upsertSubscription(event.data.object as StripeSubscription);
        break;
      case 'customer.subscription.deleted':
        await cancelSubscription(event.data.object as StripeSubscription);
        break;
      default:
        console.info('[payments] webhook ignored', { provider: 'stripe', type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[payments] webhook error', error);
    return new Response('Webhook error', { status: 400 });
  }
});
