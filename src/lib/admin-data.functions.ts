import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import { getAdminSupabaseContext, type AdminAccessResult } from "@/lib/admin-auth.functions";
import { LOCALE_ROUTES } from "@/lib/locales";
import { REGIONS } from "@/lib/trip-data";
import type { Database } from "@/integrations/supabase/types";

export type AdminDataResult<T> = Exclude<AdminAccessResult, { status: "ok" }> | { status: "ok"; data: T };

const DAY_MS = 1000 * 60 * 60 * 24;
const WINDOW_DAYS = 90;

type DailyPoint = { date: string; views: number };

function dayKey(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

function emptyDaily(): Map<string, number> {
  const map = new Map<string, number>();
  const now = Date.now();
  for (let i = 29; i >= 0; i--) {
    map.set(new Date(now - i * DAY_MS).toISOString().slice(0, 10), 0);
  }
  return map;
}

function toDailyArray(map: Map<string, number>): DailyPoint[] {
  return [...map.entries()].map(([date, views]) => ({ date, views }));
}

/* ------------------------------------------------------------------ */
/* Oversikt — global traffic, users, subscriptions, finance            */
/* ------------------------------------------------------------------ */

export type GlobalOverview = {
  traffic: {
    total90: number;
    last7: number;
    prev7: number;
    last30: number;
    daily: DailyPoint[];
    topPaths: { path: string; views: number }[];
  };
  /** null when the service-role key isn't available to this environment — never fabricated as 0. */
  totalUsers: number | null;
  subscriptions: { active: number; trialing: number; pastDue: number; canceled: number; total: number };
  finance: { mrr: number; arr: number; arpu: number; churnRate: number; currency: string };
  generatedAt: string;
};

const PLAN_MRR: Record<string, number> = {
  pro_monthly: 4.99,
  pro_yearly: 39 / 12,
  business_monthly: 19,
};

/**
 * Total registered users needs the service-role key (auth.admin.listUsers()
 * isn't reachable via RLS/the publishable key at all). SUPABASE_SERVICE_ROLE_KEY
 * is a genuine secret — unlike the publishable key/URL, it must never be
 * hardcoded as a fallback, and it isn't present in this environment (confirmed:
 * absent from process.env here, and it shares the same reserved SUPABASE_
 * prefix already confirmed blocked in Lovable Cloud's Secrets UI for the
 * publishable key). So this degrades to "unavailable" (null) rather than
 * fabricating 0 or blocking the rest of Oversikt when it can't run.
 */
async function countTotalUsers(): Promise<number | null> {
  const SUPABASE_URL =
    import.meta.env["VITE_SUPABASE_URL"] ||
    process.env["SUPABASE_URL"] ||
    "https://idjkeokjhfusbwrnfkat.supabase.co";
  const SUPABASE_SERVICE_ROLE_KEY = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!SUPABASE_SERVICE_ROLE_KEY) return null;

  try {
    const supabaseAdmin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    let total = 0;
    let page = 1;
    const perPage = 1000;
    for (;;) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
      if (error) return null;
      total += data.users.length;
      if (data.users.length < perPage || page > 50) break;
      page += 1;
    }
    return total;
  } catch {
    return null;
  }
}

export const getGlobalOverview = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminDataResult<GlobalOverview>> => {
    const ctx = await getAdminSupabaseContext();
    if (!ctx.ok) return ctx.result;
    try {
      const since = new Date(Date.now() - WINDOW_DAYS * DAY_MS).toISOString();
      const [{ data: views, error: viewsError }, { data: subs, error: subsError }, totalUsers] = await Promise.all([
        ctx.supabase.from("page_views").select("path, created_at").gte("created_at", since).limit(50000),
        ctx.supabase.from("subscriptions").select("price_id, status"),
        countTotalUsers(),
      ]);
      if (viewsError || subsError) {
        return { status: "error", message: "Kunne ikke hente global oversikt." };
      }

      const now = Date.now();
      const daily = emptyDaily();
      const pathMap = new Map<string, number>();
      let last7 = 0;
      let prev7 = 0;
      let last30 = 0;
      for (const row of views ?? []) {
        const age = now - new Date(row.created_at).getTime();
        if (age <= 7 * DAY_MS) last7 += 1;
        else if (age <= 14 * DAY_MS) prev7 += 1;
        if (age <= 30 * DAY_MS) {
          last30 += 1;
          const key = dayKey(row.created_at);
          if (daily.has(key)) daily.set(key, (daily.get(key) ?? 0) + 1);
        }
        pathMap.set(row.path, (pathMap.get(row.path) ?? 0) + 1);
      }
      const topPaths = [...pathMap.entries()]
        .map(([path, count]) => ({ path, views: count }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 12);

      const subRows = subs ?? [];
      const activeStatuses = new Set(["active", "trialing", "past_due"]);
      let active = 0;
      let trialing = 0;
      let pastDue = 0;
      let canceled = 0;
      let mrr = 0;
      for (const sub of subRows) {
        if (sub.status === "trialing") trialing += 1;
        if (sub.status === "past_due") pastDue += 1;
        if (sub.status === "canceled") canceled += 1;
        if (activeStatuses.has(sub.status)) {
          active += 1;
          mrr += PLAN_MRR[sub.price_id] ?? 0;
        }
      }

      return {
        status: "ok",
        data: {
          traffic: { total90: (views ?? []).length, last7, prev7, last30, daily: toDailyArray(daily), topPaths },
          totalUsers,
          subscriptions: { active, trialing, pastDue, canceled, total: subRows.length },
          finance: {
            mrr: Math.round(mrr * 100) / 100,
            arr: Math.round(mrr * 12 * 100) / 100,
            arpu: active ? Math.round((mrr / active) * 100) / 100 : 0,
            churnRate: subRows.length ? Math.round((canceled / subRows.length) * 1000) / 10 : 0,
            currency: "EUR",
          },
          generatedAt: new Date().toISOString(),
        },
      };
    } catch {
      return { status: "error", message: "Kunne ikke hente global oversikt." };
    }
  },
);

/* ------------------------------------------------------------------ */
/* Nettsted-fordeling — per-site traffic (the only dimension genuinely  */
/* trackable per site with the current data model; see plan notes).    */
/* ------------------------------------------------------------------ */

export type SiteRow = {
  prefix: string;
  label: string;
  flag: string;
  visits7: number;
  visits30: number;
  visits90: number;
  daily: DailyPoint[];
  topPaths: { path: string; views: number }[];
  shareOfTotalPct: number;
  usersAvailable: boolean;
  registrationsAvailable: boolean;
  revenueAvailable: boolean;
};

export type SiteBreakdown = { sites: SiteRow[]; totalViews90: number; generatedAt: string };

// Language sites (LOCALE_ROUTES) are one dimension; /us and /ca are a second,
// independent dimension (region, with no language prefix) tracked separately
// in page_views.region — see regionFor()/REGION_PREFIXES in analytics.ts and
// locales.ts. Both are real, distinct AutoVere sites and are sourced from
// their existing registries rather than hardcoded here. "eu" is excluded:
// it's the default region already covered by the language sites above.
const REGION_ONLY_SITES = REGIONS.filter((r) => r.key !== "eu").map((r) => ({
  prefix: r.key as string,
  label: r.label,
  flag: r.flag,
}));
const SITE_DEFS = [
  { prefix: "en", label: "Engelsk (hovedsiden)", flag: "🌍" },
  ...LOCALE_ROUTES,
  ...REGION_ONLY_SITES,
];
const REGION_ONLY_KEYS = new Set(REGION_ONLY_SITES.map((s) => s.prefix));

export const getSiteBreakdown = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminDataResult<SiteBreakdown>> => {
    const ctx = await getAdminSupabaseContext();
    if (!ctx.ok) return ctx.result;
    try {
      const since = new Date(Date.now() - WINDOW_DAYS * DAY_MS).toISOString();
      const { data: views, error } = await ctx.supabase
        .from("page_views")
        .select("locale, region, path, created_at")
        .gte("created_at", since)
        .limit(50000);
      if (error) return { status: "error", message: "Kunne ikke hente nettsted-fordeling." };

      const rows = views ?? [];
      const now = Date.now();
      const perSite = new Map<
        string,
        { last7: number; last30: number; total90: number; daily: Map<string, number>; paths: Map<string, number> }
      >();
      for (const def of SITE_DEFS) {
        perSite.set(def.prefix, { last7: 0, last30: 0, total90: 0, daily: emptyDaily(), paths: new Map() });
      }

      for (const row of rows) {
        // A plain /us or /ca visit has no language prefix (locale defaults to
        // "en") but does carry its region — attribute those to the region
        // site rather than folding them into the generic English bucket.
        // A combined path like /fr/ca keeps its language attribution ("fr"),
        // matching how the rest of the dashboard already treats locale.
        const isRegionOnly = row.region && REGION_ONLY_KEYS.has(row.region) && (!row.locale || row.locale === "en");
        const key = isRegionOnly ? row.region! : row.locale && perSite.has(row.locale) ? row.locale : "en";
        const bucket = perSite.get(key)!;
        const age = now - new Date(row.created_at).getTime();
        bucket.total90 += 1;
        if (age <= 7 * DAY_MS) bucket.last7 += 1;
        if (age <= 30 * DAY_MS) {
          bucket.last30 += 1;
          const dKey = dayKey(row.created_at);
          if (bucket.daily.has(dKey)) bucket.daily.set(dKey, (bucket.daily.get(dKey) ?? 0) + 1);
        }
        bucket.paths.set(row.path, (bucket.paths.get(row.path) ?? 0) + 1);
      }

      const totalViews90 = rows.length;
      const sites: SiteRow[] = SITE_DEFS.map((def) => {
        const bucket = perSite.get(def.prefix)!;
        return {
          prefix: def.prefix,
          label: def.label,
          flag: def.flag,
          visits7: bucket.last7,
          visits30: bucket.last30,
          visits90: bucket.total90,
          daily: toDailyArray(bucket.daily),
          topPaths: [...bucket.paths.entries()]
            .map(([path, count]) => ({ path, views: count }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 8),
          shareOfTotalPct: totalViews90 ? Math.round((bucket.total90 / totalViews90) * 1000) / 10 : 0,
          usersAvailable: false,
          registrationsAvailable: false,
          revenueAvailable: false,
        };
      }).sort((a, b) => b.visits90 - a.visits90);

      return { status: "ok", data: { sites, totalViews90, generatedAt: new Date().toISOString() } };
    } catch {
      return { status: "error", message: "Kunne ikke hente nettsted-fordeling." };
    }
  },
);

/* ------------------------------------------------------------------ */
/* Markeder — visitor geo-country + region (existing dimension)        */
/* ------------------------------------------------------------------ */

export type MarketBreakdown = {
  countries: { country: string; views: number }[];
  regions: { region: string; views: number }[];
  generatedAt: string;
};

export const getMarketBreakdown = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminDataResult<MarketBreakdown>> => {
    const ctx = await getAdminSupabaseContext();
    if (!ctx.ok) return ctx.result;
    try {
      const since = new Date(Date.now() - WINDOW_DAYS * DAY_MS).toISOString();
      const { data: views, error } = await ctx.supabase
        .from("page_views")
        .select("country, region")
        .gte("created_at", since)
        .limit(50000);
      if (error) return { status: "error", message: "Kunne ikke hente markedsdata." };

      const countryMap = new Map<string, number>();
      const regionMap = new Map<string, number>();
      for (const row of views ?? []) {
        const country = row.country ?? "Ukjent";
        countryMap.set(country, (countryMap.get(country) ?? 0) + 1);
        const region = row.region ?? "eu";
        regionMap.set(region, (regionMap.get(region) ?? 0) + 1);
      }

      return {
        status: "ok",
        data: {
          countries: [...countryMap.entries()]
            .map(([country, views2]) => ({ country, views: views2 }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 15),
          regions: [...regionMap.entries()]
            .map(([region, views2]) => ({ region, views: views2 }))
            .sort((a, b) => b.views - a.views),
          generatedAt: new Date().toISOString(),
        },
      };
    } catch {
      return { status: "error", message: "Kunne ikke hente markedsdata." };
    }
  },
);

/* ------------------------------------------------------------------ */
/* Abonnement — global plan mix + monthly trend                        */
/* ------------------------------------------------------------------ */

const PLAN_LABEL: Record<string, string> = {
  pro_monthly: "Pro – månedlig",
  pro_yearly: "Pro – årlig",
  business_monthly: "Fleet – månedlig",
};

export type SubscriptionBreakdown = {
  total: number;
  active: number;
  trialing: number;
  pastDue: number;
  canceled: number;
  byPlan: { plan: string; label: string; count: number; mrr: number }[];
  monthly: { month: string; count: number }[];
  generatedAt: string;
};

export const getSubscriptionBreakdown = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminDataResult<SubscriptionBreakdown>> => {
    const ctx = await getAdminSupabaseContext();
    if (!ctx.ok) return ctx.result;
    try {
      const { data: subs, error } = await ctx.supabase
        .from("subscriptions")
        .select("price_id, status, created_at");
      if (error) return { status: "error", message: "Kunne ikke hente abonnementsdata." };

      const rows = subs ?? [];
      const activeStatuses = new Set(["active", "trialing", "past_due"]);
      const planMap = new Map<string, number>();
      const monthMap = new Map<string, number>();
      let active = 0;
      let trialing = 0;
      let pastDue = 0;
      let canceled = 0;

      for (const sub of rows) {
        if (sub.status === "trialing") trialing += 1;
        if (sub.status === "past_due") pastDue += 1;
        if (sub.status === "canceled") canceled += 1;
        if (activeStatuses.has(sub.status)) {
          active += 1;
          planMap.set(sub.price_id, (planMap.get(sub.price_id) ?? 0) + 1);
        }
        if (sub.created_at) {
          const month = new Date(sub.created_at).toISOString().slice(0, 7);
          monthMap.set(month, (monthMap.get(month) ?? 0) + 1);
        }
      }

      const byPlan = [...planMap.entries()]
        .map(([plan, count]) => ({
          plan,
          label: PLAN_LABEL[plan] ?? plan,
          count,
          mrr: Math.round((PLAN_MRR[plan] ?? 0) * count * 100) / 100,
        }))
        .sort((a, b) => b.count - a.count);

      const monthly = [...monthMap.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-12)
        .map(([month, count]) => ({ month, count }));

      return {
        status: "ok",
        data: { total: rows.length, active, trialing, pastDue, canceled, byPlan, monthly, generatedAt: new Date().toISOString() },
      };
    } catch {
      return { status: "error", message: "Kunne ikke hente abonnementsdata." };
    }
  },
);

/* ------------------------------------------------------------------ */
/* Økonomi — global finance summary + revenue by plan                  */
/* ------------------------------------------------------------------ */

export type FinanceBreakdown = {
  mrr: number;
  arr: number;
  arpu: number;
  churnRate: number;
  currency: string;
  byPlan: { plan: string; label: string; count: number; mrr: number }[];
  generatedAt: string;
};

export const getFinanceBreakdown = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminDataResult<FinanceBreakdown>> => {
    const ctx = await getAdminSupabaseContext();
    if (!ctx.ok) return ctx.result;
    try {
      const { data: subs, error } = await ctx.supabase.from("subscriptions").select("price_id, status");
      if (error) return { status: "error", message: "Kunne ikke hente økonomidata." };

      const rows = subs ?? [];
      const activeStatuses = new Set(["active", "trialing", "past_due"]);
      const planMap = new Map<string, number>();
      let active = 0;
      let canceled = 0;
      let mrr = 0;
      for (const sub of rows) {
        if (sub.status === "canceled") canceled += 1;
        if (activeStatuses.has(sub.status)) {
          active += 1;
          planMap.set(sub.price_id, (planMap.get(sub.price_id) ?? 0) + 1);
          mrr += PLAN_MRR[sub.price_id] ?? 0;
        }
      }

      const byPlan = [...planMap.entries()]
        .map(([plan, count]) => ({
          plan,
          label: PLAN_LABEL[plan] ?? plan,
          count,
          mrr: Math.round((PLAN_MRR[plan] ?? 0) * count * 100) / 100,
        }))
        .sort((a, b) => b.mrr - a.mrr);

      return {
        status: "ok",
        data: {
          mrr: Math.round(mrr * 100) / 100,
          arr: Math.round(mrr * 12 * 100) / 100,
          arpu: active ? Math.round((mrr / active) * 100) / 100 : 0,
          churnRate: rows.length ? Math.round((canceled / rows.length) * 1000) / 10 : 0,
          currency: "EUR",
          byPlan,
          generatedAt: new Date().toISOString(),
        },
      };
    } catch {
      return { status: "error", message: "Kunne ikke hente økonomidata." };
    }
  },
);

/* ------------------------------------------------------------------ */
/* Valutakurs — live EUR-based rates for display-only conversion in     */
/* Økonomi/Rapporter. All revenue is computed and stored in EUR         */
/* (PLAN_MRR above); this never touches those figures, it only lets the */
/* UI show them in another currency. Source: Frankfurter (frankfurter.dev),*/
/* a free, keyless API republishing the European Central Bank's daily   */
/* reference rates — chosen because the only currency mechanism already */
/* in this codebase (src/lib/currency.tsx's RATES) is explicitly        */
/* "indicative reference rates... not for settlement", not suitable for */
/* financial reporting. No rate is ever hardcoded here: on failure this  */
/* returns an error rather than a fabricated fallback rate.             */
/* ------------------------------------------------------------------ */

export type ExchangeRates = { EUR: 1; NOK: number; USD: number; asOf: string };

export const getExchangeRates = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminDataResult<ExchangeRates>> => {
    const ctx = await getAdminSupabaseContext();
    if (!ctx.ok) return ctx.result;
    try {
      const res = await fetch("https://api.frankfurter.dev/v1/latest?base=EUR&symbols=NOK,USD");
      if (!res.ok) return { status: "error", message: "Kunne ikke hente valutakurs." };
      const json = (await res.json()) as { date?: string; rates?: { NOK?: number; USD?: number } };
      const nok = json.rates?.NOK;
      const usd = json.rates?.USD;
      if (typeof nok !== "number" || typeof usd !== "number") {
        return { status: "error", message: "Kunne ikke hente valutakurs." };
      }
      return { status: "ok", data: { EUR: 1, NOK: nok, USD: usd, asOf: json.date ?? "" } };
    } catch {
      return { status: "error", message: "Kunne ikke hente valutakurs." };
    }
  },
);
