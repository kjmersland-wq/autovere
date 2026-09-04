import { forwardRef } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Metric } from "@/components/admin/AdminUi";
import { cf, nf } from "@/components/admin/adminFormat";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminOverview } from "@/lib/admin.functions";
import type { ReportPeriod } from "@/components/admin/reports/reportPeriod";

export const ReportDocument = forwardRef<
  HTMLDivElement,
  {
    data: AdminOverview;
    period: ReportPeriod;
    periodLabel: string;
    generatedAtLabel: string;
    dailyForPeriod: { date: string; views: number }[];
    headlineViews: number;
  }
>(({ data, periodLabel, generatedAtLabel, dailyForPeriod, headlineViews }, ref) => {
  return (
    <div ref={ref} className="glass-panel rounded-2xl p-6 print:border print:border-neutral-300 print:bg-white sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary print:text-neutral-900">
            AutoVere
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight print:text-neutral-900 sm:text-3xl">
            Eierrapport
          </h2>
        </div>
        <div className="text-right text-xs text-muted-foreground print:text-neutral-600">
          <p>Periode: {periodLabel}</p>
          <p>Generert: {generatedAtLabel}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Besøk i perioden" value={nf.format(headlineViews)} />
        <Metric label="Aktive abonnenter" value={nf.format(data.subscriptions.active)} />
        <Metric label="Månedlig inntekt (MRR)" value={cf.format(data.finance.mrr)} />
        <Metric label="Churn" value={`${data.finance.churnRate} %`} />
      </div>

      <div className="mt-6" data-report-chart="traffic">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary print:text-neutral-900">
          Daglige besøk
        </h3>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyForPeriod}>
              <defs>
                <linearGradient id="report-views" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.15)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d: string) => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip formatter={(v: number) => [nf.format(v), "Besøk"]} />
              <Area type="monotone" dataKey="views" stroke="#f59e0b" fill="url(#report-views)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6" data-report-chart="revenue">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary print:text-neutral-900">
          Inntekt per plan
        </h3>
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.subscriptions.byPlan}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.15)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [cf.format(v), "MRR"]} />
              <Bar dataKey="mrr" fill="#34d399" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6" data-report-table="plans">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary print:text-neutral-900">
          Abonnement per plan
        </h3>
        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead className="text-right">Antall</TableHead>
              <TableHead className="text-right">MRR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.subscriptions.byPlan.map((p) => (
              <TableRow key={p.plan}>
                <TableCell>{p.label}</TableCell>
                <TableCell className="text-right">{nf.format(p.count)}</TableCell>
                <TableCell className="text-right">{cf.format(p.mrr)}</TableCell>
              </TableRow>
            ))}
            {data.subscriptions.byPlan.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Ingen aktive abonnement ennå.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6" data-report-table="paths">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary print:text-neutral-900">
          Mest besøkte sider
        </h3>
        <Table className="mt-3">
          <TableHeader>
            <TableRow>
              <TableHead>Side</TableHead>
              <TableHead className="text-right">Besøk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.traffic.paths.map((p) => (
              <TableRow key={p.path}>
                <TableCell className="max-w-xs truncate">{p.path}</TableCell>
                <TableCell className="text-right">{nf.format(p.views)}</TableCell>
              </TableRow>
            ))}
            {data.traffic.paths.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground">
                  Ingen registrerte besøk ennå.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});
ReportDocument.displayName = "ReportDocument";
