/**
 * Server-only fetchers for open, keyless, official price sources.
 *
 * - EU-27 road fuel:  European Commission Weekly Oil Bulletin (weekly, EUR/1000 l, with taxes)
 * - France:           data.economie.gouv.fr instant station feed (median, refreshed daily)
 * - Norway:           Statistics Norway (SSB) table 09654 (monthly, NOK/l)
 * - United States:    U.S. EIA Gasoline & Diesel Fuel Update RSS (weekly, USD/gal)
 * - Canada:           Statistics Canada table 18-10-0001-01 via WDS (monthly, ¢/l)
 * - FX:               ECB reference rates via frankfurter.dev (daily)
 * - Norwegian tolls:  Statens vegvesen NVDB, object type 45 "Bomstasjon" (rates in NOK)
 *
 * Every source is cached in the shared `price_snapshots` table so all worker
 * instances agree, and the last good snapshot is served when a source is down.
 */

const UA = "AutoVere/1.0 (road trip cost planner; contact: kjell@autovere.com)";
const HOUR = 60 * 60 * 1000;

type Stored<T> = { value: T; fetchedAt: string; stale: boolean };
const memory = new Map<string, { value: unknown; at: number }>();

async function fetchText(url: string, init?: RequestInit, timeoutMs = 20000): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal, headers: { "User-Agent": UA, ...(init?.headers ?? {}) } });
    if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchBuffer(url: string, timeoutMs = 30000): Promise<ArrayBuffer> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
    return await res.arrayBuffer();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Shared snapshot cache: memory → database → live source → stale database row.
 * Returns null only when the source fails and nothing was ever cached.
 */
export async function cachedSnapshot<T>(
  key: string,
  ttlMs: number,
  source: string,
  load: () => Promise<T>,
): Promise<Stored<T> | null> {
  const mem = memory.get(key);
  if (mem && Date.now() - mem.at < ttlMs) {
    return { value: mem.value as T, fetchedAt: new Date(mem.at).toISOString(), stale: false };
  }

  let admin: Awaited<typeof import("@/integrations/supabase/client.server")>["supabaseAdmin"] | null = null;
  let dbRow: { payload: unknown; fetched_at: string } | null = null;
  try {
    admin = (await import("@/integrations/supabase/client.server")).supabaseAdmin;
    const { data } = await admin.from("price_snapshots").select("payload, fetched_at").eq("snapshot_key", key).maybeSingle();
    if (data) dbRow = data;
  } catch {
    /* database unavailable — fall through to the live source */
  }

  if (dbRow && Date.now() - new Date(dbRow.fetched_at).getTime() < ttlMs) {
    memory.set(key, { value: dbRow.payload, at: new Date(dbRow.fetched_at).getTime() });
    return { value: dbRow.payload as T, fetchedAt: dbRow.fetched_at, stale: false };
  }

  try {
    const value = await load();
    const now = new Date();
    memory.set(key, { value, at: now.getTime() });
    if (admin) {
      await admin
        .from("price_snapshots")
        .upsert({ snapshot_key: key, source, payload: value as never, fetched_at: now.toISOString() }, { onConflict: "snapshot_key" });
    }
    return { value, fetchedAt: now.toISOString(), stale: false };
  } catch {
    if (dbRow) {
      memory.set(key, { value: dbRow.payload, at: Date.now() - ttlMs + HOUR }); // retry in an hour
      return { value: dbRow.payload as T, fetchedAt: dbRow.fetched_at, stale: true };
    }
    return null;
  }
}

// ---------------------------------------------------------------------------
// Minimal XLSX reader (first worksheet → rows of strings). Dependency-free:
// parses the zip central directory and inflates with DecompressionStream.
// ---------------------------------------------------------------------------

async function inflateRaw(bytes: Uint8Array): Promise<Uint8Array> {
  try {
    const ds = new DecompressionStream("deflate-raw");
    const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(ds);
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch {
    const zlib = await import("node:zlib");
    return new Uint8Array(zlib.inflateRawSync(bytes));
  }
}

async function unzipEntries(buf: ArrayBuffer, wanted: string[]): Promise<Map<string, string>> {
  const bytes = new Uint8Array(buf);
  const view = new DataView(buf);
  const out = new Map<string, string>();
  // End of central directory record
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 70000); i -= 1) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("xlsx: no central directory");
  const count = view.getUint16(eocd + 10, true);
  let ptr = view.getUint32(eocd + 16, true);
  const decoder = new TextDecoder();
  for (let n = 0; n < count; n += 1) {
    if (view.getUint32(ptr, true) !== 0x02014b50) break;
    const method = view.getUint16(ptr + 10, true);
    const compSize = view.getUint32(ptr + 20, true);
    const nameLen = view.getUint16(ptr + 28, true);
    const extraLen = view.getUint16(ptr + 30, true);
    const commentLen = view.getUint16(ptr + 32, true);
    const localOffset = view.getUint32(ptr + 42, true);
    const name = decoder.decode(bytes.subarray(ptr + 46, ptr + 46 + nameLen));
    ptr += 46 + nameLen + extraLen + commentLen;
    if (!wanted.includes(name)) continue;
    const lNameLen = view.getUint16(localOffset + 26, true);
    const lExtraLen = view.getUint16(localOffset + 28, true);
    const start = localOffset + 30 + lNameLen + lExtraLen;
    const data = bytes.subarray(start, start + compSize);
    const raw = method === 8 ? await inflateRaw(data) : method === 0 ? data : null;
    if (!raw) throw new Error(`xlsx: unsupported compression ${method}`);
    out.set(name, decoder.decode(raw));
  }
  return out;
}

const decodeXml = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");

export async function readXlsxRows(buf: ArrayBuffer): Promise<string[][]> {
  const files = await unzipEntries(buf, ["xl/sharedStrings.xml", "xl/worksheets/sheet1.xml"]);
  const sharedXml = files.get("xl/sharedStrings.xml") ?? "";
  const shared = [...sharedXml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) =>
    decodeXml(m[1]!.replace(/<[^>]+>/g, "")).trim(),
  );
  const sheet = files.get("xl/worksheets/sheet1.xml");
  if (!sheet) throw new Error("xlsx: sheet1 missing");
  const rows: string[][] = [];
  for (const row of sheet.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells: string[] = [];
    for (const cell of row[1]!.matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const col = cell[1]!;
      const attrs = cell[2] ?? "";
      const inner = cell[3] ?? "";
      const idx = col.split("").reduce((acc, ch) => acc * 26 + (ch.charCodeAt(0) - 64), 0) - 1;
      let value = "";
      const v = /<v>([^<]*)<\/v>/.exec(inner)?.[1] ?? "";
      if (/t="s"/.test(attrs)) value = shared[Number(v)] ?? "";
      else if (/t="inlineStr"/.test(attrs)) value = decodeXml(inner.replace(/<[^>]+>/g, ""));
      else value = v;
      while (cells.length < idx) cells.push("");
      cells[idx] = value;
    }
    rows.push(cells);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

export type FxSnapshot = { base: "EUR"; date: string; rates: Record<string, number> };

export function loadFx() {
  return cachedSnapshot<FxSnapshot>("fx:ecb", 12 * HOUR, "ECB via frankfurter.dev", async () => {
    const json = JSON.parse(await fetchText("https://api.frankfurter.dev/v1/latest?base=EUR", { headers: { Accept: "application/json" } })) as {
      date?: string;
      rates?: Record<string, number>;
    };
    if (!json.rates || !json.rates["NOK"] || !json.rates["USD"]) throw new Error("fx: incomplete");
    return { base: "EUR", date: json.date ?? new Date().toISOString().slice(0, 10), rates: { ...json.rates, EUR: 1 } };
  });
}

/** EUR per litre, with taxes. */
export type CountryPumpPrice = { petrol: number; diesel: number };
export type OilBulletinSnapshot = { asOf: string; countries: Record<string, CountryPumpPrice>; eu27: CountryPumpPrice };

const WOB_COUNTRIES: Record<string, string> = {
  Austria: "AT", Belgium: "BE", Bulgaria: "BG", Croatia: "HR", Cyprus: "CY", Czechia: "CZ", "Czech Republic": "CZ",
  Denmark: "DK", Estonia: "EE", Finland: "FI", France: "FR", Germany: "DE", Greece: "GR", Hungary: "HU", Ireland: "IE",
  Italy: "IT", Latvia: "LV", Lithuania: "LT", Luxembourg: "LU", Malta: "MT", Netherlands: "NL", Poland: "PL",
  Portugal: "PT", Romania: "RO", Slovakia: "SK", Slovenia: "SI", Spain: "ES", Sweden: "SE",
};

const WOB_URL =
  "https://energy.ec.europa.eu/document/download/264c2d0f-f161-4ea3-a777-78faae59bea0_en?filename=Weekly%20Oil%20Bulletin%20Weekly%20prices%20with%20Taxes%20-%202024-02-19.xlsx";

function excelSerialToIso(serial: number) {
  const ms = Math.round((serial - 25569) * 86400 * 1000);
  return new Date(ms).toISOString().slice(0, 10);
}

export function loadOilBulletin() {
  return cachedSnapshot<OilBulletinSnapshot>("fuel:eu-wob", 24 * HOUR, "European Commission Weekly Oil Bulletin", async () => {
    const rows = await readXlsxRows(await fetchBuffer(WOB_URL));
    const countries: Record<string, CountryPumpPrice> = {};
    let eu27: CountryPumpPrice | null = null;
    let asOf = "";
    for (const row of rows) {
      const label = (row[0] ?? "").trim();
      const petrol = Number(row[1]);
      const diesel = Number(row[2]);
      if (!label) continue;
      if (/^\d{5}(\.\d+)?$/.test(label) && !asOf) asOf = excelSerialToIso(Number(label));
      if (!(petrol > 500 && petrol < 5000) || !(diesel > 500 && diesel < 5000)) continue;
      const code = WOB_COUNTRIES[label];
      if (code) countries[code] = { petrol: petrol / 1000, diesel: diesel / 1000 };
      else if (/EUR27/i.test(label)) eu27 = { petrol: petrol / 1000, diesel: diesel / 1000 };
    }
    if (Object.keys(countries).length < 20 || !eu27) throw new Error("wob: unexpected layout");
    return { asOf: asOf || new Date().toISOString().slice(0, 10), countries, eu27 };
  });
}

export type FranceSnapshot = { asOf: string; petrol: number; diesel: number; stations: number };

export function loadFranceInstant() {
  return cachedSnapshot<FranceSnapshot>("fuel:fr-instant", 6 * HOUR, "prix-carburants (data.economie.gouv.fr)", async () => {
    const url =
      "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/records" +
      "?select=percentile(gazole_prix%2C50)%20as%20diesel%2Cpercentile(sp95_prix%2C50)%20as%20petrol%2Ccount(*)%20as%20n" +
      "&where=gazole_prix%3E0.8%20and%20gazole_prix%3C4%20and%20sp95_prix%3E0.8%20and%20sp95_prix%3C4&limit=1";
    const json = JSON.parse(await fetchText(url, { headers: { Accept: "application/json" } })) as {
      results?: { diesel?: number; petrol?: number; n?: number }[];
    };
    const row = json.results?.[0];
    if (!row?.diesel || !row?.petrol) throw new Error("fr: empty");
    return { asOf: new Date().toISOString().slice(0, 10), petrol: row.petrol, diesel: row.diesel, stations: row.n ?? 0 };
  });
}

export type NorwaySnapshot = { asOf: string; month: string; petrolNok: number; dieselNok: number };

export function loadNorwaySsb() {
  return cachedSnapshot<NorwaySnapshot>("fuel:no-ssb", 24 * HOUR, "Statistics Norway (SSB) table 09654", async () => {
    const body = JSON.stringify({
      query: [
        { code: "PetroleumProd", selection: { filter: "item", values: ["031", "035"] } },
        { code: "Tid", selection: { filter: "top", values: ["1"] } },
      ],
      response: { format: "json-stat2" },
    });
    const json = JSON.parse(
      await fetchText("https://data.ssb.no/api/v0/no/table/09654", { method: "POST", body, headers: { "Content-Type": "application/json" } }),
    ) as { value?: number[]; dimension?: { Tid?: { category?: { index?: Record<string, number> } } } };
    const [petrol, diesel] = json.value ?? [];
    if (!petrol || !diesel) throw new Error("ssb: empty");
    const month = Object.keys(json.dimension?.Tid?.category?.index ?? {})[0] ?? "";
    return { asOf: month.replace("M", "-"), month, petrolNok: petrol, dieselNok: diesel };
  });
}

export type UsSnapshot = { asOf: string; petrolUsdGal: number; dieselUsdGal: number };

export function loadUsEia() {
  return cachedSnapshot<UsSnapshot>("fuel:us-eia", 24 * HOUR, "U.S. EIA Gasoline and Diesel Fuel Update", async () => {
    const xml = await fetchText("https://www.eia.gov/petroleum/gasdiesel/includes/gas_diesel_rss.xml");
    const title = /<title>Data For (\d{2})\/(\d{2})\/(\d{2})<\/title>/.exec(xml);
    const asOf = title ? `20${title[3]}-${title[1]}-${title[2]}` : new Date().toISOString().slice(0, 10);
    const gasBlock = xml.split(/Regular Gasoline Retail Price/i)[1] ?? "";
    const dieselBlock = xml.split(/On-Highway Diesel Fuel Retail Price/i)[1] ?? "";
    const us = (block: string) => Number(/([\d.]+)\s*\.\.\s*U\.S\./.exec(block)?.[1]);
    const petrol = us(gasBlock);
    const diesel = us(dieselBlock);
    if (!(petrol > 1 && petrol < 15) || !(diesel > 1 && diesel < 15)) throw new Error("eia: parse");
    return { asOf, petrolUsdGal: petrol, dieselUsdGal: diesel };
  });
}

export type CanadaSnapshot = { asOf: string; petrolCadL: number; dieselCadL: number; dieselCities: number };

export function loadCanadaStatcan() {
  return cachedSnapshot<CanadaSnapshot>("fuel:ca-statcan", 24 * HOUR, "Statistics Canada table 18-10-0001-01", async () => {
    // Geography 20 = Canada (regular gasoline, self-service). Diesel has no national
    // aggregate, so the published city series are averaged.
    const dieselCities = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    const body = JSON.stringify([
      { productId: 18100001, coordinate: "20.2.0.0.0.0.0.0.0.0", latestN: 1 },
      ...dieselCities.map((g) => ({ productId: 18100001, coordinate: `${g}.6.0.0.0.0.0.0.0.0`, latestN: 1 })),
    ]);
    const json = JSON.parse(
      await fetchText("https://www150.statcan.gc.ca/t1/wds/rest/getDataFromCubePidCoordAndLatestNPeriods", {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
    ) as { status: string; object: { coordinate: string; vectorDataPoint: { refPer: string; value: number }[] } }[];
    const petrolRow = json.find((r) => r.status === "SUCCESS" && r.object.coordinate.startsWith("20.2."));
    const petrolPoint = petrolRow?.object.vectorDataPoint[0];
    if (!petrolPoint) throw new Error("statcan: petrol missing");
    const dieselValues = json
      .filter((r) => r.status === "SUCCESS" && !r.object.coordinate.startsWith("20.2."))
      .map((r) => r.object.vectorDataPoint[0]?.value)
      .filter((v): v is number => typeof v === "number" && v > 50);
    if (!dieselValues.length) throw new Error("statcan: diesel missing");
    const dieselAvg = dieselValues.reduce((a, b) => a + b, 0) / dieselValues.length;
    return {
      asOf: petrolPoint.refPer.slice(0, 7),
      petrolCadL: petrolPoint.value / 100,
      dieselCadL: dieselAvg / 100,
      dieselCities: dieselValues.length,
    };
  });
}

// ---------------------------------------------------------------------------
// Norwegian toll gantries (NVDB object type 45)
// ---------------------------------------------------------------------------

export type NoTollStation = {
  id: number;
  name: string;
  facility: string;
  lat: number;
  lng: number;
  /** Standard rate, small vehicle (≤ 3.5 t), NOK, without tag discount. */
  car: number;
  carRush?: number;
  /** Explicit zero-emission rate when the scheme publishes one. */
  ev?: number;
  heavy?: number;
  direction: "both" | "one";
  timeRuleMin?: number;
  url?: string;
};

export type NoTollSnapshot = { asOf: string; source: string; stations: NoTollStation[] };

export function loadNorwayTolls() {
  return cachedSnapshot<NoTollSnapshot>("tolls:no-nvdb", 7 * 24 * HOUR, "Statens vegvesen NVDB (Bomstasjon)", async () => {
    const stations: NoTollStation[] = [];
    let url: string | null =
      "https://nvdbapiles.atlas.vegvesen.no/vegobjekter/api/v4/vegobjekter/45?antall=1000&inkluder=egenskaper,lokasjon&srid=4326";
    let guard = 0;
    while (url && guard < 5) {
      guard += 1;
      const json = JSON.parse(await fetchText(url, { headers: { Accept: "application/json", "X-Client": "autovere.com" } })) as {
        objekter?: {
          id: number;
          egenskaper?: { navn: string; verdi?: unknown }[];
          lokasjon?: { geometri?: { wkt?: string } };
        }[];
        metadata?: { returnert?: number; neste?: { href?: string } };
      };
      for (const o of json.objekter ?? []) {
        const p: Record<string, unknown> = {};
        for (const e of o.egenskaper ?? []) p[e.navn] = e.verdi;
        if (p["Bomstasjonstype"] === "Ferjeinnkrevingspunkt") continue;
        const wkt = o.lokasjon?.geometri?.wkt ?? "";
        const m = /POINT Z? ?\(([\d.]+) ([\d.]+)/.exec(wkt);
        const car = Number(p["Takst liten bil"]);
        if (!m || !(car >= 0)) continue;
        const s: NoTollStation = {
          id: o.id,
          name: String(p["Navn bomstasjon"] ?? ""),
          facility: String(p["Navn bompengeanlegg"] ?? ""),
          lat: Number(Number(m[1]).toFixed(6)),
          lng: Number(Number(m[2]).toFixed(6)),
          car,
          direction: p["Innkrevningsretning"] === "Begge retninger" ? "both" : "one",
        };
        if (typeof p["Rushtidstakst liten bil"] === "number") s.carRush = p["Rushtidstakst liten bil"] as number;
        if (typeof p["Takst liten elbil"] === "number") s.ev = p["Takst liten elbil"] as number;
        if (typeof p["Takst stor bil"] === "number") s.heavy = p["Takst stor bil"] as number;
        if (typeof p["Timesregel, varighet"] === "number") s.timeRuleMin = p["Timesregel, varighet"] as number;
        if (typeof p["Lenke til bomstasjon"] === "string") s.url = p["Lenke til bomstasjon"] as string;
        stations.push(s);
      }
      const returned = json.metadata?.returnert ?? 0;
      url = returned > 0 && json.metadata?.neste?.href ? json.metadata.neste.href : null;
    }
    if (stations.length < 200) throw new Error("nvdb: too few stations");
    return {
      asOf: new Date().toISOString().slice(0, 10),
      source: "Statens vegvesen NVDB (vegobjekttype 45 Bomstasjon), NLOD/CC BY 4.0",
      stations,
    };
  });
}
