import type { AdminOverview } from "@/lib/admin.functions";

export type ReportPeriod = "7" | "30" | "90";

export const REPORT_PERIODS: { value: ReportPeriod; label: string }[] = [
  { value: "7", label: "Siste 7 dager" },
  { value: "30", label: "Siste 30 dager" },
  { value: "90", label: "Siste 90 dager" },
];

/** Traffic totals only carry fixed 7/30/90-day rollups and a 30-point daily series — this
 * derives what each period can honestly show without inventing data the server doesn't return. */
export function periodView(data: AdminOverview, period: ReportPeriod) {
  const daily = data.traffic.daily;
  if (period === "7") {
    return { dailyForPeriod: daily.slice(-7), headlineViews: data.traffic.last7 };
  }
  if (period === "30") {
    return { dailyForPeriod: daily, headlineViews: data.traffic.last30 };
  }
  return { dailyForPeriod: daily, headlineViews: data.traffic.total };
}
