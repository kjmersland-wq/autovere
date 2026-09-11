import { createFileRoute } from "@tanstack/react-router";

import { PricingPage } from "@/components/PricingPage";
import { absUrl, appPageHreflangLinks, ogImageMeta, ogImageUrl } from "@/lib/seo";

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
      { property: "og:locale", content: "pl_PL" },
      { property: "og:url", content: absUrl("/pl/pricing") },
      ...ogImageMeta(ogImageUrl("pl")),
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absUrl("/pl/pricing") },
      ...appPageHreflangLinks("pricing"),
    ],
  }),
  component: () => <PricingPage />,
});
