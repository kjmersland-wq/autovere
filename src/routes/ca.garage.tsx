import { createFileRoute } from "@tanstack/react-router";

import { GaragePage } from "@/components/GaragePage";
import { appPageHreflangLinks } from "@/lib/seo";

export const Route = createFileRoute("/ca/garage")({
  head: () => ({
    meta: [
      { title: "My Garage & Trips — Vehicles, Tags and Saved Routes | AutoVere Canada" },
      {
        name: "description",
        content:
          "Keep your cars, campervans and motorcycles, their tank sizes and toll tags, plus every saved itinerary ready for instant GPX download.",
      },
      { property: "og:title", content: "My Garage & Trips | AutoVere Canada" },
      {
        property: "og:description",
        content: "Your vehicles, toll tags and saved adventures in one calm place.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.autovere.com/ca/garage" },
      { property: "og:image", content: "https://www.autovere.com/og/autovere-og-ca.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "AutoVere — know the true cost of every kilometre in Canada" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.autovere.com/og/autovere-og-ca.jpg" },
      { name: "thumbnail", content: "https://www.autovere.com/og/autovere-square-ca.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://www.autovere.com/ca/garage" },
      ...appPageHreflangLinks("garage"),
    ],
  }),
  component: GaragePage,
});
