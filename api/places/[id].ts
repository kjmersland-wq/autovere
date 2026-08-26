import type { IncomingMessage, ServerResponse } from "node:http";
import { neon } from "@neondatabase/serverless";

type Request = IncomingMessage & { body?: unknown; query?: Record<string, string | string[]> };
type Response = ServerResponse & { status: (code: number) => Response; json: (body: unknown) => void };

type PlaceRow = { id: string; name: string; category: string; lat: string | number | null; lon: string | number | null; notes: string | null; created_at: string };

function readCookie(request: Request, name: string): string | null {
  const header = request.headers.cookie;
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

function getSql() {
  const url = process.env["DATABASE_URL"];
  if (!url) throw new Error("DATABASE_URL is not configured.");
  return neon(url);
}

function parseBody(body: unknown): Record<string, unknown> {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return (body as Record<string, unknown>) ?? {};
}

function idFromUrl(request: Request): string {
  const raw = request.query?.["id"];
  if (typeof raw === "string") return raw;
  const url = new URL(request.url ?? "", "http://localhost");
  return url.pathname.split("/").pop() ?? "";
}

function toPlace(row: PlaceRow) {
  return { id: row.id, name: row.name, category: row.category, lat: row.lat !== null ? Number(row.lat) : null, lon: row.lon !== null ? Number(row.lon) : null, notes: row.notes, createdAt: row.created_at };
}

export default async function handler(request: Request, response: Response) {
  const email = readCookie(request, "autovere_user");
  if (!email) {
    response.status(401).json({ error: "Not logged in" });
    return;
  }
  const id = idFromUrl(request);
  if (!id) {
    response.status(400).json({ error: "Missing place id." });
    return;
  }
  const sql = getSql();

  const owned = await sql`SELECT id FROM saved_places WHERE id = ${id} AND user_email = ${email}`;
  if (owned.length === 0) {
    response.status(404).json({ error: "Place not found." });
    return;
  }

  if (request.method === "PATCH") {
    const body = parseBody(request.body);
    if (typeof body["name"] === "string" && body["name"].trim()) await sql`UPDATE saved_places SET name = ${body["name"].trim().slice(0, 160)} WHERE id = ${id}`;
    if (typeof body["notes"] === "string") await sql`UPDATE saved_places SET notes = ${body["notes"].trim().slice(0, 1000)} WHERE id = ${id}`;
    const rows = (await sql`SELECT id, name, category, lat, lon, notes, created_at FROM saved_places WHERE id = ${id}`) as PlaceRow[];
    response.status(200).json({ place: toPlace(rows[0]!) });
    return;
  }

  if (request.method === "DELETE") {
    await sql`DELETE FROM saved_places WHERE id = ${id}`;
    response.status(200).json({ ok: true });
    return;
  }

  response.status(405).json({ error: "Method not allowed" });
}
