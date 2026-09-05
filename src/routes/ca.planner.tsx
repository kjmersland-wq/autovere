import { createFileRoute } from "@tanstack/react-router";

import { HeroPlanner } from "@/components/HeroPlanner";
import { appPageHreflangLinks } from "@/lib/seo";

export const Route = createFileRoute("/ca/planner")({
  head: () => ({
    meta: [
      { title: "Canada Road Trip Planner — Tolls, Fuel & Charging Mapped | AutoVere" },
      {
        name: "description",
        content:
          "Plan your Canadian road trip and see Highway 407 ETR, bridge tolls, fuel, EV charging and ferries in one clear budget for cars, RVs and motorcycles.",
      },
      { property: "og:title", content: "AutoVere Canada Road Trip Planner" },
      {
        property: "og:description",
        content: "One honest budget for tolls, fuel, charging and ferries — before you pull out of the driveway.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.autovere.com/ca/planner" },
      { property: "og:image", content: "https://www.autovere.com/og/autovere-og-ca.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "AutoVere — know the true cost of every kilometre in Canada" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.autovere.com/og/autovere-og-ca.jpg" },
      { name: "thumbnail", content: "https://www.autovere.com/og/autovere-square-ca.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://www.autovere.com/ca/planner" },
      ...appPageHreflangLinks("planner"),
    ],
  }),
  component: CaPlanner,
});

function CaPlanner() {
  return (
    <main>
      <HeroPlanner
        region="ca"
        eyebrow="Canada · coast to coast"
        title="Welcome to the open road, coast to coast."
        subtitle="Tell us where you're starting and where you're headed — we'll map every toll, bridge, gas stop, EV charging point and ferry in Canadian dollars for cars, RVs and touring motorcycles."
      />
    </main>
  );
}
