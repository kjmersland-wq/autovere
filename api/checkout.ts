import type { IncomingMessage, ServerResponse } from "node:http";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";

type CheckoutBody = { priceId?: unknown; locale?: unknown; partnerId?: unknown };
type VercelRequest = IncomingMessage & { body?: CheckoutBody | string };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => VercelResponse;
};

const supportedLocales = new Set(["en", "de", "nl", "no", "pl"]);
const priceEnvByKey: Record<string, string> = {
  "pro-monthly": "STRIPE_PRO_MONTHLY_PRICE_ID",
  "pro-yearly": "STRIPE_PRO_YEARLY_PRICE_ID",
  "business-monthly": "STRIPE_BUSINESS_MONTHLY_PRICE_ID",
  "business-yearly": "STRIPE_BUSINESS_YEARLY_PRICE_ID",
};

function getStripe() {
  const secret = process.env["STRIPE_SECRET_KEY"];
  return secret ? new Stripe(secret) : null;
}

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

type PartnerRow = {
  id: string;
  active: boolean;
  start_date: string | null;
  end_date: string | null;
  discount_percent: number;
  discount_code: string;
};

function isPartnerActiveNow(row: PartnerRow): boolean {
  if (!row.active) return false;
  const today = new Date().toISOString().slice(0, 10);
  if (row.start_date && today < row.start_date) return false;
  if (row.end_date && today > row.end_date) return false;
  return true;
}

async function resolvePartnerPromotionCode(stripe: Stripe, partnerId: string): Promise<string | null> {
  const databaseUrl = process.env["DATABASE_URL"];
  if (!databaseUrl) return null;
  try {
    const sql = neon(databaseUrl);
    const rows = (await sql`SELECT id, active, start_date, end_date, discount_percent, discount_code FROM partners WHERE id = ${partnerId.toUpperCase()}`) as PartnerRow[];
    const partner = rows[0];
    if (!partner || !isPartnerActiveNow(partner)) return null;

    const existing = await stripe.promotionCodes.list({ code: partner.discount_code, active: true, limit: 1 });
    const found = existing.data[0];
    if (found) return found.id;

    const coupon = await stripe.coupons.create({ percent_off: partner.discount_percent, duration: "forever", name: `${partner.id} member benefit` });
    const promotionCode = await stripe.promotionCodes.create({ coupon: coupon.id, code: partner.discount_code });
    return promotionCode.id;
  } catch (error) {
    console.error("Resolving partner discount failed", error);
    return null;
  }
}

function siteUrl(request: VercelRequest): string {
  const configuredUrl = process.env["NEXT_PUBLIC_SITE_URL"] ?? process.env["NEXTAUTH_URL"];
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");
  const host = request.headers.host ?? process.env["VERCEL_URL"] ?? "localhost:3000";
  return `${host.includes("localhost") ? "http" : "https"}://${host}`;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
  const stripe = getStripe();
  if (!stripe) {
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
    await stripe.prices.retrieve(priceId);
    const stripeLocale = locale === "no" ? "nb" : locale;
    const partnerId = typeof body.partnerId === "string" ? body.partnerId.trim() : "";
    const promotionCodeId = partnerId ? await resolvePartnerPromotionCode(stripe, partnerId) : null;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      locale: stripeLocale as Stripe.Checkout.SessionCreateParams.Locale,
      success_url: "https://autovere.com/pricing?success=true",
      cancel_url: "https://autovere.com/pricing?canceled=true",
      billing_address_collection: "auto",
      metadata: { locale, plan: requestedPrice || "configured-price", ...(promotionCodeId ? { partnerId: partnerId.toUpperCase() } : {}) },
      ...(promotionCodeId ? { discounts: [{ promotion_code: promotionCodeId }] } : { allow_promotion_codes: true }),
    });
    if (!session.url) {
      response.status(500).json({ error: "Failed to create session URL" });
      return;
    }
    response.status(200).json({ url: session.url });
  } catch (error) {
    const stripeError = error as Stripe.errors.StripeError;
    console.error("Stripe Checkout session failed", {
      message: stripeError.message,
      type: stripeError.type,
      code: stripeError.code,
    });
    const statusCode = typeof stripeError.statusCode === "number" && stripeError.statusCode >= 400 && stripeError.statusCode < 500 ? stripeError.statusCode : 500;
    response.status(statusCode).json({ error: stripeError.message || "Could not start checkout." });
  }
}
