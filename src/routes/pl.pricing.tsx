import { createFileRoute } from "@tanstack/react-router";

import { PricingTiers } from "@/components/PricingTiers";
import { SiteHeader } from "@/components/SiteHeader";

const title = "Plany i cennik — Free, Pro i Flota | AutoVere";
const description =
  "Zacznij za darmo z wyceną opłat drogowych, winiet i paliwa. Pro za 4,99 €/mies. daje garaż wielu pojazdów, eksport GPX i alerty o przełęczach, a Flota kosztuje 19 €/mies.";

export const Route = createFileRoute("/pl/pricing")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.autovere.com/pl/pricing" }],
  }),
  component: PlPricingPage,
});

function PlPricingPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Plany i cennik</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Wybierz plan dopasowany do drogi, która przed Tobą.
        </h1>
        <p className="mt-4 max-w-2xl text-foreground/75">
          Każdy plan zaczyna się od uczciwych liczb. Ulepsz go, gdy zechcesz mieć pełny garaż, nawigację offline i
          rozliczenia opłat dla floty — anulujesz, kiedy sezon się kończy.
        </p>
        <div className="mt-12">
          <PricingTiers />
        </div>
      </section>
    </main>
  );
}
