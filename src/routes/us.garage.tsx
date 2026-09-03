import { createFileRoute } from "@tanstack/react-router";

import { GaragePage } from "@/components/GaragePage";

export const Route = createFileRoute("/us/garage")({
  head: () => ({
    meta: [
      { title: "My Garage & Trips — RVs, Transponders and Saved Routes | AutoVere USA" },
      {
        name: "description",
        content:
          "Keep your cars, RVs and motorcycles, their tank sizes and toll tags, plus every saved itinerary ready for instant GPX download.",
      },
      { property: "og:title", content: "My Garage & Trips | AutoVere USA" },
      {
        property: "og:description",
        content: "Your vehicles, toll tags and saved adventures in one calm place.",
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
    links: [{ rel: "canonical", href: "https://www.autovere.com/us/garage" }],
  }),
  component: GaragePage,
});
