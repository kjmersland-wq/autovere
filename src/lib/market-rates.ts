/**
 * Base market rates for EV fast charging and forecourt fuel.
 *
 * Everything is normalised to EUR so the currency layer can convert a single
 * number into whatever the visitor selected (NOK, DKK, SEK, PLN, USD …).
 * Reference points are the published operator tariffs and national pump
 * averages listed in the AutoVere pricing brief.
 */

/** Units per 1 EUR — mirrors src/lib/currency.ts reference rates. */
const NOK = 11.6;
const DKK = 7.46;
const SEK = 11.3;
const PLN = 4.31;

export type OperatorRate = {
  /** Ad-hoc / non-member price per kWh in EUR. */
  eur: number;
  /** Subscription / member price per kWh in EUR, when the operator offers one. */
  memberEur?: number;
  /** Name of the membership tier, for display. */
  memberLabel?: string;
};

/** Ad-hoc fast-charging rates per kWh, expressed in EUR. */
export const OPERATOR_KWH: { match: RegExp; label: string; rate: OperatorRate }[] = [
  { match: /tesla/i, label: "Tesla Supercharger", rate: { eur: 0.42, memberEur: 0.33, memberLabel: "Member" } },
  { match: /ionity/i, label: "Ionity", rate: { eur: 0.69, memberEur: 0.39, memberLabel: "Passport" } },
  { match: /clever/i, label: "Clever", rate: { eur: 4.2 / DKK } },
  { match: /spirii/i, label: "Spirii", rate: { eur: 3.99 / DKK } },
  { match: /enbw/i, label: "EnBW mobility+", rate: { eur: 0.59 } },
  { match: /aral/i, label: "Aral pulse", rate: { eur: 0.61 } },
  { match: /greenway/i, label: "GreenWay Polska", rate: { eur: 2.3 / PLN } },
  { match: /orlen/i, label: "Orlen Charge", rate: { eur: 2.4 / PLN } },
  { match: /elocity|eleport|polenergia/i, label: "Polish regional HPC", rate: { eur: 2.35 / PLN } },
  { match: /lidl|kaufland/i, label: "Retail fast charging", rate: { eur: 0.49 } },
  { match: /fastned/i, label: "Fastned", rate: { eur: 0.59 } },
  { match: /allego/i, label: "Allego", rate: { eur: 0.69 } },
  { match: /shell recharge|bp pulse|electra|powerdot/i, label: "European roaming HPC", rate: { eur: 0.59 } },
  { match: /circle k|e\.on|vattenfall|cez/i, label: "Regional fast charging", rate: { eur: 0.55 } },
  { match: /recharge|mer\b/i, label: "Recharge / Mer", rate: { eur: 5.9 / NOK } },
  { match: /electrify america/i, label: "Electrify America", rate: { eur: 0.44 } },
  { match: /electrify canada/i, label: "Electrify Canada", rate: { eur: 0.4 } },
  { match: /evgo|chargepoint/i, label: "EVgo / ChargePoint", rate: { eur: 0.46 } },
  { match: /flo|circuit|petro-canada/i, label: "FLO / Circuit électrique", rate: { eur: 0.35 } },
  { match: /instavolt|gridserve/i, label: "InstaVolt / Gridserve", rate: { eur: 0.68 } },
];

/** Fallback ad-hoc CCS rate per kWh in EUR when the operator is unknown. */
export const DEFAULT_KWH_EUR = 0.55;

/** Ad-hoc price per kWh in EUR for a charging operator / hub name. */
export function operatorKwhEur(name: string): number {
  return OPERATOR_KWH.find((o) => o.match.test(name))?.rate.eur ?? DEFAULT_KWH_EUR;
}

/** Full rate card (ad-hoc plus membership) for a charging operator. */
export function operatorRate(name: string): OperatorRate {
  return OPERATOR_KWH.find((o) => o.match.test(name))?.rate ?? { eur: DEFAULT_KWH_EUR };
}

export type FuelRate = { petrol: number; diesel: number; motorwayPetrol?: number; motorwayDiesel?: number };

/** Pump averages per litre, expressed in EUR. */
export const COUNTRY_FUEL: Record<string, FuelRate> = {
  Norway: { petrol: 21.8 / NOK, diesel: 22.3 / NOK },
  Denmark: { petrol: 14.8 / DKK, diesel: 13.9 / DKK },
  Sweden: { petrol: 18.2 / SEK, diesel: 18.9 / SEK },
  Poland: { petrol: 6.6 / PLN, diesel: 6.75 / PLN },
  Germany: { petrol: 1.82, diesel: 1.72, motorwayPetrol: 2.15, motorwayDiesel: 2.05 },
  France: { petrol: 1.82, diesel: 1.72 },
  Austria: { petrol: 1.65, diesel: 1.6 },
  Italy: { petrol: 1.88, diesel: 1.8 },
  Switzerland: { petrol: 1.86, diesel: 1.94 },
  Netherlands: { petrol: 2.05, diesel: 1.79 },
  Belgium: { petrol: 1.78, diesel: 1.75 },
  Spain: { petrol: 1.62, diesel: 1.55 },
  Slovenia: { petrol: 1.6, diesel: 1.55 },
  Czechia: { petrol: 1.58, diesel: 1.55 },
  Hungary: { petrol: 1.55, diesel: 1.58 },
  "United Kingdom": { petrol: 1.68, diesel: 1.76 },
  "United States": { petrol: 0.92, diesel: 1.03 },
  Canada: { petrol: 1.12, diesel: 1.2 },
};

const DEFAULT_FUEL: FuelRate = { petrol: 1.79, diesel: 1.72 };

/** Petrol 95 and diesel price per litre in EUR for a country label. */
export function countryFuelEur(country: string): FuelRate {
  const key = Object.keys(COUNTRY_FUEL).find((c) => country.toLowerCase().includes(c.toLowerCase()));
  return key ? COUNTRY_FUEL[key]! : DEFAULT_FUEL;
}
