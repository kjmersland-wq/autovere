import { createFileRoute } from "@tanstack/react-router";

/** Temporary diagnostic endpoint: verifies outbound geocoder reachability. */
export const Route = createFileRoute("/api/public/geo-selftest")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const q = new URL(request.url).searchParams;
        if (q.get("route")) {
          const { getRouteGeo } = await import("@/lib/route-geo.functions");
          try {
            const geo = await getRouteGeo({
              data: { origin: q.get("from") ?? "Hirtshals, Denmark", destination: q.get("to") ?? "Gabin, Poland" },
            });
            return new Response(
              JSON.stringify(geo ? { countries: geo.countries, borders: geo.borders, km: geo.distanceKm } : null),
              { headers: { "content-type": "application/json" } },
            );
          } catch (e) {
            return new Response(`throw ${String(e).slice(0, 400)}`, { status: 500 });
          }
        }
        const out: Record<string, string> = {};
        for (const [k, url] of [
          ["photon", "https://photon.komoot.io/api?limit=1&q=Hirtshals"],
          ["osrm", "https://router.project-osrm.org/route/v1/driving/9.9,57.5;19.7,52.3?overview=false"],
        ] as const) {
          try {
            const r = await fetch(url, { headers: { "User-Agent": "AutoVere/1.0", Accept: "application/json" } });
            out[k] = `${r.status} ${(await r.text()).slice(0, 80)}`;
          } catch (e) {
            out[k] = `throw ${String(e).slice(0, 120)}`;
          }
        }
        return new Response(JSON.stringify(out), { headers: { "content-type": "application/json" } });
      },
    },
  },
});
