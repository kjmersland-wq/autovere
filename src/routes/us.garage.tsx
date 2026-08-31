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
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.autovere.com/us/garage" }],
  }),
  component: GaragePage,
});
