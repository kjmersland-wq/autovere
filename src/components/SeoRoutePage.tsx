import { Bike, Car, Caravan, ExternalLink, Ship, Zap } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SiteHeader } from "@/components/SiteHeader";
import { useLocale, useT, useTr } from "@/lib/i18n";
import { seoRouteCopy } from "@/lib/seo-route-i18n";
import type { SEOCorridor, VehicleClass } from "@/data/seo-corridors";

const VEHICLE_ICON: Record<VehicleClass, typeof Car> = {
  car: Car,
  rv: Caravan,
  ev: Zap,
  motorcycle: Bike,
};

/**
 * Lightweight, static pSEO landing page for a single corridor
 * (/routes/:slug, /:locale/routes/:slug). Deliberately separate from the
 * live HeroPlanner — this page shows indicative cost ranges to capture
 * organic search intent, then hands the visitor off to the real planner
 * (pre-filled via ?origin=&destination=) for an exact, routed number.
 */
export function SeoRoutePage({
  corridor,
  plannerHref,
  homeHref,
  moreRoutes,
}: {
  corridor: SEOCorridor;
  plannerHref: string;
  homeHref: string;
  moreRoutes: { label: string; href: string }[];
}) {
  const locale = useLocale();
  const t = useT();
  const tr = useTr();
  const copy = seoRouteCopy(locale);
  const year = new Date().getFullYear();
  const corridorTitle = `${corridor.origin.name} → ${corridor.destination.name}`;

  const vehicleLabel: Record<VehicleClass, string> = {
    car: t.hero.vehicles.car,
    rv: t.hero.vehicles.motorhome,
    ev: t.hero.fuels.electric,
    motorcycle: t.hero.vehicles.motorcycle,
  };

  return (
    <main className="min-h-screen bg-[hsl(var(--background))]">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-6 pb-24 pt-12">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={homeHref}>{copy.homeLabel}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{corridorTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="mt-4 text-xs uppercase tracking-[0.22em] text-amber-300/90">{copy.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {copy.pageTitle(corridor.origin.name, corridor.destination.name, year)}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {copy.metaDescription(corridor.origin.name, corridor.destination.name)}
        </p>

        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>
            {copy.distanceLabel}: <strong className="text-foreground">{corridor.distanceKm} km</strong> ·{" "}
            {corridor.distanceMiles} mi
          </span>
          <span>
            {copy.countriesLabel}:{" "}
            <strong className="text-foreground">{corridor.countriesTraversed.join(" → ")}</strong>
          </span>
        </div>

        <a
          href={plannerHref}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-amber-200"
        >
          {copy.ctaButton} <ExternalLink className="size-4" />
        </a>

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
          <h2 className="text-lg font-semibold text-foreground">{copy.costSummaryTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{copy.costSummaryIntro}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {(Object.keys(corridor.tollsOverview) as VehicleClass[]).map((vc) => {
              const Icon = VEHICLE_ICON[vc];
              const est = corridor.tollsOverview[vc];
              return (
                <article key={vc} className="rounded-xl border border-white/10 bg-background/40 p-4">
                  <div className="flex items-center gap-2">
                    <Icon className="size-4 text-amber-300" />
                    <p className="text-sm font-semibold text-foreground">{vehicleLabel[vc]}</p>
                    <p className="ml-auto text-sm font-semibold text-amber-300">{est.range}</p>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{tr(est.note)}</p>
                </article>
              );
            })}
          </div>
          <p className="mt-4 text-xs italic text-muted-foreground">{copy.estimateDisclaimer}</p>
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
          <h2 className="text-lg font-semibold text-foreground">{copy.checklistTitle}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {copy.vignettesLabel}
              </p>
              {corridor.vignetteRequirements.length ? (
                <ul className="mt-2 space-y-2">
                  {corridor.vignetteRequirements.map((v) => (
                    <li key={v.country} className="text-sm text-foreground/85">
                      <a
                        href={v.portalUrl || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-amber-300 hover:underline"
                      >
                        {v.place}
                      </a>{" "}
                      — {v.detail} (€{v.amount})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-foreground/70">{copy.noVignetteNote}</p>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {copy.borderAlertsLabel}
              </p>
              <p className="mt-2 text-sm text-foreground/85">{tr(corridor.borderAlertsSummary)}</p>
            </div>
          </div>
        </section>

        {corridor.ferryOptions.length > 0 && (
          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            {corridor.ferryOptions.map((f) => (
              <article
                key={f.route}
                className="rounded-2xl border border-primary/40 bg-primary/10 p-5"
              >
                <div className="flex items-center gap-2">
                  <Ship className="size-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground">{copy.ferryCardTitle}</p>
                </div>
                <p className="mt-1 text-sm text-foreground/80">{f.route}</p>
                <p className="text-xs text-muted-foreground">{f.operator}</p>
                <a
                  href={f.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
                >
                  {copy.ferryCardCta} <ExternalLink className="size-3" />
                </a>
              </article>
            ))}
          </section>
        )}

        <section className="mt-12">
          <h2 className="text-lg font-semibold text-foreground">{copy.faqTitle}</h2>
          <div className="mt-4 space-y-4">
            {copy.faqQuestions(corridor.origin.name, corridor.destination.name).map((f) => (
              <div key={f.q} className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm font-semibold text-foreground">{f.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {moreRoutes.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-semibold text-foreground">{copy.moreRoutesTitle}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {moreRoutes.map((r) => (
                <a
                  key={r.href}
                  href={r.href}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-foreground/85 transition-colors hover:bg-white/[0.08]"
                >
                  {r.label}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
