import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReportDocument } from "@/components/admin/reports/ReportDocument";
import { REPORT_PERIODS, periodView, type ReportPeriod } from "@/components/admin/reports/reportPeriod";
import { useAdminQuery, statusMessage } from "@/components/admin/useAdminQuery";
import {
  getExchangeRates,
  getFinanceBreakdown,
  getGlobalOverview,
  getMarketBreakdown,
  getSiteBreakdown,
  getSubscriptionBreakdown,
} from "@/lib/admin-data.functions";
import { siteLabel } from "@/components/admin/siteOptions";
import { COUNTRY_NO, cf, nf, nfOrUnavailable } from "@/components/admin/adminFormat";
import { convertFromEur, formatAdminCurrency } from "@/components/admin/adminCurrency";
import { buildAnalysisReport } from "@/components/admin/analysis/analysisReport";
import type { AdminCurrency } from "@/components/admin/adminFormat";
import type { FullReportSection } from "@/components/admin/pdf/generateFullReportPdf";

export function ReportsPanel({ site, currency }: { site: string | null; currency: AdminCurrency }) {
  const [period, setPeriod] = useState<ReportPeriod>("30");
  const [exporting, setExporting] = useState(false);
  const [exportingFull, setExportingFull] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchOverview = useServerFn(getGlobalOverview);
  const fetchSites = useServerFn(getSiteBreakdown);
  const fetchSubs = useServerFn(getSubscriptionBreakdown);
  const fetchMarkets = useServerFn(getMarketBreakdown);
  const fetchFinance = useServerFn(getFinanceBreakdown);
  const fetchRates = useServerFn(getExchangeRates);
  const overview = useAdminQuery(fetchOverview);
  const sites = useAdminQuery(fetchSites);
  const subs = useAdminQuery(fetchSubs);
  const markets = useAdminQuery(fetchMarkets);
  const finance = useAdminQuery(fetchFinance);
  const rates = useAdminQuery(fetchRates);

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
  const sitesData = sites.result.data;
  const siteRow = site ? sitesData.sites.find((s) => s.prefix === site) : null;
  const ratesData = rates.result?.status === "ok" ? rates.result.data : null;
  const effectiveCurrency: AdminCurrency = ratesData ? currency : "EUR";

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
        currency: effectiveCurrency,
        rates: ratesData,
      });
    } finally {
      setExporting(false);
    }
  };

  const exportFullReport = async () => {
    if (markets.result?.status !== "ok" || finance.result?.status !== "ok") return;
    setExportingFull(true);
    try {
      const marketsData = markets.result.data;
      const financeData = finance.result.data;
      const fmt = (valueEur: number) => formatAdminCurrency(valueEur, effectiveCurrency, ratesData);

      const analysis = buildAnalysisReport({
        overview: globalData,
        siteBreakdown: sitesData,
        marketBreakdown: marketsData,
        subscriptionBreakdown: subsData,
        financeBreakdown: financeData,
        currency: effectiveCurrency,
        rates: ratesData,
      });
      const allFindings = analysis.areas.flatMap((a) => a.findings);

      const sections: FullReportSection[] = [
        {
          title: "Oversikt",
          kpis: [
            { label: `Besøk (${periodLabel})`, value: nf.format(headlineViews) },
            { label: "Registrerte brukere totalt", value: nfOrUnavailable(globalData.totalUsers) },
            { label: "Aktive abonnenter", value: nf.format(globalData.subscriptions.active) },
            { label: "Månedlig inntekt (MRR, EUR)", value: cf.format(globalData.finance.mrr) },
          ],
          chart: {
            title: `Besøk per dag (${periodLabel})`,
            type: "area",
            series: dailyForPeriod.map((d) => ({ label: d.date.slice(5), value: d.views })),
          },
          tables: [
            {
              title: "Mest besøkte sider",
              columns: ["Side", "Besøk"],
              rows: globalData.traffic.topPaths.map((p) => [p.path, nf.format(p.views)]),
            },
          ],
        },
        {
          title: "Trafikk",
          chart: {
            title: `Besøk per dag (${periodLabel})`,
            type: "area",
            series: dailyForPeriod.map((d) => ({ label: d.date.slice(5), value: d.views })),
          },
          tables: [
            {
              title: "Mest besøkte sider",
              columns: ["Side", "Besøk"],
              rows: topPaths.map((p) => [p.path, nf.format(p.views)]),
            },
          ],
        },
        {
          title: "Markeder",
          chart: {
            title: "Besøk per land (topp 8)",
            type: "bar",
            series: marketsData.countries.map((c) => ({ label: COUNTRY_NO[c.country] ?? c.country, value: c.views })),
          },
          tables: [
            {
              title: "Besøk per land",
              columns: ["Land", "Besøk"],
              rows: marketsData.countries.map((c) => [COUNTRY_NO[c.country] ?? c.country, nf.format(c.views)]),
            },
            {
              title: "Etter AutoVere-nettsted",
              columns: ["Nettsted", "Besøk (7d)", "Besøk (30d)", "Andel av total"],
              rows: sitesData.sites.map((s) => [
                `${s.flag} ${s.label}`,
                nf.format(s.visits7),
                nf.format(s.visits30),
                `${s.shareOfTotalPct} %`,
              ]),
            },
          ],
        },
        {
          title: "Abonnement",
          kpis: [
            { label: "Totalt registrert", value: nf.format(subsData.total) },
            { label: "Kansellert", value: nf.format(subsData.canceled) },
          ],
          chart: {
            title: "Nye abonnement per måned",
            type: "bar",
            series: subsData.monthly.map((m) => ({ label: m.month, value: m.count })),
          },
          tables: [
            {
              title: "Abonnement per plan",
              columns: ["Plan", "Antall", "MRR (EUR)"],
              rows: subsData.byPlan.map((p) => [p.label, nf.format(p.count), cf.format(p.mrr)]),
            },
          ],
        },
        {
          title: "Økonomi",
          kpis: [
            { label: "MRR", value: fmt(financeData.mrr) },
            { label: "ARR", value: fmt(financeData.arr) },
            { label: "ARPU", value: fmt(financeData.arpu) },
            { label: "Churn", value: `${financeData.churnRate} %` },
          ],
          chart: {
            title: `Inntektsfordeling per plan (${effectiveCurrency})`,
            type: "bar",
            series: financeData.byPlan.map((p) => ({
              label: p.label,
              value: convertFromEur(p.mrr, effectiveCurrency, ratesData),
            })),
          },
          tables: [
            {
              title: `Inntekt per plan (${effectiveCurrency})`,
              columns: ["Plan", "Antall", "MRR"],
              rows: financeData.byPlan.map((p) => [p.label, p.count, fmt(p.mrr)]),
            },
          ],
        },
        {
          title: "Analyse",
          tables: [
            {
              title: "Konklusjoner",
              columns: ["Konklusjon", "Målt", "Anbefaling"],
              rows:
                allFindings.length > 0
                  ? allFindings.map((f) => [f.headline, f.metric ?? "—", f.recommendation ?? "—"])
                  : [["Ingen funn ennå.", "—", "—"]],
            },
          ],
        },
        {
          title: "Rapporter",
          kpis: [
            { label: `Besøk (${scopeLabel}, ${periodLabel})`, value: nf.format(headlineViews) },
            { label: "Registrerte brukere (globalt)", value: nfOrUnavailable(kpis.totalUsers) },
            { label: "Aktive abonnenter (globalt)", value: nf.format(kpis.activeSubs) },
            { label: `Månedlig inntekt (globalt, ${effectiveCurrency})`, value: fmt(kpis.mrr) },
            { label: "Churn (globalt)", value: `${kpis.churnRate} %` },
          ],
          tables: [
            {
              title: `Abonnement per plan (globalt, ${effectiveCurrency})`,
              columns: ["Plan", "Antall", "MRR"],
              rows: subsData.byPlan.map((p) => [p.label, nf.format(p.count), fmt(p.mrr)]),
            },
          ],
        },
      ];

      const { generateFullReportPdf } = await import("@/components/admin/pdf/generateFullReportPdf");
      await generateFullReportPdf({
        periodLabel,
        generatedAtLabel,
        executiveKpis: [
          { label: `Besøk (${periodLabel})`, value: nf.format(headlineViews) },
          { label: "Registrerte brukere totalt", value: nfOrUnavailable(globalData.totalUsers) },
          { label: "Aktive abonnenter", value: nf.format(globalData.subscriptions.active) },
          { label: `Månedlig inntekt (MRR)`, value: fmt(globalData.finance.mrr) },
          { label: "Churn", value: `${globalData.finance.churnRate} %` },
        ],
        executiveConclusion: analysis.overallConclusion,
        sections,
      });
    } finally {
      setExportingFull(false);
    }
  };

  const fullReportDisabled = exportingFull || markets.loading || finance.loading || markets.result?.status !== "ok" || finance.result?.status !== "ok";

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
          <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground/70">
            Valuta: {effectiveCurrency}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void exportPdf()} disabled={exporting}>
            {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            {exporting ? "Genererer PDF…" : "Eksporter PDF"}
          </Button>
          <Button variant="outline" onClick={() => void exportFullReport()} disabled={fullReportDisabled}>
            {exportingFull ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
            {exportingFull ? "Genererer komplett rapport…" : "Eksporter komplett rapport"}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        «Eksporter komplett rapport» samler Oversikt, Trafikk, Markeder, Abonnement, Økonomi, Analyse og Rapporter i
        én PDF, med valgt periode ({periodLabel.toLowerCase()}) brukt gjennomgående for trafikktallene.
      </p>

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
        currency={effectiveCurrency}
        rates={ratesData}
      />
    </div>
  );
}
