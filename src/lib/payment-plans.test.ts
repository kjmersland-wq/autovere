import { describe, expect, it } from "bun:test";
import { PAYMENT_PLANS, tierForPriceId, subscriptionIsActive } from "./payment-plans";
import { passDays } from "./pass-durations";
describe("Unchanged AutoVere plans", () => {
  it("Trip Pass is €7.33 once for 14 days", () => {
    expect(PAYMENT_PLANS.tripPass).toEqual({ priceId: "trip_pass", amount: 733, currency: "eur", interval: null, days: 14 });
    expect(passDays("trip_pass")).toBe(14);
  });
  it("Pro remains €8.15 monthly", () => { expect(PAYMENT_PLANS.proMonthly).toEqual({ priceId: "pro_monthly", amount: 815, currency: "eur", interval: "month" }); });
  it("Pro remains €47 yearly", () => { expect(PAYMENT_PLANS.proYearly).toEqual({ priceId: "pro_yearly", amount: 4700, currency: "eur", interval: "year" }); });
  it("Business remains €18.39 monthly", () => { expect(PAYMENT_PLANS.businessMonthly).toEqual({ priceId: "business_monthly", amount: 1839, currency: "eur", interval: "month" }); });
  it("Free and unknown plans never grant paid access", () => { expect(tierForPriceId(null)).toBe("free"); expect(tierForPriceId("unknown")).toBe("free"); });
  it("Each paid lookup key grants the matching tier", () => {
    expect(tierForPriceId("trip_pass")).toBe("tripPass"); expect(tierForPriceId("pro_monthly")).toBe("pro"); expect(tierForPriceId("pro_yearly")).toBe("pro"); expect(tierForPriceId("business_monthly")).toBe("fleet");
  });
  it("Cancellation retains access only until period end", () => {
    expect(subscriptionIsActive({ status: "canceled", current_period_end: "2026-10-21T00:00:00Z" }, Date.parse("2026-10-20T00:00:00Z"))).toBe(true);
    expect(subscriptionIsActive({ status: "canceled", current_period_end: "2026-10-21T00:00:00Z" }, Date.parse("2026-10-22T00:00:00Z"))).toBe(false);
  });
  it("Expired and unpaid rows cannot hide an active paid plan", () => {
    expect(subscriptionIsActive({ status: "expired", current_period_end: "2026-12-01T00:00:00Z" }, Date.parse("2026-10-20"))).toBe(false);
    expect(subscriptionIsActive({ status: "unpaid", current_period_end: null })).toBe(false);
  });
});