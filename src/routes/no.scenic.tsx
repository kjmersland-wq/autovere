import { createFileRoute } from "@tanstack/react-router";

import { ScenicGuide } from "@/components/ScenicGuide";

export const Route = createFileRoute("/no/scenic")({
  head: () => ({
    meta: [
      { title: "Fjelloverganger og ferjer — Omveiene som er verdt det | AutoVere" },
      {
        name: "description",
        content:
          "Alpepass, kystveier og bilferjer i Europa, USA og Canada, med åpningssesong, høydebegrensninger og bookingtips.",
      },
      { property: "og:title", content: "Fjelloverganger og ferjer | AutoVere" },
      {
        property: "og:description",
        content: "Overgangene og overfartene som er verdt å planlegge hele turen rundt.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScenicGuide,
});
