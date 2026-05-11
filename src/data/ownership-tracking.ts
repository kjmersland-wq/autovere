/**
 * Ownership Tracking Data Architecture
 *
 * Types for owned vehicle tracking, charging cost estimates, service reminders,
 * battery health, mileage tracking. localStorage for now, Supabase-ready.
 */

export type GarageSlot = "owned" | "dream" | "comparing";

export interface GarageEntry {
  slug: string;
  slot: GarageSlot;
  addedAt: string;

  // Ownership data — populated when slot === 'owned'
  purchasedAt?: string;
  purchasePriceEur?: number;
  currentMileageKm?: number;
  annualMileageTargetKm?: number;

  // Charging setup
  chargingSetup?: "home" | "workplace" | "public-only";
  homeChargingTariffPerkWh?: number;   // user's home electricity rate

  // Service tracking
  lastServiceAt?: string;
  nextServiceDueKm?: number;
  lastTyreChangeAt?: string;
  nextTyreChangeDueKm?: number;
  lastBrakeCheckAt?: string;

  // Notes
  notes?: string;
}

export interface ChargeSession {
  id: string;
  vehicleSlug: string;
  date: string;
  locationName: string;
  networkId?: string;
  kwhAdded: number;
  costEur: number;
  chargerTypeKw: number;
  durationMinutes: number;
  stateOfChargeStart: number;
  stateOfChargeEnd: number;
}

export interface ServiceEntry {
  id: string;
  vehicleSlug: string;
  date: string;
  type: "annual-service" | "tyre-change" | "brake-check" | "software-update" | "other";
  description: string;
  costEur?: number;
  odometer?: number;
  nextDueAt?: string;
}

export interface MileageEntry {
  vehicleSlug: string;
  recordedAt: string;
  odometer: number;
}

export interface BatteryHealthEntry {
  vehicleSlug: string;
  recordedAt: string;
  capacityKwh: number;
  percentageRetained: number;
  source: "obd-scan" | "app-report" | "dealer-check" | "estimated";
}

// ---------------------------------------------------------------------------
// Ownership summary — computed from entries
// ---------------------------------------------------------------------------

export interface OwnershipSummary {
  vehicleSlug: string;
  totalChargingSpendEur: number;
  totalChargeSessionCount: number;
  totalKwhCharged: number;
  estimatedAnnualChargingCostEur: number;
  estimatedAnnualServiceCostEur: number;
  estimatedCurrentResidualValueEur?: number;
  estimatedBreakevenVsDieselYears?: number;
  latestBatteryHealthPct?: number;
  currentOdometerKm?: number;
}

// ---------------------------------------------------------------------------
// Service cost estimates by vehicle category (used for onboarding estimates)
// ---------------------------------------------------------------------------

export const ESTIMATED_ANNUAL_SERVICE_COST_EUR: Record<string, number> = {
  "tesla-model-y": 320,
  "bmw-ix": 680,
  "hyundai-ioniq-6": 280,
  "polestar-3": 450,
  "volvo-ex90": 480,
  "mercedes-eqs": 920,
  "skoda-enyaq": 260,
  "bmw-ix3": 580,
  "polestar-2": 380,
  "volkswagen-id-7": 290,
  "mercedes-eqe-suv": 840,
  "audi-q8-etron": 720,
};

export function estimateAnnualChargingCost(
  realWorldRangeKm: number,
  batteryKwh: number,
  annualKm: number,
  tariffPerkWh: number,
  chargingEfficiency = 0.88
): number {
  const kwhPer100km = (batteryKwh / realWorldRangeKm) * 100;
  const annualKwh = (annualKm / 100) * kwhPer100km;
  const grossKwh = annualKwh / chargingEfficiency;
  return Math.round(grossKwh * tariffPerkWh);
}

// ---------------------------------------------------------------------------
// Saved route architecture
// ---------------------------------------------------------------------------

export interface SavedRoute {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distanceKm: number;
  vehicleSlug: string;
  chargingStops: SavedChargingStop[];
  estimatedCostEur: number;
  estimatedTotalMinutes: number;
  savedAt: string;
  winterVariant?: boolean;
  preferredNetworks?: string[];
  notes?: string;
}

export interface SavedChargingStop {
  networkId: string;
  locationName: string;
  chargerKw: number;
  estimatedMinutes: number;
  estimatedCostEur: number;
  arrivalSocPct: number;
  departureSocPct: number;
}

// ---------------------------------------------------------------------------
// Watchlist
// ---------------------------------------------------------------------------

export type WatchlistAlertType =
  | "price-change"
  | "network-expansion"
  | "software-update"
  | "ownership-trend"
  | "battery-tech"
  | "new-review";

export interface WatchlistEntry {
  type: "vehicle" | "network" | "article-topic";
  slug: string;
  enabledAlerts: WatchlistAlertType[];
  addedAt: string;
  lastNotifiedAt?: string;
  notificationCount: number;
}

export const WATCHLIST_ALERT_LABELS: Record<WatchlistAlertType, string> = {
  "price-change": "Price changes",
  "network-expansion": "Network updates",
  "software-update": "Software updates",
  "ownership-trend": "Ownership signals",
  "battery-tech": "Battery tech",
  "new-review": "New reviews",
};
