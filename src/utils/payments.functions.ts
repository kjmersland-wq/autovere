import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { CREEM_PRODUCT_IDS, type CreemProductKey } from "@/lib/creem";
import { creemApi, getCreemErrorMessage } from "@/lib/creem.server";
import { PURCHASES_ENABLED, purchasesPausedMessage } from "@/lib/purchases";

type CheckoutResult = { url: string } | { error: string };
type PortalSessionResult = { url: string } | { error: string };

/**
 * Create a Creem checkout session for the signed-in user and return the
 * hosted checkout URL. The user id is bound server-side via metadata so the
 * webhook can credit the right account — the client never supplies it.
 */
export const createCreemCheckout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { productKey: CreemProductKey; successUrl?: string; email?: string }) => data)
  .handler(async ({ data, context }): Promise<CheckoutResult> => {
    if (!PURCHASES_ENABLED) return { error: purchasesPausedMessage() };

    const productId = CREEM_PRODUCT_IDS[data.productKey];
    if (!productId) return { error: "This plan is not configured for checkout yet." };

    try {
      const checkout = await creemApi<{ checkout_url?: string; checkoutUrl?: string }>(
        "/checkouts",
        {
          method: "POST",
          body: {
            product_id: productId,
            request_id: `${context.userId}-${Date.now()}`,
            ...(data.successUrl ? { success_url: data.successUrl } : {}),
            ...(data.email ? { customer: { email: data.email } } : {}),
            metadata: { userId: context.userId, site: "autovere.com", plan: data.productKey },
          },
        },
      );
      const url = checkout.checkout_url ?? checkout.checkoutUrl;
      if (!url) return { error: "Creem did not return a checkout URL." };
      return { url };
    } catch (error) {
      return { error: getCreemErrorMessage(error) };
    }
  });

/**
 * Creem customer portal: generate a billing-portal link for the customer's
 * Creem customer id (stored on their subscription row by the webhook).
 */
export const createPortalSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { returnUrl?: string }) => data)
  .handler(async ({ context }): Promise<PortalSessionResult> => {
    const { supabase, userId } = context;

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("paddle_customer_id")
      .eq("user_id", userId)
      .eq("provider", "creem")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub?.paddle_customer_id) {
      return { error: "No Creem subscription found for this account." };
    }

    try {
      const portal = await creemApi<{ customer_portal_link?: string; customerPortalLink?: string }>(
        "/customers/billing",
        { method: "POST", body: { customer_id: sub.paddle_customer_id } },
      );
      const url = portal.customer_portal_link ?? portal.customerPortalLink;
      if (!url) return { error: "Creem did not return a portal link." };
      return { url };
    } catch (error) {
      return { error: getCreemErrorMessage(error) };
    }
  });

/** Guard used by client code before starting a checkout. */
export const purchasesStatus = createServerFn({ method: "GET" }).handler(async () => {
  return { enabled: PURCHASES_ENABLED, message: PURCHASES_ENABLED ? null : purchasesPausedMessage() };
});
