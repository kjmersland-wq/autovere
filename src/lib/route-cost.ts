/**
 * Cost & toll model for the European EV route planner.
 * All numbers are public estimates and clearly labelled as such in the UI.
 */

export type CountryCode = string; // ISO-3166-1 alpha-2

export interface VehicleProfile {
  // EV
  evConsumptionKwhPer100: number;   // kWh/100 km
  evRangeKm: number;                // realistic motorway range
  evChargeFromPct: number;          // SoC start of stop
  evChargeToPct: number;            // SoC end of stop
  evChargeMinutesPerStop: number;   // wall time per stop
  evPricePerKwh: number;            // €
  // ICE comparison
  iceConsumptionLPer100: number;    // L/100 km
  icePricePerL: number;             // €
}

export const DEFAULT_VEHICLE: VehicleProfile = {
  evConsumptionKwhPer100: 18,
  evRangeKm: 350,
  evChargeFromPct: 15,
  evChargeToPct: 80,
  evChargeMinutesPerStop: 25,
  evPricePerKwh: 0.45,
  iceConsumptionLPer100: 6.5,
  icePricePerL: 1.85,
};

/** € per 100 km of motorway driving in that country (rough avg). EV factor scales it. */
export interface TollProfile {
  perHundredKm: number;
  evFactor: number;
  note?: string;
}

export const TOLL_BY_COUNTRY: Record<CountryCode, TollProfile> = {
  NO: { perHundredKm: 1.2,  evFactor: 0.5, note: "Norske bomringer — EV ca 50 % rabatt" },
  FR: { perHundredKm: 9.5,  evFactor: 1.0, note: "Autoroute péage" },
  IT: { perHundredKm: 7.0,  evFactor: 1.0, note: "Autostrada pedaggio" },
  ES: { perHundredKm: 8.0,  evFactor: 1.0, note: "Autopista de peaje" },
  PT: { perHundredKm: 6.5,  evFactor: 0.75, note: "Portagens — EV-rabatt på enkelte strekninger" },
  AT: { perHundredKm: 1.0,  evFactor: 1.0, note: "Vignette + spesialstrekninger" },
  CH: { perHundredKm: 0.5,  evFactor: 1.0, note: "Vignette CHF 40/år" },
  GR: { perHundredKm: 5.0,  evFactor: 1.0 },
  HR: { perHundredKm: 6.0,  evFactor: 1.0 },
  PL: { perHundredKm: 2.5,  evFactor: 1.0, note: "A1/A2/A4 betalstrekninger" },
  CZ: { perHundredKm: 0.8,  evFactor: 0.0, note: "Vignette — EV gratis" },
  SK: { perHundredKm: 0.8,  evFactor: 1.0, note: "Vignette" },
  HU: { perHundredKm: 1.5,  evFactor: 1.0, note: "Vignette" },
  SI: { perHundredKm: 1.2,  evFactor: 1.0, note: "Vignette" },
  RO: { perHundredKm: 0.5,  evFactor: 1.0 },
  BG: { perHundredKm: 0.5,  evFactor: 1.0 },
  // Free for cars:
  DE: { perHundredKm: 0, evFactor: 1.0 },
  SE: { perHundredKm: 0, evFactor: 1.0 },
  DK: { perHundredKm: 0, evFactor: 1.0, note: "Storebælt/Øresund egne avgifter" },
  NL: { perHundredKm: 0, evFactor: 1.0 },
  BE: { perHundredKm: 0, evFactor: 1.0 },
  LU: { perHundredKm: 0, evFactor: 1.0 },
  FI: { perHundredKm: 0, evFactor: 1.0 },
  IE: { perHundredKm: 0, evFactor: 1.0 },
  GB: { perHundredKm: 0, evFactor: 1.0 },
  EE: { perHundredKm: 0, evFactor: 1.0 },
  LV: { perHundredKm: 0, evFactor: 1.0 },
  LT: { perHundredKm: 0, evFactor: 1.0 },
  IS: { perHundredKm: 0, evFactor: 1.0 },
};

export interface ChargingStop {
  index: number;
  approxKmFromStart: number;
  lat: number;
  lon: number;
  energyKwh: number;
  minutes: number;
  cost: number;
}

export interface RoutePlan {
  distanceKm: number;
  drivingMinutes: number;
  chargingMinutes: number;
  totalMinutes: number;
  stops: ChargingStop[];
  evEnergyKwh: number;
  evCost: number;        // € charging only
  iceFuelL: number;
  iceCost: number;
  tollEv: number;
  tollIce: number;
  tollBreakdown: { country: CountryCode; km: number; ev: number; ice: number }[];
  totalEv: number;       // charging + toll
  totalIce: number;      // fuel + toll
  savings: number;       // ICE − EV
}

/** Sample N evenly spaced points along a coordinate path (lon,lat pairs from OSRM geojson). */
export function samplePath(coords: [number, number][], n: number): [number, number][] {
  if (coords.length <= n) return coords;
  const step = (coords.length - 1) / (n - 1);
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) out.push(coords[Math.round(i * step)]);
  return out;
}

/** Pick stops at even km intervals along the path. */
export function pickStops(
  coords: [number, number][],
  totalKm: number,
  vehicle: VehicleProfile,
): ChargingStop[] {
  const usableRange = vehicle.evRangeKm * ((vehicle.evChargeToPct - vehicle.evChargeFromPct) / 100);
  const numStops = Math.max(0, Math.ceil(totalKm / vehicle.evRangeKm) - 1);
  if (numStops === 0) return [];
  const energyPerStop =
    ((vehicle.evChargeToPct - vehicle.evChargeFromPct) / 100) *
    (vehicle.evRangeKm * (vehicle.evConsumptionKwhPer100 / 100));
  const stops: ChargingStop[] = [];
  for (let i = 1; i <= numStops; i++) {
    const fraction = i / (numStops + 1);
    const idx = Math.min(coords.length - 1, Math.round(fraction * (coords.length - 1)));
    const [lon, lat] = coords[idx];
    stops.push({
      index: i,
      approxKmFromStart: Math.round(totalKm * fraction),
      lat, lon,
      energyKwh: Math.round(energyPerStop * 10) / 10,
      minutes: vehicle.evChargeMinutesPerStop,
      cost: Math.round(energyPerStop * vehicle.evPricePerKwh * 100) / 100,
    });
  }
  return stops;
}

export interface CountrySegment { country: CountryCode; km: number; }

export function computePlan(
  distanceKm: number,
  drivingMinutes: number,
  coords: [number, number][],
  countrySegments: CountrySegment[],
  vehicle: VehicleProfile = DEFAULT_VEHICLE,
): RoutePlan {
  const stops = pickStops(coords, distanceKm, vehicle);
  const chargingMinutes = stops.reduce((s, x) => s + x.minutes, 0);
  const evEnergyKwh = (distanceKm * vehicle.evConsumptionKwhPer100) / 100;
  const evCost = Math.round(stops.reduce((s, x) => s + x.cost, 0) * 100) / 100;
  const iceFuelL = (distanceKm * vehicle.iceConsumptionLPer100) / 100;
  const iceCost = Math.round(iceFuelL * vehicle.icePricePerL * 100) / 100;

  const tollBreakdown = countrySegments.map((seg) => {
    const t = TOLL_BY_COUNTRY[seg.country] ?? { perHundredKm: 0, evFactor: 1 };
    const ice = Math.round((seg.km / 100) * t.perHundredKm * 100) / 100;
    const ev  = Math.round(ice * t.evFactor * 100) / 100;
    return { country: seg.country, km: Math.round(seg.km), ev, ice };
  }).filter((s) => s.km > 0);

  const tollIce = Math.round(tollBreakdown.reduce((s, x) => s + x.ice, 0) * 100) / 100;
  const tollEv  = Math.round(tollBreakdown.reduce((s, x) => s + x.ev,  0) * 100) / 100;

  const totalEv  = Math.round((evCost + tollEv)  * 100) / 100;
  const totalIce = Math.round((iceCost + tollIce) * 100) / 100;

  return {
    distanceKm: Math.round(distanceKm),
    drivingMinutes: Math.round(drivingMinutes),
    chargingMinutes,
    totalMinutes: Math.round(drivingMinutes) + chargingMinutes,
    stops,
    evEnergyKwh: Math.round(evEnergyKwh),
    evCost,
    iceFuelL: Math.round(iceFuelL * 10) / 10,
    iceCost,
    tollEv,
    tollIce,
    tollBreakdown,
    totalEv,
    totalIce,
    savings: Math.round((totalIce - totalEv) * 100) / 100,
  };
}

export function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m} min`;
  return `${h} t ${m} min`;
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

export function formatTime(d: Date): string {
  return d.toLocaleString("nb-NO", {
    weekday: "short", day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
}
