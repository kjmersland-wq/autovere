import type { IncomingMessage, ServerResponse } from "node:http";
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
  const id = idFromUrl(request);
  if (!id) {
    response.status(400).json({ error: "Missing trip id." });
    return;
  }
  const sql = getSql();

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
