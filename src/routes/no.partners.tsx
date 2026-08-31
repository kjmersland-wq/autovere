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
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PartnersPage lang="no" />,
});
