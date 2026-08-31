import { ExternalLink, Images, MapPin, Ticket } from "lucide-react";

import { useLocale } from "@/lib/i18n";
import { poiLinks, type PoiKind } from "@/lib/poi-links";
import type { RegionKey } from "@/lib/trip-data";
import { cn } from "@/lib/utils";

const LABELS: Record<string, { map: string; web: string; book: string }> = {
  en: { map: "Map", web: "Website & photos", book: "Book online" },
  no: { map: "Kart", web: "Nettsted og bilder", book: "Bestill online" },
  sv: { map: "Karta", web: "Webbplats och bilder", book: "Boka online" },
  da: { map: "Kort", web: "Websted og billeder", book: "Book online" },
  de: { map: "Karte", web: "Website & Fotos", book: "Online buchen" },
  nl: { map: "Kaart", web: "Website & foto's", book: "Online boeken" },
  fr: { map: "Carte", web: "Site & photos", book: "Réserver en ligne" },
  pl: { map: "Mapa", web: "Strona i zdjęcia", book: "Rezerwuj online" },
};

const linkClass =
  "inline-flex items-center gap-1 rounded-full border border-border bg-background/60 px-2.5 py-1 text-[11px] font-medium text-foreground/85 transition-colors hover:border-primary/50 hover:text-primary";

export function PoiLinks({
  kind,
  name,
  where,
  region = "eu",
  website,
  booking,
  className,
}: {
  kind: PoiKind;
  name: string;
  where?: string | undefined;
  region?: RegionKey | undefined;
  website?: string | undefined;
  booking?: string | undefined;
  className?: string | undefined;
}) {
  const locale = useLocale();
  const l = LABELS[locale] ?? LABELS['en']!;
  const links = poiLinks({ kind, name, where, region, website, booking });

  return (
    <div className={cn("mt-3 flex flex-wrap gap-1.5", className)}>
      <a href={links.map} target="_blank" rel="noopener noreferrer" className={linkClass}>
        <MapPin className="size-3" /> {l.map}
      </a>
      <a href={links.web} target="_blank" rel="noopener noreferrer" className={linkClass}>
        <Images className="size-3" /> {l.web}
      </a>
      {links.booking && (
        <a
          href={links.booking}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkClass, "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20")}
        >
          <Ticket className="size-3" /> {l.book} <ExternalLink className="size-3 opacity-70" />
        </a>
      )}
    </div>
  );
}
