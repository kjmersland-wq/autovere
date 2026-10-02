import { AFFILIATES, affiliateUrl } from "@/config/affiliateLinks";

import type { RegionKey } from "./trip-data";

/**
 * Deep links for every point of interest in the app: map, official
 * website/photos and — where relevant — online ticket booking.
 */

export type PoiKind = "pass" | "ferry" | "camp" | "fuel" | "ev" | "toll" | "place";

const clean = (value: string) =>
  value
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

export function poiMapUrl(name: string, where?: string) {
  const q = clean([name, where].filter(Boolean).join(" "));
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

/** Official website / photo gallery lookup. */
export function poiWebUrl(name: string, where?: string, explicit?: string) {
  if (explicit) return explicit;
  const q = clean([name, where].filter(Boolean).join(" "));
  return `https://duckduckgo.com/?q=${encodeURIComponent(`${q} official site photos`)}&ia=web`;
}

const FERRY_PORTALS: Record<RegionKey, string> = {
  eu: affiliateUrl(AFFILIATES.ferries.directFerries),
  us: "https://www.ferrytickets.com/",
  ca: "https://www.bcferries.com/",
};

/** Online ticket / pitch booking. Returns null when nothing is bookable. */
export function poiBookingUrl(
  kind: PoiKind,
  name: string,
  region: RegionKey = "eu",
  explicit?: string,
): string | null {
  if (explicit) return explicit;
  const q = encodeURIComponent(clean(name));
  switch (kind) {
    case "ferry":
      return `${FERRY_PORTALS[region]}?q=${q}`;
    case "camp":
      // Portals ignore a ?q= parameter and open the same page for every site, so search for this exact place.
      return `https://duckduckgo.com/?q=${encodeURIComponent(`${clean(name)} book pitch online`)}&ia=web`;
    case "pass":
      return `https://duckduckgo.com/?q=${encodeURIComponent(`${clean(name)} toll ticket buy online`)}&ia=web`;
    case "toll":
      return `https://duckduckgo.com/?q=${encodeURIComponent(`${clean(name)} buy vignette online`)}&ia=web`;
    case "ev": // a charger can't be booked, and a generic portal link would be identical for every stop
    case "fuel":
    case "place":
    default:
      return null;
  }
}

export function poiLinks({
  kind,
  name,
  where,
  region = "eu",
  website,
  booking,
  coords,
}: {
  kind: PoiKind;
  name: string;
  where?: string | undefined;
  region?: RegionKey | undefined;
  website?: string | undefined;
  booking?: string | undefined;
  /** Exact spot [lat, lng]; used for the map pin when the name alone is too generic to search for. */
  coords?: [number, number] | undefined;
}) {
  return {
    map: coords
      ? `https://www.google.com/maps/search/?api=1&query=${coords[0].toFixed(5)},${coords[1].toFixed(5)}`
      : poiMapUrl(name, where),
    web: poiWebUrl(name, where, website),
    booking: poiBookingUrl(kind, name, region, booking),
  };
}
