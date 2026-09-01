import type { RegionKey, VehicleKey } from "@/lib/trip-data";

export type TripType = "oneway" | "return";

export type VignetteTier = {
  label: string;
  days: number;
  price: number;
};

type VignetteCountry = {
  code: string;
  flag: string;
  country: string;
  system: string;
  currency: string;
  /** Tier travellers usually default to when they don't optimise. */
  defaultTier: string;
  motoFactor: number;
  portal: { label: string; url: string };
  tiers: VignetteTier[];
};

export const VIGNETTE_COUNTRIES: VignetteCountry[] = [
  {
    code: "AT",
    flag: "🇦🇹",
    country: "Austria",
    system: "ASFINAG digital vignette",
    currency: "€",
    defaultTier: "10-Day",
    motoFactor: 0.4,
    portal: { label: "ASFINAG", url: "https://www.asfinag.at/maut-vignette/vignette/" },
    tiers: [
      { label: "1-Day", days: 1, price: 8.6 },
      { label: "10-Day", days: 10, price: 11.5 },
      { label: "2-Month", days: 60, price: 28.9 },
      { label: "Annual", days: 365, price: 103.8 },
    ],
  },
  {
    code: "CH",
    flag: "🇨🇭",
    country: "Switzerland",
    system: "Swiss motorway vignette (annual only)",
    currency: "CHF ",
    defaultTier: "Annual",
    motoFactor: 1,
    portal: { label: "via.admin.ch", url: "https://via.admin.ch/shop/dashboard" },
    tiers: [{ label: "Annual", days: 365, price: 40 }],
  },
  {
    code: "SI",
    flag: "🇸🇮",
    country: "Slovenia",
    system: "DARS e-vinjeta",
    currency: "€",
    defaultTier: "1-Month",
    motoFactor: 0.5,
    portal: { label: "DARS", url: "https://evinjeta.dars.si/" },
    tiers: [
      { label: "7-Day", days: 7, price: 16 },
      { label: "1-Month", days: 30, price: 32 },
      { label: "Annual", days: 365, price: 117.5 },
    ],
  },
  {
    code: "CZ",
    flag: "🇨🇿",
    country: "Czech Republic",
    system: "eDálnice e-vignette",
    currency: "€",
    defaultTier: "10-Day",
    motoFactor: 0,
    portal: { label: "eDalnice", url: "https://edalnice.cz/en/" },
    tiers: [
      { label: "1-Day", days: 1, price: 8.1 },
      { label: "10-Day", days: 10, price: 11.3 },
      { label: "30-Day", days: 30, price: 16.2 },
      { label: "Annual", days: 365, price: 96.5 },
    ],
  },
  {
    code: "SK",
    flag: "🇸🇰",
    country: "Slovakia",
    system: "eZnámka e-vignette",
    currency: "€",
    defaultTier: "10-Day",
    motoFactor: 0,
    portal: { label: "eznamka.sk", url: "https://eznamka.sk/en/" },
    tiers: [
      { label: "1-Day", days: 1, price: 5.4 },
      { label: "10-Day", days: 10, price: 12 },
      { label: "1-Month", days: 30, price: 17 },
      { label: "Annual", days: 365, price: 60 },
    ],
  },
  {
    code: "HU",
    flag: "🇭🇺",
    country: "Hungary",
    system: "e-Matrica (national)",
    currency: "€",
    defaultTier: "10-Day",
    motoFactor: 0.65,
    portal: { label: "nemzetiutdij.hu", url: "https://nemzetiutdij.hu/en" },
    tiers: [
      { label: "10-Day", days: 10, price: 14.5 },
      { label: "1-Month", days: 30, price: 23.2 },
      { label: "Annual", days: 365, price: 137 },
    ],
  },
];

export type VignetteRecommendation = {
  code: string;
  flag: string;
  country: string;
  system: string;
  currency: string;
  portal: { label: string; url: string };
  recommendation: string;
  quantity: number;
  cost: number;
  baselineLabel: string;
  baselineCost: number;
  saved: number;
  note: string;
  exempt: boolean;
};

export type VignettePlan = {
  daysCovered: number;
  tripType: TripType;
  total: number;
  totalSaved: number;
  headline: string;
  items: VignetteRecommendation[];
};

const round2 = (n: number) => Math.round(n * 100) / 100;

function cheapestCombination(tiers: VignetteTier[], days: number, factor: number) {
  let best = { label: tiers[0]!.label, quantity: 1, cost: Infinity, days: tiers[0]!.days };
  for (const tier of tiers) {
    const quantity = Math.max(1, Math.ceil(days / tier.days));
    const cost = round2(quantity * tier.price * factor);
    if (cost < best.cost) best = { label: tier.label, quantity, cost, days: tier.days };
  }
  return best;
}

/**
 * Recommends the optimal vignette tier per country for the given trip shape.
 * Presence days = 1 for a one-way transit leg, otherwise the full trip duration.
 */
export function optimizeVignettes(
  region: RegionKey,
  vehicle: VehicleKey,
  tripType: TripType,
  durationDays: number,
  /** ISO codes of the countries the routed polyline actually enters. */
  routeCountryCodes?: string[],
): VignettePlan | null {
  if (routeCountryCodes && !routeCountryCodes.some((c) => VIGNETTE_COUNTRIES.some((v) => v.code === c)))
    return null;
  if (!routeCountryCodes && region !== "eu") return null;

  const daysCovered = tripType === "oneway" ? 1 : Math.max(1, durationDays);
  const isMoto = vehicle === "motorcycle";

  const relevant = routeCountryCodes
    ? VIGNETTE_COUNTRIES.filter((c) => routeCountryCodes.includes(c.code))
    : VIGNETTE_COUNTRIES;

  const items: VignetteRecommendation[] = relevant.map((c) => {
    const factor = isMoto ? c.motoFactor : 1;
    const exempt = isMoto && c.motoFactor === 0;
    const best = cheapestCombination(c.tiers, daysCovered, factor);
    const baseTier = c.tiers.find((t) => t.label === c.defaultTier) ?? c.tiers[0]!;
    const baselineQty = Math.max(1, Math.ceil(daysCovered / baseTier.days));
    const baselineCost = round2(baselineQty * baseTier.price * factor);

    return {
      code: c.code,
      flag: c.flag,
      country: c.country,
      system: c.system,
      currency: c.currency,
      portal: c.portal,
      recommendation: best.quantity > 1 ? `${best.quantity} × ${best.label}` : best.label,
      quantity: best.quantity,
      cost: exempt ? 0 : best.cost,
      baselineLabel: baselineQty > 1 ? `${baselineQty} × ${baseTier.label}` : baseTier.label,
      baselineCost: exempt ? 0 : baselineCost,
      saved: exempt ? 0 : round2(Math.max(0, baselineCost - best.cost)),
      exempt,
      note: exempt
        ? "Motorcycles are exempt from this e-vignette — nothing to buy."
        : c.tiers.length === 1
          ? "Only one validity period exists — it covers the whole stay."
          : tripType === "oneway"
            ? `Single transit leg: ${best.label} is the cheapest legal cover.`
            : `Covers all ${daysCovered} day${daysCovered > 1 ? "s" : ""} of your return trip within one validity window.`,
    };
  });

  const total = round2(items.reduce((sum, i) => sum + i.cost, 0));
  const totalSaved = round2(items.reduce((sum, i) => sum + i.saved, 0));
  const topSaver = [...items].sort((a, b) => b.saved - a.saved)[0];

  const headline =
    totalSaved > 0 && topSaver
      ? `💡 AutoVere optimized your vignette cost: saved ${topSaver.currency}${totalSaved.toFixed(2)} — ${topSaver.recommendation} in ${topSaver.country} instead of the usual ${topSaver.baselineLabel}.`
      : `💡 AutoVere checked every validity window — the standard tiers are already the cheapest legal cover for ${daysCovered} day${daysCovered > 1 ? "s" : ""}.`;

  return { daysCovered, tripType, total, totalSaved, headline, items };
}

export const DURATION_OPTIONS: { label: string; days: number }[] = [
  { label: "1 Day", days: 1 },
  { label: "3 Days", days: 3 },
  { label: "7 Days", days: 7 },
  { label: "10 Days", days: 10 },
  { label: "14 Days", days: 14 },
  { label: "1 Month", days: 30 },
  { label: "2 Months", days: 60 },
  { label: "Annual", days: 365 },
];
