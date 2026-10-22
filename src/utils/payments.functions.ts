import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { gatewayFetch, getPaddleClient, type PaddleEnv } from "@/lib/paddle.server";
import { PURCHASES_ENABLED, purchasesPausedMessage } from "@/lib/purchases";

const environment = z.enum(["sandbox", "live"]);

function safeReturnUrl(value: string) {
  const url = new URL(value);
  const host = url.hostname;
  if (!(host === "localhost" || host === "127.0.0.1" || host === "autovere.com" || host === "www.autovere.com" || host.endsWith(".lovable.app")) || !["https:", "http:"].includes(url.protocol)) throw new Error("Invalid return URL");
  return value;
}

// Resolves a human-readable price ID (e.g. "pro_monthly") to the provider's
// internal price ID for the current environment.
export const resolvePaddlePrice = createServerFn({ method: "GET" })
  .inputValidator((data: { priceId: string; environment: PaddleEnv }) => data)
  .handler(async ({ data }) => {
    const response = await gatewayFetch(data.environment, `/prices?external_id=${encodeURIComponent(data.priceId)}`);
    const result = await response.json();
    if (!result.data?.length) throw new Error("Price not found");
    return result.data[0].id as string;
  });

export const createPortalSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ environment, returnUrl: z.string().url() }).parse(input))
  .handler(async ({ data, context }): Promise<{ url: string } | { error: string }> => {
    try {
      safeReturnUrl(data.returnUrl);
      const { data: rows, error } = await context.supabase
        .from("subscriptions")
        .select("payment_customer_id, payment_subscription_id")
        .eq("user_id", context.userId)
        .eq("environment", data.environment)
        .order("created_at", { ascending: false })
        .limit(1);
      if (error) throw error;
      const row = rows?.[0];
      if (!row?.payment_customer_id) return { error: "No subscription found for this account in this payment environment." };
      const paddle = getPaddleClient(data.environment);
      const portal = await paddle.customerPortalSessions.create(
        row.payment_customer_id,
        row.payment_subscription_id ? [row.payment_subscription_id] : [],
      );
      const url = portal.urls.general.overview;
      if (!url) throw new Error("Customer portal could not be opened.");
      return { url };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Customer portal could not be opened." };
    }
  });

export const getCheckoutStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ environment, transactionId: z.string().regex(/^txn_[a-zA-Z0-9]+$/) }).parse(input))
  .handler(async ({ data, context }): Promise<{ paid: boolean; status: string | null } | { error: string }> => {
    try {
      const response = await gatewayFetch(data.environment, `/transactions/${data.transactionId}`);
      if (!response.ok) throw new Error("Transaction not found");
      const result = await response.json();
      const transaction = result.data;
      if (transaction?.custom_data?.userId !== context.userId) return { error: "This checkout belongs to another account." };
      const status: string | null = transaction?.status ?? null;
      return { paid: status === "completed" || status === "paid", status };
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Payment could not be confirmed." };
    }
  });

export const purchasesStatus = createServerFn({ method: "GET" }).handler(async () => ({ enabled: PURCHASES_ENABLED, message: PURCHASES_ENABLED ? null : purchasesPausedMessage() }));
