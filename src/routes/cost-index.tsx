import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";
import { SEO_CORRIDORS } from "@/data/seo-corridors";
import { absUrl } from "@/lib/seo";

const title = "Norway road toll index 2026 — what the most driven roads cost | AutoVere";
const description =
  "Toll cost per route and per 100 km for Norway's most driven roads, from Oslo–Bergen to the cabin roads. Calculated gantry by gantry from the national toll register.";

type Row = { slug: string; name: string; km: number; low: number; high: number; mid: number; per100: number };

const rows: Row[] = SEO_CORRIDORS.filter((c) => c.countriesTraversed.length === 1 && c.countriesTraversed[0] === "NO")
  .map((c) => {
    const nums = c.tollsOverview.car.range.match(/\d+/g)?.map(Number) ?? [];
    const low = nums[0] ?? 0;
    const high = nums[1] ?? low;
    const mid = (low + high) / 2;
    return {
      slug: c.slug,
      name: `${c.origin.name} → ${c.destination.name}`,
      km: c.distanceKm,
      low,
      high,
      mid,
      per100: Math.round((mid / c.distanceKm) * 100),
    };
  })
  .sort((a, b) => b.per100 - a.per100);

export const Route = createFileRoute("/cost-index")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absUrl("/cost-index") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absUrl("/cost-index") }],
  }),
  component: CostIndex,
});

function CostIndex() {
  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-12">
        <p className="text-xs uppercase tracking-[0.22em] text-amber-300/90">AutoVere cost index</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Norway road toll index 2026</h1>
        <p className="mt-4 text-muted-foreground">
          Gantry tolls only, car, one way — fastest route (high) to toll-optimised route (low). Ferries and fuel are not
          included. Ranked by toll cost per 100 km, the most expensive roads first.
        </p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">km</th>
                <th className="px-4 py-3">Tolls (NOK)</th>
                <th className="px-4 py-3">Per 100 km</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.slug} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <a href={`/routes/${r.slug}`} className="font-medium text-amber-300 hover:underline">
                      {r.name}
                    </a>
                  </td>
                  <td className="px-4 py-3">{r.km}</td>
                  <td className="px-4 py-3">
                    {r.low}–{r.high}
                  </td>
                  <td className="px-4 py-3">≈ {r.per100}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs italic text-muted-foreground">
          Source: Statens vegvesen NVDB toll register (CC BY 4.0), checked 13 Sep 2026. Estimates — your route, car and
          AutoPASS tag change the real bill. Data is also available as JSON at /api/public/costs.
        </p>
      </div>
    </main>
  );
}
