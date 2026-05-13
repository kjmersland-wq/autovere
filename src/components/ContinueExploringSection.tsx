import { ExternalLink, MapPin, CalendarCheck, Sliders, Zap, ShieldCheck, Snowflake, Route, Building2, Sparkles, BadgePercent, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { brandLinks, regionalOwnership, type OwnershipInsight } from "@/lib/region";
import { useRegion } from "@/hooks/use-region";
import type { Car } from "@/data/cars";

type Props = { car: Car };

const iconFor = (i: OwnershipInsight["icon"]) => {
  const map = { snow: Snowflake, highway: Route, city: Building2, charge: Zap, incentive: BadgePercent, comfort: Heart } as const;
  const C = map[i] ?? Sparkles;
  return <C className="w-4 h-4 text-accent" />;
};

export const ContinueExploringSection = ({ car }: Props) => {
  const { t } = useTranslation();
  const { region } = useRegion();
  const modelSlug = car.slug.split("-").slice(1).join("-") || car.slug;
  const links = brandLinks(car.brand, region, modelSlug);
  const insights = regionalOwnership(region, car.brand);

  const continueCards = [
    { href: links.official, icon: ExternalLink, eyebrow: t("pages.car.ce.official"), title: `${car.brand} ${car.name}`, body: t("pages.car.ce.official_b") },
    { href: links.configurator, icon: Sliders, eyebrow: t("pages.car.ce.configure"), title: t("pages.car.ce.configure_t"), body: t("pages.car.ce.configure_b", { name: car.name }) },
    { href: links.testDrive, icon: CalendarCheck, eyebrow: t("pages.car.ce.test"), title: t("pages.car.ce.test_t"), body: t("pages.car.ce.test_b", { brand: car.brand }) },
    { href: links.dealerLocator, icon: MapPin, eyebrow: t("pages.car.ce.in_region", { region: region.name }), title: t("pages.car.ce.nearby_t"), body: t("pages.car.ce.nearby_b", { brand: car.brand, region: region.name }) },
    ...(links.charging ? [{ href: links.charging, icon: Zap, eyebrow: t("pages.car.ce.charging"), title: t("pages.car.ce.charging_t", { std: region.chargingStandard }), body: t("pages.car.ce.charging_b", { region: region.name }) }] : []),
    { href: `https://www.google.com/search?q=${encodeURIComponent(`${car.brand} warranty ${region.name}`)}`, icon: ShieldCheck, eyebrow: t("pages.car.ce.warranty"), title: t("pages.car.ce.warranty_t"), body: t("pages.car.ce.warranty_b", { region: region.name }) },
  ];

  return (
    <section className="container pb-24" aria-labelledby="continue-exploring">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-3">
        <div>
          <div className="text-sm text-accent font-medium tracking-wide uppercase">{t("pages.car.ce.eyebrow")}</div>
          <h2 id="continue-exploring" className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
            {t("pages.car.ce.h_a")} <span className="text-gradient">{car.name}</span>.
          </h2>
        </div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">
          <Globe />
          {t("pages.car.ce.tailored")} <span className="text-foreground font-medium">{region.flag} {region.name}</span>
        </div>
      </div>
      <p className="text-muted-foreground max-w-2xl mb-10">
        {t("pages.car.ce.lead")}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {continueCards.map((c) => (
          <a
            key={c.title}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="group relative glass rounded-3xl p-7 overflow-hidden border border-border/40 hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-500"
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-glow opacity-0 group-hover:opacity-60 transition-opacity duration-700" />
            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="text-[10px] uppercase tracking-[0.25em] text-accent">{c.eyebrow}</div>
                <c.icon className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
              </div>
              <div className="text-lg font-semibold mb-2 leading-snug">{c.title}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
              <div className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                {t("pages.car.ce.open")} <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-16">
        <div className="text-sm text-accent font-medium tracking-wide uppercase mb-2">{t("pages.car.ce.owning_in", { region: region.name })}</div>
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
          {t("pages.car.ce.feels_like_a")} <span className="text-gradient">{t("pages.car.ce.feels_like_b")}</span>.
        </h3>
        <div className="grid md:grid-cols-3 gap-5">
          {insights.map((ins) => (
            <div key={ins.title} className="glass rounded-3xl p-7 border border-border/40">
              <div className="flex items-center gap-2 mb-3">
                {iconFor(ins.icon)}
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{region.name}</div>
              </div>
              <div className="text-lg font-semibold mb-2 leading-snug">{ins.title}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{ins.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Globe = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);
