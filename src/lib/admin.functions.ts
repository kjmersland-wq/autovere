import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Monthly EUR value per plan, used for MRR estimates. */
const PLAN_MRR: Record<string, number> = {
  pro_monthly: 4.99,
  pro_yearly: 39 / 12,
  business_monthly: 19,
};

const PLAN_LABEL: Record<string, string> = {
  pro_monthly: "Pro – månedlig",
  pro_yearly: "Pro – årlig",
  business_monthly: "Fleet – månedlig",
};

export type AdminOverview = {
  isAdmin: boolean;
  traffic: {
    total: number;
    last7: number;
    prev7: number;
    last30: number;
    daily: { date: string; views: number }[];
    countries: { country: string; views: number }[];
    regions: { region: string; views: number }[];
    paths: { path: string; views: number }[];
  };
  subscriptions: {
    total: number;
    active: number;
    trialing: number;
    pastDue: number;
    canceled: number;
    byPlan: { plan: string; label: string; count: number; mrr: number }[];
    monthly: { month: string; count: number }[];
  };
  finance: {
    mrr: number;
    arr: number;
    arpu: number;
    churnRate: number;
    currency: string;
  };
  generatedAt: string;
};

function dayKey(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

/** Reads the visitor country from the edge request headers. */
export const getVisitorGeo = createServerFn({ method: "GET" }).handler(async () => {
  const country =
    getRequestHeader("cf-ipcountry") ??
    getRequestHeader("x-vercel-ip-country") ??
    getRequestHeader("x-country-code") ??
    null;
  const city = getRequestHeader("cf-ipcity") ?? null;
  return { country: country && country !== "XX" ? country.toUpperCase() : null, city };
});

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminOverview> => {
    const { supabase, userId } = context;

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    const empty: AdminOverview = {
      isAdmin: false,
      traffic: {
        total: 0,
        last7: 0,
        prev7: 0,
        last30: 0,
        daily: [],
        countries: [],
        regions: [],
        paths: [],
      },
      subscriptions: {
        total: 0,
        active: 0,
        trialing: 0,
        pastDue: 0,
        canceled: 0,
        byPlan: [],
        monthly: [],
      },
      finance: { mrr: 0, arr: 0, arpu: 0, churnRate: 0, currency: "EUR" },
      generatedAt: new Date().toISOString(),
    };

    if (!isAdmin) return empty;

    const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString();

    const [{ data: views }, { data: subs }] = await Promise.all([
      supabase
        .from("page_views")
        .select("path, region, locale, country, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(50000),
      supabase
        .from("subscriptions")
        .select("price_id, status, created_at, current_period_end, cancel_at_period_end"),
    ]);

    const rows = views ?? [];
    const now = Date.now();
    const day = 1000 * 60 * 60 * 24;

    const dailyMap = new Map<string, number>();
    for (let i = 29; i >= 0; i--) {
      dailyMap.set(new Date(now - i * day).toISOString().slice(0, 10), 0);
    }
    const countryMap = new Map<string, number>();
    const regionMap = new Map<string, number>();
    const pathMap = new Map<string, number>();
    let last7 = 0;
    let prev7 = 0;
    let last30 = 0;

    for (const row of rows) {
      const ts = new Date(row.created_at).getTime();
      const age = now - ts;
      if (age <= 7 * day) last7 += 1;
      else if (age <= 14 * day) prev7 += 1;
      if (age <= 30 * day) {
        last30 += 1;
        const key = dayKey(row.created_at);
        if (dailyMap.has(key)) dailyMap.set(key, (dailyMap.get(key) ?? 0) + 1);
      }
      const country = row.country ?? "Ukjent";
      countryMap.set(country, (countryMap.get(country) ?? 0) + 1);
      const region = row.region ?? "eu";
      regionMap.set(region, (regionMap.get(region) ?? 0) + 1);
      pathMap.set(row.path, (pathMap.get(row.path) ?? 0) + 1);
    }

    const subRows = subs ?? [];
    const activeStatuses = new Set(["active", "trialing", "past_due"]);
    const planMap = new Map<string, number>();
    const monthMap = new Map<string, number>();
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
        planMap.set(sub.price_id, (planMap.get(sub.price_id) ?? 0) + 1);
        mrr += PLAN_MRR[sub.price_id] ?? 0;
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

    const total = subRows.length;

    return {
      isAdmin: true,
      traffic: {
        total: rows.length,
        last7,
        prev7,
        last30,
        daily: [...dailyMap.entries()].map(([date, v]) => ({ date, views: v })),
        countries: [...countryMap.entries()]
          .map(([country, v]) => ({ country, views: v }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 15),
        regions: [...regionMap.entries()]
          .map(([region, v]) => ({ region, views: v }))
          .sort((a, b) => b.views - a.views),
        paths: [...pathMap.entries()]
          .map(([path, v]) => ({ path, views: v }))
          .sort((a, b) => b.views - a.views)
          .slice(0, 12),
      },
      subscriptions: {
        total,
        active,
        trialing,
        pastDue,
        canceled,
        byPlan,
        monthly,
      },
      finance: {
        mrr: Math.round(mrr * 100) / 100,
        arr: Math.round(mrr * 12 * 100) / 100,
        arpu: active ? Math.round((mrr / active) * 100) / 100 : 0,
        churnRate: total ? Math.round((canceled / total) * 1000) / 10 : 0,
        currency: "EUR",
      },
      generatedAt: new Date().toISOString(),
    };
  });
