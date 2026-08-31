import type { FlagCode } from "@/components/FlagIcon";

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
  { code: "de", flag: "DE", label: "Deutsch" },
  { code: "nl", flag: "NL", label: "Nederlands" },
  { code: "fr", flag: "FR", label: "Français" },
  { code: "pl", flag: "PL", label: "Polski" },
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

export function regionFromPath(pathname: string): RegionKey {
  if (pathname.startsWith("/us")) return "us";
  if (pathname.startsWith("/ca")) return "ca";
  return "eu";
}

export const REGION_COPY: Record<
  RegionKey,
  { eyebrow: string; currency: string; originHint: string; destinationHint: string }
> = {
  eu: {
    eyebrow: "Europe · 30+ countries",
    currency: "€",
    originHint: "Start city or landmark (e.g., Munich, Oslo, Seattle)",
    destinationHint: "Where are you heading? (e.g., Amalfi Coast, Banff, Miami)",
  },
  us: {
    eyebrow: "United States · 50 states",
    currency: "$",
    originHint: "Start city or landmark (e.g., Seattle, Denver, Miami)",
    destinationHint: "Where are you heading? (e.g., Big Sur, Moab, Key West)",
  },
  ca: {
    eyebrow: "Canada · coast to coast",
    currency: "C$",
    originHint: "Start city or landmark (e.g., Toronto, Calgary, Halifax)",
    destinationHint: "Where are you heading? (e.g., Banff, Tofino, Gaspésie)",
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
};

export type SafetySection = { heading: string; items: string[] };

export type TripEstimate = {
  currency: string;
  units: "metric" | "imperial";
  distanceLabel: string;
  budget: number;
  distanceKm: number;
  driveTime: string;
  tolls: number;
  ferries: number;
  energyCost: number;
  energyLabel: string;
  energyAmount: string;
  segments: { country: string; total: number; lines: TollLine[] }[];
  safety: { title: string; sections: SafetySection[] };
  optimizer: EnergyOptimizer;
  discountNote?: string | undefined;
};

export type ChargingStop = {
  name: string;
  atKm: number;
  atLabel: string;
  power: string;
  networks: string[];
  note: string;
};

export type EnergyOptimizer = {
  mode: "ev" | "fuel";
  title: string;
  rangeLabel: string;
  bufferLabel: string;
  stops: ChargingStop[];
  networks: string[];
  arbitrage: string[];
  longStretch: string[];
};

const STOP_NAMES: Record<RegionKey, string[]> = {
  eu: [
    "Kassel Nord Rasthof",
    "Nürnberg Feucht Park",
    "Innsbruck Ost",
    "Trento Nord Hub",
    "Bologna Cantagallo",
  ],
  us: [
    "Breezewood Travel Plaza",
    "Wytheville Crossroads",
    "Cordele I-75 Hub",
    "Ocala Service Plaza",
    "Fort Pierce Plaza",
  ],
  ca: [
    "Kingston ONroute",
    "Port Hope ONroute",
    "Parry Sound Hub",
    "Sault Ste. Marie",
    "Thunder Bay Terminal",
  ],
};

const EV_NETWORKS: Record<RegionKey, string[]> = {
  eu: ["Ionity", "Fastned", "Tesla Supercharger", "Allego"],
  us: ["Electrify America", "Tesla Supercharger", "EVgo"],
  ca: ["FLO", "Tesla Supercharger", "Petro-Canada eV", "Electrify Canada"],
};

const ARBITRAGE: Record<RegionKey, string[]> = {
  eu: [
    "Fuel is ~15% cheaper in Austria than Italy — refuel before crossing the Brenner Pass.",
    "Luxembourg is the cheapest tank in Western Europe — top up before entering Belgium or France.",
    "Diesel in Norway runs well above Swedish prices — fill near the border at Svinesund.",
  ],
  us: [
    "Fuel in Georgia is ~20% cheaper than Florida — fill up before the state line on I-95.",
    "Skip turnpike service plazas: prices run 10–15% above exits one mile off the highway.",
    "California is the most expensive tank on the West Coast — fill in Nevada or Arizona first.",
  ],
  ca: [
    "Alberta fuel is ~20% cheaper than British Columbia — fill before Kicking Horse Pass.",
    "Québec charges more per litre than Ontario — top up before the provincial border on the 417.",
    "Northern Ontario pumps run a premium — refuel in Sault Ste. Marie before Highway 17.",
  ],
};

const LONG_STRETCH: Record<RegionKey, string[]> = {
  eu: [
    "Sognefjell (RV55), Norway — 194 km without a verified 24/7 station. Fill in Lom.",
    "Grossglockner High Alpine Road — 186 km loop with no fuel above the toll gate.",
  ],
  us: [
    "US-50 “Loneliest Road”, Nevada — 226 km between verified stations. Fill in Ely.",
    "I-10 Van Horn → Fort Stockton, Texas — 190 km with limited overnight service.",
  ],
  ca: [
    "Highway 17 Wawa → White River — 198 km with no verified overnight fuel.",
    "Icefields Parkway, Alberta — 232 km between Lake Louise and Jasper; Saskatchewan Crossing only.",
  ],
};

function buildOptimizer(
  region: RegionKey,
  vehicle: VehicleKey,
  fuel: FuelKey,
  distanceKm: number,
  imperial: boolean,
): EnergyOptimizer {
  const isEv = fuel === "electric";
  const tank = vehicle === "motorhome" ? 90 : vehicle === "motorcycle" ? 18 : 55;
  const battery = vehicle === "motorhome" ? 90 : vehicle === "motorcycle" ? 21 : 77;
  const consumption = vehicle === "motorhome" ? 11.5 : vehicle === "motorcycle" ? 4.8 : 6.6;
  const kwhPer100 = vehicle === "motorhome" ? 28 : vehicle === "motorcycle" ? 12 : 18;

  const fullRange = isEv ? (battery / kwhPer100) * 100 : (tank / consumption) * 100;
  const safeRange = fullRange * 0.75;
  const stopCount = Math.max(1, Math.min(5, Math.ceil(distanceKm / safeRange) - 1));

  const d = (km: number) =>
    imperial
      ? `${Math.round(km * 0.621371).toLocaleString("en-US")} mi`
      : `${Math.round(km).toLocaleString("en-GB")} km`;

  const networks = EV_NETWORKS[region];
  const stops: ChargingStop[] = Array.from({ length: stopCount }, (_, i) => {
    const atKm = Math.round(safeRange * (i + 1));
    return {
      name: STOP_NAMES[region][i % STOP_NAMES[region].length]!,
      atKm,
      atLabel: d(atKm),
      power: isEv ? (vehicle === "motorhome" ? "150 kW CCS" : "350 kW CCS") : "24/7 forecourt",
      networks: isEv
        ? [networks[i % networks.length]!, networks[(i + 1) % networks.length]!]
        : [],
      note: isEv
        ? `Arrive at ~25% state of charge, charge to 80% in about ${vehicle === "motorhome" ? 38 : 22} min.`
        : `Recommended refuel — keeps you above the 25% reserve on a ${d(fullRange)} tank range.`,
    };
  });

  return {
    mode: isEv ? "ev" : "fuel",
    title: isEv ? "⚡ Smart EV Charging Optimizer" : "⛽ Smart Fuel Stop Optimizer",
    rangeLabel: `${d(fullRange)} full ${isEv ? "battery" : "tank"} range`,
    bufferLabel: `Planned at 75% safety buffer — ${d(safeRange)} between stops`,
    stops,
    networks: isEv ? networks : [],
    arbitrage: isEv ? [] : ARBITRAGE[region],
    longStretch: LONG_STRETCH[region],
  };
}


const SEGMENTS: Record<RegionKey, TripEstimate["segments"]> = {
  eu: [
    {
      country: "🇩🇪 Germany",
      total: 0,
      lines: [
        { place: "A8 Munich → Salzburg", detail: "No car tolls on German autobahns", amount: 0 },
      ],
    },
    {
      country: "🇦🇹 Austria",
      total: 34.6,
      lines: [
        {
          place: "Digital vignette",
          detail: "10-day pass, valid nationwide",
          amount: 12.4,
          badge: "Buy online",
          portal: { label: "ASFINAG", url: "https://shop.asfinag.at/" },
        },
        {
          place: "Brenner Pass A13",
          detail: "Section toll, one way",
          amount: 11.1,
          badge: "Buy online",
          portal: { label: "ASFINAG", url: "https://shop.asfinag.at/" },
        },
        {
          place: "Tauern tunnel",
          detail: "Section toll, one way",
          amount: 11.1,
          portal: { label: "ASFINAG", url: "https://www.asfinag.at/maut-vignette/streckenmaut/" },
        },
      ],
    },
    {
      country: "🇨🇭 Switzerland",
      total: 42.5,
      lines: [
        {
          place: "E-vignette",
          detail: "Annual e-vignette, plate-linked",
          amount: 42.5,
          badge: "Buy online",
          portal: { label: "via.admin.ch", url: "https://via.admin.ch/shop/dashboard" },
        },
      ],
    },
    {
      country: "🇮🇹 Italy",
      total: 61.8,
      lines: [
        {
          place: "A22 Brennero → Modena",
          detail: "Ticket system, 8 checkpoints",
          amount: 38.9,
          badge: "Telepass",
          portal: { label: "Telepass", url: "https://www.telepass.com/en/" },
        },
        {
          place: "A1 Firenze → Roma",
          detail: "Ticket system, 5 checkpoints",
          amount: 22.9,
          portal: { label: "Telepass", url: "https://www.telepass.com/en/" },
        },
      ],
    },
    {
      country: "🇳🇴 Norway",
      total: 18.4,
      lines: [
        {
          place: "Oslo & Bergen city rings",
          detail: "AutoPASS gantries — motorcycles pass free",
          amount: 18.4,
          badge: "AutoPASS",
          freeForMotorcycle: true,
          portal: { label: "AutoPASS", url: "https://www.autopass.no/en/" },
        },
      ],
    },
    {
      country: "⛴️ Ferries",
      total: 78,
      lines: [
        {
          place: "Naples → Capri",
          detail: "Vehicle + 2 passengers",
          amount: 78,
          badge: "Reserve seat",
          portal: { label: "Direct Ferries", url: "https://www.directferries.com/" },
        },
      ],
    },
  ],
  us: [
    {
      country: "🏙️ Illinois",
      total: 14.2,
      lines: [
        {
          place: "I-90 Jane Addams Tollway",
          detail: "6 gantries, I-PASS rate",
          amount: 14.2,
          badge: "I-PASS",
          portal: { label: "Illinois Tollway", url: "https://www.illinoistollway.com/" },
        },
      ],
    },
    {
      country: "🌄 Colorado",
      total: 21.5,
      lines: [
        {
          place: "E-470 Express",
          detail: "Plate-pay surcharge included",
          amount: 15.5,
          badge: "ExpressToll",
          portal: { label: "ExpressToll", url: "https://www.expresstoll.com/" },
        },
        { place: "I-70 Mountain Express Lane", detail: "Peak weekend rate", amount: 6 },
      ],
    },
    {
      country: "🌉 California",
      total: 26,
      lines: [
        {
          place: "Golden Gate Bridge",
          detail: "Southbound, FasTrak",
          amount: 9.75,
          badge: "FasTrak",
          portal: { label: "FasTrak", url: "https://www.bayareafastrak.org/" },
        },
        { place: "Bay Bridge", detail: "Weekday peak", amount: 8.25 },
        { place: "SR-91 Express Lanes", detail: "Evening rate", amount: 8 },
      ],
    },
    {
      country: "🌴 Florida",
      total: 18.6,
      lines: [
        {
          place: "Florida Turnpike (Orlando → Miami)",
          detail: "SunPass rate, 9 gantries",
          amount: 18.6,
          badge: "SunPass",
          portal: { label: "SunPass", url: "https://www.sunpass.com/" },
        },
      ],
    },
    {
      country: "⛴️ Ferries",
      total: 62,
      lines: [
        {
          place: "Anacortes → Friday Harbor",
          detail: "Vehicle under 22ft + driver",
          amount: 62,
          badge: "Reserve",
          portal: { label: "WA State Ferries", url: "https://wsdot.com/travel/washington-state-ferries" },
        },
      ],
    },
  ],
  ca: [
    {
      country: "🍁 Ontario",
      total: 39.4,
      lines: [
        {
          place: "Highway 407 ETR",
          detail: "Peak rate, transponder",
          amount: 31.4,
          badge: "407 tag",
          portal: { label: "407 ETR", url: "https://www.407etr.com/" },
        },
        {
          place: "Video toll charge",
          detail: "Per-trip camera fee",
          amount: 8,
          portal: { label: "407 ETR", url: "https://www.407etr.com/en/tolls/tolls/toll-rates.html" },
        },
      ],
    },
    {
      country: "🌲 Nova Scotia",
      total: 12.5,
      lines: [{ place: "Cobequid Pass (Hwy 104)", detail: "Two-axle vehicle", amount: 12.5 }],
    },
    {
      country: "🏔️ British Columbia",
      total: 0,
      lines: [{ place: "Coquihalla Hwy 5", detail: "Toll-free since 2008", amount: 0 }],
    },
    {
      country: "⛴️ Ferries",
      total: 96,
      lines: [
        {
          place: "Tsawwassen → Swartz Bay",
          detail: "Vehicle under 20ft + 2 adults",
          amount: 96,
          badge: "Reserve",
          portal: { label: "BC Ferries", url: "https://www.bcferries.com/" },
        },
      ],
    },
  ],
};


const PASSES: Record<RegionKey, string[]> = {
  eu: [
    "Stelvio Pass (2,757 m) — 48 hairpins, open, dry tarmac forecast until early evening.",
    "Grossglockner High Alpine Road — toll road, gates close at 21:00; ride it before dusk.",
    "Furka Pass — clear and open today, light crosswinds on the western ramp.",
    "Trollstigen — single-lane sections with tourist traffic; take the early morning slot.",
  ],
  us: ["Tail of the Dragon (US-129) — 318 curves in 11 miles; watch for gravel on the inside lines."],
  ca: ["Icefields Parkway — stunning but exposed; wildlife on the road at dawn and dusk."],
};

function safetyFor(region: RegionKey, vehicle: VehicleKey) {
  if (vehicle === "motorcycle") {
    return {
      title: "Rider Safety & Gear Radar",
      sections: [
        {
          heading: "🧤 Gear & legal kit",
          items: [
            "France: CE-approved gloves are mandatory for rider and pillion, and a high-vis vest must be carried within reach.",
            "Austria & Germany: carry a first-aid kit meeting DIN 13167 (motorcycle standard) — small, and checked at roadside stops.",
            "Keep your vest, kit and documents on top of the pannier so a check takes seconds.",
          ],
        },
        {
          heading: "🏔️ Mountain pass alerts",
          items: [...PASSES[region], ...(region === "eu" ? [] : PASSES.eu.slice(0, 2))],
        },
        {
          heading: "⛽ Long-stretch fuel alerts",
          items: [
            "Two stretches exceed 180 km between open stations — top up before the pass climbs.",
            "Night-time pumps on the alpine leg are card-only; carry a backup card.",
          ],
        },
      ],
    };
  }
  if (vehicle === "motorhome") {
    return {
      title: "Camper Clearance & Weight Radar",
      sections: [
        {
          heading: "📏 Clearance warnings",
          items: [
            "Two tunnels on this route cap height at 3.2 m — your 3.05 m profile clears with margin.",
            "One low village archway (2.9 m) was bypassed via the valley road automatically.",
          ],
        },
        {
          heading: "⚖️ Weight & axle limits",
          items: [
            "Route verified for vehicles up to 3.5 t; a 7.5 t restriction on the old pass road is avoided.",
            "Crosswind advisory on the coastal bridge section — reduce speed with a high side profile.",
          ],
        },
        {
          heading: "🛠️ Services",
          items: [
            "Three overnight-friendly service areas with fresh water and grey-water disposal along the way.",
          ],
        },
      ],
    };
  }
  return {
    title: "Driver Safety Radar",
    sections: [
      {
        heading: "🚗 On the road",
        items: [
          "Winter equipment rules apply on the alpine section between October and April.",
          "Rest stops are mapped every 2 hours so the drive stays fresh and relaxed.",
          "Every toll gantry on this route accepts contactless cards — no cash needed.",
        ],
      },
      { heading: "🏔️ Pass conditions", items: PASSES[region] },
    ],
  };
}


export function estimateTrip(
  region: RegionKey,
  vehicle: VehicleKey,
  fuel: FuelKey,
  avoidTolls: boolean,
  includeFerries: boolean,
  scenic: boolean,
): TripEstimate {
  const defaults = REGION_DEFAULTS[region];
  const currency = defaults.currency;
  const imperial = defaults.units === "imperial";
  const baseDistance = region === "eu" ? 1420 : region === "us" ? 1890 : 1640;
  const distanceKm = Math.round(baseDistance * (scenic ? 1.08 : 1));

  const isMoto = vehicle === "motorcycle";
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const mapLines = (lines: TollLine[], factor: number) =>
    lines.map((l) => ({
      ...l,
      amount: isMoto && l.freeForMotorcycle ? 0 : round2(l.amount * factor),
      badge: isMoto && l.freeForMotorcycle ? "Free for motorcycles" : l.badge,
    }));

  let segments = SEGMENTS[region];
  if (!includeFerries) segments = segments.filter((s) => !s.country.includes("Ferries"));

  const motoFactor = isMoto ? 0.6 : 1;
  segments = segments.map((s) => {
    const tollFactor = s.country.includes("Ferries") || !avoidTolls ? 1 : 0.25;
    const lines = mapLines(s.lines, tollFactor * motoFactor);
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
  const kwhPer100 = vehicle === "motorhome" ? 28 : vehicle === "motorcycle" ? 12 : 18;
  const pricePerL = fuel === "diesel" ? 1.72 : 1.89;
  const pricePerKwh = 0.44;

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

  const hours = distanceKm / (scenic ? 78 : 98);
  const driveTime = `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`;

  return {
    currency,
    units: defaults.units,
    distanceLabel,
    budget: round2(tolls + ferries + energyCost + distanceKm * 0.04),
    distanceKm,
    driveTime,
    tolls,
    ferries,
    energyCost,
    energyLabel: fuel === "electric" ? "EV Charging" : "Fuel",
    energyAmount,
    segments,
    safety: safetyFor(region, vehicle),
    optimizer: buildOptimizer(region, vehicle, fuel, distanceKm, imperial),
    discountNote: isMoto
      ? "Motorcycle rates applied: ~40% indicative discount on distance tolls, vignettes and ferries — and 0 in Norwegian city rings."
      : undefined,
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
};

export const QUICK_ROUTES: QuickRoute[] = [
  {
    key: "oslo-garda",
    emoji: "🏔️",
    label: "Oslo → Lake Garda",
    origin: "Oslo, Norway",
    destination: "Lake Garda, Italy",
    via: "NO → IT via DE/AT",
    regions: ["eu"],
  },
  {
    key: "munich-split",
    emoji: "🌊",
    label: "Munich → Split",
    origin: "Munich, Germany",
    destination: "Split, Croatia",
    via: "DE → HR via AT/SI",
    regions: ["eu"],
  },
  {
    key: "ams-cotedazur",
    emoji: "☀️",
    label: "Amsterdam → Côte d'Azur",
    origin: "Amsterdam, Netherlands",
    destination: "Nice, France",
    via: "NL → FR",
    regions: ["eu"],
  },
  {
    key: "london-paris",
    emoji: "🇬🇧",
    label: "London → Paris",
    origin: "London, United Kingdom",
    destination: "Paris, France",
    via: "UK → FR via Channel Ferry / LeShuttle",
    regions: ["eu"],
  },
  {
    key: "frankfurt-barcelona",
    emoji: "🇪🇸",
    label: "Frankfurt → Barcelona",
    origin: "Frankfurt, Germany",
    destination: "Barcelona, Spain",
    via: "DE → ES via FR",
    regions: ["eu"],
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
