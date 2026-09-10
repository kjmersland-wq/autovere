import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { CorridorStop } from "@/lib/corridor-map";
import type { PoiInterestId } from "@/lib/poi-interests";

const requestSchema = z.object({
  coords: z.array(z.tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)])).min(2).max(12),
  categories: z.array(z.string()).min(1).max(16),
});

const TAG_QUERIES: Partial<Record<PoiInterestId, string[]>> = {
  rv_services: ['amenity="sanitary_dump_station"', 'amenity="water_point"'],
  camping_stay: ['tourism="camp_site"', 'tourism="caravan_site"'],
  scenic_viewpoints: ['tourism="viewpoint"'],
  nature_outdoors: ['natural="waterfall"', 'leisure="nature_reserve"'],
  history_culture: ['historic', 'tourism="museum"'],
  castles_palaces: ['historic="castle"', 'historic="palace"'],
  kids_play: ['leisure="playground"', 'tourism="theme_park"', 'leisure="water_park"'],
  wildlife_nature: ['tourism="zoo"', 'tourism="aquarium"'],
  food_culinary: ['amenity="marketplace"', 'shop="farm"'],
  beach_water: ['natural="beach"', 'leisure="swimming_area"'],
  urban_city: ['place="square"'],
  adventure_active: ['sport="climbing"', 'highway="trailhead"'],
  peaceful_relax: ['leisure="garden"', 'leisure="park"'],
};

function stableKey(coords: [number, number][], categories: string[]) {
  const points = coords.map(([lat, lon]) => `${lat.toFixed(2)},${lon.toFixed(2)}`).join(";");
  return `osm:${categories.slice().sort().join(",")}:${points}`;
}

function overpassQuery(coords: [number, number][], categories: PoiInterestId[]) {
  const clauses: string[] = [];
  for (const category of categories) {
    for (const tag of TAG_QUERIES[category] ?? []) {
      for (const [lat, lon] of coords) clauses.push(`nwr(around:15000,${lat},${lon})[${tag}][name];`);
    }
  }
  return `[out:json][timeout:22];(${clauses.join("")});out center tags;`;
}

function categoryFor(tags: Record<string, string>): PoiInterestId | null {
  if (tags["amenity"] === "sanitary_dump_station" || tags["amenity"] === "water_point") return "rv_services";
  if (tags["tourism"] === "camp_site" || tags["tourism"] === "caravan_site") return "camping_stay";
  if (tags["tourism"] === "viewpoint") return "scenic_viewpoints";
  if (tags["natural"] === "waterfall" || tags["leisure"] === "nature_reserve") return "nature_outdoors";
  if (tags["historic"] === "castle" || tags["historic"] === "palace") return "castles_palaces";
  if (tags["historic"] || tags["tourism"] === "museum") return "history_culture";
  if (tags["leisure"] === "playground" || tags["tourism"] === "theme_park" || tags["leisure"] === "water_park") return "kids_play";
  if (tags["tourism"] === "zoo" || tags["tourism"] === "aquarium") return "wildlife_nature";
  if (tags["amenity"] === "marketplace" || tags["shop"] === "farm") return "food_culinary";
  if (tags["natural"] === "beach" || tags["leisure"] === "swimming_area") return "beach_water";
  if (tags["place"] === "square") return "urban_city";
  if (tags["sport"] === "climbing" || tags["highway"] === "trailhead") return "adventure_active";
  if (tags["leisure"] === "garden" || tags["leisure"] === "park") return "peaceful_relax";
  return null;
}

export const getLiveCorridorPois = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => requestSchema.parse(input))
  .handler(async ({ data }) => {
    const categories = data.categories.filter((item): item is PoiInterestId => item in TAG_QUERIES);
    if (!categories.length) return { stops: [] as CorridorStop[], source: "OpenStreetMap contributors" };
    const cacheKey = stableKey(data.coords, categories);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: cached } = await supabaseAdmin.from("poi_corridor_cache").select("payload, expires_at").eq("cache_key", cacheKey).maybeSingle();
    if (cached && new Date(cached.expires_at).getTime() > Date.now() && Array.isArray(cached.payload)) {
      return { stops: cached.payload as unknown as CorridorStop[], source: "OpenStreetMap contributors" };
    }
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", "User-Agent": "AutoVere/1.0 (kjell@autovere.com)" },
      body: new URLSearchParams({ data: overpassQuery(data.coords, categories) }),
    });
    if (!response.ok) return { stops: [] as CorridorStop[], source: "OpenStreetMap contributors" };
    const json = await response.json() as { elements?: Array<{ id: number; type: string; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }> };
    const seen = new Set<string>();
    const stops: CorridorStop[] = [];
    for (const element of json.elements ?? []) {
      const tags = element.tags ?? {}; const category = categoryFor(tags); const lat = element.lat ?? element.center?.lat; const lon = element.lon ?? element.center?.lon;
      if (!category || !categories.includes(category) || !tags["name"] || lat === undefined || lon === undefined) continue;
      const id = `osm-${element.type}-${element.id}`; if (seen.has(id)) continue; seen.add(id);
      const stop: CorridorStop = { id, name: tags["name"], category, country: tags["addr:country"] ?? "", lat, lon };
      if (tags["wikidata"]) stop.wikidata = tags["wikidata"];
      if (tags["wikipedia"]) stop.wikipedia = tags["wikipedia"];
      stops.push(stop);
      if (stops.length >= 120) break;
    }
    await supabaseAdmin.from("poi_corridor_cache").upsert({ cache_key: cacheKey, categories, payload: stops, expires_at: new Date(Date.now() + 7 * 86400000).toISOString() }, { onConflict: "cache_key" });
    return { stops, source: "OpenStreetMap contributors" };
  });