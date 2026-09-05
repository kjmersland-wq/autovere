import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Metric, Panel } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { cf, nf, nfOrUnavailable } from "@/components/admin/adminFormat";
import { useAdminQuery, statusMessage } from "@/components/admin/useAdminQuery";
import { getGlobalOverview } from "@/lib/admin-data.functions";
import type { AdminSectionId } from "@/components/admin/adminNav";
import { ADMIN_NAV } from "@/components/admin/adminNav";

export function OverviewPanel({ onNavigate }: { onNavigate: (section: AdminSectionId) => void }) {
  const fetchOverview = useServerFn(getGlobalOverview);
  const { loading, result } = useAdminQuery(fetchOverview);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    void import("@/components/admin/pdf/generateAreaDataPdf");
  }, []);

  if (loading || !result) return <p className="text-sm text-muted-foreground">Henter tall …</p>;
  if (result.status !== "ok") {
    return <p className="text-sm text-destructive">{statusMessage(result.status, "message" in result ? result.message : undefined)}</p>;
  }

  const { data } = result;
  const trend =
    data.traffic.prev7 > 0
      ? Math.round(((data.traffic.last7 - data.traffic.prev7) / data.traffic.prev7) * 1000) / 10
      : null;
  const shortcuts = ADMIN_NAV.filter((item) => item.id !== "oversikt");

  const exportPdf = async () => {
    setExporting(true);
    try {
      const { generateAreaDataPdf } = await import("@/components/admin/pdf/generateAreaDataPdf");
      await generateAreaDataPdf({
        areaLabel: "Oversikt",
        periodLabel: "Siste 90 dager",
        generatedAtLabel: new Date(data.generatedAt).toLocaleString("nb-NO"),
        block: {
          kpis: [
            { label: "Besøk siste 7 dager", value: nf.format(data.traffic.last7) },
            { label: "Besøk siste 30 dager", value: nf.format(data.traffic.last30) },
            { label: "Registrerte brukere totalt", value: nfOrUnavailable(data.totalUsers) },
            { label: "Aktive abonnenter", value: nf.format(data.subscriptions.active) },
            { label: "Månedlig inntekt (MRR, EUR)", value: cf.format(data.finance.mrr) },
          ],
          chart: {
            title: "Besøk per dag, hele plattformen",
            type: "area",
            series: data.traffic.daily.map((d) => ({ label: d.date.slice(5), value: d.views })),
          },
          tables: [
            {
              title: "Mest besøkte sider",
              columns: ["Side", "Besøk"],
              rows: data.traffic.topPaths.map((p) => [p.path, nf.format(p.views)]),
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
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              Global oversikt · hele AutoVere-plattformen
            </span>
            <h2 className="mt-3 text-xl font-semibold tracking-tight">AutoVere kontrollpanel</h2>
            <p className="text-sm text-muted-foreground">
              Oppdatert {new Date(data.generatedAt).toLocaleString("nb-NO")}.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void exportPdf()} disabled={exporting}>
            {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            Eksporter PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Besøk siste 7 dager"
          value={nf.format(data.traffic.last7)}
          hint={
            trend === null
              ? "Ingen sammenligningsgrunnlag ennå"
              : `${trend >= 0 ? "▲" : "▼"} ${Math.abs(trend)} % mot forrige uke`
          }
        />
        <Metric label="Registrerte brukere totalt" value={nfOrUnavailable(data.totalUsers)} />
        <Metric
          label="Aktive abonnenter"
          value={nf.format(data.subscriptions.active)}
          hint={`${data.subscriptions.trialing} på prøve · ${data.subscriptions.pastDue} forfalt`}
        />
        <Metric
          label="Månedlig inntekt (MRR)"
          value={cf.format(data.finance.mrr)}
          hint={`ARR ${cf.format(data.finance.arr)} · ARPU ${cf.format(data.finance.arpu)}`}
        />
      </div>

      <Panel title="Besøk per dag, hele plattformen (30 dager)">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.traffic.daily}>
              <defs>
                <linearGradient id="overview-views" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d: string) => d.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip formatter={(v: number) => [nf.format(v), "Besøk"]} labelFormatter={(d) => `Dato ${d}`} />
              <Area type="monotone" dataKey="views" stroke="#f59e0b" fill="url(#overview-views)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="glass-panel rounded-2xl p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Snarveier</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {shortcuts.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-background/60"
            >
              <item.icon className="size-4" /> {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
