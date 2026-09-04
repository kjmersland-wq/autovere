/**
 * Pure, deterministic, rule-based analysis primitives for the Admin
 * "Analyse" section. Everything here is arithmetic and fixed thresholds —
 * no AI/ML, no external calls, no randomness. Every function is a pure
 * function of its inputs so it can be reused identically by the on-screen
 * panel and every PDF export.
 */

export type TrendClassification = "strong_growth" | "growth" | "stable" | "decline" | "strong_decline";

export type TrendResult =
  | { sufficient: true; changePct: number; classification: TrendClassification; current: number; previous: number }
  | { sufficient: false; current: number; previous: number };

// Thresholds — the complete, approved rule set. Nothing here is invented at
// call time; every number a report shows traces back to one of these.
export const TREND_THRESHOLDS = { strongGrowth: 40, growth: 15, decline: -15, strongDecline: -40 } as const;
export const MIN_SAMPLE_7D = 20;
export const MIN_SAMPLE_30D = 30;
export const MIN_SAMPLE_MARKET_TOTAL = 50;
export const MARKET_DOMINANCE_PCT = 50;
export const MARKET_EVEN_MAX_PCT = 25;
export const UNCOVERED_MARKET_PCT = 10;
export const MIN_SAMPLE_SUBSCRIPTIONS = 10;
export const MIN_SAMPLE_MONTHLY_SUBS = 3;
export const CHURN_HIGH_PCT = 10;
export const CHURN_MODERATE_PCT = 5;
export const PLAN_CONCENTRATION_PCT = 70;
export const MANY_INSUFFICIENT_AREAS = 3;

function classify(changePct: number): TrendClassification {
  if (changePct >= TREND_THRESHOLDS.strongGrowth) return "strong_growth";
  if (changePct >= TREND_THRESHOLDS.growth) return "growth";
  if (changePct <= TREND_THRESHOLDS.strongDecline) return "strong_decline";
  if (changePct <= TREND_THRESHOLDS.decline) return "decline";
  return "stable";
}

/** Generic current-vs-previous trend, gated on both raw counts meeting minSample. */
export function computeTrend(current: number, previous: number, minSample: number): TrendResult {
  if (current < minSample || previous < minSample || previous === 0) {
    return { sufficient: false, current, previous };
  }
  const changePct = Math.round(((current - previous) / previous) * 1000) / 10;
  return { sufficient: true, changePct, classification: classify(changePct), current, previous };
}

/** 7-day trend derived from an existing 30-point daily series (oldest → newest),
 * exactly as returned by getGlobalOverview()/getSiteBreakdown() — no new query. */
export function sevenDayTrendFromDaily(daily: { date: string; views: number }[]): TrendResult {
  const last7 = daily.slice(-7).reduce((s, d) => s + d.views, 0);
  const prev7 = daily.slice(-14, -7).reduce((s, d) => s + d.views, 0);
  return computeTrend(last7, prev7, MIN_SAMPLE_7D);
}

/** 90-day trend using only the rollups that exist (total90, last30) — no
 * daily series is available beyond 30 days, so this compares average daily
 * rate for the last 30 days against the average daily rate for the 60 days
 * before that, both gated on raw volume. */
export function ninetyDayRateTrend(total90: number, last30: number): TrendResult {
  const olderCount = total90 - last30;
  if (last30 < MIN_SAMPLE_30D || olderCount < MIN_SAMPLE_30D) {
    return { sufficient: false, current: last30, previous: olderCount };
  }
  const recentDailyRate = last30 / 30;
  const olderDailyRate = olderCount / 60;
  if (olderDailyRate === 0) return { sufficient: false, current: last30, previous: olderCount };
  const changePct = Math.round(((recentDailyRate - olderDailyRate) / olderDailyRate) * 1000) / 10;
  return { sufficient: true, changePct, classification: classify(changePct), current: last30, previous: olderCount };
}

export const TREND_LABEL_NO: Record<TrendClassification, string> = {
  strong_growth: "Sterk vekst",
  growth: "Vekst",
  stable: "Stabil",
  decline: "Nedgang",
  strong_decline: "Kraftig nedgang",
};

export function formatPct(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value} %`;
}

/** ISO2 country codes that already have a dedicated AutoVere site (language
 * site or region site), derived from the same registries the rest of Admin
 * uses (LOCALE_ROUTES/REGIONS): NO, SE, DK, FI, DE, NL, FR, PL, ES, IT, US, CA.
 * Used only for the "uncovered market" rule (B3) — not a data source, a fact
 * about which countries the existing site list already represents. */
export const COUNTRIES_WITH_SITE = new Set([
  "NO",
  "SE",
  "DK",
  "FI",
  "DE",
  "NL",
  "FR",
  "PL",
  "ES",
  "IT",
  "US",
  "CA",
]);
