export const PAYMENT_PLANS = {
  tripPass: { priceId: "trip_pass", amount: 733, currency: "eur", interval: null, days: 14 },
  proMonthly: { priceId: "pro_monthly", amount: 815, currency: "eur", interval: "month" },
  proYearly: { priceId: "pro_yearly", amount: 4700, currency: "eur", interval: "year" },
  businessMonthly: { priceId: "business_monthly", amount: 1839, currency: "eur", interval: "month" },
} as const;
export type PaymentProductKey = keyof typeof PAYMENT_PLANS;
export type PlanTier = "free" | "tripPass" | "pro" | "fleet";
export const TIER_RANK: Record<PlanTier, number> = { free: 0, tripPass: 1, pro: 2, fleet: 3 };
export function tierForPriceId(id: string | null | undefined): PlanTier {
  if (id === "trip_pass" || id === "season_pass") return "tripPass";
  if (id === "pro_monthly" || id === "pro_yearly") return "pro";
  if (id === "business_monthly") return "fleet";
  return "free";
}
export function subscriptionIsActive(row: { status: string; current_period_end: string | null }, now = Date.now()): boolean {
  const end = row.current_period_end ? Date.parse(row.current_period_end) : null;
  if (end !== null && end <= now) return false;
  return ["active", "trialing", "past_due"].includes(row.status) || (row.status === "canceled" && end !== null && end > now);
}

function activePrefix() {
  if (typeof window === "undefined") return "";
  const first = window.location.pathname.split("/")[1] ?? "";
  return ["us", "ca", "no", "sv", "da", "fi", "de", "nl", "fr", "pl", "es", "it", "pt", "ja", "zh"].includes(first) ? `/${first}` : "";
}
export function billingReturnUrl() {
  return `${typeof window === "undefined" ? "https://www.autovere.com" : window.location.origin}${activePrefix()}/pricing`;
}
export function checkoutSuccessUrl() {
  const origin = typeof window === "undefined" ? "https://www.autovere.com" : window.location.origin;
  return `${origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`;
}