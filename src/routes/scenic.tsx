import { createFileRoute } from "@tanstack/react-router";

import { ScenicGuide } from "@/components/ScenicGuide";

export const Route = createFileRoute("/scenic")({
  head: () => ({
    meta: [
      { title: "Scenic Passes & Ferries — The Roads Worth the Detour | AutoVere" },
      {
        name: "description",
        content:
          "Alpine passes, coastal highways and vehicle ferries across Europe, the USA and Canada, with opening seasons, clearances and booking tips.",
      },
      { property: "og:title", content: "Scenic Passes & Ferries | AutoVere" },
      {
        property: "og:description",
        content: "The passes and crossings worth planning your whole trip around.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScenicGuide,
});
