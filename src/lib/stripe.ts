import { loadStripe, type Stripe } from "@stripe/stripe-js";

type StripeEnv = "sandbox" | "live";

const clientToken = import.meta.env['VITE_PAYMENTS_CLIENT_TOKEN'] as string | undefined;

function paymentsEnvironment(): StripeEnv {
  if (clientToken?.startsWith("pk_test_")) return "sandbox";
  if (clientToken?.startsWith("pk_live_")) return "live";
  throw new Error(
    "Payments are not configured for this build. Complete payment go-live in your Lovable project to enable production checkout.",
  );
}

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    paymentsEnvironment();
    stripePromise = loadStripe(clientToken as string);
  }
  return stripePromise;
}

export function getStripeEnvironment(): StripeEnv {
  return paymentsEnvironment();
}

/** Human-readable price IDs registered with the payment provider. */
export const PRICE_IDS = {
  proMonthly: "pro_monthly",
  proYearly: "pro_yearly",
  businessMonthly: "business_monthly",
} as const;

export type PlanTier = "free" | "pro" | "fleet";

export function tierForPriceId(priceId: string | null | undefined): PlanTier {
  switch (priceId) {
    case PRICE_IDS.proMonthly:
    case PRICE_IDS.proYearly:
      return "pro";
    case PRICE_IDS.businessMonthly:
      return "fleet";
    default:
      return "free";
  }
}

export const TIER_RANK: Record<PlanTier, number> = { free: 0, pro: 1, fleet: 2 };

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

/** Absolute return URL after Stripe checkout completes. */
export function checkoutReturnUrl(): string {
  return `${siteOrigin()}/checkout/return?session_id={CHECKOUT_SESSION_ID}&back=${encodeURIComponent(
    `${activePrefix()}/pricing`,
  )}`;
}

/** Absolute return URL for the billing portal — keeps the active language/region. */
export function billingReturnUrl(): string {
  return `${siteOrigin()}${activePrefix()}/pricing`;
}
