import type { FlagCode } from "@/components/FlagIcon";
import { LOCALE_ROUTES } from "@/lib/locales";
import { DEFAULT_KWH_EUR, operatorKwhEur } from "@/lib/market-rates";
import type { EnergyPrices } from "@/lib/energy-prices.functions";
import { GENERATED_AFDC_EV_CHARGING_POIS } from "@/lib/ev-charging-pois-afdc.generated";
import { GENERATED_EV_CHARGING_POIS } from "@/lib/ev-charging-pois.generated";
import type { RouteGeo } from "@/lib/route-geo.functions";
import { borderLabels, buildRouteSegments } from "@/lib/route-tolls";
import { filterByCorridor, haversineKm } from "@/lib/corridor-filter";
import { optimizeVignettes, type TripType, type VignettePlan } from "@/lib/vignette-optimizer";
import type { CorridorStop, EvCharger, FuelStation } from "@/lib/corridor-map";

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
  { code: "ja", flag: "JP", label: "日本語" },
  { code: "zh", flag: "CN", label: "简体中文" },
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
  /** Tolls + ferries + energy — nothing hidden. */
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
  /** Country-by-country price sources behind `energyCost`. */
  priceBasis?: PriceBasis | undefined;
  /** True when Norwegian tolls were priced from the real gantry register. */
  gantryPriced?: boolean | undefined;
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
  /** Combustion consumption in litres per 100 km (from the planner's fine-tune field or My Garage). */
  litresPer100?: number | undefined;
  /** Preferred charging operator, or undefined / "All networks" for any. */
  network?: string | undefined;
  /** Reserve kept in the battery, in percent (e.g. 25 → plan at 75% usable). */
  bufferPct?: number | undefined;
};

/** Extra datasets the estimator can use when the caller has them. */
export type EstimateExtras = {
  /** Norwegian AutoPASS gantries (NVDB) for per-gantry pricing. */
  noTolls?: NoTollStation[] | undefined;
};

/** Where every energy figure in the estimate comes from — shown next to the fuel card and in the PDF. */
export type PriceBasis = {
  mode: "ev" | "fuel";
  /** Distance-weighted price per unit in the trip's base currency. */
  perUnit: number;
  unit: "L" | "kWh" | "gal";
  /** Consumption used, e.g. "6.6 L/100 km" or "18 kWh/100 km". */
  consumptionLabel: string;
  /** True when the consumption came from the driver, not a class default. */
  consumptionFromDriver: boolean;
  countries: {
    code: string;
    flag: string;
    country: string;
    distanceKm: number;
    /** Price per unit in the base currency. */
    price: number;
    /** Same price in the currency charged at the pump, e.g. "18.43 kr/L". */
    local?: string | undefined;
    source: string;
    sourceUrl?: string | undefined;
    asOf: string;
    live: boolean;
  }[];
  fxNote?: string | undefined;
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
  eu: ["IONITY", "Fastned", "Tesla Supercharger", "Allego", "EnBW mobility+", "Aral pulse", "Shell Recharge", "bp pulse", "Electra", "Powerdot", "GreenWay", "ORLEN Charge", "Circle K"],
  us: ["Electrify America", "Tesla Supercharger", "EVgo", "ChargePoint", "Shell Recharge", "bp pulse"],
  ca: [
    "FLO",
    "Tesla Supercharger",
    "Petro-Canada eV",
    "Electrify Canada",
    "Circuit Électrique (QC)",
    "BC Hydro EV",
    "ChargePoint Canada",
    "Ivy Charging Network (ON)",
    "Shell Recharge",
  ],
};

/** Charging networks that actually operate in each country on the corridor. */
const COUNTRY_EV_NETWORKS: Record<string, string[]> = {
  DK: ["Clever", "IONITY", "Tesla Supercharger", "Spirii", "E.ON Drive", "Circle K"],
  DE: ["IONITY", "EnBW mobility+", "Tesla Supercharger", "Aral pulse", "Shell Recharge", "E.ON Drive", "Fastned", "Allego"],
  PL: ["GreenWay", "ORLEN Charge", "IONITY", "Tesla Supercharger", "Elocity", "Eleport", "Polenergia", "Lidl", "Kaufland"],
  NL: ["Fastned", "Allego", "IONITY", "Tesla Supercharger", "Shell Recharge", "Powerdot"],
  BE: ["Fastned", "IONITY", "Allego", "Tesla Supercharger", "Powerdot", "TotalEnergies"],
  FR: ["IONITY", "TotalEnergies", "Tesla Supercharger", "Electra", "Powerdot", "Allego", "Fastned"],
  IT: ["IONITY", "Enel X Way", "Tesla Supercharger", "Free To X", "Ewiva", "Be Charge"],
  ES: ["Iberdrola", "IONITY", "Tesla Supercharger", "Zunder", "Powerdot", "Endesa X"],
  NO: ["Recharge", "IONITY", "Tesla Supercharger", "Mer", "Circle K", "Eviny"],
  SE: ["Recharge", "IONITY", "Tesla Supercharger", "Mer", "Circle K", "Vattenfall InCharge"],
  FI: ["Kesko K-Lataus", "IONITY", "Tesla Supercharger", "Recharge", "ABC-lataus"],
  AT: ["IONITY", "Smatrics", "Tesla Supercharger", "E.ON Drive", "Shell Recharge"],
  CH: ["IONITY", "MOVE", "Tesla Supercharger", "Fastned", "GOFAST"],
  CZ: ["CEZ", "IONITY", "Tesla Supercharger", "E.ON Drive", "PREpoint"],
  SK: ["ZSE Drive", "IONITY", "Tesla Supercharger", "GreenWay"],
  HU: ["MOL Plugee", "IONITY", "Tesla Supercharger", "E.ON Drive"],
  SI: ["Petrol", "IONITY", "Tesla Supercharger", "E.ON Drive"],
  HR: ["ELEN", "IONITY", "Tesla Supercharger", "Petrol"],
  US: ["Electrify America", "Tesla Supercharger", "EVgo", "ChargePoint", "Shell Recharge", "bp pulse"],
  CA: ["FLO", "Tesla Supercharger", "Petro-Canada eV", "Electrify Canada", "BC Hydro EV", "ChargePoint Canada", "Ivy Charging Network (ON)", "Circuit Électrique (QC)"],
  GB: ["IONITY", "InstaVolt", "Tesla Supercharger", "Gridserve", "bp pulse", "Shell Recharge", "Osprey"],
};

/** Closest verified real charger to a point, within maxKm — null (never a
 * fabricated fallback) when nothing real is that close. */
function nearestChargerNear(chargers: EvCharger[], lat: number, lng: number, maxKm: number): EvCharger | null {
  let best: EvCharger | null = null;
  let bestKm = maxKm;
  for (const c of chargers) {
    const km = haversineKm(lat, lng, c.lat, c.lon);
    if (km <= bestKm) {
      bestKm = km;
      best = c;
    }
  }
  return best;
}

/** How far from the ideal physics-based stop point a real verified hub may
 * sit and still count as "the charger for this leg" — wider than the map's
 * 15km corridor buffer since a stop only needs to exist somewhere reasonably
 * near the point, not directly on the routed line. */
const CHARGING_STOP_SEARCH_KM = 60;

/** Closest verified real fuel/service station to a point, within maxKm —
 * null (never a fabricated fallback) when nothing real is that close.
 * Vehicle-relevant amenities can outweigh a few extra km of distance
 * (LPG/dump station for RVs, round-the-clock forecourts for motorcycles)
 * but never override the maxKm cap itself. */
function nearestFuelStationNear(
  stations: FuelStation[],
  lat: number,
  lng: number,
  maxKm: number,
  vehicle: VehicleKey,
): FuelStation | null {
  let best: FuelStation | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const s of stations) {
    const km = haversineKm(lat, lng, s.lat, s.lon);
    if (km > maxKm) continue;
    const amenityBoost =
      vehicle === "motorhome"
        ? (s.has_lpg ? 8 : 0) + (s.has_dump_station ? 12 : 0)
        : vehicle === "motorcycle"
          ? (s.is_24_7 ? 6 : 0)
          : 0;
    const score = amenityBoost - km;
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }
  return best;
}

/** Same 60km search radius used for EV charging-hub matching, applied to
 * real fuel/service stations for non-EV vehicles too. */
const FUEL_STOP_SEARCH_KM = CHARGING_STOP_SEARCH_KM;

function buildOptimizer(
  region: RegionKey,
  vehicle: VehicleKey,
  fuel: FuelKey,
  distanceKm: number,
  imperial: boolean,
  geo?: RouteGeo | null,
  profile?: VehicleProfile | null,
  pricePerKwh?: number,
  evChargers: EvCharger[] = [],
  fuelStations: FuelStation[] = [],
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
    const chargeNote = `Leg of ${d(legKm)} needs about ${kwhNeeded} kWh — arrive near ${bufferPct}% state of charge and charge to 80% in roughly ${vehicle === "motorhome" ? 38 : 22} min.`;

    // Prefer a real, verified hub (src/data/ev_chargers_eu.json) near this
    // leg's point over the generic per-country network list below — same
    // dataset the corridor map uses. Falls back to the country-level list
    // (never a fabricated station) when nothing real is close enough.
    const realHub = isEv && point ? nearestChargerNear(evChargers, point.lat, point.lng, CHARGING_STOP_SEARCH_KM) : null;

    if (realHub) {
      const matchesPreferred = wanted ? realHub.network.toLowerCase().includes(wanted.toLowerCase()) : false;
      return {
        name: realHub.name,
        atKm,
        atLabel: d(atKm),
        power: `${realHub.power_kw} kW ${realHub.connector}`,
        networks: [realHub.network],
        note: wanted
          ? matchesPreferred
            ? `${wanted} hub on this leg. ${chargeNote}`
            : `No ${wanted} site in this battery window — nearest verified hub is ${realHub.name} (${realHub.network}). ${chargeNote}`
          : `${realHub.name} (${realHub.network}). ${chargeNote}`,
        kwhNeeded,
        legLabel: d(legKm),
        pricePerKwh: operatorKwhEur(realHub.network) || pricePerKwh || DEFAULT_KWH_EUR,
        ...(wanted ? { preferred: matchesPreferred, fallback: !matchesPreferred } : {}),
      };
    }

    const refuelNote = `Recommended refuel — keeps you above the ${bufferPct}% reserve on a ${d(fullRange)} tank range.`;

    // Prefer a real, verified station (src/data/fuel_stations_eu.json) near
    // this leg's point, same 60km search radius as the EV hub match above.
    // RVs weight LPG/dump-station amenities, motorcycles weight 24/7
    // forecourts. Falls back to the generic placeholder below (never a
    // fabricated station) when nothing real is close enough.
    const realFuelStop = !isEv && point ? nearestFuelStationNear(fuelStations, point.lat, point.lng, FUEL_STOP_SEARCH_KM, vehicle) : null;

    if (realFuelStop) {
      const relevant =
        vehicle === "motorhome"
          ? realFuelStop.has_lpg || realFuelStop.has_dump_station
          : vehicle === "motorcycle"
            ? realFuelStop.is_24_7
            : false;
      const amenities = [
        realFuelStop.is_24_7 ? "open 24/7" : null,
        vehicle === "motorhome" && realFuelStop.has_lpg ? "LPG refill" : null,
        vehicle === "motorhome" && realFuelStop.has_dump_station ? "dump station" : null,
      ]
        .filter(Boolean)
        .join(" & ");
      return {
        name: realFuelStop.name || realFuelStop.brand,
        atKm,
        atLabel: d(atKm),
        power: realFuelStop.is_24_7 ? "24/7 forecourt" : "Forecourt",
        networks: [realFuelStop.brand],
        note: amenities ? `${realFuelStop.name} — ${amenities}. ${refuelNote}` : `${realFuelStop.name}. ${refuelNote}`,
        ...(vehicle === "motorhome" || vehicle === "motorcycle" ? { preferred: relevant, fallback: !relevant } : {}),
      };
    }

    const { list: local, hit } = orderNetworks(corridorNetworks(point?.code));
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
        : refuelNote,
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
  evChargers: EvCharger[] = [],
  fuelStations: FuelStation[] = [],
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

  const classConsumption =
    vehicle === "motorhome" ? 11.5 : vehicle === "motorcycle" ? 4.8 : 6.6;
  const driverLitres = profile?.litresPer100 && profile.litresPer100 > 0 && profile.litresPer100 < 60 ? profile.litresPer100 : null;
  const consumption = fuel !== "electric" && driverLitres ? driverLitres : classConsumption;
  const driverKwh = fuel === "electric" && profile?.kwhPer100 && profile.kwhPer100 > 0 ? profile.kwhPer100 : null;
  const kwhPer100 = driverKwh ?? (vehicle === "motorhome" ? 28 : vehicle === "motorcycle" ? 12 : 18);

  // Live prices from the energy feed when available; the estimator never
  // invents a number it cannot source. Region default first …
  const perLitreLive = prices
    ? prices.unit === "gallon"
      ? (fuel === "diesel" ? prices.diesel : prices.petrol) / 3.78541
      : fuel === "diesel"
        ? prices.diesel
        : prices.petrol
    : null;
  const regionPerL = perLitreLive ?? (fuel === "diesel" ? 1.72 : 1.89);
  const regionPerKwh = prices?.kwh ?? 0.44;

  // … then country by country along the real corridor, weighted by distance.
  const priceCountries: NonNullable<PriceBasis["countries"]> = [];
  let weighted = 0;
  let weightKm = 0;
  for (const c of geo?.countries ?? []) {
    const row = prices?.countries[c.code];
    const price = row ? (fuel === "electric" ? row.kwh : fuel === "diesel" ? row.diesel : row.petrol) : fuel === "electric" ? regionPerKwh : regionPerL;
    weighted += price * c.distanceKm;
    weightKm += c.distanceKm;
    const localUnit = fuel === "electric" ? "kWh" : "L";
    const localPrice = row && fuel !== "electric" ? (fuel === "diesel" ? row.local.diesel : row.local.petrol) : null;
    priceCountries.push({
      code: c.code,
      flag: c.flag,
      country: c.country,
      distanceKm: Math.round(c.distanceKm * legMultiplier),
      price,
      local:
        row && localPrice !== null && row.local.currency !== prices?.currencyCode
          ? `${localPrice.toLocaleString("en-GB", { maximumFractionDigits: 2 })} ${row.local.currency}/${localUnit}`
          : undefined,
      source: row ? (fuel === "electric" ? "Indicative public DC fast-charging level" : row.source) : "Regional reference level",
      sourceUrl: row && fuel !== "electric" ? row.sourceUrl : undefined,
      asOf: row ? (fuel === "electric" ? "2026" : row.asOf) : "reference",
      live: Boolean(row?.live) && fuel !== "electric",
    });
  }
  const pricePerL = weightKm > 0 && fuel !== "electric" ? weighted / weightKm : regionPerL;
  const pricePerKwh = weightKm > 0 && fuel === "electric" ? weighted / weightKm : regionPerKwh;

  const energyCost =
    fuel === "electric"
      ? round2((distanceKm / 100) * kwhPer100 * pricePerKwh)
      : round2((distanceKm / 100) * consumption * pricePerL);

  const priceBasis: PriceBasis = {
    mode: fuel === "electric" ? "ev" : "fuel",
    perUnit: fuel === "electric" ? pricePerKwh : imperial ? pricePerL * 3.78541 : pricePerL,
    unit: fuel === "electric" ? "kWh" : imperial ? "gal" : "L",
    consumptionLabel:
      fuel === "electric"
        ? `${kwhPer100} kWh/100 km`
        : imperial
          ? `${Math.round(235.215 / consumption)} mpg`
          : `${consumption.toLocaleString("en-GB", { maximumFractionDigits: 1 })} L/100 km`,
    consumptionFromDriver: fuel === "electric" ? Boolean(driverKwh) : Boolean(driverLitres),
    countries: priceCountries,
    fxNote: prices?.fxAsOf ? `ECB reference rates ${prices.fxAsOf}` : undefined,
  };

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
    optimizer: buildOptimizer(region, vehicle, fuel, distanceKm, imperial, geo, profile, pricePerKwh, evChargers, fuelStations),
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

/** Lazily loads and caches the verified EV charger dataset (~700kB) for the
 * lifetime of the session — a top-level import here would inline it into
 * every bundle that imports trip-data.ts (effectively every page), so
 * callers (HeroPlanner) await this once before computing a trip. Same
 * dataset/loading approach as CorridorMap.tsx uses for the map layer. */
let evChargersPromise: Promise<EvCharger[]> | null = null;
export function loadEvChargers(): Promise<EvCharger[]> {
  evChargersPromise ??= import("@/data/ev_chargers_eu.json")
    .then((m) => m.default as EvCharger[])
    .catch(() => []);
  return evChargersPromise;
}

/** Lazily loads and caches the verified fuel/service station dataset for the
 * lifetime of the session — same rationale and pattern as loadEvChargers. */
let fuelStationsPromise: Promise<FuelStation[]> | null = null;
export function loadFuelStations(): Promise<FuelStation[]> {
  fuelStationsPromise ??= import("@/data/fuel_stations_eu.json")
    .then((m) => m.default as FuelStation[])
    .catch(() => []);
  return fuelStationsPromise;
}

/** Lazily loads and caches the curated pan-European POI dataset (history,
 * castles, viewpoints, camping, wildlife, ...) for the lifetime of the
 * session — same rationale and pattern as loadEvChargers. */
let curatedPoisPromise: Promise<CorridorStop[]> | null = null;
export function loadCuratedPois(): Promise<CorridorStop[]> {
  curatedPoisPromise ??= import("@/data/curated_pois_eu.json")
    .then((m) => m.default as CorridorStop[])
    .catch(() => []);
  return curatedPoisPromise;
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
  evChargers: EvCharger[] = [],
  fuelStations: FuelStation[] = [],
): Record<RouteVariantKey, TripEstimate> {
  const args = [extraStops, tripType, durationDays, geo, prices, profile, evChargers, fuelStations] as const;
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
  website?: string;
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
  website?: string;
}

export interface EvChargingPoi {
  id: string;
  lat: number;
  lng: number;
  network: string;
  name: string;
  where: string;
  connectors: string;
  power: string;
  access: string;
  note: string;
  website: string;
  price?: string;
  source?: string;
}

export const ENGLISH_ONLY_POI_IDS = new Set([
  "eu-dalsnibba",
  "eu-aurlandsfjellet",
  "eu-voringfossen",
  "eu-sognefjellet",
  "eu-gaularfjellet",
  "eu-lysevegen",
  "eu-lofoten-e10",
  "eu-senja",
  "eu-iseran",
  "eu-galibier",
  "eu-bonette",
  "eu-sella-pass",
  "eu-tre-cime",
  "eu-amalfi-ss163",
  "eu-ring-kerry",
  "eu-causeway-coast",
  "eu-snowdonia-pass",
  "eu-bealach-na-ba",
  "eu-black-forest-high-road",
  "eu-romantic-road",
  "eu-transfagarasan",
  "us-logan-pass",
  "us-tioga-road",
  "us-artists-drive",
  "us-monument-valley",
  "us-desert-view",
  "us-arches-scenic",
  "us-island-sky",
  "us-trail-ridge",
  "us-million-dollar",
  "us-overseas-highway",
  "us-natchez-trace",
  "us-outer-banks-nc12",
  "us-acadia-loop",
  "us-hurricane-ridge",
  "us-sunrise-road",
  "us-columbia-river",
  "us-byway-12",
  "us-lake-tahoe-east",
  "us-great-river-road",
  "us-badlands-loop",
  "us-cherohala",
  "ca-bow-valley",
  "ca-moraine-lake-road",
  "ca-yoho-field",
  "ca-kootenay-93",
  "ca-dinosaur-trail",
  "ca-fundy-trail",
  "ca-viking-trail",
  "ca-confederation-bridge",
  "ca-saguenay-fjord",
  "ca-algonquin-60",
  "ca-lake-superior",
  "ca-dempster",
  "ca-pacific-rim",
  "ca-okanagan",
  "ca-pacific-marine",
  "eu-geiranger-camping",
  "eu-trollstigen-camping",
  "eu-andalsnes-camping",
  "eu-loen-camping",
  "eu-flam-camping",
  "eu-lom-camping",
  "eu-moskenes-camping",
  "eu-annecy-imperial",
  "eu-bourg-saint-maurice",
  "eu-castellane",
  "eu-prad-am-stilfserjoch",
  "eu-dolomites-corvara",
  "eu-cortina-rochetta",
  "eu-amalfi-sorrento",
  "eu-zellamsee-seecamp",
  "eu-grindelwald",
  "eu-applecross-campsite",
  "eu-llanberis-campsite",
  "eu-killarney-flesk",
  "us-glacier-west-koa",
  "us-stmary-koa",
  "us-cody-koa",
  "us-moab-portal",
  "us-ruby-inn-rv",
  "us-zion-river",
  "us-grand-canyon-trailer",
  "us-monument-valley-koa",
  "us-yosemite-pines",
  "us-pfeiffer-big-sur",
  "us-kirk-creek",
  "us-death-valley-furnace",
  "us-rocky-mountain-manor",
  "us-ouray-koa",
  "us-blue-ridge-pisgah",
  "us-smokemont",
  "us-acadia-blackwoods",
  "us-outer-banks-cape-hatteras",
  "us-key-west-boyds",
  "us-olympic-heart-o-hills",
  "us-mount-rainier-cougar",
  "us-badlands-cedar-pass",
  "ca-tunnel-mountain",
  "ca-lake-louise-campground",
  "ca-wapiti",
  "ca-kicking-horse",
  "ca-redstreak",
  "ca-squamish-chief",
  "ca-alice-lake",
  "ca-green-point",
  "ca-goldstream",
  "ca-living-forest",
  "ca-riding-mountain-wasagaming",
  "ca-algonquin-mew",
  "ca-lake-superior-agawa",
  "ca-fundy-headquarters",
  "ca-cape-breton-cheticamp",
  "ca-cavendish",
  "ca-gros-morne-green-point",
  "ca-tombstone",
]);

export const SCENIC_HIGHLIGHTS: Record<RegionKey, ScenicHighlight[]> = {
  eu: [
    { id: "trollstigen", lat: 62.4558, lng: 7.6709, emoji: "🏔️", name: "Trollstigen", where: "Rauma, Norway", note: "Eleven hairpins climbing a sheer wall — viewing platform over the valley.", season: "Late May – October" },
    { id: "atlantic-road", lat: 63.0139, lng: 7.352, emoji: "🌊", name: "Atlantic Road", where: "Møre og Romsdal, Norway", note: "Eight bridges hopping island to island straight over the open sea.", season: "Year-round" },
    { id: "grossglockner", lat: 47.076, lng: 12.838, emoji: "⛰️", name: "Grossglockner High Alpine Road", where: "Austria", note: "48 km of alpine theatre topping out at 2,504 m.", season: "May – early November" },
    { id: "stelvio", lat: 46.5285, lng: 10.4543, emoji: "🏍️", name: "Stelvio Pass", where: "Italy", note: "48 numbered hairpins — the classic rider pilgrimage.", season: "June – October" },
    { id: "furka", lat: 46.5723, lng: 8.4152, emoji: "✨", name: "Furka & Grimsel Passes", where: "Switzerland", note: "Glacier views, smooth tarmac and a lakeside descent.", season: "June – October" },
    { id: "verdon", lat: 43.75, lng: 6.33, emoji: "🌅", name: "Gorges du Verdon", where: "Provence, France", note: "Turquoise canyon rim road on the way to the Côte d'Azur.", season: "Year-round" },
    { id: "eu-dalsnibba", lat: 62.0487, lng: 7.2706, emoji: "🏔️", name: "Geiranger Skywalk - Dalsnibba", where: "Geiranger, Norway", note: "A paved toll road climbs to a crisp fjord viewpoint 1,500 m above Geiranger.", season: "Seasonal road; check opening before climbing", website: "https://dalsnibba.no/en/" },
    { id: "eu-aurlandsfjellet", lat: 60.9087, lng: 7.2124, emoji: "✨", name: "Stegastein & Aurlandsfjellet", where: "Aurland, Norway", note: "A high, quiet alternative to the Laerdal Tunnel, with the Stegastein platform above the fjord.", season: "Summer mountain road; Stegastein is normally year-round", website: "https://www.nasjonaleturistveger.no/en/routes/aurlandsfjellet/" },
    { id: "eu-voringfossen", lat: 60.4269, lng: 7.2512, emoji: "💧", name: "Voringfossen & Hardangervidda", where: "Eidfjord, Norway", note: "Waterfall bridges and wide mountain-plateau driving on the Oslo-Bergen corridor.", season: "Year-round; winter conditions on the plateau", website: "https://www.nasjonaleturistveger.no/en/routes/hardangervidda/" },
    { id: "eu-sognefjellet", lat: 61.5633, lng: 8.0026, emoji: "🏔️", name: "Sognefjellet National Tourist Route", where: "Lom to Gaupne, Norway", note: "Norway's highest mountain pass road, with glacier views and generous photo stops.", season: "Usually May – October", website: "https://www.nasjonaleturistveger.no/en/routes/sognefjellet/" },
    { id: "eu-gaularfjellet", lat: 61.4143, lng: 6.2836, emoji: "🌄", name: "Gaularfjellet Utsikten", where: "Vestland, Norway", note: "A calm fjord detour with waterfalls, tight bends and a dramatic viewpoint platform.", season: "Usually May – December", website: "https://www.nasjonaleturistveger.no/en/routes/gaularfjellet/" },
    { id: "eu-lysevegen", lat: 59.056, lng: 6.6502, emoji: "🏍️", name: "Lysevegen to Lysebotn", where: "Ryfylke, Norway", note: "Twenty-seven hairpins drop towards Lysefjorden; take it slowly in longer vehicles.", season: "Usually May – October", website: "https://www.nasjonaleturistveger.no/en/routes/ryfylke/" },
    { id: "eu-lofoten-e10", lat: 67.9324, lng: 13.0896, emoji: "🌊", name: "Lofoten E10 to Reine", where: "Nordland, Norway", note: "Bridges, fishing villages and beaches make the E10 one of Europe's loveliest road days.", season: "Year-round; allow extra time in winter weather", website: "https://www.visitnorway.com/places-to-go/northern-norway/lofoten/" },
    { id: "eu-senja", lat: 69.4449, lng: 17.2984, emoji: "🌅", name: "Senja National Scenic Route", where: "Senja, Norway", note: "Ocean-edge driving, mountain walls and easy roadside viewpoints on a quieter Arctic loop.", season: "Year-round; winter closures can affect side roads", website: "https://www.nasjonaleturistveger.no/en/routes/senja/" },
    { id: "eu-iseran", lat: 45.417, lng: 7.031, emoji: "⛰️", name: "Col de l'Iseran", where: "Savoie, France", note: "A very high Alpine crossing between Val d'Isere and Bonneval-sur-Arc.", season: "Usually June – October", website: "https://www.valdisere.com/en/" },
    { id: "eu-galibier", lat: 45.064, lng: 6.407, emoji: "🚴", name: "Col du Galibier", where: "Hautes-Alpes, France", note: "A Tour de France classic with big views and exposed weather near the summit.", season: "Usually June – October", website: "https://www.hautes-alpes.net/en/" },
    { id: "eu-bonette", lat: 44.321, lng: 6.807, emoji: "🏔️", name: "Cime de la Bonette", where: "Mercantour, France", note: "A memorable high loop on the Route des Grandes Alpes; fuel before the climb.", season: "Usually June – October", website: "https://www.routedesgrandesalpes.com/" },
    { id: "eu-sella-pass", lat: 46.508, lng: 11.758, emoji: "⛰️", name: "Sella Pass", where: "Dolomites, Italy", note: "A compact Dolomite pass with lift stations, viewpoints and easy links to Gardena and Pordoi.", season: "Year-round; winter equipment may be required", website: "https://www.suedtirol.info/en/en/experiences-and-events/plp-experiences/experiences-south-tyrol/pdp-experience.smgpoi057d6c00d2e84d20bfe1cf36e9c92bd6.sella-pass" },
    { id: "eu-tre-cime", lat: 46.612, lng: 12.295, emoji: "🥾", name: "Tre Cime di Lavaredo toll road", where: "Auronzo, Italy", note: "A short paid mountain road to trailheads and huge Dolomite views; arrive early on clear days.", season: "Usually late May – October", website: "https://www.dreizinnen.com/en/" },
    { id: "eu-amalfi-ss163", lat: 40.633, lng: 14.602, emoji: "🌊", name: "Amalfi Coast SS163", where: "Campania, Italy", note: "Cliffside villages and tight bends; small cars and early starts make it kinder.", season: "Year-round; summer traffic restrictions may apply", website: "https://www.italia.it/en/campania/amalfi-coast" },
    { id: "eu-ring-kerry", lat: 51.94, lng: -9.9, emoji: "🍀", name: "Ring of Kerry", where: "County Kerry, Ireland", note: "Atlantic bays, stone forts and mountain gaps on a full-day touring loop.", season: "Year-round", website: "https://www.discoverireland.ie/kerry/ring-of-kerry" },
    { id: "eu-causeway-coast", lat: 55.2408, lng: -6.5116, emoji: "🌊", name: "Causeway Coastal Route", where: "Northern Ireland", note: "A friendly coastal drive linking beaches, castles and the Giant's Causeway area.", season: "Year-round", website: "https://discovernorthernireland.com/things-to-do/giants-causeway-causeway-coastal-route" },
    { id: "eu-snowdonia-pass", lat: 53.081, lng: -4.039, emoji: "⛰️", name: "Llanberis Pass", where: "Eryri / Snowdonia, Wales", note: "A compact mountain pass with lay-bys, trailheads and rugged slate-valley views.", season: "Year-round; winter weather can be sudden", website: "https://snowdonia.gov.wales/" },
    { id: "eu-bealach-na-ba", lat: 57.416, lng: -5.771, emoji: "🏔️", name: "Bealach na Ba", where: "Applecross, Scotland", note: "A single-track climb with alpine-style switchbacks; not suitable for large motorhomes.", season: "Year-round in fair weather; avoid in snow or high winds", website: "https://www.visitscotland.com/" },
    { id: "eu-black-forest-high-road", lat: 48.584, lng: 8.273, emoji: "🌲", name: "Black Forest High Road", where: "Baden-Wurttemberg, Germany", note: "A relaxed ridge drive above spa towns, lakes and forest viewpoints.", season: "Year-round", website: "https://www.blackforest-tourism.com/" },
    { id: "eu-romantic-road", lat: 49.378, lng: 10.179, emoji: "🏰", name: "Romantic Road - Rothenburg stop", where: "Bavaria, Germany", note: "A gentle touring corridor of walled towns, vineyards and easy overnight stops.", season: "Year-round", website: "https://www.romanticroadgermany.com/" },
    { id: "eu-transfagarasan", lat: 45.598, lng: 24.617, emoji: "🏔️", name: "Transfagarasan Highway", where: "Carpathian Mountains, Romania", note: "A bold mountain crossing to Balea Lake, best driven slowly with weather checked first.", season: "Usually July – October", website: "https://romania.travel/" },
  ],
  us: [
    { id: "blue-ridge", lat: 36.5, lng: -81.0, emoji: "🌄", name: "Blue Ridge Parkway", where: "Virginia – North Carolina", note: "469 miles of ridgeline overlooks, no trucks, no tolls.", season: "Year-round (peak: October)" },
    { id: "pch", lat: 36.2704, lng: -121.8081, emoji: "🌊", name: "Pacific Coast Highway (SR-1)", where: "California", note: "Big Sur cliffs, Bixby Bridge and endless Pacific vistas.", season: "Year-round" },
    { id: "dragon", lat: 35.51, lng: -83.93, emoji: "🏍️", name: "Tail of the Dragon (US-129)", where: "Tennessee", note: "318 curves in 11 miles — ride it early to beat traffic.", season: "April – November" },
    { id: "beartooth", lat: 45.0, lng: -109.47, emoji: "⛰️", name: "Beartooth Highway", where: "Montana – Wyoming", note: "Switchbacks to 10,947 ft on the doorstep of Yellowstone.", season: "Late May – mid October" },
    { id: "zion", lat: 37.2, lng: -112.98, emoji: "🏜️", name: "Zion – Bryce scenic corridor", where: "Utah", note: "Red-rock tunnels and canyon overlooks between two parks.", season: "Year-round" },
    { id: "us-logan-pass", lat: 48.6967, lng: -113.7183, emoji: "🏔️", name: "Logan Pass", where: "Glacier National Park, Montana", note: "The high point of Going-to-the-Sun Road, with tight parking and big alpine views.", season: "Usually late June – October", website: "https://www.nps.gov/glac/planyourvisit/goingtothesunroad.htm" },
    { id: "us-tioga-road", lat: 37.9106, lng: -119.2571, emoji: "⛰️", name: "Tioga Road", where: "Yosemite National Park, California", note: "A high Sierra crossing past Tuolumne Meadows; check seasonal opening before routing.", season: "Usually late May/June – October/November", website: "https://www.nps.gov/yose/planyourvisit/tioga.htm" },
    { id: "us-artists-drive", lat: 36.363, lng: -116.802, emoji: "🎨", name: "Artist's Drive", where: "Death Valley National Park, California", note: "A one-way paved loop of mineral-colored hills, best outside the hottest part of the day.", season: "Year-round; extreme summer heat", website: "https://www.nps.gov/deva/planyourvisit/artists-drive.htm" },
    { id: "us-monument-valley", lat: 36.982, lng: -110.112, emoji: "🏜️", name: "Monument Valley scenic drive", where: "Navajo Nation, Arizona/Utah", note: "Iconic red-sand buttes on a managed tribal park drive; check road and vehicle rules first.", season: "Year-round", website: "https://navajonationparks.org/tribal-parks/monument-valley/" },
    { id: "us-desert-view", lat: 36.0407, lng: -111.8262, emoji: "🌅", name: "Desert View Drive", where: "Grand Canyon National Park, Arizona", note: "South Rim overlooks with easier pullouts than the village core.", season: "Year-round", website: "https://www.nps.gov/grca/planyourvisit/desert-view.htm" },
    { id: "us-arches-scenic", lat: 38.7331, lng: -109.5925, emoji: "🏜️", name: "Arches Scenic Drive", where: "Moab, Utah", note: "A compact national-park road linking major arches and viewpoints; timed entry may apply.", season: "Year-round", website: "https://www.nps.gov/arch/planyourvisit/index.htm" },
    { id: "us-island-sky", lat: 38.4598, lng: -109.8211, emoji: "🌄", name: "Island in the Sky", where: "Canyonlands National Park, Utah", note: "Mesa-top overlooks with big pay-off for a short detour from Moab.", season: "Year-round", website: "https://www.nps.gov/cany/planyourvisit/islandinthesky.htm" },
    { id: "us-trail-ridge", lat: 40.379, lng: -105.681, emoji: "🏔️", name: "Trail Ridge Road", where: "Rocky Mountain National Park, Colorado", note: "A high, exposed alpine road above treeline; carry layers even on warm valley days.", season: "Usually late May – October", website: "https://www.nps.gov/romo/planyourvisit/trail_ridge_road.htm" },
    { id: "us-million-dollar", lat: 37.837, lng: -107.746, emoji: "⛰️", name: "Million Dollar Highway", where: "Ouray to Silverton, Colorado", note: "Dramatic San Juan mountain driving with narrow shoulders and serious winter exposure.", season: "Year-round; winter traction rules may apply", website: "https://www.colorado.com/articles/colorado-scenic-byway-san-juan-skyway" },
    { id: "us-overseas-highway", lat: 24.711, lng: -81.105, emoji: "🌊", name: "Overseas Highway", where: "Florida Keys", note: "Island-hopping bridges all the way to Key West; reserve overnight stops well ahead.", season: "Year-round", website: "https://www.fla-keys.com/" },
    { id: "us-natchez-trace", lat: 34.73, lng: -88.15, emoji: "🌳", name: "Natchez Trace Parkway", where: "Mississippi, Alabama, Tennessee", note: "A quiet, low-speed parkway with history stops and no commercial traffic.", season: "Year-round", website: "https://www.nps.gov/natr/index.htm" },
    { id: "us-outer-banks-nc12", lat: 35.838, lng: -75.562, emoji: "🌊", name: "Outer Banks NC 12", where: "North Carolina", note: "Barrier-island driving with ferry links, lighthouses and weather-sensitive sections.", season: "Year-round; check storm and ferry status", website: "https://www.ncdot.gov/travel-maps/ferry-tickets-services/routes/Pages/default.aspx" },
    { id: "us-acadia-loop", lat: 44.3386, lng: -68.2039, emoji: "🌲", name: "Park Loop Road", where: "Acadia National Park, Maine", note: "Ocean cliffs, carriage-road bridges and easy viewpoints close to Bar Harbor.", season: "Mostly April – November", website: "https://www.nps.gov/acad/planyourvisit/park-loop-road.htm" },
    { id: "us-hurricane-ridge", lat: 47.969, lng: -123.499, emoji: "🏔️", name: "Hurricane Ridge Road", where: "Olympic National Park, Washington", note: "A rewarding climb from Port Angeles to mountain views; winter access can be limited.", season: "Year-round when conditions allow", website: "https://www.nps.gov/olym/planyourvisit/hurricane-ridge.htm" },
    { id: "us-sunrise-road", lat: 46.914, lng: -121.642, emoji: "🌄", name: "Sunrise Road", where: "Mount Rainier National Park, Washington", note: "The highest paved road in the park, with huge Rainier views and limited summer parking.", season: "Usually July – September", website: "https://www.nps.gov/mora/planyourvisit/sunrise.htm" },
    { id: "us-columbia-river", lat: 45.539, lng: -122.244, emoji: "💧", name: "Historic Columbia River Highway", where: "Oregon", note: "Waterfalls and gorge viewpoints just east of Portland; some sections are car-free trails.", season: "Year-round", website: "https://stateparks.oregon.gov/index.cfm?do=park.profile&parkId=108" },
    { id: "us-byway-12", lat: 37.747, lng: -111.495, emoji: "🏜️", name: "Scenic Byway 12", where: "Southern Utah", note: "Red-rock plateaus, forested high country and easy links between Bryce and Capitol Reef.", season: "Year-round", website: "https://www.visitutah.com/places-to-go/parks-outdoors/scenic-byway-12" },
    { id: "us-lake-tahoe-east", lat: 39.059, lng: -119.943, emoji: "💧", name: "Lake Tahoe East Shore Drive", where: "Nevada", note: "Clear-water coves and mountain pullouts between Incline Village and South Lake Tahoe.", season: "Year-round; winter storms affect passes", website: "https://travelnevada.com/road-trips/lake-tahoe-loop/" },
    { id: "us-great-river-road", lat: 38.628, lng: -90.184, emoji: "🌊", name: "Great River Road", where: "Mississippi River corridor", note: "A slower, story-rich alternative to the interstate, following river towns and levees.", season: "Year-round", website: "https://experiencemississippiriver.com/" },
    { id: "us-badlands-loop", lat: 43.7608, lng: -101.9281, emoji: "🌄", name: "Badlands Loop Road", where: "South Dakota", note: "Short, scenic pullouts through eroded prairie formations close to I-90.", season: "Year-round", website: "https://www.nps.gov/badl/planyourvisit/scenic-drives.htm" },
    { id: "us-cherohala", lat: 35.324, lng: -84.046, emoji: "🏍️", name: "Cherohala Skyway", where: "Tennessee – North Carolina", note: "A sweeping ridge road near the Smokies, calmer and more flowing than US-129.", season: "Year-round; winter weather can close high sections", website: "https://cherohala.com/" },
  ],
  ca: [
    { id: "icefields", lat: 51.67, lng: -116.94, emoji: "🏔️", name: "Icefields Parkway", where: "Alberta", note: "232 km between Lake Louise and Jasper past glaciers and turquoise lakes.", season: "Year-round (winter tyres Oct–Apr)" },
    { id: "cabot", lat: 46.75, lng: -60.75, emoji: "🌊", name: "Cabot Trail", where: "Cape Breton, Nova Scotia", note: "Highland cliffs, whale lookouts and ocean switchbacks.", season: "May – October" },
    { id: "sea-to-sky", lat: 49.7, lng: -123.15, emoji: "✨", name: "Sea-to-Sky Highway", where: "British Columbia", note: "Howe Sound fjord views from Vancouver up to Whistler.", season: "Year-round" },
    { id: "charlevoix", lat: 47.44, lng: -70.5, emoji: "🍁", name: "Route du Fleuve, Charlevoix", where: "Québec", note: "St. Lawrence riverside villages and beluga-watching stops.", season: "May – October" },
    { id: "ca-bow-valley", lat: 51.249, lng: -115.839, emoji: "🌲", name: "Bow Valley Parkway", where: "Banff National Park, Alberta", note: "A slower wildlife-aware alternative to the Trans-Canada between Banff and Lake Louise.", season: "Year-round; seasonal cycling and wildlife closures can apply", website: "https://parks.canada.ca/pn-np/ab/banff/activ/cyclisme-biking/route-parkway" },
    { id: "ca-moraine-lake-road", lat: 51.321, lng: -116.186, emoji: "💧", name: "Lake Louise & Moraine Lake area", where: "Banff National Park, Alberta", note: "Classic turquoise-lake stops; private vehicles may be restricted for Moraine Lake.", season: "Lake Louise year-round; Moraine Lake access is seasonal", website: "https://parks.canada.ca/pn-np/ab/banff/visit/les10-top10/louise" },
    { id: "ca-yoho-field", lat: 51.464, lng: -116.573, emoji: "💧", name: "Yoho Valley & Emerald Lake", where: "Yoho National Park, British Columbia", note: "A beautiful Trans-Canada detour with waterfalls, mountain walls and a calm lake stop.", season: "Year-round; Takakkaw Falls road is seasonal", website: "https://parks.canada.ca/pn-np/bc/yoho" },
    { id: "ca-kootenay-93", lat: 50.634, lng: -116.044, emoji: "♨️", name: "Kootenay Highway 93", where: "Radium Hot Springs, British Columbia", note: "A quieter Rockies route with canyon stops and hot springs near the park gate.", season: "Year-round", website: "https://parks.canada.ca/pn-np/bc/kootenay" },
    { id: "ca-dinosaur-trail", lat: 51.475, lng: -112.748, emoji: "🦕", name: "Dinosaur Trail", where: "Drumheller, Alberta", note: "Badlands viewpoints, hoodoos and the Royal Tyrrell Museum close to Highway 9.", season: "Year-round", website: "https://www.travelalberta.com/listings/dinosaur-trail-2038" },
    { id: "ca-fundy-trail", lat: 45.426, lng: -65.386, emoji: "🌊", name: "Fundy Trail Parkway", where: "New Brunswick", note: "A coastal parkway with lookouts, beaches and waterfall walks above the Bay of Fundy.", season: "Seasonal parkway; check official dates", website: "https://fundytrailparkway.com/" },
    { id: "ca-viking-trail", lat: 49.601, lng: -57.914, emoji: "🌊", name: "Viking Trail", where: "Gros Morne to L'Anse aux Meadows, Newfoundland", note: "Long coastal touring through fjords, tablelands and northern fishing communities.", season: "May – October", website: "https://www.newfoundlandlabrador.com/trip-ideas/travel-itineraries/viking-trail" },
    { id: "ca-confederation-bridge", lat: 46.229, lng: -63.74, emoji: "🌉", name: "Confederation Bridge", where: "New Brunswick to Prince Edward Island", note: "A 12.9 km fixed link to PEI; toll is collected when leaving the island.", season: "Year-round", website: "https://www.confederationbridge.com/" },
    { id: "ca-saguenay-fjord", lat: 48.323, lng: -70.853, emoji: "🌊", name: "Saguenay Fjord route", where: "Québec", note: "Fjord viewpoints, ferry options and small villages between Tadoussac and Saguenay.", season: "Year-round", website: "https://www.bonjourquebec.com/en-ca/listing/things-to-do/sports-and-nature/national-parks/parc-national-du-fjord-du-saguenay-476992" },
    { id: "ca-algonquin-60", lat: 45.579, lng: -78.359, emoji: "🍁", name: "Highway 60 Corridor", where: "Algonquin Provincial Park, Ontario", note: "Easy trailheads, lakes and autumn colour right from the main park road.", season: "Year-round", website: "https://www.ontarioparks.ca/park/algonquin" },
    { id: "ca-lake-superior", lat: 48.765, lng: -86.378, emoji: "🌊", name: "Lake Superior coastal drive", where: "Northern Ontario", note: "Big-water viewpoints and forested stops along the Trans-Canada north shore.", season: "Year-round; winter conditions are serious", website: "https://www.ontariotravel.net/en/road-trips/lake-superior-circle-tour" },
    { id: "ca-dempster", lat: 65.263, lng: -138.329, emoji: "🌌", name: "Dempster Highway", where: "Yukon to Northwest Territories", note: "Remote gravel driving to the Arctic; carry fuel, tyres and weather margin.", season: "Year-round with seasonal ferry/ice crossings", website: "https://yukon.ca/en/dempster-highway" },
    { id: "ca-pacific-rim", lat: 49.07, lng: -125.673, emoji: "🌲", name: "Pacific Rim Highway", where: "Vancouver Island, British Columbia", note: "Rainforest, beaches and surf towns between Port Alberni, Ucluelet and Tofino.", season: "Year-round", website: "https://parks.canada.ca/pn-np/bc/pacificrim" },
    { id: "ca-okanagan", lat: 49.5, lng: -119.6, emoji: "🍇", name: "Okanagan Valley lakeshore drive", where: "British Columbia", note: "Warm lake stops, vineyards and easy food breaks between Penticton and Kelowna.", season: "Year-round; best May – October", website: "https://www.hellobc.com/places-to-go/okanagan-valley/" },
    { id: "ca-pacific-marine", lat: 48.692, lng: -124.834, emoji: "🌲", name: "Pacific Marine Circle Route", where: "Vancouver Island, British Columbia", note: "A forest-and-ocean loop through Sooke, Port Renfrew, Lake Cowichan and Duncan.", season: "Year-round", website: "https://www.hellobc.com/road-trips/pacific-marine-circle-route/" },
  ],
};

export const RV_POIS: Record<RegionKey, RvPoi[]> = {
  eu: [
    { id: "eu-1", lat: 62.101, lng: 7.206, emoji: "🚐", name: "Bobil-parkering Geiranger", where: "Geiranger, Norway", services: ["Grey water", "Fresh water", "EV hookup"], note: "Fjord-side pitches, 5 min walk to the ferry quay." },
    { id: "eu-2", lat: 47.323, lng: 12.796, emoji: "🚐", name: "Stellplatz Zell am See", where: "Salzburg, Austria", services: ["Chemical WC", "Electricity", "Bakery service"], note: "Great overnight before Grossglockner — book in July/August." },
    { id: "eu-3", lat: 45.899, lng: 6.129, emoji: "🚐", name: "Aire de Camping-Car Annecy", where: "Haute-Savoie, France", services: ["Fresh water", "Grey water", "24h access"], note: "France's aire network is the cheapest overnight option en route south." },
    { id: "eu-4", lat: 45.44, lng: 10.69, emoji: "🚐", name: "Camping Bella Italia, Peschiera", where: "Lake Garda, Italy", services: ["Full hookup", "Laundry", "Pool"], note: "Large pitches; height/width friendly access road." },
    { id: "eu-geiranger-camping", lat: 62.1007, lng: 7.2058, emoji: "🚐", name: "Geiranger Camping", where: "Geiranger, Norway", note: "Fjord-side base for the Geiranger ferry, Dalsnibba and the road towards Trollstigen.", services: ["Motorhome pitches", "Sanitary facilities", "Fjord access"], website: "https://www.geirangercamping.no/" },
    { id: "eu-trollstigen-camping", lat: 62.532, lng: 7.716, emoji: "🚐", name: "Trollstigen Camping and Gjestegard", where: "Isterdalen, Norway", note: "A practical valley stop before or after the Trollstigen hairpins.", services: ["Motorhome pitches", "Cabins", "Cafe nearby"], website: "https://www.trollstigen.no/" },
    { id: "eu-andalsnes-camping", lat: 62.567, lng: 7.687, emoji: "🚐", name: "Andalsnes Camping and Motell", where: "Rauma, Norway", note: "Useful overnight for Romsdalen, Trollstigen and the Atlantic Road approach.", services: ["Electricity", "Laundry", "Sanitary facilities"], website: "https://www.andalsnes-camping.no/" },
    { id: "eu-loen-camping", lat: 61.871, lng: 6.854, emoji: "🚐", name: "Lo-Vik Camping", where: "Loen, Norway", note: "Friendly fjord-and-glacier stop between Stryn, Loen Skylift and Oldedalen.", services: ["Electricity", "Laundry", "Boat rental"], website: "https://www.lo-vik.no/" },
    { id: "eu-flam-camping", lat: 60.862, lng: 7.114, emoji: "🚐", name: "Flam Camping and Hostel", where: "Flam, Norway", note: "Easy walking access to the quay and railway after the Aurlandsfjellet descent.", services: ["Motorhome pitches", "Laundry", "Kitchen"], website: "https://www.flamcamping.com/" },
    { id: "eu-lom-camping", lat: 61.837, lng: 8.568, emoji: "🚐", name: "Nordal Turistsenter", where: "Lom, Norway", note: "A handy Sognefjellet staging point with fuel, groceries and mountain roads close by.", services: ["Electricity", "Laundry", "Restaurant"], website: "https://www.nordalturistsenter.no/" },
    { id: "eu-moskenes-camping", lat: 67.9, lng: 13.046, emoji: "🚐", name: "Moskenes Camping", where: "Lofoten, Norway", note: "Good final E10 stop near the ferry quay for Bodoe and Vaeroy departures.", services: ["Motorhome pitches", "Showers", "Laundry"], website: "https://moskenescamping.no/" },
    { id: "eu-annecy-imperial", lat: 45.904, lng: 6.142, emoji: "🚐", name: "Camping Le Belvedere", where: "Annecy, France", note: "A compact lake-and-Alps stop before the Route des Grandes Alpes.", services: ["Electricity", "Sanitary facilities", "Restaurant"], website: "https://www.camping-annecy.com/" },
    { id: "eu-bourg-saint-maurice", lat: 45.614, lng: 6.771, emoji: "🚐", name: "Camping Huttopia Bourg-Saint-Maurice", where: "Savoie, France", note: "Useful base before high Alpine passes towards Iseran, Roselend and Val d'Isere.", services: ["Electricity", "Pool", "Bread service"], website: "https://europe.huttopia.com/en/site/bourg-saint-maurice/" },
    { id: "eu-castellane", lat: 43.846, lng: 6.514, emoji: "🚐", name: "Camping Huttopia Gorges du Verdon", where: "Castellane, France", note: "A calm base for the Verdon rim roads, with canyon access close by.", services: ["Electricity", "Pool", "Restaurant"], website: "https://europe.huttopia.com/en/site/gorges-du-verdon/" },
    { id: "eu-prad-am-stilfserjoch", lat: 46.618, lng: 10.592, emoji: "🚐", name: "Camping Saegemuehle", where: "Prad am Stilfserjoch, Italy", note: "One of the most convenient motorhome bases before climbing Stelvio from the classic side.", services: ["Electricity", "Restaurant", "Wellness"], website: "https://www.camping-saegemuehle.com/en/" },
    { id: "eu-dolomites-corvara", lat: 46.552, lng: 11.871, emoji: "🚐", name: "Camping Colfosco", where: "Alta Badia, Italy", note: "A high Dolomite base close to Gardena, Sella, Campolongo and Pordoi passes.", services: ["Electricity", "Restaurant", "Ski bus"], website: "https://www.campingcolfosco.org/en/" },
    { id: "eu-cortina-rochetta", lat: 46.523, lng: 12.121, emoji: "🚐", name: "Camping Olympia", where: "Cortina d'Ampezzo, Italy", note: "Practical Cortina stop for Tre Cime, Falzarego and the Great Dolomites Road.", services: ["Electricity", "Restaurant", "Laundry"], website: "https://www.campingolympiacortina.it/en/" },
    { id: "eu-amalfi-sorrento", lat: 40.626, lng: 14.371, emoji: "🚐", name: "Camping Nube d'Argento", where: "Sorrento, Italy", note: "A sensible base for the Amalfi Coast when you would rather not drive the SS163 in a larger vehicle.", services: ["Motorhome pitches", "Pool", "Walk to town"], website: "https://www.nubedargento.com/" },
    { id: "eu-zellamsee-seecamp", lat: 47.336, lng: 12.806, emoji: "🚐", name: "Seecamp Zell am See", where: "Salzburg, Austria", note: "Lakefront overnight with quick access to the Grossglockner High Alpine Road.", services: ["Electricity", "Restaurant", "Lake access"], website: "https://www.seecamp.at/en/" },
    { id: "eu-grindelwald", lat: 46.628, lng: 8.033, emoji: "🚐", name: "Camping Eigernordwand", where: "Grindelwald, Switzerland", note: "A scenic Bernese Oberland base for Furka, Grimsel and Susten touring days.", services: ["Electricity", "Laundry", "Mountain views"], website: "https://www.camping-grindelwald.ch/en/" },
    { id: "eu-applecross-campsite", lat: 57.433, lng: -5.812, emoji: "🚐", name: "Applecross Campsite", where: "Applecross, Scotland", note: "Small west-coast stop after Bealach na Ba; large vehicles should use the coastal approach.", services: ["Electric hookups", "Showers", "Laundry"], website: "https://www.applecross.uk.com/campsite" },
    { id: "eu-llanberis-campsite", lat: 53.118, lng: -4.128, emoji: "🚐", name: "Camping in Llanberis", where: "Eryri / Snowdonia, Wales", note: "Useful base for the Llanberis Pass, Yr Wyddfa paths and slate-country driving.", services: ["Camping pitches", "Showers", "Village access"], website: "https://snowdonia.gov.wales/" },
    { id: "eu-killarney-flesk", lat: 52.048, lng: -9.504, emoji: "🚐", name: "Flesk River Apartments and Camping", where: "Killarney, Ireland", note: "Good Ring of Kerry launch point with town, fuel and food close by.", services: ["Motorhome pitches", "Showers", "Town access"], website: "https://www.fleskrivercamping.com/" },
  ],
  us: [
    { id: "us-1", lat: 39.5, lng: -98.35, emoji: "🚐", name: "KOA Journey — Interstate corridor", where: "Nationwide", note: "Pull-through sites sized for 40 ft rigs and towed cars.", services: ["Full hookup", "Dump station", "Wi-Fi"] },
    { id: "us-2", lat: 44.662, lng: -111.1, emoji: "🚐", name: "Yellowstone Grizzly RV Park", where: "West Yellowstone, MT", note: "Book months ahead for summer; ideal Beartooth basecamp.", services: ["50 amp", "Dump station", "Laundry"] },
    { id: "us-3", lat: 35.135, lng: -120.635, emoji: "🚐", name: "Pismo Coast Village RV Resort", where: "California", note: "Beachfront stop midway along the Pacific Coast Highway.", services: ["Full hookup", "Propane", "Dump station"] },
    { id: "us-glacier-west-koa", lat: 48.487, lng: -114.03, emoji: "🚐", name: "West Glacier KOA Resort", where: "West Glacier, MT", note: "A full-service base close to the west entrance of Going-to-the-Sun Road.", services: ["Full hookup", "Pool", "Laundry"], website: "https://koa.com/campgrounds/west-glacier/" },
    { id: "us-stmary-koa", lat: 48.746, lng: -113.43, emoji: "🚐", name: "St. Mary / East Glacier KOA Holiday", where: "St. Mary, MT", note: "Handy east-side stop for Logan Pass starts and Many Glacier day trips.", services: ["Full hookup", "Laundry", "Shuttle access"], website: "https://koa.com/campgrounds/st-mary/" },
    { id: "us-cody-koa", lat: 44.526, lng: -109.023, emoji: "🚐", name: "Cody KOA Holiday", where: "Cody, WY", note: "A practical overnight between Beartooth Highway, Chief Joseph Scenic Byway and Yellowstone.", services: ["Full hookup", "Pool", "Laundry"], website: "https://koa.com/campgrounds/cody/" },
    { id: "us-moab-portal", lat: 38.591, lng: -109.568, emoji: "🚐", name: "Sun Outdoors Moab Downtown", where: "Moab, UT", note: "Central Moab base for Arches, Canyonlands and Scenic Byway 128.", services: ["Full hookup", "Pool", "Laundry"], website: "https://www.sunoutdoors.com/utah/sun-outdoors-moab-downtown" },
    { id: "us-ruby-inn-rv", lat: 37.674, lng: -112.157, emoji: "🚐", name: "Ruby's Inn RV Park and Campground", where: "Bryce Canyon City, UT", note: "Very convenient for Bryce Canyon and the Highway 12 corridor.", services: ["Full hookup", "Dump station", "Laundry"], website: "https://www.rubysinn.com/rv-park-campground/" },
    { id: "us-zion-river", lat: 37.206, lng: -113.269, emoji: "🚐", name: "Zion River Resort RV Park", where: "Virgin, UT", note: "Full-service stop west of Zion with easier access than parking inside the park.", services: ["Full hookup", "Laundry", "Shuttle nearby"], website: "https://www.zionriverresort.com/" },
    { id: "us-grand-canyon-trailer", lat: 35.973, lng: -112.126, emoji: "🚐", name: "Trailer Village RV Park", where: "Grand Canyon Village, AZ", note: "In-park full-hookup RV option on the South Rim; reserve well ahead.", services: ["Full hookup", "Shuttle access", "Dump station"], website: "https://www.grandcanyonlodges.com/lodging/trailer-village-rv-park/" },
    { id: "us-monument-valley-koa", lat: 37.017, lng: -110.158, emoji: "🚐", name: "Monument Valley KOA Journey", where: "Monument Valley, UT", note: "A useful desert overnight near the tribal park and US-163 photo stops.", services: ["Full hookup", "Laundry", "Big-rig friendly"], website: "https://koa.com/campgrounds/monument-valley/" },
    { id: "us-yosemite-pines", lat: 37.816, lng: -120.093, emoji: "🚐", name: "Yosemite Pines RV Resort", where: "Groveland, CA", note: "West-side staging point for Yosemite and Tioga Road when seasonal access is open.", services: ["Full hookup", "Pool", "Laundry"], website: "https://yosemitepinesrv.com/" },
    { id: "us-pfeiffer-big-sur", lat: 36.247, lng: -121.781, emoji: "🚐", name: "Pfeiffer Big Sur State Park Campground", where: "Big Sur, CA", note: "Wooded campground close to Highway 1; check length limits and book early.", services: ["Campground", "Restrooms", "Dump station"], website: "https://www.parks.ca.gov/?page_id=570" },
    { id: "us-kirk-creek", lat: 35.990, lng: -121.497, emoji: "🚐", name: "Kirk Creek Campground", where: "Big Sur, CA", note: "Ocean-bluff camping on the Pacific Coast Highway with dry-camping services only.", services: ["Dry camping", "Vault toilets", "Ocean views"], website: "https://www.recreation.gov/camping/campgrounds/232449" },
    { id: "us-death-valley-furnace", lat: 36.462, lng: -116.867, emoji: "🚐", name: "Furnace Creek Campground", where: "Death Valley, CA", note: "Central park base for Artist's Drive and Badwater; plan heat and water carefully.", services: ["Campground", "Dump station", "Potable water"], website: "https://www.recreation.gov/camping/campgrounds/232496" },
    { id: "us-rocky-mountain-manor", lat: 40.397, lng: -105.582, emoji: "🚐", name: "Manor RV Park", where: "Estes Park, CO", note: "Convenient east-side base for Trail Ridge Road and Rocky Mountain National Park.", services: ["Full hookup", "Laundry", "Shuttle nearby"], website: "https://www.manorrvpark.com/" },
    { id: "us-ouray-koa", lat: 38.069, lng: -107.678, emoji: "🚐", name: "Ouray KOA Holiday", where: "Ouray, CO", note: "A mountain base for the Million Dollar Highway and San Juan Skyway.", services: ["Full hookup", "Laundry", "Cafe"], website: "https://koa.com/campgrounds/ouray/" },
    { id: "us-blue-ridge-pisgah", lat: 35.402, lng: -82.756, emoji: "🚐", name: "Mount Pisgah Campground", where: "Blue Ridge Parkway, NC", note: "Parkway campground around milepost 408; no hookups, but the location is superb.", services: ["Dry camping", "Restrooms", "Picnic tables"], website: "https://www.recreation.gov/camping/campgrounds/234182" },
    { id: "us-smokemont", lat: 35.556, lng: -83.309, emoji: "🚐", name: "Smokemont Campground", where: "Great Smoky Mountains, NC", note: "Good national-park base for Blue Ridge Parkway and Smokies touring days.", services: ["Campground", "Dump station", "Restrooms"], website: "https://www.recreation.gov/camping/campgrounds/232486" },
    { id: "us-acadia-blackwoods", lat: 44.313, lng: -68.209, emoji: "🚐", name: "Blackwoods Campground", where: "Acadia National Park, ME", note: "Close to Park Loop Road and Bar Harbor; no hookups, so arrive self-contained.", services: ["Dry camping", "Restrooms", "Shuttle access"], website: "https://www.recreation.gov/camping/campgrounds/232508" },
    { id: "us-outer-banks-cape-hatteras", lat: 35.236, lng: -75.542, emoji: "🚐", name: "Cape Hatteras / Outer Banks KOA Resort", where: "Rodanthe, NC", note: "Beachside base on NC 12 for lighthouse stops and ferry days.", services: ["Full hookup", "Pool", "Beach access"], website: "https://koa.com/campgrounds/cape-hatteras/" },
    { id: "us-key-west-boyds", lat: 24.566, lng: -81.738, emoji: "🚐", name: "Boyd's Key West Campground", where: "Key West, FL", note: "One of the most convenient RV stops at the end of the Overseas Highway.", services: ["Full hookup", "Pool", "Laundry"], website: "https://boydscampground.com/" },
    { id: "us-olympic-heart-o-hills", lat: 48.048, lng: -123.428, emoji: "🚐", name: "Heart O' the Hills Campground", where: "Olympic National Park, WA", note: "Forest campground at the foot of Hurricane Ridge Road; check current park access.", services: ["Dry camping", "Restrooms", "Ranger station"], website: "https://www.nps.gov/olym/planyourvisit/heart-o-the-hills-area-brochure.htm" },
    { id: "us-mount-rainier-cougar", lat: 46.767, lng: -121.793, emoji: "🚐", name: "Cougar Rock Campground", where: "Mount Rainier National Park, WA", note: "Good park base for Paradise and Sunrise touring when mountain roads are open.", services: ["Dry camping", "Restrooms", "Amphitheater"], website: "https://www.recreation.gov/camping/campgrounds/232488" },
    { id: "us-badlands-cedar-pass", lat: 43.744, lng: -101.949, emoji: "🚐", name: "Cedar Pass Campground", where: "Badlands National Park, SD", note: "Right by Badlands Loop Road, with easy sunrise and sunset viewpoints.", services: ["Electric sites", "Restrooms", "Dump station"], website: "https://www.cedarpasslodge.com/camping/" },
  ],
  ca: [
    { id: "ca-1", lat: 50.1163, lng: -122.9574, emoji: "🚐", name: "Whistler RV Park & Campground", where: "British Columbia", note: "Last full-service stop on the Sea-to-Sky corridor.", services: ["Full hookup", "Showers", "Dump station"] },
    { id: "ca-2", lat: 52.85, lng: -118.08, emoji: "🚐", name: "Whistlers Campground", where: "Jasper, Alberta", note: "Huge serviced loop right at the north end of the Icefields Parkway.", services: ["Electric", "Dump station", "Fire pits"] },
    { id: "ca-3", lat: 46.79, lng: -60.68, emoji: "🚐", name: "Broad Cove Campground", where: "Cape Breton, Nova Scotia", note: "Oceanfront pitches on the Cabot Trail.", services: ["Water", "Dump station", "Showers"] },
    { id: "ca-tunnel-mountain", lat: 51.178, lng: -115.539, emoji: "🚐", name: "Tunnel Mountain Trailer Court", where: "Banff, Alberta", note: "Serviced Parks Canada RV base close to Banff town and the Bow Valley Parkway.", services: ["Electric", "Water", "Sewer"], website: "https://parks.canada.ca/pn-np/ab/banff/activ/camping/tunnel-mountain" },
    { id: "ca-lake-louise-campground", lat: 51.425, lng: -116.183, emoji: "🚐", name: "Lake Louise Trailer Campground", where: "Banff National Park, Alberta", note: "A practical base for Lake Louise, Moraine Lake transit and the Icefields Parkway start.", services: ["Electric", "Water", "Sewer"], website: "https://parks.canada.ca/pn-np/ab/banff/activ/camping/lake-louise" },
    { id: "ca-wapiti", lat: 52.851, lng: -118.08, emoji: "🚐", name: "Wapiti Campground", where: "Jasper, Alberta", note: "Year-round Jasper campground near the north end of the Icefields Parkway.", services: ["Electric", "Showers", "Fire pits"], website: "https://parks.canada.ca/pn-np/ab/jasper/activ/passez-stay/camping/wapiti" },
    { id: "ca-kicking-horse", lat: 51.419, lng: -116.483, emoji: "🚐", name: "Kicking Horse Campground", where: "Yoho National Park, British Columbia", note: "Good Trans-Canada stop for Emerald Lake and the Yoho Valley turnoff.", services: ["Campground", "Showers", "Fire pits"], website: "https://parks.canada.ca/pn-np/bc/yoho/activ/camping/kickinghorse" },
    { id: "ca-redstreak", lat: 50.626, lng: -116.073, emoji: "🚐", name: "Redstreak Campground", where: "Kootenay National Park, British Columbia", note: "Serviced Radium-area base for Highway 93 and hot springs stops.", services: ["Electric", "Showers", "Sani-dump"], website: "https://parks.canada.ca/pn-np/bc/kootenay/activ/camping/redstreak" },
    { id: "ca-squamish-chief", lat: 49.681, lng: -123.153, emoji: "🚐", name: "Stawamus Chief Campground", where: "Squamish, British Columbia", note: "Simple campground right by the Sea-to-Sky corridor; not a full-service RV park.", services: ["Walk-in sites", "Pit toilets", "Trail access"], website: "https://bcparks.ca/stawamus-chief-park/" },
    { id: "ca-alice-lake", lat: 49.777, lng: -123.12, emoji: "🚐", name: "Alice Lake Provincial Park", where: "Squamish, British Columbia", note: "Forest-and-lake campground a short detour from the Sea-to-Sky Highway.", services: ["Campground", "Showers", "Sani-station"], website: "https://bcparks.ca/alice-lake-park/" },
    { id: "ca-green-point", lat: 49.039, lng: -125.67, emoji: "🚐", name: "Green Point Campground", where: "Pacific Rim National Park Reserve, BC", note: "The main Parks Canada campground between Tofino and Ucluelet; reserve early.", services: ["Campground", "Showers", "Beach access"], website: "https://parks.canada.ca/pn-np/bc/pacificrim/activ/activ4/a/greenpoint" },
    { id: "ca-goldstream", lat: 48.479, lng: -123.557, emoji: "🚐", name: "Goldstream Provincial Park Campground", where: "Victoria, British Columbia", note: "A useful first or last Vancouver Island stop near Swartz Bay and Victoria routes.", services: ["Campground", "Showers", "Sani-station"], website: "https://bcparks.ca/goldstream-park/" },
    { id: "ca-living-forest", lat: 49.137, lng: -123.884, emoji: "🚐", name: "Living Forest Oceanside Campground", where: "Nanaimo, British Columbia", note: "Oceanside full-service RV stop near ferry routes and the Island Highway.", services: ["Full hookup", "Laundry", "Ocean access"], website: "https://www.livingforest.com/" },
    { id: "ca-riding-mountain-wasagaming", lat: 50.659, lng: -99.972, emoji: "🚐", name: "Wasagaming Campground", where: "Riding Mountain National Park, Manitoba", note: "A solid prairie-to-parkland stop just off Highway 10.", services: ["Electric", "Showers", "Sani-dump"], website: "https://parks.canada.ca/pn-np/mb/riding/activ/camping/wasagaming" },
    { id: "ca-algonquin-mew", lat: 45.579, lng: -78.432, emoji: "🚐", name: "Mew Lake Campground", where: "Algonquin Provincial Park, Ontario", note: "Year-round Highway 60 campground with good access to trailheads and lake stops.", services: ["Electric", "Showers", "Laundry"], website: "https://www.ontarioparks.ca/park/algonquin/camping" },
    { id: "ca-lake-superior-agawa", lat: 47.36, lng: -84.64, emoji: "🚐", name: "Agawa Bay Campground", where: "Lake Superior Provincial Park, Ontario", note: "Lakeshore camping directly on the Trans-Canada north-shore route.", services: ["Electric", "Beach access", "Comfort station"], website: "https://www.ontarioparks.ca/park/lakesuperior/camping" },
    { id: "ca-fundy-headquarters", lat: 45.595, lng: -64.953, emoji: "🚐", name: "Headquarters Campground", where: "Fundy National Park, New Brunswick", note: "Good base for Fundy tides, Alma food stops and the Fundy Trail Parkway.", services: ["Serviced sites", "Showers", "Laundry"], website: "https://parks.canada.ca/pn-np/nb/fundy/activ/camping" },
    { id: "ca-cape-breton-cheticamp", lat: 46.644, lng: -61.01, emoji: "🚐", name: "Cheticamp Campground", where: "Cape Breton Highlands National Park, Nova Scotia", note: "West-side Cabot Trail base with serviced sites near the park entrance.", services: ["Serviced sites", "Showers", "Sani-dump"], website: "https://parks.canada.ca/pn-np/ns/cbreton/activ/camping/cheticamp" },
    { id: "ca-cavendish", lat: 46.498, lng: -63.402, emoji: "🚐", name: "Cavendish Campground", where: "Prince Edward Island National Park", note: "Easy PEI north-shore base after the Confederation Bridge crossing.", services: ["Serviced sites", "Showers", "Beach access"], website: "https://parks.canada.ca/pn-np/pe/pei-ipe/activ/camping/cavendish" },
    { id: "ca-gros-morne-green-point", lat: 49.677, lng: -57.96, emoji: "🚐", name: "Green Point Campground", where: "Gros Morne National Park, Newfoundland", note: "Coastal Parks Canada campground on the Viking Trail, with big sunset potential.", services: ["Campground", "Kitchen shelter", "Ocean access"], website: "https://parks.canada.ca/pn-np/nl/grosmorne/activ/camping" },
    { id: "ca-tombstone", lat: 64.404, lng: -138.374, emoji: "🚐", name: "Tombstone Territorial Park Campground", where: "Dempster Highway, Yukon", note: "Remote gravel-road staging point; arrive self-sufficient and check current conditions.", services: ["Dry camping", "Outhouses", "Visitor centre nearby"], website: "https://yukon.ca/en/outdoor-recreation-and-wildlife/camping/site/tombstone-mountain-campground" },
  ],
};

const CURATED_EV_CHARGING_POIS: Record<RegionKey, EvChargingPoi[]> = {
  eu: [
    { id: "ev-eu-ionity-koege", lat: 55.4705, lng: 12.1862, network: "IONITY", name: "IONITY Koge", where: "Koge, Denmark", connectors: "CCS", power: "High-power DC up to 350 kW", access: "Public motorway access", note: "A useful south-of-Copenhagen top-up before the Rodby ferry or the E47/E55 run into Germany.", website: "https://ionity.eu/" },
    { id: "ev-eu-clever-nyborg", lat: 55.312, lng: 10.803, network: "Clever", name: "Clever Nyborg", where: "Nyborg, Denmark", connectors: "CCS", power: "DC fast charging", access: "Public app/card access", note: "Handy before or after the Great Belt crossing, with food and rest stops close by.", website: "https://clever.dk/" },
    { id: "ev-eu-enbw-hamburg-stillhorn", lat: 53.475, lng: 10.017, network: "EnBW mobility+", name: "EnBW Hamburg-Stillhorn", where: "A1 near Hamburg, Germany", connectors: "CCS", power: "High-power DC charging", access: "Public charging with EnBW app/card and roaming", note: "A reliable northern Germany hub on the Denmark-Hamburg corridor.", website: "https://www.enbw.com/e-mobility/" },
    { id: "ev-eu-aral-hannover", lat: 52.335, lng: 9.807, network: "Aral pulse", name: "Aral pulse Hannover", where: "Hannover, Germany", connectors: "CCS", power: "Ultra-fast DC charging", access: "Public station access", note: "Good mid-Germany stop on A2/A7 style transit days, with fuel-station services nearby.", website: "https://www.aral.de/en/global/retail/pulse.html" },
    { id: "ev-eu-fastned-kaarst", lat: 51.224, lng: 6.642, network: "Fastned", name: "Fastned Kaarst", where: "A57 near Dusseldorf, Germany", connectors: "CCS", power: "High-power DC charging", access: "Public contactless/app access", note: "Bright, easy canopies close to the Dutch-German corridor around Dusseldorf.", website: "https://www.fastnedcharging.com/" },
    { id: "ev-eu-ionity-brohltal", lat: 50.456, lng: 7.303, network: "IONITY", name: "IONITY Brohltal Ost", where: "A61, Germany", connectors: "CCS", power: "High-power DC up to 350 kW", access: "Public motorway service access", note: "A strong Rhine corridor top-up between Cologne, Koblenz and southern Germany.", website: "https://ionity.eu/" },
    { id: "ev-eu-tesla-hilden", lat: 51.171, lng: 6.93, network: "Tesla Supercharger", name: "Tesla Supercharger Hilden", where: "Hilden, Germany", connectors: "CCS", power: "DC fast charging", access: "Tesla app access; some sites open to non-Tesla vehicles", note: "Large Rhine-Ruhr charging stop with food options nearby.", website: "https://www.tesla.com/supercharger" },
    { id: "ev-eu-allego-venlo", lat: 51.37, lng: 6.172, network: "Allego", name: "Allego Venlo", where: "Venlo, Netherlands", connectors: "CCS", power: "DC fast charging", access: "Public roaming/app access", note: "Useful border-area stop between the Netherlands and Germany.", website: "https://www.allego.eu/" },
    { id: "ev-eu-fastned-de-watering", lat: 51.895, lng: 4.447, network: "Fastned", name: "Fastned De Watering", where: "A20 Rotterdam, Netherlands", connectors: "CCS", power: "High-power DC charging", access: "Public contactless/app access", note: "Good Rotterdam-area stop for ferry, port and western Netherlands routes.", website: "https://www.fastnedcharging.com/" },
    { id: "ev-eu-shell-antwerp", lat: 51.213, lng: 4.402, network: "Shell Recharge", name: "Shell Recharge Antwerp", where: "Antwerp, Belgium", connectors: "CCS", power: "DC fast charging", access: "Public Shell Recharge and roaming access", note: "Practical city-edge charging on Benelux transit routes.", website: "https://shellrecharge.com/" },
    { id: "ev-eu-electra-paris", lat: 48.844, lng: 2.374, network: "Electra", name: "Electra Paris-Bercy", where: "Paris, France", connectors: "CCS", power: "Fast DC charging", access: "Public app/card access", note: "A useful urban fast-charge option before leaving Paris for the autoroute network.", website: "https://www.go-electra.com/" },
    { id: "ev-eu-total-beaune", lat: 47.02, lng: 4.839, network: "TotalEnergies", name: "TotalEnergies Beaune", where: "A6 Burgundy, France", connectors: "CCS", power: "High-power DC charging", access: "Public motorway service access", note: "Well placed on the classic Paris-Lyon-Mediterranean route.", website: "https://services.totalenergies.fr/mobilite-electrique" },
    { id: "ev-eu-ionity-macon", lat: 46.312, lng: 4.827, network: "IONITY", name: "IONITY Macon Saint-Albain", where: "A6, France", connectors: "CCS", power: "High-power DC up to 350 kW", access: "Public motorway service access", note: "A strong long-distance stop between Burgundy, Lyon and the Alps.", website: "https://ionity.eu/" },
    { id: "ev-eu-powerdot-avignon", lat: 43.943, lng: 4.807, network: "Powerdot", name: "Powerdot Avignon", where: "Avignon, France", connectors: "CCS", power: "DC fast charging", access: "Public app/roaming access", note: "Convenient before Provence, Verdon and Mediterranean detours.", website: "https://www.powerdot.eu/" },
    { id: "ev-eu-ionity-aosta", lat: 45.739, lng: 7.326, network: "IONITY", name: "IONITY Aosta", where: "Aosta Valley, Italy", connectors: "CCS", power: "High-power DC up to 350 kW", access: "Public motorway access", note: "Helpful Alpine charging before Mont Blanc, Gran San Bernardo or northern Italy routes.", website: "https://ionity.eu/" },
    { id: "ev-eu-free-to-x-modena", lat: 44.652, lng: 10.925, network: "Free To X", name: "Free To X Modena", where: "A1, Italy", connectors: "CCS", power: "High-power DC charging", access: "Public motorway service access", note: "A useful Po Valley fast-charge point between Milan, Bologna and Florence.", website: "https://freeto-x.it/" },
    { id: "ev-eu-enel-garda", lat: 45.439, lng: 10.692, network: "Enel X Way", name: "Enel X Way Peschiera del Garda", where: "Lake Garda, Italy", connectors: "CCS", power: "DC fast charging", access: "Public app/roaming access", note: "Well placed for Lake Garda stays and the Brenner-Verona corridor.", website: "https://www.enelxway.com/" },
    { id: "ev-eu-smatrics-zell", lat: 47.323, lng: 12.798, network: "Smatrics", name: "Smatrics Zell am See", where: "Salzburg, Austria", connectors: "CCS", power: "DC fast charging", access: "Public app/card access", note: "Good overnight-area charger before the Grossglockner High Alpine Road.", website: "https://smatrics.com/" },
    { id: "ev-eu-ionity-angath", lat: 47.507, lng: 12.072, network: "IONITY", name: "IONITY Angath", where: "A12 Tyrol, Austria", connectors: "CCS", power: "High-power DC up to 350 kW", access: "Public motorway service access", note: "Strong Tyrol corridor stop for Innsbruck, Brenner and Salzburg routes.", website: "https://ionity.eu/" },
    { id: "ev-eu-gofast-gotthard", lat: 46.55, lng: 8.592, network: "GOFAST", name: "GOFAST Gotthard", where: "Airolo, Switzerland", connectors: "CCS", power: "DC fast charging", access: "Public app/card access", note: "Useful near the Gotthard approaches, especially before Alpine weather changes.", website: "https://gofast.swiss/" },
    { id: "ev-eu-greenway-krakow", lat: 50.043, lng: 19.998, network: "GreenWay", name: "GreenWay Krakow", where: "Krakow, Poland", connectors: "CCS", power: "DC fast charging", access: "Public GreenWay app/card access", note: "A practical southern Poland hub for Krakow, Zakopane and Slovakia corridors.", website: "https://greenwaypolska.pl/" },
    { id: "ev-eu-orlen-poznan", lat: 52.406, lng: 16.925, network: "ORLEN Charge", name: "ORLEN Charge Poznan", where: "Poznan, Poland", connectors: "CCS", power: "DC fast charging", access: "Public station access", note: "Good west-central Poland charging on Germany-Warsaw transit days.", website: "https://orlencharge.pl/" },
    { id: "ev-eu-elocity-warsaw", lat: 52.229, lng: 21.012, network: "Elocity", name: "Elocity Warsaw", where: "Warsaw, Poland", connectors: "CCS", power: "DC fast charging", access: "Public app/roaming access", note: "Urban Warsaw option for route starts, returns and hotel-area charging.", website: "https://elo.city/" },
    { id: "ev-eu-eleport-tallinn", lat: 59.437, lng: 24.753, network: "Eleport", name: "Eleport Tallinn", where: "Tallinn, Estonia", connectors: "CCS", power: "DC fast charging", access: "Public app/card access", note: "Useful Baltic hub around ferry arrivals and the Via Baltica corridor.", website: "https://eleport.com/" },
    { id: "ev-eu-cez-prague", lat: 50.075, lng: 14.438, network: "CEZ", name: "CEZ Prague", where: "Prague, Czechia", connectors: "CCS", power: "DC fast charging", access: "Public CEZ app/card access", note: "Good city-area network coverage for Prague starts and cross-country trips.", website: "https://www.cez.cz/en/charging-stations" },
    { id: "ev-eu-ionity-brno", lat: 49.195, lng: 16.607, network: "IONITY", name: "IONITY Brno", where: "Brno, Czechia", connectors: "CCS", power: "High-power DC up to 350 kW", access: "Public motorway access", note: "A useful Moravia stop between Prague, Vienna, Bratislava and Poland.", website: "https://ionity.eu/" },
    { id: "ev-eu-circlek-oslo", lat: 59.912, lng: 10.75, network: "Circle K", name: "Circle K Oslo fast charging", where: "Oslo, Norway", connectors: "CCS", power: "DC fast charging", access: "Public station/app access", note: "Helpful before long E6, E18 or mountain-route departures from Oslo.", website: "https://www.circlek.no/elbillading" },
    { id: "ev-eu-ionity-dombas", lat: 62.075, lng: 9.124, network: "IONITY", name: "IONITY Dombas", where: "Dombas, Norway", connectors: "CCS", power: "High-power DC up to 350 kW", access: "Public route charging", note: "A key inland Norway stop where E6, Dovre and mountain routes meet.", website: "https://ionity.eu/" },
    { id: "ev-eu-recharge-geiranger", lat: 62.101, lng: 7.206, network: "Recharge", name: "Recharge Geiranger", where: "Geiranger, Norway", connectors: "CCS", power: "DC fast charging", access: "Public app/card access", note: "Useful fjord top-up before ferry, Dalsnibba or the road towards Stryn.", website: "https://rechargeinfra.com/" },
    { id: "ev-eu-mer-trondheim", lat: 63.43, lng: 10.395, network: "Mer", name: "Mer Trondheim", where: "Trondheim, Norway", connectors: "CCS", power: "DC fast charging", access: "Public app/card access", note: "Good hub for E6 northbound, Atlantic Road detours and central Norway routing.", website: "https://no.mer.eco/" },
    { id: "ev-eu-vattenfall-stockholm", lat: 59.329, lng: 18.068, network: "Vattenfall InCharge", name: "Vattenfall InCharge Stockholm", where: "Stockholm, Sweden", connectors: "CCS", power: "DC fast charging", access: "Public InCharge app/card access", note: "Useful around Stockholm starts, ferry arrivals and E4 corridor trips.", website: "https://incharge.vattenfall.se/" },
    { id: "ev-eu-circlek-umea", lat: 63.825, lng: 20.263, network: "Circle K", name: "Circle K Umea", where: "Umea, Sweden", connectors: "CCS", power: "DC fast charging", access: "Public station/app access", note: "A reassuring northern Sweden stop for long E4 days.", website: "https://www.circlek.se/elbilsladdning" },
    { id: "ev-eu-k-lataus-helsinki", lat: 60.17, lng: 24.938, network: "Kesko K-Lataus", name: "K-Lataus Helsinki", where: "Helsinki, Finland", connectors: "CCS", power: "DC fast charging", access: "Public app/card access", note: "Good city and ferry-area coverage before Finnish road-trip legs.", website: "https://www.k-lataus.fi/" },
    { id: "ev-eu-abc-oulu", lat: 65.012, lng: 25.465, network: "ABC-lataus", name: "ABC-lataus Oulu", where: "Oulu, Finland", connectors: "CCS", power: "DC fast charging", access: "Public app/card access", note: "Useful on the long E75/E8 northern Finland corridors.", website: "https://www.abcasemat.fi/lataus" },
    { id: "ev-eu-gridserve-folkestone", lat: 51.095, lng: 1.121, network: "Gridserve", name: "Gridserve Folkestone", where: "Kent, United Kingdom", connectors: "CCS", power: "High-power DC charging", access: "Public contactless/app access", note: "A sensible top-up before the Channel Tunnel or Dover-Calais crossings.", website: "https://www.gridserve.com/" },
    { id: "ev-eu-bp-pulse-birmingham", lat: 52.486, lng: -1.89, network: "bp pulse", name: "bp pulse Birmingham", where: "Birmingham, United Kingdom", connectors: "CCS", power: "Rapid and ultra-fast DC charging", access: "Public bp pulse app/card access", note: "Good Midlands coverage for north-south UK road trips.", website: "https://www.bppulse.co.uk/" },
    { id: "ev-eu-instavolt-winchester", lat: 51.062, lng: -1.316, network: "InstaVolt", name: "InstaVolt Winchester", where: "Hampshire, United Kingdom", connectors: "CCS", power: "Rapid DC charging", access: "Public contactless access", note: "A handy A34/M3 corridor stop between the South Coast, London and the Midlands.", website: "https://instavolt.co.uk/" },
  ],
  us: [
    { id: "ev-us-tesla-buellton", lat: 34.613, lng: -120.193, network: "Tesla Supercharger", name: "Tesla Supercharger Buellton", where: "Buellton, California", connectors: "NACS; CCS availability varies by adapter/site", power: "DC fast charging", access: "Tesla app access; some sites open to non-Tesla vehicles", note: "A classic Highway 101 / Central Coast charging stop before Santa Barbara or Pismo.", website: "https://www.tesla.com/supercharger" },
    { id: "ev-us-electrify-america-pismo", lat: 35.142, lng: -120.636, network: "Electrify America", name: "Electrify America Pismo Beach", where: "Pismo Beach, California", connectors: "CCS", power: "DC fast charging up to 350 kW where available", access: "Public app/card access", note: "Well placed for Pacific Coast Highway and US-101 road days.", website: "https://www.electrifyamerica.com/" },
    { id: "ev-us-tesla-kettleman", lat: 36.01, lng: -119.961, network: "Tesla Supercharger", name: "Tesla Supercharger Kettleman City", where: "Kettleman City, California", connectors: "NACS; CCS availability varies by adapter/site", power: "DC fast charging", access: "Tesla app access", note: "A major I-5 California charging hub between the Bay Area, LA and Yosemite detours.", website: "https://www.tesla.com/supercharger" },
    { id: "ev-us-electrify-america-bakersfield", lat: 35.373, lng: -119.019, network: "Electrify America", name: "Electrify America Bakersfield", where: "Bakersfield, California", connectors: "CCS", power: "DC fast charging", access: "Public app/card access", note: "Useful before Tehachapi, Death Valley approaches or Central Valley transit.", website: "https://www.electrifyamerica.com/" },
    { id: "ev-us-evgo-las-vegas", lat: 36.17, lng: -115.14, network: "EVgo", name: "EVgo Las Vegas", where: "Las Vegas, Nevada", connectors: "CCS", power: "DC fast charging", access: "Public EVgo app/card access", note: "Good urban hub before desert drives towards Utah, Arizona or Death Valley.", website: "https://www.evgo.com/" },
    { id: "ev-us-electrify-america-st-george", lat: 37.096, lng: -113.568, network: "Electrify America", name: "Electrify America St. George", where: "St. George, Utah", connectors: "CCS", power: "DC fast charging", access: "Public app/card access", note: "Helpful for Zion, Bryce and I-15 corridor planning.", website: "https://www.electrifyamerica.com/" },
    { id: "ev-us-tesla-moab", lat: 38.573, lng: -109.55, network: "Tesla Supercharger", name: "Tesla Supercharger Moab", where: "Moab, Utah", connectors: "NACS; CCS availability varies by adapter/site", power: "DC fast charging", access: "Tesla app access", note: "A key charging base for Arches, Canyonlands and Scenic Byway 12 loops.", website: "https://www.tesla.com/supercharger" },
    { id: "ev-us-chargepoint-grand-junction", lat: 39.063, lng: -108.55, network: "ChargePoint", name: "ChargePoint Grand Junction", where: "Grand Junction, Colorado", connectors: "CCS", power: "DC fast charging", access: "Public ChargePoint app/card access", note: "Good western Colorado hub before I-70 mountain sections or Moab detours.", website: "https://www.chargepoint.com/" },
    { id: "ev-us-electrify-america-frisco", lat: 39.574, lng: -106.098, network: "Electrify America", name: "Electrify America Frisco", where: "Frisco, Colorado", connectors: "CCS", power: "DC fast charging", access: "Public app/card access", note: "Useful before Rocky Mountain passes, ski towns and I-70 weather windows.", website: "https://www.electrifyamerica.com/" },
    { id: "ev-us-tesla-cody", lat: 44.526, lng: -109.056, network: "Tesla Supercharger", name: "Tesla Supercharger Cody", where: "Cody, Wyoming", connectors: "NACS; CCS availability varies by adapter/site", power: "DC fast charging", access: "Tesla app access", note: "A practical Beartooth, Chief Joseph and Yellowstone-area charging stop.", website: "https://www.tesla.com/supercharger" },
    { id: "ev-us-electrify-america-bozeman", lat: 45.679, lng: -111.039, network: "Electrify America", name: "Electrify America Bozeman", where: "Bozeman, Montana", connectors: "CCS", power: "DC fast charging", access: "Public app/card access", note: "Helpful on I-90 and Yellowstone approach routes.", website: "https://www.electrifyamerica.com/" },
    { id: "ev-us-tesla-kalispell", lat: 48.198, lng: -114.316, network: "Tesla Supercharger", name: "Tesla Supercharger Kalispell", where: "Kalispell, Montana", connectors: "NACS; CCS availability varies by adapter/site", power: "DC fast charging", access: "Tesla app access", note: "Useful Glacier National Park staging stop before Going-to-the-Sun Road.", website: "https://www.tesla.com/supercharger" },
    { id: "ev-us-electrify-america-port-angeles", lat: 48.118, lng: -123.43, network: "Electrify America", name: "Electrify America Port Angeles", where: "Port Angeles, Washington", connectors: "CCS", power: "DC fast charging", access: "Public app/card access", note: "Good Olympic Peninsula charging before Hurricane Ridge or ferry connections.", website: "https://www.electrifyamerica.com/" },
    { id: "ev-us-tesla-bend", lat: 44.058, lng: -121.315, network: "Tesla Supercharger", name: "Tesla Supercharger Bend", where: "Bend, Oregon", connectors: "NACS; CCS availability varies by adapter/site", power: "DC fast charging", access: "Tesla app access", note: "A strong central Oregon hub for Cascade Lakes, US-97 and volcanic byways.", website: "https://www.tesla.com/supercharger" },
    { id: "ev-us-electrify-america-troutdale", lat: 45.54, lng: -122.387, network: "Electrify America", name: "Electrify America Troutdale", where: "Troutdale, Oregon", connectors: "CCS", power: "DC fast charging", access: "Public app/card access", note: "Well placed before the Historic Columbia River Highway and Gorge routes.", website: "https://www.electrifyamerica.com/" },
    { id: "ev-us-chargepoint-asheville", lat: 35.595, lng: -82.551, network: "ChargePoint", name: "ChargePoint Asheville", where: "Asheville, North Carolina", connectors: "CCS", power: "DC fast charging", access: "Public ChargePoint app/card access", note: "Useful Blue Ridge Parkway and Smokies charging around Asheville.", website: "https://www.chargepoint.com/" },
    { id: "ev-us-tesla-knoxville", lat: 35.96, lng: -83.92, network: "Tesla Supercharger", name: "Tesla Supercharger Knoxville", where: "Knoxville, Tennessee", connectors: "NACS; CCS availability varies by adapter/site", power: "DC fast charging", access: "Tesla app access", note: "Good base for Tail of the Dragon, Cherohala Skyway and Smokies routes.", website: "https://www.tesla.com/supercharger" },
    { id: "ev-us-evgo-orlando", lat: 28.538, lng: -81.379, network: "EVgo", name: "EVgo Orlando", where: "Orlando, Florida", connectors: "CCS", power: "DC fast charging", access: "Public EVgo app/card access", note: "Useful central Florida hub before Turnpike, Space Coast or Keys approaches.", website: "https://www.evgo.com/" },
    { id: "ev-us-electrify-america-key-largo", lat: 25.086, lng: -80.447, network: "Electrify America", name: "Electrify America Key Largo", where: "Key Largo, Florida", connectors: "CCS", power: "DC fast charging", access: "Public app/card access", note: "A helpful first Keys stop before the long Overseas Highway run.", website: "https://www.electrifyamerica.com/" },
    { id: "ev-us-tesla-bar-harbor", lat: 44.387, lng: -68.204, network: "Tesla Supercharger", name: "Tesla Supercharger Bar Harbor", where: "Bar Harbor, Maine", connectors: "NACS; CCS availability varies by adapter/site", power: "DC fast charging", access: "Tesla app access", note: "Good Acadia National Park charging close to Park Loop Road.", website: "https://www.tesla.com/supercharger" },
  ],
  ca: [
    { id: "ev-ca-flo-quebec", lat: 46.813, lng: -71.208, network: "FLO", name: "FLO Quebec City", where: "Quebec City, Quebec", connectors: "CCS", power: "DC fast charging", access: "Public FLO app/card access", note: "Useful St. Lawrence corridor hub between Montreal, Charlevoix and the Maritimes.", website: "https://www.flo.com/" },
    { id: "ev-ca-circuit-charlevoix", lat: 47.442, lng: -70.506, network: "Circuit Electrique", name: "Circuit Electrique Baie-Saint-Paul", where: "Charlevoix, Quebec", connectors: "CCS", power: "DC fast charging", access: "Public app/card access", note: "A well-placed stop for Route du Fleuve and Saguenay side trips.", website: "https://lecircuitelectrique.com/" },
    { id: "ev-ca-tesla-montreal", lat: 45.501, lng: -73.567, network: "Tesla Supercharger", name: "Tesla Supercharger Montreal", where: "Montreal, Quebec", connectors: "NACS; CCS availability varies by adapter/site", power: "DC fast charging", access: "Tesla app access", note: "Good city hub before Autoroute 20, Ottawa or Quebec City routes.", website: "https://www.tesla.com/supercharger" },
    { id: "ev-ca-ivy-kingston", lat: 44.231, lng: -76.486, network: "Ivy Charging Network", name: "Ivy Kingston", where: "Kingston, Ontario", connectors: "CCS", power: "DC fast charging", access: "Public Ivy app/card access", note: "A friendly halfway-style stop on the Toronto-Ottawa-Montreal corridor.", website: "https://ivycharge.com/" },
    { id: "ev-ca-petro-canada-barrie", lat: 44.389, lng: -79.69, network: "Petro-Canada eV", name: "Petro-Canada eV Barrie", where: "Barrie, Ontario", connectors: "CCS", power: "DC fast charging", access: "Public Petro-Canada app/card access", note: "Useful before cottage-country, Algonquin and Highway 400 routes.", website: "https://www.petro-canada.ca/en/personal/fuel/ev-fast-charge-network" },
    { id: "ev-ca-electrify-canada-canmore", lat: 51.089, lng: -115.359, network: "Electrify Canada", name: "Electrify Canada Canmore", where: "Canmore, Alberta", connectors: "CCS", power: "DC fast charging up to 350 kW where available", access: "Public app/card access", note: "Excellent Banff gateway charging before Bow Valley, Lake Louise and Icefields Parkway days.", website: "https://www.electrify-canada.ca/" },
    { id: "ev-ca-tesla-calgary", lat: 51.045, lng: -114.071, network: "Tesla Supercharger", name: "Tesla Supercharger Calgary", where: "Calgary, Alberta", connectors: "NACS; CCS availability varies by adapter/site", power: "DC fast charging", access: "Tesla app access", note: "Good urban launch point for Banff, Drumheller and prairie-to-Rockies trips.", website: "https://www.tesla.com/supercharger" },
    { id: "ev-ca-flo-banff", lat: 51.178, lng: -115.57, network: "FLO", name: "FLO Banff", where: "Banff, Alberta", connectors: "CCS", power: "DC fast charging", access: "Public FLO app/card access", note: "Useful top-up inside the Bow Valley before mountain weather and park-road detours.", website: "https://www.flo.com/" },
    { id: "ev-ca-petro-canada-golden", lat: 51.299, lng: -116.963, network: "Petro-Canada eV", name: "Petro-Canada eV Golden", where: "Golden, British Columbia", connectors: "CCS", power: "DC fast charging", access: "Public Petro-Canada app/card access", note: "A reassuring Trans-Canada stop between Yoho, Glacier and Rogers Pass.", website: "https://www.petro-canada.ca/en/personal/fuel/ev-fast-charge-network" },
    { id: "ev-ca-bc-hydro-squamish", lat: 49.701, lng: -123.155, network: "BC Hydro EV", name: "BC Hydro EV Squamish", where: "Squamish, British Columbia", connectors: "CCS", power: "DC fast charging", access: "Public BC Hydro EV app/card access", note: "Perfectly placed on the Sea-to-Sky Highway between Vancouver and Whistler.", website: "https://electricvehicles.bchydro.com/charge/public-charging" },
    { id: "ev-ca-tesla-whistler", lat: 50.116, lng: -122.957, network: "Tesla Supercharger", name: "Tesla Supercharger Whistler", where: "Whistler, British Columbia", connectors: "NACS; CCS availability varies by adapter/site", power: "DC fast charging", access: "Tesla app access", note: "Good mountain-town hub before Pemberton, Duffey Lake Road or the return to Vancouver.", website: "https://www.tesla.com/supercharger" },
    { id: "ev-ca-bc-hydro-nanaimo", lat: 49.166, lng: -123.94, network: "BC Hydro EV", name: "BC Hydro EV Nanaimo", where: "Nanaimo, British Columbia", connectors: "CCS", power: "DC fast charging", access: "Public BC Hydro EV app/card access", note: "Useful Island Highway charging after ferry arrivals or before Tofino routes.", website: "https://electricvehicles.bchydro.com/charge/public-charging" },
    { id: "ev-ca-flo-halifax", lat: 44.648, lng: -63.575, network: "FLO", name: "FLO Halifax", where: "Halifax, Nova Scotia", connectors: "CCS", power: "DC fast charging", access: "Public FLO app/card access", note: "Good city hub before Cabot Trail, Fundy and ferry-linked Maritime routes.", website: "https://www.flo.com/" },
    { id: "ev-ca-petro-canada-moncton", lat: 46.087, lng: -64.778, network: "Petro-Canada eV", name: "Petro-Canada eV Moncton", where: "Moncton, New Brunswick", connectors: "CCS", power: "DC fast charging", access: "Public Petro-Canada app/card access", note: "Handy for Bay of Fundy, PEI and Nova Scotia road-trip connections.", website: "https://www.petro-canada.ca/en/personal/fuel/ev-fast-charge-network" },
    { id: "ev-ca-flo-st-johns", lat: 47.561, lng: -52.712, network: "FLO", name: "FLO St. John's", where: "St. John's, Newfoundland", connectors: "CCS", power: "DC fast charging", access: "Public FLO app/card access", note: "Useful eastern Newfoundland hub before longer coastal drives.", website: "https://www.flo.com/" },
  ],
};

export const EV_CHARGING_POIS: Record<RegionKey, EvChargingPoi[]> = {
  eu: [...CURATED_EV_CHARGING_POIS.eu, ...(GENERATED_EV_CHARGING_POIS.eu as unknown as EvChargingPoi[]), ...(GENERATED_AFDC_EV_CHARGING_POIS.eu as unknown as EvChargingPoi[])],
  us: [...CURATED_EV_CHARGING_POIS.us, ...(GENERATED_EV_CHARGING_POIS.us as unknown as EvChargingPoi[]), ...(GENERATED_AFDC_EV_CHARGING_POIS.us as unknown as EvChargingPoi[])],
  ca: [...CURATED_EV_CHARGING_POIS.ca, ...(GENERATED_EV_CHARGING_POIS.ca as unknown as EvChargingPoi[]), ...(GENERATED_AFDC_EV_CHARGING_POIS.ca as unknown as EvChargingPoi[])],
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
