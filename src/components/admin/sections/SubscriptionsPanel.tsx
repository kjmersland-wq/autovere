import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { cf, nf } from "@/components/admin/adminFormat";
import { useAdminQuery, statusMessage } from "@/components/admin/useAdminQuery";
import { getSubscriptionBreakdown } from "@/lib/admin-data.functions";
import { siteLabel } from "@/components/admin/siteOptions";

export function SubscriptionsPanel({ site }: { site: string | null }) {
  const fetchSubs = useServerFn(getSubscriptionBreakdown);
  const { loading, result } = useAdminQuery(fetchSubs);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    void import("@/components/admin/pdf/generateAreaDataPdf");
  }, []);

  if (loading || !result) return <p className="text-sm text-muted-foreground">Henter tall …</p>;
  if (result.status !== "ok") {
    return <p className="text-sm text-destructive">{statusMessage(result.status, "message" in result ? result.message : undefined)}</p>;
  }
  const { data } = result;

  const exportPdf = async () => {
    setExporting(true);
    try {
      const { generateAreaDataPdf } = await import("@/components/admin/pdf/generateAreaDataPdf");
      await generateAreaDataPdf({
        areaLabel: "Abonnement",
        periodLabel: "Nåværende status · siste 12 måneder",
        generatedAtLabel: new Date().toLocaleString("nb-NO"),
        block: {
          kpis: [
            { label: "Totalt registrert", value: nf.format(data.total) },
            { label: "Kansellert", value: nf.format(data.canceled) },
          ],
          tables: [
            {
              title: "Abonnement per plan",
              columns: ["Plan", "Antall", "MRR (EUR)"],
              rows: data.byPlan.map((p) => [p.label, nf.format(p.count), cf.format(p.mrr)]),
            },
            {
              title: "Nye abonnement per måned",
              columns: ["Måned", "Nye"],
              rows: data.monthly.map((m) => [m.month, nf.format(m.count)]),
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
          Abonnementsdata kan ikke fordeles per nettsted ({siteLabel(site)}) — ingen kobling mellom abonnement og
          nettsted i dataene. Tallene under er globale for hele AutoVere.
        </p>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Abonnement per plan">
          <ul className="space-y-3 text-sm">
            {data.byPlan.map((p) => (
              <li key={p.plan} className="flex items-center justify-between gap-4">
                <span className="text-foreground/85 print:text-neutral-800">{p.label}</span>
                <span className="font-semibold">
                  {nf.format(p.count)} · {cf.format(p.mrr)}/mnd
                </span>
              </li>
            ))}
            {data.byPlan.length === 0 && <li className="text-muted-foreground">Ingen aktive abonnement ennå.</li>}
          </ul>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Totalt registrert</dt>
              <dd className="font-semibold">{nf.format(data.total)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Kansellert</dt>
              <dd className="font-semibold">{nf.format(data.canceled)}</dd>
            </div>
          </dl>
        </Panel>
        <Panel title="Nye abonnement per måned">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthly}>
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
    </div>
  );
}
