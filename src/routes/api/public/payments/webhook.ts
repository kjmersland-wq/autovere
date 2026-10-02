/* eslint-disable @typescript-eslint/no-explicit-any -- Stripe objects span API versions (period fields moved from subscription to item), so they stay loosely typed on purpose. */
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

import { passDays } from "@/lib/pass-durations";
import { createStripeClient, type StripeEnv, verifyWebhook } from "@/lib/stripe.server";

let _supabase: ReturnType<typeof createClient<Database>> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient<Database>(process.env["SUPABASE_URL"]!, process.env["SUPABASE_SERVICE_ROLE_KEY"]!);
  }
  return _supabase;
}

function resolvePriceId(item: any): string {
  return (
    item?.price?.lookup_key || item?.price?.metadata?.lovable_external_id || item?.price?.id || "unknown"
  );
}

function isoFromUnix(seconds: number | null | undefined): string | null {
  return seconds ? new Date(seconds * 1000).toISOString() : null;
}

async function handleSubscriptionCreated(subscription: any, env: StripeEnv) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error("No userId in subscription metadata");
    return;
  }
  const item = subscription.items?.data?.[0];
  const periodStart = item?.current_period_start ?? subscription.current_period_start;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;

  await getSupabase()
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        product_id: item?.price?.product ?? "unknown",
        price_id: resolvePriceId(item),
        status: subscription.status,
        current_period_start: isoFromUnix(periodStart),
        current_period_end: isoFromUnix(periodEnd),
        cancel_at_period_end: subscription.cancel_at_period_end || false,
        environment: env,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_subscription_id" },
    );
}

async function handleSubscriptionUpdated(subscription: any, env: StripeEnv) {
  const item = subscription.items?.data?.[0];
  const periodStart = item?.current_period_start ?? subscription.current_period_start;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;

  await getSupabase()
    .from("subscriptions")
    .update({
      status: subscription.status,
      product_id: item?.price?.product ?? "unknown",
      price_id: resolvePriceId(item),
      current_period_start: isoFromUnix(periodStart),
      current_period_end: isoFromUnix(periodEnd),
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);
}

async function handleSubscriptionDeleted(subscription: any, env: StripeEnv) {
  await getSupabase()
    .from("subscriptions")
    .update({ status: "canceled", updated_at: new Date().toISOString() })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);
}

/**
 * One-time passes (Trip Pass, season pass) are paid with mode "payment", so no subscription event
 * ever fires. Record the purchase as a time-limited row so the buyer actually gets access.
 * Safe to receive twice: the session id is the unique key.
 */
async function handleOneTimePurchase(session: any, env: StripeEnv) {
  if (session.mode !== "payment" || session.payment_status !== "paid") return;
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error("One-time purchase without userId in metadata:", session.id);
    return;
  }
  const stripe = createStripeClient(env);
  const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
  const price: any = items.data[0]?.price;
  if (!price) {
    console.error("One-time purchase without a line item:", session.id);
    return;
  }
  const priceKey = resolvePriceId({ price });
  const days = passDays(priceKey);
  if (!days) {
    console.error("One-time purchase for a price with no pass duration:", priceKey);
    return;
  }
  const now = new Date();
  const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const { error } = await getSupabase()
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        stripe_subscription_id: session.id,
        stripe_customer_id: typeof session.customer === "string" ? session.customer : (session.customer?.id ?? ""),
        product_id: typeof price.product === "string" ? price.product : (price.product?.id ?? "unknown"),
        price_id: priceKey,
        status: "active",
        current_period_start: now.toISOString(),
        current_period_end: end.toISOString(),
        cancel_at_period_end: true,
        environment: env,
        updated_at: now.toISOString(),
      },
      { onConflict: "stripe_subscription_id" },
    );
  if (error) throw error;
}

async function handleWebhook(req: Request, env: StripeEnv) {
  const event = await verifyWebhook(req, env);

  switch (event.type) {
    case "customer.subscription.created":
      await handleSubscriptionCreated(event.data.object, env);
      break;
    case "customer.subscription.updated":
      await handleSubscriptionUpdated(event.data.object, env);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event.data.object, env);
      break;
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.payment_status !== "unpaid") {
        console.log("Checkout completed for user:", session.metadata?.userId);
      }
      await handleOneTimePurchase(session, env);
      break;
    }
    case "checkout.session.async_payment_succeeded":
      await handleOneTimePurchase(event.data.object, env);
      break;
    case "checkout.session.async_payment_failed":
    case "invoice.paid":
      console.log("Payment event:", event.type);
      break;
    default:
      console.log("Unhandled event:", event.type);
  }
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawEnv = new URL(request.url).searchParams.get("env");
        if (rawEnv !== "sandbox" && rawEnv !== "live") {
          console.error("Webhook received with invalid env:", rawEnv);
          return Response.json({ received: true, ignored: "invalid env" });
        }
        try {
          await handleWebhook(request, rawEnv);
          return Response.json({ received: true });
        } catch (e) {
          console.error("Webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
