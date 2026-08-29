import type { IncomingMessage, ServerResponse } from "node:http";
import { list } from "@vercel/blob";
import type { ChargerAndFuelCache } from "./cron/sync-chargers";

type VercelRequest = IncomingMessage;
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => VercelResponse;
};

const blobPath = "autovere/chargers.json";

// Inlined rather than imported from a sibling file — a fresh cross-file relative import between
// api/*.ts files has been observed to fail to bundle on Vercel (stale function-trace cache), so
// every api/*.ts file here stays self-contained. See the partner-email production incident.
async function loadCache(): Promise<ChargerAndFuelCache | null> {
  if (!process.env["BLOB_READ_WRITE_TOKEN"]) return null;
  try {
    const existing = await list({ prefix: blobPath, limit: 1 });
    const blob = existing.blobs[0];
    if (!blob) return null;
    const response = await fetch(blob.url, { cache: "no-store" });
    if (!response.ok) return null;
    const cache = (await response.json()) as ChargerAndFuelCache;
    if (!Array.isArray(cache.stations) || typeof cache.syncedAt !== "string") return null;
    return cache;
  } catch (error) {
    console.error("Loading charger/fuel cache failed", error);
    return null;
  }
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "GET") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
  const cache = await loadCache();
  if (!cache) {
    response.status(404).json({ error: "No charger cache available" });
    return;
  }
  response.setHeader("Cache-Control", "public, max-age=900, stale-while-revalidate=86400");
  response.status(200).json(cache);
}
