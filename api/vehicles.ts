import type { IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";

type Request = IncomingMessage & { body?: unknown; query?: Record<string, string | string[]> };
type Response = ServerResponse & { status: (code: number) => Response; json: (body: unknown) => void };

type VehicleRow = { id: string; name: string; vehicle_type: string; consumption: string | number | null; range_km: string | number | null; is_default: boolean; created_at: string };

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

function idFromUrl(request: Request): string | null {
  const raw = request.query?.["id"];
  if (Array.isArray(raw)) return raw[0] ?? null;
  if (typeof raw === "string" && raw) return raw;
  const url = new URL(request.url ?? "", "http://localhost");
  const segments = url.pathname.split("/").filter(Boolean);
  return segments.length > 2 ? (segments[segments.length - 1] ?? null) : null;
}

function toVehicle(row: VehicleRow) {
  return {
    id: row.id,
    name: row.name,
    vehicleType: row.vehicle_type,
    consumption: row.consumption !== null ? Number(row.consumption) : null,
    rangeKm: row.range_km !== null ? Number(row.range_km) : null,
    isDefault: row.is_default,
    createdAt: row.created_at,
  };
}

const VEHICLE_TYPES = new Set(["petrol", "diesel", "ev"]);

export default async function handler(request: Request, response: Response) {
  const email = readCookie(request, "autovere_user");
  if (!email) {
    response.status(401).json({ error: "Not logged in" });
    return;
  }
  const sql = getSql();
  const id = idFromUrl(request);

  if (!id) {
    if (request.method === "GET") {
      const rows = (await sql`SELECT id, name, vehicle_type, consumption, range_km, is_default, created_at FROM vehicles WHERE user_email = ${email} ORDER BY created_at ASC`) as VehicleRow[];
      response.status(200).json({ vehicles: rows.map(toVehicle) });
      return;
    }
    if (request.method === "POST") {
      const body = parseBody(request.body);
      const name = typeof body["name"] === "string" ? body["name"].trim().slice(0, 120) : "";
      const vehicleType = typeof body["vehicleType"] === "string" ? body["vehicleType"] : "";
      const consumption = typeof body["consumption"] === "number" && Number.isFinite(body["consumption"]) ? body["consumption"] : null;
      const rangeKm = typeof body["rangeKm"] === "number" && Number.isFinite(body["rangeKm"]) ? body["rangeKm"] : null;
      const isDefault = body["isDefault"] === true;

      if (!name || !VEHICLE_TYPES.has(vehicleType)) {
        response.status(400).json({ error: "A vehicle name and a valid vehicle type are required." });
        return;
      }

      const newId = randomUUID();
      const existing = await sql`SELECT id FROM vehicles WHERE user_email = ${email} LIMIT 1`;
      const shouldBeDefault = isDefault || existing.length === 0;
      if (shouldBeDefault) {
        await sql`UPDATE vehicles SET is_default = false WHERE user_email = ${email}`;
      }
      const rows = (await sql`
        INSERT INTO vehicles (id, user_email, name, vehicle_type, consumption, range_km, is_default)
        VALUES (${newId}, ${email}, ${name}, ${vehicleType}, ${consumption}, ${rangeKm}, ${shouldBeDefault})
        RETURNING id, name, vehicle_type, consumption, range_km, is_default, created_at
      `) as VehicleRow[];
      response.status(201).json({ vehicle: toVehicle(rows[0]!) });
      return;
    }
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const owned = await sql`SELECT id FROM vehicles WHERE id = ${id} AND user_email = ${email}`;
  if (owned.length === 0) {
    response.status(404).json({ error: "Vehicle not found." });
    return;
  }

  if (request.method === "PATCH") {
    const body = parseBody(request.body);
    const updates: { name?: string; vehicleType?: string; consumption?: number | null; rangeKm?: number | null } = {};
    if (typeof body["name"] === "string" && body["name"].trim()) updates.name = body["name"].trim().slice(0, 120);
    if (typeof body["vehicleType"] === "string" && VEHICLE_TYPES.has(body["vehicleType"])) updates.vehicleType = body["vehicleType"];
    if (body["consumption"] === null || (typeof body["consumption"] === "number" && Number.isFinite(body["consumption"]))) updates.consumption = body["consumption"] as number | null;
    if (body["rangeKm"] === null || (typeof body["rangeKm"] === "number" && Number.isFinite(body["rangeKm"]))) updates.rangeKm = body["rangeKm"] as number | null;

    if (updates.name !== undefined) await sql`UPDATE vehicles SET name = ${updates.name} WHERE id = ${id}`;
    if (updates.vehicleType !== undefined) await sql`UPDATE vehicles SET vehicle_type = ${updates.vehicleType} WHERE id = ${id}`;
    if (updates.consumption !== undefined) await sql`UPDATE vehicles SET consumption = ${updates.consumption} WHERE id = ${id}`;
    if (updates.rangeKm !== undefined) await sql`UPDATE vehicles SET range_km = ${updates.rangeKm} WHERE id = ${id}`;
    if (body["isDefault"] === true) {
      await sql`UPDATE vehicles SET is_default = false WHERE user_email = ${email}`;
      await sql`UPDATE vehicles SET is_default = true WHERE id = ${id}`;
    }

    const rows = (await sql`SELECT id, name, vehicle_type, consumption, range_km, is_default, created_at FROM vehicles WHERE id = ${id}`) as VehicleRow[];
    response.status(200).json({ vehicle: toVehicle(rows[0]!) });
    return;
  }

  if (request.method === "DELETE") {
    await sql`DELETE FROM vehicles WHERE id = ${id}`;
    const remaining = await sql`SELECT id FROM vehicles WHERE user_email = ${email} AND is_default = true LIMIT 1`;
    if (remaining.length === 0) {
      await sql`UPDATE vehicles SET is_default = true WHERE id = (SELECT id FROM vehicles WHERE user_email = ${email} ORDER BY created_at ASC LIMIT 1)`;
    }
    response.status(200).json({ ok: true });
    return;
  }

  response.status(405).json({ error: "Method not allowed" });
}
