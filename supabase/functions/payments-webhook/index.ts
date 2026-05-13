import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14';
import { verifyWebhook, getStripeEnvironment, getStripeClient } from '../_shared/stripe.ts';

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
  }
  return _supabase;
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, env: string) {
  const userId = session.metadata?.userId;
  if (!userId) { console.error('No userId in session metadata'); return; }
  const subscriptionId = session.subscription as string;
  if (!subscriptionId) return;
  // Retrieve the full subscription so we have price_id / product_id (required NOT NULL columns).
  // This also means handleSubscriptionUpsert handles all the field mapping in one place.
  const stripe = getStripeClient();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await handleSubscriptionUpsert(subscription, env);
}

async function handleSubscriptionUpsert(subscription: Stripe.Subscription, env: string) {
  const userId = subscription.metadata?.userId;
  if (!userId) { console.error('No userId in subscription metadata'); return; }
  const item = subscription.items.data[0];
  const priceId = item?.price?.id ?? '';
  const product = item?.price?.product;
  const productId = typeof product === 'string' ? product : (product as Stripe.Product)?.id ?? '';
  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : (subscription.customer as Stripe.Customer)?.id ?? '';
  await getSupabase().from('subscriptions').upsert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: customerId,
    product_id: productId,
    price_id: priceId,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    environment: env,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'stripe_subscription_id' });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, env: string) {
  await getSupabase().from('subscriptions')
    .update({
      status: 'canceled',
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)
    .eq('environment', env);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice, env: string) {
  const subscriptionId = typeof invoice.subscription === 'string'
    ? invoice.subscription
    : (invoice.subscription as Stripe.Subscription)?.id;
  if (!subscriptionId) { console.error('[webhook] invoice.payment_failed: no subscription id'); return; }
  await getSupabase().from('subscriptions')
    .update({ status: 'past_due', updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', subscriptionId)
    .eq('environment', env);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const env = getStripeEnvironment();
  try {
    const event = await verifyWebhook(req);
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, env); break;
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpsert(event.data.object as Stripe.Subscription, env); break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, env); break;
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, env); break;
      default:
        console.log('Unhandled event:', event.type);
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Webhook error:', e);
    return new Response('Webhook error', { status: 400 });
  }
});
