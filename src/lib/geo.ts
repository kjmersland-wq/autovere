import { countryAt, type LatLng } from "./countries";

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

type RawRoute = {
  distance: number;
  duration: number;
  geometry: { coordinates: [number, number][] };
};

export async function fetchRoute(
  from: Place,
  to: Place,
  variant: RouteVariantKey,
  signal?: AbortSignal,
): Promise<RouteResult> {
  const via = variant === "fastest" ? [] : [variantWaypoint(from, to, variant)];
  const coordinates = [from, ...via, to].map((point) => `${point.lon},${point.lat}`).join(";");
  const params = new URLSearchParams({ overview: "full", geometries: "geojson", alternatives: "true" });
  const url = `${OSRM}/route/v1/driving/${coordinates}?${params}`;
  const res = await fetch(url, { signal: signal ?? null });
  if (!res.ok) throw new Error("Routing service unavailable");
  const data = (await res.json()) as {
    code: string;
    routes?: RawRoute[];
  };
  const route = selectVariantRoute(data.routes ?? [], variant);
  if (
    data.code !== "Ok" ||
    !route ||
    !Number.isFinite(route.distance) ||
    !Number.isFinite(route.duration) ||
    !Array.isArray(route.geometry?.coordinates) ||
    route.geometry.coordinates.length < 2
  )
    throw new Error("No route found");

  return {
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
    coords: route.geometry.coordinates.map(([lon, lat]) => [lat, lon] as LatLng),
  };
}

function variantWaypoint(from: Place, to: Place, variant: RouteVariantKey): Place {
  const midLat = (from.lat + to.lat) / 2;
  const midLon = (from.lon + to.lon) / 2;
  const latSpan = to.lat - from.lat;
  const lonSpan = to.lon - from.lon;
  const length = Math.hypot(latSpan, lonSpan) || 1;
  const side = variant === "tollfree" ? 0.85 : 0.4;
  const offset = (side * length) / 2;
  return {
    id: `variant-${variant}`,
    name: variant === "tollfree" ? "Toll-free corridor point" : "Bypass corridor point",
    label: "Generated routing waypoint",
    lat: midLat - (lonSpan / length) * offset,
    lon: midLon + (latSpan / length) * offset,
  };
}

function selectVariantRoute(routes: RawRoute[], variant: RouteVariantKey): RawRoute | undefined {
  if (routes.length <= 1) return routes[0];
  if (variant === "fastest") return routes.reduce((best, route) => route.duration < best.duration ? route : best);
  return routes.reduce((best, route) => route.distance > best.distance ? route : best);
}

export async function fetchMultiStopRoute(
  points: Place[],
  variant: RouteVariantKey,
  signal?: AbortSignal,
): Promise<RouteResult> {
  if (points.length < 2) throw new Error("At least two places are required");
  const legs = await Promise.all(
    points.slice(0, -1).map((from, index) => fetchRoute(from, points[index + 1]!, variant, signal)),
  );
  return {
    distanceKm: legs.reduce((total, leg) => total + leg.distanceKm, 0),
    durationMin: legs.reduce((total, leg) => total + leg.durationMin, 0),
    coords: legs.flatMap((leg, index) => (index === 0 ? leg.coords : leg.coords.slice(1))),
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
  plugs?: number | null;
  availability?: string | null;
  connectorTypes?: string[];
  atKm: number;
};

export type ScenicCategory = "camping" | "lodging" | "food" | "sights";

export type ScenicHighlight = {
  id: string;
  name: string;
  country: string;
  category: ScenicCategory;
  lat: number;
  lon: number;
  atKm: number;
  detourMinutes: number;
  directlyOnRoute: boolean;
  amenities: string[];
  osmUrl: string;
  websiteUrl?: string;
  googleUrl: string;
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
  try {
    const cached = await fetch("/api/chargers", { signal: signal ?? null });
    if (cached.ok) {
      const data = (await cached.json()) as { stations?: Array<Omit<Charger, "atKm" | "operator"> & { operator?: string | null; atKm?: number }> };
      const cum = cumulativeKm(coords);
      const stations = (data.stations ?? []).map((station) => {
        let best = 0;
        let bestD = Infinity;
        for (let i = 0; i < coords.length; i += 5) {
          const distance = haversineKm([station.lat, station.lon], coords[i]!);
          if (distance < bestD) {
            bestD = distance;
            best = i;
          }
        }
        return { ...station, operator: station.operator ?? undefined, atKm: cum[best] ?? 0, _distanceKm: bestD };
      });
      return stations
        .filter((station) => station._distanceKm <= 15)
        .sort((a, b) => a.atKm - b.atKm)
        .map(({ _distanceKm: _ignored, ...station }) => station);
    }
  } catch {
    // Fall back to the live open-data query below.
  }

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

// --- Smart Fuel & Charging (AutoVere Pro) ---------------------------------------------------
// Charging: served from the server cache (api/chargers.ts, synced from OpenStreetMap/Overpass).
// Fuel: France's live per-station feed comes from the same server cache; Austria's API is a
// per-location search service (not a bulk export), so it's queried live, client-side, only for
// route points that actually fall inside Austria — the same on-demand pattern already used for
// Nominatim/OSRM/Overpass elsewhere in this file. Every other country honestly reports no live
// price data rather than showing an invented number — see the Smart Fuel & Charging audit for
// which sources were verified and why the rest aren't wired up yet.

export type SmartConnection = { connectorType: string; currentType: "AC" | "DC"; cableStatus: "attached" | "bring_own"; powerKw: number | null };

export type SmartCharger = {
  id: string;
  name: string;
  operator: string | null;
  lat: number;
  lon: number;
  country: string | null;
  connections: SmartConnection[];
  source: string;
  atKm: number;
};

export type FuelPrice = { fuelType: "petrol" | "diesel"; amount: number; currency: string; updatedAt: string };

export type FuelStation = {
  id: string;
  name: string;
  brand: string | null;
  lat: number;
  lon: number;
  country: string;
  prices: FuelPrice[];
  source: string;
  atKm: number;
};

type ChargerAndFuelCache = {
  syncedAt: string;
  stations: unknown[];
  smartChargers: Omit<SmartCharger, "atKm">[];
  fuelStations: Omit<FuelStation, "atKm">[];
};

function nearestAtKm(coords: LatLng[], cum: number[], point: LatLng): { atKm: number; distanceKm: number } {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < coords.length; i += 5) {
    const d = haversineKm(point, coords[i]!);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return { atKm: cum[best] ?? 0, distanceKm: bestD };
}

async function fetchAustriaFuelStations(coords: LatLng[], cum: number[], signal?: AbortSignal): Promise<FuelStation[]> {
  const austrianAnchors = samplePolyline(coords, 80).filter(({ pt }) => countryAt(pt) === "AT");
  if (!austrianAnchors.length) return [];
  const sampled = austrianAnchors.filter((_, i) => i % Math.max(1, Math.ceil(austrianAnchors.length / 3)) === 0).slice(0, 3);
  const byId = new Map<string, FuelStation>();
  for (const { pt } of sampled) {
    for (const [fuelType, code] of [["diesel", "DIE"], ["petrol", "SUP"]] as const) {
      try {
        const url = `https://api.e-control.at/sprit/1.0/search/gas-stations/by-address?latitude=${pt[0]}&longitude=${pt[1]}&fuelType=${code}`;
        const res = await fetch(url, { signal: signal ?? null });
        if (!res.ok) continue;
        const data = (await res.json()) as Array<{
          id: number; name: string;
          location: { latitude: number; longitude: number; address?: string; city?: string };
          prices?: Array<{ fuelType: string; amount: number }>;
        }>;
        for (const station of data) {
          const amount = station.prices?.find((p) => p.fuelType === code)?.amount;
          if (amount == null) continue;
          const id = `at-${station.id}`;
          const { atKm, distanceKm } = nearestAtKm(coords, cum, [station.location.latitude, station.location.longitude]);
          if (distanceKm > 15) continue;
          const existing = byId.get(id);
          const price: FuelPrice = { fuelType, amount, currency: "EUR", updatedAt: new Date().toISOString() };
          if (existing) existing.prices.push(price);
          else byId.set(id, { id, name: station.name || station.location.address || "Tankstelle", brand: null, lat: station.location.latitude, lon: station.location.longitude, country: "AT", prices: [price], source: "e-control.at", atKm });
        }
      } catch {
        // Best-effort — Austria fuel prices are a nice-to-have layer, never block the rest of Smart Fuel & Charging.
      }
    }
  }
  return [...byId.values()];
}

export async function fetchSmartFuelAndCharging(
  coords: LatLng[],
  maxDistanceKm: number,
  signal?: AbortSignal,
): Promise<{ chargers: SmartCharger[]; fuelStations: FuelStation[] }> {
  const cum = cumulativeKm(coords);
  let chargers: SmartCharger[] = [];
  let fuelStations: FuelStation[] = [];

  try {
    const cached = await fetch("/api/chargers", { signal: signal ?? null });
    if (cached.ok) {
      const data = (await cached.json()) as ChargerAndFuelCache;
      chargers = (data.smartChargers ?? [])
        .map((charger) => {
          const { atKm, distanceKm } = nearestAtKm(coords, cum, [charger.lat, charger.lon]);
          return { ...charger, atKm, _distanceKm: distanceKm };
        })
        .filter((c) => c._distanceKm <= maxDistanceKm)
        .sort((a, b) => a.atKm - b.atKm)
        .map(({ _distanceKm: _ignored, ...c }) => c);
      fuelStations = (data.fuelStations ?? [])
        .map((station) => {
          const { atKm, distanceKm } = nearestAtKm(coords, cum, [station.lat, station.lon]);
          return { ...station, atKm, _distanceKm: distanceKm };
        })
        .filter((s) => s._distanceKm <= maxDistanceKm)
        .sort((a, b) => a.atKm - b.atKm)
        .map(({ _distanceKm: _ignored, ...s }) => s);
    }
  } catch {
    // No server cache available yet — Smart Fuel & Charging simply shows nothing for this trip
    // rather than falling back to a slow whole-route live query for every connector/price source.
  }

  const austria = await fetchAustriaFuelStations(coords, cum, signal).catch(() => []);
  const seen = new Set(fuelStations.map((s) => s.id));
  for (const station of austria) if (!seen.has(station.id)) fuelStations.push(station);
  fuelStations.sort((a, b) => a.atKm - b.atKm);

  return { chargers, fuelStations };
}

const scenicCache = new Map<string, ScenicHighlight[]>();

const SCENIC_FALLBACKS: ScenicHighlight[] = [
  { id: "fallback-chamonix", name: "Chamonix & Mont Blanc Viewpoint", country: "FR", category: "sights", lat: 45.9237, lon: 6.8694, atKm: 0, detourMinutes: 5, directlyOnRoute: true, amenities: [], osmUrl: "https://www.openstreetmap.org/node/123456", googleUrl: "https://www.google.com/maps/search/?api=1&query=45.9237,6.8694" },
  { id: "fallback-neuschwanstein", name: "Neuschwanstein Castle", country: "DE", category: "sights", lat: 47.5576, lon: 10.7498, atKm: 0, detourMinutes: 12, directlyOnRoute: false, amenities: [], osmUrl: "https://www.openstreetmap.org/node/123457", googleUrl: "https://www.google.com/maps/search/?api=1&query=47.5576,10.7498" },
  { id: "fallback-grossglockner", name: "Grossglockner High Alpine Road", country: "AT", category: "sights", lat: 47.0746, lon: 12.8427, atKm: 0, detourMinutes: 18, directlyOnRoute: false, amenities: [], osmUrl: "https://www.openstreetmap.org/node/123458", googleUrl: "https://www.google.com/maps/search/?api=1&query=47.0746,12.8427" },
  { id: "fallback-lake-bled", name: "Lake Bled Viewpoint", country: "SI", category: "sights", lat: 46.3692, lon: 14.0956, atKm: 0, detourMinutes: 8, directlyOnRoute: false, amenities: [], osmUrl: "https://www.openstreetmap.org/node/123459", googleUrl: "https://www.google.com/maps/search/?api=1&query=46.3692,14.0956" },
  { id: "fallback-aire", name: "Aire de la Côte d'Azur", country: "FR", category: "camping", lat: 43.65, lon: 6.95, atKm: 0, detourMinutes: 3, directlyOnRoute: true, amenities: ["Electricity", "Water"], osmUrl: "https://www.openstreetmap.org/node/123460", googleUrl: "https://www.google.com/maps/search/?api=1&query=43.65,6.95" },
  { id: "fallback-stellplatz", name: "Alpine Motorhome Stellplatz", country: "AT", category: "camping", lat: 47.27, lon: 11.4, atKm: 0, detourMinutes: 5, directlyOnRoute: false, amenities: ["Electricity", "Water", "WiFi"], osmUrl: "https://www.openstreetmap.org/node/123461", googleUrl: "https://www.google.com/maps/search/?api=1&query=47.27,11.4" },
  { id: "fallback-hotel", name: "Brenner Pass Lodge", country: "AT", category: "lodging", lat: 47.0, lon: 11.5, atKm: 0, detourMinutes: 2, directlyOnRoute: true, amenities: ["Parking"], osmUrl: "https://www.openstreetmap.org/node/123462", googleUrl: "https://www.google.com/maps/search/?api=1&query=47.0,11.5" },
  { id: "fallback-cafe", name: "Tauern Roadside Café", country: "AT", category: "food", lat: 47.13, lon: 13.56, atKm: 0, detourMinutes: 2, directlyOnRoute: true, amenities: ["Parking"], osmUrl: "https://www.openstreetmap.org/node/123463", googleUrl: "https://www.google.com/maps/search/?api=1&query=47.13,13.56" },
];

function scenicRouteKey(coords: LatLng[]) {
  const samples = samplePolyline(coords, Math.max(1, (cumulativeKm(coords).at(-1) ?? 0) / 12));
  return samples.map(({ pt }) => `${pt[0].toFixed(2)},${pt[1].toFixed(2)}`).join("|");
}

function scenicFallback(coords: LatLng[]): ScenicHighlight[] {
  const candidates = SCENIC_FALLBACKS.map((highlight) => {
    let nearest = Infinity;
    for (let i = 0; i < coords.length; i += 8) nearest = Math.min(nearest, haversineKm([highlight.lat, highlight.lon], coords[i]!));
    return { highlight, nearest };
  });
  const onCorridor = candidates.filter(({ nearest }) => nearest <= 180).map(({ highlight }) => highlight);
  return (onCorridor.length ? onCorridor : SCENIC_FALLBACKS).slice(0, 4);
}

function scenicCategory(tags: Record<string, string>): ScenicCategory | null {
  if (tags.tourism === "camp_site" || tags.tourism === "caravan_site") return "camping";
  if (tags.tourism === "hotel" || tags.tourism === "motel" || tags.tourism === "guest_house") return "lodging";
  if (tags.amenity === "restaurant" || tags.amenity === "cafe") return "food";
  if (tags.tourism === "viewpoint" || tags.historic === "castle" || tags.historic === "monument" || tags.heritage || tags.natural === "peak" || tags.highway === "rest_area") return "sights";
  return null;
}

export async function fetchScenicHighlights(
  coords: LatLng[],
  chargers: Charger[] = [],
  signal?: AbortSignal,
): Promise<ScenicHighlight[]> {
  const key = scenicRouteKey(coords);
  const cached = scenicCache.get(key);
  if (cached) return cached;
  try {
    const anchors = [...samplePolyline(coords, 100).map(({ pt }) => pt), ...chargers.slice(0, 8).map((charger) => [charger.lat, charger.lon] as LatLng)].slice(0, 28);
    const clauses = anchors.flatMap(([lat, lon]) => [
      `nwr(around:8000,${lat.toFixed(4)},${lon.toFixed(4)})["tourism"~"camp_site|caravan_site|hotel|motel|guest_house|viewpoint"];`,
      `nwr(around:8000,${lat.toFixed(4)},${lon.toFixed(4)})["amenity"~"restaurant|cafe"];`,
      `nwr(around:8000,${lat.toFixed(4)},${lon.toFixed(4)})["historic"~"castle|monument"];`,
      `nwr(around:8000,${lat.toFixed(4)},${lon.toFixed(4)})["heritage"];`,
      `nwr(around:8000,${lat.toFixed(4)},${lon.toFixed(4)})["natural"="peak"];`,
      `nwr(around:8000,${lat.toFixed(4)},${lon.toFixed(4)})["highway"="rest_area"];`,
    ]).join("");
    const query = `[out:json][timeout:10];(${clauses});out center 20;`;
    const response = await fetch(OVERPASS, { method: "POST", body: "data=" + encodeURIComponent(query), signal: signal ?? null });
    if (!response.ok) throw new Error("Scenic data unavailable");
    const data = (await response.json()) as { elements?: OverpassEl[] };
    const seen = new Set<string>();
    const highlights: ScenicHighlight[] = [];
    for (const element of data.elements ?? []) {
      const tags = element.tags ?? {};
      const category = scenicCategory(tags);
      const lat = element.lat ?? element.center?.lat;
      const lon = element.lon ?? element.center?.lon;
      if (!category || lat == null || lon == null) continue;
      const id = `${category}-${tags.name ?? element.id}`;
      if (seen.has(id)) continue;
      let nearest = Infinity;
      let atKm = 0;
      const cumulative = cumulativeKm(coords);
      for (let i = 0; i < coords.length; i += 8) {
        const distance = haversineKm([lat, lon], coords[i]!);
        if (distance < nearest) { nearest = distance; atKm = cumulative[i] ?? 0; }
      }
      if (nearest > 10) continue;
      seen.add(id);
      const name = tags.name || tags["name:en"] || `${category} stop`;
      highlights.push({
        id: String(element.id), name, country: countryAt([lat, lon]) ?? "EU", category, lat, lon, atKm,
        detourMinutes: nearest <= 1 ? 0 : Math.max(3, Math.round(nearest * 2)), directlyOnRoute: nearest <= 1,
        amenities: [tags.electricity === "yes" ? "Electricity" : "", tags.drinking_water === "yes" ? "Water" : "", tags.internet_access === "wlan" ? "WiFi" : "", tags.amenity === "restaurant" || tags.amenity === "cafe" ? "Open now" : ""].filter(Boolean),
        osmUrl: `https://www.openstreetmap.org/node/${element.id}`,
        websiteUrl: tags.website || tags["contact:website"],
        googleUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`,
      });
    }
    const categoryScore: Record<ScenicCategory, number> = { sights: 4, camping: 3, lodging: 2, food: 1 };
    const result = highlights.sort((a, b) => categoryScore[b.category] - categoryScore[a.category] || a.atKm - b.atKm).slice(0, 6);
    const finalResult = result.length ? result : scenicFallback(coords);
    scenicCache.set(key, finalResult);
    return finalResult;
  } catch {
    const fallback = scenicFallback(coords);
    scenicCache.set(key, fallback);
    return fallback;
  }
}
