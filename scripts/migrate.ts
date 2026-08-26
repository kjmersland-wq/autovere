import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. Run with `npx dotenv -e .env.local -- npx tsx scripts/migrate.ts`.");
  const sql = neon(url);

  await sql`
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      name TEXT NOT NULL,
      from_place TEXT,
      to_place TEXT,
      vehicle_type TEXT,
      currency TEXT,
      days INTEGER,
      estimate JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS trips_user_email_idx ON trips(user_email)`;

  await sql`
    CREATE TABLE IF NOT EXISTS vehicles (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      name TEXT NOT NULL,
      vehicle_type TEXT NOT NULL,
      consumption NUMERIC,
      range_km NUMERIC,
      is_default BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS vehicles_user_email_idx ON vehicles(user_email)`;

  await sql`
    CREATE TABLE IF NOT EXISTS saved_places (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      lat DOUBLE PRECISION,
      lon DOUBLE PRECISION,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS saved_places_user_email_idx ON saved_places(user_email)`;

  await sql`
    CREATE TABLE IF NOT EXISTS user_settings (
      user_email TEXT PRIMARY KEY,
      language TEXT,
      currency TEXT,
      units TEXT,
      notifications_email BOOLEAN NOT NULL DEFAULT true,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  console.log("Migration complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
