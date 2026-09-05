import { createFileRoute } from "@tanstack/react-router";

import { PricingPage } from "@/components/PricingPage";
import { appPageHreflangLinks } from "@/lib/seo";

export const Route = createFileRoute("/ca/pricing")({
  head: () => ({
    meta: [
      { title: "Plans & Pricing in CAD — Free, Pro and Fleet | AutoVere Canada" },
      {
        name: "description",
        content:
          "Canadian road trip pricing in CAD. Start free with 407 ETR, provincial toll and fuel estimates, or go Pro for a multi-vehicle garage, GPX export and live pass alerts.",
      },
      { property: "og:title", content: "AutoVere Plans & Pricing — Canada" },
      {
        property: "og:description",
        content: "Free Canadian toll and fuel intelligence, Pro for serious travellers, Fleet for teams.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.autovere.com/og/autovere-og-ca.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "AutoVere — know the true cost of every kilometre in Canada" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.autovere.com/og/autovere-og-ca.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://www.autovere.com/ca/pricing" },
      ...appPageHreflangLinks("pricing"),
    ],
  }),
  component: () => <PricingPage region="ca" />,
});
