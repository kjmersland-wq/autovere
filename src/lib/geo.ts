import type { LatLng } from "./countries";

export type Place = {
  id: string;
  name: string;
  label: string;
  lat: number;
  lon: number;
  country?: string | undefined;
};

const NOMINATIM = "https://nominatim.openstreetmap.org";
const OSRM = "https://router.project-osrm.org";
const OVERPASS = "https://overpass-api.de/api/interpreter";

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  if (query.trim().length < 2) return [];
  const url = `${NOMINATIM}/search?format=jsonv2&addressdetails=1&limit=6&accept-language=en&q=${encodeURIComponent(
    query,
  )}`;
  const res = await fetch(url, { signal: signal ?? null, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Place lookup failed");
  const data = (await res.json()) as Array<{
    place_id: number;
    display_name: string;
    name?: string;
    lat: string;
    lon: string;
    address?: { country_code?: string };
  }>;
  return data.map((d) => ({
    id: String(d.place_id),
    name: d.name || d.display_name.split(",")[0]!,
    label: d.display_name,
    lat: Number(d.lat),
    lon: Number(d.lon),
    country: d.address?.country_code?.toUpperCase(),
  }));
}

export type RouteResult = {
  distanceKm: number;
  durationMin: number;
  coords: LatLng[];
};

export type RouteVariantKey = "fastest" | "bypass" | "tollfree";

export async function fetchRoute(
  from: Place,
  to: Place,
  variant: RouteVariantKey,
  signal?: AbortSignal,
): Promise<RouteResult> {
  const params = new URLSearchParams({ overview: "full", geometries: "geojson" });
  const url = `${OSRM}/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?${params}`;
  const res = await fetch(url, { signal: signal ?? null });
  if (!res.ok) throw new Error("Routing service unavailable");
  const data = (await res.json()) as {
    code: string;
    routes?: Array<{
      distance: number;
      duration: number;
      geometry: { coordinates: [number, number][] };
    }>;
  };
  const route = data.routes?.[0];
  if (
    data.code !== "Ok" ||
    !route ||
    !Number.isFinite(route.distance) ||
    !Number.isFinite(route.duration) ||
    !Array.isArray(route.geometry?.coordinates) ||
    route.geometry.coordinates.length < 2
  )
    throw new Error("No route found");

  // The public OSRM demo does not support exclusions. Route tiers use the
  // existing motorway-share cost heuristic and fall back to this route.
  void variant;
  return {
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
    coords: route.geometry.coordinates.map(([lon, lat]) => [lat, lon] as LatLng),
  };
}

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const la1 = (a[0] * Math.PI) / 180;
  const la2 = (b[0] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export type Charger = {
  id: string;
  lat: number;
  lon: number;
  name: string;
  powerKw: number | null;
  operator?: string | undefined;
  atKm: number;
};

type OverpassEl = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

function parsePower(tags: Record<string, string> = {}): number | null {
  const raw =
    tags["charging_station:output"] ||
    tags["socket:type2_combo:output"] ||
    tags["socket:type2_ccs:output"] ||
    tags["maxpower"] ||
    tags["socket:chademo:output"];
  if (!raw) return null;
  const m = raw.match(/([\d.]+)\s*(kw|w)?/i);
  if (!m) return null;
  let val = Number(m[1]);
  if (m[2]?.toLowerCase() === "w" && val > 2000) val = val / 1000;
  return Number.isFinite(val) ? val : null;
}

/** Cumulative distances along the polyline. */
export function cumulativeKm(coords: LatLng[]): number[] {
  const out = [0];
  for (let i = 1; i < coords.length; i++) out.push(out[i - 1]! + haversineKm(coords[i - 1]!, coords[i]!));
  return out;
}

/** Sample the polyline every `stepKm` for corridor queries and country detection. */
export function samplePolyline(coords: LatLng[], stepKm: number): { pt: LatLng; km: number }[] {
  const cum = cumulativeKm(coords);
  const total = cum[cum.length - 1] ?? 0;
  const out: { pt: LatLng; km: number }[] = [];
  let target = 0;
  let i = 0;
  while (target <= total && i < coords.length) {
    while (i < cum.length - 1 && cum[i]! < target) i++;
    out.push({ pt: coords[Math.min(i, coords.length - 1)]!, km: target });
    target += stepKm;
  }
  return out;
}

export async function fetchFastChargers(
  coords: LatLng[],
  signal?: AbortSignal,
): Promise<Charger[]> {
  // Query a set of corridor points instead of a huge bbox to stay fast & polite.
  const anchors = samplePolyline(coords, 120).filter((_, idx) => idx % 1 === 0);
  const limited = anchors.slice(0, 25);
  if (!limited.length) return [];
  const clauses = limited
    .map(({ pt }) => `node(around:12000,${pt[0].toFixed(4)},${pt[1].toFixed(4)})["amenity"="charging_station"];`)
    .join("");
  const query = `[out:json][timeout:25];(${clauses});out center 400;`;
  const res = await fetch(OVERPASS, {
    method: "POST",
    body: "data=" + encodeURIComponent(query),
    signal: signal ?? null,
  });
  if (!res.ok) throw new Error("Charging data unavailable");
  const data = (await res.json()) as { elements: OverpassEl[] };
  const cum = cumulativeKm(coords);
  const chargers: Charger[] = [];
  for (const el of data.elements ?? []) {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat == null || lon == null) continue;
    const power = parsePower(el.tags);
    if (power == null || power < 150) continue;
    // find nearest polyline index for ordering
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < coords.length; i += 5) {
      const d = haversineKm([lat, lon], coords[i]!);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    if (bestD > 15) continue;
    chargers.push({
      id: String(el.id),
      lat,
      lon,
      name: el.tags?.["name"] || el.tags?.["operator"] || "Fast charging station",
      operator: el.tags?.["operator"],
      powerKw: power,
      atKm: cum[best] ?? 0,
    });
  }
  return chargers.sort((a, b) => a.atKm - b.atKm);
}
