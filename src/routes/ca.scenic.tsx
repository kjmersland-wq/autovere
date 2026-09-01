import { createFileRoute } from "@tanstack/react-router";

import { ScenicGuide } from "@/components/ScenicGuide";

export const Route = createFileRoute("/ca/scenic")({
  head: () => ({
    meta: [
      { title: "Scenic Routes & Ferries — Canada | AutoVere" },
      {
        name: "description",
        content:
          "Rocky Mountain passes, the Cabot Trail and BC Ferries crossings, with seasons, clearances and booking tips for cars, RVs and motorcycles.",
      },
      { property: "og:title", content: "Canadian Scenic Routes & Ferries | AutoVere" },
      {
        property: "og:description",
        content: "The passes and crossings worth planning your whole road trip around.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.autovere.com/ca/scenic" },
      { property: "og:image", content: "https://www.autovere.com/og/autovere-og-ca.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "AutoVere — know the true cost of every kilometre in Canada" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.autovere.com/og/autovere-og-ca.jpg" },
      { name: "thumbnail", content: "https://www.autovere.com/og/autovere-square-ca.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://www.autovere.com/ca/scenic" }],
  }),
  component: ScenicGuide,
});
