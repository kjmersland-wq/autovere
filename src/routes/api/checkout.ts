import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";

type CheckoutBody = { priceId?: unknown; locale?: unknown };

const supportedLocales = new Set(["en", "de", "nl", "no", "pl"]);
const priceEnvByKey: Record<string, string> = {
  "pro-monthly": "STRIPE_PRO_MONTHLY_PRICE_ID",
  "pro-yearly": "STRIPE_PRO_YEARLY_PRICE_ID",
  "business-monthly": "STRIPE_BUSINESS_MONTHLY_PRICE_ID",
  "business-yearly": "STRIPE_BUSINESS_YEARLY_PRICE_ID",
};

export const Route = createFileRoute("/api/checkout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.STRIPE_SECRET_KEY;
        if (!secret) return Response.json({ error: "Stripe is not configured." }, { status: 500 });

        let body: CheckoutBody;
        try {
          body = (await request.json()) as CheckoutBody;
        } catch {
          return Response.json({ error: "Invalid JSON request body." }, { status: 400 });
        }

        const requestedPrice = typeof body.priceId === "string" ? body.priceId : "";
        const locale = typeof body.locale === "string" && supportedLocales.has(body.locale) ? body.locale : "en";
        const envName = priceEnvByKey[requestedPrice];
        const priceId = envName ? process.env[envName] : requestedPrice;
        const allowedPriceIds = Object.values(priceEnvByKey)
          .map((name) => process.env[name])
          .filter(Boolean);
        if (!priceId || (!envName && !allowedPriceIds.includes(priceId))) {
          return Response.json({ error: "Unknown Stripe price." }, { status: 400 });
        }

        try {
          const stripe = new Stripe(secret);
          await stripe.prices.retrieve(priceId);
          const stripeLocale = locale === "no" ? "nb" : locale;
          const success_url = "https://autovere.com/pricing?success=true";
          const cancel_url = "https://autovere.com/pricing?canceled=true";
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [{ price: priceId, quantity: 1 }],
            locale: stripeLocale as Stripe.Checkout.SessionCreateParams.Locale,
            success_url,
            cancel_url,
            allow_promotion_codes: true,
            billing_address_collection: "auto",
            metadata: { locale, plan: requestedPrice || "configured-price" },
          });
          if (!session.url) {
            return new Response(JSON.stringify({ error: "Failed to create session URL" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }
          return new Response(JSON.stringify({ url: session.url }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          const stripeError = error as Stripe.errors.StripeError;
          console.error("Stripe Checkout session failed", {
            message: stripeError.message,
            type: stripeError.type,
            code: stripeError.code,
          });
          const statusCode = typeof stripeError.statusCode === "number" && stripeError.statusCode >= 400 && stripeError.statusCode < 500 ? stripeError.statusCode : 500;
          return Response.json(
            { error: stripeError.message || "Could not start checkout." },
            { status: statusCode },
          );
        }
      },
    },
  },
});
