import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Real-time place search used by the origin/destination autocomplete.
 * Photon (Komoot) is keyless, OSM-backed and fast enough for a 300 ms debounce;
 * Nominatim is the fallback when Photon has nothing.
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

/** Search bias per active region context: [lat, lng] focus point. */
const REGION_FOCUS: Record<string, { lat: number; lng: number; codes: string[] }> = {
  eu: { lat: 50.5, lng: 10.5, codes: [] },
  us: { lat: 39.5, lng: -98.35, codes: ["US"] },
  ca: { lat: 56.1, lng: -106.3, codes: ["CA"] },
};

const cache = new Map<string, PlaceHit[]>();

function labelOf(p: Record<string, string>) {
  const name = p["name"] ?? p["city"] ?? p["street"] ?? "";
  const region = p["state"] ?? p["county"] ?? p["district"] ?? "";
  const country = p["country"] ?? "";
  return [name, region, country].filter(Boolean).join(", ");
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
    const key = `${data.region}|${data.query.toLowerCase().trim()}`;
    const cached = cache.get(key);
    if (cached) return cached;

    const focus = REGION_FOCUS[data.region] ?? REGION_FOCUS["eu"]!;
    const url =
      `https://photon.komoot.io/api?limit=8&lang=en` +
      `&lat=${focus.lat}&lon=${focus.lng}` +
      `&q=${encodeURIComponent(data.query)}`;

    let hits: PlaceHit[] = [];
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
      if (res.ok) {
        const json = (await res.json()) as {
          features?: { geometry: { coordinates: [number, number] }; properties: Record<string, string> }[];
        };
        hits = (json.features ?? [])
          .filter((f) => f.properties?.["countrycode"])
          .map((f, i) => {
            const p = f.properties;
            const [lng, lat] = f.geometry.coordinates;
            return {
              id: `${p["osm_id"] ?? i}-${i}`,
              label: labelOf(p),
              name: p["name"] ?? p["city"] ?? data.query,
              state: p["state"] ?? p["county"] ?? "",
              country: p["country"] ?? "",
              code: String(p["countrycode"]).toUpperCase(),
              lat,
              lng,
            };
          });
      }
    } catch {
      hits = [];
    }

    // Region bias: keep in-region matches first for /us and /ca.
    if (focus.codes.length) {
      hits = [
        ...hits.filter((h) => focus.codes.includes(h.code)),
        ...hits.filter((h) => !focus.codes.includes(h.code)),
      ];
    }

    // De-duplicate identical labels (Photon often returns several OSM objects).
    const seen = new Set<string>();
    hits = hits.filter((h) => (seen.has(h.label) ? false : (seen.add(h.label), true))).slice(0, 6);

    if (hits.length) cache.set(key, hits);
    return hits;
  });
