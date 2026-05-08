import { ExternalLink, MapPin, CalendarCheck, Sliders, Zap, ShieldCheck, Snowflake, Route, Building2, Sparkles, BadgePercent, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { brandLinks, regionalOwnership, type OwnershipInsight } from "@/lib/region";
import { useRegion } from "@/hooks/use-region";
import type { Car } from "@/data/cars";
import { getRegionDisplayName } from "@/lib/region";
import { getUiCopy, interpolate } from "@/i18n/localized-content";

type Props = { car: Car };

const iconFor = (i: OwnershipInsight["icon"]) => {
  const map = { snow: Snowflake, highway: Route, city: Building2, charge: Zap, incentive: BadgePercent, comfort: Heart } as const;
  const C = map[i] ?? Sparkles;
  return <C className="w-4 h-4 text-accent" />;
};

export const ContinueExploringSection = ({ car }: Props) => {
  const { i18n } = useTranslation();
  const { region } = useRegion();
  const ui = getUiCopy(i18n.language).continueExploring;
  const regionLabel = getRegionDisplayName(region, i18n.language);
  // model slug heuristic: take last token of slug e.g. "polestar-3" → "3"
  const modelSlug = car.slug.split("-").slice(1).join("-") || car.slug;
  const links = brandLinks(car.brand, region, modelSlug);
  const insights = regionalOwnership(region, car.brand, i18n.language);

  const continueCards = [
    { href: links.official, icon: ExternalLink, eyebrow: ui.officialEyebrow, title: interpolate(ui.officialTitle, { brand: car.brand, name: car.name }), body: ui.officialBody },
    { href: links.configurator, icon: Sliders, eyebrow: ui.configureEyebrow, title: ui.configureTitle, body: interpolate(ui.configureBody, { name: car.name }) },
    { href: links.testDrive, icon: CalendarCheck, eyebrow: ui.testDriveEyebrow, title: ui.testDriveTitle, body: interpolate(ui.testDriveBody, { brand: car.brand }) },
    { href: links.dealerLocator, icon: MapPin, eyebrow: interpolate(ui.regionEyebrow, { region: regionLabel }), title: ui.regionTitle, body: interpolate(ui.regionBody, { brand: car.brand, region: regionLabel }) },
    ...(links.charging ? [{ href: links.charging, icon: Zap, eyebrow: ui.chargingEyebrow, title: interpolate(ui.chargingTitle, { standard: region.chargingStandard }), body: interpolate(ui.chargingBody, { region: regionLabel }) }] : []),
    { href: `https://www.google.com/search?q=${encodeURIComponent(`${car.brand} warranty ${region.name}`)}`, icon: ShieldCheck, eyebrow: ui.warrantyEyebrow, title: ui.warrantyTitle, body: interpolate(ui.warrantyBody, { region: regionLabel }) },
  ];

  return (
    <section className="container pb-24" aria-labelledby="continue-exploring">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-3">
        <div>
          <div className="text-sm text-accent font-medium tracking-wide uppercase">{ui.eyebrow}</div>
          <h2 id="continue-exploring" className="text-3xl md:text-4xl font-bold tracking-tight mt-2">
            {interpolate(ui.title, { name: car.name })}
          </h2>
        </div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">
          <Globe />
          {interpolate(ui.tailoredFor, { region: regionLabel })} <span className="text-foreground font-medium">{region.flag} {regionLabel}</span>
        </div>
      </div>
      <p className="text-muted-foreground max-w-2xl mb-10">
        {ui.lead}
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
                 {ui.open} <ExternalLink className="w-3 h-3" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Localized ownership intelligence */}
      <div className="mt-16">
         <div className="text-sm text-accent font-medium tracking-wide uppercase mb-2">{interpolate(ui.ownershipEyebrow, { region: regionLabel })}</div>
         <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
           {ui.ownershipTitle.split(ui.whereYouLive)[0]}<span className="text-gradient">{ui.whereYouLive}</span>{ui.ownershipTitle.split(ui.whereYouLive)[1] ?? ""}
         </h3>
        <div className="grid md:grid-cols-3 gap-5">
          {insights.map((ins) => (
            <div key={ins.title} className="glass rounded-3xl p-7 border border-border/40">
              <div className="flex items-center gap-2 mb-3">
                {iconFor(ins.icon)}
                 <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{regionLabel}</div>
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
