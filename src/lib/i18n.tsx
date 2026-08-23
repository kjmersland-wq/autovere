import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * Minimal i18n layer. Add a new locale by adding a dictionary below —
 * every string in the UI resolves through useT().
 */
export const en = {
  brand: "AutoVere",
  tagline: "European toll, vignette & charging intelligence",
  heroTitle: "Know the real cost before you drive.",
  heroSub:
    "Instant, deterministic toll, vignette, fuel and charging estimates for any European road trip — built on open data, no accounts, no reseller markups.",
  from: "From",
  to: "To",
  fromPlaceholder: "Oslo, Norway",
  toPlaceholder: "Milan, Italy",
  vehicle: "Vehicle",
  petrol: "Petrol",
  diesel: "Diesel",
  ev: "Electric (EV)",
  batteryRange: "Real-world range",
  chargingBuffer: "Charging stops are planned at 75% of this range so you always arrive with a buffer.",
  tripDuration: "Trip duration",
  days: "days",
  day: "day",
  calculate: "Calculate my trip",
  calculating: "Calculating…",
  comparison: "Route comparison",
  fastest: "Fastest Route",
  bypass: "Smart Bypass",
  tollfree: "100% Toll-Free",
  distance: "Distance",
  driveTime: "Drive time",
  fuel: "Fuel",
  charging: "Charging",
  tolls: "Distance tolls",
  vignettes: "Vignettes",
  total: "Total trip cost",
  openGoogle: "Open in Google Maps",
  openApple: "Open in Apple Maps",
  downloadGpx: "Download GPX",
  checklist: "Official vignette checklist",
  checklistSub:
    "Buy only from these official government portals. Resellers charge up to 300% markup for the same vignette.",
  chargingStops: "Charging stops",
  chargingTime: "Charging time",
  noVignettes: "No vignettes required on this route.",
  selected: "Selected",
  select: "Select route",
  savings: "saves",
  slower: "slower",
  faster: "faster",
  year: "year",
  language: "Language",
  currency: "Currency",
  scenicTitle: "Scenic Highlights & Stops along Route",
  scenicSub: "Curated places worth a pause along your corridor.",
  scenicPicks: "OpenStreetMap picks",
  all: "All",
  camping: "Camping & RV",
  lodging: "Hotels & Lodging",
  food: "Food & Cafes",
  sights: "Sights & Views",
  viewpoint: "Viewpoint",
  history: "History",
  nature: "Nature",
  coffeeStop: "Coffee stop",
  directlyOnRoute: "Directly on route",
  minDetour: (minutes: number) => `+${minutes} min detour`,
  openMap: "Maps",
  website: "Site",
  add: "Add",
  added: "Added",
  amenities: "Amenities",
  sendToCar: "Send to Car & Navigation",
  sendDescription: "Share this route with your connected car app or export it for your in-car GPS.",
  sendMobile: "Send to Mobile / Car App",
  shared: "Shared",
  tesla: "Tesla Navigation",
  googleMultiStop: "Google Maps multi-stop",
  appleWaypoints: "Apple Maps waypoints",
  waze: "Waze navigation",
  downloadKml: "Download KML",
  plannedTotal: "Planned route total",
  mapUnavailable: "The map is temporarily unavailable. Your route calculation is still ready below.",
  lezWarning: (stickers: string) => `Environmental sticker may be required in ${stickers}.`,
  cheapest: "Cheapest",
  noTolls: "None on this route",
  pumpPrices: "Country-by-country pump prices",
  fullBreakdown: "Full breakdown",
  estimatedConsumption: "Estimated consumption",
  earnedPerHour: "earned per hour of extra driving",
  borderCheckpoint: "Border checkpoint",
  vignetteTerminal: "vignette terminal",
  badgeMath: "Instant deterministic maths",
  badgeOffline: "Installable & works offline",
  badgeOfficial: "Official portals only",
  tollStatus: "Distance tolls",
  vignetteStatus: "Vignette required",
  noTollStatus: "None on this route",
  tollBooths: "Toll booths / electronic tolling",
  highPower: "High power",
  intoTrip: "into the trip",
  start: "Start",
  destination: "Destination",
  border: "Border",
  and: "and",
  duration: (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainder = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${remainder.toString().padStart(2, "0")}m` : `${remainder}m`;
  },
  tradeoff: (time: string, route: string, amount: string, rate: string) => `+${time} on the ${route} saves ${amount} (${rate} saved per hour of detour).`,
  routeCompared: (count: number, route: string) => `${count} routes compared — cheapest: ${route}`,
  calculationFailed: "Calculation failed. Please try again.",
  chargingUnavailable: "Charging network data is temporarily unavailable.",
  gpxDownloaded: "GPX downloaded — import it into your in-car GPS.",
  footerDisclaimer: "Routing and map data © OpenStreetMap contributors, routed via the public OSRM service. Toll, vignette and energy figures are indicative averages for passenger cars and are calculated on your device. Always confirm prices on the official portals linked above.",
  norwayAutopassTitle: "Norway AutoPASS / EPASS24",
  norwayAutopassDescription: "Norway uses 100% automated electronic toll gantries (no physical booths). Foreign vehicles should pre-register vehicle details at EPASS24 / AutoPASS to ensure correct environmental fuel rates.",
  visitEpass24: "Visit EPASS24",
  visitAutopass: "Visit AutoPASS",
} as const;

export type Dict = typeof en;
export type Locale = "en" | "de" | "no" | "fr";
const GERMAN_COUNTRIES: Record<string, string> = {
  DE: "Deutschland", AT: "Österreich", CH: "Schweiz", IT: "Italien", FR: "Frankreich",
  DK: "Dänemark", SE: "Schweden", NO: "Norwegen", SI: "Slowenien", CZ: "Tschechien",
  HR: "Kroatien", SK: "Slowakei", HU: "Ungarn", PL: "Polen", NL: "Niederlande",
  BE: "Belgien", LU: "Luxemburg", ES: "Spanien", PT: "Portugal", RO: "Rumänien",
  BG: "Bulgarien", GR: "Griechenland",
};

const de: Dict = {
  ...en,
  norwayAutopassTitle: "Norwegen AutoPASS / EPASS24 Mautsystem",
  norwayAutopassDescription: "Norwegen nutzt vollständig automatische, schrankenlose Mautkameras. Ausländische Fahrer sollten Kennzeichen und Kraftstoffart bei EPASS24 / AutoPASS registrieren, damit Elektrofahrzeuge nicht versehentlich den Benzintarif zahlen.",
  visitEpass24: "EPASS24 öffnen",
  visitAutopass: "AutoPASS öffnen",
  tagline: "Europäische Maut-, Vignetten- und Ladeintelligenz",
  heroTitle: "Kenne die echten Reisekosten, bevor du losfährst.",
  heroSub: "Genaue Maut-, Vignetten-, Sprit- und Ladestopp-Berechnung für deinen Europa-Roadtrip. Offene Daten, keine versteckten Gebühren.",
  from: "Startort", to: "Zielort", fromPlaceholder: "z. B. München", toPlaceholder: "z. B. Mailand",
  vehicle: "Fahrzeug", petrol: "Benzin", diesel: "Diesel", ev: "Elektro (EV)", batteryRange: "Reale Reichweite",
  chargingBuffer: "Ladestopps werden bei 75 % Puffer geplant, damit du immer entspannt ankommst.",
  tripDuration: "Reisedauer", days: "Tage", day: "Tag", calculate: "Route & Kosten berechnen", calculating: "Berechnung…",
  comparison: "Routenvergleich", fastest: "Schnellste Route", bypass: "Smarter Bypass (Maut sparen)", tollfree: "100 % Mautfrei",
  fuel: "Sprit", charging: "Laden", tolls: "Streckenmaut", vignettes: "Vignetten", total: "Gesamtkosten",
  openGoogle: "In Google Maps öffnen", openApple: "In Apple Maps öffnen", downloadGpx: "GPX-Datei herunterladen (für Auto-USB & Navi)",
  checklist: "Offizielle Vignetten-Checkliste", checklistSub: "Kaufe Vignetten ausschließlich über offizielle Portale. Drittanbieter verlangen bis zu 300 % Aufschlag für dieselbe Vignette.",
  chargingStops: "Ladestopps", chargingTime: "Ladezeit", noVignettes: "Keine Vignetten auf dieser Route erforderlich.",
  selected: "Ausgewählt", select: "Route auswählen", savings: "spart", slower: "langsamer", faster: "schneller",
  year: "Jahr", language: "Sprache wählen", currency: "Währungsauswahl", scenicTitle: "Highlights & Stopps entlang der Route",
  scenicSub: "Kuratierte Orte für eine lohnende Pause.", scenicPicks: "OpenStreetMap-Auswahl", all: "Alle", camping: "Camping & Wohnmobil",
  lodging: "Hotels & Unterkünfte", food: "Essen & Cafés", sights: "Aussicht & Kultur", viewpoint: "Aussichtspunkt", history: "Geschichte",
  nature: "Natur", coffeeStop: "Kaffeestopp", directlyOnRoute: "Direkt an der Route", minDetour: (m) => `+${m} Min. Umweg`, openMap: "In Google Maps öffnen", website: "Webseite besuchen", add: "Zur Route hinzufügen", added: "Hinzugefügt", amenities: "Ausstattung",
  sendToCar: "Route an dein Auto & Navi senden", sendDescription: "Wegpunkte und Ladestopps direkt in deine Navigations-App oder dein Fahrzeug übertragen.", sendMobile: "An Smartphone / Auto-App senden", shared: "Geteilt", tesla: "Tesla-Navigation", googleMultiStop: "In Google Maps öffnen", appleWaypoints: "In Apple Maps öffnen", waze: "Waze-Navigation", downloadKml: "KML-Datei herunterladen", plannedTotal: "Geplante Routensumme", mapUnavailable: "Die Karte ist vorübergehend nicht verfügbar. Die Routenberechnung ist unten bereit.", lezWarning: (s) => `Umweltplakette kann erforderlich sein in ${s}.`, cheapest: "Günstigste", noTolls: "Keine Maut auf dieser Route", pumpPrices: "Länderabhängige Spritpreise", fullBreakdown: "Vollständige Aufschlüsselung", estimatedConsumption: "Geschätzter Verbrauch", earnedPerHour: "gespart pro Stunde Umweg", borderCheckpoint: "Grenzkontrolle", vignetteTerminal: "Vignettenstation", badgeMath: "Exakte Berechnungen", badgeOffline: "Funktioniert offline", badgeOfficial: "Nur offizielle Portale", tollStatus: "Streckenmaut", vignetteStatus: "Vignette erforderlich", noTollStatus: "Keine Maut auf dieser Route", tollBooths: "Mautstellen / elektronische Maut", highPower: "Hohe Ladeleistung", intoTrip: "in die Reise", start: "Start", destination: "Ziel", border: "Grenze", and: "und", duration: (m) => { const h = Math.floor(m / 60); const min = Math.round(m % 60); return h > 0 ? `${h} Std. ${min.toString().padStart(2, "0")} Min.` : `${min} Min.`; }, tradeoff: (time, route, amount, rate) => `+${time} auf der ${route} spart dir ${amount} (${rate} gespart pro Stunde Umweg).`, routeCompared: (count, route) => `${count} Routen verglichen — günstigste: ${route}`, calculationFailed: "Berechnung fehlgeschlagen. Bitte versuche es erneut.", chargingUnavailable: "Ladenetzwerk ist vorübergehend nicht verfügbar.", gpxDownloaded: "GPX heruntergeladen — importiere es in dein Fahrzeug-GPS.", footerDisclaimer: "Routen- und Kartendaten © OpenStreetMap-Mitwirkende, berechnet über den öffentlichen OSRM-Dienst. Maut-, Vignetten- und Energiewerte sind Richtwerte für Pkw und werden auf deinem Gerät berechnet. Prüfe Preise immer auf den verlinkten offiziellen Portalen.",
};

const no: Dict = { ...de, tagline: "Europeisk bom-, vignett- og ladeintelligens", heroTitle: "Kjenn den virkelige kostnaden før du kjører.", from: "Fra", to: "Til", petrol: "Bensin", diesel: "Diesel", ev: "Elektrisk (EV)", calculate: "Beregn turen", calculating: "Beregner…", comparison: "Rutesammenligning", fastest: "Raskeste rute", bypass: "Smart omvei", tollfree: "100% bomfri", fuel: "Drivstoff", charging: "Lading", tolls: "Avstandsavgifter", vignettes: "Vignetter", total: "Total reisekostnad", checklist: "Offisiell vignettliste", chargingStops: "Ladestopp", chargingTime: "Ladetid", noVignettes: "Ingen vignetter kreves på denne ruten.", selected: "Valgt", year: "år", language: "Språk", currency: "Valuta", all: "Alle", camping: "Camping og bobil", lodging: "Hotell og overnatting", food: "Mat og kaféer", sights: "Severdigheter", directlyOnRoute: "Direkte på ruten", add: "Legg til", added: "Lagt til", sendToCar: "Send til bil og navigasjon", sendMobile: "Send til mobil / bilapp", shared: "Delt", downloadKml: "Last ned KML", plannedTotal: "Planlagt rutesum", minDetour: (m) => `+${m} min omvei`, lezWarning: (s) => `Miljømerke kan kreves i ${s}.` };

const fr: Dict = { ...de, tagline: "Intelligence européenne des péages, vignettes et recharges", heroTitle: "Connaissez le vrai coût avant de partir.", from: "De", to: "À", petrol: "Essence", diesel: "Diesel", ev: "Électrique (VE)", calculate: "Calculer mon trajet", calculating: "Calcul…", comparison: "Comparaison des itinéraires", fastest: "Itinéraire le plus rapide", bypass: "Détour intelligent", tollfree: "100% sans péage", fuel: "Carburant", charging: "Recharge", tolls: "Péages à la distance", vignettes: "Vignettes", total: "Coût total du trajet", checklist: "Liste des vignettes officielles", chargingStops: "Arrêts recharge", chargingTime: "Temps de recharge", noVignettes: "Aucune vignette requise sur cet itinéraire.", selected: "Sélectionné", year: "an", language: "Langue", currency: "Devise", all: "Toutes", camping: "Camping et camping-car", lodging: "Hôtels et hébergements", food: "Restaurants et cafés", sights: "Sites et panoramas", directlyOnRoute: "Directement sur l'itinéraire", add: "Ajouter", added: "Ajouté", sendToCar: "Envoyer à la voiture et navigation", sendMobile: "Envoyer au mobile / à l'application voiture", shared: "Partagé", downloadKml: "Télécharger KML", plannedTotal: "Total prévu", minDetour: (m) => `+${m} min de détour`, lezWarning: (s) => `Une vignette environnementale peut être requise en ${s}.` };

export const locales: Record<Locale, Dict> = { en, de, no, fr };

const I18nContext = createContext<{ t: Dict; locale: string; setLocale: (l: string) => void }>({
  t: en,
  locale: "en",
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState("en");
  useEffect(() => {
    const saved = window.localStorage.getItem("autovere-locale") as Locale | null;
    const browser = navigator.language.toLowerCase();
    const detected: Locale = browser.startsWith("de") ? "de" : browser.startsWith("no") || browser.startsWith("nb") ? "no" : browser.startsWith("fr") ? "fr" : "en";
    setLocale(saved && saved in locales ? saved : detected);
    document.documentElement.lang = saved && saved in locales ? saved : detected;
  }, []);
  const chooseLocale = (next: string) => {
    if (!(next in locales)) return;
    setLocale(next);
    window.localStorage.setItem("autovere-locale", next);
    document.documentElement.lang = next;
  };
  const value = useMemo(
    () => ({ t: locales[locale as Locale] ?? en, locale, setLocale: chooseLocale }),
    [locale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT(): Dict {
  return useContext(I18nContext).t;
}

export function useLocale() {
  const context = useContext(I18nContext);
  return { locale: context.locale as Locale, setLocale: context.setLocale };
}

export function countryName(code: string, locale: Locale, fallback: string): string {
  return locale === "de" ? GERMAN_COUNTRIES[code] ?? fallback : fallback;
}

export function dynamicText(text: string, locale: Locale): string {
  if (locale !== "de") return text;
  return text
    .replace(/Norway/gi, "Norwegen")
    .replace(/Sweden/gi, "Schweden")
    .replace(/Denmark/gi, "Dänemark")
    .replace(/Germany/gi, "Deutschland")
    .replace(/Austria/gi, "Österreich")
    .replace(/Switzerland/gi, "Schweiz")
    .replace(/Italy/gi, "Italien")
    .replace(/France/gi, "Frankreich")
    .replace(/Slovenia/gi, "Slowenien")
    .replace(/Croatia/gi, "Kroatien")
    .replace(/Czech Republic/gi, "Tschechien")
    .replace(/Slovakia/gi, "Slowakei")
    .replace(/1-day/gi, "1-Tages")
    .replace(/10-day/gi, "10-Tages")
    .replace(/7-day/gi, "7-Tages")
    .replace(/Monthly/gi, "Monatliche")
    .replace(/Annual/gi, "Jahres")
    .replace(/vignette/gi, "Vignette")
    .replace(/official/gi, "offiziell")
    .replace(/motorway tolls/gi, "Streckenmaut")
    .replace(/motorway/gi, "Autobahn")
    .replace(/tolls/gi, "Maut")
    .replace(/tolled/gi, "mautpflichtig")
    .replace(/Vignette required/gi, "Vignette erforderlich")
    .replace(/Pay-per-km tolls/gi, "Streckenmaut")
    .replace(/Toll booths \/ electronic tolling/gi, "Mautstellen / elektronische Maut")
    .replace(/Special mountain toll/gi, "Sondermaut")
    .replace(/fastest route/gi, "schnellste Route")
    .replace(/Country-by-country pump prices/gi, "Länderabhängige Spritpreise")
    .replace(/Estimated consumption/gi, "Geschätzter Verbrauch")
    .replace(/No route found/gi, "Keine Route gefunden");
}
