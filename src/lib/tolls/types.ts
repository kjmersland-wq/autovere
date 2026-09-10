/** How much to trust a toll number: "high" = matched against a live official source,
 * "medium" = curated official data that isn't route-matched, "low" = a rough per-km/country
 * average, "estimated" = no real data at all, shown as a wide range. Never claim "high" unless
 * the number came from an actual official source for this specific route. */
export type TollConfidence = "high" | "medium" | "low" | "estimated";

export type TollBreakdownLine = { label: string; amountNative: number };

export type TollProviderResult = {
  /** Cost in EUR — the app's internal accounting currency (see NOK_PER_EUR etc. in ../tolls.ts). */
  amountEur: number;
  confidence: TollConfidence;
  source: string;
  sourceUrl: string;
  /** CTA to a better external calculator/portal for this specific route — shown prominently
   * whenever confidence is "estimated", and as a normal link otherwise. */
  externalLink?: string;
  /** Native-currency breakdown (e.g. individual NOK toll stations) for the "show breakdown" UI. */
  breakdown?: TollBreakdownLine[];
  breakdownCurrency?: string;
  notes?: string;
};

/** Kept here (not in calc.ts) so this module never imports from calc.ts — calc.ts imports
 * this instead, avoiding a circular dependency. */
export type VehicleType = "petrol" | "diesel" | "ev";

export type TollVehicleProfile = {
  vehicle: VehicleType;
  autoPass: boolean;
  days: number;
};

export type LatLng = [number, number];
