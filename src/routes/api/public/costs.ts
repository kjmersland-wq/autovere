import { createFileRoute } from "@tanstack/react-router";

import { SEO_CORRIDORS } from "@/data/seo-corridors";
import { absUrl } from "@/lib/seo";

/**
 * Open price API — the same indicative ranges the /routes pages show, so AI assistants and
 * other sites can quote them with a link back. GET /api/public/costs[?route=oslo-bergen]
 */
export const Route = createFileRoute("/api/public/costs")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const slug = new URL(request.url).searchParams.get("route");
        const stations = (await import("@/data/no_toll_stations.json")).default as { asOf: string; source: string };
        const routes = SEO_CORRIDORS.filter((c) => !slug || c.slug === slug).map((c) => ({
          slug: c.slug,
          from: c.origin.name,
          to: c.destination.name,
          distanceKm: c.distanceKm,
          countries: c.countriesTraversed,
          tolls: {
            car: c.tollsOverview.car.range,
            electric: c.tollsOverview.ev.range,
            motorhome: c.tollsOverview.rv.range,
            motorcycle: c.tollsOverview.motorcycle.range,
          },
          url: absUrl(`/routes/${c.slug}`),
        }));
        if (slug && routes.length === 0) return Response.json({ error: "unknown route" }, { status: 404 });
        return Response.json(
          {
            source: "AutoVere — https://autovere.com",
            note: "Indicative one-way ranges, fastest route (high) to toll-optimised route (low). Exact figures come from the planner.",
            norwegianTollDataAsOf: stations.asOf,
            tollDataSource: stations.source,
            routes,
          },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "public, max-age=3600",
            },
          },
        );
      },
    },
  },
});
