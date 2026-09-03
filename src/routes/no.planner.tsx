import { createFileRoute } from "@tanstack/react-router";

import { HeroPlanner } from "@/components/HeroPlanner";

export const Route = createFileRoute("/no/planner")({
  head: () => ({
    meta: [
      { title: "Ruteplanlegger — Se kostnaden før du kjører | AutoVere" },
      {
        name: "description",
        content:
          "Planlegg ruten og se bompenger, vignetter, drivstoff, lading og ferjer i ett tydelig budsjett for bil, bobil og motorsykkel.",
      },
      { property: "og:title", content: "AutoVere Ruteplanlegger" },
      {
        property: "og:description",
        content: "Ett tydelig budsjett for bom, drivstoff, lading og ferjer — før du vrir om nøkkelen.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.autovere.com/og/og-no.jpg" },
      { property: "og:image:secure_url", content: "https://www.autovere.com/og/og-no.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://www.autovere.com/og/og-no.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NoPlannerPage,
});

function NoPlannerPage() {
  return (
    <main>
      <HeroPlanner
        region="eu"
        eyebrow="Ruteplanlegger"
        title="Planlegg én gang. Nyt hver eneste kilometer."
        subtitle="Fortell oss hvor du starter og hvor du drømmer deg bort – vi ordner bompenger, vignetter, drivstoff, lading og ferjer, så du kan nyte turen."
      />
    </main>
  );
}
