import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2 } from "lucide-react";

import { Panel } from "@/components/admin/AdminUi";
import { Button } from "@/components/ui/button";
import { COUNTRY_NO, PIE_COLORS, REGION_NO, nf } from "@/components/admin/adminFormat";
import { useAdminQuery, statusMessage } from "@/components/admin/useAdminQuery";
import { getMarketBreakdown, getSiteBreakdown } from "@/lib/admin-data.functions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function ByVisitorCountry() {
  const fetchMarkets = useServerFn(getMarketBreakdown);
  const { loading, result } = useAdminQuery(fetchMarkets);

  if (loading || !result) return <p className="text-sm text-muted-foreground">Henter tall …</p>;
  if (result.status !== "ok") {
    return <p className="text-sm text-destructive">{statusMessage(result.status, "message" in result ? result.message : undefined)}</p>;
  }
  const { data } = result;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Besøk per land (besøkendes plassering)">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.countries.map((c) => ({ name: COUNTRY_NO[c.country] ?? c.country, views: c.views }))}
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
        {data.countries.length === 0 && (
          <p className="text-sm text-muted-foreground">Land registreres automatisk så snart det er trafikk.</p>
        )}
      </Panel>
      <Panel title="Region">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.regions.map((r) => ({ name: REGION_NO[r.region] ?? r.region, value: r.views }))}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
              >
                {data.regions.map((_, i) => (
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
  );
}

function BySite() {
  const fetchSites = useServerFn(getSiteBreakdown);
  const { loading, result } = useAdminQuery(fetchSites);

  if (loading || !result) return <p className="text-sm text-muted-foreground">Henter tall …</p>;
  if (result.status !== "ok") {
    return <p className="text-sm text-destructive">{statusMessage(result.status, "message" in result ? result.message : undefined)}</p>;
  }

  return (
    <Panel title="Etter AutoVere-nettsted">
      <p className="text-xs text-muted-foreground">
        Basert på hvilket språk/nettsted besøket skjedde på — uavhengig av besøkendes faktiske land. Brukere,
        registreringer og inntekt kan foreløpig ikke fordeles per nettsted (ingen kobling i dataene mellom besøk og
        konto), og vises derfor som ikke tilgjengelig.
      </p>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Nettsted</TableHead>
            <TableHead className="text-right">Besøk (7d)</TableHead>
            <TableHead className="text-right">Besøk (30d)</TableHead>
            <TableHead className="text-right">Andel av total</TableHead>
            <TableHead className="text-right">Brukere</TableHead>
            <TableHead className="text-right">Inntekt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.data.sites.map((s) => (
            <TableRow key={s.prefix}>
              <TableCell>
                {s.flag} {s.label}
              </TableCell>
              <TableCell className="text-right">{nf.format(s.visits7)}</TableCell>
              <TableCell className="text-right">{nf.format(s.visits30)}</TableCell>
              <TableCell className="text-right">{s.shareOfTotalPct} %</TableCell>
              <TableCell className="text-right text-muted-foreground">Ikke tilgjengelig</TableCell>
              <TableCell className="text-right text-muted-foreground">Ikke tilgjengelig</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Panel>
  );
}

function ExportMarketsPdf() {
  const [exporting, setExporting] = useState(false);
  const fetchMarkets = useServerFn(getMarketBreakdown);
  const fetchSites = useServerFn(getSiteBreakdown);
  const markets = useAdminQuery(fetchMarkets);
  const sites = useAdminQuery(fetchSites);

  const disabled = exporting || markets.loading || sites.loading || markets.result?.status !== "ok" || sites.result?.status !== "ok";

  const exportPdf = async () => {
    if (markets.result?.status !== "ok" || sites.result?.status !== "ok") return;
    setExporting(true);
    try {
      const { generateAreaDataPdf } = await import("@/components/admin/pdf/generateAreaDataPdf");
      await generateAreaDataPdf({
        areaLabel: "Markeder",
        periodLabel: "Siste 90 dager",
        generatedAtLabel: new Date().toLocaleString("nb-NO"),
        block: {
          tables: [
            {
              title: "Besøk per land",
              columns: ["Land", "Besøk"],
              rows: markets.result.data.countries.map((c) => [COUNTRY_NO[c.country] ?? c.country, nf.format(c.views)]),
            },
            {
              title: "Etter AutoVere-nettsted",
              columns: ["Nettsted", "Besøk (7d)", "Besøk (30d)", "Andel av total"],
              rows: sites.result.data.sites.map((s) => [
                `${s.flag} ${s.label}`,
                nf.format(s.visits7),
                nf.format(s.visits30),
                `${s.shareOfTotalPct} %`,
              ]),
            },
          ],
        },
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex justify-end">
      <Button variant="outline" size="sm" onClick={() => void exportPdf()} disabled={disabled}>
        {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
        Eksporter PDF
      </Button>
    </div>
  );
}

export function MarketsPanel({ site }: { site: string | null }) {
  return (
    <div className="space-y-4">
      <ExportMarketsPdf />
      {site && (
        <p className="rounded-lg border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
          Markedsdata vises globalt uavhengig av valgt nettsted — besøkendes land og AutoVere-nettsted er to
          forskjellige dimensjoner.
        </p>
      )}
      <ByVisitorCountry />
      <BySite />
    </div>
  );
}
