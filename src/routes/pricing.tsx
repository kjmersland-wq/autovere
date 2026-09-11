import { createFileRoute } from "@tanstack/react-router";

import { PricingPage } from "@/components/PricingPage";
import { absUrl, appPageHreflangLinks, ogImageMeta, ogImageUrl, pricingOfferScript } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Plans & Pricing — Free, Pro and Fleet | AutoVere" },
      {
        name: "description",
        content:
          "Start free with toll, vignette and fuel estimates. Go Pro at \u20ac4.99/mo for multi-vehicle garage, GPX export and live pass alerts, or Fleet at \u20ac19/mo.",
      },
      { property: "og:title", content: "AutoVere Plans & Pricing" },
      {
        property: "og:description",
        content: "Free road trip cost intelligence, Pro at \u20ac4.99/mo, Business/Fleet at \u20ac19/mo.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_GB" },
      { property: "og:url", content: absUrl("/pricing") },
      ...ogImageMeta(ogImageUrl(null)),
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absUrl("/pricing") }, ...appPageHreflangLinks("pricing")],
    scripts: pricingOfferScript(),
  }),
  component: () => <PricingPage />,
});
