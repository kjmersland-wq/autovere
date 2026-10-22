import { createFileRoute } from '@tanstack/react-router';
import { verifyWebhook, createStripeClient } from '@/lib/stripe.server';
import { passDays } from '@/lib/pass-durations';
import { forwardToKmTechlabs } from '@/lib/km-techlabs.server';
const iso = (seconds: number | undefined | null) => seconds ? new Date(seconds * 1000).toISOString() : null;
const major = (amount: number | undefined | null, currency: string) => (amount ?? 0) / (['jpy','krw','vnd','bif','clp','djf','gnf','kmf','mga','pyg','rwf','ugx','vuv','xaf','xof','xpf'].includes(currency.toLowerCase()) ? 1 : ['bhd','jod','kwd','omr','tnd'].includes(currency.toLowerCase()) ? 1000 : 100);
export const Route = createFileRoute('/api/public/payments/webhook')({
  server: { handlers: { POST: async ({ request }) => {
    const env = new URL(request.url).searchParams.get('env');
    if (env !== 'sandbox' && env !== 'live') return new Response('Invalid environment', { status: 400 });
    let event: any;
    try { event = await verifyWebhook(request, env); }
    catch { return new Response('Invalid signature', { status: 400 }); }
    try {
      const { supabaseAdmin: db } = await import('@/integrations/supabase/client.server');
      const { data: processed, error: readError } = await db.from('payment_webhook_events').select('id').eq('id', event.id).eq('environment', env).maybeSingle();
      if (readError) throw readError;
      if (processed) return Response.json({ received: true });
      const stripe = createStripeClient(env);
      const writeSubscription = async (sub: any) => {
        const item = sub.items?.data?.[0];
        const userId = sub.metadata?.userId;
        const priceId = item?.price?.lookup_key ?? item?.price?.metadata?.['lovable_external_id'];
        if (!userId || !priceId) throw new Error('Missing subscription metadata');
        const { error } = await db.from('subscriptions').upsert({
          user_id: userId, provider: 'stripe', payment_subscription_id: sub.id,
          payment_customer_id: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
          product_id: typeof item.price.product === 'string' ? item.price.product : item.price.product.id,
          price_id: priceId, status: sub.status,
          current_period_start: iso(item.current_period_start ?? sub.current_period_start),
          current_period_end: iso(item.current_period_end ?? sub.current_period_end),
          cancel_at_period_end: sub.cancel_at_period_end ?? false, environment: env, updated_at: new Date().toISOString(),
        }, { onConflict: 'payment_subscription_id,environment' });
        if (error) throw error;
      };
      const writeLedger = async (row: { id: string; userId?: string | undefined; subscriptionId?: string | null; customerId?: string | null | undefined; email?: string | null; priceId?: string | null | undefined; amount: number; currency: string; status: string; created: number }) => {
        const { error } = await db.from('payment_transactions').upsert({
          id: row.id, environment: env, user_id: row.userId ?? null,
          subscription_id: row.subscriptionId ?? null, customer_id: row.customerId ?? null,
          customer_email: row.email ?? null, price_id: row.priceId ?? null,
          amount: major(row.amount, row.currency), currency: row.currency.toUpperCase(), status: row.status,
          billed_at: iso(row.created) ?? new Date(row.created * 1000).toISOString(),
        }, { onConflict: 'id,environment' });
        if (error) throw error;
      };
      const fulfill = async (session: any) => {
        if (!['paid', 'no_payment_required'].includes(session.payment_status)) return;
        const userId = session.metadata?.userId;
        if (!userId) throw new Error('Missing checkout user');
        if (session.mode === 'subscription') {
          const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
          if (!subscriptionId) throw new Error('Missing subscription');
          await writeSubscription(await stripe.subscriptions.retrieve(subscriptionId));
          return; // Invoice is the canonical payment record for subscription purchases.
        }
        const lines = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
        const price = lines.data[0]?.price;
        const priceId = price?.lookup_key ?? price?.metadata?.['lovable_external_id'] ?? session.metadata?.priceId;
        const days = passDays(priceId);
        if (!days) throw new Error('Unknown pass');
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
        const { error } = await db.from('subscriptions').upsert({
          user_id: userId, provider: 'stripe', payment_subscription_id: session.id,
          payment_customer_id: customerId, product_id: typeof price?.product === 'string' ? price.product : priceId,
          price_id: priceId, status: 'active', current_period_start: iso(session.created),
          current_period_end: new Date((session.created + days * 86400) * 1000).toISOString(),
          cancel_at_period_end: true, environment: env, updated_at: new Date().toISOString(),
        }, { onConflict: 'payment_subscription_id,environment', ignoreDuplicates: true });
        if (error) throw error;
        await writeLedger({ id: session.id, userId, customerId, email: session.customer_details?.email, priceId, amount: session.amount_total ?? 0, currency: session.currency ?? 'eur', status: 'paid', created: session.created });
        await forwardToKmTechlabs({ site: 'autovere.com', id: `${session.id}-payment`, type: 'payment', status: 'paid', amount: major(session.amount_total, session.currency), discount: major(session.total_details?.amount_discount, session.currency), currency: session.currency.toUpperCase(), customer: customerId ?? null, plan: priceId, environment: env, occurred_at: iso(event.created) ?? new Date().toISOString() });
      };
      const object = event.data.object;
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          // Read current state so out-of-order deliveries cannot reinstate canceled access.
          const sub = await stripe.subscriptions.retrieve(object.id);
          await writeSubscription(sub);
          if (event.type !== 'customer.subscription.updated') await forwardToKmTechlabs({
            site: 'autovere.com', id: event.id, type: event.type === 'customer.subscription.deleted' ? 'subscription_canceled' : 'subscription_created',
            status: sub.status, amount: 0, discount: 0, currency: sub.currency.toUpperCase(),
            customer: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
            plan: sub.items.data[0]?.price.lookup_key ?? null, environment: env, occurred_at: iso(event.created) ?? new Date().toISOString(),
          });
          break;
        }
        case 'checkout.session.completed':
        case 'checkout.session.async_payment_succeeded':
          await fulfill(await stripe.checkout.sessions.retrieve(object.id));
          break;
        case 'invoice.paid':
        case 'invoice.payment_failed': {
          const invoice = await stripe.invoices.retrieve(object.id);
          const subscription = invoice.parent?.subscription_details?.subscription;
          const subscriptionId = typeof subscription === 'string' ? subscription : subscription?.id;
          if (!subscriptionId) break;
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          await writeSubscription(sub);
          const paid = invoice.status === 'paid';
          await writeLedger({ id: invoice.id, userId: sub.metadata['userId'], customerId: typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id, subscriptionId, email: invoice.customer_email, priceId: sub.items.data[0]?.price.lookup_key, amount: invoice.amount_paid, currency: invoice.currency, status: paid ? 'paid' : 'failed', created: invoice.created });
          if (paid) await forwardToKmTechlabs({ site: 'autovere.com', id: `${invoice.id}-payment`, type: 'payment', status: 'paid', amount: major(invoice.amount_paid, invoice.currency), discount: major(invoice.total_discount_amounts?.reduce((sum, d) => sum + d.amount, 0), invoice.currency), currency: invoice.currency.toUpperCase(), customer: typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id ?? null, plan: sub.items.data[0]?.price.lookup_key ?? null, environment: env, occurred_at: iso(event.created) ?? new Date().toISOString() });
          break;
        }
        default: break;
      }
      const { error } = await db.from('payment_webhook_events').upsert({ id: event.id, environment: env, event_created: event.created }, { onConflict: 'id,environment', ignoreDuplicates: true });
      if (error) throw error;
      return Response.json({ received: true });
    } catch (error) {
      console.error('Payment event processing failed', event?.id, error);
      return new Response('Payment event processing failed', { status: 500 });
    }
  } } },
});
