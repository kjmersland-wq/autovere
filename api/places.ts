import type { IncomingMessage, ServerResponse } from "node:http";
import { randomUUID, createHmac, timingSafeEqual } from "node:crypto";
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

function verifySessionToken(token: string): string | null {
  const secret = process.env["AUTH_TOKEN_SECRET"];
  if (!secret) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = createHmac("sha256", secret).update(payload).digest();
  const actual = Buffer.from(signature, "base64url");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email?: unknown; exp?: unknown };
    return typeof value.email === "string" && typeof value.exp === "number" && value.exp > Math.floor(Date.now() / 1000) ? value.email : null;
  } catch {
    return null;
  }
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

function idFromUrl(request: Request): string | null {
  const raw = request.query?.["id"];
  if (Array.isArray(raw)) return raw[0] ?? null;
  if (typeof raw === "string" && raw) return raw;
  const url = new URL(request.url ?? "", "http://localhost");
  const segments = url.pathname.split("/").filter(Boolean);
  return segments.length > 2 ? (segments[segments.length - 1] ?? null) : null;
}

function toPlace(row: PlaceRow) {
  return { id: row.id, name: row.name, category: row.category, lat: row.lat !== null ? Number(row.lat) : null, lon: row.lon !== null ? Number(row.lon) : null, notes: row.notes, createdAt: row.created_at };
}

const CATEGORIES = new Set(["charging", "camping", "attraction", "other"]);

export default async function handler(request: Request, response: Response) {
  const sessionToken = readCookie(request, "autovere_user");
  const email = sessionToken ? verifySessionToken(sessionToken) : null;
  if (!email) {
    response.status(401).json({ error: "Not logged in" });
    return;
  }
  const sql = getSql();
  const id = idFromUrl(request);

  if (!id) {
    if (request.method === "GET") {
      const rows = (await sql`SELECT id, name, category, lat, lon, notes, created_at FROM saved_places WHERE user_email = ${email} ORDER BY created_at DESC`) as PlaceRow[];
      response.status(200).json({ places: rows.map(toPlace) });
      return;
    }
    if (request.method === "POST") {
      const body = parseBody(request.body);
      const name = typeof body["name"] === "string" ? body["name"].trim().slice(0, 160) : "";
      const category = typeof body["category"] === "string" ? body["category"] : "";
      const lat = typeof body["lat"] === "number" && Number.isFinite(body["lat"]) ? body["lat"] : null;
      const lon = typeof body["lon"] === "number" && Number.isFinite(body["lon"]) ? body["lon"] : null;
      const notes = typeof body["notes"] === "string" ? body["notes"].trim().slice(0, 1000) : null;

      if (!name || !CATEGORIES.has(category)) {
        response.status(400).json({ error: "A place name and a valid category are required." });
        return;
      }

      const newId = randomUUID();
      const rows = (await sql`
        INSERT INTO saved_places (id, user_email, name, category, lat, lon, notes)
        VALUES (${newId}, ${email}, ${name}, ${category}, ${lat}, ${lon}, ${notes})
        RETURNING id, name, category, lat, lon, notes, created_at
      `) as PlaceRow[];
      response.status(201).json({ place: toPlace(rows[0]!) });
      return;
    }
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

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
