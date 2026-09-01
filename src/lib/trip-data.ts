import type { FlagCode } from "@/components/FlagIcon";
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

/** Region is independent from language: /us, /ca, /fr/us, /no/ca all resolve here. */
export function regionFromPath(pathname: string): RegionKey {
  const parts = pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  const LANGS = ["no", "se", "dk", "de", "nl", "fr", "pl"];
  const first = parts[0] ?? "";
  const seg = LANGS.includes(first) ? (parts[1] ?? "") : first;
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
  driveHours: number;
  variant: RouteVariantKey;
  driveTime: string;

  tolls: number;
  ferries: number;
  energyCost: number;
  energyLabel: string;
  energyAmount: string;
  segments: { country: string; total: number; lines: TollLine[] }[];
  safety: { title: string; sections: SafetySection[] };
  optimizer: EnergyOptimizer;
  vignette?: VignettePlan | null;
  tripType?: TripType;
  durationDays?: number;
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
      total: 46.4,
      lines: [
        {
          place: "Highway 407 ETR",
          detail: "Peak rate, transponder",
          amount: 31.4,
          badge: "407 tag",
          portal: { label: "407 ETR", url: "https://www.407etr.com/" },
        },
        {
          place: "Highway 412 (Whitby ↔ 407)",
          detail: "Two-axle vehicle, transponder rate",
          amount: 3.9,
          portal: { label: "Ontario 407 tolls", url: "https://www.ontario.ca/page/highway-407-tolls" },
        },
        {
          place: "Highway 418 (Courtice ↔ 407)",
          detail: "Two-axle vehicle, transponder rate",
          amount: 3.1,
          portal: { label: "Ontario 407 tolls", url: "https://www.ontario.ca/page/highway-407-tolls" },
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
      country: "⚜️ Québec",
      total: 7.15,
      lines: [
        {
          place: "A25 Bridge (Montréal ↔ Laval)",
          detail: "Two-axle vehicle, peak with transponder",
          amount: 4.3,
          badge: "A25 tag",
          portal: { label: "A25", url: "https://a25.com/" },
        },
        {
          place: "A30 (Autoroute 30 toll section)",
          detail: "Two-axle vehicle, electronic toll",
          amount: 2.85,
          portal: { label: "A30 Express", url: "https://a30express.com/" },
        },
      ],
    },
    {
      country: "🌲 Nova Scotia",
      total: 12.5,
      lines: [
        {
          place: "Cobequid Pass (Hwy 104)",
          detail: "Two-axle vehicle",
          amount: 12.5,
          portal: { label: "Cobequid Pass", url: "https://cobequidpass.com/" },
        },
      ],
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
): TripEstimate {
  const activeVariant: RouteVariantKey = avoidTolls && variant === "fastest" ? "tollfree" : variant;
  const tuning = VARIANT_TUNING[activeVariant];
  const defaults = REGION_DEFAULTS[region];
  const currency = defaults.currency;
  const imperial = defaults.units === "imperial";
  const isReturn = tripType === "return";
  const legMultiplier = isReturn ? 2 : 1;
  const baseDistance = region === "eu" ? 1420 : region === "us" ? 1890 : 1640;
  const distanceKm = Math.round(
    baseDistance * (scenic ? 1.08 : 1) * tuning.distance * (1 + 0.035 * extraStops) * legMultiplier,
  );

  const isMoto = vehicle === "motorcycle";
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const isVignetteLine = (l: TollLine) =>
    /vignette|vinjeta|matrica|e-znamka|dalnice|sticker/i.test(`${l.place} ${l.detail ?? ""}`);
  const mapLines = (lines: TollLine[], factor: number) =>
    lines.map((l) => {
      // Multi-day vignettes stay valid for the whole return trip — only distance
      // tolls and ferry tickets are charged twice.
      const returnFactor = isReturn && !isVignetteLine(l) ? 2 : 1;
      return {
        ...l,
        amount: isMoto && l.freeForMotorcycle ? 0 : round2(l.amount * factor * returnFactor),
        badge: isMoto && l.freeForMotorcycle
          ? "Free for motorcycles"
          : (l.badge ?? (returnFactor === 2 ? "Return trip ×2" : undefined)),
      };
    });

  let segments = SEGMENTS[region];
  if (!includeFerries) segments = segments.filter((s) => !s.country.includes("Ferries"));

  const motoFactor = isMoto ? 0.6 : 1;
  segments = segments.map((s) => {
    const tollFactor = s.country.includes("Ferries") ? 1 : tuning.toll;
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

  const hours = distanceKm / (scenic ? tuning.speed * 0.82 : tuning.speed);
  const driveTime = `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`;

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
    safety: safetyFor(region, vehicle),
    optimizer: buildOptimizer(region, vehicle, fuel, distanceKm, imperial),
    vignette:
      activeVariant === "tollfree" ? null : optimizeVignettes(region, vehicle, tripType, durationDays),
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
): Record<RouteVariantKey, TripEstimate> {
  const args = [extraStops, tripType, durationDays] as const;
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
  const kwhPer100 = vehicle === "motorhome" ? 28 : vehicle === "motorcycle" ? 12 : 18;
  const pricePerL = fuel === "diesel" ? 1.72 : 1.89;
  const pricePerKwh = 0.44;
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
  {
    key: "nyc-toronto",
    emoji: "🗽",
    label: "New York, NY → Toronto, ON",
    origin: "New York, NY",
    destination: "Toronto, ON",
    via: "Tolls ~$18–24 · I-87 / ON 401",
    regions: ["us"],
    evBadge: "⚡ EV saves ~60% (~$51) vs petrol",
  },
  {
    key: "orlando-miami",
    emoji: "🌴",
    label: "Orlando, FL → Miami, FL",
    origin: "Orlando, FL",
    destination: "Miami, FL",
    via: "SunPass $17.50 · FL Turnpike",
    regions: ["us"],
    evBadge: "⚡ EV saves ~62% (~$26) vs petrol",
  },
  {
    key: "toronto-montreal",
    emoji: "🍁",
    label: "Toronto, ON → Montréal, QC",
    origin: "Toronto, ON",
    destination: "Montréal, QC",
    via: "407 ETR bypass · $0 tolls · Hwy 401 / A-20",
    regions: ["ca"],
    evBadge: "⚡ EV saves ~64% (~$56 CAD) vs petrol",
  },
  {
    key: "calgary-vancouver",
    emoji: "🏔️",
    label: "Calgary, AB → Vancouver, BC",
    origin: "Calgary, AB",
    destination: "Vancouver, BC",
    via: "Trans-Canada Hwy · no tolls",
    regions: ["ca"],
    evBadge: "⚡ EV saves ~62% (~$97 CAD) vs petrol",
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
): FerryCrossing[] {
  const text = `${origin} ${destination}`.toLowerCase();
  const matched = FERRY_CROSSINGS.filter(
    (f) => f.regions.includes(region) && f.match.some((m) => text.includes(m)),
  );
  if (matched.length > 0) return matched;
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
): EmissionBadge[] {
  const text = `${origin} ${destination}`.toLowerCase();
  return EMISSION_BADGES.filter(
    (b) => b.regions.includes(region) && b.match.some((m) => text.includes(m)),
  );
}

/* ------------------------------------------------------------------ *
 * Scenic highlights & RV points of interest
 * ------------------------------------------------------------------ */

export interface ScenicHighlight {
  id: string;
  emoji: string;
  name: string;
  where: string;
  note: string;
  season: string;
}

export interface RvPoi {
  id: string;
  emoji: string;
  name: string;
  where: string;
  services: string[];
  note: string;
}

export const SCENIC_HIGHLIGHTS: Record<RegionKey, ScenicHighlight[]> = {
  eu: [
    { id: "trollstigen", emoji: "🏔️", name: "Trollstigen", where: "Rauma, Norway", note: "Eleven hairpins climbing a sheer wall — viewing platform over the valley.", season: "Late May – October" },
    { id: "atlantic-road", emoji: "🌊", name: "Atlantic Road", where: "Møre og Romsdal, Norway", note: "Eight bridges hopping island to island straight over the open sea.", season: "Year-round" },
    { id: "grossglockner", emoji: "⛰️", name: "Grossglockner High Alpine Road", where: "Austria", note: "48 km of alpine theatre topping out at 2,504 m.", season: "May – early November" },
    { id: "stelvio", emoji: "🏍️", name: "Stelvio Pass", where: "Italy", note: "48 numbered hairpins — the classic rider pilgrimage.", season: "June – October" },
    { id: "furka", emoji: "✨", name: "Furka & Grimsel Passes", where: "Switzerland", note: "Glacier views, smooth tarmac and a lakeside descent.", season: "June – October" },
    { id: "verdon", emoji: "🌅", name: "Gorges du Verdon", where: "Provence, France", note: "Turquoise canyon rim road on the way to the Côte d'Azur.", season: "Year-round" },
  ],
  us: [
    { id: "blue-ridge", emoji: "🌄", name: "Blue Ridge Parkway", where: "Virginia – North Carolina", note: "469 miles of ridgeline overlooks, no trucks, no tolls.", season: "Year-round (peak: October)" },
    { id: "pch", emoji: "🌊", name: "Pacific Coast Highway (SR-1)", where: "California", note: "Big Sur cliffs, Bixby Bridge and endless Pacific vistas.", season: "Year-round" },
    { id: "dragon", emoji: "🏍️", name: "Tail of the Dragon (US-129)", where: "Tennessee", note: "318 curves in 11 miles — ride it early to beat traffic.", season: "April – November" },
    { id: "beartooth", emoji: "⛰️", name: "Beartooth Highway", where: "Montana – Wyoming", note: "Switchbacks to 10,947 ft on the doorstep of Yellowstone.", season: "Late May – mid October" },
    { id: "zion", emoji: "🏜️", name: "Zion – Bryce scenic corridor", where: "Utah", note: "Red-rock tunnels and canyon overlooks between two parks.", season: "Year-round" },
  ],
  ca: [
    { id: "icefields", emoji: "🏔️", name: "Icefields Parkway", where: "Alberta", note: "232 km between Lake Louise and Jasper past glaciers and turquoise lakes.", season: "Year-round (winter tyres Oct–Apr)" },
    { id: "cabot", emoji: "🌊", name: "Cabot Trail", where: "Cape Breton, Nova Scotia", note: "Highland cliffs, whale lookouts and ocean switchbacks.", season: "May – October" },
    { id: "sea-to-sky", emoji: "✨", name: "Sea-to-Sky Highway", where: "British Columbia", note: "Howe Sound fjord views from Vancouver up to Whistler.", season: "Year-round" },
    { id: "charlevoix", emoji: "🍁", name: "Route du Fleuve, Charlevoix", where: "Québec", note: "St. Lawrence riverside villages and beluga-watching stops.", season: "May – October" },
  ],
};

export const RV_POIS: Record<RegionKey, RvPoi[]> = {
  eu: [
    { id: "eu-1", emoji: "🚐", name: "Bobil-parkering Geiranger", where: "Geiranger, Norway", services: ["Grey water", "Fresh water", "EV hookup"], note: "Fjord-side pitches, 5 min walk to the ferry quay." },
    { id: "eu-2", emoji: "🚐", name: "Stellplatz Zell am See", where: "Salzburg, Austria", services: ["Chemical WC", "Electricity", "Bakery service"], note: "Great overnight before Grossglockner — book in July/August." },
    { id: "eu-3", emoji: "🚐", name: "Aire de Camping-Car Annecy", where: "Haute-Savoie, France", services: ["Fresh water", "Grey water", "24h access"], note: "France's aire network is the cheapest overnight option en route south." },
    { id: "eu-4", emoji: "🚐", name: "Camping Bella Italia, Peschiera", where: "Lake Garda, Italy", services: ["Full hookup", "Laundry", "Pool"], note: "Large pitches; height/width friendly access road." },
  ],
  us: [
    { id: "us-1", emoji: "🚐", name: "KOA Journey — Interstate corridor", where: "Nationwide", note: "Pull-through sites sized for 40 ft rigs and towed cars.", services: ["Full hookup", "Dump station", "Wi-Fi"] },
    { id: "us-2", emoji: "🚐", name: "Yellowstone Grizzly RV Park", where: "West Yellowstone, MT", note: "Book months ahead for summer; ideal Beartooth basecamp.", services: ["50 amp", "Dump station", "Laundry"] },
    { id: "us-3", emoji: "🚐", name: "Pismo Coast Village RV Resort", where: "California", note: "Beachfront stop midway along the Pacific Coast Highway.", services: ["Full hookup", "Propane", "Dump station"] },
  ],
  ca: [
    { id: "ca-1", emoji: "🚐", name: "Whistler RV Park & Campground", where: "British Columbia", note: "Last full-service stop on the Sea-to-Sky corridor.", services: ["Full hookup", "Showers", "Dump station"] },
    { id: "ca-2", emoji: "🚐", name: "Whistlers Campground", where: "Jasper, Alberta", note: "Huge serviced loop right at the north end of the Icefields Parkway.", services: ["Electric", "Dump station", "Fire pits"] },
    { id: "ca-3", emoji: "🚐", name: "Broad Cove Campground", where: "Cape Breton, Nova Scotia", note: "Oceanfront pitches on the Cabot Trail.", services: ["Water", "Dump station", "Showers"] },
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

/** Danish / Øresund bridge crossings on the corridor. */
export function detectScandiBridges(
  region: RegionKey,
  origin: string,
  destination: string,
): ScandiBridge[] {
  if (region !== "eu") return [];
  const text = `${origin} ${destination}`.toLowerCase();
  return SCANDI_BRIDGES.filter((b) => b.match.some((m) => text.includes(m)));
}
