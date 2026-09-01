import { createFileRoute } from "@tanstack/react-router";

/** Temporary diagnostic endpoint: verifies outbound geocoder reachability. */
export const Route = createFileRoute("/api/public/geo-selftest")({
  server: {
    handlers: {
      GET: async () => {
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
