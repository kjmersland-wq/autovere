import type { Locale } from "@/lib/i18n";
import type { RegionKey } from "@/lib/trip-data";

/**
 * Region-specific UI strings, translated per language.
 * Region (eu/us/ca) and language are independent — every region reads from here.
 */
export type RegionStrings = {
  eyebrow: string;
  originHint: string;
  destinationHint: string;
  tollSystems: string[];
  nav: { planner: string; tolls: string; scenic: string; garage: string };
};

type RegionPack = Record<RegionKey, RegionStrings>;

const en: RegionPack = {
  eu: {
    eyebrow: "Europe · 30+ countries",
    originHint: "Start city or landmark (e.g., Munich, Oslo, Seattle)",
    destinationHint: "Where are you heading? (e.g., Amalfi Coast, Banff, Miami)",
    tollSystems: ["Vignettes & e-vignettes", "Ticket-based motorway tolls", "Urban low-emission zones"],
    nav: { planner: "Road Trip Planner", tolls: "Tolls & Vignettes", scenic: "Scenic Passes & Ferries", garage: "My Garage" },
  },
  us: {
    eyebrow: "United States · 50 states",
    originHint: "Start city or landmark (e.g., Seattle, Denver, Miami)",
    destinationHint: "Where are you heading? (e.g., Big Sur, Moab, Key West)",
    tollSystems: ["State toll roads & turnpikes", "HOV / Express lanes", "Bridge & tunnel tolls"],
    nav: { planner: "Road Trip Planner", tolls: "Tolls & Express Lanes", scenic: "Scenic Byways & Ferries", garage: "My Garage" },
  },
  ca: {
    eyebrow: "Canada · coast to coast",
    originHint: "Start city or landmark (e.g., Toronto, Calgary, Halifax)",
    destinationHint: "Where are you heading? (e.g., Banff, Tofino, Gaspésie)",
    tollSystems: ["Highway 407 ETR bypass", "Provincial tolls & bridges", "BC Ferries crossings"],
    nav: { planner: "Road Trip Planner", tolls: "Tolls & Toll Highways", scenic: "Scenic Routes & Ferries", garage: "My Garage" },
  },
};

const no: RegionPack = {
  eu: {
    eyebrow: "Europa · 30+ land",
    originHint: "Startby eller landemerke (f.eks. München, Oslo, Berlin)",
    destinationHint: "Hvor skal du? (f.eks. Amalfikysten, Alpene, Praha)",
    tollSystems: ["Vignetter og e-vignetter", "Bomstasjoner med billett", "Lavutslippssoner i byer"],
    nav: { planner: "Ruteplanlegger", tolls: "Bompenger og vignetter", scenic: "Fjelloverganger og ferger", garage: "Min Garasje" },
  },
  us: {
    eyebrow: "USA · 50 delstater",
    originHint: "Startby eller landemerke (f.eks. Seattle, Denver, Miami)",
    destinationHint: "Hvor skal du? (f.eks. Big Sur, Moab, Key West)",
    tollSystems: ["Bomveier og turnpikes i delstatene", "HOV-/ekspressfelt", "Bro- og tunnelbompenger"],
    nav: { planner: "Ruteplanlegger", tolls: "Bompenger og ekspressfelt", scenic: "Naturskjønne veier og ferger", garage: "Min Garasje" },
  },
  ca: {
    eyebrow: "Canada · kyst til kyst",
    originHint: "Startby eller landemerke (f.eks. Toronto, Calgary, Halifax)",
    destinationHint: "Hvor skal du? (f.eks. Banff, Tofino, Gaspésie)",
    tollSystems: ["Highway 407 ETR-omkjøring", "Provinsielle bompenger og broer", "BC Ferries-overfarter"],
    nav: { planner: "Ruteplanlegger", tolls: "Bompenger og bomveier", scenic: "Naturskjønne ruter og ferger", garage: "Min Garasje" },
  },
};

const fr: RegionPack = {
  eu: {
    eyebrow: "Europe · plus de 30 pays",
    originHint: "Ville ou lieu de départ (ex. : Munich, Oslo, Lyon)",
    destinationHint: "Où allez-vous ? (ex. : côte amalfitaine, Alpes, Prague)",
    tollSystems: ["Vignettes et e-vignettes", "Péages autoroutiers à ticket", "Zones à faibles émissions urbaines"],
    nav: { planner: "Planificateur de road trip", tolls: "Péages et vignettes", scenic: "Cols panoramiques et ferries", garage: "Mon garage" },
  },
  us: {
    eyebrow: "États-Unis · 50 États",
    originHint: "Ville ou lieu de départ (ex. : Seattle, Denver, Miami)",
    destinationHint: "Où allez-vous ? (ex. : Big Sur, Moab, Key West)",
    tollSystems: ["Autoroutes à péage des États", "Voies HOV / express", "Péages de ponts et tunnels"],
    nav: { planner: "Planificateur de road trip", tolls: "Péages et voies express", scenic: "Routes panoramiques et ferries", garage: "Mon garage" },
  },
  ca: {
    eyebrow: "Canada · d'un océan à l'autre",
    originHint: "Ville ou lieu de départ (ex. : Toronto, Calgary, Halifax)",
    destinationHint: "Où allez-vous ? (ex. : Banff, Tofino, Gaspésie)",
    tollSystems: ["Contournement de l'autoroute 407 ETR", "Péages et ponts provinciaux", "Traversées BC Ferries"],
    nav: { planner: "Planificateur de road trip", tolls: "Péages et autoroutes à péage", scenic: "Routes panoramiques et traversiers", garage: "Mon garage" },
  },
};

const de: RegionPack = {
  eu: {
    eyebrow: "Europa · über 30 Länder",
    originHint: "Startstadt oder Wahrzeichen (z. B. München, Oslo, Wien)",
    destinationHint: "Wohin geht die Reise? (z. B. Amalfiküste, Alpen, Prag)",
    tollSystems: ["Vignetten & E-Vignetten", "Ticketbasierte Autobahnmaut", "Städtische Umweltzonen"],
    nav: { planner: "Roadtrip-Planer", tolls: "Maut & Vignetten", scenic: "Panoramapässe & Fähren", garage: "Meine Garage" },
  },
  us: {
    eyebrow: "USA · 50 Bundesstaaten",
    originHint: "Startstadt oder Wahrzeichen (z. B. Seattle, Denver, Miami)",
    destinationHint: "Wohin geht die Reise? (z. B. Big Sur, Moab, Key West)",
    tollSystems: ["Mautstraßen & Turnpikes der Bundesstaaten", "HOV-/Express-Spuren", "Brücken- und Tunnelmaut"],
    nav: { planner: "Roadtrip-Planer", tolls: "Maut & Express-Spuren", scenic: "Panoramastraßen & Fähren", garage: "Meine Garage" },
  },
  ca: {
    eyebrow: "Kanada · von Küste zu Küste",
    originHint: "Startstadt oder Wahrzeichen (z. B. Toronto, Calgary, Halifax)",
    destinationHint: "Wohin geht die Reise? (z. B. Banff, Tofino, Gaspésie)",
    tollSystems: ["Highway 407 ETR – Umfahrung", "Provinzielle Maut & Brücken", "BC-Ferries-Überfahrten"],
    nav: { planner: "Roadtrip-Planer", tolls: "Maut & Mautautobahnen", scenic: "Panoramarouten & Fähren", garage: "Meine Garage" },
  },
};

const nl: RegionPack = {
  eu: {
    eyebrow: "Europa · 30+ landen",
    originHint: "Startstad of oriëntatiepunt (bijv. München, Oslo, Utrecht)",
    destinationHint: "Waar ga je heen? (bijv. Amalfikust, Alpen, Praag)",
    tollSystems: ["Vignetten & e-vignetten", "Tolwegen met ticket", "Stedelijke milieuzones"],
    nav: { planner: "Roadtripplanner", tolls: "Tol & vignetten", scenic: "Panoramapassen & veerboten", garage: "Mijn garage" },
  },
  us: {
    eyebrow: "Verenigde Staten · 50 staten",
    originHint: "Startstad of oriëntatiepunt (bijv. Seattle, Denver, Miami)",
    destinationHint: "Waar ga je heen? (bijv. Big Sur, Moab, Key West)",
    tollSystems: ["Tolwegen & turnpikes per staat", "HOV-/expressstroken", "Brug- en tunneltol"],
    nav: { planner: "Roadtripplanner", tolls: "Tol & expressstroken", scenic: "Panoramaroutes & veerboten", garage: "Mijn garage" },
  },
  ca: {
    eyebrow: "Canada · van kust tot kust",
    originHint: "Startstad of oriëntatiepunt (bijv. Toronto, Calgary, Halifax)",
    destinationHint: "Waar ga je heen? (bijv. Banff, Tofino, Gaspésie)",
    tollSystems: ["Highway 407 ETR-omleiding", "Provinciale tol & bruggen", "BC Ferries-overtochten"],
    nav: { planner: "Roadtripplanner", tolls: "Tol & tolwegen", scenic: "Panoramaroutes & veerboten", garage: "Mijn garage" },
  },
};

const sv: RegionPack = {
  eu: {
    eyebrow: "Europa · 30+ länder",
    originHint: "Startstad eller landmärke (t.ex. München, Oslo, Stockholm)",
    destinationHint: "Vart är du på väg? (t.ex. Amalfikusten, Alperna, Prag)",
    tollSystems: ["Vinjetter och e-vinjetter", "Biljettbaserade motorvägsavgifter", "Miljözoner i städer"],
    nav: { planner: "Roadtrip-planerare", tolls: "Vägavgifter och vinjetter", scenic: "Panoramapass och färjor", garage: "Mitt garage" },
  },
  us: {
    eyebrow: "USA · 50 delstater",
    originHint: "Startstad eller landmärke (t.ex. Seattle, Denver, Miami)",
    destinationHint: "Vart är du på väg? (t.ex. Big Sur, Moab, Key West)",
    tollSystems: ["Delstatliga betalvägar och turnpikes", "HOV-/expressfiler", "Bro- och tunnelavgifter"],
    nav: { planner: "Roadtrip-planerare", tolls: "Vägavgifter och expressfiler", scenic: "Natursköna vägar och färjor", garage: "Mitt garage" },
  },
  ca: {
    eyebrow: "Kanada · kust till kust",
    originHint: "Startstad eller landmärke (t.ex. Toronto, Calgary, Halifax)",
    destinationHint: "Vart är du på väg? (t.ex. Banff, Tofino, Gaspésie)",
    tollSystems: ["Highway 407 ETR-förbifart", "Provinsiella vägavgifter och broar", "BC Ferries-överfarter"],
    nav: { planner: "Roadtrip-planerare", tolls: "Vägavgifter och betalvägar", scenic: "Natursköna rutter och färjor", garage: "Mitt garage" },
  },
};

const da: RegionPack = {
  eu: {
    eyebrow: "Europa · 30+ lande",
    originHint: "Startby eller vartegn (f.eks. München, Oslo, København)",
    destinationHint: "Hvor skal du hen? (f.eks. Amalfikysten, Alperne, Prag)",
    tollSystems: ["Vignetter og e-vignetter", "Billetbaserede motorvejsafgifter", "Miljøzoner i byerne"],
    nav: { planner: "Roadtrip-planlægger", tolls: "Vejafgifter og vignetter", scenic: "Panoramapas og færger", garage: "Min garage" },
  },
  us: {
    eyebrow: "USA · 50 delstater",
    originHint: "Startby eller vartegn (f.eks. Seattle, Denver, Miami)",
    destinationHint: "Hvor skal du hen? (f.eks. Big Sur, Moab, Key West)",
    tollSystems: ["Delstatslige betalingsveje og turnpikes", "HOV-/ekspresbaner", "Bro- og tunnelafgifter"],
    nav: { planner: "Roadtrip-planlægger", tolls: "Vejafgifter og ekspresbaner", scenic: "Naturskønne veje og færger", garage: "Min garage" },
  },
  ca: {
    eyebrow: "Canada · kyst til kyst",
    originHint: "Startby eller vartegn (f.eks. Toronto, Calgary, Halifax)",
    destinationHint: "Hvor skal du hen? (f.eks. Banff, Tofino, Gaspésie)",
    tollSystems: ["Highway 407 ETR-omfartsvej", "Provinsielle vejafgifter og broer", "BC Ferries-overfarter"],
    nav: { planner: "Roadtrip-planlægger", tolls: "Vejafgifter og betalingsveje", scenic: "Naturskønne ruter og færger", garage: "Min garage" },
  },
};

const pl: RegionPack = {
  eu: {
    eyebrow: "Europa · ponad 30 krajów",
    originHint: "Miasto startowe lub punkt orientacyjny (np. Monachium, Oslo, Kraków)",
    destinationHint: "Dokąd jedziesz? (np. Wybrzeże Amalfi, Alpy, Praga)",
    tollSystems: ["Winiety i e-winiety", "Autostrady biletowe", "Miejskie strefy czystego transportu"],
    nav: { planner: "Planer podróży", tolls: "Opłaty i winiety", scenic: "Widokowe przełęcze i promy", garage: "Mój garaż" },
  },
  us: {
    eyebrow: "USA · 50 stanów",
    originHint: "Miasto startowe lub punkt orientacyjny (np. Seattle, Denver, Miami)",
    destinationHint: "Dokąd jedziesz? (np. Big Sur, Moab, Key West)",
    tollSystems: ["Stanowe drogi płatne i turnpike", "Pasy HOV / ekspresowe", "Opłaty za mosty i tunele"],
    nav: { planner: "Planer podróży", tolls: "Opłaty i pasy ekspresowe", scenic: "Trasy widokowe i promy", garage: "Mój garaż" },
  },
  ca: {
    eyebrow: "Kanada · od oceanu do oceanu",
    originHint: "Miasto startowe lub punkt orientacyjny (np. Toronto, Calgary, Halifax)",
    destinationHint: "Dokąd jedziesz? (np. Banff, Tofino, Gaspésie)",
    tollSystems: ["Objazd autostradą 407 ETR", "Prowincjonalne opłaty i mosty", "Przeprawy BC Ferries"],
    nav: { planner: "Planer podróży", tolls: "Opłaty i autostrady płatne", scenic: "Trasy widokowe i promy", garage: "Mój garaż" },
  },
};

const PACKS: Record<Locale, RegionPack> = { en, no, sv, da, de, nl, fr, pl, es: en, it: en };

export function regionStrings(locale: Locale, region: RegionKey): RegionStrings {
  return (PACKS[locale] ?? en)[region];
}
