import { useRouterState } from "@tanstack/react-router";

import { GARAGE_DA, MONTHS_DA } from "@/lib/garage-da";
import { GARAGE_DE, MONTHS_DE } from "@/lib/garage-de";
import { GARAGE_ES, MONTHS_ES } from "@/lib/garage-es";
import { GARAGE_FI, MONTHS_FI } from "@/lib/garage-fi";
import { GARAGE_FR, MONTHS_FR } from "@/lib/garage-fr";
import { GARAGE_IT, MONTHS_IT } from "@/lib/garage-it";
import { GARAGE_JA, MONTHS_JA } from "@/lib/garage-ja";
import { GARAGE_NL, MONTHS_NL } from "@/lib/garage-nl";
import { GARAGE_PL } from "@/lib/garage-pl";
import { GARAGE_PT, MONTHS_PT } from "@/lib/garage-pt";
import { GARAGE_SV, MONTHS_SV } from "@/lib/garage-sv";
import { GARAGE_ZH, MONTHS_ZH } from "@/lib/garage-zh";
import { prefixFromPath } from "@/lib/locales";

/**
 * Norwegian source string → warm, personal American English.
 * The garage UI is authored in Norwegian; every non-/no route renders English.
 */
export const GARAGE_EN: Record<string, string> = {
  Oversikt: "Overview",
  "Mine reiser": "My Trips",
  "Mine kjøretøy": "My Vehicles",
  Innstillinger: "Settings",
  "Abonnement og fakturering": "Plan & Billing",
  "Lagrede steder": "Saved Places",
  "Profil og sikkerhet": "Profile & Security",
  "Hjelp og support": "Help & Support",
  Admin: "Admin",
  "AutoVere Pro — Admin": "AutoVere Pro — Admin",
  Bil: "Car",
  Bobil: "RV / Motorhome",
  Motorsykkel: "Motorcycle",
  "⛽ Bensin": "⛽ Gas",
  "🛢️ Diesel": "🛢️ Diesel",
  "⚡ Elektrisk (EV)": "⚡ Electric (EV)",
  "Velkommen tilbake": "Welcome back",
  "Kjøretøyene dine, reisene og alt abonnementet ditt låser opp — samlet på ett sted.":
    "Your vehicles, your road trips, and everything your plan unlocks — all in one friendly place.",
  Gjest: "Guest",
  Aktivt: "Active",
  "Free-konto": "Free account",
  "Ikke innlogget": "Not signed in",
  "Logg inn": "Sign in",
  "Logg ut": "Sign out",
  "Lagrede reiser": "Saved trips",
  Kjøretøy: "Vehicles",
  "Dette låser abonnementet ditt opp": "Here's what your plan unlocks",
  "Smart drivstoff og lading": "Smart fuel & charging",
  "Finn stopp basert på kjøretøy, rute og forbruk.":
    "We find the right stops for your vehicle, route, and real-world mileage.",
  "Bom, vignetter og ferjer": "Tolls, express lanes & ferries",
  "Full oversikt over kostnader før du kjører.": "See every cost clearly before you turn the key.",
  "Bobil og camping": "RV & campgrounds",
  "Tømmestasjoner, vann, overnatting og verksted.": "Dump stations, potable water, overnight spots, and service.",
  "Veiarbeid og hendelser": "Roadwork & incidents",
  "Se stengninger og omkjøringer som påvirker turen.": "Know about closures and detours before they slow you down.",
  "Personlig kjøretøyprofil": "Your own vehicle profile",
  "Vi bruker dine data i hver beregning.": "We use your numbers in every single estimate.",
  "Tilgjengelig på alle språk": "Available in your language",
  "Hele AutoVere på ditt språk.": "All of AutoVere, wherever the road takes you.",
  Bom: "Tolls",
  Ferjer: "Ferries",
  Energi: "Energy",
  Dupliser: "Duplicate",
  "Gi nytt navn": "Rename",
  "Skriv ut": "Print",
  GPX: "GPX",
  "Google Maps": "Google Maps",
  Waze: "Waze",
  Slett: "Delete",
  "Ingen lagrede reiser ennå — planlegg en tur og trykk «Lagre i Min garasje».":
    'No saved trips yet — plan a route and tap "Save to My Garage" to keep it here.',
  "Legg til kjøretøy": "Add vehicle",
  "Rediger kjøretøy": "Edit vehicle",
  "Slett kjøretøy": "Delete vehicle",
  "Ingen bombrikker koblet ennå": "No toll tags linked yet",
  Valuta: "Currency",
  Måleenheter: "Units",
  "Metrisk (km, liter)": "Metric (km, liters)",
  "Imperisk (miles, gallons)": "Imperial (miles, gallons)",
  "Lagre innstillinger": "Save settings",
  "Disse gjelder som standardvalgene dine i hele AutoVere.": "These become your defaults everywhere in AutoVere.",
  Abonnement: "Plan",
  Betalingsmetode: "Payment method",
  "Ingen betalingsmetode registrert.": "No payment method on file.",
  "Dette er gratis admin-tilgang, så det er ingenting å administrere her.":
    "This is complimentary admin access, so there's nothing to manage here.",
  "Oppgrader når du vil — du kan alltid si opp fra denne siden.":
    "Upgrade whenever you like — and you can cancel right from this page.",
  "Se abonnementene": "See plans",
  "Legg til sted": "Add place",
  "Ingen lagrede steder ennå": "No saved places yet",
  "Lagre ladestasjoner, overnattinger og stopp du vil finne igjen.":
    "Save chargers, overnight stops, and the places you'll want to find again.",
  "Slett sted": "Delete place",
  "E-post": "Email",
  Visningsnavn: "Display name",
  "Dette er navnet som vises på kontoen din — sett det til det du vil bli kalt.":
    "This is the name shown on your account — make it whatever you like to be called.",
  "Ditt navn": "Your name",
  "Lagre navn": "Save name",
  "Reisefølge (valgfritt)": "Travel party (optional)",
  "Fortell oss hvem som reiser og hva dere liker, så kan vi senere foreslå stopp som passer familien. Dette er valgfritt og lagres på samme måte som resten av kontoen din.":
    "Tell us who's traveling and what you enjoy, so we can later suggest stops that fit your family. This is optional and stored the same way as the rest of your account.",
  "Dette er en AutoVere Pro-funksjon. Oppgrader for å legge inn reisefølget ditt, så kan vi snart foreslå stopp familien vil elske.":
    "This is an AutoVere Pro feature. Upgrade to add your travel party, so we can soon suggest stops your family will love.",
  "Antall voksne": "Number of adults",
  "Barn (ca. alder)": "Children (approx. age)",
  Alder: "Age",
  år: "yrs",
  "Fjern barn": "Remove child",
  "Legg til barn": "Add child",
  "Interesser og hobbyer": "Interests & hobbies",
  "Lagre reisefølge": "Save travel party",
  "Reisefølget er lagret.": "Your travel party has been saved.",
  "Natur og turer": "Nature & hiking",
  "Strand og bading": "Beaches & swimming",
  "Museer og kultur": "Museums & culture",
  Fornøyelsesparker: "Amusement parks",
  "Dyreliv og dyrepark": "Wildlife & zoos",
  Vannsport: "Water sports",
  Vintersport: "Winter sports",
  "Mat og lokal matkultur": "Food & local cuisine",
  "Historie og slott": "History & castles",
  Shopping: "Shopping",
  Nattliv: "Nightlife",
  "Lekeplasser og familievennlig": "Playgrounds & family-friendly",
  Sykling: "Cycling",
  "Fotografering og utsikt": "Photography & viewpoints",
  "Avslapning og spa": "Relaxation & spa",
  "Sport og adventure": "Sports & adventure",
  "Camping og friluftsliv": "Camping & outdoors",
  "Festivaler og arrangementer": "Festivals & events",
  "Eksporter dataene mine": "Export my data",
  "Last ned en kopi av alt som er knyttet til kontoen din (profil, reiser, kjøretøy, steder).":
    "Download a copy of everything tied to your account (profile, trips, vehicles, places).",
  "Full oversikt over trafikk, abonnementer, markeder og økonomi.":
    "Full view of traffic, subscriptions, markets, and revenue.",
  "Åpne admin-panelet": "Open admin dashboard",
  "Vi er her hvis noe ikke fungerer som det skal.": "We're here whenever something isn't working the way it should.",
  "Ofte stilte spørsmål": "Frequently asked questions",
  "Svar på de vanligste spørsmålene om ruter, bompenger, vignetter og lading.":
    "Answers to the most common questions about routes, tolls, express lanes, and charging.",
  "Åpne hjelp og FAQ": "Open help & FAQ",
  "Kontakt support": "Contact support",
  "Send oss en melding, så svarer vi deg — dette er også riktig sted å melde fra om et problem.":
    "Send us a message and we'll get right back to you — this is also the place to report an issue.",
  "Send melding": "Send message",
  "Gi turen nytt navn": "Rename this trip",
  "Gi denne turen et navn som føles som veien foran deg.": "Give this trip a name that feels like the road ahead.",
  Turnavn: "Trip name",
  "Oslo → Lofoten midnattssol": "Denver → Moab red rock run",
  Avbryt: "Cancel",
  "Lagre et stopp du vil finne igjen på neste tur.": "Save a stop you'll want to find again on your next trip.",
  Navn: "Name",
  "Ionity Dombås": "Electrify America — Flagstaff",
  Notat: "Note",
  "Lynlading · kafé · døgnåpent": "Fast charging · coffee · open 24/7",
  "Lagre sted": "Save place",
  "Tankvolum, forbruk og bombrikker gjør hvert estimat skarpere.":
    "Tank size, real mileage, and toll tags make every estimate sharper.",
  Kjøretøytype: "Vehicle type",
  "f.eks. BMW R 1250 GS Adventure": "e.g. BMW R 1250 GS Adventure",
  "Drivstoff / energitype": "Fuel / power type",
  Batteristørrelse: "Battery size",
  Tankvolum: "Tank size",
  "60 L": "16 gal",
  Gjennomsnittsforbruk: "Average consumption",
  "0,64 L/mil": "27 mpg",
  "18 kWh/100 km": "3.2 mi/kWh",
  "75 kWh": "75 kWh",
  "Høyde og vekt": "Height & weight",
  "3,05 m · 3,5 t": "10 ft 0 in · 7,700 lb",
  "Koblede bombrikker": "Linked toll tags",
  "Lagre kjøretøy": "Save vehicle",
  "Forbruk ikke satt": "Consumption not set",
  batteri: "battery",
  "Alle nettverk": "All networks",
  "Aktiv i ruteberegning": "Active in route calculation",
  "Bruk i ruteberegning": "Use in route calculation",
  "Snittforbruk (kWh/100 km)": "Average consumption (kWh/100 km)",
  "Batterikapasitet (kWh)": "Battery capacity (kWh)",
  "Sikkerhetsmargin (%)": "Safety margin (%)",
  "Reserven du alltid vil ha igjen på batteriet — styrer avstanden mellom ladestoppene.":
    "The reserve you always want left in the battery — it controls the distance between charging stops.",
  "Foretrukket ladenettverk": "Preferred charging network",
  "Ladestopp langs ruten prioriteres for dette nettverket når det finnes i nærheten.":
    "Charging stops along the route are prioritized for this network when it's nearby.",
  // Toasts
  "Gi kjøretøyet et navn så du kjenner det igjen.": "Give your vehicle a name you'll recognize.",
  "Kjøretøyet er oppdatert.": "Vehicle updated.",
  "Kjøretøyet er lagt til i garasjen.": "Vehicle added to your garage.",
  "Kjøretøyet er fjernet.": "Vehicle removed.",
  "Kjøretøyet brukes nå i ruteberegningen.": "This vehicle is now used in route calculations.",
  "Kjøretøyet brukes ikke lenger i ruteberegningen.": "This vehicle is no longer used in route calculations.",
  "GPX eksportert — last den rett inn i navigasjonen.": "GPX exported — load it straight into your navigation.",
  "Turen er duplisert.": "Trip duplicated.",
  "Gi turen et navn du kjenner igjen.": "Give your trip a name you'll recognize.",
  "Turen er omdøpt.": "Trip renamed.",
  "Turen er fjernet fra garasjen.": "Trip removed from your garage.",
  "Tillat popup-vinduer for å skrive ut reiseoversikten.": "Allow pop-ups to print your trip summary.",
  "Innstillingene er lagret.": "Settings saved.",
  "Dataene dine er lastet ned.": "Your data is downloading.",
  "Gi stedet et navn.": "Give this place a name.",
  "Stedet er lagret.": "Place saved.",
};


const MONTHS_PL: Record<string, string> = {
  Jan: "sty", Feb: "lut", Mar: "mar", Apr: "kwi", May: "maj", Jun: "cze",
  Jul: "lip", Aug: "sie", Sep: "wrz", Oct: "paź", Nov: "lis", Dec: "gru",
};
const MONTHS_NO: Record<string, string> = {
  Jan: "jan", Feb: "feb", Mar: "mar", Apr: "apr", May: "mai", Jun: "jun",
  Jul: "jul", Aug: "aug", Sep: "sep", Oct: "okt", Nov: "nov", Dec: "des",
};

/** Per-prefix garage dictionaries (keys are the Norwegian source strings). */
const GARAGE_DICTS: Record<string, Record<string, string>> = {
  pl: GARAGE_PL,
  se: GARAGE_SV,
  dk: GARAGE_DA,
  de: GARAGE_DE,
  nl: GARAGE_NL,
  fr: GARAGE_FR,
  es: GARAGE_ES,
  it: GARAGE_IT,
  fi: GARAGE_FI,
  pt: GARAGE_PT,
  ja: GARAGE_JA,
  zh: GARAGE_ZH,
};

const META_RULES: Record<
  string,
  { budget: string; saved: string; hm: string; months: Record<string, string> }
> = {
  pl: { budget: "budżet", saved: "Zapisano", hm: "$1 godz. $2 min", months: MONTHS_PL },
  no: { budget: "budsjett", saved: "Lagret", hm: "$1t $2m", months: MONTHS_NO },
  se: { budget: "budget", saved: "Sparad", hm: "$1 tim $2 min", months: MONTHS_SV },
  dk: { budget: "budget", saved: "Gemt", hm: "$1 t $2 min", months: MONTHS_DA },
  de: { budget: "Budget", saved: "Gespeichert", hm: "$1 Std. $2 Min.", months: MONTHS_DE },
  nl: { budget: "budget", saved: "Opgeslagen", hm: "$1 u $2 min", months: MONTHS_NL },
  fr: { budget: "budget", saved: "Enregistré", hm: "$1 h $2 min", months: MONTHS_FR },
  es: { budget: "presupuesto", saved: "Guardado", hm: "$1 h $2 min", months: MONTHS_ES },
  it: { budget: "budget", saved: "Salvato", hm: "$1 h $2 min", months: MONTHS_IT },
  fi: { budget: "budjetti", saved: "Tallennettu", hm: "$1 t $2 min", months: MONTHS_FI },
  pt: { budget: "orçamento", saved: "Guardado", hm: "$1 h $2 min", months: MONTHS_PT },
  ja: { budget: "予算", saved: "保存済み", hm: "$1時間$2分", months: MONTHS_JA },
  zh: { budget: "预算", saved: "已保存", hm: "$1小时$2分钟", months: MONTHS_ZH },
};

/** Localise generated trip meta strings ("1,420 km · 14h 30m · €318 budget", "Saved 12 Aug"). */
export function localizeTripMeta(text: string, prefix: string | null): string {
  if (!text) return text;
  const rule = prefix ? META_RULES[prefix] : undefined;
  if (!rule) return text;
  return text
    .replace(/\bbudget\b/g, rule.budget)
    .replace(/\bSaved\b/g, rule.saved)
    .replace(/(\d+)h\s(\d+)m/g, rule.hm)
    .replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g, (m) => rule.months[m] ?? m);
}

export type GarageT = (no: string) => string;

/** Norwegian on /no, the visitor's language on other locale trees, English elsewhere. */
export function useGarageText(): {
  t: GarageT;
  isNo: boolean;
  isDa: boolean;
  isDe: boolean;
  isNl: boolean;
  isFr: boolean;
  isPl: boolean;
  isEs: boolean;
  isIt: boolean;
  isFi: boolean;
  isPt: boolean;
  isJa: boolean;
  isZh: boolean;
  meta: (text: string) => string;
} {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const prefix = prefixFromPath(pathname);
  const isNo = prefix === "no";
  const isDa = prefix === "dk";
  const isDe = prefix === "de";
  const isNl = prefix === "nl";
  const isFr = prefix === "fr";
  const isPl = prefix === "pl";
  const isEs = prefix === "es";
  const isIt = prefix === "it";
  const isFi = prefix === "fi";
  const isPt = prefix === "pt";
  const isJa = prefix === "ja";
  const isZh = prefix === "zh";
  const t: GarageT = (no) => {
    if (isNo) return no;
    const dict = prefix ? GARAGE_DICTS[prefix] : undefined;
    if (dict) return dict[no] ?? GARAGE_EN[no] ?? no;
    return GARAGE_EN[no] ?? no;
  };
  const meta = (text: string) => localizeTripMeta(text, prefix);
  return { t, isNo, isDa, isDe, isNl, isFr, isPl, isEs, isIt, isFi, isPt, isJa, isZh, meta };
}
