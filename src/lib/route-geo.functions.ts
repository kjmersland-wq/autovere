import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type RouteGeo = {
  coords: [number, number][]; // [lat, lng]
  distanceKm: number;
  durationMin: number;
  from: { name: string; lat: number; lng: number };
  to: { name: string; lat: number; lng: number };
};

const UA = "AutoVere/1.0 (road trip cost planner; contact: kjmersland@gmail.com)";

const cache = new Map<string, RouteGeo | null>();

async function geocode(query: string): Promise<{ name: string; lat: number; lng: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  if (!res.ok) return null;
  const json = (await res.json()) as { lat: string; lon: string; display_name: string }[];
  const hit = json[0];
  if (!hit) return null;
  return { name: hit.display_name, lat: Number(hit.lat), lng: Number(hit.lon) };
}

export const getRouteGeo = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ origin: z.string().min(2).max(120), destination: z.string().min(2).max(120) }).parse(data),
  )
  .handler(async ({ data }): Promise<RouteGeo | null> => {
    const key = `${data.origin.toLowerCase().trim()}|${data.destination.toLowerCase().trim()}`;
    if (cache.has(key)) return cache.get(key) ?? null;

    try {
      const [from, to] = await Promise.all([geocode(data.origin), geocode(data.destination)]);
      if (!from || !to) {
        cache.set(key, null);
        return null;
      }

      const osrm = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
      const res = await fetch(osrm, { headers: { "User-Agent": UA } });
      if (!res.ok) {
        cache.set(key, null);
        return null;
      }
      const json = (await res.json()) as {
        routes?: { distance: number; duration: number; geometry: { coordinates: [number, number][] } }[];
      };
      const route = json.routes?.[0];
      if (!route) {
        cache.set(key, null);
        return null;
      }

      const raw = route.geometry.coordinates;
      const step = Math.max(1, Math.floor(raw.length / 600));
      const coords: [number, number][] = raw
        .filter((_, i) => i % step === 0 || i === raw.length - 1)
        .map(([lng, lat]) => [lat, lng] as [number, number]);

      const result: RouteGeo = {
        coords,
        distanceKm: Math.round(route.distance / 1000),
        durationMin: Math.round(route.duration / 60),
        from,
        to,
      };
      cache.set(key, result);
      return result;
    } catch {
      cache.set(key, null);
      return null;
    }
  });
