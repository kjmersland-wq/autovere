import { createFileRoute } from "@tanstack/react-router";

import { HeroPlanner } from "@/components/HeroPlanner";
import { ShareButton } from "@/components/ShareButton";
import { homepageHreflangLinks } from "@/lib/seo";

export const Route = createFileRoute("/ca/")({
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
      { property: "og:locale", content: "en_CA" },
      { property: "og:url", content: "https://www.autovere.com/ca" },
      { property: "og:image", content: "https://www.autovere.com/og/autovere-og-ca.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "AutoVere — know the true cost of every kilometre in Canada" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.autovere.com/og/autovere-og-ca.jpg" },
      { name: "twitter:image:alt", content: "AutoVere Canada road trip cost planner" },
      { name: "thumbnail", content: "https://www.autovere.com/og/autovere-square-ca.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://www.autovere.com/ca" }, ...homepageHreflangLinks()],
  }),
  component: CaPage,
});

function CaPage() {
  return (
    <main>
      <HeroPlanner
        region="ca"
        eyebrow="Canada · coast to coast"
        title="Welcome to the open road, coast to coast."
        subtitle="Smart provincial toll, bridge, gas, charging, and ferry intelligence — priced in Canadian dollars for cars, RVs and touring motorcycles. Plan your next road trip with total peace of mind."
      />
      <div className="mx-auto w-full max-w-6xl px-4 pb-14">
        <ShareButton variant="bar" lang="en" url="https://www.autovere.com/ca" />
      </div>
    </main>
  );
}
