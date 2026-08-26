import type { IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";

type Request = IncomingMessage & { body?: unknown };
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
  const email = readCookie(request, "autovere_user");
  if (!email) {
    response.status(401).json({ error: "Not logged in" });
    return;
  }
  const sql = getSql();

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

    const id = randomUUID();
    const rows = (await sql`
      INSERT INTO trips (id, user_email, name, from_place, to_place, vehicle_type, currency, days, estimate)
      VALUES (${id}, ${email}, ${name}, ${fromPlace}, ${toPlace}, ${vehicleType}, ${currency}, ${days}, ${estimate ? JSON.stringify(estimate) : null})
      RETURNING id, name, from_place, to_place, vehicle_type, currency, days, estimate, created_at, updated_at
    `) as TripRow[];
    response.status(201).json({ trip: toTrip(rows[0]!) });
    return;
  }

  response.status(405).json({ error: "Method not allowed" });
}
