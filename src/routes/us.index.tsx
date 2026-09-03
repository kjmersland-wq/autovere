import { createFileRoute } from "@tanstack/react-router";

import { HeroPlanner } from "@/components/HeroPlanner";
import { ShareButton } from "@/components/ShareButton";

export const Route = createFileRoute("/us/")({
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
      { property: "og:url", content: "https://www.autovere.com/us" },
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
    links: [{ rel: "canonical", href: "https://www.autovere.com/us" }],
  }),
  component: UsPage,
});

function UsPage() {
  return (
    <main>
      <HeroPlanner
        region="us"
        eyebrow="United States · 50 states"
        title="Know the true cost of every mile."
        subtitle="Smart interstate toll, express lane, fuel, charging, and ferry intelligence for cars, RVs, and touring motorcycles. Plan with total peace of mind."
      />
      <div className="mx-auto w-full max-w-6xl px-4 pb-14">
        <ShareButton variant="bar" lang="en" url="https://www.autovere.com/us" />
      </div>
    </main>
  );
}
