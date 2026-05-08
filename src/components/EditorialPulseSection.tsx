import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLatestPulse } from "@/hooks/use-latest-pulse";
import { CARS } from "@/data/cars";
import { getUiCopy } from "@/i18n/localized-content";

export const EditorialPulseSection = () => {
  const { i18n } = useTranslation();
  const ui = getUiCopy(i18n.language).editorialPulse;
  const { pulse, loading } = useLatestPulse();
  if (loading || !pulse) return null;

  const featured = pulse.featured_slugs
    .map((s) => CARS.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const date = new Date(pulse.refreshed_at).toLocaleDateString(i18n.language || "en-GB", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="border-t border-border/40 bg-gradient-to-b from-background to-background/60">
      <div className="container max-w-5xl py-20 md:py-28">
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-accent mb-8">
          <span className="h-px w-10 bg-accent/40" />
          {ui.title}
          <span className="text-muted-foreground/60 normal-case tracking-normal text-[11px]">
            · {date}
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05] mb-5 max-w-3xl">
          {pulse.title}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-10">
          {pulse.dek}
        </p>

        <div className="prose prose-invert max-w-2xl text-foreground/85 leading-[1.8] space-y-5">
          {pulse.body.split(/\n\s*\n/).map((p, i) => (
            <p key={i} className="text-base md:text-[17px]">
              {p}
            </p>
          ))}
        </div>

        {featured.length > 0 && (
          <div className="mt-14 pt-8 border-t border-border/40">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-5">
               {ui.featured}
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {featured.map((car) => (
                <Link
                  key={car.slug}
                  to={`/cars/${car.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-border/40 bg-card/30 px-4 py-3 hover:border-accent/40 transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium">{car.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{car.fit}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 text-xs text-muted-foreground/70 max-w-xl leading-relaxed">
          {ui.footer}
        </div>
      </div>
    </section>
  );
};
