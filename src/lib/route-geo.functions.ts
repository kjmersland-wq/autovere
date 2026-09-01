import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type RouteSample = {
  atKm: number;
  lat: number;
  lng: number;
  code: string;
  country: string;
  place: string;
  state?: string;
};

export type RouteCountry = {
  code: string;
  country: string;
  flag: string;
  distanceKm: number;
  /** Regions/states touched inside this country, in travel order. */
  states: string[];
  entryPlace: string;
  exitPlace: string;
};

export type RouteBorder = {
  fromCode: string;
  toCode: string;
  fromCountry: string;
  toCountry: string;
  atKm: number;
  place: string;
};

export type RouteGeo = {
  coords: [number, number][]; // [lat, lng]
  distanceKm: number;
  durationMin: number;
  from: { name: string; lat: number; lng: number };
  to: { name: string; lat: number; lng: number };
  countries: RouteCountry[];
  borders: RouteBorder[];
  samples: RouteSample[];
};

const UA = "AutoVere/1.0 (road trip cost planner; contact: kjmersland@gmail.com)";

const cache = new Map<string, RouteGeo | null>();
const inflight = new Map<string, Promise<RouteGeo | null>>();

function flagFor(code: string) {
  if (!/^[a-z]{2}$/i.test(code)) return "📍";
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((c) => 127397 + c.charCodeAt(0)),
  );
}

function haversine(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const la1 = (a[0] * Math.PI) / 180;
  const la2 = (b[0] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

async function geocode(query: string): Promise<{ name: string; lat: number; lng: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
  console.log("[route-geo] geocode status", res.status, (await res.clone().text()).slice(0, 120));
  if (!res.ok) return null;
  const json = (await res.json()) as { lat: string; lon: string; display_name: string }[];
  const hit = json[0];
  if (!hit) return null;
  return { name: hit.display_name, lat: Number(hit.lat), lng: Number(hit.lon) };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type ReverseHit = { code: string; country: string; place: string; state?: string };

/** Grid-keyed cache (≈10 km cells) so repeated corridors reuse geocodes. */
const reverseCache = new Map<string, ReverseHit | null>();

async function reverse(lat: number, lng: number, attempt = 0): Promise<ReverseHit | null> {
  const cacheKey = `${lat.toFixed(1)},${lng.toFixed(1)}`;
  if (reverseCache.has(cacheKey)) return reverseCache.get(cacheKey) ?? null;
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&lat=${lat}&lon=${lng}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
    if ((res.status === 429 || res.status >= 500) && attempt < 2) {
      await sleep(1200 * (attempt + 1));
      return reverse(lat, lng, attempt + 1);
    }
    if (!res.ok) return null;
    const json = (await res.json()) as {
      address?: Record<string, string>;
    };
    const a = json.address;
    if (!a?.["country_code"]) return null;
    const place =
      a["city"] ??
      a["town"] ??
      a["village"] ??
      a["municipality"] ??
      a["suburb"] ??
      a["county"] ??
      a["state"] ??
      a["country"] ??
      "";
    const hit: ReverseHit = {
      code: a["country_code"]!.toUpperCase(),
      country: a["country"] ?? a["country_code"]!.toUpperCase(),
      place,
    };
    if (a["state"]) hit.state = a["state"];
    reverseCache.set(cacheKey, hit);
    return hit;
  } catch {
    return null;
  }
}

/** Reverse-geocode evenly spaced points along the routed polyline. */
async function sampleCorridor(
  coords: [number, number][],
  totalKm: number,
): Promise<RouteSample[]> {
  // cumulative distance per vertex
  const cum: number[] = [0];
  for (let i = 1; i < coords.length; i += 1) {
    cum.push(cum[i - 1]! + haversine(coords[i - 1]!, coords[i]!));
  }
  const measured = cum[cum.length - 1] || totalKm || 1;
  // Nominatim allows ~1 request/second, so keep the sample count modest.
  const count = Math.min(14, Math.max(6, Math.round(totalKm / 90)));

  const targets: { atKm: number; lat: number; lng: number }[] = [];
  for (let i = 0; i < count; i += 1) {
    const target = (measured * (i + 0.5)) / count;
    let idx = cum.findIndex((d) => d >= target);
    if (idx < 0) idx = coords.length - 1;
    const c = coords[idx]!;
    targets.push({ atKm: (totalKm * (i + 0.5)) / count, lat: c[0], lng: c[1] });
  }

  const samples: RouteSample[] = [];
  for (const t of targets) {
    const hit = await reverse(t.lat, t.lng);
    if (hit) {
      const s: RouteSample = {
        atKm: Math.round(t.atKm),
        lat: t.lat,
        lng: t.lng,
        code: hit.code,
        country: hit.country,
        place: hit.place,
      };
      if (hit.state) s.state = hit.state;
      samples.push(s);
    }
    await sleep(1050);
  }
  return samples;
}

function summarise(samples: RouteSample[], totalKm: number) {
  const countries: RouteCountry[] = [];
  const borders: RouteBorder[] = [];
  if (samples.length === 0) return { countries, borders };

  const n = samples.length;
  samples.forEach((s, i) => {
    const start = i === 0 ? 0 : (samples[i - 1]!.atKm + s.atKm) / 2;
    const end = i === n - 1 ? totalKm : (s.atKm + samples[i + 1]!.atKm) / 2;
    const span = Math.max(0, end - start);

    const last = countries[countries.length - 1];
    if (last && last.code === s.code) {
      last.distanceKm += span;
      last.exitPlace = s.place || last.exitPlace;
      if (s.state && !last.states.includes(s.state)) last.states.push(s.state);
    } else {
      if (last) {
        borders.push({
          fromCode: last.code,
          toCode: s.code,
          fromCountry: last.country,
          toCountry: s.country,
          atKm: Math.round(start),
          place: s.place || last.exitPlace,
        });
      }
      countries.push({
        code: s.code,
        country: s.country,
        flag: flagFor(s.code),
        distanceKm: span,
        states: s.state ? [s.state] : [],
        entryPlace: s.place,
        exitPlace: s.place,
      });
    }
  });

  // Merge duplicate re-entries (e.g. DE → NL → DE) into ordered legs but keep them distinct.
  countries.forEach((c) => {
    c.distanceKm = Math.round(c.distanceKm);
  });
  return { countries, borders };
}

async function buildRouteGeo(origin: string, destination: string): Promise<RouteGeo | null> {
  const [from, to] = await Promise.all([geocode(origin), geocode(destination)]);
  console.log("[route-geo] geocode", origin, !!from, destination, !!to);
  if (!from || !to) return null;

  const osrm = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
  const res = await fetch(osrm, { headers: { "User-Agent": UA } });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    routes?: { distance: number; duration: number; geometry: { coordinates: [number, number][] } }[];
  };
  const route = json.routes?.[0];
  if (!route) return null;

  const raw = route.geometry.coordinates;
  const step = Math.max(1, Math.floor(raw.length / 600));
  const coords: [number, number][] = raw
    .filter((_, i) => i % step === 0 || i === raw.length - 1)
    .map(([lng, lat]) => [lat, lng] as [number, number]);

  const distanceKm = Math.round(route.distance / 1000);
  const samples = await sampleCorridor(coords, distanceKm);
  const { countries, borders } = summarise(samples, distanceKm);
  console.log("[route-geo] samples", samples.length, countries.map((c) => c.code).join(">"));

  return {
    coords,
    distanceKm,
    durationMin: Math.round(route.duration / 60),
    from,
    to,
    countries,
    borders,
    samples,
  };
}

export const getRouteGeo = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ origin: z.string().min(2).max(120), destination: z.string().min(2).max(120) }).parse(data),
  )
  .handler(async ({ data }): Promise<RouteGeo | null> => {
    const key = `${data.origin.toLowerCase().trim()}|${data.destination.toLowerCase().trim()}`;
    if (cache.has(key)) return cache.get(key) ?? null;
    const running = inflight.get(key);
    if (running) return running;

    const task = buildRouteGeo(data.origin, data.destination)
      .catch((err) => {
        console.error("[route-geo] failed", err);
        return null;
      })
      .then((result) => {
        // Only cache successful lookups — a throttled miss should be retried.
        if (result) cache.set(key, result);
        inflight.delete(key);
        return result;
      });
    inflight.set(key, task);
    return task;
  });
