import { createFileRoute } from "@tanstack/react-router";

import { HeroPlanner } from "@/components/HeroPlanner";
import { ShareButton } from "@/components/ShareButton";

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
      { property: "og:url", content: "https://www.autovere.com/" },
      { property: "og:image", content: "https://www.autovere.com/og/autovere-og-en.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.autovere.com/og/autovere-og-en.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://www.autovere.com/" }],
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
      <div className="mx-auto w-full max-w-6xl px-4 pb-14">
        <ShareButton variant="bar" lang="en" url="https://www.autovere.com/" />
      </div>
    </main>
  );
}
