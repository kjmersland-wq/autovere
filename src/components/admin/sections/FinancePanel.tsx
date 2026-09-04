import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Metric, Panel } from "@/components/admin/AdminUi";
import { cf } from "@/components/admin/adminFormat";
import type { AdminOverview } from "@/lib/admin.functions";

export function FinancePanel({ data }: { data: AdminOverview }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="MRR" value={cf.format(data.finance.mrr)} hint="Løpende månedlig inntekt" />
        <Metric label="ARR" value={cf.format(data.finance.arr)} hint="Årlig inntektsrate" />
        <Metric label="ARPU" value={cf.format(data.finance.arpu)} hint="Inntekt per aktiv kunde" />
        <Metric label="Churn" value={`${data.finance.churnRate} %`} hint="Andel kansellerte av totalt" />
      </div>
      <div className="mt-4">
        <Panel title="Inntektsfordeling per plan">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.subscriptions.byPlan}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [cf.format(v), "MRR"]} />
                <Bar dataKey="mrr" fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
      <p className="mt-4 text-xs text-muted-foreground print:text-neutral-600">
        Beløp er beregnet fra aktive abonnement i EUR eks. Stripe-gebyr. Utbetalinger og avgifter håndteres av
        Stripe.
      </p>
    </>
  );
}
