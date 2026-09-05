import { createFileRoute } from "@tanstack/react-router";

import { HeroPlanner } from "@/components/HeroPlanner";
import { absUrl, appPageHreflangLinks } from "@/lib/seo";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Road Trip Planner — Costs Mapped Before You Drive | AutoVere" },
      {
        name: "description",
        content:
          "Plan your route and see tolls, vignettes, fuel, EV charging and ferries in one clear budget for cars, motorhomes and motorcycles.",
      },
      { property: "og:title", content: "AutoVere Road Trip Planner" },
      {
        property: "og:description",
        content: "One clear budget for tolls, fuel, charging and ferries — before you turn the key.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absUrl("/planner") }, ...appPageHreflangLinks("planner")],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <main>
      <HeroPlanner
        region="eu"
        eyebrow="Road trip planner"
        title="Plan it once. Enjoy every kilometre."
        subtitle="Tell us where you're starting and where you're dreaming of — we'll handle tolls, vignettes, fuel, charging and ferries so you can focus on the drive."
      />
    </main>
  );
}
