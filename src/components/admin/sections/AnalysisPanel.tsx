import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2 } from "lucide-react";

import { Panel } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { useAdminQuery, statusMessage } from "@/components/admin/useAdminQuery";
import {
  getExchangeRates,
  getFinanceBreakdown,
  getGlobalOverview,
  getMarketBreakdown,
  getSiteBreakdown,
  getSubscriptionBreakdown,
} from "@/lib/admin-data.functions";
import { buildAnalysisReport, type AnalysisReport, type Finding, type AreaAnalysis } from "@/components/admin/analysis/analysisReport";
import type { AdminCurrency } from "@/components/admin/adminFormat";

const SEVERITY_STYLE: Record<Finding["severity"], string> = {
  positive: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  warning: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  neutral: "border-border bg-background/40 text-foreground/80",
  info: "border-border bg-background/40 text-foreground/70",
};

function FindingCard({ finding }: { finding: Finding }) {
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${SEVERITY_STYLE[finding.severity]}`}>
      <p className="font-medium">{finding.headline}</p>
      {finding.recommendation && <p className="mt-1 text-xs opacity-80">→ Anbefaling: {finding.recommendation}</p>}
    </div>
  );
}

function AreaCard({
  area,
  currency,
  exporting,
  onExport,
}: {
  area: AreaAnalysis;
  currency: AdminCurrency;
  exporting: boolean;
  onExport: () => void;
}) {
  return (
    <Panel title={area.title}>
      <div className="space-y-2">
        {area.findings.map((f) => (
          <FindingCard key={f.id} finding={f} />
        ))}
        {area.insufficientNotes.map((note, i) => (
          <p key={i} className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
            {note}
          </p>
        ))}
        {area.findings.length === 0 && area.insufficientNotes.length === 0 && (
          <p className="text-sm text-muted-foreground">Ingen funn.</p>
        )}
      </div>
      <div className="mt-4">
        <Button variant="outline" size="sm" onClick={onExport} disabled={exporting}>
          {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          Eksporter analyse-PDF ({currency})
        </Button>
      </div>
    </Panel>
  );
}

export function AnalysisPanel({ currency }: { currency: AdminCurrency }) {
  const fetchOverview = useServerFn(getGlobalOverview);
  const fetchSites = useServerFn(getSiteBreakdown);
  const fetchMarkets = useServerFn(getMarketBreakdown);
  const fetchSubs = useServerFn(getSubscriptionBreakdown);
  const fetchFinance = useServerFn(getFinanceBreakdown);
  const fetchRates = useServerFn(getExchangeRates);

  const overview = useAdminQuery(fetchOverview);
  const sites = useAdminQuery(fetchSites);
  const markets = useAdminQuery(fetchMarkets);
  const subs = useAdminQuery(fetchSubs);
  const finance = useAdminQuery(fetchFinance);
  const rates = useAdminQuery(fetchRates);

  const [exportingArea, setExportingArea] = useState<string | null>(null);
  const [exportingAll, setExportingAll] = useState(false);

  const loading = overview.loading || sites.loading || markets.loading || subs.loading || finance.loading;
  if (loading || !overview.result || !sites.result || !markets.result || !subs.result || !finance.result) {
    return <p className="text-sm text-muted-foreground">Henter og analyserer tall …</p>;
  }
  for (const r of [overview.result, sites.result, markets.result, subs.result, finance.result]) {
    if (r.status !== "ok") {
      return <p className="text-sm text-destructive">{statusMessage(r.status, "message" in r ? r.message : undefined)}</p>;
    }
  }
  if (overview.result.status !== "ok" || sites.result.status !== "ok" || markets.result.status !== "ok" || subs.result.status !== "ok" || finance.result.status !== "ok") {
    return null; // narrows types below; unreachable given the loop above
  }

  const ratesData = rates.result?.status === "ok" ? rates.result.data : null;
  const effectiveCurrency: AdminCurrency = ratesData ? currency : "EUR";

  const report: AnalysisReport = buildAnalysisReport({
    overview: overview.result.data,
    siteBreakdown: sites.result.data,
    marketBreakdown: markets.result.data,
    subscriptionBreakdown: subs.result.data,
    financeBreakdown: finance.result.data,
    currency: effectiveCurrency,
    rates: ratesData,
  });

  const exportArea = async (area: AreaAnalysis) => {
    setExportingArea(area.area);
    try {
      const { generateAnalysisPdf } = await import("@/components/admin/analysis/generateAnalysisPdf");
      await generateAnalysisPdf({
        scopeLabel: area.title,
        areas: [area],
        unusualChanges: [],
        followUps: [],
        overallConclusion: null,
        generatedAtLabel: new Date(report.generatedAt).toLocaleString("nb-NO"),
      });
    } finally {
      setExportingArea(null);
    }
  };

  const exportAll = async () => {
    setExportingAll(true);
    try {
      const { generateAnalysisPdf } = await import("@/components/admin/analysis/generateAnalysisPdf");
      await generateAnalysisPdf({
        scopeLabel: "Samlet analyse",
        areas: report.areas,
        unusualChanges: report.unusualChanges,
        followUps: report.followUps,
        overallConclusion: report.overallConclusion,
        generatedAtLabel: new Date(report.generatedAt).toLocaleString("nb-NO"),
      });
    } finally {
      setExportingAll(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass-panel rounded-2xl p-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
          100 % regelbasert analyse — ingen AI
        </span>
        <h2 className="mt-3 text-xl font-semibold tracking-tight">Analyse</h2>
        <p className="text-sm text-muted-foreground">
          Faste beregninger, sammenligninger og terskelverdier basert på faktiske AutoVere-data. Oppdatert{" "}
          {new Date(report.generatedAt).toLocaleString("nb-NO")}.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">Valuta i eksporterte PDF-er: {effectiveCurrency}</p>
          <Button onClick={() => void exportAll()} disabled={exportingAll}>
            {exportingAll ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            Eksporter samlet analyse (PDF)
          </Button>
        </div>
      </div>

      {(report.unusualChanges.length > 0 || report.followUps.length > 0) && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Uvanlige endringer">
            <div className="space-y-2">
              {report.unusualChanges.length === 0 && <p className="text-sm text-muted-foreground">Ingen registrert.</p>}
              {report.unusualChanges.map((f) => (
                <FindingCard key={f.id} finding={f} />
              ))}
            </div>
          </Panel>
          <Panel title="Bør følges opp">
            <div className="space-y-2">
              {report.followUps.length === 0 && <p className="text-sm text-muted-foreground">Ingen registrert.</p>}
              {report.followUps.map((f) => (
                <FindingCard key={f.id} finding={f} />
              ))}
            </div>
          </Panel>
        </div>
      )}

      <Panel title="Samlet konklusjon">
        <p className="text-sm text-foreground/80">{report.overallConclusion}</p>
      </Panel>

      {report.areas.map((area) => (
        <AreaCard
          key={area.area}
          area={area}
          currency={effectiveCurrency}
          exporting={exportingArea === area.area}
          onExport={() => void exportArea(area)}
        />
      ))}
    </div>
  );
}
