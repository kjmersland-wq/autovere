import type { IncomingMessage, ServerResponse } from "node:http";

import { saveChargerCache, type CachedCharger, type ChargerCache } from "../_charger-cache";

type VercelRequest = IncomingMessage;
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
};

type OpenChargeMapStation = {
  ID?: number;
  UUID?: string;
  AddressInfo?: {
    Title?: string;
    Latitude?: number;
    Longitude?: number;
    Country?: { ISOCode?: string };
    ContactTelephone1?: string;
  };
  OperatorInfo?: { Title?: string };
  Connections?: Array<{
    PowerKW?: number;
    Quantity?: number;
    ConnectionType?: { Title?: string };
    StatusType?: { Title?: string };
  }>;
  StatusType?: { Title?: string };
};

const apiUrl = "https://api.openchargemap.io/v3/poi/?output=json&boundingbox=71.2,-25,34,45&maxresults=5000&compact=true&verbose=false";

function cronAuthorized(request: VercelRequest) {
  const secret = process.env.CRON_SECRET;
  if (process.env.NODE_ENV !== "production" && !secret) return true;
  return Boolean(secret && request.headers.authorization === `Bearer ${secret}`);
}

function normalizeStation(station: OpenChargeMapStation): CachedCharger | null {
  const address = station.AddressInfo;
  const lat = address?.Latitude;
  const lon = address?.Longitude;
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  const connections = station.Connections ?? [];
  const fastConnections = connections.filter((connection) => {
    const connector = connection.ConnectionType?.Title?.toLowerCase() ?? "";
    return Number(connection.PowerKW) > 150 && /(ccs|combo|type ?2)/i.test(connector);
  });
  if (!fastConnections.length) return null;
  const powerKw = Math.max(...fastConnections.map((connection) => Number(connection.PowerKW)));
  return {
    id: `ocm-${station.UUID ?? station.ID ?? `${lat}-${lon}`}`,
    name: address?.Title || "Fast charging station",
    operator: station.OperatorInfo?.Title ?? null,
    lat: lat!,
    lon: lon!,
    powerKw,
    plugs: fastConnections.reduce((total, connection) => total + (connection.Quantity ?? 1), 0),
    availability: station.StatusType?.Title ?? fastConnections[0]?.StatusType?.Title ?? null,
    connectorTypes: [...new Set(fastConnections.map((connection) => connection.ConnectionType?.Title).filter((title): title is string => Boolean(title)))],
    country: address?.Country?.ISOCode ?? null,
    source: "Open Charge Map",
  };
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (!cronAuthorized(request)) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const apiKey = process.env.OPEN_CHARGE_MAP_API_KEY;
    const url = apiKey ? `${apiUrl}&key=${encodeURIComponent(apiKey)}` : apiUrl;
    const upstream = await fetch(url, { headers: { Accept: "application/json" } });
    if (!upstream.ok) throw new Error(`Open Charge Map returned ${upstream.status}`);
    const data = (await upstream.json()) as OpenChargeMapStation[];
    const stations = data.map(normalizeStation).filter((station): station is CachedCharger => station !== null);
    const cache: ChargerCache = { syncedAt: new Date().toISOString(), source: "Open Charge Map", stations };
    await saveChargerCache(cache);
    response.status(200).json({ ok: true, count: stations.length, syncedAt: cache.syncedAt, source: cache.source });
  } catch (error) {
    console.error("Charger sync failed", error);
    response.status(500).json({ error: "Charger sync failed" });
  }
}
