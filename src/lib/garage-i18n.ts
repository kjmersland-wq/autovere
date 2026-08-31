import { useRouterState } from "@tanstack/react-router";

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
  // Toasts
  "Gi kjøretøyet et navn så du kjenner det igjen.": "Give your vehicle a name you'll recognize.",
  "Kjøretøyet er oppdatert.": "Vehicle updated.",
  "Kjøretøyet er lagt til i garasjen.": "Vehicle added to your garage.",
  "Kjøretøyet er fjernet.": "Vehicle removed.",
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

export type GarageT = (no: string) => string;

/** Norwegian on /no, warm American English everywhere else. */
export function useGarageText(): { t: GarageT; isNo: boolean } {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isNo = prefixFromPath(pathname) === "no";
  const t: GarageT = (no) => (isNo ? no : (GARAGE_EN[no] ?? no));
  return { t, isNo };
}
