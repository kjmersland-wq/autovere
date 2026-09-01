import type { RegionKey, VehicleKey } from "./trip-data";

/* ------------------------------------------------------------------ *
 * Iconic mountain pass radar
 * ------------------------------------------------------------------ */

export type PassStatus = "open" | "chains" | "closed" | "seasonal";

export interface MountainPass {
  id: string;
  emoji: string;
  name: string;
  where: string;
  elevation: string;
  /** Inclusive month range (1–12) when the pass is normally open. */
  openMonths: [number, number];
  seasonLabel: string;
  toll: string;
  advisory: string;
  motoNote?: string;
  portalLabel: string;
  portalUrl: string;
  match: string[];
  regions: RegionKey[];
  /** Real-world summit coordinates — used for polyline proximity filtering. */
  lat: number;
  lng: number;
}

export const MOUNTAIN_PASSES: MountainPass[] = [
  {
    id: "grossglockner",
    emoji: "🏔️",
    name: "Grossglockner High Alpine Road",
    where: "🇦🇹 Austria · Salzburg ↔ Carinthia",
    elevation: "2 504 m · Hochtor summit",
    openMonths: [5, 10],
    seasonLabel: "Early May – late October (gates close nightly)",
    toll: "€40.00 car day ticket · €30.00 motorcycle · motorhomes €40.00 (over 3.5 t on request)",
    advisory:
      "Toll road, not part of the Austrian vignette network. Gates open ~05:30–06:00 and close 19:30–21:30 depending on the month — plan to be through before dusk and enjoy the Edelweissspitze detour.",
    motoNote: "Riders get a reduced ticket and a dedicated Bikers Point at Fuschertörl.",
    portalLabel: "grossglockner.at",
    portalUrl: "https://www.grossglockner.at/gg/en/index",
    match: ["austria", "salzburg", "zell am see", "heiligenblut", "grossglockner", "großglockner", "carinthia", "villach", "brenner", "innsbruck", "italy", "garda"],
    regions: ["eu"],
    lat: 47.076,
    lng: 12.838,
  },
  {
    id: "stelvio",
    emoji: "🌀",
    name: "Passo dello Stelvio (Stelvio Pass)",
    where: "🇮🇹 Italy · Bormio ↔ Trafoi, South Tyrol",
    elevation: "2 758 m · 48 numbered hairpins on the north ramp",
    openMonths: [6, 10],
    seasonLabel: "Usually late May/June – early November, snow dependent",
    toll: "Free of charge",
    advisory:
      "Europe's most photogenic hairpin ladder. Ride or drive it early — coaches and cyclists fill the switchbacks from 10:00. Expect 8–12 °C colder at the summit than in Bormio.",
    motoNote: "Tight, off-camber hairpins: stay wide on entry and watch for gravel after rain.",
    portalLabel: "stelviopark.it",
    portalUrl: "https://www.stelviopark.it/en/",
    match: ["italy", "bormio", "stelvio", "south tyrol", "bolzano", "milan", "milano", "garda", "como", "switzerland", "livigno", "sondrio"],
    regions: ["eu"],
    lat: 46.5285,
    lng: 10.4543,
  },
  {
    id: "furka-grimsel",
    emoji: "🇨🇭",
    name: "Furka & Grimsel Passes",
    where: "🇨🇭 Switzerland · Valais ↔ Uri ↔ Bern",
    elevation: "Furka 2 429 m · Grimsel 2 164 m",
    openMonths: [6, 10],
    seasonLabel: "Roughly mid-June – late October",
    toll: "Free passes · CHF 40 motorway vignette still required for Swiss motorways",
    advisory:
      "Check the live pass board before committing — snow chains can be mandated at short notice even in summer. The Furka–Grimsel–Susten triangle is a perfect full-day loop.",
    motoNote: "Cool mornings at altitude: pack a thermal layer and waterproofs.",
    portalLabel: "tcs.ch pass status",
    portalUrl: "https://www.tcs.ch/en/travel-camping/travel-information/traffic-information/alpine-passes.php",
    match: ["switzerland", "swiss", "furka", "grimsel", "andermatt", "interlaken", "bern", "lucerne", "zurich", "zürich", "valais", "brig", "geneva", "milan", "como"],
    regions: ["eu"],
    lat: 46.5723,
    lng: 8.4152,
  },
  {
    id: "trollstigen",
    emoji: "🇳🇴",
    name: "Trollstigen & Sognefjellet",
    where: "🇳🇴 Norway · Møre og Romsdal · Jotunheimen",
    elevation: "Trollstigen 858 m · Sognefjellet 1 434 m (highest road in Northern Europe)",
    openMonths: [5, 10],
    seasonLabel: "Trollstigen late May – October · Sognefjellet May – November",
    toll: "Free roads · parking fee at the Trollstigen viewpoint",
    advisory:
      "Both are National Tourist Routes with hairpins and narrow shoulders. Trollstigen has periodic rockfall closures — check the live status the morning you travel. Vehicles over 12.4 m are not permitted on Trollstigen.",
    motoNote: "Wet granite and painted lines get slick in fjord drizzle — brake early into the hairpins.",
    portalLabel: "vegvesen.no road status",
    portalUrl: "https://www.vegvesen.no/en/traffic/",
    match: ["norway", "norge", "oslo", "bergen", "ålesund", "alesund", "åndalsnes", "geiranger", "trollstigen", "sognefjell", "lom", "trondheim", "fjord", "stavanger"],
    regions: ["eu"],
    lat: 62.4558,
    lng: 7.6709,
  },
  {
    id: "icefields",
    emoji: "🇨🇦",
    name: "Icefields Parkway (Highway 93N)",
    where: "🇨🇦 Alberta · Lake Louise ↔ Jasper",
    elevation: "2 088 m · Bow Summit",
    openMonths: [1, 12],
    seasonLabel: "Open year-round, with winter storm closures",
    toll: "Parks Canada pass required: C$11.00 adult/day or C$75.25 Discovery Pass (annual, per vehicle)",
    advisory:
      "232 km of glaciers with no fuel between Lake Louise and Saskatchewan River Crossing — top up before you start. From 1 Nov to 31 Mar winter tires or carried chains are mandatory on Highway 93N.",
    motoNote: "Wildlife on the shoulder at dawn and dusk — ride the centre of your lane and keep speed down.",
    portalLabel: "parks.canada.ca",
    portalUrl: "https://parks.canada.ca/pn-np/ab/banff/visit/parkway-promenade",
    match: ["alberta", "banff", "jasper", "lake louise", "calgary", "canmore", "icefields", "edmonton", "rockies"],
    regions: ["ca"],
    lat: 51.67,
    lng: -116.94,
  },
  {
    id: "dragon",
    emoji: "🐉",
    name: "Tail of the Dragon (US 129, Deals Gap)",
    where: "🇺🇸 North Carolina ↔ Tennessee",
    elevation: "318 curves in 11 miles (17.7 km)",
    openMonths: [1, 12],
    seasonLabel: "Open year-round · best March – November, ice risk in winter",
    toll: "Free — no tolls",
    advisory:
      "Strictly enforced 30 mph (48 km/h) limit with unmarked patrols and roadside speed radar. No guardrails on many curves and zero fuel on the strip — fill up in Robbinsville or Tapoco.",
    motoNote: "Photographers shoot every curve — ride your own pace, not the camera's. Trailers and RVs should use US 74 instead.",
    portalLabel: "tailofthedragon.com",
    portalUrl: "https://tailofthedragon.com/",
    match: ["tennessee", "north carolina", "knoxville", "asheville", "deals gap", "dragon", "smoky", "gatlinburg", "chattanooga", "nashville", "atlanta"],
    regions: ["us"],
    lat: 35.51,
    lng: -83.93,
  },
];

/** A pass only counts as "on the route" inside this corridor. */
export const PASS_CORRIDOR_KM = 50;


function inSeason(pass: MountainPass, month: number) {
  const [from, to] = pass.openMonths;
  return from <= to ? month >= from && month <= to : month >= from || month <= to;
}

export function passStatus(pass: MountainPass, date = new Date()): {
  status: PassStatus;
  label: string;
  tone: "open" | "warn" | "closed";
} {
  const month = date.getMonth() + 1;
  if (pass.openMonths[0] === 1 && pass.openMonths[1] === 12) {
    if (month === 12 || month <= 3) {
      return { status: "chains", label: "Open · winter tyres / chains required", tone: "warn" };
    }
    return { status: "open", label: "Open", tone: "open" };
  }
  if (!inSeason(pass, month)) {
    return { status: "closed", label: "Closed for the season", tone: "closed" };
  }
  const [from, to] = pass.openMonths;
  if (month === from || month === to) {
    return { status: "seasonal", label: "Opening/closing window · check live status", tone: "warn" };
  }
  return { status: "open", label: "Open", tone: "open" };
}

/**
 * Passes within 50 km of the real routed polyline. No polyline → no radar.
 */
export function detectMountainPasses(
  coords: LatLng[] | undefined | null,
): MountainPass[] {
  return filterByCorridor(MOUNTAIN_PASSES, coords, PASS_CORRIDOR_KM);
}


/* ------------------------------------------------------------------ *
 * Cross-border fuel & cost arbitrage
 * ------------------------------------------------------------------ */

export interface BorderTip {
  id: string;
  emoji: string;
  title: string;
  body: string;
  saving: string;
  action?: string;
  match: string[];
  regions: RegionKey[];
}

export const BORDER_TIPS: BorderTip[] = [
  {
    id: "at-it-brenner",
    emoji: "⛽",
    title: "Refuel in Austria before the Brenner Pass",
    body:
      "Diesel and petrol run roughly 15% cheaper in Austria than in Italy. Fill the tank around Innsbruck or Matrei am Brenner — the last Austrian stations before the border are the cheapest on the corridor.",
    saving: "≈ €12–18 saved on a 60 L tank",
    action: "Plan a fuel stop at Matrei am Brenner",
    match: ["austria", "innsbruck", "brenner", "italy", "garda", "verona", "milan", "bolzano", "venice", "florence", "rome"],
    regions: ["eu"],
  },
  {
    id: "ch-vignette",
    emoji: "🇨🇭",
    title: "Swiss motorways need the CHF 40 annual vignette",
    body:
      "Switzerland has no day or week option — one sticker (or the e-vignette) costs CHF 40 and is valid for the whole calendar year, even if you only transit for two hours. Motorcycles need their own vignette.",
    saving: "Switch to Smart Bypass to route around Swiss motorways on a short transit leg",
    action: "Try the 🧭 Smart Bypass variant",
    match: ["switzerland", "swiss", "zurich", "zürich", "geneva", "basel", "bern", "lucerne", "gotthard", "milan", "como", "italy", "germany", "france"],
    regions: ["eu"],
  },
  {
    id: "lux-arbitrage",
    emoji: "💶",
    title: "Luxembourg fuel arbitrage on the Benelux corridor",
    body:
      "Luxembourg keeps some of the lowest excise duties in Western Europe — expect 15–25 cents/litre less than France, Belgium or Germany. Stations near Wasserbillig, Schengen and Berchem are the classic top-up points.",
    saving: "≈ €10–15 per tank versus neighbouring countries",
    action: "Add a Luxembourg fuel stop",
    match: ["luxembourg", "france", "germany", "belgium", "brussels", "metz", "trier", "saarbrücken", "saarbrucken", "liège", "liege", "nancy", "strasbourg", "amsterdam", "paris"],
    regions: ["eu"],
  },
  {
    id: "es-arbitrage",
    emoji: "🇪🇸",
    title: "Cross into Spain (or Andorra) before you refuel",
    body:
      "Spanish pump prices sit well below French ones, and Andorra is cheaper still. Coming down the A9/AP-7, hold out past La Jonquera; on the Atlantic side, Irún and Behobia are the border bargains.",
    saving: "≈ 20–30 cents/litre versus France",
    action: "Add a La Jonquera or Irún fuel stop",
    match: ["spain", "barcelona", "madrid", "valencia", "malaga", "málaga", "seville", "bilbao", "andorra", "france", "toulouse", "montpellier", "perpignan", "biarritz", "portugal"],
    regions: ["eu"],
  },
  {
    id: "us-state-fuel",
    emoji: "🇺🇸",
    title: "State fuel-tax arbitrage",
    body:
      "State excise makes a real difference: California and Pennsylvania sit at the top, while Texas, Missouri, Mississippi and Arizona are consistently cheap. Fill up just before entering a high-tax state.",
    saving: "Up to US$0.70/gal between neighbouring states",
    match: ["california", "nevada", "arizona", "texas", "oklahoma", "missouri", "pennsylvania", "new york", "florida", "illinois", "oregon", "washington"],
    regions: ["us"],
  },
  {
    id: "ca-us-fuel",
    emoji: "🇨🇦",
    title: "Fuel is usually cheaper south of the 49th",
    body:
      "Once currency and litres-vs-gallons are converted, US fuel typically lands 20–30% below Canadian pumps — biggest gaps around BC and Québec. Cross with a low tank, return with a full one (within duty-free allowances).",
    saving: "≈ C$25–40 per tank on a border run",
    match: ["vancouver", "british columbia", "seattle", "toronto", "buffalo", "niagara", "montréal", "montreal", "québec", "quebec", "windsor", "detroit", "calgary", "winnipeg"],
    regions: ["ca", "us"],
  },
];

export function detectBorderTips(
  region: RegionKey,
  origin: string,
  destination: string,
): BorderTip[] {
  const text = `${origin} ${destination}`.toLowerCase();
  return BORDER_TIPS.filter(
    (t) => t.regions.includes(region) && t.match.some((m) => text.includes(m)),
  );
}

/* ------------------------------------------------------------------ *
 * Border crossing checkpoint intelligence
 * ------------------------------------------------------------------ */

export type CrossingKind = "schengen" | "strict";

export interface BorderCrossing {
  id: string;
  kind: CrossingKind;
  flags: string;
  name: string;
  statusLabel: string;
  body: string;
  requirements: string[];
  waitLabel: string;
  portalLabel?: string;
  portalUrl?: string;
  match: string[];
  regions: RegionKey[];
}

export const BORDER_CROSSINGS: BorderCrossing[] = [
  {
    id: "de-at",
    kind: "schengen",
    flags: "🇩🇪 → 🇦🇹",
    name: "Germany → Austria",
    statusLabel: "Open border · random ID checks",
    body:
      "Free movement inside Schengen. Bavaria runs intermittent spot checks on the A8/A93 — keep passports or ID cards within reach and you'll roll straight through.",
    requirements: [
      "Photo ID for every occupant (random checks)",
      "Austrian motorway vignette valid before the first motorway metre",
      "Warning triangle, hi-vis vest and first-aid kit on board",
    ],
    waitLabel: "Typically 0–10 min",
    match: ["germany", "munich", "münchen", "austria", "salzburg", "innsbruck", "vienna", "brenner", "italy", "garda"],
    regions: ["eu"],
  },
  {
    id: "at-it",
    kind: "schengen",
    flags: "🇦🇹 → 🇮🇹",
    name: "Austria → Italy (Brenner)",
    statusLabel: "Open border · occasional customs patrol",
    body:
      "No passport control at the Brenner, but Italian Guardia di Finanza patrols do stop vehicles. Switch to Telepass lanes only if you have a transponder fitted.",
    requirements: [
      "Photo ID on board",
      "Brenner autostrada toll paid at the barrier (card, cash or Telepass)",
      "Crit'Air-style city rules do not apply, but Italian ZTL zones do",
    ],
    waitLabel: "Typically 0–15 min at the toll plaza",
    match: ["austria", "innsbruck", "brenner", "italy", "bolzano", "verona", "garda", "venice", "milan", "florence", "rome"],
    regions: ["eu"],
  },
  {
    id: "ch-borders",
    kind: "strict",
    flags: "🇨🇭",
    name: "Swiss borders (Schengen, non-EU customs)",
    statusLabel: "Customs control · goods declaration",
    body:
      "Switzerland is in Schengen but outside the EU customs union, so customs officers can and do stop vehicles. Declare goods above the duty-free allowance and buy the vignette before the first motorway.",
    requirements: [
      "CHF 40 motorway vignette (annual) or e-vignette per vehicle",
      "Customs declaration for goods over CHF 300 per person",
      "Meat, dairy and alcohol allowances are strictly enforced",
    ],
    waitLabel: "0–20 min · longer at Basel and Chiasso on weekends",
    portalLabel: "via.admin.ch e-vignette",
    portalUrl: "https://via.admin.ch/shop/dashboard",
    match: ["switzerland", "swiss", "basel", "zurich", "zürich", "geneva", "chiasso", "gotthard", "lucerne", "bern", "italy", "milan", "germany", "france"],
    regions: ["eu"],
  },
  {
    id: "uk-fr",
    kind: "strict",
    flags: "🇬🇧 ↔ 🇫🇷",
    name: "UK ↔ France (Channel Tunnel & Dover–Calais)",
    statusLabel: "Full passport control & customs",
    body:
      "Post-Brexit juxtaposed controls mean both British and French officers check you before boarding. Arrive 60–90 min ahead in peak season and have every document to hand.",
    requirements: [
      "Valid passport for every traveller (ID cards no longer accepted for UK entry)",
      "EU Entry/Exit System biometric registration on first crossing",
      "Customs declaration for goods, alcohol, tobacco and pets (animal health certificate)",
      "UK sticker on the vehicle and headlamp beam deflectors",
    ],
    waitLabel: "30–120 min in summer peaks",
    portalLabel: "eurotunnel.com",
    portalUrl: "https://www.eurotunnel.com/uk/",
    match: ["uk", "london", "dover", "folkestone", "england", "britain", "calais", "dunkirk", "france", "paris", "scotland", "edinburgh"],
    regions: ["eu"],
  },
  {
    id: "hr-bih",
    kind: "strict",
    flags: "🇭🇷 ↔ 🇧🇦",
    name: "Croatia ↔ Bosnia & Herzegovina (Neum corridor)",
    statusLabel: "Passport control · EU external border",
    body:
      "The Neum corridor crosses out of and back into the EU within 9 km. Green card insurance is essential, and queues build sharply on July/August weekends. The Pelješac Bridge bypasses it entirely.",
    requirements: [
      "Passport for every occupant (two stamps in 20 minutes)",
      "Green Card motor insurance valid for BiH",
      "Vehicle registration document in the driver's name or a notarised letter",
    ],
    waitLabel: "15–90 min in high season",
    match: ["croatia", "split", "dubrovnik", "zagreb", "neum", "bosnia", "mostar", "sarajevo", "makarska", "pelješac", "peljesac"],
    regions: ["eu"],
  },
  {
    id: "us-ca",
    kind: "strict",
    flags: "🇺🇸 ↔ 🇨🇦",
    name: "USA ↔ Canada land border",
    statusLabel: "Passport control · CBP / CBSA inspection",
    body:
      "Every crossing is a full immigration and customs stop. NEXUS lanes cut the wait dramatically at Peace Arch, Detroit–Windsor and Niagara. Declare all food, alcohol, cannabis and firearms — penalties are steep.",
    requirements: [
      "Passport, NEXUS card or enhanced driver's licence",
      "Vehicle registration and proof of insurance valid in the destination country",
      "Declare food, alcohol, tobacco, cannabis and pets; firearms need advance paperwork",
      "Electronic toll transponders (E-ZPass, 407 ETR) are not interchangeable across the border",
    ],
    waitLabel: "10–60 min · check live CBP border wait times",
    portalLabel: "bwt.cbp.gov wait times",
    portalUrl: "https://bwt.cbp.gov/",
    match: ["canada", "usa", "united states", "vancouver", "seattle", "toronto", "buffalo", "niagara", "detroit", "windsor", "montréal", "montreal", "québec", "quebec", "new york", "calgary", "blaine"],
    regions: ["us", "ca"],
  },
];

const DEFAULT_CROSSINGS: Record<RegionKey, string[]> = {
  eu: ["de-at", "at-it"],
  us: ["us-ca"],
  ca: ["us-ca"],
};

export function detectBorderCrossings(
  region: RegionKey,
  origin: string,
  destination: string,
): BorderCrossing[] {
  const text = `${origin} ${destination}`.toLowerCase();
  const matched = BORDER_CROSSINGS.filter(
    (c) => c.regions.includes(region) && c.match.some((m) => text.includes(m)),
  );
  if (matched.length > 0) return matched;
  const fallback = DEFAULT_CROSSINGS[region];
  return BORDER_CROSSINGS.filter((c) => fallback.includes(c.id));
}

export function passTollForVehicle(pass: MountainPass, vehicle: VehicleKey): string {
  if (vehicle === "motorcycle" && pass.id === "grossglockner") {
    return "€30.00 motorcycle day ticket (reduced)";
  }
  return pass.toll;
}
