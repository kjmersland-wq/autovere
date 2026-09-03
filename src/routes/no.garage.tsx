import { createFileRoute } from "@tanstack/react-router";

import { GaragePage } from "@/components/GaragePage";

export const Route = createFileRoute("/no/garage")({
  head: () => ({
    meta: [
      { title: "Min Garasje og turer — Kjøretøy, brikker og lagrede ruter | AutoVere" },
      {
        name: "description",
        content:
          "Lagre biler, bobiler og motorsykler med tankvolum og bombrikker, pluss alle lagrede reiseruter klare for GPX-nedlasting.",
      },
      { property: "og:title", content: "Min Garasje og turer | AutoVere" },
      {
        property: "og:description",
        content: "Kjøretøyene dine, bombrikkene og alle lagrede turer samlet på ett rolig sted.",
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
  component: GaragePage,
});
