import { createFileRoute } from "@tanstack/react-router";

import { HeroPlanner } from "@/components/HeroPlanner";

export const Route = createFileRoute("/us")({
  head: () => ({
    meta: [
      { title: "AutoVere USA — Road Trip Toll & Fuel Cost Planner" },
      {
        name: "description",
        content:
          "Plan US road trips with exact toll, fuel, EV charging and ferry costs for cars, RVs and touring motorcycles.",
      },
      { property: "og:title", content: "AutoVere USA — Road Trip Cost Planner" },
      {
        property: "og:description",
        content:
          "Exact tolls, fuel, EV charging and ferry costs across the United States for cars, RVs and motorcycles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UsPage,
});

function UsPage() {
  return (
    <main>
      <HeroPlanner
        region="us"
        eyebrow="United States · 50 states"
        title="Every toll plaza, priced before you drive."
        subtitle="Interstate tolls, express lanes, fuel, EV charging and ferries for cars, RVs and touring motorcycles."
      />
    </main>
  );
}
