/**
 * Creem — client-side helpers.
 *
 * Creem checkout is a hosted page: the server creates a checkout session and
 * the browser redirects to its URL. No client SDK or client token is needed,
 * so no payment secret ever reaches the browser.
 *
 * The four products already exist in the Creem dashboard — their product IDs
 * live in CREEM_PRODUCT_IDS below (public identifiers, safe to ship).
 */

import { createCreemCheckout } from "@/utils/payments.functions";

/** Internal plan keys → Creem product IDs (from the Creem dashboard). */
export const CREEM_PRODUCT_IDS = {
  tripPass: "prod_5oIdIcxA00n5E79gffx0IE",
  proMonthly: "prod_1vbuuUav24ivm7TpW9LYlN",
  proYearly: "prod_3PMg4d9p2dFbMFAkr50WIQ",
  businessMonthly: "prod_7CWrWV0MC3fBRNTnhDDLwo",
} as const;

export type CreemProductKey = keyof typeof CREEM_PRODUCT_IDS;

export type PlanTier = "free" | "tripPass" | "pro" | "fleet";

/** Reverse map: Creem product ID → internal plan key (used by the webhook). */
export function planKeyForProductId(productId: string | null | undefined): CreemProductKey | null {
  if (!productId) return null;
  for (const [key, id] of Object.entries(CREEM_PRODUCT_IDS)) {
    if (id === productId) return key as CreemProductKey;
  }
  return null;
}

export function tierForPriceId(priceId: string | null | undefined): PlanTier {
  if (!priceId) return "free";
  switch (priceId) {
    case "trip_pass":
    case "season_pass":
      return "tripPass";
    case "pro_monthly":
    case "pro_yearly":
      return "pro";
    case "business_monthly":
      return "fleet";
    default:
      return "free";
  }
}

export const TIER_RANK: Record<PlanTier, number> = { free: 0, tripPass: 1, pro: 2, fleet: 3 };

/** Canonical production origin — live checkout always returns to the public domain. */
const CANONICAL_ORIGIN = "https://www.autovere.com";

function siteOrigin(): string {
  if (typeof window === "undefined") return CANONICAL_ORIGIN;
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1" || host.endsWith(".lovable.app")) {
    return window.location.origin;
  }
  return CANONICAL_ORIGIN;
}

/** Region (/us, /ca) or language (/no, /de, …) prefix of the current path, or "". */
function activePrefix(): string {
  if (typeof window === "undefined") return "";
  const first = window.location.pathname.replace(/^\/+/, "").split("/")[0] ?? "";
  return ["us", "ca", "no", "se", "dk", "de", "nl", "fr", "pl"].includes(first) ? `/${first}` : "";
}

/** Absolute return URL after Creem checkout completes. */
export function checkoutReturnUrl(): string {
  return `${siteOrigin()}/checkout/return?session_id=creem&back=${encodeURIComponent(`${activePrefix()}/pricing`)}`;
}

/** Absolute return URL for the billing portal — keeps the active language/region. */
export function billingReturnUrl(): string {
  return `${siteOrigin()}${activePrefix()}/pricing`;
}

/**
 * Start a Creem checkout for one plan: the server creates the session
 * (bound to the signed-in user) and we redirect to the hosted checkout page.
 */
export async function openCreemCheckout(options: { productKey: CreemProductKey }): Promise<void> {
  const result = await createCreemCheckout({
    data: { productKey: options.productKey, successUrl: checkoutReturnUrl() },
  });
  if ("error" in result) throw new Error(result.error);
  window.location.href = result.url;
}
