import { COUNTRY_NAMES, countryAt, type LatLng } from "./countries";
import { cumulativeKm, samplePolyline, type Charger, type RouteResult, type RouteVariantKey } from "./geo";
import {
  DEFAULT_ENERGY,
  DISTANCE_TOLLS,
  ENERGY_PRICES,
  NORDIC_BRIDGES,
  VIGNETTES,
  vignetteFor,
} from "./tolls";

export type VehicleType = "petrol" | "diesel" | "ev";

export type TripInput = {
  vehicle: VehicleType;
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

const ROUTE_TIME_FACTOR: Record<RouteVariantKey, number> = {
  fastest: 1,
  bypass: 1,
  tollfree: 1.27,
};

export type CountryLeg = { code: string; name: string; km: number };

export type CostLine = { label: string; detail: string; amount: number; country?: string | undefined };

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

function addNordicBridgeTolls(legs: CountryLeg[], tollLines: CostLine[]) {
  const denmark = legs.find((leg) => leg.code === "DK");
  if (!denmark || denmark.km < 40) return;

  tollLines.push({ ...NORDIC_BRIDGES.storebaelt });
  if (legs.some((leg) => leg.code === "SE")) tollLines.push({ ...NORDIC_BRIDGES.oresund });
}

export function estimate(
  key: RouteVariantKey,
  route: RouteResult,
  trip: TripInput,
  chargers: Charger[],
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

    const dt = DISTANCE_TOLLS[leg.code];
    if (dt && share > 0) {
      const amount = dt.perKm * leg.km * share;
      if (amount > 0.5)
        tollLines.push({
          label: `${leg.name} motorway tolls`,
          detail: `${Math.round(leg.km * share)} km tolled · ${dt.perKm.toFixed(3)} €/km`,
          amount,
          country: leg.code,
        });
    }

    if (VIGNETTES[leg.code] && key !== "tollfree") {
      const tier = vignetteFor(leg.code, trip.days);
      if (tier)
        vignetteLines.push({
          label: `${leg.name} — ${tier.label}`,
          detail: VIGNETTES[leg.code]!.authority,
          amount: tier.price,
          country: leg.code,
        });
    }
  }

  addNordicBridgeTolls(legs, tollLines);

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
    durationMin:
      route.durationMin * ROUTE_TIME_FACTOR[key] +
      (key === "bypass" ? Math.min(35, Math.max(15, route.distanceKm / 100)) : 0) +
      (ev ? ev.chargingMinutes : 0),
    legs,
    energyCost,
    tollCost,
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
