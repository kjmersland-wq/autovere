import type { IncomingMessage, ServerResponse } from "node:http";
import { put } from "@vercel/blob";

type VercelRequest = IncomingMessage;
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

export const config = { maxDuration: 60 };

function cronAuthorized(request: VercelRequest) {
  const secret = process.env["CRON_SECRET"];
  if (process.env["NODE_ENV"] !== "production" && !secret) return true;
  return Boolean(secret && request.headers.authorization === `Bearer ${secret}`);
}

// --- EV charging: OpenStreetMap via Overpass (ODbL, no key/registration, commercial use permitted
// with attribution to OpenStreetMap). Open Charge Map is not used here — it now requires a free
// account/API key for every request, which fails AutoVere's no-registration data policy.
const OVERPASS = "https://overpass-api.de/api/interpreter";
const EUROPE_BBOX = "34,-25,71.2,45"; // south,west,north,east

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type Connection = { connectorType: string; currentType: "AC" | "DC"; cableStatus: "attached" | "bring_own"; powerKw: number | null };

// Mirrors the OSM charging-station tagging convention: a "_cable" or "_combo"/"_ccs"/"chademo" key
// means the connector has a permanently attached cable (DC fast-charging standards are always
// captive by design); a bare "type1"/"type2" key without that suffix is a socket only — the driver
// brings their own cable. Verified against the OSM wiki, not assumed.
const CONNECTOR_DEFS: { key: string; connectorType: string; currentType: "AC" | "DC"; cableStatus: "attached" | "bring_own" }[] = [
  { key: "socket:type2_combo", connectorType: "CCS (Combo 2)", currentType: "DC", cableStatus: "attached" },
  { key: "socket:type2_ccs", connectorType: "CCS (Combo 2)", currentType: "DC", cableStatus: "attached" },
  { key: "socket:chademo", connectorType: "CHAdeMO", currentType: "DC", cableStatus: "attached" },
  { key: "socket:type2_cable", connectorType: "Type 2", currentType: "AC", cableStatus: "attached" },
  { key: "socket:type2", connectorType: "Type 2", currentType: "AC", cableStatus: "bring_own" },
  { key: "socket:type1_combo", connectorType: "CCS (Combo 1)", currentType: "DC", cableStatus: "attached" },
  { key: "socket:type1_cable", connectorType: "Type 1", currentType: "AC", cableStatus: "attached" },
  { key: "socket:type1", connectorType: "Type 1", currentType: "AC", cableStatus: "bring_own" },
  { key: "socket:tesla_supercharger", connectorType: "Tesla Supercharger", currentType: "DC", cableStatus: "attached" },
];

function parsePowerKw(raw: string | undefined): number | null {
  if (!raw) return null;
  const m = raw.match(/([\d.]+)\s*(kw|w)?/i);
  if (!m) return null;
  let value = Number(m[1]);
  if (m[2]?.toLowerCase() === "w" && value > 2000) value = value / 1000;
  return Number.isFinite(value) ? value : null;
}

function parseConnections(tags: Record<string, string>): Connection[] {
  const out: Connection[] = [];
  for (const def of CONNECTOR_DEFS) {
    if (!(def.key in tags)) continue;
    out.push({ connectorType: def.connectorType, currentType: def.currentType, cableStatus: def.cableStatus, powerKw: parsePowerKw(tags[`${def.key}:output`]) });
  }
  return out;
}

type CachedCharger = {
  id: string; name: string; operator: string | null; lat: number; lon: number;
  powerKw: number; plugs: number | null; availability: string | null; connectorTypes: string[]; country: string | null; source: string;
};

export type SmartCharger = {
  id: string; name: string; operator: string | null; lat: number; lon: number;
  country: string | null; connections: Connection[]; source: string;
};

async function fetchOverpassCharging(): Promise<{ fast: CachedCharger[]; smart: SmartCharger[] }> {
  const query = `[out:json][timeout:50];node["amenity"="charging_station"](${EUROPE_BBOX});out center 12000;`;
  const response = await fetch(OVERPASS, { method: "POST", body: "data=" + encodeURIComponent(query) });
  if (!response.ok) throw new Error(`Overpass returned ${response.status}`);
  const data = (await response.json()) as { elements?: OverpassElement[] };

  const fast: CachedCharger[] = [];
  const smart: SmartCharger[] = [];
  for (const el of data.elements ?? []) {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    const tags = el.tags ?? {};
    if (lat == null || lon == null) continue;
    const connections = parseConnections(tags);
    if (!connections.length) continue;
    const name = tags["name"] || tags["operator"] || "EV charging station";
    const operator = tags["operator"] ?? null;
    const country = tags["addr:country"] ?? null;

    smart.push({ id: `osm-${el.id}`, name, operator, lat, lon, country, connections, source: "OpenStreetMap" });

    const fastConnections = connections.filter((c) => (c.powerKw ?? 0) > 150 && (c.connectorType.includes("CCS") || c.connectorType === "Type 2"));
    if (fastConnections.length) {
      fast.push({
        id: `osm-${el.id}`, name, operator, lat, lon,
        powerKw: Math.max(...fastConnections.map((c) => c.powerKw ?? 0)),
        plugs: fastConnections.length, availability: null,
        connectorTypes: [...new Set(fastConnections.map((c) => c.connectorType))],
        country, source: "OpenStreetMap",
      });
    }
  }
  return { fast, smart };
}

// --- Fuel prices: France's real-time government feed (Etalab Licence Ouverte — commercial use
// explicitly authorised, no key/registration). Verified live against data.economie.gouv.fr before
// writing this — see the AutoVere Smart Fuel & Charging audit for the full source review.
export type FuelStation = {
  id: string; name: string; brand: string | null; lat: number; lon: number; country: string;
  prices: { fuelType: "petrol" | "diesel"; amount: number; currency: string; updatedAt: string }[];
  source: string;
};

type FranceRecord = {
  fields: {
    geom?: [number, number];
    ville?: string; adresse?: string;
    gazole_prix?: number; gazole_maj?: string;
    sp95_prix?: number; sp95_maj?: string;
    sp98_prix?: number; sp98_maj?: string;
  };
};

async function fetchFranceFuelPrices(): Promise<FuelStation[]> {
  const stations: FuelStation[] = [];
  const pageSize = 1000;
  for (let page = 0; page < 4; page++) {
    const url = `https://data.economie.gouv.fr/api/records/1.0/search/?dataset=prix-des-carburants-en-france-flux-instantane-v2&rows=${pageSize}&start=${page * pageSize}`;
    const response = await fetch(url);
    if (!response.ok) break;
    const data = (await response.json()) as { records?: FranceRecord[] };
    const records = data.records ?? [];
    if (!records.length) break;
    for (const record of records) {
      const { fields } = record;
      const [lat, lon] = fields.geom ?? [];
      if (lat == null || lon == null) continue;
      const prices: FuelStation["prices"] = [];
      if (fields.gazole_prix && fields.gazole_maj) prices.push({ fuelType: "diesel", amount: fields.gazole_prix, currency: "EUR", updatedAt: fields.gazole_maj });
      // SP98 (premium) is used as the representative petrol price when both grades are listed.
      if (fields.sp98_prix && fields.sp98_maj) prices.push({ fuelType: "petrol", amount: fields.sp98_prix, currency: "EUR", updatedAt: fields.sp98_maj });
      else if (fields.sp95_prix && fields.sp95_maj) prices.push({ fuelType: "petrol", amount: fields.sp95_prix, currency: "EUR", updatedAt: fields.sp95_maj });
      if (!prices.length) continue;
      stations.push({ id: `fr-${lat}-${lon}`, name: fields.adresse || fields.ville || "Station-service", brand: null, lat, lon, country: "FR", prices, source: "data.economie.gouv.fr" });
    }
    if (records.length < pageSize) break;
  }
  return stations;
}

export type ChargerAndFuelCache = {
  syncedAt: string;
  source: string;
  stations: CachedCharger[];
  smartChargers: SmartCharger[];
  fuelStations: FuelStation[];
};

const blobPath = "autovere/chargers.json";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!cronAuthorized(request)) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const [{ fast, smart }, fuelStations] = await Promise.all([
      fetchOverpassCharging(),
      fetchFranceFuelPrices().catch((error) => {
        console.error("France fuel price sync failed", error);
        return [];
      }),
    ]);
    const cache: ChargerAndFuelCache = {
      syncedAt: new Date().toISOString(),
      source: "OpenStreetMap (Overpass) + data.economie.gouv.fr",
      stations: fast,
      smartChargers: smart,
      fuelStations,
    };
    if (process.env["BLOB_READ_WRITE_TOKEN"]) {
      await put(blobPath, JSON.stringify(cache), { access: "public", addRandomSuffix: false, contentType: "application/json", allowOverwrite: true });
    }
    response.status(200).json({ ok: true, chargers: fast.length, smartChargers: smart.length, fuelStations: fuelStations.length, syncedAt: cache.syncedAt });
  } catch (error) {
    console.error("Charger/fuel sync failed", error);
    response.status(500).json({ error: "Sync failed" });
  }
}
