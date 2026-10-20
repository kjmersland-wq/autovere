import { createServerFn } from "@tanstack/react-start";
import type Stripe from "stripe";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createStripeClient, getStripeErrorMessage } from "@/lib/stripe.server";
import { PAYMENT_PLANS, subscriptionIsActive } from "@/lib/payment-plans";
import { PURCHASES_ENABLED, purchasesPausedMessage } from "@/lib/purchases";
const environment = z.enum(["sandbox", "live"]);
const productKey = z.enum(["tripPass", "proMonthly", "proYearly", "businessMonthly"]);
function safeReturnUrl(value: string) {
  const url = new URL(value);
  const host = url.hostname;
  if (!(host === "localhost" || host === "127.0.0.1" || host === "autovere.com" || host === "www.autovere.com" || host.endsWith(".lovable.app")) || !["https:", "http:"].includes(url.protocol)) throw new Error("Invalid return URL");
  return value;
}
async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string | undefined; userId?: string | undefined },
): Promise<string> {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) throw new Error("Invalid userId");
  if (options.userId) {
    const found = await stripe.customers.search({ query: `metadata['userId']:'${options.userId}'`, limit: 1 });
    const matched = found.data[0];
    if (matched) return matched.id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    const customer = existing.data[0];
    if (customer) {
      if (options.userId && customer.metadata?.["userId"] !== options.userId) {
        await stripe.customers.update(customer.id, { metadata: { ...customer.metadata, userId: options.userId } });
      }
      return customer.id;
    }
  }
  const created = await stripe.customers.create({ ...(options.email && { email: options.email }), ...(options.userId && { metadata: { userId: options.userId } }) });
  return created.id;
}
export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ productKey, environment, returnUrl: z.string().url() }).parse(input))
  .handler(async ({ data, context }): Promise<{ clientSecret: string } | { error: string }> => {
    if (!PURCHASES_ENABLED) return { error: purchasesPausedMessage() };
    try {
      const plan = PAYMENT_PLANS[data.productKey];
      const returnUrl = safeReturnUrl(data.returnUrl);
      const { data: existing, error } = await context.supabase.from("subscriptions").select("status,current_period_end,price_id").eq("user_id", context.userId).eq("environment", data.environment).in("price_id", data.productKey.startsWith("pro") ? ["pro_monthly", "pro_yearly"] : [plan.priceId]);
      if (error) throw error;
      if (plan.interval && existing?.some(row => subscriptionIsActive(row))) return { error: "You already have this subscription. Use Manage subscription to change your plan." };
      const stripe = createStripeClient(data.environment);
      const prices = await stripe.prices.list({ lookup_keys: [plan.priceId], active: true, limit: 1 });
      const price = prices.data[0];
      if (!price) throw new Error("This plan is not configured for checkout yet.");
      if (price.unit_amount !== plan.amount || price.currency !== plan.currency || (price.recurring?.interval ?? null) !== plan.interval) throw new Error("The configured price does not match this plan.");
      const { data: auth } = await context.supabase.auth.getUser();
      const customer = await resolveOrCreateCustomer(stripe, { userId: context.userId, email: auth.user?.email });
      const product = await stripe.products.retrieve(typeof price.product === "string" ? price.product : price.product.id);
      const metadata = { userId: context.userId, site: "autovere.com", plan: plan.priceId };
      const params: Stripe.Checkout.SessionCreateParams & { managed_payments: { enabled: boolean } } = {
        line_items: [{ price: price.id, quantity: 1 }],
        mode: plan.interval ? "subscription" : "payment",
        ui_mode: "embedded_page",
        return_url: returnUrl,
        customer,
        metadata,
        managed_payments: { enabled: true },
        ...(plan.interval ? { subscription_data: { metadata } } : { payment_intent_data: { description: product.name, metadata } }),
      };
      const session = await stripe.checkout.sessions.create(params);
      if (!session.client_secret) throw new Error("Payment form could not be started.");
      return { clientSecret: session.client_secret };
    } catch (error) { return { error: getStripeErrorMessage(error) }; }
  });
export const createPortalSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ environment, returnUrl: z.string().url() }).parse(input))
  .handler(async ({ data, context }): Promise<{ url: string } | { error: string }> => {
    try {
      const stripe = createStripeClient(data.environment);
      const customers = await stripe.customers.search({ query: `metadata['userId']:'${context.userId}'`, limit: 1 });
      const customer = customers.data[0];
      if (!customer) return { error: "No subscription found for this account in this payment environment." };
      const portal = await stripe.billingPortal.sessions.create({ customer: customer.id, return_url: safeReturnUrl(data.returnUrl) });
      return { url: portal.url };
    } catch (error) { return { error: getStripeErrorMessage(error) }; }
  });
export const getCheckoutStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ environment, sessionId: z.string().regex(/^cs_[a-zA-Z0-9_]+$/) }).parse(input))
  .handler(async ({ data, context }): Promise<{ paid: boolean; status: string | null } | { error: string }> => {
    try {
      const session = await createStripeClient(data.environment).checkout.sessions.retrieve(data.sessionId);
      if (session.metadata?.["userId"] !== context.userId) return { error: "This checkout belongs to another account." };
      return { paid: session.payment_status === "paid" || session.payment_status === "no_payment_required", status: session.status };
    } catch (error) { return { error: getStripeErrorMessage(error) }; }
  });
export const purchasesStatus = createServerFn({ method: "GET" }).handler(async () => ({ enabled: PURCHASES_ENABLED, message: PURCHASES_ENABLED ? null : purchasesPausedMessage() }));
