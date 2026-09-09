/**
 * Programmatic SEO corridor dataset — 15 high-intent search corridors used
 * to generate static /routes/:slug landing pages. Real coordinates and
 * countries; vignette figures are imported directly from the same EU_RULES
 * table the live trip calculator uses (single source of truth, no
 * duplicated numbers to drift out of sync). Point-to-point toll totals
 * depend on the exact routed corridor, so they're given as clearly labelled
 * indicative ranges here — the page's whole purpose is to hand the visitor
 * off to the live planner for an exact, routed number.
 */

import { EU_RULES } from "@/lib/route-tolls";

export type LatLng = { lat: number; lng: number };

export type CorridorPoint = {
  name: string;
  coords: LatLng;
};

export type VehicleClass = "car" | "rv" | "ev" | "motorcycle";

export type CorridorCostEstimate = {
  /** Indicative range, e.g. "€45-70" — never a fake-precise single figure. */
  range: string;
  note: string;
};

export type CorridorVignette = {
  country: string;
  place: string;
  detail: string;
  /** Real, imported from EU_RULES — the same number the live planner uses. */
  amount: number;
  portalLabel: string;
  portalUrl: string;
};

export type CorridorFerry = {
  route: string;
  operator: string;
  affiliateUrl: string;
};

export type SEOCorridor = {
  slug: string;
  origin: CorridorPoint;
  destination: CorridorPoint;
  distanceKm: number;
  distanceMiles: number;
  /** ISO-3166-1 alpha-2 codes, in travel order. */
  countriesTraversed: string[];
  tollsOverview: Record<VehicleClass, CorridorCostEstimate>;
  vignetteRequirements: CorridorVignette[];
  ferryOptions: CorridorFerry[];
  borderAlertsSummary: string;
};

function kmToMi(km: number) {
  return Math.round(km * 0.621371);
}

function vignetteFor(code: string, portalLabel: string): CorridorVignette | null {
  const rule = EU_RULES[code]?.vignette;
  if (!rule) return null;
  return {
    country: code,
    place: rule.place,
    detail: rule.detail,
    amount: rule.amount,
    portalLabel,
    portalUrl: rule.portal?.url ?? "",
  };
}

function corridor(
  c: Omit<SEOCorridor, "distanceMiles" | "vignetteRequirements"> & {
    vignetteCountries: [code: string, portalLabel: string][];
  },
): SEOCorridor {
  const { vignetteCountries, ...rest } = c;
  return {
    ...rest,
    distanceMiles: kmToMi(c.distanceKm),
    vignetteRequirements: vignetteCountries
      .map(([code, label]) => vignetteFor(code, label))
      .filter((v): v is CorridorVignette => v !== null),
  };
}

export const SEO_CORRIDORS: SEOCorridor[] = [
  corridor({
    slug: "oslo-hamburg",
    origin: { name: "Oslo, Norway", coords: { lat: 59.9139, lng: 10.7522 } },
    destination: { name: "Hamburg, Germany", coords: { lat: 53.5511, lng: 9.9937 } },
    distanceKm: 950,
    countriesTraversed: ["NO", "SE", "DK", "DE"],
    tollsOverview: {
      car: { range: "€20-45", note: "Norwegian AutoPASS toll roads near Oslo/Kristiansand, billed automatically." },
      rv: { range: "€35-70", note: "Higher AutoPASS class for vehicles over 3.5t." },
      ev: { range: "€10-25", note: "Most Norwegian toll points give EVs a large automatic discount." },
      motorcycle: { range: "€5-15", note: "Motorcycles pay a reduced AutoPASS rate." },
    },
    vignetteCountries: [],
    ferryOptions: [
      { route: "Kristiansand (NO) – Hirtshals (DK)", operator: "Color Line / Fjordline", affiliateUrl: "https://www.colorline.com/" },
    ],
    borderAlertsSummary: "No EU vignette needed on this route — watch for Norwegian AutoPASS tolls and, if bringing a pet, the tapeworm treatment Norway requires before entry.",
  }),
  corridor({
    slug: "munich-brenner-lake-garda",
    origin: { name: "Munich, Germany", coords: { lat: 48.1351, lng: 11.582 } },
    destination: { name: "Lake Garda, Italy", coords: { lat: 45.6, lng: 10.6 } },
    distanceKm: 430,
    countriesTraversed: ["DE", "AT", "IT"],
    tollsOverview: {
      car: { range: "€25-40", note: "Austrian vignette plus Brenner motorway + Italian autostrada tolls to Lake Garda." },
      rv: { range: "€40-70", note: "Higher Austrian vignette class over 3.5t plus autostrada RV rate." },
      ev: { range: "€25-40", note: "Same vignette/toll exposure as a petrol car on this route." },
      motorcycle: { range: "€12-20", note: "Reduced Austrian vignette rate; lower autostrada motorcycle toll." },
    },
    vignetteCountries: [["AT", "ASFINAG"]],
    ferryOptions: [],
    borderAlertsSummary: "Austria requires a vignette for the Brenner motorway section — buy it before you cross. No further vignette needed in Italy, which tolls by distance instead.",
  }),
  corridor({
    slug: "dover-calais-paris-nice",
    origin: { name: "Dover, United Kingdom", coords: { lat: 51.1279, lng: 1.3134 } },
    destination: { name: "Nice, France", coords: { lat: 43.7102, lng: 7.262 } },
    distanceKm: 1250,
    countriesTraversed: ["GB", "FR"],
    tollsOverview: {
      car: { range: "€90-120", note: "French autoroute tolls Calais–Paris–Nice, plus the Channel crossing." },
      rv: { range: "€140-190", note: "Higher French autoroute class for vehicles over 3.5t." },
      ev: { range: "€90-120", note: "Same autoroute toll class as a petrol car in France." },
      motorcycle: { range: "€45-65", note: "French autoroutes give motorcycles roughly a 30% toll discount." },
    },
    vignetteCountries: [],
    ferryOptions: [
      { route: "Dover (GB) – Calais (FR)", operator: "P&O Ferries / DFDS", affiliateUrl: "https://www.poferries.com/" },
    ],
    borderAlertsSummary: "The UK is outside Schengen — carry passports and, if travelling with a pet, complete the UK's tapeworm treatment window before returning. No vignette needed in France; tolls are distance-based.",
  }),
  corridor({
    slug: "frankfurt-gotthard-milano",
    origin: { name: "Frankfurt, Germany", coords: { lat: 50.1109, lng: 8.6821 } },
    destination: { name: "Milan, Italy", coords: { lat: 45.4642, lng: 9.19 } },
    distanceKm: 600,
    countriesTraversed: ["DE", "CH", "IT"],
    tollsOverview: {
      car: { range: "€55-75", note: "Swiss annual e-vignette plus Italian autostrada tolls to Milan." },
      rv: { range: "€75-110", note: "Swiss heavy-vehicle charge (if over 3.5t) plus higher autostrada RV rate." },
      ev: { range: "€55-75", note: "Same Swiss vignette and Italian toll class as a petrol car." },
      motorcycle: { range: "€42-55", note: "Swiss vignette is unchanged for motorcycles; Italian tolls are discounted." },
    },
    vignetteCountries: [["CH", "via.admin.ch"]],
    ferryOptions: [],
    borderAlertsSummary: "Switzerland requires its annual e-vignette for any car on the motorway network — there's no short-stay tier, so it applies even for a single transit day. Radar detectors are illegal in both Switzerland and Germany.",
  }),
  corridor({
    slug: "oslo-stockholm-malmo-copenhagen",
    origin: { name: "Oslo, Norway", coords: { lat: 59.9139, lng: 10.7522 } },
    destination: { name: "Copenhagen, Denmark", coords: { lat: 55.6761, lng: 12.5683 } },
    distanceKm: 900,
    countriesTraversed: ["NO", "SE", "DK"],
    tollsOverview: {
      car: { range: "€35-60", note: "Norwegian AutoPASS tolls plus the Öresund Bridge (Malmö–Copenhagen)." },
      rv: { range: "€55-90", note: "Higher AutoPASS class plus the RV rate on the Öresund Bridge." },
      ev: { range: "€20-40", note: "Norwegian AutoPASS EV discount; Öresund Bridge toll is unchanged for EVs." },
      motorcycle: { range: "€15-30", note: "Reduced AutoPASS rate; motorcycles cross the Öresund Bridge at a lower rate too." },
    },
    vignetteCountries: [],
    ferryOptions: [],
    borderAlertsSummary: "No vignette needed anywhere on this route. The Öresund Bridge is the one fixed toll point — book online in advance for the best rate.",
  }),
  corridor({
    slug: "amsterdam-brussels-paris-bordeaux",
    origin: { name: "Amsterdam, Netherlands", coords: { lat: 52.3676, lng: 4.9041 } },
    destination: { name: "Bordeaux, France", coords: { lat: 44.8378, lng: -0.5792 } },
    distanceKm: 1000,
    countriesTraversed: ["NL", "BE", "FR"],
    tollsOverview: {
      car: { range: "€55-75", note: "French autoroute tolls south of the Belgian border to Bordeaux." },
      rv: { range: "€85-115", note: "Higher French autoroute class for vehicles over 3.5t." },
      ev: { range: "€55-75", note: "Same French autoroute toll class as a petrol car." },
      motorcycle: { range: "€30-40", note: "French autoroutes discount motorcycles by roughly 30%." },
    },
    vignetteCountries: [],
    ferryOptions: [],
    borderAlertsSummary: "No vignette needed in the Netherlands, Belgium or France — French tolls are distance-based. Watch for restricted-breed dog rules if crossing into France or Germany with certain breeds.",
  }),
  corridor({
    slug: "paris-lyon-barcelona",
    origin: { name: "Paris, France", coords: { lat: 48.8566, lng: 2.3522 } },
    destination: { name: "Barcelona, Spain", coords: { lat: 41.3874, lng: 2.1686 } },
    distanceKm: 1030,
    countriesTraversed: ["FR", "ES"],
    tollsOverview: {
      car: { range: "€65-85", note: "French autoroute tolls Paris–Lyon–border; Spanish AP-7 is largely toll-free today." },
      rv: { range: "€100-135", note: "Higher French autoroute class for vehicles over 3.5t." },
      ev: { range: "€65-85", note: "Same French toll class as a petrol car; Spain adds no extra charge." },
      motorcycle: { range: "€35-45", note: "French autoroutes discount motorcycles by roughly 30%." },
    },
    vignetteCountries: [],
    ferryOptions: [],
    borderAlertsSummary: "No vignette needed in France or Spain. French tolls are distance-based; most of Spain's AP-7 Mediterranean corridor tolls were removed in recent years.",
  }),
  corridor({
    slug: "berlin-prague-vienna",
    origin: { name: "Berlin, Germany", coords: { lat: 52.52, lng: 13.405 } },
    destination: { name: "Vienna, Austria", coords: { lat: 48.2082, lng: 16.3738 } },
    distanceKm: 680,
    countriesTraversed: ["DE", "CZ", "AT"],
    tollsOverview: {
      car: { range: "€25-35", note: "Czech e-vignette plus Austrian vignette — both flat-rate, no distance tolls." },
      rv: { range: "€35-55", note: "Higher vignette classes in both Czechia and Austria for vehicles over 3.5t." },
      ev: { range: "€25-35", note: "Same vignette requirement as a petrol car in both countries." },
      motorcycle: { range: "€12-18", note: "Czechia's e-vignette is free for motorcycles; Austria charges a reduced rate." },
    },
    vignetteCountries: [
      ["CZ", "edalnice.cz"],
      ["AT", "ASFINAG"],
    ],
    ferryOptions: [],
    borderAlertsSummary: "Both Czechia and Austria require a motorway vignette — buy each online before you cross rather than at the border. Germany itself has no car vignette.",
  }),
  corridor({
    slug: "zurich-san-bernardino-florence",
    origin: { name: "Zürich, Switzerland", coords: { lat: 47.3769, lng: 8.5417 } },
    destination: { name: "Florence, Italy", coords: { lat: 43.7696, lng: 11.2558 } },
    distanceKm: 560,
    countriesTraversed: ["CH", "IT"],
    tollsOverview: {
      car: { range: "€45-60", note: "Swiss annual e-vignette plus Italian autostrada tolls to Florence." },
      rv: { range: "€60-90", note: "Swiss heavy-vehicle charge (if over 3.5t) plus higher autostrada RV rate." },
      ev: { range: "€45-60", note: "Same vignette and toll class as a petrol car." },
      motorcycle: { range: "€35-45", note: "Swiss vignette unchanged for motorcycles; Italian tolls are discounted." },
    },
    vignetteCountries: [["CH", "via.admin.ch"]],
    ferryOptions: [],
    borderAlertsSummary: "The San Bernardino route avoids the Gotthard tunnel queue but still needs the same Swiss e-vignette. Dashcams are restricted by privacy law in Switzerland.",
  }),
  corridor({
    slug: "london-edinburgh-nc500",
    origin: { name: "London, United Kingdom", coords: { lat: 51.5072, lng: -0.1276 } },
    destination: { name: "Edinburgh, United Kingdom", coords: { lat: 55.9533, lng: -3.1883 } },
    distanceKm: 660,
    countriesTraversed: ["GB"],
    tollsOverview: {
      car: { range: "£0-15", note: "The UK's M6/A1(M) corridor is largely toll-free; the M6 Toll near Birmingham is optional." },
      rv: { range: "£0-25", note: "Higher M6 Toll class for larger vehicles, if that optional stretch is used." },
      ev: { range: "£0-15", note: "Same toll exposure as a petrol car on this corridor." },
      motorcycle: { range: "£0-8", note: "Motorcycles pay a reduced rate on the optional M6 Toll." },
    },
    vignetteCountries: [],
    ferryOptions: [],
    borderAlertsSummary: "No vignette or major tolls on this route — it's the classic gateway drive north to the NC500. Pepper spray is illegal to carry anywhere in the UK.",
  }),
  corridor({
    slug: "hamburg-flensburg-bergen",
    origin: { name: "Hamburg, Germany", coords: { lat: 53.5511, lng: 9.9937 } },
    destination: { name: "Bergen, Norway", coords: { lat: 60.3913, lng: 5.3221 } },
    distanceKm: 1050,
    countriesTraversed: ["DE", "DK", "NO"],
    tollsOverview: {
      car: { range: "€20-45", note: "Norwegian AutoPASS tolls approaching Bergen, billed automatically." },
      rv: { range: "€35-70", note: "Higher AutoPASS class for vehicles over 3.5t." },
      ev: { range: "€10-25", note: "Norwegian AutoPASS gives EVs a large automatic discount." },
      motorcycle: { range: "€5-15", note: "Motorcycles pay a reduced AutoPASS rate." },
    },
    vignetteCountries: [],
    ferryOptions: [
      { route: "Hirtshals (DK) – Bergen/Stavanger (NO)", operator: "Fjordline", affiliateUrl: "https://www.fjordline.com/" },
    ],
    borderAlertsSummary: "No vignette needed anywhere on this route. If bringing a pet, Norway requires the tapeworm treatment 24-120 hours before arrival.",
  }),
  corridor({
    slug: "vienna-maribor-zagreb-split",
    origin: { name: "Vienna, Austria", coords: { lat: 48.2082, lng: 16.3738 } },
    destination: { name: "Split, Croatia", coords: { lat: 43.5081, lng: 16.4402 } },
    distanceKm: 700,
    countriesTraversed: ["AT", "SI", "HR"],
    tollsOverview: {
      car: { range: "€40-60", note: "Austrian and Slovenian vignettes plus Croatian distance-based autocesta tolls to Split." },
      rv: { range: "€60-95", note: "Higher vignette classes plus the Croatian RV toll rate." },
      ev: { range: "€40-60", note: "Same vignette requirement and Croatian toll class as a petrol car." },
      motorcycle: { range: "€20-30", note: "Reduced Austrian and Slovenian vignette rates; lower Croatian motorcycle toll." },
    },
    vignetteCountries: [
      ["AT", "ASFINAG"],
      ["SI", "DARS"],
    ],
    ferryOptions: [],
    borderAlertsSummary: "Austria and Slovenia both require a vignette; Croatia tolls by distance instead. Croatia is Schengen, so no passport stop at that border, but keep documents to hand for Slovenia.",
  }),
  corridor({
    slug: "orlando-key-west",
    origin: { name: "Orlando, FL", coords: { lat: 28.5383, lng: -81.3792 } },
    destination: { name: "Key West, FL", coords: { lat: 24.5551, lng: -81.78 } },
    distanceKm: 580,
    countriesTraversed: ["US"],
    tollsOverview: {
      car: { range: "$8-20", note: "Florida's Turnpike (SunPass) for the first stretch; the Overseas Highway (US-1) itself is toll-free." },
      rv: { range: "$15-30", note: "Higher SunPass class for larger vehicles on the Turnpike section." },
      ev: { range: "$8-20", note: "Same Florida Turnpike toll class as a petrol car." },
      motorcycle: { range: "$4-10", note: "Motorcycles pay a reduced SunPass rate." },
    },
    vignetteCountries: [],
    ferryOptions: [],
    borderAlertsSummary: "No border crossing on this route — it's a domestic US drive down the Keys. Get a SunPass or use pay-by-plate for the Florida Turnpike stretch.",
  }),
  corridor({
    slug: "los-angeles-las-vegas",
    origin: { name: "Los Angeles, CA", coords: { lat: 34.0522, lng: -118.2437 } },
    destination: { name: "Las Vegas, NV", coords: { lat: 36.1699, lng: -115.1398 } },
    distanceKm: 435,
    countriesTraversed: ["US"],
    tollsOverview: {
      car: { range: "$0-5", note: "I-15 is essentially toll-free; only minor California express-lane charges may apply near LA." },
      rv: { range: "$0-8", note: "Same minimal toll exposure, with a higher rate if an express lane is used." },
      ev: { range: "$0-5", note: "Same toll exposure as a petrol car — I-15 itself has no tolls." },
      motorcycle: { range: "$0-3", note: "Negligible toll exposure on this corridor." },
    },
    vignetteCountries: [],
    ferryOptions: [],
    borderAlertsSummary: "No border crossing and essentially no tolls on this route — the classic desert run up I-15.",
  }),
  corridor({
    slug: "denver-moab",
    origin: { name: "Denver, CO", coords: { lat: 39.7392, lng: -104.9903 } },
    destination: { name: "Moab, UT", coords: { lat: 38.5733, lng: -109.5498 } },
    distanceKm: 550,
    countriesTraversed: ["US"],
    tollsOverview: {
      car: { range: "$0-3", note: "I-70 through the Rockies is toll-free; E-470 near Denver is optional and can be avoided." },
      rv: { range: "$0-5", note: "Same minimal exposure — E-470 charges a higher rate for larger vehicles if used." },
      ev: { range: "$0-3", note: "Same toll exposure as a petrol car on this corridor." },
      motorcycle: { range: "$0-2", note: "Negligible toll exposure on this corridor." },
    },
    vignetteCountries: [],
    ferryOptions: [],
    borderAlertsSummary: "No border crossing and essentially no tolls on I-70 itself — mountain weather and winter chain laws are the real thing to plan around.",
  }),
];

export function corridorBySlug(slug: string): SEOCorridor | undefined {
  return SEO_CORRIDORS.find((c) => c.slug === slug);
}

/** schema.org Trip structured data for a corridor page. */
export function corridorTripJsonLd(corridor: SEOCorridor) {
  return {
    "@context": "https://schema.org",
    "@type": "Trip",
    name: `${corridor.origin.name} to ${corridor.destination.name}`,
    description: corridor.borderAlertsSummary,
    itinerary: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Place",
            name: corridor.origin.name,
            geo: { "@type": "GeoCoordinates", latitude: corridor.origin.coords.lat, longitude: corridor.origin.coords.lng },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Place",
            name: corridor.destination.name,
            geo: {
              "@type": "GeoCoordinates",
              latitude: corridor.destination.coords.lat,
              longitude: corridor.destination.coords.lng,
            },
          },
        },
      ],
    },
    provider: { "@type": "Organization", name: "AutoVere", url: "https://www.autovere.com" },
  };
}

/** schema.org FAQPage structured data for a corridor page's FAQ section. */
export function corridorFaqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
