import { Bike, CarFront, Ship, Smartphone } from "lucide-react";

import { AffiliateLink } from "@/components/AffiliateLink";
import { AFFILIATES, affiliateUrl } from "@/config/affiliateLinks";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Vehicle = "car" | "motorhome" | "motorcycle";

const COPY: Record<
  string,
  {
    title: string;
    car: string;
    bike: string;
    esim: string;
    esimNote: string;
    ferry: string;
  }
> = {
  en: {
    title: "Handy for this trip",
    car: "Compare rental cars",
    bike: "Rent a motorcycle or scooter",
    esim: "Stay online abroad",
    esimNote: "eSIM mobile data — no roaming surprises",
    ferry: "Compare ferry tickets",
  },
  no: {
    title: "Nyttig for denne turen",
    car: "Sammenlign leiebiler",
    bike: "Lei motorsykkel eller scooter",
    esim: "Vær på nett i utlandet",
    esimNote: "eSIM mobildata — ingen roaming-overraskelser",
    ferry: "Sammenlign ferjebilletter",
  },
  sv: {
    title: "Praktiskt för den här resan",
    car: "Jämför hyrbilar",
    bike: "Hyr motorcykel eller scooter",
    esim: "Var uppkopplad utomlands",
    esimNote: "eSIM-mobildata — inga roamingöverraskningar",
    ferry: "Jämför färjebiljetter",
  },
  da: {
    title: "Nyttigt til denne tur",
    car: "Sammenlign lejebiler",
    bike: "Lej motorcykel eller scooter",
    esim: "Vær online i udlandet",
    esimNote: "eSIM-mobildata — ingen roaming-overraskelser",
    ferry: "Sammenlign færgebilletter",
  },
  de: {
    title: "Praktisch für diese Reise",
    car: "Mietwagen vergleichen",
    bike: "Motorrad oder Roller mieten",
    esim: "Im Ausland online bleiben",
    esimNote: "eSIM-Datenpaket — keine Roaming-Überraschungen",
    ferry: "Fährtickets vergleichen",
  },
  nl: {
    title: "Handig voor deze reis",
    car: "Vergelijk huurauto's",
    bike: "Huur een motor of scooter",
    esim: "Blijf online in het buitenland",
    esimNote: "eSIM-databundel — geen roamingverrassingen",
    ferry: "Vergelijk veerboottickets",
  },
  fr: {
    title: "Utile pour ce voyage",
    car: "Comparer les locations de voiture",
    bike: "Louer une moto ou un scooter",
    esim: "Rester connecté à l'étranger",
    esimNote: "Forfait data eSIM — aucune surprise en itinérance",
    ferry: "Comparer les billets de ferry",
  },
  pl: {
    title: "Przydatne na tę podróż",
    car: "Porównaj wypożyczalnie samochodów",
    bike: "Wynajmij motocykl lub skuter",
    esim: "Bądź online za granicą",
    esimNote: "Pakiet danych eSIM — bez niespodzianek związanych z roamingiem",
    ferry: "Porównaj bilety na prom",
  },
  es: {
    title: "Útil para este viaje",
    car: "Compara alquileres de coches",
    bike: "Alquila una moto o un scooter",
    esim: "Mantente conectado en el extranjero",
    esimNote: "Datos móviles eSIM — sin sorpresas de itinerancia",
    ferry: "Compara billetes de ferry",
  },
  it: {
    title: "Utile per questo viaggio",
    car: "Confronta il noleggio auto",
    bike: "Noleggia una moto o uno scooter",
    esim: "Resta connesso all'estero",
    esimNote: "Dati mobili eSIM — nessuna sorpresa di roaming",
    ferry: "Confronta i biglietti dei traghetti",
  },
  pt: {
    title: "Útil para esta viagem",
    car: "Compare aluguer de carros",
    bike: "Alugue uma mota ou scooter",
    esim: "Fique online no estrangeiro",
    esimNote: "Dados móveis eSIM — sem surpresas de roaming",
    ferry: "Compare bilhetes de ferry",
  },
  ja: {
    title: "この旅に役立つサービス",
    car: "レンタカーを比較する",
    bike: "バイク・スクーターをレンタルする",
    esim: "海外でもネットに接続",
    esimNote: "eSIMデータ通信 — ローミング料金の心配なし",
    ferry: "フェリーチケットを比較する",
  },
};

const pill =
  "inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground/85 transition-colors hover:border-primary/50 hover:text-primary";

/**
 * Partner offers shown under the trip result: car rental, two-wheelers,
 * eSIM connectivity and ferries. All links resolve from
 * src/config/affiliateLinks.ts — pending partners fall back to the
 * provider's public site until an affiliate URL is pasted in.
 */
export function PartnerOffers({ vehicle }: { vehicle: Vehicle }) {
  const locale = useLocale();
  const c = COPY[locale] ?? COPY["en"]!;
  const A = AFFILIATES;

  const carLinks = [
    { label: "AutoEurope", e: A.carRental.autoEurope },
    { label: "EconomyBookings", e: A.carRental.economyBookings },
    { label: "Localrent", e: A.carRental.localrent },
  ];
  const ferryLinks = [{ label: "Direct Ferries", e: A.ferries.directFerries }];

  return (
    <div className="mt-8 rounded-2xl border border-border bg-background/40 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {c.title}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {vehicle === "motorcycle" ? (
          <div>
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <Bike className="size-4 text-primary" /> {c.bike}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <AffiliateLink href={affiliateUrl(A.twoWheelers.bikesBooking)} className={pill}>
                BikesBooking
              </AffiliateLink>
            </div>
          </div>
        ) : (
          <div>
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <CarFront className="size-4 text-primary" /> {c.car}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {carLinks.map((l) => (
                <AffiliateLink key={l.label} href={affiliateUrl(l.e)} className={pill}>
                  {l.label}
                </AffiliateLink>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <Ship className="size-4 text-primary" /> {c.ferry}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ferryLinks.map((l) => (
              <AffiliateLink key={l.label} href={affiliateUrl(l.e)} className={pill}>
                {l.label}
              </AffiliateLink>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          <Smartphone className="size-4 text-primary" /> {c.esim}
        </p>
        <span className="text-xs text-muted-foreground">{c.esimNote}</span>
        <span className="flex gap-1.5">
          <AffiliateLink
            href={affiliateUrl(A.connectivity.yesim)}
            className={cn(pill, "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20")}
          >
            Yesim eSIM
          </AffiliateLink>
          <AffiliateLink
            href={affiliateUrl(A.connectivity.saily)}
            className={cn(pill, "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20")}
          >
            Saily eSIM
          </AffiliateLink>
        </span>
      </div>
    </div>
  );
}
