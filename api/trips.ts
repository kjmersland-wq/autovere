import type { IncomingMessage, ServerResponse } from "node:http";
import { randomUUID, createHmac, timingSafeEqual } from "node:crypto";
import { neon } from "@neondatabase/serverless";

type Request = IncomingMessage & { body?: unknown; query?: Record<string, string | string[]> };
type Response = ServerResponse & { status: (code: number) => Response; json: (body: unknown) => void };

type TripRow = { id: string; name: string; from_place: string | null; to_place: string | null; vehicle_type: string | null; currency: string | null; days: number | null; estimate: unknown; created_at: string; updated_at: string };

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

function toTrip(row: TripRow) {
  return {
    id: row.id,
    name: row.name,
    fromPlace: row.from_place,
    toPlace: row.to_place,
    vehicleType: row.vehicle_type,
    currency: row.currency,
    days: row.days,
    estimate: row.estimate,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

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
      const rows = (await sql`SELECT id, name, from_place, to_place, vehicle_type, currency, days, estimate, created_at, updated_at FROM trips WHERE user_email = ${email} ORDER BY updated_at DESC LIMIT 100`) as TripRow[];
      response.status(200).json({ trips: rows.map(toTrip) });
      return;
    }
    if (request.method === "POST") {
      const body = parseBody(request.body);
      const name = typeof body["name"] === "string" ? body["name"].trim().slice(0, 160) : "";
      const fromPlace = typeof body["fromPlace"] === "string" ? body["fromPlace"].trim().slice(0, 160) : null;
      const toPlace = typeof body["toPlace"] === "string" ? body["toPlace"].trim().slice(0, 160) : null;
      const vehicleType = typeof body["vehicleType"] === "string" ? body["vehicleType"].slice(0, 40) : null;
      const currency = typeof body["currency"] === "string" ? body["currency"].slice(0, 10) : null;
      const days = typeof body["days"] === "number" && Number.isFinite(body["days"]) ? Math.round(body["days"]) : null;
      const estimate = body["estimate"] && typeof body["estimate"] === "object" ? body["estimate"] : null;

      if (!name) {
        response.status(400).json({ error: "A trip name is required." });
        return;
      }

      const countRow = (await sql`SELECT count(*)::int AS count FROM trips WHERE user_email = ${email}`) as { count: number }[];
      if ((countRow[0]?.count ?? 0) >= 200) {
        response.status(400).json({ error: "You've reached the saved trip limit. Delete an old trip first." });
        return;
      }

      const newId = randomUUID();
      const rows = (await sql`
        INSERT INTO trips (id, user_email, name, from_place, to_place, vehicle_type, currency, days, estimate)
        VALUES (${newId}, ${email}, ${name}, ${fromPlace}, ${toPlace}, ${vehicleType}, ${currency}, ${days}, ${estimate ? JSON.stringify(estimate) : null})
        RETURNING id, name, from_place, to_place, vehicle_type, currency, days, estimate, created_at, updated_at
      `) as TripRow[];
      response.status(201).json({ trip: toTrip(rows[0]!) });
      return;
    }
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const owned = await sql`SELECT id FROM trips WHERE id = ${id} AND user_email = ${email}`;
  if (owned.length === 0) {
    response.status(404).json({ error: "Trip not found." });
    return;
  }

  if (request.method === "PATCH") {
    const body = parseBody(request.body);
    if (typeof body["name"] === "string" && body["name"].trim()) {
      await sql`UPDATE trips SET name = ${body["name"].trim().slice(0, 160)}, updated_at = now() WHERE id = ${id}`;
    }
    const rows = (await sql`SELECT id, name, from_place, to_place, vehicle_type, currency, days, estimate, created_at, updated_at FROM trips WHERE id = ${id}`) as TripRow[];
    response.status(200).json({ trip: toTrip(rows[0]!) });
    return;
  }

  if (request.method === "DELETE") {
    await sql`DELETE FROM trips WHERE id = ${id}`;
    response.status(200).json({ ok: true });
    return;
  }

  response.status(405).json({ error: "Method not allowed" });
}
