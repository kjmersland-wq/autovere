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

// EV charging locations are NOT bulk-synced here: a single Overpass query covering all of Europe
// was tested directly against the live API and reliably times out server-side (50s+, 0 results)
// — Overpass's public instance cannot serve a whole-continent charging_station query in one shot.
// Charging data is instead fetched client-side, scoped to each user's actual route corridor
// (src/lib/geo.ts, fetchSmartFuelAndCharging) — the same proven, already-live pattern the
// existing fast-charger feature already uses, confirmed fast (~14s for a 6-anchor corridor).

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

// stations/smartChargers stay in the cache shape (always empty here) so api/chargers.ts and its
// client consumers don't need two different response contracts to reason about.
export type ChargerAndFuelCache = {
  syncedAt: string;
  source: string;
  stations: never[];
  fuelStations: FuelStation[];
};

const blobPath = "autovere/chargers.json";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!cronAuthorized(request)) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const fuelStations = await fetchFranceFuelPrices();
    const cache: ChargerAndFuelCache = {
      syncedAt: new Date().toISOString(),
      source: "data.economie.gouv.fr",
      stations: [],
      fuelStations,
    };
    if (process.env["BLOB_READ_WRITE_TOKEN"]) {
      await put(blobPath, JSON.stringify(cache), { access: "public", addRandomSuffix: false, contentType: "application/json", allowOverwrite: true });
    }
    response.status(200).json({ ok: true, fuelStations: fuelStations.length, syncedAt: cache.syncedAt });
  } catch (error) {
    console.error("Fuel price sync failed", error);
    response.status(500).json({ error: "Sync failed" });
  }
}
