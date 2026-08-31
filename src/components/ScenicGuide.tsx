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
  type: "Pass" | "Coastal" | "Ferry" | "Camp";
  kind: PoiKind;
  region: RegionKey;
  website?: string;
  booking?: string;
};

const TYPE_LABEL: Record<Spot["type"], { en: string; no: string }> = {
  Pass: { en: "Mountain pass", no: "Fjellovergang" },
  Coastal: { en: "Scenic route", no: "Turistveg" },
  Ferry: { en: "Ferry", no: "Ferje" },
  Camp: { en: "Motorhome & camping", no: "Bobil og camping" },
};

const SPOTS: Spot[] = [
  // Europe
  { name: "Furka Pass", place: "🇨🇭 Switzerland", note: "Open now · 2,429 m · dry tarmac today", noteNo: "Åpen nå · 2 429 m · tørr asfalt i dag", type: "Pass", kind: "pass", region: "eu" },
  { name: "Passo dello Stelvio", place: "🇮🇹 Italy", note: "Open June–October · 48 hairpins", noteNo: "Åpen juni–oktober · 48 hårnålssvinger", type: "Pass", kind: "pass", region: "eu", website: "https://www.stelviopark.it/en/" },
  { name: "Grossglockner High Alpine Road", place: "🇦🇹 Austria", note: "Toll road · day ticket bookable online", noteNo: "Bomveg · dagsbillett kan kjøpes online", type: "Pass", kind: "pass", region: "eu", website: "https://www.grossglockner.at/gg/en/index", booking: "https://www.grossglockner.at/gg/en/tickets" },
  { name: "Atlanterhavsvegen (Atlantic Road)", place: "🇳🇴 Norway", note: "Open all year · toll-free since 2011", noteNo: "Åpen hele året · bomfri siden 2011", type: "Coastal", kind: "place", region: "eu", website: "https://www.nasjonaleturistveger.no/en/routes/atlanterhavsvegen/" },
  { name: "Trollstigen", place: "🇳🇴 Norway", note: "Late May – October · 11 hairpins", noteNo: "Slutten av mai – oktober · 11 hårnålssvinger", type: "Pass", kind: "pass", region: "eu", website: "https://www.nasjonaleturistveger.no/en/routes/geiranger--trollstigen/" },
  { name: "Geiranger – Hellesylt ferry", place: "🇳🇴 Fjord1", note: "World Heritage fjord crossing · 1h", noteNo: "Verdensarvfjord · 1 time", type: "Ferry", kind: "ferry", region: "eu", website: "https://www.fjord1.no/en", booking: "https://www.fjord1.no/en" },
  { name: "Hirtshals → Kristiansand", place: "🇩🇰🇳🇴 Color Line", note: "Book vehicle deck early in summer", noteNo: "Bestill bildekk tidlig om sommeren", type: "Ferry", kind: "ferry", region: "eu", website: "https://www.colorline.com/", booking: "https://www.colorline.com/" },
  { name: "Napoli → Capri", place: "🇮🇹 Italy", note: "Limited vehicle permits · book early", noteNo: "Begrenset med kjøretøyplasser · bestill tidlig", type: "Ferry", kind: "ferry", region: "eu" },
  { name: "Camping Bella Italia, Peschiera", place: "🇮🇹 Lake Garda", note: "Big motorhome pitches · full hookup", noteNo: "Store bobilplasser · full tilkobling", type: "Camp", kind: "camp", region: "eu" },
  { name: "Stellplatz Zell am See", place: "🇦🇹 Salzburg", note: "Perfect night before Grossglockner", noteNo: "Perfekt overnatting før Grossglockner", type: "Camp", kind: "camp", region: "eu" },

  // USA
  { name: "Going-to-the-Sun Road", place: "🇺🇸 Montana", note: "Vehicles under 21 ft · timed entry ticket", noteNo: "Kjøretøy under 21 fot · tidsbestilt billett", type: "Pass", kind: "pass", region: "us", website: "https://www.nps.gov/glac/planyourvisit/goingtothesunroad.htm", booking: "https://www.recreation.gov/timed-entry/10087086" },
  { name: "Beartooth Highway", place: "🇺🇸 Montana – Wyoming", note: "Late May – mid October · 10,947 ft summit", noteNo: "Slutten av mai – midten av oktober · 3 337 m", type: "Pass", kind: "pass", region: "us", website: "https://www.beartoothhighway.com/" },
  { name: "Pacific Coast Highway (SR-1)", place: "🇺🇸 California", note: "Big Sur cliffs · check slide closures", noteNo: "Big Sur-klipper · sjekk rasstengninger", type: "Coastal", kind: "place", region: "us" },
  { name: "Blue Ridge Parkway", place: "🇺🇸 Virginia – North Carolina", note: "469 miles · no tolls, no trucks", noteNo: "755 km · ingen bom, ingen lastebiler", type: "Coastal", kind: "place", region: "us", website: "https://www.nps.gov/blri/index.htm" },
  { name: "Anacortes → Friday Harbor", place: "🇺🇸 Washington State Ferries", note: "Vehicle deck fills fast on weekends", noteNo: "Bildekket fylles fort i helgene", type: "Ferry", kind: "ferry", region: "us", website: "https://wsdot.com/travel/washington-state-ferries", booking: "https://wsdot.com/Ferries/Reservations/Vehicle/" },
  { name: "Pismo Coast Village RV Resort", place: "🇺🇸 California", note: "Beachfront hookups midway on the PCH", noteNo: "Strandnære plasser midtveis på PCH", type: "Camp", kind: "camp", region: "us", website: "https://www.pismocoastvillage.com/" },

  // Canada
  { name: "Icefields Parkway", place: "🇨🇦 Alberta", note: "Park pass required · 232 km of glaciers", noteNo: "Parkpass kreves · 232 km med breer", type: "Coastal", kind: "place", region: "ca", website: "https://www.banfflakelouise.com/icefields-parkway", booking: "https://parkspass.ca/" },
  { name: "Cabot Trail", place: "🇨🇦 Nova Scotia", note: "May – October · highland ocean switchbacks", noteNo: "Mai – oktober · svingete kystveg i høylandet", type: "Coastal", kind: "place", region: "ca", website: "https://cabottrail.travel/" },
  { name: "Sea-to-Sky Highway", place: "🇨🇦 British Columbia", note: "Year-round fjord views to Whistler", noteNo: "Fjordutsikt hele året opp til Whistler", type: "Coastal", kind: "place", region: "ca" },
  { name: "Tsawwassen → Swartz Bay", place: "🇨🇦 BC Ferries", note: "Reserve ahead in summer · 1h 35m", noteNo: "Reserver i forkant om sommeren · 1t 35m", type: "Ferry", kind: "ferry", region: "ca", website: "https://www.bcferries.com/", booking: "https://www.bcferries.com/routes-fares/schedules" },
  { name: "Whistlers Campground, Jasper", place: "🇨🇦 Alberta", note: "Serviced loops at the Icefields Parkway", noteNo: "Plasser med service ved Icefields Parkway", type: "Camp", kind: "camp", region: "ca", booking: "https://reservation.pc.gc.ca/" },
  { name: "Whistler RV Park & Campground", place: "🇨🇦 British Columbia", note: "Last full-service stop on Sea-to-Sky", noteNo: "Siste stopp med full service på Sea-to-Sky", type: "Camp", kind: "camp", region: "ca" },
];

export function ScenicGuide() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const region = regionFromPath(pathname);
  const locale = useLocale();
  const isNo = locale === "no";

  const ordered = [...SPOTS].sort(
    (a, b) => Number(b.region === region) - Number(a.region === region),
  );

  return (
    <main className="min-h-screen">
      <SiteHeader region={region} />
      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          {isNo ? "Naturperler, fjelloverganger og ferjer" : "Scenic passes & ferries"}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {isNo
            ? "Omveiene du fortsatt snakker om om mange år."
            : "The detours you'll still talk about years later."}
        </h1>
        <p className="mt-4 max-w-2xl text-foreground/75">
          {isNo
            ? "Fjelloverganger med sesongstatus, kystveger, bobilplasser og bilferjer — med kart, bilder og direkte billettbestilling."
            : "Live-season passes, coastal highways, campgrounds and vehicle ferries — with maps, photos and direct online booking."}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((p) => (
            <article key={p.name} className="glass-panel rounded-2xl p-5 transition-transform hover:-translate-y-1">
              <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                {isNo ? TYPE_LABEL[p.type].no : TYPE_LABEL[p.type].en}
              </span>
              <h2 className="mt-3 text-lg font-semibold tracking-tight">{p.name}</h2>
              <p className="text-sm text-foreground/70">{p.place}</p>
              <p className="mt-3 text-sm text-foreground/85">{isNo ? p.noteNo : p.note}</p>
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
