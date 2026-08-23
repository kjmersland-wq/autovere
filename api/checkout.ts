import type { IncomingMessage, ServerResponse } from "node:http";
import Stripe from "stripe";

type CheckoutBody = { priceId?: unknown; locale?: unknown };
type VercelRequest = IncomingMessage & { body?: CheckoutBody | string };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => VercelResponse;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
const supportedLocales = new Set(["en", "de", "nl", "no", "pl"]);
const priceEnvByKey: Record<string, string> = {
  "pro-monthly": "STRIPE_PRO_MONTHLY_PRICE_ID",
  "pro-yearly": "STRIPE_PRO_YEARLY_PRICE_ID",
  "business-monthly": "STRIPE_BUSINESS_MONTHLY_PRICE_ID",
  "business-yearly": "STRIPE_BUSINESS_YEARLY_PRICE_ID",
};

function parseBody(body: VercelRequest["body"]): CheckoutBody {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as CheckoutBody;
    } catch {
      return {};
    }
  }
  return body ?? {};
}

function siteUrl(request: VercelRequest): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const host = request.headers.host ?? process.env.VERCEL_URL ?? "localhost:3000";
  return `${host.includes("localhost") ? "http" : "https"}://${host}`;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    response.status(500).json({ error: "Stripe is not configured." });
    return;
  }

  const body = parseBody(request.body);
  const requestedPrice = typeof body.priceId === "string" ? body.priceId : "";
  const locale = typeof body.locale === "string" && supportedLocales.has(body.locale) ? body.locale : "en";
  const envName = priceEnvByKey[requestedPrice];
  const priceId = envName ? process.env[envName] : requestedPrice;
  const allowedPriceIds = Object.values(priceEnvByKey).map((name) => process.env[name]).filter(Boolean);
  if (!priceId || (!envName && !allowedPriceIds.includes(priceId))) {
    response.status(400).json({ error: "Unknown Stripe price." });
    return;
  }

  try {
    const stripeLocale = locale === "no" ? "nb" : locale;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      locale: stripeLocale as Stripe.Checkout.SessionCreateParams.Locale,
      success_url: `${siteUrl(request)}/pricing?checkout=success&locale=${locale}`,
      cancel_url: `${siteUrl(request)}/pricing?checkout=cancelled&locale=${locale}`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: { locale, plan: requestedPrice || "configured-price" },
    });
    if (!session.url) throw new Error("Stripe did not return a Checkout URL");
    response.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout session failed", error);
    response.status(500).json({ error: "Could not start checkout." });
  }
}
