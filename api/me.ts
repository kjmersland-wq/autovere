import type { IncomingMessage, ServerResponse } from "node:http";
import Stripe from "stripe";

type Request = IncomingMessage;
type Response = ServerResponse & { status: (code: number) => Response; json: (body: unknown) => void };

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.cookie;
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

function getStripe(): Stripe | null {
  const secret = process.env["STRIPE_SECRET_KEY"];
  return secret ? new Stripe(secret) : null;
}

const planByEnv: Record<string, { label: string; tier: "pro" | "business" }> = {
  STRIPE_PRO_MONTHLY_PRICE_ID: { label: "AutoVere Pro", tier: "pro" },
  STRIPE_PRO_YEARLY_PRICE_ID: { label: "AutoVere Pro", tier: "pro" },
  STRIPE_BUSINESS_MONTHLY_PRICE_ID: { label: "AutoVere Business", tier: "business" },
  STRIPE_BUSINESS_YEARLY_PRICE_ID: { label: "AutoVere Business", tier: "business" },
};

function planForPriceId(priceId: string | undefined): { label: string; tier: "pro" | "business" } | null {
  if (!priceId) return null;
  for (const [envName, plan] of Object.entries(planByEnv)) {
    if (process.env[envName] === priceId) return plan;
  }
  return null;
}

export default async function handler(request: Request, response: Response) {
  if (request.method !== "GET") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
  const email = readCookie(request, "autovere_user");
  if (!email) {
    response.status(401).json({ error: "Not logged in" });
    return;
  }

  const stripe = getStripe();
  if (!stripe) {
    response.status(200).json({ email, subscription: null });
    return;
  }

  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) {
      response.status(200).json({ email, subscription: null });
      return;
    }
    const subscriptions = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 5 });
    const active = subscriptions.data.find((s) => s.status === "active" || s.status === "trialing");
    if (!active) {
      response.status(200).json({ email, subscription: null });
      return;
    }
    const price = active.items.data[0]?.price;
    const plan = planForPriceId(price?.id);
    const periodEndRaw = (active as unknown as { current_period_end?: number }).current_period_end ?? active.items.data[0]?.current_period_end ?? null;
    const renewsAt = periodEndRaw ? new Date(periodEndRaw * 1000).toISOString() : null;

    let paymentMethod: { brand: string; last4: string } | null = null;
    const defaultPm = !("deleted" in customer) ? customer.invoice_settings?.default_payment_method : undefined;
    const pmId = typeof defaultPm === "string" ? defaultPm : active.default_payment_method;
    if (typeof pmId === "string") {
      try {
        const pm = await stripe.paymentMethods.retrieve(pmId);
        if (pm.card) paymentMethod = { brand: pm.card.brand, last4: pm.card.last4 };
      } catch {
        paymentMethod = null;
      }
    }

    let invoices: { id: string; amount: number; currency: string; date: string; url: string | null }[] = [];
    try {
      const invoiceList = await stripe.invoices.list({ customer: customer.id, limit: 5 });
      invoices = invoiceList.data.map((invoice) => ({
        id: invoice.id ?? invoice.number ?? "",
        amount: invoice.amount_paid / 100,
        currency: invoice.currency.toUpperCase(),
        date: new Date(invoice.created * 1000).toISOString(),
        url: invoice.hosted_invoice_url ?? null,
      }));
    } catch {
      invoices = [];
    }

    response.status(200).json({
      email,
      subscription: {
        status: active.status,
        plan: plan?.label ?? price?.nickname ?? price?.id ?? "AutoVere",
        tier: plan?.tier ?? null,
        interval: price?.recurring?.interval ?? null,
        cancelAtPeriodEnd: active.cancel_at_period_end,
        renewsAt,
        paymentMethod,
        invoices,
      },
    });
  } catch (error) {
    console.error("Fetching subscription status failed", error);
    response.status(200).json({ email, subscription: null });
  }
}
