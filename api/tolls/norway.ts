import type { IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";

type Request = IncomingMessage & { query?: Record<string, string | string[]> };
type Response = ServerResponse & {
  status: (code: number) => Response;
  json: (body: unknown) => void;
};

// Statens vegvesen NVDB API v4 — public, free, no auth. Requires an identifying User-Agent and
// an X-Client header (rejected without them — verified live during development). Docs:
// https://nvdb-docs.atlas.vegvesen.no/nvdbapil/v4/Vegobjekter/
const NVDB_BASE = "https://nvdbapiles.atlas.vegvesen.no/vegobjekter/api/v4/vegobjekter/45";
const TOLL_STATION_HEADERS = {
  Accept: "application/json",
  "User-Agent": "AutoVere (https://autovere.com; contact: kjmersland@gmail.com)",
  "X-Client": "AutoVere",
};

// Property ids in NVDB's Datakatalogen for vegobjekttype 45, confirmed live against real station
// data (Sandviken/Bergen, E6 Viken) during development — see src/lib/tolls/README.md.
const PROP = {
  name: 1078,
  rateSmallCar: 1820,
  rushRateSmallCar: 9410,
  schemeName: 10714,
  operatorUrl: 10715,
} as const;

type NvdbEgenskap = { id: number; verdi?: unknown };
type NvdbObjekt = {
  id: number;
  egenskaper?: NvdbEgenskap[];
  lokasjon?: { geometri?: { wkt?: string } };
};
type NvdbResponse = {
  objekter?: NvdbObjekt[];
  metadata?: { neste?: { href?: string } };
};

type StationCandidate = {
  id: number;
  name: string | null;
  lat: number;
  lon: number;
  rateNok: number | null;
  rushRateNok: number | null;
  scheme: string | null;
  operatorUrl: string | null;
};

function propValue(obj: NvdbObjekt, id: number): unknown {
  return obj.egenskaper?.find((e) => e.id === id)?.verdi;
}

function parsePoint(wkt: string | undefined): { lat: number; lon: number } | null {
  if (!wkt) return null;
  // NVDB returns "POINT Z (lat lon elevation)" when queried with srid=4326 — confirmed live.
  const m = wkt.match(/POINT Z? \(([-\d.]+) ([-\d.]+)/);
  if (!m || !m[1] || !m[2]) return null;
  return { lat: Number(m[1]), lon: Number(m[2]) };
}

function toStation(obj: NvdbObjekt): StationCandidate | null {
  const point = parsePoint(obj.lokasjon?.geometri?.wkt);
  if (!point) return null;
  const rate = propValue(obj, PROP.rateSmallCar);
  const rush = propValue(obj, PROP.rushRateSmallCar);
  const name = propValue(obj, PROP.name);
  const scheme = propValue(obj, PROP.schemeName);
  const operatorUrl = propValue(obj, PROP.operatorUrl);
  return {
    id: obj.id,
    name: typeof name === "string" ? name : null,
    lat: point.lat,
    lon: point.lon,
    rateNok: typeof rate === "number" ? rate : null,
    rushRateNok: typeof rush === "number" ? rush : null,
    scheme: typeof scheme === "string" ? scheme : null,
    operatorUrl: typeof operatorUrl === "string" ? operatorUrl : null,
  };
}

async function fetchStationsForBbox(bbox: string): Promise<StationCandidate[]> {
  let url: string | null =
    `${NVDB_BASE}?kartutsnitt=${encodeURIComponent(bbox)}&inkluder=egenskaper,lokasjon&srid=4326&antall=1000`;
  const stations: StationCandidate[] = [];
  let pages = 0;
  while (url && pages < 20 && stations.length < 500) {
    const res: globalThis.Response = await fetch(url, {
      headers: { ...TOLL_STATION_HEADERS, "X-Client-Session": randomUUID() },
    });
    if (!res.ok) throw new Error(`NVDB request failed: ${res.status}`);
    const data = (await res.json()) as NvdbResponse;
    for (const obj of data.objekter ?? []) {
      const station = toStation(obj);
      if (station) stations.push(station);
    }
    url = data.metadata?.neste?.href ?? null;
    pages++;
  }
  return stations;
}

function parseBbox(raw: string | undefined): string | null {
  if (!raw) return null;
  const parts = raw.split(",").map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return null;
  const [minLon, minLat, maxLon, maxLat] = parts;
  // Norway's rough lat/lon envelope — reject anything wildly outside it rather than proxying
  // an unbounded NVDB query for an unrelated part of the world.
  if (minLon! < -5 || maxLon! > 35 || minLat! < 55 || maxLat! > 72) return null;
  return `${minLon},${minLat},${maxLon},${maxLat}`;
}

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const cache = new Map<string, { stations: StationCandidate[]; expiresAt: number }>();

function cacheKey(bbox: string): string {
  // Round to ~1km so nearby trips share a cache entry.
  return bbox
    .split(",")
    .map((n) => Number(n).toFixed(2))
    .join(",");
}

export default async function handler(request: Request, response: Response) {
  if (request.method !== "GET") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
  const bboxRaw = Array.isArray(request.query?.["bbox"])
    ? request.query?.["bbox"][0]
    : request.query?.["bbox"];
  const bbox = parseBbox(bboxRaw);
  if (!bbox) {
    response
      .status(400)
      .json({ error: "A valid bbox=minLon,minLat,maxLon,maxLat within Norway is required." });
    return;
  }

  const key = cacheKey(bbox);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    response.status(200).json({ stations: cached.stations, source: "cache" });
    return;
  }

  try {
    const stations = await fetchStationsForBbox(bbox);
    cache.set(key, { stations, expiresAt: Date.now() + CACHE_TTL_MS });
    response.status(200).json({ stations, source: "nvdb" });
  } catch (error) {
    response
      .status(502)
      .json({ error: error instanceof Error ? error.message : "NVDB lookup failed", stations: [] });
  }
}
