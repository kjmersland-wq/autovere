import { useRouterState } from "@tanstack/react-router";

import { PoiLinks } from "@/components/PoiLinks";
import { SiteHeader } from "@/components/SiteHeader";
import { useLocale } from "@/lib/i18n";
import { regionFromPath, type RegionKey } from "@/lib/trip-data";
import type { PoiKind } from "@/lib/poi-links";

type Spot = {
  name: string;
  place: string;
  note: string;
  noteNo: string;
  notePl: string;
  noteSv: string;
  noteDa: string;
  noteDe: string;
  noteNl: string;
  noteFr: string;
  type: "Pass" | "Coastal" | "Ferry" | "Camp";
  kind: PoiKind;
  region: RegionKey;
  website?: string;
  booking?: string;
};

const TYPE_LABEL: Record<Spot["type"], { en: string; no: string; pl: string; sv: string; da: string; de: string; nl: string; fr: string }> = {
  Pass: { en: "Mountain pass", no: "Fjellovergang", pl: "Przełęcz górska", sv: "Fjällpass", da: "Bjergpas", de: "Gebirgspass", nl: "Bergpas", fr: "Col de montagne" },
  Coastal: { en: "Scenic route", no: "Turistveg", pl: "Trasa widokowa", sv: "Turistväg", da: "Turistvej", de: "Panoramastraße", nl: "Panoramaroute", fr: "Route touristique" },
  Ferry: { en: "Ferry", no: "Ferje", pl: "Prom", sv: "Färja", da: "Færge", de: "Fähre", nl: "Veerboot", fr: "Ferry" },
  Camp: { en: "Motorhome & camping", no: "Bobil og camping", pl: "Kamper i kemping", sv: "Husbil och camping", da: "Autocamper og camping", de: "Wohnmobil und Camping", nl: "Camper en camping", fr: "Camping-car et camping" },
};

const PLACE_LABEL: Record<string, { no: string; pl: string; sv: string; da: string; de: string; nl: string; fr: string }> = {
  "🇨🇭 Switzerland": { no: "🇨🇭 Sveits", pl: "🇨🇭 Szwajcaria", sv: "🇨🇭 Schweiz", da: "🇨🇭 Schweiz", de: "🇨🇭 Schweiz", nl: "🇨🇭 Zwitserland", fr: "🇨🇭 Suisse" },
  "🇮🇹 Italy": { no: "🇮🇹 Italia", pl: "🇮🇹 Włochy", sv: "🇮🇹 Italien", da: "🇮🇹 Italien", de: "🇮🇹 Italien", nl: "🇮🇹 Italië", fr: "🇮🇹 Italie" },
  "🇦🇹 Austria": { no: "🇦🇹 Østerrike", pl: "🇦🇹 Austria", sv: "🇦🇹 Österrike", da: "🇦🇹 Østrig", de: "🇦🇹 Österreich", nl: "🇦🇹 Oostenrijk", fr: "🇦🇹 Autriche" },
  "🇳🇴 Norway": { no: "🇳🇴 Norge", pl: "🇳🇴 Norwegia", sv: "🇳🇴 Norge", da: "🇳🇴 Norge", de: "🇳🇴 Norwegen", nl: "🇳🇴 Noorwegen", fr: "🇳🇴 Norvège" },
  "🇮🇹 Lake Garda": { no: "🇮🇹 Gardasjøen", pl: "🇮🇹 Jezioro Garda", sv: "🇮🇹 Gardasjön", da: "🇮🇹 Gardasøen", de: "🇮🇹 Gardasee", nl: "🇮🇹 Gardameer", fr: "🇮🇹 Lac de Garde" },
  "🇦🇹 Salzburg": { no: "🇦🇹 Salzburg", pl: "🇦🇹 Salzburg", sv: "🇦🇹 Salzburg", da: "🇦🇹 Salzburg", de: "🇦🇹 Salzburg", nl: "🇦🇹 Salzburg", fr: "🇦🇹 Salzbourg" },
  "🇺🇸 Montana": { no: "🇺🇸 Montana", pl: "🇺🇸 Montana", sv: "🇺🇸 Montana", da: "🇺🇸 Montana", de: "🇺🇸 Montana", nl: "🇺🇸 Montana", fr: "🇺🇸 Montana" },
  "🇺🇸 Montana – Wyoming": { no: "🇺🇸 Montana – Wyoming", pl: "🇺🇸 Montana – Wyoming", sv: "🇺🇸 Montana – Wyoming", da: "🇺🇸 Montana – Wyoming", de: "🇺🇸 Montana – Wyoming", nl: "🇺🇸 Montana – Wyoming", fr: "🇺🇸 Montana – Wyoming" },
  "🇺🇸 California": { no: "🇺🇸 California", pl: "🇺🇸 Kalifornia", sv: "🇺🇸 Kalifornien", da: "🇺🇸 Californien", de: "🇺🇸 Kalifornien", nl: "🇺🇸 Californië", fr: "🇺🇸 Californie" },
  "🇺🇸 Virginia – North Carolina": { no: "🇺🇸 Virginia – North Carolina", pl: "🇺🇸 Wirginia – Karolina Północna", sv: "🇺🇸 Virginia – North Carolina", da: "🇺🇸 Virginia – North Carolina", de: "🇺🇸 Virginia – North Carolina", nl: "🇺🇸 Virginia – North Carolina", fr: "🇺🇸 Virginie – Caroline du Nord" },
  "🇺🇸 Washington State Ferries": { no: "🇺🇸 Washington State Ferries", pl: "🇺🇸 Promy stanu Waszyngton", sv: "🇺🇸 Washington State Ferries", da: "🇺🇸 Washington State Ferries", de: "🇺🇸 Washington State Ferries", nl: "🇺🇸 Washington State Ferries", fr: "🇺🇸 Washington State Ferries" },
  "🇨🇦 Alberta": { no: "🇨🇦 Alberta", pl: "🇨🇦 Alberta", sv: "🇨🇦 Alberta", da: "🇨🇦 Alberta", de: "🇨🇦 Alberta", nl: "🇨🇦 Alberta", fr: "🇨🇦 Alberta" },
  "🇨🇦 Nova Scotia": { no: "🇨🇦 Nova Scotia", pl: "🇨🇦 Nowa Szkocja", sv: "🇨🇦 Nova Scotia", da: "🇨🇦 Nova Scotia", de: "🇨🇦 Nova Scotia", nl: "🇨🇦 Nova Scotia", fr: "🇨🇦 Nouvelle-Écosse" },
  "🇨🇦 British Columbia": { no: "🇨🇦 British Columbia", pl: "🇨🇦 Kolumbia Brytyjska", sv: "🇨🇦 British Columbia", da: "🇨🇦 British Columbia", de: "🇨🇦 British Columbia", nl: "🇨🇦 British Columbia", fr: "🇨🇦 Colombie-Britannique" },
  "🇨🇦 BC Ferries": { no: "🇨🇦 BC Ferries", pl: "🇨🇦 BC Ferries", sv: "🇨🇦 BC Ferries", da: "🇨🇦 BC Ferries", de: "🇨🇦 BC Ferries", nl: "🇨🇦 BC Ferries", fr: "🇨🇦 BC Ferries" },
  "🇩🇰🇳🇴 Color Line": { no: "🇩🇰🇳🇴 Color Line", pl: "🇩🇰🇳🇴 Color Line", sv: "🇩🇰🇳🇴 Color Line", da: "🇩🇰🇳🇴 Color Line", de: "🇩🇰🇳🇴 Color Line", nl: "🇩🇰🇳🇴 Color Line", fr: "🇩🇰🇳🇴 Color Line" },
  "🇳🇴 Fjord1": { no: "🇳🇴 Fjord1", pl: "🇳🇴 Fjord1", sv: "🇳🇴 Fjord1", da: "🇳🇴 Fjord1", de: "🇳🇴 Fjord1", nl: "🇳🇴 Fjord1", fr: "🇳🇴 Fjord1" },
};

const SPOTS: Spot[] = [
  // Europe
  { name: "Furka Pass", place: "🇨🇭 Switzerland", note: "Open now · 2,429 m · dry tarmac today", noteNo: "Åpen nå · 2 429 m · tørr asfalt i dag", notePl: "Otwarta teraz · 2429 m · dziś sucha nawierzchnia", noteSv: "Öppet nu · 2 429 m · torr asfalt idag", noteDa: "Åben nu · 2.429 m · tør asfalt i dag", noteDe: "Jetzt geöffnet · 2.429 m · heute trockener Asphalt", noteNl: "Nu open · 2.429 m · vandaag droog wegdek", noteFr: "Ouvert maintenant · 2 429 m · asphalte sec aujourd'hui", type: "Pass", kind: "pass", region: "eu" },
  { name: "Passo dello Stelvio", place: "🇮🇹 Italy", note: "Open June–October · 48 hairpins", noteNo: "Åpen juni–oktober · 48 hårnålssvinger", notePl: "Otwarta od czerwca do października · 48 serpentyn", noteSv: "Öppet juni–oktober · 48 hårnålskurvor", noteDa: "Åben juni–oktober · 48 hårnålesving", noteDe: "Geöffnet Juni–Oktober · 48 Haarnadelkurven", noteNl: "Open juni–oktober · 48 haarspeldbochten", noteFr: "Ouvert de juin à octobre · 48 épingles", type: "Pass", kind: "pass", region: "eu", website: "https://www.stelviopark.it/en/" },
  { name: "Grossglockner High Alpine Road", place: "🇦🇹 Austria", note: "Toll road · day ticket bookable online", noteNo: "Bomveg · dagsbillett kan kjøpes online", notePl: "Droga płatna · bilet dzienny kupisz online", noteSv: "Vägtull · dagsbiljett kan köpas online", noteDa: "Vejafgift · dagsbillet kan købes online", noteDe: "Mautstraße · Tagesticket online buchbar", noteNl: "Tolweg · dagticket online boekbaar", noteFr: "Route à péage · billet journalier réservable en ligne", type: "Pass", kind: "pass", region: "eu", website: "https://www.grossglockner.at/gg/en/index", booking: "https://www.grossglockner.at/gg/en/tickets" },
  { name: "Atlanterhavsvegen (Atlantic Road)", place: "🇳🇴 Norway", note: "Open all year · toll-free since 2011", noteNo: "Åpen hele året · bomfri siden 2011", notePl: "Otwarta cały rok · bez opłat od 2011", noteSv: "Öppen året runt · avgiftsfri sedan 2011", noteDa: "Åben hele året · afgiftsfri siden 2011", noteDe: "Ganzjährig geöffnet · mautfrei seit 2011", noteNl: "Het hele jaar open · tolvrij sinds 2011", noteFr: "Ouverte toute l'année · sans péage depuis 2011", type: "Coastal", kind: "place", region: "eu", website: "https://www.nasjonaleturistveger.no/en/routes/atlanterhavsvegen/" },
  { name: "Trollstigen", place: "🇳🇴 Norway", note: "Late May – October · 11 hairpins", noteNo: "Slutten av mai – oktober · 11 hårnålssvinger", notePl: "Od końca maja do października · 11 serpentyn", noteSv: "Slutet av maj–oktober · 11 hårnålskurvor", noteDa: "Slutningen af maj–oktober · 11 hårnålesving", noteDe: "Ende Mai–Oktober · 11 Haarnadelkurven", noteNl: "Eind mei–oktober · 11 haarspeldbochten", noteFr: "Fin mai – octobre · 11 épingles", type: "Pass", kind: "pass", region: "eu", website: "https://www.nasjonaleturistveger.no/en/routes/geiranger--trollstigen/" },
  { name: "Geiranger – Hellesylt ferry", place: "🇳🇴 Fjord1", note: "World Heritage fjord crossing · 1h", noteNo: "Verdensarvfjord · 1 time", notePl: "Przeprawa przez fiord z listy UNESCO · 1 godz.", noteSv: "Fjord på världsarvslistan · 1 timme", noteDa: "Verdensarvsfjord · 1 time", noteDe: "Fjordüberfahrt im Weltnaturerbe · 1 Std.", noteNl: "Fjordoversteek werelderfgoed · 1 uur", noteFr: "Traversée du fjord classé au patrimoine mondial · 1 h", type: "Ferry", kind: "ferry", region: "eu", website: "https://www.fjord1.no/en", booking: "https://www.fjord1.no/en" },
  { name: "Hirtshals → Kristiansand", place: "🇩🇰🇳🇴 Color Line", note: "Book vehicle deck early in summer", noteNo: "Bestill bildekk tidlig om sommeren", notePl: "Latem rezerwuj pokład samochodowy z wyprzedzeniem", noteSv: "Boka bildäck i god tid på sommaren", noteDa: "Book bildæk tidligt om sommeren", noteDe: "Autodeck im Sommer frühzeitig buchen", noteNl: "Boek het autodek in de zomer vroeg", noteFr: "Réservez le pont véhicules tôt en été", type: "Ferry", kind: "ferry", region: "eu", website: "https://www.colorline.com/", booking: "https://www.colorline.com/" },
  { name: "Napoli → Capri", place: "🇮🇹 Italy", note: "Limited vehicle permits · book early", noteNo: "Begrenset med kjøretøyplasser · bestill tidlig", notePl: "Ograniczone wjazdy dla aut · rezerwuj wcześnie", noteSv: "Begränsat med fordonsplatser · boka tidigt", noteDa: "Begrænset antal køretøjspladser · book tidligt", noteDe: "Begrenzte Fahrzeugplätze · frühzeitig buchen", noteNl: "Beperkt aantal voertuigplaatsen · boek vroeg", noteFr: "Places véhicules limitées · réservez tôt", type: "Ferry", kind: "ferry", region: "eu" },
  { name: "Camping Bella Italia, Peschiera", place: "🇮🇹 Lake Garda", note: "Big motorhome pitches · full hookup", noteNo: "Store bobilplasser · full tilkobling", notePl: "Duże stanowiska dla kamperów · pełne media", noteSv: "Stora husbilsplatser · fullständig anslutning", noteDa: "Store autocamperpladser · fuld tilslutning", noteDe: "Große Wohnmobilstellplätze · voller Anschluss", noteNl: "Grote camperplaatsen · volledige aansluiting", noteFr: "Grands emplacements camping-car · raccordement complet", type: "Camp", kind: "camp", region: "eu" },
  { name: "Stellplatz Zell am See", place: "🇦🇹 Salzburg", note: "Perfect night before Grossglockner", noteNo: "Perfekt overnatting før Grossglockner", notePl: "Idealny nocleg przed Grossglocknerem", noteSv: "Perfekt övernattning inför Grossglockner", noteDa: "Perfekt overnatning før Grossglockner", noteDe: "Perfekte Übernachtung vor dem Grossglockner", noteNl: "Perfecte overnachting voor de Grossglockner", noteFr: "Nuit idéale avant le Grossglockner", type: "Camp", kind: "camp", region: "eu" },

  // USA
  { name: "Going-to-the-Sun Road", place: "🇺🇸 Montana", note: "Vehicles under 21 ft · timed entry ticket", noteNo: "Kjøretøy under 21 fot · tidsbestilt billett", notePl: "Pojazdy poniżej 6,4 m · bilet na konkretną godzinę", noteSv: "Fordon under 21 fot · tidsbokad biljett", noteDa: "Køretøjer under 21 fod · tidsbestilt billet", noteDe: "Fahrzeuge unter 6,4 m · Zeitfenster-Ticket", noteNl: "Voertuigen onder 6,4 m · tijdslotticket", noteFr: "Véhicules de moins de 6,4 m · billet à horaire réservé", type: "Pass", kind: "pass", region: "us", website: "https://www.nps.gov/glac/planyourvisit/goingtothesunroad.htm", booking: "https://www.recreation.gov/timed-entry/10087086" },
  { name: "Beartooth Highway", place: "🇺🇸 Montana – Wyoming", note: "Late May – mid October · 10,947 ft summit", noteNo: "Slutten av mai – midten av oktober · 3 337 m", notePl: "Od końca maja do połowy października · szczyt 3337 m", noteSv: "Slutet av maj–mitten av oktober · 3 337 m", noteDa: "Slutningen af maj–midten af oktober · 3.337 m", noteDe: "Ende Mai–Mitte Oktober · Gipfel auf 3.337 m", noteNl: "Eind mei–half oktober · top op 3.337 m", noteFr: "Fin mai – mi-octobre · sommet à 3 337 m", type: "Pass", kind: "pass", region: "us", website: "https://www.beartoothhighway.com/" },
  { name: "Pacific Coast Highway (SR-1)", place: "🇺🇸 California", note: "Big Sur cliffs · check slide closures", noteNo: "Big Sur-klipper · sjekk rasstengninger", notePl: "Klify Big Sur · sprawdź zamknięcia po osuwiskach", noteSv: "Big Sur-klippor · kontrollera avstängningar efter ras", noteDa: "Big Sur-klipper · tjek lukninger pga. jordskred", noteDe: "Klippen von Big Sur · auf Erdrutschsperrungen achten", noteNl: "Kliffen van Big Sur · check afsluitingen door aardverschuivingen", noteFr: "Falaises de Big Sur · vérifiez les fermetures liées aux glissements de terrain", type: "Coastal", kind: "place", region: "us" },
  { name: "Blue Ridge Parkway", place: "🇺🇸 Virginia – North Carolina", note: "469 miles · no tolls, no trucks", noteNo: "755 km · ingen bom, ingen lastebiler", notePl: "755 km · bez opłat i bez ciężarówek", noteSv: "755 km · inga vägtullar, inga lastbilar", noteDa: "755 km · ingen vejafgifter, ingen lastbiler", noteDe: "755 km · keine Maut, keine Lkw", noteNl: "755 km · geen tol, geen vrachtwagens", noteFr: "755 km · sans péage, sans camions", type: "Coastal", kind: "place", region: "us", website: "https://www.nps.gov/blri/index.htm" },
  { name: "Anacortes → Friday Harbor", place: "🇺🇸 Washington State Ferries", note: "Vehicle deck fills fast on weekends", noteNo: "Bildekket fylles fort i helgene", notePl: "W weekendy pokład samochodowy zapełnia się błyskawicznie", noteSv: "Bildäcket fylls snabbt i helgerna", noteDa: "Bildækket fyldes hurtigt i weekenderne", noteDe: "Autodeck füllt sich am Wochenende schnell", noteNl: "Autodek raakt in het weekend snel vol", noteFr: "Le pont véhicules se remplit vite le week-end", type: "Ferry", kind: "ferry", region: "us", website: "https://wsdot.com/travel/washington-state-ferries", booking: "https://wsdot.com/Ferries/Reservations/Vehicle/" },
  { name: "Pismo Coast Village RV Resort", place: "🇺🇸 California", note: "Beachfront hookups midway on the PCH", noteNo: "Strandnære plasser midtveis på PCH", notePl: "Stanowiska przy plaży w połowie trasy PCH", noteSv: "Strandnära platser halvvägs på PCH", noteDa: "Strandnære pladser midtvejs på PCH", noteDe: "Stellplätze am Strand auf halber Strecke des PCH", noteNl: "Camperplaatsen aan het strand halverwege de PCH", noteFr: "Emplacements en bord de mer à mi-parcours du PCH", type: "Camp", kind: "camp", region: "us", website: "https://www.pismocoastvillage.com/" },

  // Canada
  { name: "Icefields Parkway", place: "🇨🇦 Alberta", note: "Park pass required · 232 km of glaciers", noteNo: "Parkpass kreves · 232 km med breer", notePl: "Wymagany karnet do parku · 232 km lodowców", noteSv: "Parkpass krävs · 232 km med glaciärer", noteDa: "Parkpas påkrævet · 232 km gletsjere", noteDe: "Parkpass erforderlich · 232 km Gletscher", noteNl: "Parkpas verplicht · 232 km gletsjers", noteFr: "Laissez-passer du parc requis · 232 km de glaciers", type: "Coastal", kind: "place", region: "ca", website: "https://www.banfflakelouise.com/icefields-parkway", booking: "https://parkspass.ca/" },
  { name: "Cabot Trail", place: "🇨🇦 Nova Scotia", note: "May – October · highland ocean switchbacks", noteNo: "Mai – oktober · svingete kystveg i høylandet", notePl: "Od maja do października · serpentyny nad oceanem", noteSv: "Maj–oktober · slingrande kustväg i högländerna", noteDa: "Maj–oktober · snoet kystvej i højlandet", noteDe: "Mai–Oktober · kurvenreiche Küstenstraße im Hochland", noteNl: "Mei–oktober · bochtige kustweg door het hoogland", noteFr: "Mai – octobre · route côtière sinueuse en altitude", type: "Coastal", kind: "place", region: "ca", website: "https://cabottrail.travel/" },
  { name: "Sea-to-Sky Highway", place: "🇨🇦 British Columbia", note: "Year-round fjord views to Whistler", noteNo: "Fjordutsikt hele året opp til Whistler", notePl: "Widoki na fiordy przez cały rok aż do Whistler", noteSv: "Fjordutsikt året runt upp till Whistler", noteDa: "Fjordudsigt hele året op til Whistler", noteDe: "Ganzjährig Fjordblick bis Whistler", noteNl: "Het hele jaar fjorduitzicht tot Whistler", noteFr: "Vue sur le fjord toute l'année jusqu'à Whistler", type: "Coastal", kind: "place", region: "ca" },
  { name: "Tsawwassen → Swartz Bay", place: "🇨🇦 BC Ferries", note: "Reserve ahead in summer · 1h 35m", noteNo: "Reserver i forkant om sommeren · 1t 35m", notePl: "Latem rezerwuj wcześniej · 1 godz. 35 min", noteSv: "Boka i förväg på sommaren · 1 tim 35 min", noteDa: "Book i god tid om sommeren · 1t 35m", noteDe: "Im Sommer im Voraus reservieren · 1 Std. 35 Min.", noteNl: "Reserveer in de zomer vooraf · 1 u 35 min", noteFr: "Réservez à l'avance en été · 1 h 35", type: "Ferry", kind: "ferry", region: "ca", website: "https://www.bcferries.com/", booking: "https://www.bcferries.com/routes-fares/schedules" },
  { name: "Whistlers Campground, Jasper", place: "🇨🇦 Alberta", note: "Serviced loops at the Icefields Parkway", noteNo: "Plasser med service ved Icefields Parkway", notePl: "Stanowiska z mediami przy Icefields Parkway", noteSv: "Platser med service vid Icefields Parkway", noteDa: "Pladser med service ved Icefields Parkway", noteDe: "Stellplätze mit Anschluss am Icefields Parkway", noteNl: "Camperplaatsen met voorzieningen aan de Icefields Parkway", noteFr: "Emplacements avec services sur l'Icefields Parkway", type: "Camp", kind: "camp", region: "ca", booking: "https://reservation.pc.gc.ca/" },
  { name: "Whistler RV Park & Campground", place: "🇨🇦 British Columbia", note: "Last full-service stop on Sea-to-Sky", noteNo: "Siste stopp med full service på Sea-to-Sky", notePl: "Ostatni w pełni wyposażony postój na Sea-to-Sky", noteSv: "Sista stoppet med full service på Sea-to-Sky", noteDa: "Sidste stop med fuld service på Sea-to-Sky", noteDe: "Letzter Stopp mit vollem Service auf dem Sea-to-Sky", noteNl: "Laatste stop met volledige service op de Sea-to-Sky", noteFr: "Dernier arrêt tout confort sur la Sea-to-Sky", type: "Camp", kind: "camp", region: "ca" },
];

export function ScenicGuide() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const region = regionFromPath(pathname);
  const locale = useLocale();
  const isNo = locale === "no";
  const isPl = locale === "pl";
  const isSv = locale === "sv";
  const isDa = locale === "da";
  const isDe = locale === "de";
  const isNl = locale === "nl";
  const isFr = locale === "fr";

  const ordered = [...SPOTS].sort(
    (a, b) => Number(b.region === region) - Number(a.region === region),
  );

  return (
    <main className="min-h-screen">
      <SiteHeader region={region} />
      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          {isNo
            ? "Naturperler, fjelloverganger og ferjer"
            : isPl
              ? "Malownicze przełęcze i promy"
              : isSv
                ? "Natursköna pass och färjor"
                : isDa
                  ? "Naturskønne pas og færger"
                  : isDe
                    ? "Landschaftliche Pässe und Fähren"
                    : isNl
                      ? "Panoramische passen en veerboten"
                      : isFr
                        ? "Cols panoramiques et ferries"
                        : "Scenic passes & ferries"}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {isNo
            ? "Omveiene du fortsatt snakker om, år etter år."
            : isPl
              ? "Objazdy, o których będziesz opowiadać jeszcze przez lata."
              : isSv
                ? "Omvägarna du fortfarande pratar om, år efter år."
                : isDa
                  ? "Omvejene du stadig taler om, år efter år."
                  : isDe
                    ? "Die Umwege, über die du noch Jahre später sprichst."
                    : isNl
                      ? "De omwegen waar je jaren later nog over praat."
                      : isFr
                        ? "Les détours dont vous parlerez encore des années plus tard."
                        : "The detours you'll still talk about years later."}
        </h1>
        <p className="mt-4 max-w-2xl text-foreground/75">
          {isNo
            ? "Fjelloverganger med sesongstatus, kystveger, bobilplasser og bilferjer — med kart, bilder og direkte billettbestilling."
            : isPl
              ? "Przełęcze z aktualnym statusem sezonu, nadmorskie szosy, kempingi i promy samochodowe — z mapami, zdjęciami i rezerwacją online."
              : isSv
                ? "Fjällpass med säsongsstatus, kustvägar, husbilsplatser och bilfärjor — med kartor, bilder och direktbokning online."
                : isDa
                  ? "Bjergpas med sæsonstatus, kystveje, autocamperpladser og bilfærger — med kort, billeder og direkte online booking."
                  : isDe
                    ? "Bergpässe mit Saisonstatus, Küstenstraßen, Wohnmobilstellplätze und Autofähren — mit Karten, Fotos und direkter Online-Buchung."
                    : isNl
                      ? "Bergpassen met actuele seizoensstatus, kustwegen, camperplaatsen en autoveerboten — met kaarten, foto's en directe online boeking."
                      : isFr
                        ? "Cols de montagne avec statut saisonnier, routes côtières, emplacements camping-car et ferries pour véhicules — avec cartes, photos et réservation directe en ligne."
                        : "Live-season passes, coastal highways, campgrounds and vehicle ferries — with maps, photos and direct online booking."}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((p) => (
            <article key={p.name} className="glass-panel rounded-2xl p-5 transition-transform hover:-translate-y-1">
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                {isNo
                  ? TYPE_LABEL[p.type].no
                  : isPl
                    ? TYPE_LABEL[p.type].pl
                    : isSv
                      ? TYPE_LABEL[p.type].sv
                      : isDa
                        ? TYPE_LABEL[p.type].da
                        : isDe
                          ? TYPE_LABEL[p.type].de
                          : isNl
                            ? TYPE_LABEL[p.type].nl
                            : isFr
                              ? TYPE_LABEL[p.type].fr
                              : TYPE_LABEL[p.type].en}
              </span>
              <h2 className="mt-3 text-lg font-semibold tracking-tight">{p.name}</h2>
              <p className="text-sm text-foreground/70">
                {isNo
                  ? (PLACE_LABEL[p.place]?.no ?? p.place)
                  : isPl
                    ? (PLACE_LABEL[p.place]?.pl ?? p.place)
                    : isSv
                      ? (PLACE_LABEL[p.place]?.sv ?? p.place)
                      : isDa
                        ? (PLACE_LABEL[p.place]?.da ?? p.place)
                        : isDe
                          ? (PLACE_LABEL[p.place]?.de ?? p.place)
                          : isNl
                            ? (PLACE_LABEL[p.place]?.nl ?? p.place)
                            : isFr
                              ? (PLACE_LABEL[p.place]?.fr ?? p.place)
                              : p.place}
              </p>
              <p className="mt-3 text-sm text-foreground/85">
                {isNo
                  ? p.noteNo
                  : isPl
                    ? p.notePl
                    : isSv
                      ? p.noteSv
                      : isDa
                        ? p.noteDa
                        : isDe
                          ? p.noteDe
                          : isNl
                            ? p.noteNl
                            : isFr
                              ? p.noteFr
                              : p.note}
              </p>
              <PoiLinks
                kind={p.kind}
                name={p.name}
                where={p.place}
                region={p.region}
                website={p.website}
                booking={p.booking}
              />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
