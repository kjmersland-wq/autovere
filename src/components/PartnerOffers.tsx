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
