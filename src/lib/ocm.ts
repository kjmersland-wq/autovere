/**
 * OCM live data types — mirrors the compact shape returned by our
 * ev-charging-data Edge Function.
 *
 * The frontend never talks to OCM directly; all calls go through the
 * Supabase Edge Function which holds the API key server-side.
 */

import type { ChargingConnector, ChargingProvider, ChargingSpeed, ChargingStation } from "@/data/ev-charging";

/** Shape returned by the ev-charging-data Edge Function. */
export interface OcmLiveStation {
  id: number;
  name: string;
  provider: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  corridor: string;
  location: string;
  coordinates: { lat: number; lng: number };
  maxKw: number;
  points: number;
  connectors: string[];
  speed: "HPC" | "DC" | "AC";
  available: number;
  total: number;
  distance: string;
  pricingHint: string;
  amenities: string[];
  sourceIds?: { openChargeMap?: number };
}

/** Cast an OcmLiveStation to the shared ChargingStation interface. */
export function ocmToStation(s: OcmLiveStation): ChargingStation {
  return {
    ...s,
    provider: s.provider as ChargingProvider,
    connectors: (s.connectors as ChargingConnector[]).filter((c) =>
      ["CCS", "CHAdeMO", "Type 2", "NACS"].includes(c)
    ),
    speed: s.speed as ChargingSpeed,
  };
}

/** List of supported European countries for the country selector. */
export const EUROPE_COUNTRIES: { code: string; name: string; center: { lat: number; lng: number } }[] = [
  { code: "NO", name: "Norway",      center: { lat: 63.0,  lng: 14.0 } },
  { code: "SE", name: "Sweden",      center: { lat: 63.0,  lng: 17.0 } },
  { code: "DK", name: "Denmark",     center: { lat: 56.0,  lng: 10.0 } },
  { code: "DE", name: "Germany",     center: { lat: 51.5,  lng: 10.0 } },
  { code: "NL", name: "Netherlands", center: { lat: 52.3,  lng: 5.3  } },
  { code: "FR", name: "France",      center: { lat: 46.5,  lng: 2.5  } },
  { code: "BE", name: "Belgium",     center: { lat: 50.5,  lng: 4.5  } },
  { code: "AT", name: "Austria",     center: { lat: 47.5,  lng: 14.0 } },
  { code: "CH", name: "Switzerland", center: { lat: 47.0,  lng: 8.0  } },
  { code: "IT", name: "Italy",       center: { lat: 42.5,  lng: 12.5 } },
  { code: "ES", name: "Spain",       center: { lat: 40.0,  lng: -4.0 } },
  { code: "PL", name: "Poland",      center: { lat: 52.0,  lng: 20.0 } },
];
