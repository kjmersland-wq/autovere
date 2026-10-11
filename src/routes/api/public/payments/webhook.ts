/* eslint-disable @typescript-eslint/no-explicit-any -- Paddle event payloads stay loosely typed on purpose. */
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

import { passDays } from "@/lib/pass-durations";
import { verifyPaddleWebhook, type PaddleEnv } from "@/lib/paddle.server";

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

function mapStatus(status: string | undefined): string {
  switch (status) {
    case "active":
    case "trialing":
    case "past_due":
    case "paused":
      return status;
    case "canceled":
      return "canceled";
    default:
      return "active";
  }
}

/** Human-readable price id (external_id) set when the price was created. */
function priceExternalId(entity: any): string | undefined {
  return entity?.items?.[0]?.price?.import_meta?.external_id ?? undefined;
}

function productExternalId(entity: any): string | undefined {
  return (
    entity?.items?.[0]?.product?.import_meta?.external_id ??
    entity?.items?.[0]?.price?.product?.import_meta?.external_id ??
    undefined
  );
}

async function handleSubscription(subscription: any, env: PaddleEnv) {
  const userId = subscription.custom_data?.userId;
  if (!userId) {
    console.error("Paddle subscription without userId in custom_data:", subscription.id);
    return;
  }
  const priceId = priceExternalId(subscription);
  const productId = productExternalId(subscription);
  if (!priceId || !productId) {
    console.warn("Skipping subscription: missing importMeta.externalId", {
      rawPriceId: subscription.items?.[0]?.price?.id,
    });
    return;
  }
  const period = subscription.current_billing_period;
  await getSupabase()
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        provider: "paddle",
        stripe_subscription_id: "",
        stripe_customer_id: "",
        paddle_subscription_id: subscription.id,
        paddle_customer_id: subscription.customer_id ?? "",
        product_id: productId,
        price_id: priceId,
        status: mapStatus(subscription.status),
        current_period_start: period?.starts_at ?? null,
        current_period_end: period?.ends_at ?? null,
        cancel_at_period_end: subscription.scheduled_change?.action === "cancel",
        environment: env,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "paddle_subscription_id" },
    );
}

async function handleSubscriptionCanceled(subscription: any, env: PaddleEnv) {
  await getSupabase()
    .from("subscriptions")
    .update({ status: "canceled", updated_at: new Date().toISOString() })
    .eq("paddle_subscription_id", subscription.id)
    .eq("environment", env);
}

/**
 * One-time passes (Trip Pass) arrive as completed transactions without a
 * subscription. Record a time-limited row so the buyer gets access.
 * Safe to receive twice: the transaction id is the unique key.
 */
async function handleTransactionCompleted(transaction: any, env: PaddleEnv) {
  if (transaction.subscription_id) return; // recurring — handled by subscription events
  if (transaction.status !== "completed" && transaction.status !== "paid") return;
  const userId = transaction.custom_data?.userId;
  if (!userId) {
    console.error("Paddle transaction without userId in custom_data:", transaction.id);
    return;
  }
  const priceKey = priceExternalId(transaction);
  if (!priceKey) {
    console.warn("Skipping transaction: missing importMeta.externalId", {
      rawPriceId: transaction.items?.[0]?.price?.id,
    });
    return;
  }
  const days = passDays(priceKey);
  if (!days) {
    console.error("Paddle one-time purchase for a price with no pass duration:", priceKey);
    return;
  }
  const now = new Date();
  const end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const { error } = await getSupabase()
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        provider: "paddle",
        stripe_subscription_id: "",
        stripe_customer_id: "",
        paddle_subscription_id: transaction.id,
        paddle_customer_id: transaction.customer_id ?? "",
        product_id: productExternalId(transaction) ?? "unknown",
        price_id: priceKey,
        status: "active",
        current_period_start: now.toISOString(),
        current_period_end: end.toISOString(),
        cancel_at_period_end: true,
        environment: env,
        updated_at: now.toISOString(),
      },
      { onConflict: "paddle_subscription_id" },
    );
  if (error) throw error;
}

export const Route = createFileRoute("/api/public/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const env: PaddleEnv = url.searchParams.get("env") === "live" ? "live" : "sandbox";
        try {
          const event = await verifyPaddleWebhook(request, env);
          switch (event.event_type) {
            case "subscription.created":
            case "subscription.updated":
            case "subscription.activated":
            case "subscription.resumed":
              await handleSubscription(event.data, env);
              break;
            case "subscription.canceled":
              await handleSubscriptionCanceled(event.data, env);
              break;
            case "transaction.completed":
            case "transaction.paid":
              await handleTransactionCompleted(event.data, env);
              break;
            default:
              console.log("Unhandled Paddle event:", event.event_type);
          }
          return Response.json({ received: true });
        } catch (e) {
          console.error("Paddle webhook error:", e);
          return new Response("Webhook error", { status: 400 });
        }
      },
    },
  },
});
