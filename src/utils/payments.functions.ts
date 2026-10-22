import { createServerFn } from '@tanstack/react-start';
import type Stripe from 'stripe';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { createStripeClient, getStripeErrorMessage } from '@/lib/stripe.server';
import { PURCHASES_ENABLED, purchasesPausedMessage } from '@/lib/purchases';
import { PAYMENT_PLANS } from '@/lib/payment-plans';
const environment = z.enum(['sandbox', 'live']);
function safeReturnUrl(value: string) {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || !(url.hostname === 'localhost' || url.hostname === 'autovere.com' || url.hostname === 'www.autovere.com' || url.hostname.endsWith('.lovable.app'))) throw new Error('Invalid return URL');
  return value;
}
async function resolveOrCreateCustomer(stripe: ReturnType<typeof createStripeClient>, options: { email?: string | undefined; userId?: string | undefined }): Promise<string> {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) throw new Error('Invalid userId');
  if (options.userId) {
    const found = await stripe.customers.search({ query: `metadata['userId']:'${options.userId}'`, limit: 1 });
    const match = found.data[0];
    if (match) return match.id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    const customer = existing.data[0];
    if (customer) {
      if (options.userId && customer.metadata?.['userId'] !== options.userId) await stripe.customers.update(customer.id, { metadata: { ...customer.metadata, userId: options.userId } });
      return customer.id;
    }
  }
  const created = await stripe.customers.create({ ...(options.email && { email: options.email }), ...(options.userId && { metadata: { userId: options.userId } }) });
  return created.id;
}
export const createCheckoutSession = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ priceId: z.enum(['trip_pass', 'pro_monthly', 'pro_yearly', 'business_monthly']), environment, returnUrl: z.string().url() }).parse(input))
  .handler(async ({ data, context }): Promise<{ clientSecret: string } | { error: string }> => {
    if (!PURCHASES_ENABLED) return { error: purchasesPausedMessage() };
    try {
      safeReturnUrl(data.returnUrl);
      const { data: { user }, error: authError } = await context.supabase.auth.getUser();
      if (authError || !user) throw new Error('Please sign in to buy a plan.');
      const stripe = createStripeClient(data.environment);
      const prices = await stripe.prices.list({ lookup_keys: [data.priceId], active: true, limit: 1 });
      const price = prices.data[0];
      const plan = Object.values(PAYMENT_PLANS).find(p => p.priceId === data.priceId);
      if (!price || !plan || price.unit_amount !== plan.amount || price.currency !== plan.currency) throw new Error('The payment price does not match your selected plan.');
      const customer = await resolveOrCreateCustomer(stripe, { userId: context.userId, email: user.email });
      const recurring = price.type === 'recurring';
      if (recurring) {
        const subs = await stripe.subscriptions.list({ customer, status: 'all', limit: 100 });
        if (subs.data.some(s => ['active', 'trialing', 'past_due'].includes(s.status))) return { error: 'You already have a subscription. Use Manage subscription to change your plan.' };
      }
      const product = await stripe.products.retrieve(typeof price.product === 'string' ? price.product : price.product.id);
      const metadata = { userId: context.userId, site: 'autovere.com', priceId: data.priceId, managed_payments: 'true' };
      const params = {
        line_items: [{ price: price.id, quantity: 1 }], mode: recurring ? 'subscription' : 'payment',
        ui_mode: 'embedded_page' as const, return_url: data.returnUrl, customer, metadata,
        managed_payments: { enabled: true },
        ...(recurring ? { subscription_data: { metadata } } : { payment_intent_data: { description: product.name, metadata } }),
      };
      const session = await stripe.checkout.sessions.create(params as Stripe.Checkout.SessionCreateParams);
      if (!session.client_secret) throw new Error('Checkout did not return a payment form.');
      return { clientSecret: session.client_secret };
    } catch (error) { return { error: getStripeErrorMessage(error) }; }
  });
export const createPortalSession = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ environment, returnUrl: z.string().url() }).parse(input))
  .handler(async ({ data, context }): Promise<{ url: string } | { error: string }> => {
    try {
      safeReturnUrl(data.returnUrl);
      const stripe = createStripeClient(data.environment);
      const found = await stripe.customers.search({ query: `metadata['userId']:'${context.userId}'`, limit: 1 });
      const customer = found.data[0];
      if (!customer) return { error: 'No Stripe purchases found. Existing Paddle subscriptions must be managed through the link in your Paddle receipt.' };
      return { url: (await stripe.billingPortal.sessions.create({ customer: customer.id, return_url: data.returnUrl })).url };
    } catch (error) { return { error: getStripeErrorMessage(error) }; }
  });
export const getCheckoutStatus = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ environment, sessionId: z.string().regex(/^cs_(test_|live_)?[a-zA-Z0-9]+$/) }).parse(input))
  .handler(async ({ data, context }): Promise<{ paid: boolean; status: string | null } | { error: string }> => {
    try {
      const session = await createStripeClient(data.environment).checkout.sessions.retrieve(data.sessionId);
      if (session.metadata?.['userId'] !== context.userId) return { error: 'This checkout belongs to another account.' };
      return { paid: session.status === 'complete' && ['paid', 'no_payment_required'].includes(session.payment_status), status: session.payment_status };
    } catch (error) { return { error: getStripeErrorMessage(error) }; }
  });
export const purchasesStatus = createServerFn({ method: 'GET' }).handler(async () => ({ enabled: PURCHASES_ENABLED, message: PURCHASES_ENABLED ? null : purchasesPausedMessage() }));
