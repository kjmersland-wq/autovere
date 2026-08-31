export type RegionKey = "eu" | "us" | "ca";

export const REGIONS: { key: RegionKey; label: string; flag: string; to: "/" | "/us" | "/ca" }[] = [
  { key: "eu", label: "Europe", flag: "🇪🇺", to: "/" },
  { key: "us", label: "USA", flag: "🇺🇸", to: "/us" },
  { key: "ca", label: "Canada", flag: "🇨🇦", to: "/ca" },
];

export const LANGUAGES = [
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "no", flag: "🇳🇴", label: "Norsk" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "nl", flag: "🇳🇱", label: "Nederlands" },
  { code: "sv", flag: "🇸🇪", label: "Svenska" },
  { code: "da", flag: "🇩🇰", label: "Dansk" },
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
  badge?: string;
};

export type TripEstimate = {
  currency: string;
  units: "metric" | "imperial";
  distanceLabel: string;
  budget: number;
  distanceKm: number;
  driveTime: string;
  tolls: number;
  energyCost: number;
  energyLabel: string;
  energyAmount: string;
  segments: { country: string; total: number; lines: TollLine[] }[];
  safety: { title: string; tips: string[] };
};

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
        { place: "Digital vignette", detail: "10-day pass, valid nationwide", amount: 12.4, badge: "Buy online" },
        { place: "Brenner Pass A13", detail: "Section toll, one way", amount: 11.1, badge: "Buy online" },
        { place: "Tauern tunnel", detail: "Section toll, one way", amount: 11.1 },
      ],
    },
    {
      country: "🇨🇭 Switzerland",
      total: 42.5,
      lines: [{ place: "E-vignette", detail: "Annual e-vignette, plate-linked", amount: 42.5, badge: "Buy online" }],
    },
    {
      country: "🇮🇹 Italy",
      total: 61.8,
      lines: [
        { place: "A22 Brennero → Modena", detail: "Ticket system, 8 checkpoints", amount: 38.9 },
        { place: "A1 Firenze → Roma", detail: "Ticket system, 5 checkpoints", amount: 22.9 },
      ],
    },
    {
      country: "⛴️ Ferries",
      total: 78,
      lines: [{ place: "Naples → Capri", detail: "Vehicle + 2 passengers", amount: 78, badge: "Reserve seat" }],
    },
  ],
  us: [
    {
      country: "🏙️ Illinois",
      total: 14.2,
      lines: [{ place: "I-90 Jane Addams Tollway", detail: "6 gantries, I-PASS rate", amount: 14.2, badge: "I-PASS" }],
    },
    {
      country: "🌄 Colorado",
      total: 21.5,
      lines: [
        { place: "E-470 Express", detail: "Plate-pay surcharge included", amount: 15.5, badge: "ExpressToll" },
        { place: "I-70 Mountain Express Lane", detail: "Peak weekend rate", amount: 6 },
      ],
    },
    {
      country: "🌉 California",
      total: 26,
      lines: [
        { place: "Golden Gate Bridge", detail: "Southbound, FasTrak", amount: 9.75, badge: "FasTrak" },
        { place: "Bay Bridge", detail: "Weekday peak", amount: 8.25 },
        { place: "SR-91 Express Lanes", detail: "Evening rate", amount: 8 },
      ],
    },
    {
      country: "⛴️ Ferries",
      total: 62,
      lines: [{ place: "Anacortes → Friday Harbor", detail: "Vehicle under 22ft + driver", amount: 62, badge: "Reserve" }],
    },
  ],
  ca: [
    {
      country: "🍁 Ontario",
      total: 39.4,
      lines: [
        { place: "Highway 407 ETR", detail: "Peak rate, transponder", amount: 31.4, badge: "407 tag" },
        { place: "Video toll charge", detail: "Per-trip camera fee", amount: 8 },
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
        { place: "Tsawwassen → Swartz Bay", detail: "Vehicle under 20ft + 2 adults", amount: 96, badge: "Reserve" },
      ],
    },
  ],
};

const SAFETY: Record<VehicleKey, { title: string; tips: string[] }> = {
  motorcycle: {
    title: "Rider Safety Radar",
    tips: [
      "Rider Tip: High-vis vest and CE-approved gloves are required across French borders — pack them on top.",
      "Alpine pass alert: Furka Pass is clear and open today, with dry tarmac forecast until early evening.",
      "Fuel stops are spaced under 180 km the whole way, so your tank range is comfortably covered.",
    ],
  },
  motorhome: {
    title: "Camper Safety Radar",
    tips: [
      "Camper Tip: Route fully verified for vehicles under 3.5t and 3.2 m height clearance.",
      "Three overnight-friendly service areas with fresh water and grey-water disposal sit along the way.",
      "One narrow village bypass was swapped for a wider valley road — smoother and calmer driving.",
    ],
  },
  car: {
    title: "Driver Safety Radar",
    tips: [
      "Driver Tip: Winter equipment rules apply on the alpine section between October and April.",
      "Rest stops are mapped every 2 hours so the drive stays fresh and relaxed.",
      "Toll gantries on this route all accept contactless cards — no cash needed.",
    ],
  },
};

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

  let segments = SEGMENTS[region];
  if (!includeFerries) segments = segments.filter((s) => !s.country.includes("Ferries"));
  if (avoidTolls)
    segments = segments.map((s) =>
      s.country.includes("Ferries")
        ? s
        : { ...s, total: Math.round(s.total * 0.25 * 10) / 10, lines: s.lines.map((l) => ({ ...l, amount: Math.round(l.amount * 0.25 * 100) / 100 })) },
    );

  const tolls = Math.round(segments.reduce((sum, s) => sum + s.total, 0) * 100) / 100;

  const consumption =
    vehicle === "motorhome" ? 11.5 : vehicle === "motorcycle" ? 4.8 : 6.6;
  const kwhPer100 = vehicle === "motorhome" ? 28 : vehicle === "motorcycle" ? 12 : 18;
  const pricePerL = fuel === "diesel" ? 1.72 : 1.89;
  const pricePerKwh = 0.44;

  const energyCost =
    fuel === "electric"
      ? Math.round(((distanceKm / 100) * kwhPer100 * pricePerKwh) * 100) / 100
      : Math.round(((distanceKm / 100) * consumption * pricePerL) * 100) / 100;

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
    budget: Math.round((tolls + energyCost + distanceKm * 0.04) * 100) / 100,
    distanceKm,
    driveTime,
    tolls,
    energyCost,
    energyLabel: fuel === "electric" ? "EV Charging" : "Fuel",
    energyAmount,
    segments,
    safety: SAFETY[vehicle],
  };
}

export function money(currency: string, value: number) {
  return `${currency}${value.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
