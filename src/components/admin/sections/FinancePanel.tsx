import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Metric, Panel } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { cf, type AdminCurrency } from "@/components/admin/adminFormat";
import { AdminCurrencySelector } from "@/components/admin/AdminCurrencySelector";
import { convertFromEur, formatAdminCurrency } from "@/components/admin/adminCurrency";
import { formatCurrency } from "@/lib/currency";
import { useAdminQuery, statusMessage } from "@/components/admin/useAdminQuery";
import { getExchangeRates, getFinanceBreakdown } from "@/lib/admin-data.functions";
import { siteLabel } from "@/components/admin/siteOptions";
import { PaymentsLedger } from "@/components/admin/sections/PaymentsLedger";

export function FinancePanel({
  site,
  currency,
  onCurrencyChange,
}: {
  site: string | null;
  currency: AdminCurrency;
  onCurrencyChange: (c: AdminCurrency) => void;
}) {
  const fetchFinance = useServerFn(getFinanceBreakdown);
  const fetchRates = useServerFn(getExchangeRates);
  const finance = useAdminQuery(fetchFinance);
  const rates = useAdminQuery(fetchRates);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    void import("@/components/admin/pdf/generateAreaDataPdf");
  }, []);

  if (finance.loading || !finance.result) return <p className="text-sm text-muted-foreground">Henter tall …</p>;
  if (finance.result.status !== "ok") {
    return (
      <p className="text-sm text-destructive">
        {statusMessage(finance.result.status, "message" in finance.result ? finance.result.message : undefined)}
      </p>
    );
  }
  const { data } = finance.result;

  // Live rates are best-effort: if they fail to load, fall back to EUR (the
  // real base currency everything is computed in) rather than blocking the
  // page or guessing a rate.
  const ratesData = rates.result?.status === "ok" ? rates.result.data : null;
  const effectiveCurrency: AdminCurrency = ratesData ? currency : "EUR";
  const ratesUnavailable = currency !== "EUR" && !rates.loading && !ratesData;

  const fmt = (valueEur: number) => formatAdminCurrency(valueEur, effectiveCurrency, ratesData);
  const chartData = data.byPlan.map((p) => ({
    ...p,
    displayMrr: convertFromEur(p.mrr, effectiveCurrency, ratesData),
  }));

  const exportPdf = async () => {
    setExporting(true);
    try {
      const { generateAreaDataPdf } = await import("@/components/admin/pdf/generateAreaDataPdf");
      await generateAreaDataPdf({
        areaLabel: "Økonomi",
        periodLabel: "Nåværende status",
        generatedAtLabel: new Date().toLocaleString("nb-NO"),
        block: {
          kpis: [
            { label: "MRR", value: fmt(data.mrr) },
            { label: "ARR", value: fmt(data.arr) },
            { label: "ARPU", value: fmt(data.arpu) },
            { label: "Churn", value: `${data.churnRate} %` },
          ],
          chart: {
            title: `Inntektsfordeling per plan (${effectiveCurrency})`,
            type: "bar",
            series: chartData.map((p) => ({ label: p.label, value: p.displayMrr })),
          },
          tables: [
            {
              title: `Inntekt per plan (${effectiveCurrency})`,
              columns: ["Plan", "Antall", "MRR"],
              rows: data.byPlan.map((p) => [p.label, p.count, fmt(p.mrr)]),
            },
          ],
        },
      });
    } catch {
      toast.error("Kunne ikke generere PDF. Prøv igjen.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => void exportPdf()} disabled={exporting}>
          {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          Eksporter PDF
        </Button>
      </div>
      {site && (
        <p className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
          Økonomidata kan ikke fordeles per nettsted ({siteLabel(site)}) — ingen kobling mellom abonnement og
          nettsted i dataene. Tallene under er globale for hele AutoVere.
        </p>
      )}

      <PaymentsLedger />

      <div className="mt-8 border-t border-border pt-6">
        <h2 className="text-xl font-semibold tracking-tight">Løpende abonnementer (MRR)</h2>
      </div>

      <div className="glass-panel flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
        <span className="text-sm font-medium text-foreground/70">Visningsvaluta</span>
        <AdminCurrencySelector value={currency} onChange={onCurrencyChange} />
      </div>
      {ratesUnavailable && (
        <p className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
          Valutakurs er ikke tilgjengelig akkurat nå — viser beløp i EUR (grunnvalutaen alt regnes i) inntil kursen
          er tilbake.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="MRR"
          value={fmt(data.mrr)}
          hint={effectiveCurrency !== "EUR" ? `≈ ${cf.format(data.mrr)}` : "Løpende månedlig inntekt"}
        />
        <Metric label="ARR" value={fmt(data.arr)} hint={effectiveCurrency !== "EUR" ? `≈ ${cf.format(data.arr)}` : "Årlig inntektsrate"} />
        <Metric
          label="ARPU"
          value={fmt(data.arpu)}
          hint={effectiveCurrency !== "EUR" ? `≈ ${cf.format(data.arpu)}` : "Inntekt per aktiv kunde"}
        />
        <Metric label="Churn" value={`${data.churnRate} %`} hint="Andel kansellerte av totalt" />
      </div>

      <Panel title="Inntektsfordeling per plan">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [formatCurrency(v, effectiveCurrency), "MRR"]} />
              <Bar dataKey="displayMrr" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <p className="text-xs text-muted-foreground print:text-neutral-600">
        Beløp er beregnet fra aktive abonnement i EUR, vist i {effectiveCurrency}
        {ratesData ? ` (kurs fra ${ratesData.asOf || "i dag"}, Den europeiske sentralbanken via frankfurter.dev)` : ""}.
        Selve abonnementsbeløpene er alltid lagret i EUR og endres ikke av valutavalget. Paddle er Merchant of
        Record og håndterer mva, utbetalinger og avgifter.
      </p>
    </div>
  );
}
