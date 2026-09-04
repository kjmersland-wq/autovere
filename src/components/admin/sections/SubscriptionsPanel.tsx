import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Panel } from "@/components/admin/AdminUi";
import { cf, nf } from "@/components/admin/adminFormat";
import type { AdminOverview } from "@/lib/admin.functions";

export function SubscriptionsPanel({ data }: { data: AdminOverview }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Abonnement per plan">
        <ul className="space-y-3 text-sm">
          {data.subscriptions.byPlan.map((p) => (
            <li key={p.plan} className="flex items-center justify-between gap-4">
              <span className="text-foreground/85 print:text-neutral-800">{p.label}</span>
              <span className="font-semibold">
                {nf.format(p.count)} · {cf.format(p.mrr)}/mnd
              </span>
            </li>
          ))}
          {data.subscriptions.byPlan.length === 0 && (
            <li className="text-muted-foreground">Ingen aktive abonnement ennå.</li>
          )}
        </ul>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Totalt registrert</dt>
            <dd className="font-semibold">{nf.format(data.subscriptions.total)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Kansellert</dt>
            <dd className="font-semibold">{nf.format(data.subscriptions.canceled)}</dd>
          </div>
        </dl>
      </Panel>
      <Panel title="Nye abonnement per måned">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.subscriptions.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip formatter={(v: number) => [nf.format(v), "Nye"]} />
              <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
