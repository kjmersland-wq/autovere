export type ReportPeriod = "7" | "30" | "90";

export const REPORT_PERIODS: { value: ReportPeriod; label: string }[] = [
  { value: "7", label: "Siste 7 dager" },
  { value: "30", label: "Siste 30 dager" },
  { value: "90", label: "Siste 90 dager" },
];

type TrafficLike = {
  daily: { date: string; views: number }[];
  last7: number;
  last30?: number;
  visits30?: number;
  total90?: number;
  visits90?: number;
};

/** Traffic totals only carry fixed 7/30/90-day rollups and a 30-point daily series — this
 * derives what each period can honestly show without inventing data the server doesn't return. */
export function periodView(traffic: TrafficLike, period: ReportPeriod) {
  const daily = traffic.daily;
  if (period === "7") {
    return { dailyForPeriod: daily.slice(-7), headlineViews: traffic.last7 };
  }
  if (period === "30") {
    return { dailyForPeriod: daily, headlineViews: traffic.last30 ?? traffic.visits30 ?? 0 };
  }
  return { dailyForPeriod: daily, headlineViews: traffic.total90 ?? traffic.visits90 ?? 0 };
}
