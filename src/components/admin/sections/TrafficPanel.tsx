import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useServerFn } from "@tanstack/react-start";

import { Panel } from "@/components/admin/AdminUi";
import { nf } from "@/components/admin/adminFormat";
import { useAdminQuery, statusMessage } from "@/components/admin/useAdminQuery";
import { getGlobalOverview, getSiteBreakdown } from "@/lib/admin-data.functions";
import { siteLabel } from "@/components/admin/siteOptions";

type DailyPoint = { date: string; views: number };
type PathRow = { path: string; views: number };

function TrafficCharts({ daily, topPaths, title }: { daily: DailyPoint[]; topPaths: PathRow[]; title: string }) {
  return (
    <>
      <Panel title={title}>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={daily}>
              <defs>
                <linearGradient id="traffic-views" x1="0" y1="0" x2="0" y2="1">
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
              <Area type="monotone" dataKey="views" stroke="#f59e0b" fill="url(#traffic-views)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="mt-4">
        <Panel title="Mest besøkte sider">
          <ul className="space-y-2 text-sm">
            {topPaths.map((p) => (
              <li key={p.path} className="flex justify-between gap-4">
                <span className="truncate text-foreground/80 print:text-neutral-800">{p.path}</span>
                <span className="font-semibold">{nf.format(p.views)}</span>
              </li>
            ))}
            {topPaths.length === 0 && <li className="text-muted-foreground">Ingen registrerte besøk ennå.</li>}
          </ul>
        </Panel>
      </div>
    </>
  );
}

function GlobalTraffic() {
  const fetchOverview = useServerFn(getGlobalOverview);
  const { loading, result } = useAdminQuery(fetchOverview);

  if (loading || !result) return <p className="text-sm text-muted-foreground">Henter tall …</p>;
  if (result.status !== "ok") {
    return <p className="text-sm text-destructive">{statusMessage(result.status, "message" in result ? result.message : undefined)}</p>;
  }
  return (
    <TrafficCharts
      daily={result.data.traffic.daily}
      topPaths={result.data.traffic.topPaths}
      title="Besøk per dag, hele plattformen (30 dager)"
    />
  );
}

function SiteTraffic({ site }: { site: string }) {
  const fetchSites = useServerFn(getSiteBreakdown);
  const { loading, result } = useAdminQuery(fetchSites);

  if (loading || !result) return <p className="text-sm text-muted-foreground">Henter tall …</p>;
  if (result.status !== "ok") {
    return <p className="text-sm text-destructive">{statusMessage(result.status, "message" in result ? result.message : undefined)}</p>;
  }
  const row = result.data.sites.find((s) => s.prefix === site);
  if (!row) return <p className="text-sm text-muted-foreground">Ingen data for dette nettstedet ennå.</p>;

  return (
    <TrafficCharts
      daily={row.daily}
      topPaths={row.topPaths}
      title={`Besøk per dag — ${siteLabel(site)} (30 dager)`}
    />
  );
}

export function TrafficPanel({ site }: { site: string | null }) {
  return site === null ? <GlobalTraffic /> : <SiteTraffic site={site} />;
}
