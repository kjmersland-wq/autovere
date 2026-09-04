import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Panel } from "@/components/admin/AdminUi";
import { PIE_COLORS, REGION_NO, nf } from "@/components/admin/adminFormat";
import type { AdminOverview } from "@/lib/admin.functions";

export function TrafficPanel({ data }: { data: AdminOverview }) {
  return (
    <>
      <Panel title="Besøk per dag (30 dager)">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.traffic.daily}>
              <defs>
                <linearGradient id="views" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d: string) => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#0b1220", border: "1px solid #1f2937", borderRadius: 12 }}
                labelFormatter={(d) => `Dato ${d}`}
                formatter={(v: number) => [nf.format(v), "Besøk"]}
              />
              <Area type="monotone" dataKey="views" stroke="#f59e0b" fill="url(#views)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Mest besøkte sider">
          <ul className="space-y-2 text-sm">
            {data.traffic.paths.map((p) => (
              <li key={p.path} className="flex justify-between gap-4">
                <span className="truncate text-foreground/80 print:text-neutral-800">{p.path}</span>
                <span className="font-semibold">{nf.format(p.views)}</span>
              </li>
            ))}
            {data.traffic.paths.length === 0 && (
              <li className="text-muted-foreground">Ingen registrerte besøk ennå.</li>
            )}
          </ul>
        </Panel>
        <Panel title="Region">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.traffic.regions.map((r) => ({
                    name: REGION_NO[r.region] ?? r.region,
                    value: r.views,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {data.traffic.regions.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(v: number) => nf.format(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </>
  );
}
