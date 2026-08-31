import { createFileRoute } from "@tanstack/react-router";

import { TollsGuide } from "@/components/TollsGuide";

export const Route = createFileRoute("/tolls")({
  head: () => ({
    meta: [
      { title: "Tolls & Vignettes Explained — Europe, USA & Canada | AutoVere" },
      {
        name: "description",
        content:
          "Friendly, up-to-date guidance on tolls, vignettes and electronic tags across Europe, the USA and Canada for cars, motorhomes and motorcycles.",
      },
      { property: "og:title", content: "Tolls & Vignettes Explained | AutoVere" },
      {
        property: "og:description",
        content: "Know which vignette, tag or transponder you need — before you reach the border.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TollsGuide,
});
