/**
 * Corridor proximity helpers — every "along the route" section is filtered
 * strictly against the real routed polyline, never against free-text matching.
 */

export type LatLng = [number, number];

export interface GeoPoint {
  lat: number;
  lng: number;
}

export function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const la1 = (aLat * Math.PI) / 180;
  const la2 = (bLat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Shortest distance in km from a point to any vertex of the routed polyline. */
export function distanceToCorridorKm(
  coords: LatLng[] | undefined | null,
  point: GeoPoint,
): number {
  if (!coords || coords.length === 0) return Number.POSITIVE_INFINITY;
  let best = Number.POSITIVE_INFINITY;
  for (const c of coords) {
    const d = haversineKm(c[0], c[1], point.lat, point.lng);
    if (d < best) best = d;
    if (best < 1) break;
  }
  return best;
}

/** True when the point sits inside a `radiusKm` corridor around the polyline. */
export function nearCorridor(
  coords: LatLng[] | undefined | null,
  point: GeoPoint | undefined | null,
  radiusKm: number,
): boolean {
  if (!point) return false;
  return distanceToCorridorKm(coords, point) <= radiusKm;
}

/** Keeps only items whose coordinates fall inside the corridor. */
export function filterByCorridor<T extends { lat?: number; lng?: number }>(
  items: T[],
  coords: LatLng[] | undefined | null,
  radiusKm: number,
): T[] {
  if (!coords || coords.length === 0) return [];
  return items.filter((i) =>
    typeof i.lat === "number" && typeof i.lng === "number"
      ? nearCorridor(coords, { lat: i.lat, lng: i.lng }, radiusKm)
      : false,
  );
}

/** Ordered country-pair list (["DK","DE"], ["DE","PL"]) from the routed legs. */
export function borderPairs(codes: string[]): [string, string][] {
  const pairs: [string, string][] = [];
  for (let i = 1; i < codes.length; i += 1) {
    const a = codes[i - 1]!;
    const b = codes[i]!;
    if (a && b && a !== b) pairs.push([a, b]);
  }
  return pairs;
}
