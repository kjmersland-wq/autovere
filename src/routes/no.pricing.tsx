import { createFileRoute } from "@tanstack/react-router";

import { PricingPage } from "@/components/PricingPage";
import { NO_PRICING } from "@/lib/global-content-no";
import { absUrl, appPageHreflangLinks } from "@/lib/seo";

const content = NO_PRICING;

export const Route = createFileRoute("/no/pricing")({
  head: () => ({
    meta: [
      { title: content.meta.title },
      { name: "description", content: content.meta.description },
      { property: "og:title", content: content.meta.title },
      { property: "og:description", content: content.meta.description },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.autovere.com/og/og-no.jpg" },
      { property: "og:image:secure_url", content: "https://www.autovere.com/og/og-no.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://www.autovere.com/og/og-no.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absUrl("/no/pricing") }, ...appPageHreflangLinks("pricing")],
  }),
  component: () => <PricingPage />,
});
