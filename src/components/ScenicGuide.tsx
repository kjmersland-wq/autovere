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
  type: "Pass" | "Coastal" | "Ferry" | "Camp";
  kind: PoiKind;
  region: RegionKey;
  website?: string;
  booking?: string;
};

const TYPE_LABEL: Record<Spot["type"], { en: string; no: string; pl: string; sv: string }> = {
  Pass: { en: "Mountain pass", no: "Fjellovergang", pl: "Przełęcz górska", sv: "Fjällpass" },
  Coastal: { en: "Scenic route", no: "Turistveg", pl: "Trasa widokowa", sv: "Turistväg" },
  Ferry: { en: "Ferry", no: "Ferje", pl: "Prom", sv: "Färja" },
  Camp: { en: "Motorhome & camping", no: "Bobil og camping", pl: "Kamper i kemping", sv: "Husbil och camping" },
};

const PLACE_LABEL: Record<string, { no: string; pl: string; sv: string }> = {
  "🇨🇭 Switzerland": { no: "🇨🇭 Sveits", pl: "🇨🇭 Szwajcaria", sv: "🇨🇭 Schweiz" },
  "🇮🇹 Italy": { no: "🇮🇹 Italia", pl: "🇮🇹 Włochy", sv: "🇮🇹 Italien" },
  "🇦🇹 Austria": { no: "🇦🇹 Østerrike", pl: "🇦🇹 Austria", sv: "🇦🇹 Österrike" },
  "🇳🇴 Norway": { no: "🇳🇴 Norge", pl: "🇳🇴 Norwegia", sv: "🇳🇴 Norge" },
  "🇮🇹 Lake Garda": { no: "🇮🇹 Gardasjøen", pl: "🇮🇹 Jezioro Garda", sv: "🇮🇹 Gardasjön" },
  "🇦🇹 Salzburg": { no: "🇦🇹 Salzburg", pl: "🇦🇹 Salzburg", sv: "🇦🇹 Salzburg" },
  "🇺🇸 Montana": { no: "🇺🇸 Montana", pl: "🇺🇸 Montana", sv: "🇺🇸 Montana" },
  "🇺🇸 Montana – Wyoming": { no: "🇺🇸 Montana – Wyoming", pl: "🇺🇸 Montana – Wyoming", sv: "🇺🇸 Montana – Wyoming" },
  "🇺🇸 California": { no: "🇺🇸 California", pl: "🇺🇸 Kalifornia", sv: "🇺🇸 Kalifornien" },
  "🇺🇸 Virginia – North Carolina": { no: "🇺🇸 Virginia – North Carolina", pl: "🇺🇸 Wirginia – Karolina Północna", sv: "🇺🇸 Virginia – North Carolina" },
  "🇺🇸 Washington State Ferries": { no: "🇺🇸 Washington State Ferries", pl: "🇺🇸 Promy stanu Waszyngton", sv: "🇺🇸 Washington State Ferries" },
  "🇨🇦 Alberta": { no: "🇨🇦 Alberta", pl: "🇨🇦 Alberta", sv: "🇨🇦 Alberta" },
  "🇨🇦 Nova Scotia": { no: "🇨🇦 Nova Scotia", pl: "🇨🇦 Nowa Szkocja", sv: "🇨🇦 Nova Scotia" },
  "🇨🇦 British Columbia": { no: "🇨🇦 British Columbia", pl: "🇨🇦 Kolumbia Brytyjska", sv: "🇨🇦 British Columbia" },
  "🇨🇦 BC Ferries": { no: "🇨🇦 BC Ferries", pl: "🇨🇦 BC Ferries", sv: "🇨🇦 BC Ferries" },
  "🇩🇰🇳🇴 Color Line": { no: "🇩🇰🇳🇴 Color Line", pl: "🇩🇰🇳🇴 Color Line", sv: "🇩🇰🇳🇴 Color Line" },
  "🇳🇴 Fjord1": { no: "🇳🇴 Fjord1", pl: "🇳🇴 Fjord1", sv: "🇳🇴 Fjord1" },
};

const SPOTS: Spot[] = [
  // Europe
  { name: "Furka Pass", place: "🇨🇭 Switzerland", note: "Open now · 2,429 m · dry tarmac today", noteNo: "Åpen nå · 2 429 m · tørr asfalt i dag", notePl: "Otwarta teraz · 2429 m · dziś sucha nawierzchnia", noteSv: "Öppet nu · 2 429 m · torr asfalt idag", type: "Pass", kind: "pass", region: "eu" },
  { name: "Passo dello Stelvio", place: "🇮🇹 Italy", note: "Open June–October · 48 hairpins", noteNo: "Åpen juni–oktober · 48 hårnålssvinger", notePl: "Otwarta od czerwca do października · 48 serpentyn", noteSv: "Öppet juni–oktober · 48 hårnålskurvor", type: "Pass", kind: "pass", region: "eu", website: "https://www.stelviopark.it/en/" },
  { name: "Grossglockner High Alpine Road", place: "🇦🇹 Austria", note: "Toll road · day ticket bookable online", noteNo: "Bomveg · dagsbillett kan kjøpes online", notePl: "Droga płatna · bilet dzienny kupisz online", noteSv: "Vägtull · dagsbiljett kan köpas online", type: "Pass", kind: "pass", region: "eu", website: "https://www.grossglockner.at/gg/en/index", booking: "https://www.grossglockner.at/gg/en/tickets" },
  { name: "Atlanterhavsvegen (Atlantic Road)", place: "🇳🇴 Norway", note: "Open all year · toll-free since 2011", noteNo: "Åpen hele året · bomfri siden 2011", notePl: "Otwarta cały rok · bez opłat od 2011", noteSv: "Öppen året runt · avgiftsfri sedan 2011", type: "Coastal", kind: "place", region: "eu", website: "https://www.nasjonaleturistveger.no/en/routes/atlanterhavsvegen/" },
  { name: "Trollstigen", place: "🇳🇴 Norway", note: "Late May – October · 11 hairpins", noteNo: "Slutten av mai – oktober · 11 hårnålssvinger", notePl: "Od końca maja do października · 11 serpentyn", noteSv: "Slutet av maj–oktober · 11 hårnålskurvor", type: "Pass", kind: "pass", region: "eu", website: "https://www.nasjonaleturistveger.no/en/routes/geiranger--trollstigen/" },
  { name: "Geiranger – Hellesylt ferry", place: "🇳🇴 Fjord1", note: "World Heritage fjord crossing · 1h", noteNo: "Verdensarvfjord · 1 time", notePl: "Przeprawa przez fiord z listy UNESCO · 1 godz.", noteSv: "Fjord på världsarvslistan · 1 timme", type: "Ferry", kind: "ferry", region: "eu", website: "https://www.fjord1.no/en", booking: "https://www.fjord1.no/en" },
  { name: "Hirtshals → Kristiansand", place: "🇩🇰🇳🇴 Color Line", note: "Book vehicle deck early in summer", noteNo: "Bestill bildekk tidlig om sommeren", notePl: "Latem rezerwuj pokład samochodowy z wyprzedzeniem", noteSv: "Boka bildäck i god tid på sommaren", type: "Ferry", kind: "ferry", region: "eu", website: "https://www.colorline.com/", booking: "https://www.colorline.com/" },
  { name: "Napoli → Capri", place: "🇮🇹 Italy", note: "Limited vehicle permits · book early", noteNo: "Begrenset med kjøretøyplasser · bestill tidlig", notePl: "Ograniczone wjazdy dla aut · rezerwuj wcześnie", noteSv: "Begränsat med fordonsplatser · boka tidigt", type: "Ferry", kind: "ferry", region: "eu" },
  { name: "Camping Bella Italia, Peschiera", place: "🇮🇹 Lake Garda", note: "Big motorhome pitches · full hookup", noteNo: "Store bobilplasser · full tilkobling", notePl: "Duże stanowiska dla kamperów · pełne media", noteSv: "Stora husbilsplatser · fullständig anslutning", type: "Camp", kind: "camp", region: "eu" },
  { name: "Stellplatz Zell am See", place: "🇦🇹 Salzburg", note: "Perfect night before Grossglockner", noteNo: "Perfekt overnatting før Grossglockner", notePl: "Idealny nocleg przed Grossglocknerem", noteSv: "Perfekt övernattning inför Grossglockner", type: "Camp", kind: "camp", region: "eu" },

  // USA
  { name: "Going-to-the-Sun Road", place: "🇺🇸 Montana", note: "Vehicles under 21 ft · timed entry ticket", noteNo: "Kjøretøy under 21 fot · tidsbestilt billett", notePl: "Pojazdy poniżej 6,4 m · bilet na konkretną godzinę", noteSv: "Fordon under 21 fot · tidsbokad biljett", type: "Pass", kind: "pass", region: "us", website: "https://www.nps.gov/glac/planyourvisit/goingtothesunroad.htm", booking: "https://www.recreation.gov/timed-entry/10087086" },
  { name: "Beartooth Highway", place: "🇺🇸 Montana – Wyoming", note: "Late May – mid October · 10,947 ft summit", noteNo: "Slutten av mai – midten av oktober · 3 337 m", notePl: "Od końca maja do połowy października · szczyt 3337 m", noteSv: "Slutet av maj–mitten av oktober · 3 337 m", type: "Pass", kind: "pass", region: "us", website: "https://www.beartoothhighway.com/" },
  { name: "Pacific Coast Highway (SR-1)", place: "🇺🇸 California", note: "Big Sur cliffs · check slide closures", noteNo: "Big Sur-klipper · sjekk rasstengninger", notePl: "Klify Big Sur · sprawdź zamknięcia po osuwiskach", noteSv: "Big Sur-klippor · kontrollera avstängningar efter ras", type: "Coastal", kind: "place", region: "us" },
  { name: "Blue Ridge Parkway", place: "🇺🇸 Virginia – North Carolina", note: "469 miles · no tolls, no trucks", noteNo: "755 km · ingen bom, ingen lastebiler", notePl: "755 km · bez opłat i bez ciężarówek", noteSv: "755 km · inga vägtullar, inga lastbilar", type: "Coastal", kind: "place", region: "us", website: "https://www.nps.gov/blri/index.htm" },
  { name: "Anacortes → Friday Harbor", place: "🇺🇸 Washington State Ferries", note: "Vehicle deck fills fast on weekends", noteNo: "Bildekket fylles fort i helgene", notePl: "W weekendy pokład samochodowy zapełnia się błyskawicznie", noteSv: "Bildäcket fylls snabbt i helgerna", type: "Ferry", kind: "ferry", region: "us", website: "https://wsdot.com/travel/washington-state-ferries", booking: "https://wsdot.com/Ferries/Reservations/Vehicle/" },
  { name: "Pismo Coast Village RV Resort", place: "🇺🇸 California", note: "Beachfront hookups midway on the PCH", noteNo: "Strandnære plasser midtveis på PCH", notePl: "Stanowiska przy plaży w połowie trasy PCH", noteSv: "Strandnära platser halvvägs på PCH", type: "Camp", kind: "camp", region: "us", website: "https://www.pismocoastvillage.com/" },

  // Canada
  { name: "Icefields Parkway", place: "🇨🇦 Alberta", note: "Park pass required · 232 km of glaciers", noteNo: "Parkpass kreves · 232 km med breer", notePl: "Wymagany karnet do parku · 232 km lodowców", noteSv: "Parkpass krävs · 232 km med glaciärer", type: "Coastal", kind: "place", region: "ca", website: "https://www.banfflakelouise.com/icefields-parkway", booking: "https://parkspass.ca/" },
  { name: "Cabot Trail", place: "🇨🇦 Nova Scotia", note: "May – October · highland ocean switchbacks", noteNo: "Mai – oktober · svingete kystveg i høylandet", notePl: "Od maja do października · serpentyny nad oceanem", noteSv: "Maj–oktober · slingrande kustväg i högländerna", type: "Coastal", kind: "place", region: "ca", website: "https://cabottrail.travel/" },
  { name: "Sea-to-Sky Highway", place: "🇨🇦 British Columbia", note: "Year-round fjord views to Whistler", noteNo: "Fjordutsikt hele året opp til Whistler", notePl: "Widoki na fiordy przez cały rok aż do Whistler", noteSv: "Fjordutsikt året runt upp till Whistler", type: "Coastal", kind: "place", region: "ca" },
  { name: "Tsawwassen → Swartz Bay", place: "🇨🇦 BC Ferries", note: "Reserve ahead in summer · 1h 35m", noteNo: "Reserver i forkant om sommeren · 1t 35m", notePl: "Latem rezerwuj wcześniej · 1 godz. 35 min", noteSv: "Boka i förväg på sommaren · 1 tim 35 min", type: "Ferry", kind: "ferry", region: "ca", website: "https://www.bcferries.com/", booking: "https://www.bcferries.com/routes-fares/schedules" },
  { name: "Whistlers Campground, Jasper", place: "🇨🇦 Alberta", note: "Serviced loops at the Icefields Parkway", noteNo: "Plasser med service ved Icefields Parkway", notePl: "Stanowiska z mediami przy Icefields Parkway", noteSv: "Platser med service vid Icefields Parkway", type: "Camp", kind: "camp", region: "ca", booking: "https://reservation.pc.gc.ca/" },
  { name: "Whistler RV Park & Campground", place: "🇨🇦 British Columbia", note: "Last full-service stop on Sea-to-Sky", noteNo: "Siste stopp med full service på Sea-to-Sky", notePl: "Ostatni w pełni wyposażony postój na Sea-to-Sky", noteSv: "Sista stoppet med full service på Sea-to-Sky", type: "Camp", kind: "camp", region: "ca" },
];

export function ScenicGuide() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const region = regionFromPath(pathname);
  const locale = useLocale();
  const isNo = locale === "no";
  const isPl = locale === "pl";
  const isSv = locale === "sv";

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
                : "Scenic passes & ferries"}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {isNo
            ? "Omveiene du fortsatt snakker om, år etter år."
            : isPl
              ? "Objazdy, o których będziesz opowiadać jeszcze przez lata."
              : isSv
                ? "Omvägarna du fortfarande pratar om, år efter år."
                : "The detours you'll still talk about years later."}
        </h1>
        <p className="mt-4 max-w-2xl text-foreground/75">
          {isNo
            ? "Fjelloverganger med sesongstatus, kystveger, bobilplasser og bilferjer — med kart, bilder og direkte billettbestilling."
            : isPl
              ? "Przełęcze z aktualnym statusem sezonu, nadmorskie szosy, kempingi i promy samochodowe — z mapami, zdjęciami i rezerwacją online."
              : isSv
                ? "Fjällpass med säsongsstatus, kustvägar, husbilsplatser och bilfärjor — med kartor, bilder och direktbokning online."
                : "Live-season passes, coastal highways, campgrounds and vehicle ferries — with maps, photos and direct online booking."}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((p) => (
            <article key={p.name} className="glass-panel rounded-2xl p-5 transition-transform hover:-translate-y-1">
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                {isNo ? TYPE_LABEL[p.type].no : isPl ? TYPE_LABEL[p.type].pl : isSv ? TYPE_LABEL[p.type].sv : TYPE_LABEL[p.type].en}
              </span>
              <h2 className="mt-3 text-lg font-semibold tracking-tight">{p.name}</h2>
              <p className="text-sm text-foreground/70">
                {isNo ? (PLACE_LABEL[p.place]?.no ?? p.place) : isPl ? (PLACE_LABEL[p.place]?.pl ?? p.place) : isSv ? (PLACE_LABEL[p.place]?.sv ?? p.place) : p.place}
              </p>
              <p className="mt-3 text-sm text-foreground/85">{isNo ? p.noteNo : isPl ? p.notePl : isSv ? p.noteSv : p.note}</p>
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
