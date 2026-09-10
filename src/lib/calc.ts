import { COUNTRY_NAMES, countryAt, type LatLng } from "./countries";
import { cumulativeKm, haversineKm, samplePolyline, type Charger, type RouteResult, type RouteVariantKey } from "./geo";
import {
  DEFAULT_ENERGY,
  DISTANCE_TOLLS,
  ENERGY_PRICES,
  ALPINE_SURCHARGES,
  NORDIC_BRIDGES,
  NORWAY_AUTOPASS,
  NOK_PER_EUR,
  VIGNETTES,
  vignetteFor,
} from "./tolls";
import { tollConfigFor } from "./tolls/registry";
import { matchNorwayToll, estimatedNorwayToll, type NorwayStationCandidate } from "./tolls/providers/norway";
import type { TollConfidence } from "./tolls/types";

export type VehicleType = "petrol" | "diesel" | "ev";
export type FuelType = "EV" | "ICE";

export type TripInput = {
  vehicle: VehicleType;
  fuelType: FuelType;
  autoPass: boolean;
  days: number;
  evRangeKm: number;
  consumptionPetrol: number; // L/100km
  consumptionDiesel: number; // L/100km
  consumptionEv: number; // kWh/100km
};

export const DEFAULT_TRIP: Omit<TripInput, "vehicle" | "days" | "evRangeKm"> = {
  consumptionPetrol: 6.8,
  consumptionDiesel: 5.4,
  consumptionEv: 18.5,
};

/** Share of the route driven on tolled motorways, per variant. */
const MOTORWAY_SHARE: Record<RouteVariantKey, number> = {
  fastest: 0.85,
  bypass: 0.12,
  tollfree: 0,
};

export type CountryLeg = { code: string; name: string; km: number };

export type CostLineBreakdown = { label: string; amount: number };

export type CostLine = {
  label: string;
  detail: string;
  amount: number;
  country?: string | undefined;
  /** How much to trust this number — see src/lib/tolls/types.ts for what each level means. */
  confidence: TollConfidence;
  source: string;
  sourceUrl?: string | undefined;
  /** CTA to a better external calculator/portal for this specific route. */
  externalLink?: string | undefined;
  /** Native-currency line items (e.g. individual Norwegian toll stations) for a "show breakdown" UI. */
  breakdown?: CostLineBreakdown[] | undefined;
};

export type EvPlan = {
  stops: Charger[];
  stopCount: number;
  chargingMinutes: number;
  energyKwh: number;
};

export type Estimate = {
  key: RouteVariantKey;
  title: string;
  distanceKm: number;
  durationMin: number;
  legs: CountryLeg[];
  energyCost: number;
  tollCost: number;
  tollSavings?: number | undefined;
  vignetteCost: number;
  vignetteLines: CostLine[];
  tollLines: CostLine[];
  total: number;
  ev?: EvPlan | undefined;
};

const TITLES: Record<RouteVariantKey, string> = {
  fastest: "Fastest Route",
  bypass: "Smart Bypass",
  tollfree: "100% Toll-Free",
};

export function countryLegs(coords: LatLng[]): CountryLeg[] {
  const cum = cumulativeKm(coords);
  const total = cum[cum.length - 1] ?? 0;
  const step = Math.max(2, total / 400);
  const samples = samplePolyline(coords, step);
  const tally = new Map<string, number>();
  for (const s of samples) {
    const code = countryAt(s.pt);
    if (!code) continue;
    tally.set(code, (tally.get(code) ?? 0) + step);
  }
  const detected = [...tally.entries()].filter(([, km]) => km > total * 0.01);
  const detectedTotal = detected.reduce((a, [, km]) => a + km, 0) || 1;
  return detected
    .map(([code, km]) => ({
      code,
      name: COUNTRY_NAMES[code] ?? code,
      km: (km / detectedTotal) * total,
    }))
    .sort((a, b) => b.km - a.km);
}

function energyPrice(code: string) {
  return ENERGY_PRICES[code] ?? DEFAULT_ENERGY;
}

export function planEvStops(
  chargers: Charger[],
  distanceKm: number,
  rangeKm: number,
  consumptionEv: number,
): EvPlan {
  const effectiveLegKm = rangeKm * 0.75;
  const stopCount = Math.max(0, Math.ceil(distanceKm / effectiveLegKm) - 1);
  const usable = effectiveLegKm;
  const stops: Charger[] = [];
  let nextTarget = usable;
  while (nextTarget < distanceKm - 30) {
    const candidates = chargers.filter(
      (c) => c.atKm > (stops[stops.length - 1]?.atKm ?? 0) + 40 && c.atKm <= nextTarget,
    );
    const pick = candidates[candidates.length - 1];
    if (!pick) break;
    stops.push(pick);
    nextTarget = pick.atKm + usable;
  }
  const energyKwh = (distanceKm * consumptionEv) / 100;
  const perStop = 27;
  return { stops, stopCount, chargingMinutes: stopCount * perStop, energyKwh };
}

function addNordicBridgeTolls(legs: CountryLeg[], tollLines: CostLine[], key: RouteVariantKey) {
  if (key === "tollfree") return;
  const denmark = legs.find((leg) => leg.code === "DK");
  if (!denmark || denmark.km < 40) return;

  const bridgeLine = (bridge: (typeof NORDIC_BRIDGES)[keyof typeof NORDIC_BRIDGES]): CostLine => ({
    label: bridge.label,
    detail: bridge.detail,
    amount: bridge.amount,
    country: bridge.country,
    confidence: "medium",
    source: `${bridge.label} operator (official fixed toll)`,
    sourceUrl: bridge.url,
    externalLink: bridge.url,
  });

  tollLines.push(bridgeLine(NORDIC_BRIDGES.storebaelt));
  if (legs.some((leg) => leg.code === "SE")) tollLines.push(bridgeLine(NORDIC_BRIDGES.oresund));
}

/** Norway toll line: real NVDB station matching against this route variant when candidates were
 * fetched, falling back to an honestly-labelled wide-interval estimate otherwise. `trustEmptyMatch`
 * is true only for the "tollfree" variant, where crossing zero stations is the intended outcome
 * rather than a matching failure (see src/lib/tolls/providers/norway.ts for the matching logic). */
function norwayTollLine(
  coords: LatLng[],
  norwayKm: number,
  key: RouteVariantKey,
  vehicle: VehicleType,
  autoPass: boolean,
  stations: NorwayStationCandidate[] | null,
): CostLine | null {
  if (key === "tollfree" && stations == null) return null;
  if (norwayKm <= 20) return null;
  const profile = { vehicle, autoPass, days: 1 };

  const matched = stations ? matchNorwayToll(stations, coords, profile) : null;
  const trustEmptyMatch = key === "tollfree";
  const result = matched ?? (trustEmptyMatch ? null : estimatedNorwayToll(coords, norwayKm, profile));
  if (!result) return null;

  const discountLabel =
    vehicle === "ev" ? (autoPass ? "44% EV + AutoPASS discount" : "30% EV discount") : autoPass ? "20% AutoPASS discount" : undefined;
  return {
    label: result.confidence === "high" ? `Norway tolls — ${result.breakdown?.length ?? 0} stations crossed` : "Norway tolls — indicative estimate",
    detail: [`${Math.round(result.amountEur * NOK_PER_EUR)} NOK`, discountLabel].filter(Boolean).join(" · "),
    amount: result.amountEur,
    country: "NO",
    confidence: result.confidence,
    source: result.source,
    sourceUrl: result.sourceUrl,
    externalLink: result.externalLink,
    breakdown: result.breakdown?.map((b) => ({ label: b.label, amount: b.amountNative })),
  };
}

function alpineTolls(coords: LatLng[], key: RouteVariantKey): CostLine[] {
  if (key !== "fastest") return [];
  return ALPINE_SURCHARGES.filter((surcharge) =>
    coords.some((point) => haversineKm(point, [surcharge.lat, surcharge.lon]) <= surcharge.radiusKm),
  ).map((surcharge) => ({
    label: surcharge.label,
    detail: "Special mountain toll · fastest route",
    amount: surcharge.amount,
    country: surcharge.country,
    confidence: "medium",
    source: "AutoVere curated Alpine tunnel toll data",
  }));
}

export function estimate(
  key: RouteVariantKey,
  route: RouteResult,
  trip: TripInput,
  chargers: Charger[],
  norwayStations: NorwayStationCandidate[] | null = null,
): Estimate {
  const legs = countryLegs(route.coords);
  const share = MOTORWAY_SHARE[key];

  let energyCost = 0;
  const tollLines: CostLine[] = [];
  const vignetteLines: CostLine[] = [];

  for (const leg of legs) {
    const price = energyPrice(leg.code);
    if (trip.vehicle === "ev") {
      energyCost += (leg.km * trip.consumptionEv * price.kwh) / 100;
    } else if (trip.vehicle === "diesel") {
      energyCost += (leg.km * trip.consumptionDiesel * price.diesel) / 100;
    } else {
      energyCost += (leg.km * trip.consumptionPetrol * price.petrol) / 100;
    }

    if (leg.code === "NO") continue; // handled separately below via real NVDB matching

    if (leg.code === "DE") {
      // Explicit, not silent: passenger cars are toll-free in Germany — Del 1 requirement.
      const cfg = tollConfigFor("DE")!;
      tollLines.push({
        label: `${leg.name} — no toll for passenger cars`,
        detail: cfg.sourceName,
        amount: 0,
        country: "DE",
        confidence: cfg.accuracy,
        source: cfg.sourceName,
        sourceUrl: cfg.sourceUrl,
      });
      continue;
    }

    const dt = DISTANCE_TOLLS[leg.code];
    if (dt && share > 0) {
      const amount = dt.perKm * leg.km * share;
      const cfg = tollConfigFor(leg.code);
      if (amount > 0.5)
        tollLines.push({
          label: `${leg.name} motorway tolls`,
          detail: `${Math.round(leg.km * share)} km tolled · ${dt.perKm.toFixed(3)} €/km`,
          amount,
          country: leg.code,
          confidence: cfg?.accuracy ?? "low",
          source: cfg?.sourceName ?? dt.authority,
          sourceUrl: cfg?.sourceUrl ?? dt.url,
          externalLink: cfg?.externalCalculatorUrl,
        });
    }

    if (VIGNETTES[leg.code] && key !== "tollfree") {
      const tier = vignetteFor(leg.code, trip.days);
      const cfg = tollConfigFor(leg.code);
      if (tier)
        vignetteLines.push({
          label: `${leg.name} — ${tier.label}`,
          detail: VIGNETTES[leg.code]!.authority,
          amount: tier.price,
          country: leg.code,
          confidence: cfg?.accuracy ?? "medium",
          source: cfg?.sourceName ?? VIGNETTES[leg.code]!.authority,
          sourceUrl: cfg?.sourceUrl ?? VIGNETTES[leg.code]!.url,
          externalLink: cfg?.externalCalculatorUrl ?? VIGNETTES[leg.code]!.url,
        });
    }
  }

  addNordicBridgeTolls(legs, tollLines, key);
  const norwayLeg = legs.find((leg) => leg.code === "NO");
  const norwayToll = norwayLeg
    ? norwayTollLine(route.coords, norwayLeg.km, key, trip.vehicle, trip.autoPass, norwayStations)
    : null;
  const standardNorwayToll = norwayLeg
    ? norwayTollLine(route.coords, norwayLeg.km, key, "petrol", false, norwayStations)
    : null;
  if (norwayToll) tollLines.push(norwayToll);
  tollLines.push(...alpineTolls(route.coords, key));

  const tollCost = tollLines.reduce((a, l) => a + l.amount, 0);
  const vignetteCost = vignetteLines.reduce((a, l) => a + l.amount, 0);

  const ev =
    trip.vehicle === "ev"
      ? planEvStops(chargers, route.distanceKm, trip.evRangeKm, trip.consumptionEv)
      : undefined;

  return {
    key,
    title: TITLES[key],
    distanceKm: route.distanceKm,
    durationMin: route.durationMin + (ev ? ev.chargingMinutes : 0),
    legs,
    energyCost,
    tollCost,
    tollSavings: trip.fuelType === "EV" && standardNorwayToll && norwayToll ? Math.max(0, standardNorwayToll.amount - norwayToll.amount) : undefined,
    vignetteCost,
    vignetteLines,
    tollLines,
    total: energyCost + tollCost + vignetteCost,
    ev,
  };
}

export function formatEur(n: number): string {
  return `€${n.toFixed(n < 100 ? 2 : 0)}`;
}

export function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h > 0 ? `${h}h ${m.toString().padStart(2, "0")}m` : `${m}m`;
}

export type Border = { pt: LatLng; from: string; to: string };

/** Detect country transitions along the polyline (approximate, offline). */
export function detectBorders(coords: LatLng[]): Border[] {
  const samples = samplePolyline(coords, 8);
  const out: Border[] = [];
  let current: string | null = null;
  for (const s of samples) {
    const code = countryAt(s.pt);
    if (!code) continue;
    if (current && code !== current) out.push({ pt: s.pt, from: current, to: code });
    current = code;
  }
  return out;
}
