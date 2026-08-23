import type { IncomingMessage, ServerResponse } from "node:http";

import { loadChargerCache } from "./_charger-cache";

type VercelRequest = IncomingMessage;
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => VercelResponse;
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== "GET") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const cache = await loadChargerCache();
    if (!cache) {
      response.status(404).json({ error: "No charger cache available" });
      return;
    }
    response.setHeader("Cache-Control", "public, max-age=900, stale-while-revalidate=86400");
    response.status(200).json(cache);
  } catch (error) {
    console.error("Charger cache read failed", error);
    response.status(500).json({ error: "Charger data unavailable" });
  }
}
