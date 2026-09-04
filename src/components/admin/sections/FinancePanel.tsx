import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useServerFn } from "@tanstack/react-start";

import { Metric, Panel } from "@/components/admin/AdminUi";
import { cf } from "@/components/admin/adminFormat";
import { useAdminQuery, statusMessage } from "@/components/admin/useAdminQuery";
import { getFinanceBreakdown } from "@/lib/admin-data.functions";
import { siteLabel } from "@/components/admin/siteOptions";

export function FinancePanel({ site }: { site: string | null }) {
  const fetchFinance = useServerFn(getFinanceBreakdown);
  const { loading, result } = useAdminQuery(fetchFinance);

  if (loading || !result) return <p className="text-sm text-muted-foreground">Henter tall …</p>;
  if (result.status !== "ok") {
    return <p className="text-sm text-destructive">{statusMessage(result.status, "message" in result ? result.message : undefined)}</p>;
  }
  const { data } = result;

  return (
    <div className="space-y-4">
      {site && (
        <p className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
          Økonomidata kan ikke fordeles per nettsted ({siteLabel(site)}) — ingen kobling mellom abonnement og
          nettsted i dataene. Tallene under er globale for hele AutoVere.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="MRR" value={cf.format(data.mrr)} hint="Løpende månedlig inntekt" />
        <Metric label="ARR" value={cf.format(data.arr)} hint="Årlig inntektsrate" />
        <Metric label="ARPU" value={cf.format(data.arpu)} hint="Inntekt per aktiv kunde" />
        <Metric label="Churn" value={`${data.churnRate} %`} hint="Andel kansellerte av totalt" />
      </div>
      <Panel title="Inntektsfordeling per plan">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.byPlan}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [cf.format(v), "MRR"]} />
              <Bar dataKey="mrr" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <p className="text-xs text-muted-foreground print:text-neutral-600">
        Beløp er beregnet fra aktive abonnement i EUR eks. Stripe-gebyr. Utbetalinger og avgifter håndteres av
        Stripe.
      </p>
    </div>
  );
}
