/**
 * ev-charging-data — Server-side proxy for the Open Charge Map (OCM) API.
 *
 * Never exposes the API key to the browser. Applies a short in-memory
 * cache (1 h per unique query) to avoid exhausting OCM quota.
 *
 * GET /ev-charging-data
 *   ?countrycode=NO          ISO 3166-1 alpha-2 (required when lat/lng absent)
 *   ?lat=59.9                centre latitude  (optional; pairs with lng+distance)
 *   ?lng=10.7                centre longitude
 *   ?distance=50             radius in km  (default 50)
 *   ?maxresults=50           1-100          (default 50)
 *   ?pageindex=0             0-based page   (default 0)
 */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const OCM_BASE = "https://api.openchargemap.io/v3/poi/";
const CACHE = new Map<string, { at: number; data: unknown }>();
const TTL_MS = 60 * 60 * 1000; // 1 h

// ── OCM response shape (minimal — only what we use) ──────────────────────────

interface OcmAddressInfo {
  Title: string;
  AddressLine1?: string;
  Town?: string;
  StateOrProvince?: string;
  Country?: { Title: string; ISOCode: string };
  Latitude: number;
  Longitude: number;
}

interface OcmConnectionType {
  ID: number;
  Title: string;
}

interface OcmStatusType {
  IsOperational?: boolean;
}

interface OcmConnection {
  ID: number;
  ConnectionType?: OcmConnectionType;
  PowerKW?: number;
  Quantity?: number;
  StatusType?: OcmStatusType;
}

interface OcmOperatorInfo {
  Title?: string;
}

interface OcmPoi {
  ID: number;
  AddressInfo: OcmAddressInfo;
  OperatorInfo?: OcmOperatorInfo;
  Connections?: OcmConnection[];
  NumberOfPoints?: number;
  StatusType?: OcmStatusType;
}

// ── Mapping helpers ───────────────────────────────────────────────────────────

/** Normalise OCM connector type titles to our canonical set. */
function mapConnector(
  ocmId: number | undefined,
  title: string,
): string | null {
  if (!ocmId && !title) return null;
  const t = (title ?? "").toLowerCase();
  // NACS / Tesla
  if (ocmId === 3 || t.includes("tesla") || t.includes("nacs")) return "NACS";
  // CCS
  if (ocmId === 33 || t.includes("ccs") || t.includes("combo")) return "CCS";
  // CHAdeMO
  if (ocmId === 2 || t.includes("chademo")) return "CHAdeMO";
  // Type 2
  if (ocmId === 25 || t.includes("type 2") || t.includes("mennekes")) return "Type 2";
  // Type 1
  if (ocmId === 1 || t.includes("type 1") || t.includes("j1772")) return null; // skip Type 1
  return null;
}

/** Infer speed tier from peak kW. */
function mapSpeed(kw: number): "HPC" | "DC" | "AC" {
  if (kw >= 100) return "HPC";
  if (kw >= 22) return "DC";
  return "AC";
}

/** Normalise OCM operator name to a known AUTOVERE provider label. */
function mapProvider(raw: string | undefined): string {
  if (!raw) return "Other";
  const r = raw.toLowerCase();
  if (r.includes("tesla")) return "Tesla";
  if (r.includes("ionity")) return "Ionity";
  if (r.includes("recharge") && !r.includes("shell")) return "Recharge";
  if (r.includes("circle k")) return "Circle K";
  if (r.includes("eviny") || r.includes("bkk") || r.includes("charge365")) return "Eviny";
  if (r.includes("uno-x") || r.includes("unox")) return "Uno-X";
  if (r.includes("mer ") || r === "mer" || r.includes("chargepoint norway")) return "Mer";
  if (r.includes("kople")) return "Kople";
  if (r.includes("fastned")) return "Fastned";
  if (r.includes("allego")) return "Allego";
  if (r.includes("e.on") || r.includes("eon ")) return "E.ON";
  if (r.includes("shell recharge") || (r.includes("shell") && r.includes("recharge"))) return "Shell Recharge";
  if (r.includes("freshmile")) return "Freshmile";
  if (r.includes("vattenfall") || r.includes("incharge")) return "InCharge";
  // Return the first ~20 chars of the raw name as a readable fallback
  return raw.slice(0, 20);
}

/** Convert a single OCM POI to our compact station object. */
function mapStation(poi: OcmPoi): Record<string, unknown> {
  const conns: OcmConnection[] = poi.Connections ?? [];

  // Unique connector types
  const connectorSet = new Set<string>();
  let maxKw = 0;
  let totalPoints = poi.NumberOfPoints ?? 0;

  for (const c of conns) {
    const label = mapConnector(c.ConnectionType?.ID, c.ConnectionType?.Title ?? "");
    if (label) connectorSet.add(label);
    const kw = c.PowerKW ?? 0;
    if (kw > maxKw) maxKw = kw;
    if (!totalPoints && c.Quantity) totalPoints += c.Quantity;
  }

  const connectors = connectorSet.size ? [...connectorSet] : ["Type 2"];
  const speed = mapSpeed(maxKw);
  const provider = mapProvider(poi.OperatorInfo?.Title);
  const addr = poi.AddressInfo;

  // Rough availability heuristic: operational → ~80 % available
  const isOp = poi.StatusType?.IsOperational ?? true;
  const available = isOp ? Math.max(1, Math.round(totalPoints * 0.75)) : 0;

  return {
    id: poi.ID,
    name: addr.Title,
    provider,
    city: addr.Town ?? "",
    region: addr.StateOrProvince ?? "",
    country: addr.Country?.Title ?? "",
    countryCode: addr.Country?.ISOCode ?? "",
    corridor: addr.StateOrProvince ?? addr.Town ?? "",
    location: [addr.AddressLine1, addr.Town].filter(Boolean).join(", "),
    coordinates: { lat: addr.Latitude, lng: addr.Longitude },
    maxKw: maxKw || 50,
    points: totalPoints || 1,
    connectors,
    speed,
    available,
    total: totalPoints || 1,
    distance: "",
    pricingHint: "Availability may vary · Charging data via Open Charge Map",
    amenities: [],
    sourceIds: { openChargeMap: poi.ID },
  };
}

// ── Request handler ───────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  try {
    const apiKey = Deno.env.get("OCM_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OCM_API_KEY not configured" }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    const url = new URL(req.url);
    const countrycode = url.searchParams.get("countrycode") ?? "";
    const lat = url.searchParams.get("lat") ?? "";
    const lng = url.searchParams.get("lng") ?? "";
    const distance = Math.min(200, parseInt(url.searchParams.get("distance") ?? "80", 10));
    const maxresults = Math.min(100, parseInt(url.searchParams.get("maxresults") ?? "50", 10));
    const pageindex = Math.max(0, parseInt(url.searchParams.get("pageindex") ?? "0", 10));

    if (!countrycode && (!lat || !lng)) {
      return new Response(
        JSON.stringify({ error: "Provide countrycode or lat+lng" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    const cacheKey = `${countrycode}|${lat}|${lng}|${distance}|${maxresults}|${pageindex}`;
    const cached = CACHE.get(cacheKey);
    if (cached && Date.now() - cached.at < TTL_MS) {
      return new Response(
        JSON.stringify({ stations: cached.data, cached: true, source: "Open Charge Map" }),
        { headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    const params = new URLSearchParams({
      key: apiKey,
      output: "json",
      compact: "true",
      verbose: "false",
      maxresults: String(maxresults),
    });

    if (countrycode) params.set("countrycode", countrycode);
    if (lat && lng) {
      params.set("latitude", lat);
      params.set("longitude", lng);
      params.set("distance", String(distance));
      params.set("distanceunit", "KM");
    }

    const ocmRes = await fetch(`${OCM_BASE}?${params}`, {
      headers: { "User-Agent": "AUTOVERE/1.0 (autovere.com)" },
    });

    if (!ocmRes.ok) {
      const text = await ocmRes.text();
      return new Response(
        JSON.stringify({ error: "OCM API error", detail: text }),
        { status: 502, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    const pois: OcmPoi[] = await ocmRes.json();
    const stations = pois.map(mapStation);

    CACHE.set(cacheKey, { at: Date.now(), data: stations });

    return new Response(
      JSON.stringify({ stations, cached: false, source: "Open Charge Map", total: stations.length }),
      { headers: { ...CORS, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }
});
