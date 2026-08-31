import { useRouterState } from "@tanstack/react-router";

import type { CostGroupKey } from "@/lib/country-costs";
import type { FuelKey, RouteVariantKey, VehicleKey } from "@/lib/trip-data";

export type Locale = "en" | "no";

export function localeFromPath(pathname: string): Locale {
  return pathname === "/no" || pathname.startsWith("/no/") ? "no" : "en";
}

export function useLocale(): Locale {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return localeFromPath(pathname);
}

const en = {
  header: {
    regions: { eu: "Europe", us: "USA", ca: "Canada" },
    nav: {
      "/planner": "Road Trip Planner",
      "/tolls": "Tolls & Vignettes",
      "/scenic": "Scenic Passes & Ferries",
      "/garage": "My Garage",
    } as Record<string, string>,
    signIn: "Sign in",
    garageMenu: "🗺️ My Garage & Trips",
    plansMenu: "✨ Plans & upgrade",
    signOut: "Sign out",
    toggleNav: "Toggle navigation",
  },
  hero: {
    vehicles: { car: "Car", motorhome: "Motorhome", motorcycle: "Motorcycle" } as Record<VehicleKey, string>,
    fuels: { petrol: "Petrol", diesel: "Diesel", electric: "Electric (EV)" } as Record<FuelKey, string>,
    oneway: "One-Way Transit",
    returnTrip: "Return Trip / Vacation",
    duration: "Trip duration",
    origin: "Origin",
    destination: "Destination",
    originHint: "Start city or landmark (e.g., Munich, Oslo, Seattle)",
    destinationHint: "Where are you heading? (e.g., Amalfi Coast, Banff, Miami)",
    submit: "Calculate My Trip Cost →",
    addVia: "Add Via / Stop",
    viaHint: "Up to 3 intermediate waypoints — drag order with the arrows.",
    viaLimit: "You can add up to 3 via-stops per route.",
    viaPlaceholder: (i: number) => `Via stop ${i} — e.g. Innsbruck`,
    scenic: "✨ Prefer scenic mountain & coastal bypasses",
    avoidTolls: "🚫 Avoid paid toll roads",
    ferries: "⛴️ Include ferry crossings",
    fuelType: "Fuel / Power type",
    popularRoutes: "Popular cross-border routes",
    transponder: "Transponder / toll tag",
    consumption: "Fuel & consumption",
    fineTune: "Fine-tune consumption",
    fineTuneHint: "Used to refine fuel & charging estimates for your vehicle.",
    tankSize: "Tank / battery size",
    avgConsumption: "Average consumption",
    rangePerFill: "Range per fill",
    regionalDefaults: "Regional defaults",
    metric: "Metric (km, litres)",
    imperial: "Imperial (miles, gallons)",
    footnote: "Tolls, vignettes, fuel & charging, ferries — priced to the exact route.",
  },
  results: {
    eyebrow: "Your trip is ready",
    yourStart: "Your start",
    yourDestination: "Your destination",
    intro:
      "Here is everything you'll spend on the road — no surprises at the barrier, just a clear budget so you can enjoy the drive.",
    variants: {
      fastest: { label: "Fastest Route", blurb: "The standard optimal driving route — motorways all the way." },
      smart: {
        label: "Smart Bypass (toll-optimised)",
        blurb:
          "Balances toll cost against driving time — skips expensive corridors when the detour is cheap in minutes.",
      },
      tollfree: { label: "100% Toll-Free", blurb: "Strictly avoids every toll road, gantry and vignette zone." },
    } as Record<RouteVariantKey, { label: string; blurb: string }>,
    tollsShort: "tolls",
    saved: "Money saved",
    timeAdded: "Time added",
    displayCurrency: "Display currency",
    baseCurrencyNote: "Costs shown in the local base currency.",
    budget: "Total Trip Budget",
    budgetHint: "Tolls, energy, ferries and running costs",
    distance: "Total distance",
    distanceHint: "Door to door, your chosen route",
    driveTime: "Driving time",
    driveTimeHint: "Moving time, breaks excluded",
    energyHint: (amount: string) => `Approx. ${amount} for the route`,
    tollsBadge: "Tolls & Vignettes",
    ferriesBadge: "Ferries & Mountain Passes",
    save: "💾 Save to My Garage",
    share: "🔗 Share Trip",
    print: "🖨️ Print Turn-by-Turn Cost Itinerary",
    savedToast: "Saved to My Garage — it's waiting whenever you're ready.",
    saveError: "Couldn't save this trip right now.",
    shareToast: "Trip link copied — share the adventure.",
    savedOn: (d: string) => `Saved ${d}`,
    budgetWord: "budget",
    ferryTitle: "⛴️ Ferry & marine crossings detected",
    ferryIntro:
      "Your route touches water — here's every crossing with live-style timings and a direct link to the official booking desk.",
    duration: "Duration",
    frequency: "Frequency",
    indicative: "Indicative",
    officialBooking: "Official booking",
    breakdown: "Country & state breakdown",
    breakdownIntro: "Every checkpoint itemised, with direct links to the official portals.",
    vignetteTitle: "🏷️ Smart Vignette Period Optimizer",
    returnBadge: (d: number) => `Return trip · ${d} day${d > 1 ? "s" : ""} covered`,
    onewayBadge: "One-way transit · single leg",
    exempt: "Exempt",
    recommended: "Recommended",
    savesVs: (amount: string, baseline: string) => `Saves ${amount} vs the usual ${baseline}`,
    buyAt: "Buy at",
    vignetteTotal: "Optimised vignette cover for this route:",
    vignetteSaved: "saved by smart tier selection",
    vignetteTail: (ret: boolean): string =>
      ret
        ? "Distance tolls and ferry tickets are charged per crossing and doubled for your return leg."
        : "Distance tolls and ferry tickets are charged per crossing.",
    arbitrage: "Border fuel arbitrage",
    tip: "Tip",
    longStretch: "Long-stretch alerts (>180 km without a verified station)",
    badgeRadar: "🌱 Environmental & emission badge radar",
    badgeRadarIntro:
      "Sort these before you leave home — badges are checked at the city boundary, not at the border.",
    officialInfo: "Official info",
    scenicTitle: "Scenic & road trip highlights",
    scenicIntro: "Viewpoints and iconic passes worth the detour along your corridor.",
    rvToggle: "🚐 Show RV campgrounds & service areas",
    rvTitle: "🚐 RV campgrounds & service areas along the corridor",
    open: "Open",
    addStop: "+ Add as Stop",
    stopExists: (n: string) => `${n} is already a stop on this trip.`,
    stopAdded: (n: string, c: number) =>
      `${n} added — trip re-routed via ${c} extra stop${c > 1 ? "s" : ""}.`,
    at: "at",
  },
  drawer: {
    title: "Tolls, Vignettes & Fuel Costs by Country / State",
    subtitle: (n: number) =>
      `Live-style reference for ${n}+ countries and states — fuel, charging and toll systems at a glance.`,
    groups: {
      western: "Western Europe",
      alps: "Central & Alps",
      southern: "Southern Europe",
      nordics: "Nordics",
      us: "US States",
      ca: "Canada",
    } as Record<CostGroupKey, string>,
    petrol: "Petrol",
    diesel: "Diesel",
    fastDc: "Fast DC",
    planRoute: (c: string) => `🚀 Plan route to ${c}`,
    disclaimer: "Indicative estimates only — verify with official portals before travelling.",
  },
  footer: {
    tagline:
      "Cross-border road trip intelligence — tolls, vignettes, fuel, charging and ferries for cars, motorhomes and touring motorcycles.",
    productBy: "A product by",
    shield: "Transparent cross-border road trip calculations. Official toll data links.",
    quickLinks: "Quick links",
    company: "Company",
    regions: "Regions",
    howItWorks: "How It Works",
    pricing: "Pricing",
    faq: "FAQ",
    partners: "Partners",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    rights: "All rights reserved.",
    disclaimer: "Indicative estimates only — verify with official portals.",
  },
};

export type Strings = typeof en;

const no: Strings = {
  header: {
    regions: { eu: "Europa", us: "USA", ca: "Canada" },
    nav: {
      "/planner": "Ruteplanlegger",
      "/tolls": "Bompenger & Vignetter",
      "/scenic": "Fjelloverganger & Ferjer",
      "/garage": "Min Garasje",
    },
    signIn: "Logg inn",
    garageMenu: "🗺️ Min Garasje og turer",
    plansMenu: "✨ Abonnement og oppgradering",
    signOut: "Logg ut",
    toggleNav: "Vis/skjul meny",
  },
  hero: {
    vehicles: { car: "Bil", motorhome: "Bobil", motorcycle: "Motorsykkel" },
    fuels: { petrol: "Bensin", diesel: "Diesel", electric: "Elbil (EV)" },
    oneway: "Enveistur",
    returnTrip: "Tur–retur / ferie",
    duration: "Reisens lengde",
    origin: "Fra",
    destination: "Til",
    originHint: "Startby eller landemerke (f.eks. Oslo, Kristiansand, München)",
    destinationHint: "Hvor går drømmereisen? (f.eks. Amalfikysten, Gardasjøen, Lofoten)",
    submit: "Beregn reisekostnad →",
    addVia: "Legg til stopp underveis",
    viaHint: "Inntil 3 mellomstopp — endre rekkefølgen med pilene.",
    viaLimit: "Du kan legge til inntil 3 mellomstopp per rute.",
    viaPlaceholder: (i: number) => `Stopp ${i} underveis — f.eks. Innsbruck`,
    scenic: "✨ Foretrekk naturskjønne ruter og fjelloverganger",
    avoidTolls: "🚫 Unngå bomveier med avgift",
    ferries: "⛴️ Inkluder fergestrekninger",
    fuelType: "Drivstoff / energitype",
    popularRoutes: "Populære ruter på tvers av landegrenser",
    transponder: "Bombrikke / betalingsbrikke",
    consumption: "Drivstoff og forbruk",
    fineTune: "Finjuster forbruket",
    fineTuneHint: "Brukes til å gjøre estimatene for drivstoff og lading enda mer presise.",
    tankSize: "Tank- eller batteristørrelse",
    avgConsumption: "Gjennomsnittlig forbruk",
    rangePerFill: "Rekkevidde per fylling",
    regionalDefaults: "Regionale standarder",
    metric: "Metrisk (km, liter)",
    imperial: "Imperisk (miles, gallon)",
    footnote:
      "Bompenger, vignetter, drivstoff, lading og ferjer – nøyaktig beregnet for din rute.",
  },
  results: {
    eyebrow: "Turen din er klar",
    yourStart: "Startstedet ditt",
    yourDestination: "Reisemålet ditt",
    intro:
      "Her er alt du kommer til å bruke på veien — ingen overraskelser i bomringen, bare et tydelig budsjett så du kan nyte kjøreturen.",
    variants: {
      fastest: {
        label: "Raskeste rute",
        blurb: "Den vanlige, mest effektive ruten — motorvei hele veien.",
      },
      smart: {
        label: "Smart snarvei (bom-optimalisert)",
        blurb:
          "Veier bomkostnad mot kjøretid — hopper over dyre strekninger når omveien bare koster noen minutter.",
      },
      tollfree: {
        label: "100 % bompengefri",
        blurb: "Unngår konsekvent alle bomveier, bomstasjoner og vignettsoner.",
      },
    },
    tollsShort: "i bom",
    saved: "Spart",
    timeAdded: "Ekstra tid",
    displayCurrency: "Visningsvaluta",
    baseCurrencyNote: "Kostnadene vises i lokal basisvaluta.",
    budget: "Totalt reisebudsjett",
    budgetHint: "Bompenger, energi, ferjer og driftskostnader",
    distance: "Total distanse",
    distanceHint: "Dør til dør, for ruten du har valgt",
    driveTime: "Kjøretid",
    driveTimeHint: "Ren kjøretid, uten pauser",
    energyHint: (amount: string) => `Ca. ${amount} for hele ruten`,
    tollsBadge: "Bompenger og vignetter",
    ferriesBadge: "Ferjer og fjelloverganger",
    save: "💾 Lagre i Min Garasje",
    share: "🔗 Del turen",
    print: "🖨️ Skriv ut reiseoversikt",
    savedToast: "Lagret i Min Garasje — den venter på deg når du er klar.",
    saveError: "Klarte dessverre ikke å lagre turen akkurat nå.",
    shareToast: "Lenken er kopiert — del eventyret.",
    savedOn: (d: string) => `Lagret ${d}`,
    budgetWord: "i budsjett",
    ferryTitle: "⛴️ Ferje- og sjøstrekninger oppdaget",
    ferryIntro:
      "Ruten din krysser vann — her er hver overfart med tider og direkte lenke til offisiell billettluke.",
    duration: "Varighet",
    frequency: "Avganger",
    indicative: "Veiledende",
    officialBooking: "Offisiell booking",
    breakdown: "Oversikt per land og region",
    breakdownIntro: "Hvert bompunkt spesifisert, med direkte lenker til de offisielle portalene.",
    vignetteTitle: "🏷️ Smart vignettoptimalisering",
    returnBadge: (d: number) => `Tur–retur · ${d} ${d > 1 ? "dager" : "dag"} dekket`,
    onewayBadge: "Enveistur · én etappe",
    exempt: "Fritatt",
    recommended: "Anbefalt",
    savesVs: (amount: string, baseline: string) => `Sparer ${amount} mot vanlig ${baseline}`,
    buyAt: "Kjøp hos",
    vignetteTotal: "Optimalisert vignettdekning for denne ruten:",
    vignetteSaved: "spart ved smart valg av periode",
    vignetteTail: (ret: boolean) =>
      ret
        ? "Avstandsbaserte bompenger og ferjebilletter belastes per passering og er doblet for returetappen."
        : "Avstandsbaserte bompenger og ferjebilletter belastes per passering.",
    arbitrage: "Drivstoff-arbitrasje ved grensen",
    tip: "Smart sparetips",
    longStretch: "Varsel om lange strekk (>180 km uten verifisert stasjon)",
    badgeRadar: "🌱 Miljø- og utslippsmerkeradar",
    badgeRadarIntro:
      "Ordne dette før du drar hjemmefra — merkene kontrolleres ved bygrensen, ikke ved landegrensen.",
    officialInfo: "Offisiell informasjon",
    scenicTitle: "Naturperler og høydepunkter langs veien",
    scenicIntro: "Utsiktspunkter og ikoniske fjelloverganger som er verdt en liten omvei.",
    rvToggle: "🚐 Vis bobilplasser og serviceområder",
    rvTitle: "🚐 Bobilplasser og serviceområder langs ruten",
    open: "Åpent",
    addStop: "+ Legg til som stopp",
    stopExists: (n: string) => `${n} er allerede et stopp på denne turen.`,
    stopAdded: (n: string, c: number) =>
      `${n} lagt til — ruten er beregnet på nytt med ${c} ekstra ${c > 1 ? "stopp" : "stopp"}.`,
    at: "ved",
  },
  drawer: {
    title: "Bompenger, vignetter og drivstoffpriser per land",
    subtitle: (n: number) =>
      `Oppdatert oversikt for ${n}+ land og delstater — drivstoff, lading og bomsystemer på ett sted.`,
    groups: {
      western: "Vest-Europa",
      alps: "Sentral- & Alpe-Europa",
      southern: "Sør-Europa",
      nordics: "Norden",
      us: "USA (delstater)",
      ca: "Canada",
    },
    petrol: "Bensin",
    diesel: "Diesel",
    fastDc: "Hurtiglading",
    planRoute: (c: string) => `🚀 Planlegg rute til ${c}`,
    disclaimer: "Kun veiledende estimater — kontroller hos offisielle portaler før avreise.",
  },
  footer: {
    tagline: "Sømløs ruteplanlegging og kostnadskontroll på tvers av landegrenser.",
    productBy: "Utviklet av",
    shield: "Transparente beregninger på tvers av grenser. Lenker til offisielle bomdata.",
    quickLinks: "Snarveier",
    company: "Om oss",
    regions: "Regioner",
    howItWorks: "Hvordan det fungerer",
    pricing: "Priser",
    faq: "Ofte stilte spørsmål (FAQ)",
    partners: "Partnere",
    privacy: "Personvern",
    terms: "Brukervilkår",
    rights: "Alle rettigheter reservert.",
    disclaimer:
      "Alle beløp er veiledende estimater. Kontroller alltid oppdaterte takster hos offisielle aktører.",
  },
};

export const STRINGS: Record<Locale, Strings> = { en, no };

export function useT(): Strings {
  return STRINGS[useLocale()];
}
