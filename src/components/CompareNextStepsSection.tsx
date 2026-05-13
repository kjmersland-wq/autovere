import { ArrowRight, ExternalLink, MapPin, CalendarCheck, Zap, BadgePercent } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRegion } from "@/hooks/use-region";
import { brandLinks } from "@/lib/region";
import type { Car } from "@/data/cars";
import { useLoc } from "@/lib/loc";

type Props = { a: Car; b: Car };

export const CompareNextStepsSection = ({ a, b }: Props) => {
  const { t } = useTranslation();
  const { l } = useLoc();
  const { region } = useRegion();

  const cars = [a, b].map((c) => {
    const modelSlug = c.slug.split("-").slice(1).join("-") || c.slug;
    const links = brandLinks(c.brand, region, modelSlug);
    return { car: c, links };
  });

  return (
    <section className="container pb-24" aria-labelledby="compare-next-steps">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-3">
        <div>
          <div className="text-sm text-accent font-medium tracking-wide uppercase">{t("pages.compare.next_eyebrow")}</div>
          <h2 id="compare-next-steps" className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
            {t("pages.compare.next_h_a")} <span className="text-gradient">{t("pages.compare.next_h_b")}</span>.
          </h2>
        </div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {t("pages.compare.tailored_for")} <span className="text-foreground font-medium">{region.flag} {region.name}</span>
        </div>
      </div>
      <p className="text-muted-foreground max-w-2xl mb-10">
        {t("pages.compare.next_lead")}
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {cars.map(({ car, links }) => (
          <div key={car.slug} className="glass rounded-3xl p-8 border border-border/40 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-glow opacity-30" />
            <div className="relative">
              <div className="text-[10px] uppercase tracking-[0.3em] text-accent mb-2">{car.brand}</div>
              <div className="text-2xl font-bold tracking-tight mb-1">{car.name}</div>
              <div className="text-sm text-muted-foreground mb-6">{l(car.fit)}</div>
              <ul className="space-y-2.5">
                <Step href={links.testDrive} icon={CalendarCheck} label={t("pages.compare.step_test")} />
                <Step href={links.dealerLocator} icon={MapPin} label={t("pages.compare.step_dealer", { brand: car.brand, region: region.name })} />
                <Step href={links.official} icon={ExternalLink} label={t("pages.compare.step_official")} />
                {links.charging && <Step href={links.charging} icon={Zap} label={t("pages.compare.step_charging", { std: region.chargingStandard })} />}
                <Step href={`https://www.google.com/search?q=${encodeURIComponent(`${car.brand} ${car.name} incentives ${region.name}`)}`} icon={BadgePercent} label={t("pages.compare.step_incentives", { region: region.name })} />
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Step = ({ href, icon: Icon, label }: { href: string; icon: typeof ExternalLink; label: string }) => (
  <li>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="group flex items-center justify-between gap-3 rounded-2xl px-4 py-3 border border-border/40 hover:border-accent/50 hover:bg-secondary/40 transition-all"
    >
      <span className="flex items-center gap-3 text-sm">
        <Icon className="w-4 h-4 text-accent" />
        {label}
      </span>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
    </a>
  </li>
);
