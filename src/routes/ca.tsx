import { createFileRoute } from "@tanstack/react-router";

import { HeroPlanner } from "@/components/HeroPlanner";

export const Route = createFileRoute("/ca")({
  head: () => ({
    meta: [
      { title: "AutoVere Canada — Road Trip Toll & Fuel Cost Planner" },
      {
        name: "description",
        content:
          "Plan Canadian road trips with exact toll, fuel, EV charging and ferry costs for cars, RVs and touring motorcycles.",
      },
      { property: "og:title", content: "AutoVere Canada — Road Trip Cost Planner" },
      {
        property: "og:description",
        content:
          "Exact tolls, fuel, EV charging and ferry costs across Canada for cars, RVs and motorcycles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CaPage,
});

function CaPage() {
  return (
    <main>
      <HeroPlanner
        region="ca"
        eyebrow="Canada · coast to coast"
        title="Highway 407 to the Rockies, costed."
        subtitle="Provincial tolls, bridges, fuel, EV charging and BC ferries for cars, RVs and touring motorcycles."
      />
    </main>
  );
}
