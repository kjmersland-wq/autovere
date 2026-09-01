import { PricingTiers } from "@/components/PricingTiers";
import { SiteHeader } from "@/components/SiteHeader";
import { useLocale } from "@/lib/i18n";
import { pricingHero } from "@/lib/pricing-i18n";
import type { RegionKey } from "@/lib/trip-data";

/**
 * Master pricing page. Every locale route renders this exact component —
 * only the translated strings and prices change with the active locale.
 */
export function PricingPage({ region }: { region?: RegionKey }) {
  const locale = useLocale();
  const hero = pricingHero(locale);

  return (
    <main className="min-h-screen">
      {region ? <SiteHeader region={region} /> : <SiteHeader />}
      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{hero.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">{hero.title}</h1>
        <p className="mt-4 max-w-2xl text-foreground/75">{hero.intro}</p>
        <div className="mt-12">
          <PricingTiers region={region} />
        </div>
      </section>
    </main>
  );
}
