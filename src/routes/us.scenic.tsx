import { createFileRoute } from "@tanstack/react-router";

import { ScenicGuide } from "@/components/ScenicGuide";

export const Route = createFileRoute("/us/scenic")({
  head: () => ({
    meta: [
      { title: "Scenic Byways & Ferries — United States | AutoVere" },
      {
        name: "description",
        content:
          "Mountain passes, coastal highways and vehicle ferries across the US, with opening seasons, clearances and booking tips for cars, RVs and motorcycles.",
      },
      { property: "og:title", content: "US Scenic Byways & Ferries | AutoVere" },
      {
        property: "og:description",
        content: "The passes and crossings worth planning your whole road trip around.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.autovere.com/og/autovere-og-us.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "AutoVere — know the true cost of every mile" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.autovere.com/og/autovere-og-us.jpg" },
      { name: "twitter:image:alt", content: "AutoVere USA road trip cost planner" },
      { name: "thumbnail", content: "https://www.autovere.com/og/autovere-square-us.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://www.autovere.com/us/scenic" }],
  }),
  component: ScenicGuide,
});
