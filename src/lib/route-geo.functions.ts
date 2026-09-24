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

const UA = "AutoVere/1.0 (road trip cost planner; contact: kjell@autovere.com)";

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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Photon (Komoot) is the primary geocoder: keyless, OSM-backed and tolerant of
 * the burst of corridor samples we need. Nominatim stays as a slow, serialised
 * fallback for the rare query Photon cannot resolve.
 */
type PhotonFeature = {
  geometry?: { coordinates?: [number, number] };
  properties?: {
    osm_key?: string;
    osm_value?: string;
    name?: string;
    city?: string;
    district?: string;
    locality?: string;
    county?: string;
    state?: string;
    country?: string;
    countrycode?: string;
  };
};

async function photon(path: string): Promise<{ features?: PhotonFeature[] } | null> {
  try {
    const res = await fetch(`https://photon.komoot.io/${path}`, {
      headers: { "User-Agent": UA, Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as { features?: PhotonFeature[] };
  } catch {
    return null;
  }
}

/** Nominatim allows ~1 request/second, so serialise + back off on 429. */
let nominatimChain: Promise<unknown> = Promise.resolve();
const MIN_GAP_MS = 1200;
let lastCall = 0;

function nominatim(url: string, attempt = 0): Promise<Response | null> {
  const run = async (): Promise<Response | null> => {
    const wait = MIN_GAP_MS - (Date.now() - lastCall);
    if (wait > 0) await sleep(wait);
    lastCall = Date.now();
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
      if ((res.status === 429 || res.status >= 500) && attempt < 2) {
        await sleep(1500 * (attempt + 1));
        return nominatim(url, attempt + 1);
      }
      return res.ok ? res : null;
    } catch {
      return null;
    }
  };
  const next = nominatimChain.then(run, run);
  nominatimChain = next.catch(() => undefined);
  return next;
}

const geocodeCache = new Map<string, { name: string; lat: number; lng: number } | null>();

/**
 * Photon ranks a same-named village above the city now and then ("Munich" →
 * a village in North Dakota). When the top hit is a village or hamlet and a
 * city/town of the same query is also returned, take the larger place.
 */
const SMALL_PLACES = new Set(["village", "hamlet", "isolated_dwelling", "locality"]);
const LARGE_PLACES = new Set(["city", "town", "municipality"]);

async function geocode(query: string): Promise<{ name: string; lat: number; lng: number } | null> {
  const key = query.toLowerCase().trim();
  if (geocodeCache.has(key)) return geocodeCache.get(key) ?? null;

  let out: { name: string; lat: number; lng: number } | null = null;

  const pj = await photon(`api?limit=5&q=${encodeURIComponent(query)}`);
  const features = pj?.features ?? [];
  const isPlace = (ft: PhotonFeature | undefined, set: Set<string>) =>
    ft?.properties?.osm_key === "place" && set.has(ft.properties.osm_value ?? "");
  const feat = isPlace(features[0], SMALL_PLACES)
    ? (features.find((ft) => isPlace(ft, LARGE_PLACES)) ?? features[0])
    : features[0];
  if (feat?.geometry?.coordinates) {
    const [lng, lat] = feat.geometry.coordinates as [number, number];
    const p = feat.properties ?? {};
    out = {
      name: [p.name, p.city, p.state, p.country].filter(Boolean).join(", ") || query,
      lat,
      lng,
    };
  }

  if (!out) {
    const res = await nominatim(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`,
    );
    if (res) {
      const json = (await res.json()) as { lat: string; lon: string; display_name: string }[];
      const hit = json[0];
      if (hit) out = { name: hit.display_name, lat: Number(hit.lat), lng: Number(hit.lon) };
    }
  }

  if (out) geocodeCache.set(key, out);
  return out;
}

type ReverseHit = { code: string; country: string; place: string; state?: string };

/** Grid-keyed cache (≈10 km cells) so repeated corridors reuse geocodes. */
const reverseCache = new Map<string, ReverseHit | null>();

async function reverse(lat: number, lng: number): Promise<ReverseHit | null> {
  const cacheKey = `${lat.toFixed(1)},${lng.toFixed(1)}`;
  if (reverseCache.has(cacheKey)) return reverseCache.get(cacheKey) ?? null;

  let hit: ReverseHit | null = null;

  const pj = await photon(`reverse?lat=${lat}&lon=${lng}`);
  const p = pj?.features?.[0]?.properties;
  if (p?.countrycode) {
    hit = {
      code: String(p.countrycode).toUpperCase(),
      country: p.country ?? String(p.countrycode).toUpperCase(),
      place: p.city ?? p.district ?? p.locality ?? p.county ?? p.state ?? p.country ?? "",
    };
    if (p.state) hit.state = p.state;
  }

  if (!hit) {
    const res = await nominatim(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=10&lat=${lat}&lon=${lng}`,
    );
    if (res) {
      const json = (await res.json()) as { address?: Record<string, string> };
      const a = json.address;
      if (a?.["country_code"]) {
        hit = {
          code: a["country_code"]!.toUpperCase(),
          country: a["country"] ?? a["country_code"]!.toUpperCase(),
          place:
            a["city"] ??
            a["town"] ??
            a["village"] ??
            a["municipality"] ??
            a["county"] ??
            a["state"] ??
            a["country"] ??
            "",
        };
        if (a["state"]) hit.state = a["state"];
      }
    }
  }

  if (hit) reverseCache.set(cacheKey, hit);
  return hit;
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
  const count = Math.min(20, Math.max(8, Math.round(totalKm / 60)));

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

type Locked = { name: string; lat: number; lng: number } | undefined;

async function buildRouteGeo(
  origin: string,
  destination: string,
  lockedFrom?: Locked,
  lockedTo?: Locked,
  via: string[] = [],
): Promise<RouteGeo | null> {
  // Coordinates picked from the autocomplete are authoritative — never re-geocode them.
  const [from, to, ...hits] = await Promise.all([
    lockedFrom ?? geocode(origin),
    lockedTo ?? geocode(destination),
    ...via.map((name) => geocode(name)),
  ]);
  if (!from || !to) return null;
  // Via stops are routed through in order; one that can't be found fails the
  // whole route rather than silently pricing a different trip.
  if (hits.some((h) => !h)) return null;
  const stops = hits as { lat: number; lng: number }[];

  const path = [from, ...stops, to].map((p) => `${p.lng},${p.lat}`).join(";");
  const osrm = `https://router.project-osrm.org/route/v1/driving/${path}?overview=full&geometries=geojson`;
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

const point = z.object({ name: z.string().min(1).max(160), lat: z.number(), lng: z.number() });

export const getRouteGeo = createServerFn({ method: "GET" })
  .validator((data) =>
    z
      .object({
        origin: z.string().min(2).max(160),
        destination: z.string().min(2).max(160),
        /** Coordinates locked in by the autocomplete selection. */
        fromPoint: point.optional(),
        toPoint: point.optional(),
        /** Intermediate stops, routed through in this order. */
        via: z.array(z.string().min(2).max(160)).max(3).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<RouteGeo | null> => {
    const coordKey = data.fromPoint && data.toPoint
      ? `${data.fromPoint.lat},${data.fromPoint.lng}|${data.toPoint.lat},${data.toPoint.lng}`
      : `${data.origin.toLowerCase().trim()}|${data.destination.toLowerCase().trim()}`;
    const via = data.via ?? [];
    const viaKey = via.length ? `|via:${via.map((v) => v.toLowerCase().trim()).join(";")}` : "";
    const key = `${coordKey}${viaKey}`;
    if (cache.has(key)) return cache.get(key) ?? null;
    const running = inflight.get(key);
    if (running) return running;

    const task = buildRouteGeo(data.origin, data.destination, data.fromPoint, data.toPoint, via)
      .catch(() => null)
      .then((result) => {
        // Only cache successful lookups — a throttled miss should be retried.
        if (result) cache.set(key, result);
        inflight.delete(key);
        return result;
      });
    inflight.set(key, task);
    return task;
  });
