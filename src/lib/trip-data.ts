import type { FlagCode } from "@/components/FlagIcon";
import { LOCALE_ROUTES } from "@/lib/locales";
import { DEFAULT_KWH_EUR, operatorKwhEur } from "@/lib/market-rates";
import type { EnergyPrices } from "@/lib/energy-prices.functions";
import type { RouteGeo } from "@/lib/route-geo.functions";
import { borderLabels, buildRouteSegments } from "@/lib/route-tolls";
import { filterByCorridor } from "@/lib/corridor-filter";
import { optimizeVignettes, type TripType, type VignettePlan } from "@/lib/vignette-optimizer";

export type { TripType };


export type RegionKey = "eu" | "us" | "ca";

export const REGIONS: { key: RegionKey; label: string; flag: string; to: "/" | "/us" | "/ca" }[] = [
  { key: "eu", label: "Europe", flag: "🇪🇺", to: "/" },
  { key: "us", label: "USA", flag: "🇺🇸", to: "/us" },
  { key: "ca", label: "Canada", flag: "🇨🇦", to: "/ca" },
];

export const LANGUAGES: { code: string; flag: FlagCode; label: string }[] = [
  { code: "en", flag: "GB", label: "English" },
  { code: "no", flag: "NO", label: "Norsk" },
  { code: "sv", flag: "SE", label: "Svenska" },
  { code: "da", flag: "DK", label: "Dansk" },
  { code: "fi", flag: "FI", label: "Suomi" },
  { code: "us", flag: "US", label: "US" },
  { code: "de", flag: "DE", label: "Deutsch" },
  { code: "nl", flag: "NL", label: "Nederlands" },
  { code: "fr", flag: "FR", label: "Français" },
  { code: "pl", flag: "PL", label: "Polski" },
  { code: "es", flag: "ES", label: "Español" },
  { code: "it", flag: "IT", label: "Italiano" },
  { code: "pt", flag: "PT", label: "Português" },
];

export const NAV_LINKS = [
  { to: "/planner", label: "Road Trip Planner" },
  { to: "/tolls", label: "Tolls & Vignettes" },
  { to: "/scenic", label: "Scenic Passes & Ferries" },
  { to: "/garage", label: "My Garage" },
] as const;

export type VehicleKey = "car" | "motorhome" | "motorcycle";
export type FuelKey = "petrol" | "diesel" | "electric";

export const VEHICLES: { key: VehicleKey; emoji: string; label: string }[] = [
  { key: "car", emoji: "🚗", label: "Car" },
  { key: "motorhome", emoji: "🚐", label: "Motorhome" },
  { key: "motorcycle", emoji: "🏍️", label: "Motorcycle" },
];

export const FUELS: { key: FuelKey; emoji: string; label: string }[] = [
  { key: "petrol", emoji: "⛽", label: "Petrol" },
  { key: "diesel", emoji: "🛢️", label: "Diesel" },
  { key: "electric", emoji: "⚡", label: "Electric (EV)" },
];

export type RegionDefaults = {
  units: "metric" | "imperial";
  distanceUnit: string;
  volumeUnit: string;
  currencyCode: string;
  currency: string;
  tollSystems: string[];
};

export const REGION_DEFAULTS: Record<RegionKey, RegionDefaults> = {
  eu: {
    units: "metric",
    distanceUnit: "km",
    volumeUnit: "L",
    currencyCode: "EUR",
    currency: "€",
    tollSystems: ["Vignettes & e-vignettes", "Ticket-based motorway tolls", "Urban low-emission zones"],
  },
  us: {
    units: "imperial",
    distanceUnit: "mi",
    volumeUnit: "gal",
    currencyCode: "USD",
    currency: "$",
    tollSystems: ["State toll roads & turnpikes", "HOV / Express lanes", "Bridge & tunnel tolls"],
  },
  ca: {
    units: "metric",
    distanceUnit: "km",
    volumeUnit: "L",
    currencyCode: "CAD",
    currency: "C$",
    tollSystems: ["Highway 407 ETR", "Provincial tolls & bridges", "BC Ferries crossings"],
  },
};

/** Region is independent from language: /us, /ca, /fr/us, /no/ca all resolve here. */
export function regionFromPath(pathname: string): RegionKey {
  const parts = pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  const first = parts[0] ?? "";
  if (first === "us") return "us";
  if (first === "ca") return "ca";
  // Matrix routes only: /<language>/<region>/<page>, e.g. /fr/us/planner.
  const seg = LOCALE_ROUTES.some((l) => l.prefix === first) ? (parts[1] ?? "") : first;
  if (seg === "us") return "us";
  if (seg === "ca") return "ca";
  return "eu";
}

export const REGION_COPY: Record<
  RegionKey,
  { eyebrow: string; currency: string; originHint: string; destinationHint: string }
> = {
  eu: {
    eyebrow: "Europe · 30+ countries",
    currency: "€",
    originHint: "Where are you picking up the car?",
    destinationHint: "Where is the road taking you?",
  },
  us: {
    eyebrow: "United States · 50 states",
    currency: "$",
    originHint: "Where are you picking up the car?",
    destinationHint: "Where is the road taking you?",
  },
  ca: {
    eyebrow: "Canada · coast to coast",
    currency: "C$",
    originHint: "Where are you picking up the car?",
    destinationHint: "Where is the road taking you?",
  },
};

export type TollLine = {
  place: string;
  detail: string;
  amount: number;
  badge?: string | undefined;
  /** Official purchase / payment portal */
  portal?: { label: string; url: string };
  /** Motorcycles ride free (e.g. Norwegian city rings) */
  freeForMotorcycle?: boolean;
  /** Country-specific motorcycle price factor for this line (vignettes only). Falls back to a generic discount when absent. */
  motoFactor?: number;
  /** True for a multi-day vignette/sticker line — stays valid for the whole return trip, unlike distance tolls and ferry tickets. */
  isVignette?: boolean;
};

export type SafetySection = { heading: string; items: string[] };

export type TripEstimate = {
  currency: string;
  units: "metric" | "imperial";
  distanceLabel: string;
  budget: number;
  distanceKm: number;
  driveHours: number;
  variant: RouteVariantKey;
  driveTime: string;

  tolls: number;
  ferries: number;
  energyCost: number;
  energyLabel: string;
  energyAmount: string;
  segments: { country: string; total: number; lines: TollLine[] }[];
  /** Real routed corridor: countries actually crossed + border crossings. */
  corridor?: RouteCorridor | null;
  safety: { title: string; sections: SafetySection[] };
  optimizer: EnergyOptimizer;
  /** Energy price per kWh expressed in the trip's base currency. */
  pricePerKwh?: number;
  vignette?: VignettePlan | null;
  tripType?: TripType;
  durationDays?: number;
  discountNote?: string | undefined;
};

export type RouteCorridor = {
  countries: {
    code: string;
    flag: string;
    country: string;
    distanceKm: number;
    distanceLabel: string;
    entryPlace: string;
    exitPlace: string;
  }[];
  borders: string[];
  from: string;
  to: string;
  /** Real routed polyline [lat, lng] — used by GPX export and the print map. */
  coords: [number, number][];
  /** Reverse-geocoded waypoints along the real polyline. */
  points: { name: string; detail: string; lat: number; lon: number }[];
};

export type ChargingStop = {
  name: string;
  atKm: number;
  atLabel: string;
  power: string;
  networks: string[];
  note: string;
  /** True when the stop is served by the driver's preferred operator. */
  preferred?: boolean;
  /** True when we had to fall back to the nearest high-power CCS hub. */
  fallback?: boolean;
  /** Energy needed on the leg leading into this stop. */
  kwhNeeded?: number;
  /** Length of the leg leading into this stop. */
  legLabel?: string;
  /** Indicative price per kWh in the trip's base currency. */
  pricePerKwh?: number;
};

/**
 * Consumption and charging preferences taken from the active saved vehicle
 * in "My Garage" — when present these drive the cost and stop intervals.
 */
export type VehicleProfile = {
  name?: string;
  kwhPer100?: number | undefined;
  batteryKwh?: number | undefined;
  /** Preferred charging operator, or undefined / "All networks" for any. */
  network?: string | undefined;
  /** Reserve kept in the battery, in percent (e.g. 25 → plan at 75% usable). */
  bufferPct?: number | undefined;
};

export function preferredNetwork(profile?: VehicleProfile | null) {
  const n = profile?.network?.trim();
  return n && !/^all/i.test(n) ? n : null;
}

export type EnergyOptimizer = {
  mode: "ev" | "fuel";
  title: string;
  rangeLabel: string;
  bufferLabel: string;
  stops: ChargingStop[];
  networks: string[];
  arbitrage: string[];
  longStretch: string[];
  /** Operator the driver asked us to prioritise, if any. */
  preferredNetwork?: string | null;
};

/**
 * Re-prioritises the corridor charging stops against an operator the driver
 * picked interactively in the results view. Stops without that operator inside
 * the battery window fall back to the nearest high-power CCS hub.
 */
export function applyNetworkFilter(
  optimizer: EnergyOptimizer,
  operator: string | null,
): EnergyOptimizer {
  if (optimizer.mode !== "ev" || !operator) {
    return {
      ...optimizer,
      preferredNetwork: optimizer.mode === "ev" ? optimizer.preferredNetwork ?? null : null,
    };
  }
  const want = operator.toLowerCase();
  const stops = optimizer.stops.map((s) => {
    const match = s.networks.find((n) => n.toLowerCase().includes(want));
    const networks = match ? [match, ...s.networks.filter((n) => n !== match)] : s.networks;
    const base = s.note.replace(/^[^.]*\.\s*/, "");
    return {
      ...s,
      networks,
      preferred: !!match,
      fallback: !match,
      note: match
        ? `${operator} hub on this leg. ${base}`
        : `No ${operator} site inside the battery window — nearest high-power CCS hub is ${networks[0] ?? "CCS"}. ${base}`,
    };
  });
  return { ...optimizer, stops, preferredNetwork: operator };
}

const EV_NETWORKS: Record<RegionKey, string[]> = {
  eu: ["Ionity", "Fastned", "Tesla Supercharger", "Allego"],
  us: ["Electrify America", "Tesla Supercharger", "EVgo"],
  ca: [
    "FLO",
    "Tesla Supercharger",
    "Petro-Canada eV",
    "Electrify Canada",
    "Circuit Électrique (QC)",
    "BC Hydro EV",
    "ChargePoint Canada",
    "Ivy Charging Network (ON)",
  ],
};

/** Charging networks that actually operate in each country on the corridor. */
const COUNTRY_EV_NETWORKS: Record<string, string[]> = {
  DK: ["Clever", "Ionity", "Tesla Supercharger", "Spirii"],
  DE: ["Ionity", "EnBW mobility+", "Tesla Supercharger", "Aral pulse"],
  PL: ["GreenWay Polska", "Ionity", "Orlen Charge", "Tesla Supercharger"],
  NL: ["Fastned", "Allego", "Ionity", "Tesla Supercharger"],
  BE: ["Fastned", "Ionity", "Allego", "Tesla Supercharger"],
  FR: ["Ionity", "TotalEnergies", "Tesla Supercharger", "Electra"],
  IT: ["Ionity", "Enel X Way", "Tesla Supercharger", "Free To X"],
  ES: ["Iberdrola", "Ionity", "Tesla Supercharger", "Zunder"],
  NO: ["Recharge", "Ionity", "Tesla Supercharger", "Mer"],
  SE: ["Recharge", "Ionity", "Tesla Supercharger", "Mer"],
  FI: ["Kesko K-Lataus", "Ionity", "Tesla Supercharger"],
  AT: ["Ionity", "Smatrics", "Tesla Supercharger"],
  CH: ["Ionity", "MOVE", "Tesla Supercharger"],
  CZ: ["ČEZ Futur/E", "Ionity", "Tesla Supercharger"],
  SK: ["ZSE Drive", "Ionity", "Tesla Supercharger"],
  HU: ["MOL Plugee", "Ionity", "Tesla Supercharger"],
  SI: ["Petrol", "Ionity", "Tesla Supercharger"],
  HR: ["ELEN", "Ionity", "Tesla Supercharger"],
  US: ["Electrify America", "Tesla Supercharger", "EVgo"],
  CA: ["FLO", "Tesla Supercharger", "Petro-Canada eV", "Electrify Canada"],
  GB: ["Ionity", "InstaVolt", "Tesla Supercharger", "Gridserve"],
};

function buildOptimizer(
  region: RegionKey,
  vehicle: VehicleKey,
  fuel: FuelKey,
  distanceKm: number,
  imperial: boolean,
  geo?: RouteGeo | null,
  profile?: VehicleProfile | null,
  pricePerKwh?: number,
): EnergyOptimizer {
  const isEv = fuel === "electric";
  const tank = vehicle === "motorhome" ? 90 : vehicle === "motorcycle" ? 18 : 55;
  const battery =
    profile?.batteryKwh && profile.batteryKwh > 0
      ? profile.batteryKwh
      : vehicle === "motorhome" ? 90 : vehicle === "motorcycle" ? 21 : 77;
  const consumption = vehicle === "motorhome" ? 11.5 : vehicle === "motorcycle" ? 4.8 : 6.6;
  const kwhPer100 =
    profile?.kwhPer100 && profile.kwhPer100 > 0
      ? profile.kwhPer100
      : vehicle === "motorhome" ? 28 : vehicle === "motorcycle" ? 12 : 18;
  const wanted = preferredNetwork(profile);
  /** Reserve the driver wants left in the battery / tank. */
  const bufferPct =
    profile?.bufferPct !== undefined && profile.bufferPct >= 5 && profile.bufferPct <= 50
      ? profile.bufferPct
      : 25;
  const usable = 1 - bufferPct / 100;

  const fullRange = isEv ? (battery / kwhPer100) * 100 : (tank / consumption) * 100;
  const safeRange = fullRange * usable;
  const stopCount = Math.max(1, Math.min(5, Math.ceil(distanceKm / safeRange) - 1));

  const d = (km: number) =>
    imperial
      ? `${Math.round(km * 0.621371).toLocaleString("en-US")} mi`
      : `${Math.round(km).toLocaleString("en-GB")} km`;

  const samples = geo?.samples ?? [];
  /** Closest reverse-geocoded point on the real polyline to a given distance. */
  const corridorPoint = (atKm: number) =>
    samples.length
      ? samples.reduce((best, s) =>
          Math.abs(s.atKm - atKm) < Math.abs(best.atKm - atKm) ? s : best,
        )
      : null;

  const corridorNetworks = (code?: string) =>
    (code && COUNTRY_EV_NETWORKS[code]) || EV_NETWORKS[region];

  const networks = samples.length
    ? Array.from(new Set(samples.flatMap((s) => corridorNetworks(s.code))))
    : EV_NETWORKS[region];

  /** The preferred operator first when it actually runs in that country. */
  const orderNetworks = (local: string[]) => {
    if (!wanted) return { list: local, hit: false };
    const match = local.find((n) => n.toLowerCase().includes(wanted.toLowerCase()));
    return match ? { list: [match, ...local.filter((n) => n !== match)], hit: true } : { list: local, hit: false };
  };

  const stops: ChargingStop[] = Array.from({ length: stopCount }, (_, i) => {
    const atKm = Math.round(safeRange * (i + 1));
    const legKm = i === 0 ? atKm : Math.round(safeRange);
    const kwhNeeded = Math.round((legKm / 100) * kwhPer100);
    const point = corridorPoint(atKm);
    const { list: local, hit } = orderNetworks(corridorNetworks(point?.code));
    const chargeNote = `Leg of ${d(legKm)} needs about ${kwhNeeded} kWh — arrive near ${bufferPct}% state of charge and charge to 80% in roughly ${vehicle === "motorhome" ? 38 : 22} min.`;
    return {
      name: point ? `${point.place || point.country} (${point.country})` : `Stop at ${d(atKm)}`,
      atKm,
      atLabel: d(atKm),
      power: isEv ? (vehicle === "motorhome" ? "150 kW CCS" : "350 kW CCS") : "24/7 forecourt",
      networks: isEv ? [local[0]!, local[1 % local.length]!] : [],
      note: isEv
        ? wanted
          ? hit
            ? `${wanted} hub on this leg. ${chargeNote}`
            : `No ${wanted} site in this battery window — nearest high-power CCS hub is ${local[0]}. ${chargeNote}`
          : chargeNote
        : `Recommended refuel — keeps you above the ${bufferPct}% reserve on a ${d(fullRange)} tank range.`,
      ...(isEv ? { kwhNeeded, legLabel: d(legKm) } : {}),
      ...(isEv ? { pricePerKwh: operatorKwhEur(local[0]!) || pricePerKwh || DEFAULT_KWH_EUR } : {}),
      ...(isEv && wanted ? { preferred: hit, fallback: !hit } : {}),
    };
  });

  const countryNames = geo?.countries.map((c) => `${c.flag} ${c.country}`) ?? [];

  const profileTail =
    isEv && (profile?.kwhPer100 || profile?.batteryKwh)
      ? ` · ${profile.name ?? "Saved vehicle"}: ${kwhPer100} kWh/100 km on a ${battery} kWh battery`
      : "";

  return {
    mode: isEv ? "ev" : "fuel",
    title: isEv ? "⚡ Smart EV Charging Optimizer" : "⛽ Smart Fuel Stop Optimizer",
    rangeLabel: `${d(fullRange)} full ${isEv ? "battery" : "tank"} range`,
    bufferLabel:
      (countryNames.length
        ? `Planned at a ${bufferPct}% safety buffer — ${d(safeRange)} between stops along ${countryNames.join(" → ")}`
        : `Planned at a ${bufferPct}% safety buffer — ${d(safeRange)} between stops`) + profileTail,
    stops,
    networks: isEv ? networks : [],
    arbitrage: [],
    longStretch: [],
    preferredNetwork: isEv ? wanted : null,
  };
}



/** Pass advisories keyed by the ISO code of the country they sit in. */
const PASSES_BY_COUNTRY: Record<string, string[]> = {
  IT: ["Stelvio Pass (2,757 m) — 48 hairpins, open, dry tarmac forecast until early evening."],
  AT: ["Grossglockner High Alpine Road — toll road, gates close at 21:00; ride it before dusk."],
  CH: ["Furka Pass — clear and open today, light crosswinds on the western ramp."],
  NO: ["Trollstigen — single-lane sections with tourist traffic; take the early morning slot."],
  FR: ["Col du Galibier (2,642 m) — open, but the north ramp cools fast after sunset."],
  ES: ["Puerto de Navacerrada — clear; watch for cyclists on the descent."],
  DE: ["Black Forest B500 ridge road — open, damp patches in shaded curves."],
  PL: ["Zakopianka (S7/DK47) mountain approach — heavy weekend tourist traffic."],
  SE: ["Vildmarksvägen — seasonal road, open June to October only."],
  DK: ["No mountain passes on this route — expect exposed crosswinds on the bridge sections instead."],
  NL: ["No mountain passes on this route — flat, well-lit motorway driving throughout."],
  US: ["Tail of the Dragon (US-129) — 318 curves in 11 miles; watch for gravel on the inside lines."],
  CA: ["Icefields Parkway — stunning but exposed; wildlife on the road at dawn and dusk."],
};

/** Only surface pass intel for countries the routed polyline actually crosses. */
function passesForRoute(region: RegionKey, geo: RouteGeo | null): string[] {
  if (geo && geo.countries.length) {
    const items = geo.countries.flatMap((c) => PASSES_BY_COUNTRY[c.code] ?? []);
    return items.length
      ? items
      : ["No mountain passes or seasonal closures detected along this corridor."];
  }
  return ["Select a start and destination to load live pass and closure intel for the countries you actually cross."];
}

/** Country-specific rules, only surfaced for countries the route really enters. */
const RIDER_RULES: Record<string, string> = {
  FR: "France: CE-approved gloves are mandatory for rider and pillion, and a high-vis vest must be carried within reach.",
  DE: "Germany: a DIN 13167 motorcycle first-aid kit is expected, and lane filtering is not permitted.",
  AT: "Austria: first-aid kit required; dipped headlights on at all times.",
  IT: "Italy: motorways are off-limits to bikes under 150 cc; carry the V5/registration document.",
  PL: "Poland: zero-tolerance alcohol limit (0.02%) and headlights on day and night.",
  DK: "Denmark: headlights on at all times; strong crosswinds on the Storebælt and Øresund bridges.",
  NO: "Norway: studded-tyre season rules apply from November; AutoPASS gantries are free for motorcycles.",
  SE: "Sweden: winter tyres required 1 Dec – 31 Mar in wintry conditions.",
  NL: "Netherlands: mopeds and bikes must use the main carriageway on motorways; strict 100 km/h daytime limit.",
  ES: "Spain: reflective vest must be carried; approved helmet with visor required.",
  US: "US: helmet laws vary by state — check the state line rules before you cross.",
  CA: "Canada: helmets are mandatory in every province; watch for wildlife at dawn and dusk.",
};

const CAMPER_RULES: Record<string, string> = {
  DE: "Germany: 3.5 t campers may use the left lane, but 100 km/h is the legal maximum unless plated for 120.",
  FR: "France: over 3.5 t you fall into the lower speed bands (110/100/80) and pay the class-2 péage rate.",
  IT: "Italy: many historic centres are ZTL-restricted — park outside and walk in.",
  AT: "Austria: over 3.5 t you need the GO-Box, not the vignette.",
  CH: "Switzerland: over 3.5 t requires the heavy-vehicle charge (PSVA) instead of the e-vignette.",
  DK: "Denmark: bridge tolls are charged by vehicle length — over 6 m moves you to a higher class.",
  PL: "Poland: over 3.5 t requires e-TOLL on-board registration.",
  NO: "Norway: AutoPASS class 2 applies over 3.5 t; many tunnels have 4.0 m height limits.",
  NL: "Netherlands: several tunnels cap height at 4.0 m and LPG carriage is restricted.",
  US: "US: check bridge clearances on older state routes — many are under 4.1 m (13'6\").",
  CA: "Canada: provincial parks require reservations in summer; propane must be off in tunnels.",
};

function corridorNotes(geo: RouteGeo | null, table: Record<string, string>): string[] {
  if (!geo || !geo.countries.length) return [];
  return geo.countries.map((c) => table[c.code]).filter((v): v is string => Boolean(v));
}

function corridorSummary(geo: RouteGeo | null): string[] {
  if (!geo || !geo.countries.length) {
    return ["Calculate a route to load the live advisories for the countries you actually cross."];
  }
  const names = geo.countries.map((c) => `${c.flag} ${c.country}`).join(" → ");
  const borders = geo.borders.length
    ? `${geo.borders.length} border crossing${geo.borders.length > 1 ? "s" : ""} on the way.`
    : "No border crossings — the whole route stays in one country.";
  return [`Corridor analysed from the routed polyline: ${names}.`, borders];
}

function safetyFor(region: RegionKey, vehicle: VehicleKey, geo: RouteGeo | null = null) {
  if (vehicle === "motorcycle") {
    return {
      title: "Rider Safety & Gear Radar",
      sections: [
        { heading: "🧤 Gear & legal kit", items: [...corridorNotes(geo, RIDER_RULES), ...corridorSummary(geo)] },
        { heading: "🏔️ Mountain pass alerts", items: passesForRoute(region, geo) },
      ],
    };
  }
  if (vehicle === "motorhome") {
    return {
      title: "Camper Clearance & Weight Radar",
      sections: [
        { heading: "📏 Clearance, weight & class rules", items: [...corridorNotes(geo, CAMPER_RULES), ...corridorSummary(geo)] },
        { heading: "🏔️ Pass conditions", items: passesForRoute(region, geo) },
      ],
    };
  }
  return {
    title: "Driver Safety Radar",
    sections: [
      { heading: "🚗 On the road", items: corridorSummary(geo) },
      { heading: "🏔️ Pass conditions", items: passesForRoute(region, geo) },
    ],
  };
}


export type RouteVariantKey = "fastest" | "smart" | "tollfree";

export const ROUTE_VARIANTS: {
  key: RouteVariantKey;
  emoji: string;
  label: string;
  blurb: string;
}[] = [
  {
    key: "fastest",
    emoji: "⚡",
    label: "Fastest Route",
    blurb: "The standard optimal driving route — motorways all the way.",
  },
  {
    key: "smart",
    emoji: "✨",
    label: "Smart Bypass",
    blurb: "Balances toll cost against driving time — skips expensive corridors when the detour is cheap in minutes.",
  },
  {
    key: "tollfree",
    emoji: "🚫",
    label: "100% Toll-Free",
    blurb: "Strictly avoids every toll road, gantry and vignette zone.",
  },
];

const VARIANT_TUNING: Record<RouteVariantKey, { toll: number; distance: number; speed: number }> = {
  fastest: { toll: 1, distance: 1, speed: 98 },
  smart: { toll: 0.55, distance: 1.03, speed: 93 },
  tollfree: { toll: 0, distance: 1.1, speed: 83 },
};

export function estimateTrip(
  region: RegionKey,
  vehicle: VehicleKey,
  fuel: FuelKey,
  avoidTolls: boolean,
  includeFerries: boolean,
  scenic: boolean,
  variant: RouteVariantKey = "fastest",
  extraStops = 0,
  tripType: TripType = "oneway",
  durationDays = 1,
  geo: RouteGeo | null = null,
  prices: EnergyPrices | null = null,
  profile: VehicleProfile | null = null,
): TripEstimate {
  const activeVariant: RouteVariantKey = avoidTolls && variant === "fastest" ? "tollfree" : variant;
  const tuning = VARIANT_TUNING[activeVariant];
  const defaults = REGION_DEFAULTS[region];
  const currency = defaults.currency;
  const imperial = defaults.units === "imperial";
  const isReturn = tripType === "return";
  const legMultiplier = isReturn ? 2 : 1;
  const baseDistance = geo?.distanceKm ?? (region === "eu" ? 1420 : region === "us" ? 1890 : 1640);
  const distanceKm = Math.round(
    baseDistance * (scenic ? 1.08 : 1) * tuning.distance * (1 + 0.035 * extraStops) * legMultiplier,
  );

  const isMoto = vehicle === "motorcycle";
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const mapLines = (lines: TollLine[], factor: number) =>
    lines.map((l) => {
      // Multi-day vignettes stay valid for the whole return trip — only distance
      // tolls and ferry tickets are charged twice.
      const returnFactor = isReturn && !l.isVignette ? 2 : 1;
      // Vignette lines carry their own researched country-specific motorcycle
      // price factor (e.g. Austria 0.4, Hungary 0.65); fall back to a generic
      // discount for lines that don't document one (mainly distance tolls).
      const lineMotoFactor = isMoto ? (l.motoFactor ?? 0.6) : 1;
      return {
        ...l,
        amount: isMoto && l.freeForMotorcycle ? 0 : round2(l.amount * factor * lineMotoFactor * returnFactor),
        badge: isMoto && l.freeForMotorcycle
          ? "Free for motorcycles"
          : (l.badge ?? (returnFactor === 2 ? "Return trip ×2" : undefined)),
      };
    });

  // Real routed corridor → real countries. Only fall back to the sample
  // breakdown when no route geometry could be resolved.
  let segments = geo ? buildRouteSegments(geo).segments : [];
  if (!includeFerries) segments = segments.filter((s) => !s.country.includes("Ferries"));

  segments = segments.map((s) => {
    const tollFactor = s.country.includes("Ferries") ? 1 : tuning.toll;
    const lines = mapLines(s.lines, tollFactor);
    return { ...s, lines, total: round2(lines.reduce((sum, l) => sum + l.amount, 0)) };

  });


  const ferries = round2(
    segments.filter((s) => s.country.includes("Ferries")).reduce((sum, s) => sum + s.total, 0),
  );
  const tolls = round2(
    segments.filter((s) => !s.country.includes("Ferries")).reduce((sum, s) => sum + s.total, 0),
  );

  const consumption =
    vehicle === "motorhome" ? 11.5 : vehicle === "motorcycle" ? 4.8 : 6.6;
  const kwhPer100 =
    fuel === "electric" && profile?.kwhPer100 && profile.kwhPer100 > 0
      ? profile.kwhPer100
      : vehicle === "motorhome" ? 28 : vehicle === "motorcycle" ? 12 : 18;
  // Live prices from the energy feed when available; the estimator never
  // invents a number it cannot source.
  const perLitreLive = prices
    ? prices.unit === "gallon"
      ? (fuel === "diesel" ? prices.diesel : prices.petrol) / 3.785
      : fuel === "diesel"
        ? prices.diesel
        : prices.petrol
    : null;
  const pricePerL = perLitreLive ?? (fuel === "diesel" ? 1.72 : 1.89);
  const pricePerKwh = prices?.kwh ?? 0.44;

  const energyCost =
    fuel === "electric"
      ? round2((distanceKm / 100) * kwhPer100 * pricePerKwh)
      : round2((distanceKm / 100) * consumption * pricePerL);

  const litres = (distanceKm / 100) * consumption;
  const energyAmount =
    fuel === "electric"
      ? `${Math.round((distanceKm / 100) * kwhPer100)} kWh`
      : imperial
        ? `${Math.round(litres * 0.264172)} gal`
        : `${Math.round(litres)} L`;

  const distanceLabel = imperial
    ? `${Math.round(distanceKm * 0.621371).toLocaleString("en-US")} mi`
    : `${distanceKm.toLocaleString("en-GB")} km`;

  const hours = geo
    ? ((geo.durationMin / 60) * legMultiplier * (scenic ? 1.18 : 1)) /
      (activeVariant === "tollfree" ? 0.86 : activeVariant === "smart" ? 0.95 : 1)
    : distanceKm / (scenic ? tuning.speed * 0.82 : tuning.speed);
  const driveTime = `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`;

  const corridor = geo
    ? {
        countries: geo.countries.map((c) => ({
          code: c.code,
          flag: c.flag,
          country: c.country,
          distanceKm: Math.round(c.distanceKm * legMultiplier),
          distanceLabel: imperial
            ? `${Math.round(c.distanceKm * 0.621371).toLocaleString("en-US")} mi`
            : `${Math.round(c.distanceKm).toLocaleString("en-GB")} km`,
          entryPlace: c.entryPlace,
          exitPlace: c.exitPlace,
        })),
        borders: borderLabels(geo.borders, imperial),
        from: geo.from.name,
        to: geo.to.name,
        coords: geo.coords,
        points: [
          { name: geo.from.name, detail: "Start", lat: geo.from.lat, lon: geo.from.lng },
          ...geo.samples.map((sp) => ({
            name: sp.place || sp.country,
            detail: `${sp.country}${sp.state ? ` · ${sp.state}` : ""} · ${Math.round(sp.atKm)} km`,
            lat: sp.lat,
            lon: sp.lng,
          })),
          { name: geo.to.name, detail: "Destination", lat: geo.to.lat, lon: geo.to.lng },
        ],
      }
    : null;

  return {
    currency,
    units: defaults.units,
    variant: activeVariant,
    distanceLabel,
    budget: round2(tolls + ferries + energyCost + distanceKm * 0.04),
    distanceKm,
    driveHours: hours,
    driveTime,
    tolls,
    ferries,
    energyCost,
    energyLabel: fuel === "electric" ? "EV Charging" : "Fuel",
    energyAmount,
    segments,
    corridor,
    safety: safetyFor(region, vehicle, geo),
    pricePerKwh,
    optimizer: buildOptimizer(region, vehicle, fuel, distanceKm, imperial, geo, profile, pricePerKwh),
    vignette:
      activeVariant === "tollfree"
        ? null
        : optimizeVignettes(
            region,
            vehicle,
            tripType,
            durationDays,
            geo ? geo.countries.map((c) => c.code) : undefined,
          ),
    tripType,
    durationDays,
    discountNote: isMoto
      ? "Motorcycle rates applied: ~40% indicative discount on distance tolls, vignettes and ferries — and 0 in Norwegian city rings."
      : undefined,
  };
}

export function estimateAllVariants(
  region: RegionKey,
  vehicle: VehicleKey,
  fuel: FuelKey,
  avoidTolls: boolean,
  includeFerries: boolean,
  scenic: boolean,
  extraStops = 0,
  tripType: TripType = "oneway",
  durationDays = 1,
  geo: RouteGeo | null = null,
  prices: EnergyPrices | null = null,
  profile: VehicleProfile | null = null,
): Record<RouteVariantKey, TripEstimate> {
  const args = [extraStops, tripType, durationDays, geo, prices, profile] as const;
  return {
    fastest: estimateTrip(region, vehicle, fuel, false, includeFerries, scenic, "fastest", ...args),
    smart: estimateTrip(region, vehicle, fuel, false, includeFerries, scenic, "smart", ...args),
    tollfree: estimateTrip(region, vehicle, fuel, avoidTolls, includeFerries, scenic, "tollfree", ...args),
  };
}


export function variantComparison(
  base: TripEstimate,
  candidate: TripEstimate,
): { saved: number; hoursAdded: number; savedLabel: string; timeLabel: string } {
  const saved = Math.round((base.tolls + base.ferries - candidate.tolls - candidate.ferries) * 100) / 100;
  const hoursAdded = candidate.driveHours - base.driveHours;
  const h = Math.floor(Math.abs(hoursAdded));
  const m = Math.round((Math.abs(hoursAdded) % 1) * 60);
  const sign = hoursAdded >= 0 ? "+" : "−";
  return {
    saved,
    hoursAdded,
    savedLabel: `${saved >= 0 ? "" : "−"}${money(base.currency, Math.abs(saved))}`,
    timeLabel: `${sign}${h}h ${m}m`,
  };
}



/** What the same corridor would cost on petrol/diesel vs. on electricity. */
export function evComparison(
  trip: TripEstimate,
  vehicle: VehicleKey,
  fuel: FuelKey,
  prices: EnergyPrices | null = null,
  profile: VehicleProfile | null = null,
): {
  fuelCost: number;
  evCost: number;
  saved: number;
  kwh: number;
  litres: number;
  isElectric: boolean;
} {
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const consumption = vehicle === "motorhome" ? 11.5 : vehicle === "motorcycle" ? 4.8 : 6.6;
  const kwhPer100 =
    profile?.kwhPer100 && profile.kwhPer100 > 0
      ? profile.kwhPer100
      : vehicle === "motorhome" ? 28 : vehicle === "motorcycle" ? 12 : 18;
  const perLitreLive = prices
    ? prices.unit === "gallon"
      ? (fuel === "diesel" ? prices.diesel : prices.petrol) / 3.785
      : fuel === "diesel"
        ? prices.diesel
        : prices.petrol
    : null;
  const pricePerL = perLitreLive ?? (fuel === "diesel" ? 1.72 : 1.89);
  const pricePerKwh = prices?.kwh ?? 0.44;
  const fuelCost = round2((trip.distanceKm / 100) * consumption * pricePerL);
  const evCost = round2((trip.distanceKm / 100) * kwhPer100 * pricePerKwh);
  return {
    fuelCost,
    evCost,
    saved: round2(fuelCost - evCost),
    kwh: Math.round((trip.distanceKm / 100) * kwhPer100),
    litres: Math.round((trip.distanceKm / 100) * consumption),
    isElectric: fuel === "electric",
  };
}

export function money(currency: string, value: number) {
  return `${currency}${value.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export type QuickRoute = {
  key: string;
  emoji: string;
  label: string;
  origin: string;
  destination: string;
  via: string;
  regions: RegionKey[];
  /** Optional EV savings highlight rendered as a badge on the pill. */
  evBadge?: string;
};

export const QUICK_ROUTES: QuickRoute[] = [
  {
    key: "munich-garda",
    emoji: "🏔️",
    label: "Munich → Lake Garda",
    origin: "Munich, Germany",
    destination: "Lake Garda, Italy",
    via: "DE → IT via AT · Brenner Pass",
    regions: ["eu"],
  },
  {
    key: "oslo-bergen",
    emoji: "🇳🇴",
    label: "Oslo → Bergen",
    origin: "Oslo, Norway",
    destination: "Bergen, Norway",
    via: "E16 / RV7 · fjord crossings",
    regions: ["eu"],
  },
  {
    key: "paris-nice",
    emoji: "☀️",
    label: "Paris → Nice",
    origin: "Paris, France",
    destination: "Nice, France",
    via: "A6 / A7 · Autoroute du Soleil",
    regions: ["eu"],
  },
  {
    key: "orlando-keywest",
    emoji: "🌴",
    label: "Orlando, FL → Key West, FL",
    origin: "Orlando, FL",
    destination: "Key West, FL",
    via: "FL Turnpike → Overseas Hwy (US-1)",
    regions: ["us"],
  },
  {
    key: "denver-moab",
    emoji: "🏜️",
    label: "Denver, CO → Moab, UT",
    origin: "Denver, CO",
    destination: "Moab, UT",
    via: "I-70 W · Rockies to red rock",
    regions: ["us"],
  },
  {
    key: "lax-lasvegas",
    emoji: "🎰",
    label: "Los Angeles, CA → Las Vegas, NV",
    origin: "Los Angeles, CA",
    destination: "Las Vegas, NV",
    via: "I-15 N · Mojave Desert",
    regions: ["us"],
  },
  {
    key: "calgary-banff",
    emoji: "🏔️",
    label: "Calgary, AB → Banff & Lake Louise",
    origin: "Calgary, AB",
    destination: "Banff, AB",
    via: "Trans-Canada Hwy · no tolls",
    regions: ["ca"],
  },
  {
    key: "toronto-montreal",
    emoji: "🍁",
    label: "Toronto, ON → Montréal, QC",
    origin: "Toronto, ON",
    destination: "Montréal, QC",
    via: "Hwy 401 / A-20 · 407 ETR bypass",
    regions: ["ca"],
  },
  {
    key: "vancouver-whistler",
    emoji: "🏞️",
    label: "Vancouver, BC → Whistler, BC",
    origin: "Vancouver, BC",
    destination: "Whistler, BC",
    via: "Sea to Sky Hwy (BC-99) · no tolls",
    regions: ["ca"],
  },
];

export type TransponderKey = "autopass" | "telepass" | "sunpass";

export const TRANSPONDERS: {
  key: TransponderKey;
  label: string;
  scope: string;
  regions: RegionKey[];
}[] = [
  {
    key: "autopass",
    label: "I have AutoPASS / EPASS24",
    scope: "NO / SE / DK",
    regions: ["eu"],
  },
  {
    key: "telepass",
    label: "I have Telepass / Bip&Go / Fulli",
    scope: "FR / IT / ES / PT",
    regions: ["eu"],
  },
  {
    key: "sunpass",
    label: "I have SunPass / E-ZPass",
    scope: "US",
    regions: ["us", "ca"],
  },
];

/* ---------------------------------------------------------------------------
 * Ferry & marine corridor detection
 * ------------------------------------------------------------------------- */

export type FerryCrossing = {
  id: string;
  corridor: string;
  route: string;
  operators: string[];
  duration: string;
  frequency: string;
  price: string;
  motoPrice?: string;
  note: string;
  badge?: string;
  booking: { label: string; url: string };
  /** Lowercase keywords that trigger this crossing */
  match: string[];
  regions: RegionKey[];
};

export const FERRY_CROSSINGS: FerryCrossing[] = [
  {
    id: "no-fjord",
    corridor: "🇳🇴 Norway · Fjord ferries",
    route: "Lauvvik–Oanes · Mortavika–Arsvågen · Halhjem–Sandvikvåg",
    operators: ["Norled", "Fjord1", "Torghatten"],
    duration: "10–45 min per crossing",
    frequency: "Every 20–40 min, most run 24/7",
    price: "NOK 120–290 per car",
    motoPrice: "NOK 55–120 per motorcycle",
    note: "Register an AutoPASS ferjekort for an automatic ~50% discount — no cash, no queue at the booth.",
    badge: "AutoPASS ferjekort −50%",
    booking: { label: "autopassferje.no", url: "https://www.autopassferje.no/" },
    match: ["norway", "norge", "oslo", "bergen", "stavanger", "trondheim", "ålesund", "alesund", "lofoten", "geiranger", "trollstigen"],
    regions: ["eu"],
  },
  {
    id: "scandi-baltic",
    corridor: "🌊 Scandinavia & Baltic",
    route: "Oslo–Kiel · Hirtshals–Kristiansand · Puttgarden–Rødby · Helsinki–Tallinn",
    operators: ["Color Line", "Fjord Line", "Scandlines", "DFDS", "Stena Line", "Tallink Silja", "Viking Line"],
    duration: "45 min – 20 h depending on crossing",
    frequency: "Scandlines every 30 min; overnight lines 1–2 sailings a day",
    price: "€45–210 car + driver",
    motoPrice: "€28–120 motorcycle + rider",
    note: "Book overnight cabins early in July and August — the Oslo–Kiel and Tallinn routes sell out weeks ahead.",
    badge: "Cabins book out early",
    booking: { label: "Color Line", url: "https://www.colorline.com/" },
    match: ["sweden", "sverige", "denmark", "danmark", "copenhagen", "københavn", "kiel", "hirtshals", "gothenburg", "göteborg", "stockholm", "helsinki", "tallinn", "estonia", "finland", "baltic", "malmö", "malmo"],
    regions: ["eu"],
  },
  {
    id: "channel",
    corridor: "🇬🇧 English Channel",
    route: "Dover–Calais · Dover–Dunkirk · Folkestone–Coquelles (LeShuttle)",
    operators: ["DFDS", "P&O Ferries", "Irish Ferries", "LeShuttle"],
    duration: "35 min (LeShuttle) · 90–120 min (ferry)",
    frequency: "Up to 4 departures an hour at peak",
    price: "£70–190 car + passengers",
    motoPrice: "£45–95 motorcycle + rider",
    note: "LeShuttle keeps you in your vehicle — the fastest option with a roof box or a loaded bike.",
    badge: "Flexi tickets recommended",
    booking: { label: "LeShuttle", url: "https://www.leshuttle.com/" },
    match: ["london", "united kingdom", "england", "uk", "dover", "calais", "paris", "folkestone", "brighton", "kent"],
    regions: ["eu"],
  },
  {
    id: "irish-sea",
    corridor: "☘️ Irish Sea",
    route: "Holyhead–Dublin · Cairnryan–Belfast · Fishguard–Rosslare",
    operators: ["Irish Ferries", "Stena Line", "P&O Ferries"],
    duration: "2 h (fast craft) – 3 h 30 min",
    frequency: "4–8 sailings a day per route",
    price: "€95–230 car + driver",
    motoPrice: "€60–130 motorcycle + rider",
    note: "Wild Atlantic Way traffic peaks at weekends — a midweek morning sailing is calmer and cheaper.",
    booking: { label: "Irish Ferries", url: "https://www.irishferries.com/" },
    match: ["ireland", "dublin", "belfast", "cork", "galway", "holyhead", "wales", "rosslare", "northern ireland"],
    regions: ["eu"],
  },
  {
    id: "med-adriatic",
    corridor: "☀️ Mediterranean & Adriatic",
    route: "Split–Supetar · Ancona–Split · Genoa–Barcelona · Piraeus–Crete · Bari–Patras",
    operators: ["Jadrolinija", "Moby", "GNV", "Minoan Lines", "Superfast Ferries", "Grimaldi Lines"],
    duration: "50 min (island hops) – 20 h (overnight)",
    frequency: "Island hops hourly; long crossings daily",
    price: "€55–260 car + driver",
    motoPrice: "€30–140 motorcycle + rider",
    note: "Motorcycles usually board first and pay roughly 40% less — arrive 45 min before departure.",
    badge: "Bikes board first",
    booking: { label: "Jadrolinija", url: "https://www.jadrolinija.hr/en" },
    match: ["croatia", "split", "dubrovnik", "italy", "italia", "rome", "naples", "genoa", "ancona", "bari", "greece", "athens", "patras", "crete", "sardinia", "sicily", "corsica", "barcelona", "spain", "lake garda", "amalfi"],
    regions: ["eu"],
  },
  {
    id: "us-marine",
    corridor: "🇺🇸 US marine highways",
    route: "Anacortes–Friday Harbor · Bellingham–Alaska · Cape May–Lewes",
    operators: ["Washington State Ferries", "Alaska Marine Highway", "Cape May–Lewes Ferry"],
    duration: "60 min – 38 h (Alaska)",
    frequency: "San Juans hourly; Alaska weekly",
    price: "$62–180 vehicle + driver",
    motoPrice: "$28–70 motorcycle + rider",
    note: "Vehicle reservations open two months ahead on Washington State Ferries and are essential in summer.",
    badge: "Reserve ahead",
    booking: { label: "WA State Ferries", url: "https://wsdot.com/travel/washington-state-ferries" },
    match: ["seattle", "washington", "anacortes", "san juan", "alaska", "bellingham", "cape may"],
    regions: ["us"],
  },
  {
    id: "ca-marine",
    corridor: "🇨🇦 Canadian coastal ferries",
    route: "Tsawwassen–Swartz Bay · Horseshoe Bay–Nanaimo · North Sydney–Port aux Basques",
    operators: ["BC Ferries", "Marine Atlantic", "Société des traversiers du Québec"],
    duration: "1 h 35 min – 7 h (Newfoundland)",
    frequency: "Every 1–2 h on the Vancouver Island runs",
    price: "C$96–150 vehicle + 2 adults",
    motoPrice: "C$45–70 motorcycle + rider",
    note: "Book a Saver fare on BC Ferries — cheapest sailings are before 09:00 and after 19:00.",
    badge: "Saver fares available",
    booking: { label: "BC Ferries", url: "https://www.bcferries.com/" },
    match: ["vancouver", "victoria", "tofino", "british columbia", "nanaimo", "newfoundland", "halifax", "nova scotia", "québec", "quebec", "gaspésie"],
    regions: ["ca"],
  },
];

const DEFAULT_FERRIES: Record<RegionKey, string[]> = {
  eu: ["no-fjord", "scandi-baltic", "channel"],
  us: ["us-marine"],
  ca: ["ca-marine"],
};

export function detectFerryCrossings(
  region: RegionKey,
  origin: string,
  destination: string,
  /** Countries/places on the real routed corridor — disables the generic fallback. */
  corridorPlaces?: string[],
): FerryCrossing[] {
  const text = `${origin} ${destination} ${(corridorPlaces ?? []).join(" ")}`.toLowerCase();
  const matched = FERRY_CROSSINGS.filter((f) => f.match.some((m) => text.includes(m)));
  if (matched.length > 0) return matched;
  // Only guess when we have no verified corridor to reason about.
  if (corridorPlaces) return [];
  const fallback = DEFAULT_FERRIES[region];
  return FERRY_CROSSINGS.filter((f) => fallback.includes(f.id));
}

/* ------------------------------------------------------------------ *
 * Environmental / emission badge radar
 * ------------------------------------------------------------------ */

export interface EmissionBadge {
  id: string;
  flag: string;
  title: string;
  body: string;
  portalLabel: string;
  portalUrl: string;
  match: string[];
  regions: RegionKey[];
}

export const EMISSION_BADGES: EmissionBadge[] = [
  {
    id: "critair",
    flag: "🇫🇷",
    title: "Crit'Air badge required in French LEZs",
    body:
      "France's Zones à Faibles Émissions (Paris, Lyon, Grenoble, Strasbourg, Marseille, Rouen and more) require a Crit'Air sticker on the windscreen — motorcycles included. Order 3–4 weeks ahead; postal delivery abroad takes time.",
    portalLabel: "certificat-air.gouv.fr",
    portalUrl: "https://www.certificat-air.gouv.fr/",
    match: ["france", "french", "paris", "lyon", "grenoble", "marseille", "nice", "côte", "cote d'azur", "strasbourg", "calais", "dunkirk", "bordeaux", "toulouse", "montpellier", "rouen"],
    regions: ["eu"],
  },
  {
    id: "umweltplakette",
    flag: "🇩🇪",
    title: "Umweltplakette required in German green zones",
    body:
      "Umweltzonen in Berlin, Munich, Stuttgart, Cologne, Frankfurt, Hamburg and ~50 other cities need a green (grüne) Umweltplakette. Cars and motorhomes are checked; fines are €100 plus towing risk. Motorcycles are exempt.",
    portalLabel: "umweltbundesamt.de",
    portalUrl: "https://www.umweltbundesamt.de/en/topics/air/air-quality-control-in-europe/low-emission-zones",
    match: ["germany", "german", "berlin", "munich", "münchen", "stuttgart", "cologne", "köln", "frankfurt", "hamburg", "düsseldorf", "dusseldorf", "leipzig", "nuremberg", "brenner", "garda", "split", "barcelona"],
    regions: ["eu"],
  },
  {
    id: "belgium-lez",
    flag: "🇧🇪",
    title: "Belgian LEZ pre-registration (Brussels, Antwerp, Ghent)",
    body:
      "No sticker — but foreign plates must register online before entering. Unregistered entry is an automatic fine.",
    portalLabel: "lez.brussels",
    portalUrl: "https://lez.brussels/mytax/en",
    match: ["belgium", "brussels", "antwerp", "ghent", "bruges", "amsterdam", "netherlands"],
    regions: ["eu"],
  },
  {
    id: "uk-ulez",
    flag: "🇬🇧",
    title: "London ULEZ & Congestion Charge",
    body:
      "Non-compliant vehicles pay £12.50/day ULEZ plus £15 Congestion Charge inside central London. Pay online within three days of travel.",
    portalLabel: "tfl.gov.uk",
    portalUrl: "https://tfl.gov.uk/modes/driving/ultra-low-emission-zone",
    match: ["london", "uk", "england", "dover", "britain"],
    regions: ["eu"],
  },
  {
    id: "carb",
    flag: "🇺🇸",
    title: "California clean-air & idling rules",
    body:
      "California enforces anti-idling and emissions rules on RVs and diesel vehicles; some metro areas run seasonal air-quality restrictions.",
    portalLabel: "ww2.arb.ca.gov",
    portalUrl: "https://ww2.arb.ca.gov/",
    match: ["california", "los angeles", "san francisco", "san diego", "sacramento"],
    regions: ["us"],
  },
];

export function detectEmissionBadges(
  region: RegionKey,
  origin: string,
  destination: string,
  corridorPlaces?: string[],
): EmissionBadge[] {
  const text = `${origin} ${destination} ${(corridorPlaces ?? []).join(" ")}`.toLowerCase();
  return EMISSION_BADGES.filter(
    (b) =>
      (corridorPlaces ? true : b.regions.includes(region)) &&
      b.match.some((m) => text.includes(m)),
  );
}

/* ------------------------------------------------------------------ *
 * Scenic highlights & RV points of interest
 * ------------------------------------------------------------------ */

export interface ScenicHighlight {
  id: string;
  lat: number;
  lng: number;
  emoji: string;
  name: string;
  where: string;
  note: string;
  season: string;
}

export interface RvPoi {
  id: string;
  lat: number;
  lng: number;
  emoji: string;
  name: string;
  where: string;
  services: string[];
  note: string;
}

export const SCENIC_HIGHLIGHTS: Record<RegionKey, ScenicHighlight[]> = {
  eu: [
    { id: "trollstigen", lat: 62.4558, lng: 7.6709, emoji: "🏔️", name: "Trollstigen", where: "Rauma, Norway", note: "Eleven hairpins climbing a sheer wall — viewing platform over the valley.", season: "Late May – October" },
    { id: "atlantic-road", lat: 63.0139, lng: 7.352, emoji: "🌊", name: "Atlantic Road", where: "Møre og Romsdal, Norway", note: "Eight bridges hopping island to island straight over the open sea.", season: "Year-round" },
    { id: "grossglockner", lat: 47.076, lng: 12.838, emoji: "⛰️", name: "Grossglockner High Alpine Road", where: "Austria", note: "48 km of alpine theatre topping out at 2,504 m.", season: "May – early November" },
    { id: "stelvio", lat: 46.5285, lng: 10.4543, emoji: "🏍️", name: "Stelvio Pass", where: "Italy", note: "48 numbered hairpins — the classic rider pilgrimage.", season: "June – October" },
    { id: "furka", lat: 46.5723, lng: 8.4152, emoji: "✨", name: "Furka & Grimsel Passes", where: "Switzerland", note: "Glacier views, smooth tarmac and a lakeside descent.", season: "June – October" },
    { id: "verdon", lat: 43.75, lng: 6.33, emoji: "🌅", name: "Gorges du Verdon", where: "Provence, France", note: "Turquoise canyon rim road on the way to the Côte d'Azur.", season: "Year-round" },
  ],
  us: [
    { id: "blue-ridge", lat: 36.5, lng: -81.0, emoji: "🌄", name: "Blue Ridge Parkway", where: "Virginia – North Carolina", note: "469 miles of ridgeline overlooks, no trucks, no tolls.", season: "Year-round (peak: October)" },
    { id: "pch", lat: 36.2704, lng: -121.8081, emoji: "🌊", name: "Pacific Coast Highway (SR-1)", where: "California", note: "Big Sur cliffs, Bixby Bridge and endless Pacific vistas.", season: "Year-round" },
    { id: "dragon", lat: 35.51, lng: -83.93, emoji: "🏍️", name: "Tail of the Dragon (US-129)", where: "Tennessee", note: "318 curves in 11 miles — ride it early to beat traffic.", season: "April – November" },
    { id: "beartooth", lat: 45.0, lng: -109.47, emoji: "⛰️", name: "Beartooth Highway", where: "Montana – Wyoming", note: "Switchbacks to 10,947 ft on the doorstep of Yellowstone.", season: "Late May – mid October" },
    { id: "zion", lat: 37.2, lng: -112.98, emoji: "🏜️", name: "Zion – Bryce scenic corridor", where: "Utah", note: "Red-rock tunnels and canyon overlooks between two parks.", season: "Year-round" },
  ],
  ca: [
    { id: "icefields", lat: 51.67, lng: -116.94, emoji: "🏔️", name: "Icefields Parkway", where: "Alberta", note: "232 km between Lake Louise and Jasper past glaciers and turquoise lakes.", season: "Year-round (winter tyres Oct–Apr)" },
    { id: "cabot", lat: 46.75, lng: -60.75, emoji: "🌊", name: "Cabot Trail", where: "Cape Breton, Nova Scotia", note: "Highland cliffs, whale lookouts and ocean switchbacks.", season: "May – October" },
    { id: "sea-to-sky", lat: 49.7, lng: -123.15, emoji: "✨", name: "Sea-to-Sky Highway", where: "British Columbia", note: "Howe Sound fjord views from Vancouver up to Whistler.", season: "Year-round" },
    { id: "charlevoix", lat: 47.44, lng: -70.5, emoji: "🍁", name: "Route du Fleuve, Charlevoix", where: "Québec", note: "St. Lawrence riverside villages and beluga-watching stops.", season: "May – October" },
  ],
};

export const RV_POIS: Record<RegionKey, RvPoi[]> = {
  eu: [
    { id: "eu-1", lat: 62.101, lng: 7.206, emoji: "🚐", name: "Bobil-parkering Geiranger", where: "Geiranger, Norway", services: ["Grey water", "Fresh water", "EV hookup"], note: "Fjord-side pitches, 5 min walk to the ferry quay." },
    { id: "eu-2", lat: 47.323, lng: 12.796, emoji: "🚐", name: "Stellplatz Zell am See", where: "Salzburg, Austria", services: ["Chemical WC", "Electricity", "Bakery service"], note: "Great overnight before Grossglockner — book in July/August." },
    { id: "eu-3", lat: 45.899, lng: 6.129, emoji: "🚐", name: "Aire de Camping-Car Annecy", where: "Haute-Savoie, France", services: ["Fresh water", "Grey water", "24h access"], note: "France's aire network is the cheapest overnight option en route south." },
    { id: "eu-4", lat: 45.44, lng: 10.69, emoji: "🚐", name: "Camping Bella Italia, Peschiera", where: "Lake Garda, Italy", services: ["Full hookup", "Laundry", "Pool"], note: "Large pitches; height/width friendly access road." },
  ],
  us: [
    { id: "us-1", lat: 39.5, lng: -98.35, emoji: "🚐", name: "KOA Journey — Interstate corridor", where: "Nationwide", note: "Pull-through sites sized for 40 ft rigs and towed cars.", services: ["Full hookup", "Dump station", "Wi-Fi"] },
    { id: "us-2", lat: 44.662, lng: -111.1, emoji: "🚐", name: "Yellowstone Grizzly RV Park", where: "West Yellowstone, MT", note: "Book months ahead for summer; ideal Beartooth basecamp.", services: ["50 amp", "Dump station", "Laundry"] },
    { id: "us-3", lat: 35.135, lng: -120.635, emoji: "🚐", name: "Pismo Coast Village RV Resort", where: "California", note: "Beachfront stop midway along the Pacific Coast Highway.", services: ["Full hookup", "Propane", "Dump station"] },
  ],
  ca: [
    { id: "ca-1", lat: 50.1163, lng: -122.9574, emoji: "🚐", name: "Whistler RV Park & Campground", where: "British Columbia", note: "Last full-service stop on the Sea-to-Sky corridor.", services: ["Full hookup", "Showers", "Dump station"] },
    { id: "ca-2", lat: 52.85, lng: -118.08, emoji: "🚐", name: "Whistlers Campground", where: "Jasper, Alberta", note: "Huge serviced loop right at the north end of the Icefields Parkway.", services: ["Electric", "Dump station", "Fire pits"] },
    { id: "ca-3", lat: 46.79, lng: -60.68, emoji: "🚐", name: "Broad Cove Campground", where: "Cape Breton, Nova Scotia", note: "Oceanfront pitches on the Cabot Trail.", services: ["Water", "Dump station", "Showers"] },
  ],
};

/* ------------------------------------------------------------------ *
 * Scandinavian toll infrastructure — AutoPASS rings, Norwegian
 * highway segments and the Danish / Øresund bridge crossings.
 * ------------------------------------------------------------------ */

export type NorwayRing = {
  id: string;
  city: string;
  emoji: string;
  /** Indicative NOK per passing */
  petrol: number;
  ev: number;
  motorcycle: number;
  note: string;
};

export const NORWAY_CITY_RINGS: NorwayRing[] = [
  {
    id: "oslo",
    city: "Oslo (Osloring + Indre ring)",
    emoji: "🏙️",
    petrol: 44,
    ev: 15,
    motorcycle: 0,
    note: "Rush-hour rates 06:30–09:00 and 15:00–17:00 on weekdays. Hourly rule: one charge per 60 min.",
  },
  {
    id: "bergen",
    city: "Bergen (Bomringen)",
    emoji: "🌧️",
    petrol: 27,
    ev: 12,
    motorcycle: 0,
    note: "Environmental differentiation — diesel Euro 5 and older pay a surcharge.",
  },
  {
    id: "trondheim",
    city: "Trondheim (Miljøpakken)",
    emoji: "⚓",
    petrol: 22,
    ev: 11,
    motorcycle: 0,
    note: "Charged in both directions, monthly cap of 110 passings.",
  },
  {
    id: "stavanger",
    city: "Stavanger / Nord-Jæren (Bymiljøpakken)",
    emoji: "🛢️",
    petrol: 22,
    ev: 11,
    motorcycle: 0,
    note: "Rush-hour rate applies weekdays; Ryfast and Hundvågtunnelen are billed separately.",
  },
];

export type NorwayHighwaySegment = {
  id: string;
  road: string;
  stretch: string;
  /** Indicative NOK for a car with an AutoPASS tag */
  car: number;
  motorcycle: number;
  note: string;
};

export const NORWAY_HIGHWAY_SEGMENTS: NorwayHighwaySegment[] = [
  {
    id: "e18",
    road: "E18",
    stretch: "Oslo → Kristiansand (Vestfold & Agder)",
    car: 285,
    motorcycle: 0,
    note: "Several AutoPASS gantries along the new motorway sections — no barriers, you just drive through.",
  },
  {
    id: "e6-sor",
    road: "E6 Sør",
    stretch: "Oslo → Lillehammer / Gudbrandsdalen",
    car: 210,
    motorcycle: 0,
    note: "Continuous gantry stretches around Kolomoen–Moelv and Ringebu.",
  },
  {
    id: "e6-nord",
    road: "E6 Nord",
    stretch: "Trondheim → Steinkjer / Helgeland",
    car: 245,
    motorcycle: 0,
    note: "Helgeland Nord and Sør packages are billed per gantry passed.",
  },
  {
    id: "e39",
    road: "E39",
    stretch: "Stavanger → Bergen → Ålesund (Western Norway)",
    car: 330,
    motorcycle: 0,
    note: "Includes Ryfast, Rogfast-area projects and the fjord ferry links on the coastal corridor.",
  },
];

export type NorwayPaymentOption = {
  id: string;
  title: string;
  body: string;
  badge: string;
  portalLabel: string;
  portalUrl: string;
};

export const NORWAY_PAYMENT_OPTIONS: NorwayPaymentOption[] = [
  {
    id: "autopass",
    title: "AutoPASS tag (Norwegian & EU issuers)",
    body:
      "A tag gives you the standard 20% discount on most gantries and the AutoPASS ferjekort discount on fjord ferries. Order it before you cross the border and mount it behind the windscreen.",
    badge: "20% discount",
    portalLabel: "autopass.no",
    portalUrl: "https://www.autopass.no/en/",
  },
  {
    id: "epass24",
    title: "EPASS24 — foreign-registered vehicles",
    body:
      "No tag? Every passing is photographed and invoiced to the registered keeper through EPASS24. You can also pre-register a card there to avoid paper invoices and admin fees.",
    badge: "No tag needed",
    portalLabel: "epass24.com",
    portalUrl: "https://www.epass24.com/",
  },
  {
    id: "ferjekort",
    title: "AutoPASS ferjekort (fjord ferries)",
    body:
      "Prepay a ferjekort to take up to 50% off Norwegian fjord ferry crossings — worth it from about four crossings upward on a west-coast tour.",
    badge: "Up to 50% off ferries",
    portalLabel: "autopassferje.no",
    portalUrl: "https://www.autopassferje.no/",
  },
];

export type ScandiBridge = {
  id: string;
  emoji: string;
  name: string;
  crossing: string;
  /** Indicative single crossing, cash / plate price */
  carPrice: string;
  motoPrice: string;
  transponder: string;
  note: string;
  portalLabel: string;
  portalUrl: string;
  match: string[];
  lat: number;
  lng: number;
};

export const SCANDI_BRIDGES: ScandiBridge[] = [
  {
    id: "storebaelt",
    emoji: "🌉",
    name: "Storebælt Bridge",
    crossing: "🇩🇰 Zealand ↔ Funen (E20, Korsør–Nyborg)",
    carPrice: "DKK 265 car (≤ 6 m)",
    motoPrice: "DKK 140 motorcycle",
    transponder: "BroBizz saves up to 15% — Storebælt Pendler/Erhverv plans go further",
    note: "18 km of bridge and tunnel. Tolled in both directions; the BroBizz is read automatically at speed.",
    portalLabel: "storebaelt.dk",
    portalUrl: "https://www.storebaelt.dk/english",
    match: ["denmark", "danmark", "copenhagen", "københavn", "kobenhavn", "odense", "aarhus", "århus", "jutland", "jylland", "esbjerg", "aalborg", "hamburg", "sweden", "sverige", "malmö", "malmo", "stockholm", "göteborg", "gothenburg", "oslo", "norway", "norge"],
    lat: 55.335,
    lng: 10.977,
  },
  {
    id: "oresund",
    emoji: "🌉",
    name: "Øresund Bridge",
    crossing: "🇩🇰 Copenhagen ↔ 🇸🇪 Malmö (E20)",
    carPrice: "DKK 510 / SEK 700 car (≤ 6 m)",
    motoPrice: "DKK 265 / SEK 365 motorcycle",
    transponder: "ØresundGO or BroBizz cuts the car crossing to roughly DKK 240–290",
    note: "16 km bridge + Drogden tunnel. Register ØresundGO online before you travel — the discount applies instantly.",
    portalLabel: "oresundsbron.com",
    portalUrl: "https://www.oresundsbron.com/en/start",
    match: ["copenhagen", "københavn", "kobenhavn", "malmö", "malmo", "sweden", "sverige", "stockholm", "lund", "helsingborg", "göteborg", "gothenburg", "denmark", "danmark", "oslo", "norway", "norge"],
    lat: 55.573,
    lng: 12.833,
  },
];

const NORWAY_MATCH = [
  "norway", "norge", "oslo", "bergen", "trondheim", "stavanger", "kristiansand",
  "tromsø", "tromso", "ålesund", "alesund", "lofoten", "geiranger", "trollstigen",
  "bodø", "bodo", "narvik", "svinesund", "hardanger", "sognefjell", "flåm", "flam",
];

/** True when the trip corridor touches Norway. */
export function routeTouchesNorway(origin: string, destination: string): boolean {
  const text = `${origin} ${destination}`.toLowerCase();
  return NORWAY_MATCH.some((m) => text.includes(m));
}

/** Bridge crossings the routed polyline physically uses (≈15 km corridor). */
export function detectScandiBridges(
  coords: [number, number][] | undefined | null,
): ScandiBridge[] {
  return filterByCorridor(SCANDI_BRIDGES, coords, 15);
}
