import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { gatewayFetch, getPaddleErrorMessage, paddleApi, type PaddleEnv } from "@/lib/paddle.server";
import { PURCHASES_ENABLED, purchasesPausedMessage } from "@/lib/purchases";

type PortalSessionResult = { url: string } | { error: string };

/**
 * Resolve a human-readable price ID (external_id, e.g. "pro_monthly") to the
 * Paddle internal price ID (pri_...) required by Paddle.js checkout.
 */
export const resolvePaddlePrice = createServerFn({ method: "GET" })
  .validator((data: { priceId: string; environment: PaddleEnv }) => data)
  .handler(async ({ data }) => {
    const response = await gatewayFetch(
      data.environment,
      `/prices?external_id=${encodeURIComponent(data.priceId)}`,
    );
    const result = (await response.json()) as { data?: { id: string }[] };
    if (!result.data?.length) throw new Error(`Price not found: ${data.priceId}`);
    return result.data[0]!.id;
  });

/**
 * Checkout itself runs entirely client-side: the Paddle.js overlay opens with the
 * price ID and custom data (userId), and Paddle confirms the purchase via webhook.
 * This server function only creates a customer-portal session for managing an
 * existing Paddle subscription.
 */
export const createPortalSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { returnUrl?: string }) => data)
  .handler(async ({ data, context }): Promise<PortalSessionResult> => {
    const { supabase, userId } = context;

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("paddle_customer_id, environment")
      .eq("user_id", userId)
      .eq("provider", "paddle")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub?.paddle_customer_id) {
      return { error: "No Paddle subscription found for this account." };
    }

    try {
      const portal = await paddleApi<{
        urls: { general: { overview: string } };
      }>(sub.environment as PaddleEnv, `/customers/${sub.paddle_customer_id}/portal-sessions`, {
        method: "POST",
        body: {},
      });
      return { url: portal.urls.general.overview };
    } catch (error) {
      return { error: getPaddleErrorMessage(error) };
    }
  });

/** Guard used by client code before opening the Paddle overlay. */
export const purchasesStatus = createServerFn({ method: "GET" }).handler(async () => {
  return { enabled: PURCHASES_ENABLED, message: PURCHASES_ENABLED ? null : purchasesPausedMessage() };
});
