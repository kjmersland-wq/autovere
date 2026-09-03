import { createFileRoute } from "@tanstack/react-router";

import { PartnersPage } from "@/components/PartnersPage";

export const Route = createFileRoute("/no/partners")({
  head: () => ({
    meta: [
      { title: "Partnere — Gi medlemmene 25 % rabatt på AutoVere Pro | AutoVere" },
      {
        name: "description",
        content:
          "Bli AutoVere-partner: gi medlemmene ekte bom-, vignett-, drivstoff- og ladekostnader før avreise, og 25 % rabatt på AutoVere Pro. Ingen teknologi å bygge.",
      },
      { property: "og:title", content: "Bli AutoVere-partner — 25 % rabatt til medlemmene dine" },
      {
        property: "og:description",
        content:
          "En reell medlemsfordel for bil-, bobil-, MC- og reiseorganisasjoner i Europa, USA og Canada.",
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
  component: () => <PartnersPage lang="no" />,
});
