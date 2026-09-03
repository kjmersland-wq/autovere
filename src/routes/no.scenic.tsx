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
      { property: "og:image", content: "https://www.autovere.com/og/og-no.jpg" },
      { property: "og:image:secure_url", content: "https://www.autovere.com/og/og-no.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://www.autovere.com/og/og-no.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScenicGuide,
});
