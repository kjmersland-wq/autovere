import { countryFuelEur, operatorKwhEur } from "@/lib/market-rates";
import { distanceToCorridorKm, type LatLng } from "@/lib/corridor-filter";

import type { FuelKey, RegionKey, TripEstimate, VehicleKey } from "@/lib/trip-data";

/* ------------------------------------------------------------------ */
/* Verified EV fast-charging hubs (src/data/ev_chargers_eu.json)       */
/*                                                                      */
/* Sourced from OpenStreetMap (Overpass API) on 2026-09-08: real,      */
/* named DC fast-charging stations across Norway, Sweden, Denmark,     */
/* Germany, Austria, Switzerland and Italy — filtered to power ≥150kW  */
/* and ≤400kW, a recognised network operator, and a CCS or CHAdeMO     */
/* connector, then deduplicated within 100m. Replaces the old          */
/* seeded-random "ev" layer below, which invented plausible-sounding   */
/* but entirely fictional stations with no real coordinates.           */
/*                                                                      */
/* Loaded lazily (dynamic import, ~500kB) by the caller (CorridorMap)   */
/* rather than statically here — a top-level import inlined the whole   */
/* dataset into the HeroPlanner bundle loaded on every visit, nearly    */
/* doubling it, for a layer most trips don't even use. */
/* ------------------------------------------------------------------ */

export type EvCharger = {
  id: string;
  name: string;
  operator: string;
  network: string;
  lat: number;
  lon: number;
  power_kw: number;
  stalls: number;
  connector: "CCS" | "CHAdeMO";
};

/* ------------------------------------------------------------------ */
/* Verified fuel/service stations (src/data/fuel_stations_eu.json)      */
/*                                                                      */
/* Sourced from OpenStreetMap (Overpass API): real, named motorway and  */
/* RV-relevant fuel stations across the same 16 countries as the EV     */
/* dataset. Loaded lazily by the caller, same rationale as EvCharger.   */
/* ------------------------------------------------------------------ */

export type FuelStation = {
  id: string;
  name: string;
  brand: string;
  lat: number;
  lon: number;
  country: string;
  has_lpg: boolean;
  has_dump_station: boolean;
  is_24_7: boolean;
};

/** ISO-3166-1 alpha-2 -> full country name, for the countries the fuel
 * dataset covers — needed to look up pump rates in COUNTRY_FUEL, which is
 * keyed by name rather than by code. */
const FUEL_COUNTRY_NAMES: Record<string, string> = {
  NO: "Norway",
  SE: "Sweden",
  DK: "Denmark",
  DE: "Germany",
  AT: "Austria",
  CH: "Switzerland",
  IT: "Italy",
  FR: "France",
  NL: "Netherlands",
  CZ: "Czechia",
  SI: "Slovenia",
  ES: "Spain",
  PL: "Poland",
  SK: "Slovakia",
  BE: "Belgium",
  HR: "Croatia",
};

/** How close a real hub must be to the actual routed polyline to count as
 * "along this trip" — matches the buffer used for mountain-pass/border
 * corridor filtering elsewhere in this codebase. */
const EV_CORRIDOR_RADIUS_KM = 15;

/** Same corridor buffer as EV chargers, applied to real fuel/service stations. */
const FUEL_CORRIDOR_RADIUS_KM = 15;

/** Loose, bidirectional match so "Ionity" (the vehicle-settings option) and
 * "IONITY" (the dataset's canonical name) — or a longer variant like
 * "GreenWay Polska" vs "GreenWay" — still recognise each other regardless
 * of exact casing/wording. */
function networkMatches(datasetNetwork: string, preferred: string | undefined): boolean {
  if (!preferred || preferred === "All networks") return false;
  const a = datasetNetwork.toLowerCase().replace(/[^a-z0-9]/g, "");
  const b = preferred.toLowerCase().replace(/[^a-z0-9]/g, "");
  return a.includes(b) || b.includes(a);
}

/** Fraction along the routed polyline (0..1) nearest to a given point —
 * used to place a real hub at its actual position along the trip instead
 * of an arbitrary slot. */
function nearestProgress(coords: LatLng[] | undefined | null, lat: number, lng: number): number {
  if (!coords || coords.length < 2) return 0.5;
  let bestIdx = 0;
  let bestDist = Number.POSITIVE_INFINITY;
  coords.forEach((c, i) => {
    const dLat = c[0] - lat;
    const dLng = c[1] - lng;
    const d = dLat * dLat + dLng * dLng; // relative comparison only — no need for haversine here
    if (d < bestDist) {
      bestDist = d;
      bestIdx = i;
    }
  });
  return bestIdx / (coords.length - 1);
}

/** Real EV hubs within EV_CORRIDOR_RADIUS_KM of the routed polyline, with
 * any matching the driver's preferred network (Garage vehicle settings)
 * sorted first. Empty when there's no real routed polyline yet (coords),
 * matching the "only ever real, verified hubs — never invented" rule. */
function evChargersAlongCorridor(
  allChargers: EvCharger[],
  coords: LatLng[] | undefined | null,
  preferredNetwork: string | undefined,
): EvCharger[] {
  if (!coords || coords.length === 0) return [];
  const near = allChargers.filter((c) => distanceToCorridorKm(coords, { lat: c.lat, lng: c.lon }) <= EV_CORRIDOR_RADIUS_KM);
  const preferred = near.filter((c) => networkMatches(c.network, preferredNetwork));
  const rest = near.filter((c) => !preferred.includes(c));
  return [...preferred, ...rest];
}

/** Vehicle-specific "how relevant is this station" boost — RVs care about
 * LPG/dump stations, motorcycles care about round-the-clock forecourts.
 * Cars get no boost, so results stay corridor-order (nearest-first isn't
 * tracked here; buildCorridorPois only needs a relevance ordering for pins). */
function fuelRelevance(station: FuelStation, vehicle: VehicleKey | undefined): number {
  if (vehicle === "motorhome") return (station.has_lpg ? 1 : 0) + (station.has_dump_station ? 1 : 0);
  if (vehicle === "motorcycle") return station.is_24_7 ? 1 : 0;
  return 0;
}

/** Real fuel/service stations within FUEL_CORRIDOR_RADIUS_KM of the routed
 * polyline, with vehicle-relevant amenities (LPG/dump station for RVs,
 * 24/7 for motorcycles) sorted first. Empty when there's no real routed
 * polyline yet, matching the "only ever real, verified stations" rule. */
function fuelStationsAlongCorridor(
  allStations: FuelStation[],
  coords: LatLng[] | undefined | null,
  vehicle: VehicleKey | undefined,
): FuelStation[] {
  if (!coords || coords.length === 0) return [];
  const near = allStations.filter((s) => distanceToCorridorKm(coords, { lat: s.lat, lng: s.lon }) <= FUEL_CORRIDOR_RADIUS_KM);
  return [...near].sort((a, b) => fuelRelevance(b, vehicle) - fuelRelevance(a, vehicle));
}

/* ------------------------------------------------------------------ */
/* Deterministic pseudo-randomness so a route always renders the same  */
/* ------------------------------------------------------------------ */

function seedFrom(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function makeRandom(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* Map geometry                                                        */
/* ------------------------------------------------------------------ */

export type MapPoint = { x: number; y: number };

/** Route polyline in a 0-100 × 0-100 viewport space. */
export function corridorPolyline(seedText: string, points = 9): MapPoint[] {
  const rnd = makeRandom(seedFrom(seedText));
  const out: MapPoint[] = [];
  for (let i = 0; i < points; i += 1) {
    const t = i / (points - 1);
    const x = 8 + t * 84;
    const wobble = Math.sin(t * Math.PI * 1.7 + rnd() * 0.6) * 16 + (rnd() - 0.5) * 9;
    const y = 72 - t * 44 + wobble * (0.25 + t * 0.5);
    out.push({ x, y: Math.min(90, Math.max(10, y)) });
  }
  out[0] = { x: 8, y: out[0]!.y };
  out[points - 1] = { x: 92, y: out[points - 1]!.y };
  return out;
}

/** Position along the polyline for a 0..1 progress value. */
export function pointAt(line: MapPoint[], t: number): MapPoint {
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (line.length - 1);
  const i = Math.min(line.length - 2, Math.floor(scaled));
  const f = scaled - i;
  const a = line[i]!;
  const b = line[i + 1]!;
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
}

/* ------------------------------------------------------------------ */
/* Layers                                                              */
/* ------------------------------------------------------------------ */

export type LayerKey = "ev" | "fuel" | "rv" | "pass" | "ferry" | "view";

export const MAP_LAYERS: { key: LayerKey; emoji: string; label: string; color: string }[] = [
  { key: "ev", emoji: "⚡", label: "EV Fast Chargers", color: "#34d399" },
  { key: "fuel", emoji: "⛽", label: "Fuel Stations", color: "#fbbf24" },
  { key: "rv", emoji: "🚐", label: "RV Campgrounds & Service Areas", color: "#60a5fa" },
  { key: "pass", emoji: "🏔️", label: "Mountain Passes", color: "#f87171" },
  { key: "ferry", emoji: "⛴️", label: "Ferry Terminals", color: "#22d3ee" },
  { key: "view", emoji: "🌄", label: "Scenic Viewpoints & Photo Stops", color: "#c084fc" },
];

export type CorridorPoi = {
  id: string;
  layer: LayerKey;
  name: string;
  detail: string;
  atKm: number;
  atLabel: string;
  progress: number;
  status?: "open" | "closed" | "chains";
  price?: string;
  /** Ad-hoc charging rate per kWh in EUR (EV layer). */
  kwhEur?: number;
  /** Pump rates per litre in EUR (fuel layer). */
  petrolEur?: number;
  dieselEur?: number;
  /** Brand/point specific symbol shown on the map instead of the generic layer emoji. */
  icon?: string;
};

/** Brand-aware symbol so Tesla, Ionity, Shell, KOA … are recognisable on the map. */
export function brandIcon(name: string, layer: LayerKey): string {
  const n = name.toLowerCase();
  if (/tesla/.test(n)) return "🚘";
  if (/ionity/.test(n)) return "🟦";
  if (/fastned/.test(n)) return "🟨";
  if (/electrify america/.test(n)) return "🟩";
  if (/evgo|chargepoint|flo|circuit électrique|recharge|allego|petro-canada ev|orlen|greenway|enbw|aral|electra|powerdot|cez/.test(n)) return "🔌";
  if (/buc-ee/.test(n)) return "🦫";
  if (/shell/.test(n)) return "🐚";
  if (/koa|camping|campground|stellplatz|aire|bobil|halte/.test(n)) return "🏕️";
  if (/ferry|ferje|ferje|shuttle/.test(n)) return "⛴️";
  return MAP_LAYERS.find((l) => l.key === layer)?.emoji ?? "📍";
}

/** Operator livery colours so charging pins read at a glance on the map. */
export function operatorColor(name: string, fallback: string): string {
  const n = name.toLowerCase();
  if (/tesla/.test(n)) return "#e11d48";
  if (/ionity/.test(n)) return "#2563eb";
  if (/fastned/.test(n)) return "#facc15";
  if (/electrify america|electrify canada/.test(n)) return "#22c55e";
  if (/enbw/.test(n)) return "#0ea5e9";
  if (/greenway|orlen/.test(n)) return "#16a34a";
  if (/clever|spirii|recharge|mer\b/.test(n)) return "#8b5cf6";
  if (/allego/.test(n)) return "#f97316";
  if (/electra|powerdot|bp pulse|shell recharge/.test(n)) return "#ec4899";
  if (/cez|e\.on|vattenfall|lidl|kaufland|elocity|eleport|polenergia/.test(n)) return "#14b8a6";
  if (/evgo|chargepoint|flo|circuit|petro-canada/.test(n)) return "#06b6d4";
  return fallback;
}

const FUEL_BRANDS: Record<RegionKey, string[]> = {
  eu: ["Shell", "TotalEnergies", "Eni", "Aral", "Circle K", "OMV"],
  us: ["Shell", "Chevron", "Pilot Flying J", "BP", "Buc-ee's"],
  ca: ["Petro-Canada", "Esso", "Shell", "Circle K", "Ultramar"],
};

const RV_NAMES: Record<RegionKey, string[]> = {
  eu: ["Aire de camping-car", "Stellplatz", "Camping municipal", "Bobilparkering"],
  us: ["KOA Holiday", "State Park Campground", "RV Resort", "Truck & RV Plaza"],
  ca: ["Provincial Park Campground", "KOA Campground", "Halte routière VR", "RV Park"],
};

const VIEWPOINTS: Record<RegionKey, { name: string; detail: string }[]> = {
  eu: [
    { name: "Panorama rest area", detail: "Valley overlook · picnic tables · photo spot" },
    { name: "Lakeside viewpoint", detail: "Free parking · short walk to the shoreline" },
    { name: "Alpine summit overlook", detail: "Glacier panorama · café · restrooms" },
    { name: "Coastal cliff lookout", detail: "Sunset viewpoint · motorhome-friendly parking" },
  ],
  us: [
    { name: "Scenic Overlook", detail: "Pull-through parking · interpretive signage" },
    { name: "Canyon Rim Viewpoint", detail: "Sunrise photo stop · vault restrooms" },
    { name: "State Scenic Byway Pullout", detail: "RV-length parking · trailhead" },
    { name: "Lake Vista Point", detail: "Picnic area · boat ramp" },
  ],
  ca: [
    { name: "Belvédère panoramique", detail: "Halte routière · vue sur la vallée" },
    { name: "Rocky Mountain Lookout", detail: "Wildlife viewing · big-rig parking" },
    { name: "Lakeshore Viewpoint", detail: "Picnic shelter · washrooms" },
    { name: "Fjord & Coast Lookout", detail: "Whale-watching season · photo deck" },
  ],
};

function kmLabel(units: "metric" | "imperial", km: number) {
  return units === "imperial" ? `${Math.round(km * 0.621371)} mi` : `${Math.round(km)} km`;
}

export function buildCorridorPois({
  region,
  trip,
  origin,
  destination,
  ferryNames,
  passes,
  preferredNetwork,
  evChargers = [],
  fuelStations = [],
  vehicle,
}: {
  region: RegionKey;
  trip: TripEstimate;
  origin: string;
  destination: string;
  ferryNames: string[];
  passes: { name: string; status: "open" | "closed" | "chains"; detail: string }[];
  /** Driver's preferred fast-charging operator from Garage vehicle settings
   * ("All networks"/undefined = no preference) — matching real hubs sort first. */
  preferredNetwork?: string | undefined;
  /** The verified EV charger dataset (src/data/ev_chargers_eu.json), lazily
   * loaded by the caller — omitted/empty simply means no "ev" pins render,
   * never a fallback to invented ones. */
  evChargers?: EvCharger[];
  /** The verified fuel/service station dataset (src/data/fuel_stations_eu.json),
   * lazily loaded by the caller — omitted/empty means the "fuel" layer falls
   * back to the synthetic placeholder stations rather than real ones. */
  fuelStations?: FuelStation[];
  /** Vehicle type, so RV/motorcycle-relevant stations sort first among real hits. */
  vehicle?: VehicleKey;
}): CorridorPoi[] {
  const rnd = makeRandom(seedFrom(`${origin}|${destination}|${trip.variant}|${region}`));
  const total = Math.max(60, trip.distanceKm);
  const pois: CorridorPoi[] = [];

  const push = (layer: LayerKey, progress: number, name: string, detail: string, extra: Partial<CorridorPoi> = {}) => {
    const atKm = total * progress;
    pois.push({
      id: `${layer}-${pois.length}`,
      layer,
      name,
      detail,
      atKm,
      atLabel: kmLabel(trip.units, atKm),
      progress,
      icon: brandIcon(name, layer),
      ...extra,
    });
  };

  // Real hubs only. Empty for non-EU regions/routes without a resolved
  // polyline yet (e.g. the fallback sample-based estimate) or before the
  // dataset has finished lazy-loading — matching the "never invented" rule
  // rather than falling back to a guess.
  const evStops = evChargersAlongCorridor(evChargers, trip.corridor?.coords, preferredNetwork).slice(0, 8);
  for (const station of evStops) {
    const p = nearestProgress(trip.corridor?.coords, station.lat, station.lon);
    push("ev", p, station.name, `${station.power_kw} kW · ${station.stalls} bays · ${station.connector}`, {
      kwhEur: operatorKwhEur(station.network),
      icon: brandIcon(`${station.network} ${station.name}`, "ev"),
    });
  }

  // Real stations only (src/data/fuel_stations_eu.json — EU coverage today,
  // same "never invented" rule as the "ev" layer above). Vehicle-relevant
  // amenities (LPG/dump station for RVs, 24/7 for motorcycles) sort first.
  const fuelStops = fuelStationsAlongCorridor(fuelStations, trip.corridor?.coords, vehicle).slice(0, 8);
  for (const station of fuelStops) {
    const p = nearestProgress(trip.corridor?.coords, station.lat, station.lon);
    const rate = countryFuelEur(FUEL_COUNTRY_NAMES[station.country] ?? station.country);
    const amenities =
      [station.is_24_7 ? "24/7" : null, station.has_lpg ? "LPG" : null, station.has_dump_station ? "dump station" : null]
        .filter(Boolean)
        .join(" · ") || "forecourt";
    push("fuel", p, station.name || station.brand, amenities, {
      price: `€${rate.petrol.toFixed(2)}/L`,
      petrolEur: rate.petrol,
      dieselEur: rate.diesel,
      icon: brandIcon(`${station.brand} ${station.name}`, "fuel"),
    });
  }

  const rvCount = Math.min(5, Math.max(2, Math.round(total / 280)));
  for (let i = 0; i < rvCount; i += 1) {
    const p = (i + 0.8) / (rvCount + 0.6);
    const base = RV_NAMES[region][Math.floor(rnd() * RV_NAMES[region].length)]!;
    push("rv", p, base, "Dump station · fresh water · overnight pitches");
  }

  const viewCount = Math.min(4, Math.max(2, Math.round(total / 260)));
  for (let i = 0; i < viewCount; i += 1) {
    const p = (i + 0.35) / (viewCount + 0.3);
    const spot = VIEWPOINTS[region][Math.floor(rnd() * VIEWPOINTS[region].length)]!;
    push("view", p, spot.name, spot.detail, { icon: "🌄" });
  }

  passes.slice(0, 4).forEach((pass, i) => {
    push("pass", 0.25 + i * 0.18, pass.name, pass.detail, { status: pass.status, icon: "🏔️" });
  });

  ferryNames.slice(0, 3).forEach((name, i) => {
    push("ferry", 0.35 + i * 0.22, name, "Ferry terminal · check-in 30 min before departure", {
      icon: "⛴️",
    });
  });

  return pois.sort((a, b) => a.atKm - b.atKm);
}

/* ------------------------------------------------------------------ */
/* Fuel price sourcing                                                 */
/* ------------------------------------------------------------------ */

export type FuelSource = {
  key: "fr" | "at" | "benchmark";
  badge: string;
  note: string;
  url: string;
};

export const FUEL_SOURCES: Record<FuelSource["key"], FuelSource> = {
  fr: {
    key: "fr",
    badge: "Live Government Fuel Data (prix-carburants)",
    note: "Station prices published by the French Ministry of Economy open data feed.",
    url: "https://www.prix-carburants.gouv.fr/",
  },
  at: {
    key: "at",
    badge: "Live E-Control Spritpreisrechner",
    note: "Austrian regulator E-Control publishes station-level prices, updated through the day.",
    url: "https://www.spritpreisrechner.at/",
  },
  benchmark: {
    key: "benchmark",
    badge: "National Average Benchmark (EAFO / EU Bulletin)",
    note: "Indicative national averages from EAFO and the EU Weekly Oil Bulletin.",
    url: "https://alternative-fuels-observatory.ec.europa.eu/",
  },
};

export function countryFuelSource(country: string): FuelSource {
  if (/france/i.test(country)) return FUEL_SOURCES.fr;
  if (/austria|österreich/i.test(country)) return FUEL_SOURCES.at;
  return FUEL_SOURCES.benchmark;
}


export type FuelStop = {
  id: string;
  brand: string;
  name: string;
  country: string;
  atLabel: string;
  atKm: number;
  price: string;
  /** Numeric price so the UI can render it in the active display currency. */
  priceValue: number;
  /** Currency symbol the numeric price is expressed in. */
  priceSymbol: string;
  priceUnit: string;
  /** Petrol 95 / diesel market rate per litre in EUR, for popups and comparisons. */
  petrolEur: number;
  dieselEur: number;
  source: FuelSource;
  amenities: string[];
};

export function buildFuelStops({
  region,
  trip,
  origin,
  destination,
  fuel,
}: {
  region: RegionKey;
  trip: TripEstimate;
  origin: string;
  destination: string;
  fuel: FuelKey;
}): FuelStop[] {
  const rnd = makeRandom(seedFrom(`fuel|${origin}|${destination}|${trip.variant}|${fuel}`));
  const countries = trip.segments.length
    ? trip.segments.map((s) => s.country)
    : [region === "us" ? "United States" : region === "ca" ? "Canada" : "Europe"];
  const total = Math.max(60, trip.distanceKm);
  const count = Math.min(7, Math.max(3, Math.round(total / 170)));
  const brands = FUEL_BRANDS[region];

  return Array.from({ length: count }, (_, i) => {
    const p = (i + 0.6) / (count + 0.3);
    const country = countries[Math.min(countries.length - 1, Math.floor(p * countries.length))]!;
    const brand = brands[Math.floor(rnd() * brands.length)]!;
    const rate = countryFuelEur(country);
    // Motorway forecourts carry the higher published rate where we have one.
    const motorway = rnd() > 0.6;
    const petrolEur = motorway ? rate.motorwayPetrol ?? rate.petrol * 1.06 : rate.petrol;
    const dieselEur = motorway ? rate.motorwayDiesel ?? rate.diesel * 1.06 : rate.diesel;
    const priceValue = fuel === "diesel" ? dieselEur : petrolEur;
    const priceSymbol = "€";
    const price = `${priceSymbol}${priceValue.toFixed(3)}`;
    const atKm = total * p;
    return {
      id: `stop-${i}`,
      brand,
      name: `${brand} · ${country} corridor stop ${i + 1}`,
      country,
      atKm,
      atLabel: kmLabel(trip.units, atKm),
      price,
      priceValue,
      priceSymbol,
      priceUnit: "per litre",
      petrolEur,
      dieselEur,
      source: countryFuelSource(country),
      amenities: ["24/7", rnd() > 0.5 ? "HGV/RV lanes" : "Café", rnd() > 0.6 ? "AdBlue" : "Car wash"],
    };
  });
}


/* ------------------------------------------------------------------ */
/* Motorhome camping radar                                             */
/* ------------------------------------------------------------------ */

export type CampSpot = {
  id: string;
  name: string;
  kind: string;
  atLabel: string;
  rating: number;
  price: string;
  services: string[];
};

const CAMP_TEMPLATES: Record<RegionKey, { name: string; kind: string; services: string[] }[]> = {
  eu: [
    { name: "Aire de camping-car municipale", kind: "Aire · France", services: ["Dump station", "Fresh water", "Electric hook-up"] },
    { name: "Stellplatz am Fluss", kind: "Stellplatz · Germany/Austria", services: ["Overnight pitches", "Grey water", "WiFi"] },
    { name: "Camping Alpenblick", kind: "Rated campsite · Alps", services: ["Showers", "Laundry", "Restaurant"] },
    { name: "Bobilparkering Fjordsyn", kind: "Bobil pitch · Norway", services: ["Fjord view", "Fresh water", "Toilets"] },
    { name: "Sosta camper Lago", kind: "Sosta · Italy", services: ["Dump station", "Shade", "Walk to town"] },
  ],
  us: [
    { name: "KOA Holiday Resort", kind: "Full hook-up RV park", services: ["50-amp", "Sewer", "Pool"] },
    { name: "State Park Campground", kind: "Public campground", services: ["Dump station", "Potable water", "Trails"] },
    { name: "Interstate Travel Plaza", kind: "Overnight service area", services: ["RV dump", "Propane", "24/7 fuel"] },
    { name: "Lakeside RV Resort", kind: "Premium RV resort", services: ["Full hook-up", "Laundry", "WiFi"] },
  ],
  ca: [
    { name: "Provincial Park Campground", kind: "Public campground", services: ["Dump station", "Potable water", "Firewood"] },
    { name: "Halte routière VR", kind: "Roadside VR halt", services: ["Overnight parking", "Toilets", "Fresh water"] },
    { name: "KOA Campground", kind: "Full hook-up RV park", services: ["30/50-amp", "Sewer", "Showers"] },
    { name: "Mountain View RV Park", kind: "Rated RV park", services: ["Full hook-up", "Laundry", "WiFi"] },
  ],
};

export function buildCampSpots({
  region,
  trip,
  origin,
  destination,
}: {
  region: RegionKey;
  trip: TripEstimate;
  origin: string;
  destination: string;
}): CampSpot[] {
  const rnd = makeRandom(seedFrom(`camp|${origin}|${destination}|${region}`));
  const templates = CAMP_TEMPLATES[region];
  const total = Math.max(60, trip.distanceKm);
  const count = Math.min(templates.length, Math.max(3, Math.round(total / 260)));
  const currency = region === "us" ? "$" : region === "ca" ? "C$" : "€";

  return Array.from({ length: count }, (_, i) => {
    const t = templates[i % templates.length]!;
    const p = (i + 0.7) / (count + 0.4);
    const atKm = total * p;
    return {
      id: `camp-${i}`,
      name: t.name,
      kind: t.kind,
      atLabel: kmLabel(trip.units, atKm),
      rating: Math.round((3.9 + rnd() * 1.05) * 10) / 10,
      price: `${currency}${(12 + Math.round(rnd() * 34))}/night`,
      services: t.services,
    };
  });
}

export type { VehicleKey };
