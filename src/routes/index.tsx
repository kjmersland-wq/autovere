import { createFileRoute } from "@tanstack/react-router";

import { HeroPlanner } from "@/components/HeroPlanner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AutoVere — European Road Trip Toll & Cost Planner" },
      {
        name: "description",
        content:
          "Plan European road trips with exact toll, vignette, fuel, charging and ferry costs for cars, motorhomes and touring motorcycles.",
      },
      { property: "og:title", content: "AutoVere — European Road Trip Cost Planner" },
      {
        property: "og:description",
        content:
          "Exact tolls, vignettes, fuel, charging and ferry costs across Europe for cars, motorhomes and motorcycles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      <HeroPlanner
        region="eu"
        eyebrow="Europe · 30+ countries"
        title="Know the true cost of every kilometre."
        subtitle="Smart cross-border toll, vignette, fuel, charging, and ferry intelligence for cars, motorhomes, and touring motorcycles. Plan with total peace of mind."
      />
    </main>
  );
}
