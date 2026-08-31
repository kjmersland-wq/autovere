import { useRouterState } from "@tanstack/react-router";

import type { CostGroupKey } from "@/lib/country-costs";
import type { FuelKey, RouteVariantKey, VehicleKey } from "@/lib/trip-data";

export type Locale = "en" | "no";

import { CONTENT_NO } from "@/lib/content-no";

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
  export: {
    title: "Export & navigate",
    intro:
      "Take this route with you — sat-nav files, one-tap navigation, or a clean printed cost summary for the glovebox.",
    gpx: "📥 Download GPX File",
    kml: "📄 Download KML File",
    fileHint:
      "GPX works with Garmin zūmo, TomTom Rider and BMW Motorrad Connected · KML opens in Google Earth.",
    navTitle: "1-click navigation",
    google: "Open in Google Maps",
    apple: "Open in Apple Maps",
    waze: "Open in Waze",
    sendToCar: "🚘 Send to Connected Vehicle",
    handoffHint: "Quick hand-off to your car's built-in navigation.",
    handoffToast: (n: string) => `Route handed off to ${n}.`,
    print: "🖨️ Print Turn-by-Turn Cost Summary",
    printHint: "Paper-friendly PDF with every toll checkpoint and fuel stop.",
    gpxToast: "GPX ready — load it into Garmin, TomTom Rider or BMW Motorrad Connected.",
    kmlToast: "KML ready — open it in Google Earth or your mapping overlay.",
    popupError: "Allow pop-ups to print your itinerary.",
    hints: {
      tesla: "Send destination via your Tesla account",
      bmw: "Send to Car via My BMW / Motorrad Connected",
      mercedes: "Push the route to MBUX navigation",
      phone: "Opens the maps hand-off link on your phone",
    } as Record<string, string>,
  },
  compliance: {
    clearanceTitle: "🚐 Motorhome weight & clearance radar",
    clearanceIntro:
      "Confirm your plated weight and travelling height — the rules change sharply above 3.5 t and 3.2 m.",
    heavyToggle: "My motorhome is over 3.5 t",
    heavyHint: "Maximum permissible mass on the registration plate, not the kerb weight.",
    heightLabel: "Travelling height",
    heightAria: "Vehicle height in metres",
    heightHint: "Measure to the highest fixed point including solar panels and roof boxes.",
    heavyWarning:
      "⚠️ Over 3.5 t your standard car vignette is not valid. Switch to the heavy-vehicle system in each country below before your first motorway kilometre.",
    appliesAt: (h: string) => `Applies at ${h} m`,
    speedTitle: "Speed limits & overtaking bans",
    officialPortal: "Official portal",
    lezTitle: "Urban low emission zone monitor",
    lezDetected: (n: number) => `${n} detected on this corridor`,
    lezOverview: "Regional overview",
    lezIntro:
      "Order badges and register plates before you travel — most zones are camera-enforced with no on-site payment.",
    tagTitle: "My toll transponders & tags",
    tagIntro:
      "Tick the tags you already carry — we mark the matching booths as auto-detected lanes and re-price your tolls.",
    tagAuto: "🟢 Auto-detected lane / no cash stop required",
    tagSaving: (p: number) => `Typical saving on covered tolls: ${p}%`,
    tagNone: (amount: string) => `No tags selected — tolls stay at ${amount} with cash/card booth stops.`,
    tagActivePrefix: (n: number) => `With ${n} tag${n > 1 ? "s" : ""} active your tolls drop from`,
    tagTo: "to",
    tagSavingTail: (amount: string, pct: number) =>
      `— saving ${amount} (${pct}% on covered booths) and skipping every cash lane.`,
  },
  map: {
    title: "Corridor radar map",
    corridorBadge: (d: string) => `${d} corridor`,
    intro: (from: string, to: string) => `Live service radar along ${from} → ${to}. Toggle the layers you care about.`,
    tooltipIn: "in",
    fuelTitle: "Fuel stops & live prices along the route",
    stations: (n: number) => `${n} stations`,
    source: "Source",
    alongRoute: "along route",
    addRefuel: "Add as Refuel Stop",
    campTitle: "🚐 Motorhome & camping radar",
    campIntro:
      "Rated campsites, aires and service points along the active corridor — add any of them straight into your itinerary.",
    addItinerary: "Add to itinerary",
    yourStart: "Your start",
    yourDestination: "Your destination",
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
  export: {
    title: "Eksport og navigasjon",
    intro:
      "Ta ruten med deg — filer til GPS-en, navigasjon med ett trykk, eller en ryddig utskrift til hanskerommet.",
    gpx: "📥 Last ned GPX-fil",
    kml: "📄 Last ned KML-fil",
    fileHint:
      "GPX fungerer med Garmin zūmo, TomTom Rider og BMW Motorrad Connected · KML åpnes i Google Earth.",
    navTitle: "Navigasjon med ett klikk",
    google: "Åpne i Google Maps",
    apple: "Åpne i Apple Maps",
    waze: "Åpne i Waze",
    sendToCar: "🚘 Send til bilens navigasjon",
    handoffHint: "Rask overføring til bilens innebygde navigasjon.",
    handoffToast: (n: string) => `Ruten er sendt til ${n}.`,
    print: "🖨️ Skriv ut kostnadsoversikt",
    printHint: "Utskriftsvennlig PDF med alle bompunkter og drivstoffstopp.",
    gpxToast: "GPX er klar — last den inn i Garmin, TomTom Rider eller BMW Motorrad Connected.",
    kmlToast: "KML er klar — åpne den i Google Earth eller ditt eget kartlag.",
    popupError: "Tillat popup-vinduer for å skrive ut reiseoversikten.",
    hints: {
      tesla: "Send reisemålet via Tesla-kontoen din",
      bmw: "Send til bilen via My BMW / Motorrad Connected",
      mercedes: "Send ruten til MBUX-navigasjonen",
      phone: "Åpner overføringslenken til kart på mobilen din",
    },
  },
  compliance: {
    clearanceTitle: "🚐 Vekt- og høyderadar for bobil",
    clearanceIntro:
      "Bekreft totalvekt og reisehøyde — reglene endrer seg markant over 3,5 tonn og 3,2 meter.",
    heavyToggle: "Bobilen min veier over 3,5 tonn",
    heavyHint: "Tillatt totalvekt i vognkortet, ikke egenvekten.",
    heightLabel: "Reisehøyde",
    heightAria: "Kjøretøyets høyde i meter",
    heightHint: "Mål til høyeste faste punkt, inkludert solcellepanel og takboks.",
    heavyWarning:
      "⚠️ Over 3,5 tonn gjelder ikke den vanlige personbilvignetten. Bytt til tungbilsystemet i hvert land under før din første motorveikilometer.",
    appliesAt: (h: string) => `Gjelder ved ${h} m`,
    speedTitle: "Fartsgrenser og forbikjøringsforbud",
    officialPortal: "Offisiell portal",
    lezTitle: "Overvåking av lavutslippssoner i byer",
    lezDetected: (n: number) => `${n} funnet langs denne ruten`,
    lezOverview: "Regional oversikt",
    lezIntro:
      "Bestill miljømerker og registrer skiltnummer før avreise — de fleste sonene kontrolleres med kamera, uten betaling på stedet.",
    tagTitle: "Mine bombrikker og betalingsbrikker",
    tagIntro:
      "Huk av for brikkene du allerede har — vi merker bomstasjonene som automatiske felt og regner om bompengene.",
    tagAuto: "🟢 Automatisk felt / ingen kontantstopp",
    tagSaving: (p: number) => `Vanlig rabatt på dekkede bompenger: ${p} %`,
    tagNone: (amount: string) =>
      `Ingen brikker valgt — bompengene blir ${amount} med stopp for kort/kontant.`,
    tagActivePrefix: (n: number) => `Med ${n} ${n > 1 ? "brikker" : "brikke"} aktivert faller bompengene fra`,
    tagTo: "til",
    tagSavingTail: (amount: string, pct: number) =>
      `— du sparer ${amount} (${pct} % på dekkede bomstasjoner) og slipper alle kontantfelt.`,
  },
  map: {
    title: "Ruteradar med kart",
    corridorBadge: (d: string) => `${d} korridor`,
    intro: (from: string, to: string) =>
      `Live servicekart langs ${from} → ${to}. Slå på lagene du er interessert i.`,
    tooltipIn: "inn i ruten",
    fuelTitle: "Drivstoffstopp og priser langs ruten",
    stations: (n: number) => `${n} stasjoner`,
    source: "Kilde",
    alongRoute: "langs ruten",
    addRefuel: "Legg til som fyllestopp",
    campTitle: "🚐 Bobil- og campingradar",
    campIntro:
      "Campingplasser, bobilparkeringer og servicepunkter langs ruten — legg dem rett inn i reiseplanen din.",
    addItinerary: "Legg til i reiseplanen",
    yourStart: "Startstedet ditt",
    yourDestination: "Reisemålet ditt",
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

/** Translator for copy that lives in data modules, keyed by the English source string. */
export function useTr(): (value: string) => string {
  const locale = useLocale();
  return (value: string) => (locale === "no" ? (CONTENT_NO[value] ?? value) : value);
}
