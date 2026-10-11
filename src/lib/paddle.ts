/**
 * Paddle Billing — client-side helpers.
 *
 * Uses Lovable's built-in payments connection. Products and prices are created
 * with human-readable IDs (external_id) that are stable across test and live;
 * the Paddle internal ID (pri_...) is resolved server-side at checkout time.
 *
 * New price = old Stripe price × (1 + PRICE_MARKUP), rounded to a pretty price.
 * Change PRICE_MARKUP in one place to adjust the markup rule.
 */

import { resolvePaddlePrice } from "@/utils/payments.functions";

/** Markup applied on top of the old Stripe prices when creating Paddle prices. */
export const PRICE_MARKUP = 0.02;

/** Internal lookup keys (= Paddle external_id) for each plan — stable across environments. */
export const PRICE_IDS = {
  tripPass: "trip_pass",
  /** One-time 90-day pass; entitlement is ready, the product still has to be created in Paddle. */
  seasonPass: "season_pass",
  proMonthly: "pro_monthly",
  proYearly: "pro_yearly",
  businessMonthly: "business_monthly",
} as const;

export type PaddleEnv = "sandbox" | "live";

const clientToken = import.meta.env["VITE_PAYMENTS_CLIENT_TOKEN"] as string | undefined;

export function getPaddleEnvironment(): PaddleEnv {
  if (!clientToken) {
    throw new Error("Payments are not configured for this build.");
  }
  return clientToken.startsWith("test_") ? "sandbox" : "live";
}

/** Resolve an internal lookup key to the Paddle internal price ID (pri_...). */
export async function paddlePriceId(lookupKey: string): Promise<string> {
  return resolvePaddlePrice({ data: { priceId: lookupKey, environment: getPaddleEnvironment() } });
}

export type PlanTier = "free" | "tripPass" | "pro" | "fleet";

export function tierForPriceId(priceId: string | null | undefined): PlanTier {
  if (!priceId) return "free";
  switch (priceId) {
    case PRICE_IDS.tripPass:
    case PRICE_IDS.seasonPass:
      return "tripPass";
    case PRICE_IDS.proMonthly:
    case PRICE_IDS.proYearly:
      return "pro";
    case PRICE_IDS.businessMonthly:
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

/** Absolute return URL after Paddle checkout completes. */
export function checkoutReturnUrl(): string {
  return `${siteOrigin()}/checkout/return?back=${encodeURIComponent(`${activePrefix()}/pricing`)}`;
}

/** Absolute return URL for the billing portal — keeps the active language/region. */
export function billingReturnUrl(): string {
  return `${siteOrigin()}${activePrefix()}/pricing`;
}

// ---------------------------------------------------------------------------
// Paddle.js (overlay checkout)
// ---------------------------------------------------------------------------

type PaddleCheckoutOptions = {
  items: { priceId: string; quantity: number }[];
  customer?: { email?: string };
  customData?: Record<string, string>;
  settings?: { displayMode?: string; theme?: string; successUrl?: string; locale?: string };
};

declare global {
  interface Window {
    Paddle?: {
      Environment: { set: (env: string) => void };
      Initialize: (opts: { token: string }) => void;
      Checkout: { open: (opts: PaddleCheckoutOptions) => void };
      Initialized?: boolean;
    };
  }
}

let paddlePromise: Promise<NonNullable<Window["Paddle"]>> | null = null;

export function loadPaddle(): Promise<NonNullable<Window["Paddle"]>> {
  if (paddlePromise) return paddlePromise;
  paddlePromise = new Promise((resolve, reject) => {
    const env = getPaddleEnvironment();
    const init = () => {
      const paddle = window.Paddle;
      if (!paddle) return reject(new Error("Paddle failed to load."));
      if (env === "sandbox") paddle.Environment.set("sandbox");
      paddle.Initialize({ token: clientToken as string });
      resolve(paddle);
    };
    if (window.Paddle) return init();
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = init;
    script.onerror = () => reject(new Error("Could not load the Paddle checkout script."));
    document.head.appendChild(script);
  });
  return paddlePromise;
}

/** Open the Paddle overlay checkout for one price. */
export async function openPaddleCheckout(options: {
  lookupKey: string;
  email?: string | undefined;
  userId: string;
  locale?: string | undefined;
}): Promise<void> {
  const paddle = await loadPaddle();
  const priceId = await paddlePriceId(options.lookupKey);
  paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    ...(options.email ? { customer: { email: options.email } } : {}),
    customData: { userId: options.userId, site: "autovere.com" },
    settings: {
      displayMode: "overlay",
      theme: "dark",
      successUrl: checkoutReturnUrl(),
      ...(options.locale ? { locale: options.locale } : {}),
    },
  });
}
