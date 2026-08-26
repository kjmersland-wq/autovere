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

const planLabelByEnv: Record<string, string> = {
  STRIPE_PRO_MONTHLY_PRICE_ID: "AutoVere Pro",
  STRIPE_PRO_YEARLY_PRICE_ID: "AutoVere Pro",
  STRIPE_BUSINESS_MONTHLY_PRICE_ID: "AutoVere Business",
  STRIPE_BUSINESS_YEARLY_PRICE_ID: "AutoVere Business",
};

function planLabelForPriceId(priceId: string | undefined): string | null {
  if (!priceId) return null;
  for (const [envName, label] of Object.entries(planLabelByEnv)) {
    if (process.env[envName] === priceId) return label;
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
    response.status(200).json({
      email,
      subscription: {
        status: active.status,
        plan: planLabelForPriceId(price?.id) ?? price?.nickname ?? price?.id ?? "AutoVere",
        interval: price?.recurring?.interval ?? null,
        cancelAtPeriodEnd: active.cancel_at_period_end,
      },
    });
  } catch (error) {
    console.error("Fetching subscription status failed", error);
    response.status(200).json({ email, subscription: null });
  }
}
