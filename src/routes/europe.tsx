import { createFileRoute } from "@tanstack/react-router";

import { HeroPlanner } from "@/components/HeroPlanner";
import { absUrl, ogImageMeta, ogImageUrl } from "@/lib/seo";

export const Route = createFileRoute("/europe")({
  head: () => ({
    meta: [
      { title: "AutoVere Europe — Toll, Vignette & Fuel Cost Planner" },
      {
        name: "description",
        content:
          "Plan European road trips in metric units and local currencies with exact toll, vignette, fuel, charging and ferry costs.",
      },
      { property: "og:title", content: "AutoVere Europe — Road Trip Cost Planner" },
      {
        property: "og:description",
        content:
          "Metric distances, EUR and local currencies, vignette and motorway toll rules across 30+ European countries.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_GB" },
      { property: "og:url", content: absUrl("/europe") },
      ...ogImageMeta(ogImageUrl(null)),
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absUrl("/europe") }],
  }),
  component: EuropePage,
});

function EuropePage() {
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
