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
