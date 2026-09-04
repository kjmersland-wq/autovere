import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Panel } from "@/components/admin/AdminUi";
import { COUNTRY_NO, nf } from "@/components/admin/adminFormat";
import type { AdminOverview } from "@/lib/admin.functions";

export function MarketsPanel({ data }: { data: AdminOverview }) {
  return (
    <Panel title="Besøk per land">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data.traffic.countries.map((c) => ({
              name: COUNTRY_NO[c.country] ?? c.country,
              views: c.views,
            }))}
            layout="vertical"
            margin={{ left: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => [nf.format(v), "Besøk"]} />
            <Bar dataKey="views" fill="#f59e0b" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {data.traffic.countries.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Land registreres automatisk så snart siden er live på eget domene.
        </p>
      )}
    </Panel>
  );
}
