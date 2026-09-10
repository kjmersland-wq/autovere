// Norway toll provider — the one country with a real, live data source wired end to end.
//
// Server side (api/tolls/norway.ts) fetches candidate toll stations (NVDB vegobjekttype 45,
// "bomstasjon") for a bounding box around the trip and returns them unfiltered. This file does
// the actual route-matching (which stations does THIS specific route variant cross) and pricing
// on the client, so one server fetch can be reused for all three route variants (fastest/bypass/
// tollfree) instead of re-querying NVDB per variant.
//
// Matching approach and thresholds were verified against a real Oslo→Bergen route during
// development: NVDB toll-station points sit essentially on the road centerline (single-digit to
// low-double-digit metres from the OSRM polyline for stations genuinely on the route), while
// distinct nearby stations (e.g. a different lane/ramp of the same city toll ring) are also very
// close by — so a tight radius alone doesn't fully separate "on this route" from "on a parallel
// street a block away". Two mitigations: a 50m radius (tight enough that it essentially never
// pulls in a different physical road) and de-duplication by station name (Oslo/Bergen ring
// stations are frequently registered as two NVDB objects — one per direction/lane — a few metres
// apart; a one-way trip only ever crosses one of them).
import { haversineKm } from "../../geo";
import type { LatLng } from "../../countries";
import { NOK_PER_EUR, NORWAY_AUTOPASS } from "../../tolls";
import type { TollBreakdownLine, TollVehicleProfile } from "../types";

export type NorwayStationCandidate = {
  id: number;
  name: string | null;
  lat: number;
  lon: number;
  rateNok: number | null;
  rushRateNok: number | null;
  scheme: string | null;
  operatorUrl: string | null;
};

export type NorwayTollMatch = {
  amountEur: number;
  confidence: "high" | "estimated";
  source: string;
  sourceUrl: string;
  externalLink: string;
  breakdown: TollBreakdownLine[];
  breakdownCurrency: "NOK";
  notes: string | undefined;
};

/** Fetch candidate stations once for the whole trip (union bbox of every route variant, with
 * margin), so all three variants can be matched client-side without three NVDB round-trips. */
export async function fetchNorwayStationCandidates(
  coordsUnion: LatLng[],
  signal?: AbortSignal,
): Promise<NorwayStationCandidate[]> {
  if (!coordsUnion.length) return [];
  const lats = coordsUnion.map((c) => c[0]);
  const lons = coordsUnion.map((c) => c[1]);
  const margin = 0.03;
  const bbox = [
    Math.min(...lons) - margin,
    Math.min(...lats) - margin,
    Math.max(...lons) + margin,
    Math.max(...lats) + margin,
  ].join(",");
  const res = await fetch(`/api/tolls/norway?bbox=${encodeURIComponent(bbox)}`, {
    signal: signal ?? null,
  });
  if (!res.ok) throw new Error("Norway toll data unavailable");
  const data = (await res.json()) as { stations?: NorwayStationCandidate[] };
  return data.stations ?? [];
}

// Calibrated against a real Oslo→Bergen route during development: genuine on-route stations
// matched at up to ~44m; widening to 100m started pulling in adjacent-but-different gantries
// (e.g. a parallel ramp of the same city toll ring) the route doesn't actually cross, inflating
// the total. 50m keeps real matches while staying tight enough to exclude those near-misses.
const MATCH_RADIUS_KM = 0.05;
export const BOMKALK_URL = "https://bomkalk.no/";
export const NVDB_SOURCE = "Statens vegvesen NVDB API (vegobjekttype 45 — bomstasjoner)";
export const NVDB_SOURCE_URL = "https://nvdbapiles.atlas.vegvesen.no/";

/** EV pays max 70% of the full rate nationally (since 2023); AutoPASS gives a further 20% off. */
export function norwayDiscountMultiplier(
  vehicle: TollVehicleProfile["vehicle"],
  autoPass: boolean,
): number {
  if (vehicle !== "ev") return autoPass ? 0.8 : 1;
  return autoPass ? 0.56 : 0.7;
}

/** Match candidate NVDB stations against one route variant's polyline and price the crossing. */
export function matchNorwayToll(
  candidates: NorwayStationCandidate[],
  coords: LatLng[],
  vehicle: TollVehicleProfile,
): NorwayTollMatch | null {
  if (!candidates.length) return null;

  type Matched = NorwayStationCandidate & { distKm: number };
  const byName = new Map<string, Matched>();
  for (const station of candidates) {
    if (station.rateNok == null) continue;
    let best = Infinity;
    for (let i = 0; i < coords.length; i += 2) {
      const d = haversineKm([station.lat, station.lon], coords[i]!);
      if (d < best) best = d;
      if (best < 0.01) break;
    }
    if (best > MATCH_RADIUS_KM) continue;
    const key = station.name ?? `id-${station.id}`;
    const existing = byName.get(key);
    if (!existing || best < existing.distKm) byName.set(key, { ...station, distKm: best });
  }

  const matched = [...byName.values()].sort((a, b) => a.distKm - b.distKm);
  if (!matched.length) return null;

  const discount = norwayDiscountMultiplier(vehicle.vehicle, vehicle.autoPass);
  const totalNok = matched.reduce((sum, s) => sum + (s.rateNok ?? 0) * discount, 0);

  return {
    amountEur: totalNok / NOK_PER_EUR,
    confidence: "high",
    source: NVDB_SOURCE,
    sourceUrl: NVDB_SOURCE_URL,
    externalLink: BOMKALK_URL,
    breakdown: matched.map((s) => ({
      label: s.name ?? "Bomstasjon",
      amountNative: Math.round((s.rateNok ?? 0) * discount),
    })),
    breakdownCurrency: "NOK",
    notes: matched.some((s) => s.rushRateNok != null)
      ? "Some of these stations charge more in rush hour — this total uses the standard daytime rate."
      : undefined,
  };
}

/** Last-resort fallback when the NVDB fetch fails or nothing on this route matched (Del 3
 * requirement: never show nothing — show a wide interval and push hard toward bomkalk.no). */
export function estimatedNorwayToll(
  coords: LatLng[],
  norwayKm: number,
  vehicle: TollVehicleProfile,
): NorwayTollMatch | null {
  if (norwayKm <= 20) return null;
  const start = coords[0];
  const end = coords[coords.length - 1];
  if (!start || !end) return null;
  const nearOslo = haversineKm(start, [59.91, 10.75]) < 75;
  const reachesNorth = coords.some(([lat]) => lat > 62);
  const reachesWest = coords.some(([, lon]) => lon < 8.5);
  const reachesSweden = coords.some(([lat, lon]) => lat > 58.7 && lon > 10.8);
  let corridor: { label: string; amountNok: number } = NORWAY_AUTOPASS.city;
  if (reachesNorth || norwayKm > 800) corridor = NORWAY_AUTOPASS.e6North;
  else if (reachesWest) corridor = NORWAY_AUTOPASS.western;
  else if (reachesSweden) corridor = NORWAY_AUTOPASS.e6South;
  else if (nearOslo && norwayKm > 180) corridor = NORWAY_AUTOPASS.e18;

  const discount = norwayDiscountMultiplier(vehicle.vehicle, vehicle.autoPass);
  const midNok = corridor.amountNok * discount;
  return {
    amountEur: midNok / NOK_PER_EUR,
    confidence: "estimated",
    source: "AutoVere indicative corridor estimate (no NVDB stations matched this route)",
    sourceUrl: NVDB_SOURCE_URL,
    externalLink: BOMKALK_URL,
    breakdown: [
      { label: `${corridor.label} — low estimate`, amountNative: Math.round(midNok * 0.6) },
      { label: `${corridor.label} — high estimate`, amountNative: Math.round(midNok * 1.4) },
    ],
    breakdownCurrency: "NOK",
    notes: "Verify the exact amount on bomkalk.no before travelling.",
  };
}
