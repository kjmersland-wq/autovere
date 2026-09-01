import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Real-time place search used by the origin/destination autocomplete.
 * Primary source: Google Places API (New) `places:searchText` through the
 * Lovable connector gateway — it returns coordinates and address components in
 * a single call, so a picked suggestion locks exact lat/lng immediately.
 * Photon (Komoot, keyless OSM) stays as a graceful fallback.
 */

export type PlaceHit = {
  id: string;
  /** "City, Region, Country" */
  label: string;
  name: string;
  state: string;
  country: string;
  /** ISO-3166 alpha-2, upper case. */
  code: string;
  lat: number;
  lng: number;
};

const UA = "AutoVere/1.0 (road trip cost planner; contact: kjmersland@gmail.com)";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

/** Search bias per active region context: [lat, lng] focus point. */
const REGION_FOCUS: Record<string, { lat: number; lng: number; codes: string[]; radius: number }> = {
  eu: { lat: 50.5, lng: 10.5, codes: [], radius: 2_000_000 },
  us: { lat: 39.5, lng: -98.35, codes: ["US"], radius: 2_500_000 },
  ca: { lat: 56.1, lng: -106.3, codes: ["CA"], radius: 2_500_000 },
};

const cache = new Map<string, PlaceHit[]>();

function labelOf(p: Record<string, string>) {
  const name = p["name"] ?? p["city"] ?? p["street"] ?? "";
  const region = p["state"] ?? p["county"] ?? p["district"] ?? "";
  const country = p["country"] ?? "";
  return [name, region, country].filter(Boolean).join(", ");
}

type GooglePlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  addressComponents?: { longText?: string; shortText?: string; types?: string[] }[];
};

async function googleSearch(
  query: string,
  region: keyof typeof REGION_FOCUS,
  lang: string,
): Promise<PlaceHit[]> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["GOOGLE_MAPS_API_KEY"];
  if (!lovableKey || !connectionKey) return [];

  const focus = REGION_FOCUS[region] ?? REGION_FOCUS["eu"]!;
  const res = await fetch(`${GATEWAY_URL}/places/v1/places:searchText`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
      "Content-Type": "application/json",
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.addressComponents",
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: lang.slice(0, 2) || "en",
      maxResultCount: 8,
      ...(focus.codes.length ? { includedRegionCodes: focus.codes } : {}),
      locationBias: {
        circle: {
          center: { latitude: focus.lat, longitude: focus.lng },
          radius: focus.radius,
        },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Google Places searchText failed [${res.status}]: ${body}`);
    return [];
  }

  const json = (await res.json()) as { places?: GooglePlace[] };
  return (json.places ?? [])
    .filter((p) => p.location)
    .map((p, i) => {
      const comps = p.addressComponents ?? [];
      const pick = (type: string) => comps.find((c) => c.types?.includes(type));
      const countryComp = pick("country");
      const state =
        pick("administrative_area_level_1")?.longText ??
        pick("administrative_area_level_2")?.longText ??
        "";
      const name = p.displayName?.text ?? p.formattedAddress ?? query;
      const country = countryComp?.longText ?? "";
      return {
        id: p.id ?? `g-${i}`,
        label: [name, state, country].filter(Boolean).join(", "),
        name,
        state,
        country,
        code: (countryComp?.shortText ?? "").toUpperCase(),
        lat: p.location!.latitude,
        lng: p.location!.longitude,
      } satisfies PlaceHit;
    })
    .filter((h) => h.code.length === 2);
}

async function photonSearch(query: string, region: keyof typeof REGION_FOCUS): Promise<PlaceHit[]> {
  const focus = REGION_FOCUS[region] ?? REGION_FOCUS["eu"]!;
  const url =
    `https://photon.komoot.io/api?limit=8&lang=en` +
    `&lat=${focus.lat}&lon=${focus.lng}` +
    `&q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      features?: { geometry: { coordinates: [number, number] }; properties: Record<string, string> }[];
    };
    return (json.features ?? [])
      .filter((f) => f.properties?.["countrycode"])
      .map((f, i) => {
        const p = f.properties;
        const [lng, lat] = f.geometry.coordinates;
        return {
          id: `${p["osm_id"] ?? i}-${i}`,
          label: labelOf(p),
          name: p["name"] ?? p["city"] ?? query,
          state: p["state"] ?? p["county"] ?? "",
          country: p["country"] ?? "",
          code: String(p["countrycode"]).toUpperCase(),
          lat,
          lng,
        };
      });
  } catch {
    return [];
  }
}

export const searchPlaces = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({
        query: z.string().min(2).max(120),
        region: z.enum(["eu", "us", "ca"]).default("eu"),
        lang: z.string().max(5).default("en"),
      })
      .parse(data),
  )
  .handler(async ({ data }): Promise<PlaceHit[]> => {
    const key = `${data.region}|${data.lang}|${data.query.toLowerCase().trim()}`;
    const cached = cache.get(key);
    if (cached) return cached;

    const focus = REGION_FOCUS[data.region] ?? REGION_FOCUS["eu"]!;

    let hits = await googleSearch(data.query, data.region, data.lang);
    if (!hits.length) hits = await photonSearch(data.query, data.region);

    // Region bias: keep in-region matches first for /us and /ca.
    if (focus.codes.length) {
      hits = [
        ...hits.filter((h) => focus.codes.includes(h.code)),
        ...hits.filter((h) => !focus.codes.includes(h.code)),
      ];
    }

    // De-duplicate identical labels.
    const seen = new Set<string>();
    hits = hits.filter((h) => (seen.has(h.label) ? false : (seen.add(h.label), true))).slice(0, 6);

    if (hits.length) cache.set(key, hits);
    return hits;
  });
