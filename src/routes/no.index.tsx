import { createFileRoute } from "@tanstack/react-router";

import { HeroPlanner } from "@/components/HeroPlanner";

export const Route = createFileRoute("/no/")({
  head: () => ({
    meta: [
      { title: "AutoVere Norge — Bompenger, vignetter og reisekostnader" },
      {
        name: "description",
        content:
          "Planlegg bilferien med nøyaktige bompenger, vignetter, drivstoff, lading og ferjer for bil, bobil og motorsykkel.",
      },
      { property: "og:title", content: "AutoVere Norge — Planlegg reisekostnaden din" },
      {
        property: "og:description",
        content:
          "Bompenger, vignetter, drivstoff, lading og ferjer – nøyaktig beregnet for din rute gjennom Europa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NorwayPage,
});

function NorwayPage() {
  return (
    <main>
      <HeroPlanner
        region="eu"
        eyebrow="Europa · 30+ land"
        title="Planlegg én gang. Nyt hver eneste kilometer."
        subtitle="Fortell oss hvor du starter og hvor du drømmer deg bort – vi ordner bompenger, vignetter, drivstoff, lading og ferjer, så du kan nyte turen."
      />
    </main>
  );
}
