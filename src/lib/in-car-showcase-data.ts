/**
 * Self-contained demo data for the /partners/in-car executive showcase.
 * Deliberately independent of the real trip-cost engine (src/lib/trip-data.ts,
 * route-tolls.ts, etc.) — this is illustrative B2B presentation content only,
 * not a live calculation, so it can never drift from or affect real user-facing
 * cost figures.
 */

export type RouteKey = "a" | "b" | "c";
export type VehicleKey = "ev" | "motorhome" | "motorcycle";
export type LangKey = "en" | "no" | "de" | "fi" | "fr";

export const ROUTES: { key: RouteKey; label: string; short: string; milestones: string[]; distanceKm: number }[] = [
  {
    key: "a",
    label: "München → Verona (Cross-Border Alps)",
    short: "München → Verona",
    milestones: ["München, DE", "Brenner Pass, AT/IT", "Bozen/Bolzano, IT", "Verona, IT"],
    distanceKm: 430,
  },
  {
    key: "b",
    label: "Oslo → Bergen (Fjords, Bridges & Ferries)",
    short: "Oslo → Bergen",
    milestones: ["Oslo, NO", "Hallingdal", "Ferry · Lærdal–Kaupanger", "Bergen, NO"],
    distanceKm: 305,
  },
  {
    key: "c",
    label: "Denver → Moab (US Interstate & Passes)",
    short: "Denver → Moab",
    milestones: ["Denver, CO", "Vail Pass, CO", "Grand Junction, CO", "Moab, UT"],
    distanceKm: 550,
  },
];

export const VEHICLES: { key: VehicleKey; label: string }[] = [
  { key: "ev", label: "EV Sedan" },
  { key: "motorhome", label: "Motorhome >3.5t" },
  { key: "motorcycle", label: "Touring Motorcycle" },
];

export type TollLine = { country: string; operator: string; amount: number };
export type EnergyLine = {
  label: string;
  stop: string;
  amount: number;
  qty: number;
  unit: string;
  bufferPct?: number;
};
export type ComplianceLine = { level: "ok" | "warn"; title: string; detail: string };

type Snapshot = { tolls: TollLine[]; energy: EnergyLine; compliance: ComplianceLine };

/** [route][vehicle] → full cockpit snapshot. Hand-authored for demo fidelity. */
const MATRIX: Record<RouteKey, Record<VehicleKey, Snapshot>> = {
  a: {
    ev: {
      tolls: [
        { country: "Austria", operator: "ASFINAG (10-day vignette)", amount: 11.5 },
        { country: "Italy", operator: "Autostrade per l'Italia", amount: 38.9 },
      ],
      energy: { label: "EV Charging Stop", stop: "Ionity Brenner Pass", amount: 18.4, qty: 42, unit: "kWh", bufferPct: 75 },
      compliance: {
        level: "ok",
        title: "Green Zone Pass Verified (Zero Emissions)",
        detail: "Verona ZTL Città Alta clear — no restriction applies to zero-emission plates.",
      },
    },
    motorhome: {
      tolls: [
        { country: "Austria", operator: "ASFINAG GO-Box (per-km)", amount: 46.2 },
        { country: "Italy", operator: "Autostrade per l'Italia (Class 4)", amount: 61.8 },
      ],
      energy: { label: "Fuel Stop", stop: "Shell Innsbruck-Ost", amount: 74.3, qty: 61, unit: "L diesel" },
      compliance: {
        level: "warn",
        title: "⚠️ Attention: Weight >3.5t detected",
        detail: "GO-Box mandatory in Austria. Passenger vignette invalid — plate will be fined at the border.",
      },
    },
    motorcycle: {
      tolls: [
        { country: "Austria", operator: "ASFINAG (10-day vignette)", amount: 5.8 },
        { country: "Italy", operator: "Autostrade per l'Italia", amount: 21.4 },
      ],
      energy: { label: "Fuel Stop", stop: "Agip Bolzano Nord", amount: 12.6, qty: 11, unit: "L petrol" },
      compliance: {
        level: "ok",
        title: "Motorcycle Toll Discount Applied (Class 4)",
        detail: "Reduced two-wheeler tariff verified on both ASFINAG and Autostrade segments.",
      },
    },
  },
  b: {
    ev: {
      tolls: [
        { country: "Norway", operator: "AutoPASS city rings", amount: 9.4 },
        { country: "Norway · Ferry", operator: "Fjord1 (Lærdal–Kaupanger)", amount: 42.0 },
      ],
      energy: { label: "EV Charging Stop", stop: "Ionity Voss", amount: 14.2, qty: 38, unit: "kWh", bufferPct: 75 },
      compliance: {
        level: "ok",
        title: "Green Zone Pass Verified (Zero Emissions)",
        detail: "Bergen low-emission zone clear — EV toll exemption applied automatically on AutoPASS gantries.",
      },
    },
    motorhome: {
      tolls: [
        { country: "Norway", operator: "AutoPASS city rings", amount: 18.8 },
        { country: "Norway · Ferry", operator: "Fjord1 (oversized-vehicle tier)", amount: 96.0 },
      ],
      energy: { label: "Fuel Stop", stop: "Circle K Voss", amount: 89.1, qty: 66, unit: "L diesel" },
      compliance: {
        level: "warn",
        title: "⚠️ Attention: Length >7 m detected",
        detail: "Lærdal–Kaupanger ferry requires the oversized-vehicle fare tier — deck space must be pre-booked in high season.",
      },
    },
    motorcycle: {
      tolls: [
        { country: "Norway", operator: "AutoPASS city rings", amount: 0, },
        { country: "Norway · Ferry", operator: "Fjord1", amount: 21.0 },
      ],
      energy: { label: "Fuel Stop", stop: "Esso Hallingdal", amount: 9.8, qty: 9, unit: "L petrol" },
      compliance: {
        level: "ok",
        title: "Motorcycle Toll Discount Applied (Class 4)",
        detail: "AutoPASS two-wheeler exemption applied on every city-ring gantry along this corridor.",
      },
    },
  },
  c: {
    ev: {
      tolls: [{ country: "Colorado", operator: "I-70 Mountain Corridor / E-470", amount: 12.5 }],
      energy: { label: "EV Charging Stop", stop: "Tesla Supercharger, Glenwood Springs", amount: 21.1, qty: 46, unit: "kWh", bufferPct: 75 },
      compliance: {
        level: "ok",
        title: "Green Zone Pass Verified (Zero Emissions)",
        detail: "Colorado EV toll-corridor incentive active — reduced peak-hour rate applied automatically.",
      },
    },
    motorhome: {
      tolls: [{ country: "Colorado", operator: "I-70 Mountain Corridor (Class 4)", amount: 31.75 }],
      energy: { label: "Fuel Stop", stop: "Loves Travel Stop, Rifle CO", amount: 118.4, qty: 88, unit: "L diesel" },
      compliance: {
        level: "warn",
        title: "⚠️ Attention: Weight >3.5t detected",
        detail: "Vail Pass grade advisory: check brake temperature. Glenwood Canyon tunnels — clearance limit 4.11 m (13'6\").",
      },
    },
    motorcycle: {
      tolls: [{ country: "Colorado", operator: "I-70 Mountain Corridor", amount: 12.5 }],
      energy: { label: "Fuel Stop", stop: "Shell Vail", amount: 14.9, qty: 13, unit: "L petrol" },
      compliance: {
        level: "ok",
        title: "No Motorcycle Surcharge",
        detail: "This corridor carries no two-wheeler toll class — full expressway access at the standard car rate.",
      },
    },
  },
};

export function getSnapshot(route: RouteKey, vehicle: VehicleKey): Snapshot {
  return MATRIX[route][vehicle];
}

export const COCKPIT_STRINGS: Record<
  LangKey,
  {
    flag: string;
    name: string;
    gpsLocked: string;
    vehicleOnline: string;
    routeOverview: string;
    liveCostCompliance: string;
    tollsVignettes: string;
    energyOptimizer: string;
    complianceRadar: string;
    total: string;
    sendToMobile: string;
    scanCaption: string;
  }
> = {
  en: {
    flag: "🇬🇧",
    name: "English",
    gpsLocked: "GPS Locked",
    vehicleOnline: "Vehicle Online",
    routeOverview: "Route Overview",
    liveCostCompliance: "Live Cost & Compliance",
    tollsVignettes: "Tolls & Vignettes",
    energyOptimizer: "Energy / Fuel Optimizer",
    complianceRadar: "Compliance Radar",
    total: "Total this trip",
    sendToMobile: "Live Send-to-Mobile Test",
    scanCaption: "Scan to receive instant A4 Trip Dossier on your phone",
  },
  no: {
    flag: "🇳🇴",
    name: "Norsk",
    gpsLocked: "GPS låst",
    vehicleOnline: "Kjøretøy tilkoblet",
    routeOverview: "Ruteoversikt",
    liveCostCompliance: "Kostnad og regelverk i sanntid",
    tollsVignettes: "Bompenger og vignetter",
    energyOptimizer: "Energi-/drivstoffoptimering",
    complianceRadar: "Regelverksradar",
    total: "Totalt for turen",
    sendToMobile: "Send-til-mobil-test",
    scanCaption: "Skann for å motta en full reiserapport på telefonen",
  },
  de: {
    flag: "🇩🇪",
    name: "Deutsch",
    gpsLocked: "GPS gekoppelt",
    vehicleOnline: "Fahrzeug online",
    routeOverview: "Routenübersicht",
    liveCostCompliance: "Kosten & Vorschriften in Echtzeit",
    tollsVignettes: "Maut & Vignetten",
    energyOptimizer: "Energie-/Kraftstoffoptimierung",
    complianceRadar: "Compliance-Radar",
    total: "Gesamt für diese Fahrt",
    sendToMobile: "Live-Test: An Mobilgerät senden",
    scanCaption: "Scannen für das vollständige Reisedossier auf dem Smartphone",
  },
  fi: {
    flag: "🇫🇮",
    name: "Suomi",
    gpsLocked: "GPS lukittu",
    vehicleOnline: "Ajoneuvo yhdistetty",
    routeOverview: "Reittiyhteenveto",
    liveCostCompliance: "Kulut ja säädökset reaaliajassa",
    tollsVignettes: "Tietullit ja vinjetit",
    energyOptimizer: "Energia-/polttoaineoptimointi",
    complianceRadar: "Säädöstutka",
    total: "Yhteensä tälle matkalle",
    sendToMobile: "Lähetä puhelimeen -testi",
    scanCaption: "Skannaa saadaksesi koko matkaraportin puhelimeesi",
  },
  fr: {
    flag: "🇫🇷",
    name: "Français",
    gpsLocked: "GPS verrouillé",
    vehicleOnline: "Véhicule connecté",
    routeOverview: "Aperçu de l'itinéraire",
    liveCostCompliance: "Coûts et conformité en direct",
    tollsVignettes: "Péages et vignettes",
    energyOptimizer: "Optimisation énergie / carburant",
    complianceRadar: "Radar de conformité",
    total: "Total pour ce trajet",
    sendToMobile: "Test d'envoi vers mobile",
    scanCaption: "Scannez pour recevoir le dossier de voyage complet sur votre téléphone",
  },
};
