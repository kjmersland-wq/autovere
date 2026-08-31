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
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/us/scenic" }],
  }),
  component: ScenicGuide,
});
