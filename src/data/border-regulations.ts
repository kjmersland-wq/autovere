/**
 * Lightweight, hand-curated cross-border regulation reference — medication,
 * pets, customs, prohibited vehicle gear and controlled substances — for the
 * 16 European core markets plus Switzerland, the UK, Ireland and Malta where
 * a rule specifically names them. General guidance only, not legal advice —
 * always intentionally hedged toward "check before you travel" rather than
 * stated as an exhaustive, unchanging legal fact.
 *
 * Small and hand-authored (not extracted/scraped), so it's a plain static
 * import — no lazy-loading needed the way the multi-thousand-entry EV/fuel/
 * POI datasets require.
 */

export type BorderRuleCategory = "medication" | "pets" | "customs" | "prohibited_gear" | "substances";

export type BorderRuleSeverity = "info" | "warning" | "critical";

export type BorderRule = {
  id: string;
  category: BorderRuleCategory;
  severity: BorderRuleSeverity;
  /** ISO-3166-1 alpha-2 codes this rule applies to, or "any" for a rule that
   * applies whenever the trip crosses any international border at all. */
  countries: string[] | "any";
  /** English source string — translated via tr() in every locale. */
  title: string;
  detail: string;
};

export type CountryRegulation = {
  code: string;
  rules: BorderRule[];
};

export const BORDER_RULES: BorderRule[] = [
  {
    id: "medication-controlled-schengen",
    category: "medication",
    severity: "warning",
    countries: ["NO", "SE", "DK", "DE", "AT", "CH", "IT", "FR", "NL", "CZ", "SI", "ES", "PL", "SK", "BE", "HR"],
    title: "Carrying prescription medication across Schengen borders",
    detail:
      "Carrying controlled medications — ADHD medication, strong painkillers, sedatives? Bring your prescription, and for longer stays a Schengen medical certificate signed by your doctor. Requirements vary by country — check with the destination's embassy or a pharmacy if you're unsure.",
  },
  {
    id: "medication-prescription-validity",
    category: "medication",
    severity: "info",
    countries: "any",
    title: "How long your prescription travels with you",
    detail:
      "A standard prescription typically covers up to a 30-day supply across a border without extra paperwork. For longer trips (up to 90 days), carry a doctor's certificate confirming the medication, dosage and your treatment.",
  },
  {
    id: "medication-non-schengen-transit",
    category: "medication",
    severity: "warning",
    countries: ["GB"],
    title: "Transiting non-Schengen countries (e.g. the UK) with medication",
    detail:
      "The UK sits outside Schengen and applies its own rules for controlled substances. Carry an official letter from your physician stating what you're carrying and why, and check current UK Border Force guidance before you travel.",
  },
  {
    id: "pets-eu-pet-passport",
    category: "pets",
    severity: "warning",
    countries: ["NO", "SE", "DK", "DE", "AT", "CH", "IT", "FR", "NL", "CZ", "SI", "ES", "PL", "SK", "BE", "HR"],
    title: "Microchip, rabies vaccination & EU Pet Passport",
    detail:
      "Dogs and cats need an ISO microchip, a valid rabies vaccination (at least 21 days old) and an EU Pet Passport (or animal health certificate) to cross into and within the EU/Schengen area.",
  },
  {
    id: "pets-echinococcus",
    category: "pets",
    severity: "critical",
    countries: ["NO", "GB", "IE", "FI", "MT"],
    title: "Tapeworm (Echinococcus) treatment before entry",
    detail:
      "Norway, the UK, Ireland, Finland and Malta require dogs to be treated for tapeworm (Echinococcus) by a vet 24-120 hours before arrival, recorded in the pet passport. Time it carefully — too early or too late and it won't count.",
  },
  {
    id: "pets-breed-restrictions",
    category: "pets",
    severity: "warning",
    countries: ["FR", "DE", "DK"],
    title: "Restricted dog breeds",
    detail:
      "France, Germany and Denmark restrict or ban certain breeds (including Pit Bull-type and American Staffordshire Terriers) from entry, or require special permits and muzzling in public. Check the current breed list before you travel with one.",
  },
  {
    id: "customs-eu-indicative-limits",
    category: "customs",
    severity: "info",
    countries: ["SE", "DK", "DE", "AT", "IT", "FR", "NL", "CZ", "SI", "ES", "PL", "SK", "BE", "HR"],
    title: "Moving alcohol & tobacco within the EU",
    detail:
      "Within the EU there's no fixed duty-free limit for personal alcohol and tobacco, but customs use indicative guidance levels (around 10L spirits, 90L wine, 800 cigarettes) as a rule of thumb for what counts as personal use.",
  },
  {
    id: "customs-norway-switzerland",
    category: "customs",
    severity: "warning",
    countries: ["NO", "CH"],
    title: "Norway and Switzerland enforce strict duty-free limits",
    detail:
      "Norway and Switzerland sit outside the EU customs union and apply tight, strictly enforced allowances for alcohol and tobacco — commonly around 1L spirits and 200 cigarettes per adult. Exceeding them means declaring and paying duty at the border.",
  },
  {
    id: "gear-radar-detectors",
    category: "prohibited_gear",
    severity: "critical",
    countries: ["FR", "CH", "DE"],
    title: "Radar and speed-camera detectors are illegal",
    detail:
      "France, Switzerland and Germany ban radar/laser detectors outright — even carrying one switched off can mean a fine and confiscation. GPS apps with fixed speed-camera alerts are usually fine; live radar detection is not.",
  },
  {
    id: "gear-dashcam-restrictions",
    category: "prohibited_gear",
    severity: "warning",
    countries: ["AT", "CH"],
    title: "Dashcam privacy restrictions",
    detail:
      "Austria and Switzerland treat continuous dashcam recording as a privacy-law issue — permanent recording of public roads can draw fines. Use event-triggered (loop) recording rather than always-on filming.",
  },
  {
    id: "gear-pepper-spray",
    category: "prohibited_gear",
    severity: "critical",
    countries: ["GB", "DK", "NL"],
    title: "Pepper spray counts as an illegal weapon",
    detail:
      "The UK, Denmark and the Netherlands classify pepper spray and similar self-defence sprays as prohibited weapons for civilians — carrying one across the border can lead to seizure and prosecution, even if it's legal where you started.",
  },
  {
    id: "substances-cannabis-cbd",
    category: "substances",
    severity: "critical",
    countries: "any",
    title: "Cannabis and CBD never cross a border legally",
    detail:
      "Even where cannabis or CBD is decriminalised or tolerated domestically, carrying it across any international border remains a criminal offence under international drug-trafficking law — regardless of the rules in either country.",
  },
];

/** Rules relevant to a route, given the ISO codes it actually touches (in
 * travel order) — a rule matches if any of its countries is on the route, or
 * (for "any") if the route crosses at least one border at all. */
export function rulesForRoute(countryCodes: string[]): BorderRule[] {
  const crossesBorder = new Set(countryCodes).size > 1;
  const touched = new Set(countryCodes);
  return BORDER_RULES.filter((rule) =>
    rule.countries === "any" ? crossesBorder : rule.countries.some((c) => touched.has(c)),
  );
}
