/**
 * Cost & toll model for the European EV route planner.
 * All numbers are public estimates and clearly labelled as such in the UI.
 */

export type CountryCode = string; // ISO-3166-1 alpha-2

export interface VehicleProfile {
  // EV
  evConsumptionKwhPer100: number;
  evRangeKm: number;
  evChargeFromPct: number;
  evChargeToPct: number;
  evChargeMinutesPerStop: number;
  evPricePerKwh: number;            // fallback / "egen pris"
  network?: ChargingNetworkId;      // 'cheapest' (default) or specific
  hasMembership?: boolean;
  // ICE comparison
  iceConsumptionLPer100: number;
  icePricePerL: number;
}

export const DEFAULT_VEHICLE: VehicleProfile = {
  evConsumptionKwhPer100: 18,
  evRangeKm: 350,
  evChargeFromPct: 15,
  evChargeToPct: 80,
  evChargeMinutesPerStop: 25,
  evPricePerKwh: 0.45,
  network: "cheapest",
  hasMembership: true,
  iceConsumptionLPer100: 6.5,
  icePricePerL: 1.85,
};

// ─── Charging networks (public list prices, EU averages, ad-hoc DC fast) ─
export type ChargingNetworkId =
  | "cheapest" | "tesla" | "ionity" | "fastned" | "allego" | "recharge"
  | "mer" | "eviny" | "circlek" | "shell" | "plugsurfing" | "elli" | "custom";

export interface ChargingNetwork {
  id: ChargingNetworkId;
  name: string;
  adHocPerKwh: number;       // €/kWh public DC fast (EU avg)
  memberPerKwh?: number;     // €/kWh with subscription
  note?: string;
  color: string;
}

export const CHARGING_NETWORKS: ChargingNetwork[] = [
  { id: "cheapest",    name: "Billigste på ruten",      adHocPerKwh: 0.00,                       note: "Plukker laveste pris per stopp", color: "#10b981" },
  { id: "tesla",       name: "Tesla Supercharger",      adHocPerKwh: 0.55, memberPerKwh: 0.39,   note: "Tesla-abonnement",               color: "#e31937" },
  { id: "ionity",      name: "IONITY",                  adHocPerKwh: 0.69, memberPerKwh: 0.39,   note: "Power / Passport",               color: "#1f2a44" },
  { id: "fastned",     name: "Fastned",                 adHocPerKwh: 0.59, memberPerKwh: 0.35,   note: "Gold Member",                    color: "#f5c518" },
  { id: "allego",      name: "Allego",                  adHocPerKwh: 0.65, memberPerKwh: 0.45,   note: "Smoov / app",                    color: "#ff5a00" },
  { id: "recharge",    name: "Recharge (Norden)",       adHocPerKwh: 0.62, memberPerKwh: 0.49,   note: "Fastpris-medlemskap",            color: "#00b388" },
  { id: "mer",         name: "Mer",                     adHocPerKwh: 0.59, memberPerKwh: 0.45,   note: "Mer Connect",                    color: "#7c3aed" },
  { id: "eviny",       name: "Eviny",                   adHocPerKwh: 0.61, memberPerKwh: 0.47,   note: "Pluss-medlem",                   color: "#0ea5e9" },
  { id: "circlek",     name: "Circle K Charge",         adHocPerKwh: 0.64, memberPerKwh: 0.49,   note: "Extra Club",                     color: "#dc2626" },
  { id: "shell",       name: "Shell Recharge",          adHocPerKwh: 0.69, memberPerKwh: 0.55,   note: "Go+ medlem",                     color: "#facc15" },
  { id: "plugsurfing", name: "Plugsurfing (roaming)",   adHocPerKwh: 0.69,                       note: "Roaming-tariff",                 color: "#22d3ee" },
  { id: "elli",        name: "Elli (VW We Charge)",     adHocPerKwh: 0.61, memberPerKwh: 0.49,   note: "We Charge Plus",                 color: "#94a3b8" },
  { id: "custom",      name: "Egen pris (avansert)",    adHocPerKwh: 0.45,                       note: "Bruker felt under",              color: "#64748b" },
];

export function networkById(id?: ChargingNetworkId): ChargingNetwork {
  return CHARGING_NETWORKS.find((n) => n.id === id) ?? CHARGING_NETWORKS[0];
}

export function effectivePrice(net: ChargingNetwork, hasMembership: boolean, fallback: number): number {
  if (net.id === "custom") return fallback;
  if (net.id === "cheapest") {
    const real = CHARGING_NETWORKS.filter((n) => n.id !== "cheapest" && n.id !== "custom");
    return Math.min(...real.map((n) => (hasMembership && n.memberPerKwh) ? n.memberPerKwh : n.adHocPerKwh));
  }
  return (hasMembership && net.memberPerKwh) ? net.memberPerKwh : net.adHocPerKwh;
}

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
  networkId: ChargingNetworkId;
  networkName: string;
  pricePerKwh: number;
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

  const chosen = networkById(vehicle.network ?? "cheapest");
  const hasMembership = !!vehicle.hasMembership;
  // Pre-compute the network actually used per stop. For "cheapest" we pick the
  // single cheapest network available (member or ad-hoc). For any explicit
  // choice we just use that one.
  const real = CHARGING_NETWORKS.filter((n) => n.id !== "cheapest" && n.id !== "custom");
  const cheapest = real.reduce((best, n) => {
    const p = (hasMembership && n.memberPerKwh) ? n.memberPerKwh : n.adHocPerKwh;
    const bp = (hasMembership && best.memberPerKwh) ? best.memberPerKwh : best.adHocPerKwh;
    return p < bp ? n : best;
  }, real[0]);
  const stopNetwork = chosen.id === "cheapest" ? cheapest : chosen;
  const pricePerKwh = effectivePrice(chosen, hasMembership, vehicle.evPricePerKwh);

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
      cost: Math.round(energyPerStop * pricePerKwh * 100) / 100,
      networkId: stopNetwork.id,
      networkName: stopNetwork.name,
      pricePerKwh: Math.round(pricePerKwh * 100) / 100,
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
