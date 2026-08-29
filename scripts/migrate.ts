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
      display_name TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS display_name TEXT`;

  await sql`
    CREATE TABLE IF NOT EXISTS partners (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT,
      logo TEXT,
      website TEXT NOT NULL,
      discount_percent INTEGER NOT NULL,
      discount_code TEXT NOT NULL UNIQUE,
      active BOOLEAN NOT NULL DEFAULT true,
      start_date DATE,
      end_date DATE,
      notes TEXT,
      type TEXT NOT NULL DEFAULT 'member_organisation',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  // CREATE TABLE IF NOT EXISTS is a no-op on a table that already exists in production,
  // so the "type" column above only takes effect on a brand-new database — add it
  // explicitly for the already-existing production table.
  await sql`ALTER TABLE partners ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'member_organisation'`;
  await sql`ALTER TABLE partners DROP CONSTRAINT IF EXISTS partners_type_check`;
  await sql`ALTER TABLE partners ADD CONSTRAINT partners_type_check CHECK (type IN ('member_organisation', 'car_dealer', 'motorhome_dealer'))`;

  await sql`
    CREATE TABLE IF NOT EXISTS partner_referrals (
      id TEXT PRIMARY KEY,
      partner_id TEXT NOT NULL REFERENCES partners(id),
      email TEXT,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS partner_referrals_partner_id_idx ON partner_referrals(partner_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS partner_memberships (
      user_email TEXT PRIMARY KEY,
      partner_id TEXT NOT NULL REFERENCES partners(id),
      discount_percent INTEGER NOT NULL,
      valid_until DATE NOT NULL,
      linked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      source TEXT NOT NULL DEFAULT 'checkout'
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      email TEXT PRIMARY KEY,
      first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS partner_applications (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL DEFAULT 'member_organisation',
      organisation_name TEXT NOT NULL,
      country TEXT,
      website TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      contact_email TEXT NOT NULL,
      logo TEXT,
      message TEXT,
      locale TEXT NOT NULL DEFAULT 'en',
      status TEXT NOT NULL DEFAULT 'pending',
      partner_id TEXT REFERENCES partners(id),
      reviewed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  // Same lesson as partners.type: CREATE TABLE IF NOT EXISTS is a no-op once the table already
  // exists in production, so a column added after the table's first deploy needs its own ALTER.
  await sql`ALTER TABLE partner_applications ADD COLUMN IF NOT EXISTS logo TEXT`;
  await sql`CREATE INDEX IF NOT EXISTS partner_applications_status_idx ON partner_applications(status)`;
  await sql`ALTER TABLE partner_applications DROP CONSTRAINT IF EXISTS partner_applications_status_check`;
  await sql`ALTER TABLE partner_applications ADD CONSTRAINT partner_applications_status_check CHECK (status IN ('pending', 'approved', 'rejected'))`;

  console.log("Migration complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
