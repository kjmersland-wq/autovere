import { head, list, put } from "@vercel/blob";

export type CachedCharger = {
  id: string;
  name: string;
  operator: string | null;
  lat: number;
  lon: number;
  powerKw: number;
  plugs: number | null;
  availability: string | null;
  connectorTypes: string[];
  country: string | null;
  source: string;
};

export type ChargerCache = {
  syncedAt: string;
  source: string;
  stations: CachedCharger[];
};

const blobPath = "autovere/chargers.json";
let memoryCache: ChargerCache | null = null;

export function getMemoryChargerCache() {
  return memoryCache;
}

export function setMemoryChargerCache(cache: ChargerCache) {
  memoryCache = cache;
}

export async function saveChargerCache(cache: ChargerCache) {
  setMemoryChargerCache(cache);
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  const blob = await put(blobPath, JSON.stringify(cache), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    allowOverwrite: true,
  });
  return blob.url;
}

export async function loadChargerCache(): Promise<ChargerCache | null> {
  if (memoryCache) return memoryCache;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  const existing = await list({ prefix: blobPath, limit: 1 });
  const blob = existing.blobs[0];
  if (!blob) return null;
  const response = await fetch(blob.url, { cache: "no-store" });
  if (!response.ok) return null;
  const cache = (await response.json()) as ChargerCache;
  if (!Array.isArray(cache.stations) || typeof cache.syncedAt !== "string") return null;
  setMemoryChargerCache(cache);
  return cache;
}

export async function chargerCacheExists() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return Boolean(memoryCache);
  try {
    return Boolean((await head(blobPath)).url);
  } catch {
    return false;
  }
}
