import { createFileRoute } from "@tanstack/react-router";

import { GaragePage } from "@/components/GaragePage";

export const Route = createFileRoute("/garage")({
  head: () => ({
    meta: [
      { title: "My Garage & Trips — Vehicles, Tags and Saved Routes | AutoVere" },
      {
        name: "description",
        content:
          "Keep your cars, campervans and motorcycles, their tank capacities and toll tags, plus every saved itinerary ready for instant GPX download.",
      },
      { property: "og:title", content: "My Garage & Trips | AutoVere" },
      {
        property: "og:description",
        content: "Your vehicles, toll tags and saved adventures in one calm place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GaragePage,
});
