import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, AlertCircle, Info, Download, Loader2, Sparkles, ShieldCheck } from "lucide-react";

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
import { buildAnalysisReport, type AnalysisReport, type Finding, type AreaAnalysis, type AnalysisAreaId } from "@/components/admin/analysis/analysisReport";
import { summarizeReport, type Tone } from "@/components/admin/analysis/analysisPresentation";
import type { AdminCurrency } from "@/components/admin/adminFormat";
import { ProductEventsPanel } from "@/components/admin/sections/ProductEventsPanel";


const TONE_ACCENT: Record<Tone, string> = {
  positive: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  warning: "border-destructive/30 bg-destructive/10 text-destructive",
  neutral: "border-primary/25 bg-primary/10 text-primary",
};

const SEVERITY_ICON: Record<Finding["severity"], typeof CheckCircle2> = {
  positive: CheckCircle2,
  warning: AlertCircle,
  neutral: Info,
  info: Info,
};

const SEVERITY_DOT: Record<Finding["severity"], string> = {
  positive: "text-emerald-400",
  warning: "text-destructive",
  neutral: "text-foreground/50",
  info: "text-primary",
};

function StatusBadge({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${TONE_ACCENT[tone]}`}>
      {label}
    </span>
  );
}

function FindingRow({ finding }: { finding: Finding }) {
  const Icon = SEVERITY_ICON[finding.severity];
  return (
    <div className="flex gap-3 border-b border-border/60 py-3 last:border-b-0">
      <Icon className={`mt-0.5 size-4 shrink-0 ${SEVERITY_DOT[finding.severity]}`} />
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium text-foreground">{finding.headline}</p>
        {finding.metric && (
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-[0.08em] text-foreground/50">Målt: </span>
            {finding.metric}
          </p>
        )}
        {finding.recommendation && (
          <p className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            → {finding.recommendation}
          </p>
        )}
      </div>
    </div>
  );
}

function AreaCard({
  area,
  selected,
  onToggle,
  exporting,
  onExport,
}: {
  area: AreaAnalysis;
  selected: boolean;
  onToggle: () => void;
  exporting: boolean;
  onExport: () => void;
}) {
  return (
    <section className="glass-panel rounded-2xl p-5 print:break-inside-avoid">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="size-3.5 rounded border-border accent-primary"
          />
          {area.title}
        </label>
        <Button variant="outline" size="sm" onClick={onExport} disabled={exporting}>
          {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          Eksporter denne analysen
        </Button>
      </div>

      <div className="mt-2">
        {area.findings.length > 0 ? (
          area.findings.map((f) => <FindingRow key={f.id} finding={f} />)
        ) : (
          <p className="py-3 text-sm text-muted-foreground">Ingen konklusjoner ennå for dette området.</p>
        )}
      </div>

      {area.insufficientNotes.length > 0 && (
        <div className="mt-3 rounded-xl border border-border/60 bg-background/40 p-3">
          <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-foreground/50">
            <Info className="size-3.5" /> Datagrunnlag
          </p>
          <ul className="mt-1.5 space-y-1">
            {area.insufficientNotes.map((note, i) => (
              <li key={i} className="text-xs leading-relaxed text-muted-foreground">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
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

  const [selected, setSelected] = useState<Set<AnalysisAreaId> | null>(null);
  const [exportingArea, setExportingArea] = useState<string | null>(null);
  const [exportingSelected, setExportingSelected] = useState(false);
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
  const summary = summarizeReport(report);
  const selectedIds = selected ?? new Set(report.areas.map((a) => a.area));
  const generatedAtLabel = new Date(report.generatedAt).toLocaleString("nb-NO");

  const toggleArea = (id: AnalysisAreaId) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const exportArea = async (area: AreaAnalysis) => {
    setExportingArea(area.area);
    try {
      const { generateAnalysisPdf } = await import("@/components/admin/analysis/generateAnalysisPdf");
      await generateAnalysisPdf({
        scopeLabel: area.title,
        currency: effectiveCurrency,
        generatedAtLabel,
        areas: [area],
        summary: null,
      });
    } finally {
      setExportingArea(null);
    }
  };

  const exportSelected = async () => {
    const chosen = report.areas.filter((a) => selectedIds.has(a.area));
    if (chosen.length === 0) return;
    setExportingSelected(true);
    try {
      const { generateAnalysisPdf } = await import("@/components/admin/analysis/generateAnalysisPdf");
      await generateAnalysisPdf({
        scopeLabel: chosen.length === 1 ? chosen[0]!.title : `Valgt analyse (${chosen.length} områder)`,
        currency: effectiveCurrency,
        generatedAtLabel,
        areas: chosen,
        summary: null,
      });
    } finally {
      setExportingSelected(false);
    }
  };

  const exportAll = async () => {
    setExportingAll(true);
    try {
      const { generateAnalysisPdf } = await import("@/components/admin/analysis/generateAnalysisPdf");
      await generateAnalysisPdf({
        scopeLabel: "Samlet analyse",
        currency: effectiveCurrency,
        generatedAtLabel,
        areas: report.areas,
        summary: { ...summary, unusualChanges: report.unusualChanges, followUps: report.followUps, overallConclusion: report.overallConclusion },
      });
    } finally {
      setExportingAll(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Analyse-oversikt */}
      <div className="glass-panel overflow-hidden rounded-2xl">
        <div className="border-b border-border/60 bg-primary/5 p-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" /> Regelbasert analyse — ingen AI
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Analyse</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Eierens ledelsesoversikt over hvordan AutoVere utvikler seg. Oppdatert {generatedAtLabel}.
          </p>
        </div>

        <div className="grid gap-px bg-border/60 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card p-5">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Samlet status</p>
            <div className="mt-2">
              <StatusBadge label={summary.statusLabel} tone={summary.statusTone} />
            </div>
          </div>
          <div className="bg-card p-5">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Viktigste positive</p>
            <p className="mt-2 text-sm text-foreground/85">{summary.topPositive?.headline ?? "Ingen registrert ennå."}</p>
          </div>
          <div className="bg-card p-5">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Følg med på</p>
            <p className="mt-2 text-sm text-foreground/85">{summary.topFollowUp?.headline ?? "Ingen registrert."}</p>
          </div>
          <div className="bg-card p-5">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Datagrunnlag</p>
            <div className="mt-2">
              <StatusBadge label={summary.dataQualityLabel} tone={summary.dataQualityTone} />
            </div>
          </div>
        </div>
      </div>

      {/* 7. PDF-valg */}
      <div className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
        <p className="text-xs text-muted-foreground">
          Velg analyseområder med avkrysning under · Valuta: <span className="font-semibold text-foreground">{effectiveCurrency}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => void exportSelected()} disabled={exportingSelected || selectedIds.size === 0}>
            {exportingSelected ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            Eksporter valgt analyse ({selectedIds.size})
          </Button>
          <Button size="sm" onClick={() => void exportAll()} disabled={exportingAll}>
            {exportingAll ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
            Eksporter samlet analyse
          </Button>
        </div>
      </div>

      {/* 3 & 4. Positive funn / Bør følges opp */}
      {(summary.positiveCount > 0 || summary.followUpCount > 0) && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">
              <CheckCircle2 className="size-4" /> Det som går bra
            </h3>
            <div className="mt-2">
              {report.areas.flatMap((a) => a.findings).filter((f) => f.severity === "positive").length === 0 ? (
                <p className="py-2 text-sm text-muted-foreground">Ingen positive funn registrert ennå.</p>
              ) : (
                report.areas.flatMap((a) => a.findings).filter((f) => f.severity === "positive").map((f) => <FindingRow key={f.id} finding={f} />)
              )}
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-destructive">
              <AlertCircle className="size-4" /> Bør følges opp
            </h3>
            <div className="mt-2">
              {report.followUps.length === 0 ? (
                <p className="py-2 text-sm text-muted-foreground">Ingen forhold krever oppfølging akkurat nå.</p>
              ) : (
                report.followUps.map((f) => <FindingRow key={f.id} finding={f} />)
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Analysekort per område */}
      <div className="space-y-4">
        {report.areas.map((area) => (
          <AreaCard
            key={area.area}
            area={area}
            selected={selectedIds.has(area.area)}
            onToggle={() => toggleArea(area.area)}
            exporting={exportingArea === area.area}
            onExport={() => void exportArea(area)}
          />
        ))}
      </div>

      {/* 5b. Produkthendelser — planleggertrakt og funksjonsbruk */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Produkthendelser — planleggertrakt
        </h3>
        <ProductEventsPanel />
      </div>

      {/* 6. Samlet konklusjon */}

      <div className="overflow-hidden rounded-2xl border border-primary/30 bg-primary/5">
        <div className="border-b border-primary/20 px-6 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Samlet konklusjon</p>
        </div>
        <div className="p-6">
          <p className="text-base leading-relaxed text-foreground/90">{report.overallConclusion}</p>
        </div>
      </div>
    </div>
  );
}
