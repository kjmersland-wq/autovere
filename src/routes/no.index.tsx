import { createFileRoute } from "@tanstack/react-router";

import { HeroPlanner } from "@/components/HeroPlanner";
import { ShareButton } from "@/components/ShareButton";

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
      { property: "og:url", content: "https://www.autovere.com/no" },
      { property: "og:image", content: "https://www.autovere.com/og/autovere-og-no.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.autovere.com/og/autovere-og-no.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://www.autovere.com/no" }],
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
      <div className="mx-auto w-full max-w-6xl px-4 pb-14">
        <ShareButton variant="bar" lang="no" url="https://www.autovere.com/no" />
      </div>
    </main>
  );
}
