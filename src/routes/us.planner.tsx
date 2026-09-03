import { createFileRoute } from "@tanstack/react-router";

import { HeroPlanner } from "@/components/HeroPlanner";

export const Route = createFileRoute("/us/planner")({
  head: () => ({
    meta: [
      { title: "US Road Trip Planner — Tolls, Gas & Charging Mapped | AutoVere" },
      {
        name: "description",
        content:
          "Plan your American road trip and see interstate tolls, express lanes, gas, EV charging and ferries in one clear budget for cars, RVs and motorcycles.",
      },
      { property: "og:title", content: "AutoVere US Road Trip Planner" },
      {
        property: "og:description",
        content: "One honest budget for tolls, gas, charging and ferries — before you hit the on-ramp.",
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
    links: [{ rel: "canonical", href: "https://www.autovere.com/us/planner" }],
  }),
  component: UsPlannerPage,
});

function UsPlannerPage() {
  return (
    <main>
      <HeroPlanner
        region="us"
        eyebrow="US road trip planner"
        title="Plan it once. Enjoy every mile."
        subtitle="Tell us where you're rolling out from and where you're dreaming of — we'll handle tolls, express lanes, gas, charging and ferries so you can just enjoy the drive."
      />
    </main>
  );
}
