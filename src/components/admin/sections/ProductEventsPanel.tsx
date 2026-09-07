import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Metric, Panel } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { nf } from "@/components/admin/adminFormat";
import { statusMessage, useAdminQuery } from "@/components/admin/useAdminQuery";
import { eventLabel, funnelFindings } from "@/components/admin/productEvents";
import { getProductEvents, type ProductEventStats } from "@/lib/admin-data.functions";

const TONE_CLASS = {
  positive: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  warning: "border-destructive/30 bg-destructive/10 text-destructive",
  neutral: "border-primary/25 bg-primary/10 text-primary",
} as const;

function EventsContent({ data }: { data: ProductEventStats }) {
  const [exporting, setExporting] = useState(false);
  const findings = funnelFindings(data);
  const chart = data.byEvent.map((e) => ({ label: eventLabel(e.event), value: e.last30 }));

  const exportPdf = async () => {
    setExporting(true);
    try {
      const { generateAreaDataPdf } = await import("@/components/admin/pdf/generateAreaDataPdf");
      await generateAreaDataPdf({
        areaLabel: "Produkthendelser",
        periodLabel: "Siste 30 dager (hendelser), siste 90 dager (totaler)",
        generatedAtLabel: new Date().toLocaleString("nb-NO"),
        block: {
          kpis: [
            { label: "Hendelser siste 7 dager", value: nf.format(data.last7) },
            { label: "Hendelser siste 30 dager", value: nf.format(data.last30) },
            { label: "Fullførte beregninger", value: `${data.funnel.calcSuccessRate} %` },
            { label: "Resultat sett", value: `${data.funnel.resultViewRate} %` },
          ],
          chart: { title: "Hendelser siste 30 dager", type: "bar", series: chart },
          tables: [
            {
              title: "Hendelser i detalj",
              columns: ["Hendelse", "7 dager", "30 dager", "90 dager", "Unike besøkende"],
              rows: data.byEvent.map((e) => [
                eventLabel(e.event),
                nf.format(e.last7),
                nf.format(e.last30),
                nf.format(e.total90),
                nf.format(e.visitors),
              ]),
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Hendelser siste 7 dager" value={nf.format(data.last7)} hint={`${nf.format(data.prev7)} uken før`} />
        <Metric label="Beregninger startet (30 d)" value={nf.format(data.funnel.calculateClicked)} />
        <Metric label="Beregninger fullført (30 d)" value={`${nf.format(data.funnel.tripCalculated)} · ${data.funnel.calcSuccessRate} %`} />
        <Metric label="Resultat vist (30 d)" value={`${nf.format(data.funnel.resultViewed)} · ${data.funnel.resultViewRate} %`} />
      </div>

      <Panel title="Hendelser siste 30 dager">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} height={60} angle={-15} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#0b1220", border: "1px solid #1f2937", borderRadius: 12 }}
                formatter={(v: number) => [nf.format(v), "Hendelser"]}
              />
              <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {data.byEvent.length === 0 && (
          <p className="mt-3 text-sm text-muted-foreground">Ingen registrerte hendelser ennå.</p>
        )}
      </Panel>

      <Panel title="Hendelser i detalj">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <th className="py-2">Hendelse</th>
                <th className="py-2 text-right">7 dager</th>
                <th className="py-2 text-right">30 dager</th>
                <th className="py-2 text-right">90 dager</th>
                <th className="py-2 text-right">Unike besøkende</th>
              </tr>
            </thead>
            <tbody>
              {data.byEvent.map((e) => (
                <tr key={e.event} className="border-t border-border/60">
                  <td className="py-2">{eventLabel(e.event)}</td>
                  <td className="py-2 text-right">{nf.format(e.last7)}</td>
                  <td className="py-2 text-right">{nf.format(e.last30)}</td>
                  <td className="py-2 text-right">{nf.format(e.total90)}</td>
                  <td className="py-2 text-right">{nf.format(e.visitors)}</td>
                </tr>
              ))}
              {data.byEvent.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-3 text-muted-foreground">
                    Ingen registrerte hendelser ennå.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Konklusjoner — planleggertrakt">
        <ul className="space-y-2">
          {findings.map((f) => (
            <li key={f.text} className={`rounded-xl border px-3 py-2 text-sm ${TONE_CLASS[f.tone]}`}>
              {f.text}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

/** Product-event usage (planner funnel and feature usage), shown in
 * Trafikk and Analyse. Fetches independently of every other panel. */
export function ProductEventsPanel() {
  const fetchEvents = useServerFn(getProductEvents);
  const { loading, result } = useAdminQuery(fetchEvents);

  if (loading || !result) return <p className="text-sm text-muted-foreground">Henter produkthendelser …</p>;
  if (result.status !== "ok") {
    return (
      <p className="text-sm text-destructive">
        {statusMessage(result.status, "message" in result ? result.message : undefined)}
      </p>
    );
  }
  return <EventsContent data={result.data} />;
}
