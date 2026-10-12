/* eslint-disable @typescript-eslint/no-explicit-any -- Creem event payloads stay loosely typed on purpose. */
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

import { planKeyForProductId } from "@/lib/creem";
import { verifyCreemWebhook, creemTestMode } from "@/lib/creem.server";
import { passDays } from "@/lib/pass-durations";
import { forwardToKmTechlabs } from "@/lib/km-techlabs.server";

let _supabase: ReturnType<typeof createClient<Database>> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient<Database>(
      process.env["SUPABASE_URL"]!,
      process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
    );
  }
  return _supabase;
}

const environment = () => (creemTestMode() ? "sandbox" : "live");

/** Internal plan key ("pro_monthly") from a Creem product id, or null. */
function planKeyFrom(entity: any): string | null {
  const productId =
    typeof entity?.product === "string" ? entity.product : (entity?.product?.id ?? entity?.product_id);
  const key = planKeyForProductId(productId);
  if (!key) return null;
  // Map client-side keys to the historical price keys stored in the database.
  return { tripPass: "trip_pass", proMonthly: "pro_monthly", proYearly: "pro_yearly", businessMonthly: "business_monthly" }[key] ?? null;
}

function userIdFrom(entity: any): string | undefined {
  return entity?.metadata?.userId ?? entity?.checkout?.metadata?.userId ?? undefined;
}

function customerIdFrom(entity: any): string {
  const c = entity?.customer;
  return (typeof c === "string" ? c : c?.id) ?? entity?.customer_id ?? "";
}

function mapStatus(status: string | undefined): string {
  switch (status) {
    case "active":
    case "trialing":
    case "past_due":
    case "paused":
      return status;
    case "canceled":
    case "scheduled_cancel":
      return "canceled";
    case "expired":
    case "unpaid":
      return "expired";
    default:
      return "active";
  }
}

/** subscription.active / paid / update / trialing / paused — upsert the row. */
async function handleSubscription(sub: any) {
  const userId = userIdFrom(sub);
  if (!userId) {
    console.error("Creem subscription without userId in metadata:", sub.id);
    return;
  }
  const priceKey = planKeyFrom(sub);
  if (!priceKey) {
    console.warn("Skipping subscription: unknown product", { product: sub.product });
    return;
  }
  await getSupabase()
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        provider: "creem",
        legacy_subscription_id: null,
        legacy_customer_id: null,
        creem_subscription_id: sub.id,
        creem_customer_id: customerIdFrom(sub),
        product_id: priceKey.replace(/_(monthly|yearly)$/, ""),
        price_id: priceKey,
        status: mapStatus(sub.status),
        current_period_start: sub.current_period_start_date ?? sub.current_period_start ?? null,
        current_period_end: sub.current_period_end_date ?? sub.current_period_end ?? null,
        cancel_at_period_end: sub.status === "scheduled_cancel" || sub.canceled_at != null,
        environment: environment(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "creem_subscription_id" },
    );
}

/** subscription.canceled / expired / unpaid — mark the existing row. */
async function handleSubscriptionEnded(sub: any) {
  await getSupabase()
    .from("subscriptions")
    .update({ status: mapStatus(sub.status), updated_at: new Date().toISOString() })
    .eq("creem_subscription_id", sub.id)
    .eq("environment", environment());
}

/**
 * checkout.completed for a one-time product (Trip Pass): record a
 * time-limited row. Idempotent — the checkout id is the unique key, so a
 * duplicate delivery cannot extend the pass.
 */
async function handleCheckoutCompleted(checkout: any) {
  const order = checkout?.order;
  if (!order || order.type === "recurring") return; // subscriptions handled by subscription.* events
  if (order.status !== "paid" && order.status !== "completed") return;

  const userId = userIdFrom(checkout) ?? userIdFrom(order);
  if (!userId) {
    console.error("Creem checkout without userId in metadata:", checkout.id);
    return;
  }
  const priceKey = planKeyFrom(order) ?? planKeyFrom(checkout);
  if (!priceKey) {
    console.warn("Skipping checkout: unknown product", { product: order.product });
    return;
  }
  const days = passDays(priceKey);
  if (!days) {
    console.error("Creem one-time purchase for a plan with no pass duration:", priceKey);
    return;
  }
  const now = new Date();
  const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const { error } = await getSupabase()
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        provider: "creem",
        legacy_subscription_id: null,
        legacy_customer_id: null,
        creem_subscription_id: checkout.id,
        creem_customer_id: customerIdFrom(order) || customerIdFrom(checkout),
        product_id: priceKey,
        price_id: priceKey,
        status: "active",
        current_period_start: now.toISOString(),
        current_period_end: end.toISOString(),
        cancel_at_period_end: true,
        environment: environment(),
        updated_at: now.toISOString(),
      },
      { onConflict: "creem_subscription_id" },
    );
  if (error) throw error;
}

/** refund.created — revoke access for the refunded order/subscription. */
async function handleRefund(refund: any) {
  const ref = refund?.subscription ?? refund?.order ?? refund?.transaction;
  if (!ref) return;
  await getSupabase()
    .from("subscriptions")
    .update({ status: "canceled", updated_at: new Date().toISOString() })
    .eq("creem_subscription_id", typeof ref === "string" ? ref : ref.id)
    .eq("environment", environment());
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const event = await verifyCreemWebhook(request);
          switch (event.eventType) {
            case "checkout.completed":
              await handleCheckoutCompleted(event.object);
              break;
            case "subscription.active":
            case "subscription.paid":
            case "subscription.update":
            case "subscription.trialing":
            case "subscription.paused":
            case "subscription.past_due":
            case "subscription.scheduled_cancel":
              await handleSubscription(event.object);
              break;
            case "subscription.canceled":
            case "subscription.expired":
            case "subscription.unpaid":
              await handleSubscriptionEnded(event.object);
              break;
            case "refund.created":
              await handleRefund(event.object);
              break;
            default:
              console.log("Unhandled Creem event:", event.eventType);
          }
          // Mirror every verified event to the KM TECH LABS accounting site.
          // Never throws, so a failed forward cannot trigger Creem retries.
          await forwardToKmTechlabs(event as any, environment());
          return Response.json({ received: true });
        } catch (e) {
          console.error("Creem webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
