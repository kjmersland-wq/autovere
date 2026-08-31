import type { RegionKey } from "@/lib/trip-data";

/* ------------------------------------------------------------------ *
 * Heavy motorhome (> 3.5 t) toll systems
 * ------------------------------------------------------------------ */

export type HeavySystem = {
  id: string;
  flag: string;
  country: string;
  system: string;
  body: string;
  portalLabel: string;
  portalUrl: string;
};

export const HEAVY_SYSTEMS: HeavySystem[] = [
  {
    id: "go-box",
    flag: "🇦🇹",
    country: "Austria",
    system: "GO-Box (ASFINAG)",
    body:
      "Motorhomes over 3.5 t maximum permissible weight may not use the car vignette. You need a GO-Box on-board unit, charged per kilometre by axle count and EURO class. Pick one up at a GO point near the border before your first motorway kilometre.",
    portalLabel: "go-maut.at",
    portalUrl: "https://www.go-maut.at/en/",
  },
  {
    id: "lsva",
    flag: "🇨🇭",
    country: "Switzerland",
    system: "LSVA / PSVA heavy vehicle charge",
    body:
      "Above 3.5 t the Swiss motorway vignette no longer covers you. Foreign motorhomes normally pay the flat-rate PSVA (per-day or per-year) declared at the border customs post; ID-based LSVA applies to commercial units.",
    portalLabel: "bazg.admin.ch",
    portalUrl: "https://www.bazg.admin.ch/bazg/en/home/information-companies/transport--travel-documents--road-taxes/heavy-vehicle-charges--phvc-and-pmhvc-.html",
  },
  {
    id: "darsgo",
    flag: "🇸🇮",
    country: "Slovenia",
    system: "DarsGo unit",
    body:
      "Slovenian motorways charge vehicles over 3.5 t through a DarsGo on-board unit with free-flow gantries. Register online or at a DarsGo service point; the e-vignette is invalid for your weight class.",
    portalLabel: "darsgo.si",
    portalUrl: "https://www.darsgo.si/portal/en/",
  },
  {
    id: "germany-maut",
    flag: "🇩🇪",
    country: "Germany",
    system: "No toll for private motorhomes",
    body:
      "Privately used motorhomes are exempt from the German Lkw-Maut regardless of weight, but weight-based speed limits and overtaking bans still apply.",
    portalLabel: "toll-collect.de",
    portalUrl: "https://www.toll-collect.de/en/",
  },
];

export type ClearanceAdvisory = {
  id: string;
  emoji: string;
  title: string;
  body: string;
  /** Height in metres at which this advisory becomes critical. */
  triggerHeight?: number;
};

export const CLEARANCE_ADVISORIES: ClearanceAdvisory[] = [
  {
    id: "alpine-underpass",
    emoji: "🌉",
    title: "Alpine underpasses & village arches",
    body:
      "Several Alpine valley roads (Susa, Vinschgau, Maurienne) and old town gateways drop below 3.2 m. Trust posted signs over your navigation app and follow the signed HGV/camper diversion where offered.",
    triggerHeight: 3.2,
  },
  {
    id: "tunnels",
    emoji: "🚇",
    title: "Tunnel height & LPG restrictions",
    body:
      "Mont Blanc, Fréjus and Gotthard road tunnels apply strict height, length and LPG-cylinder rules. Vehicles above 4.0 m are routed to dedicated lanes and may face convoy timing.",
    triggerHeight: 4.0,
  },
  {
    id: "ferry-decks",
    emoji: "⛴️",
    title: "Ferry deck clearance",
    body:
      "Book ferries in the correct height and length bracket. Under-declaring your height means a re-fare at the ramp or refused boarding.",
  },
  {
    id: "roof-box",
    emoji: "📦",
    title: "Roof box, aerials & solar",
    body:
      "Measure to the highest fixed point — solar panels, satellite domes and roof boxes typically add 15–25 cm over the plate height.",
  },
];

export type SpeedRule = {
  id: string;
  flag: string;
  country: string;
  motorway: string;
  note: string;
};

export const MOTORHOME_SPEED_RULES: SpeedRule[] = [
  {
    id: "de",
    flag: "🇩🇪",
    country: "Germany",
    motorway: "100 km/h (over 3.5 t)",
    note: "Above 3.5 t you are capped at 100 km/h on the Autobahn and 80 km/h on rural roads, and overtaking bans for heavy vehicles apply to you.",
  },
  {
    id: "fr",
    flag: "🇫🇷",
    country: "France",
    motorway: "110 km/h (over 3.5 t)",
    note: "Over 3.5 t: 110 km/h motorway, 100 km/h dual carriageway, 80 km/h single carriageway. Keep 50 m from the vehicle ahead.",
  },
  {
    id: "it",
    flag: "🇮🇹",
    country: "Italy",
    motorway: "100 km/h (over 3.5 t)",
    note: "100 km/h motorway and 80 km/h on main roads; the left-most lane of three is closed to vehicles over 3.5 t.",
  },
  {
    id: "no",
    flag: "🇳🇴",
    country: "Norway",
    motorway: "80 km/h with caravan/heavy load",
    note: "Motorhomes over 3.5 t are limited to 80 km/h; many fjord roads sign 60 km/h with passing places only.",
  },
  {
    id: "ch",
    flag: "🇨🇭",
    country: "Switzerland",
    motorway: "100 km/h (over 3.5 t)",
    note: "Heavy motorhomes are limited to 100 km/h and must use the lorry lane in tunnels with lane separation.",
  },
];

/* ------------------------------------------------------------------ *
 * Urban low emission zones
 * ------------------------------------------------------------------ */

export type LezZone = {
  id: string;
  flag: string;
  country: string;
  cities: string[];
  scheme: string;
  requirement: string;
  cost: string;
  leadTime: string;
  portalLabel: string;
  portalUrl: string;
  match: string[];
  regions: RegionKey[];
  motorcycle: string;
};

export const LEZ_ZONES: LezZone[] = [
  {
    id: "fr-critair",
    flag: "🇫🇷",
    country: "France",
    cities: ["Paris", "Lyon", "Marseille", "Grenoble", "Strasbourg", "Rouen"],
    scheme: "Crit'Air vignette",
    requirement:
      "A Crit'Air sticker must be displayed inside the windscreen in every French ZFE. Classes are based on EURO standard and fuel; motorhomes are classed like the base vehicle.",
    cost: "€3.81 incl. postage",
    leadTime: "Order 3–4 weeks ahead for delivery abroad",
    portalLabel: "certificat-air.gouv.fr",
    portalUrl: "https://www.certificat-air.gouv.fr/",
    match: ["france", "paris", "lyon", "marseille", "grenoble", "strasbourg", "rouen", "nice", "bordeaux", "toulouse", "montpellier", "calais"],
    regions: ["eu"],
    motorcycle: "Required for motorcycles and scooters too.",
  },
  {
    id: "de-umwelt",
    flag: "🇩🇪",
    country: "Germany",
    cities: ["Berlin", "Munich", "Stuttgart", "Cologne", "Frankfurt", "Hamburg"],
    scheme: "Umweltplakette (green zone 4)",
    requirement:
      "A green sticker (Schadstoffgruppe 4) is required in ~50 Umweltzonen. Enforcement is by camera and patrol; a missing badge is a €100 fine.",
    cost: "€6–€30 depending on issuer",
    leadTime: "Order 2 weeks ahead or buy at a TÜV/DEKRA station on arrival",
    portalLabel: "umweltbundesamt.de",
    portalUrl: "https://www.umweltbundesamt.de/en/topics/air/air-quality-control-in-europe/low-emission-zones",
    match: ["germany", "berlin", "munich", "münchen", "stuttgart", "cologne", "köln", "frankfurt", "hamburg", "leipzig", "nuremberg", "düsseldorf"],
    regions: ["eu"],
    motorcycle: "Motorcycles are exempt from German Umweltzonen.",
  },
  {
    id: "be-nl-lez",
    flag: "🇧🇪",
    country: "Belgium & Netherlands",
    cities: ["Brussels", "Antwerp", "Ghent", "Rotterdam", "Amsterdam"],
    scheme: "LEZ online registration",
    requirement:
      "No sticker — foreign plates must be registered online before the first entry into Brussels, Antwerp, Ghent, Rotterdam or Amsterdam. Cameras match plates automatically.",
    cost: "Free registration; fines from €150",
    leadTime: "Register at least 24 hours before entry",
    portalLabel: "lez.brussels",
    portalUrl: "https://lez.brussels/mytax/en",
    match: ["belgium", "brussels", "antwerp", "ghent", "bruges", "netherlands", "rotterdam", "amsterdam", "utrecht", "hague"],
    regions: ["eu"],
    motorcycle: "Motorcycles are currently outside the Belgian and Dutch LEZ scope.",
  },
  {
    id: "uk-ulez",
    flag: "🇬🇧",
    country: "United Kingdom",
    cities: ["Greater London", "Birmingham", "Bristol"],
    scheme: "ULEZ + Congestion Charge",
    requirement:
      "Greater London's ULEZ charges non-compliant vehicles £12.50/day, plus £15 Congestion Charge in the central zone on weekdays. Pay online or by Auto Pay.",
    cost: "£12.50/day ULEZ · £15/day Congestion Charge",
    leadTime: "Pay up to 3 days after travel",
    portalLabel: "tfl.gov.uk",
    portalUrl: "https://tfl.gov.uk/modes/driving/ultra-low-emission-zone",
    match: ["london", "uk", "england", "dover", "britain", "folkestone", "birmingham", "bristol"],
    regions: ["eu"],
    motorcycle: "Pre-Euro 3 motorcycles pay ULEZ; Congestion Charge does not apply to motorcycles.",
  },
];

export function detectLezZones(region: RegionKey, origin: string, destination: string, stops: string[] = []) {
  const text = `${origin} ${destination} ${stops.join(" ")}`.toLowerCase();
  const matched = LEZ_ZONES.filter(
    (z) => z.regions.includes(region) && z.match.some((m) => text.includes(m)),
  );
  return { matched, all: LEZ_ZONES.filter((z) => z.regions.includes(region)) };
}

/* ------------------------------------------------------------------ *
 * Electronic toll tags
 * ------------------------------------------------------------------ */

export type TollTag = {
  id: string;
  emoji: string;
  label: string;
  scope: string;
  lanes: string;
  /** Share of distance-based tolls typically discounted. */
  discount: number;
  regions: RegionKey[];
  portalLabel: string;
  portalUrl: string;
};

export const TOLL_TAGS: TollTag[] = [
  {
    id: "autopass",
    emoji: "🇳🇴",
    label: "AutoPASS / SkyttelPASS / BroBizz",
    scope: "Norway, Sweden, Denmark — city rings, bridges, Øresund & Storebælt",
    lanes: "Free-flow gantries, no barrier stop",
    discount: 0.2,
    regions: ["eu"],
    portalLabel: "autopass.no",
    portalUrl: "https://www.autopass.no/en/",
  },
  {
    id: "telepass",
    emoji: "🇮🇹",
    label: "Telepass / Bip&Go / Fulli / Mango",
    scope: "France, Spain, Portugal, Italy — barrier motorways",
    lanes: "Yellow 'T' / télépéage lanes, barrier lifts automatically",
    discount: 0.05,
    regions: ["eu"],
    portalLabel: "telepass.com",
    portalUrl: "https://www.telepass.com/en",
  },
  {
    id: "ezpass",
    emoji: "🇺🇸",
    label: "E-ZPass / SunPass / FasTrak",
    scope: "US turnpikes, express lanes and bridges",
    lanes: "Open-road tolling gantries, no cash booth",
    discount: 0.25,
    regions: ["us", "ca"],
    portalLabel: "e-zpassiag.com",
    portalUrl: "https://www.e-zpassiag.com/",
  },
  {
    id: "etr407",
    emoji: "🇨🇦",
    label: "407 ETR Transponder",
    scope: "Ontario Highway 407 ETR and 412/418",
    lanes: "Transponder rate instead of camera video-toll charge",
    discount: 0.3,
    regions: ["ca"],
    portalLabel: "407etr.com",
    portalUrl: "https://www.407etr.com/",
  },
];

export function tagsForRegion(region: RegionKey) {
  return TOLL_TAGS.filter((t) => t.regions.includes(region));
}

export function tagSavings(tolls: number, activeIds: string[], region: RegionKey) {
  const active = tagsForRegion(region).filter((t) => activeIds.includes(t.id));
  if (active.length === 0) return { savings: 0, best: 0, active };
  const best = Math.max(...active.map((t) => t.discount));
  return { savings: tolls * best, best, active };
}
