import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportDocument } from "@/components/admin/reports/ReportDocument";
import { REPORT_PERIODS, periodView, type ReportPeriod } from "@/components/admin/reports/reportPeriod";
import { useAdminQuery, statusMessage } from "@/components/admin/useAdminQuery";
import { getGlobalOverview, getSiteBreakdown, getSubscriptionBreakdown } from "@/lib/admin-data.functions";
import { siteLabel } from "@/components/admin/siteOptions";

export function ReportsPanel({ site }: { site: string | null }) {
  const [period, setPeriod] = useState<ReportPeriod>("30");
  const [exporting, setExporting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchOverview = useServerFn(getGlobalOverview);
  const fetchSites = useServerFn(getSiteBreakdown);
  const fetchSubs = useServerFn(getSubscriptionBreakdown);
  const overview = useAdminQuery(fetchOverview);
  const sites = useAdminQuery(fetchSites);
  const subs = useAdminQuery(fetchSubs);

  const loading = overview.loading || sites.loading || subs.loading;
  if (loading || !overview.result || !sites.result || !subs.result) {
    return <p className="text-sm text-muted-foreground">Henter tall …</p>;
  }
  if (overview.result.status !== "ok") {
    return <p className="text-sm text-destructive">{statusMessage(overview.result.status, "message" in overview.result ? overview.result.message : undefined)}</p>;
  }
  if (subs.result.status !== "ok") {
    return <p className="text-sm text-destructive">{statusMessage(subs.result.status, "message" in subs.result ? subs.result.message : undefined)}</p>;
  }
  if (sites.result.status !== "ok") {
    return <p className="text-sm text-destructive">{statusMessage(sites.result.status, "message" in sites.result ? sites.result.message : undefined)}</p>;
  }

  const globalData = overview.result.data;
  const subsData = subs.result.data;
  const siteRow = site ? sites.result.data.sites.find((s) => s.prefix === site) : null;

  const scopeLabel = site ? siteLabel(site) : "Alle AutoVere";
  const isSiteScoped = !!site;
  const traffic = siteRow
    ? { daily: siteRow.daily, last7: siteRow.visits7, visits30: siteRow.visits30, visits90: siteRow.visits90 }
    : globalData.traffic;
  const topPaths = siteRow ? siteRow.topPaths : globalData.traffic.topPaths;

  const periodLabel = REPORT_PERIODS.find((p) => p.value === period)?.label ?? "";
  const generatedAtLabel = new Date(globalData.generatedAt).toLocaleString("nb-NO");
  const { dailyForPeriod, headlineViews } = periodView(traffic, period);
  const kpis = {
    totalUsers: globalData.totalUsers,
    activeSubs: globalData.subscriptions.active,
    mrr: globalData.finance.mrr,
    churnRate: globalData.finance.churnRate,
  };

  const exportPdf = async () => {
    const container = containerRef.current;
    if (!container) return;
    setExporting(true);
    try {
      const { generateReportPdf } = await import("@/components/admin/reports/generateReportPdf");
      await generateReportPdf({
        container,
        scopeLabel,
        periodLabel,
        generatedAtLabel,
        headlineViews,
        kpis,
        byPlan: subsData.byPlan,
        topPaths,
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground/70">Rapport for</span>
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            {scopeLabel}
          </span>
          <span className="text-sm font-medium text-foreground/70">Periode</span>
          <Select value={period} onValueChange={(v) => setPeriod(v as ReportPeriod)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REPORT_PERIODS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => void exportPdf()} disabled={exporting}>
          {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          {exporting ? "Genererer PDF…" : "Eksporter PDF"}
        </Button>
      </div>

      <ReportDocument
        ref={containerRef}
        scopeLabel={scopeLabel}
        isSiteScoped={isSiteScoped}
        periodLabel={periodLabel}
        generatedAtLabel={generatedAtLabel}
        dailyForPeriod={dailyForPeriod}
        headlineViews={headlineViews}
        kpis={kpis}
        byPlan={subsData.byPlan}
        topPaths={topPaths}
      />
    </div>
  );
}
