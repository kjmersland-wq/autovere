import { createFileRoute } from "@tanstack/react-router";

import { PricingPage } from "@/components/PricingPage";
import { appPageHreflangLinks } from "@/lib/seo";

export const Route = createFileRoute("/us/pricing")({
  head: () => ({
    meta: [
      { title: "Plans & Pricing — Free, Pro and Fleet | AutoVere USA" },
      {
        name: "description",
        content:
          "Start free with toll, express lane and gas estimates. Go Pro for a multi-vehicle garage, GPX export and live pass alerts, or pick Fleet for your whole crew.",
      },
      { property: "og:title", content: "AutoVere Plans & Pricing — USA" },
      {
        property: "og:description",
        content: "Free road trip cost intelligence, Pro for serious travelers, Fleet for teams.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.autovere.com/og/og-us.jpg" },
      { property: "og:image:secure_url", content: "https://www.autovere.com/og/og-us.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "AutoVere — know the true cost of every mile" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.autovere.com/og/og-us.jpg" },
      { name: "twitter:image:alt", content: "AutoVere USA road trip cost planner" },
      { name: "thumbnail", content: "https://www.autovere.com/og/autovere-square-us.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://www.autovere.com/us/pricing" },
      ...appPageHreflangLinks("pricing"),
    ],
  }),
  component: () => <PricingPage region="us" />,
});
