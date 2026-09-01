import { createFileRoute } from "@tanstack/react-router";

import { TollsGuide } from "@/components/TollsGuide";

export const Route = createFileRoute("/ca/tolls")({
  head: () => ({
    meta: [
      { title: "Tolls & Toll Highways Explained — Canada | AutoVere" },
      {
        name: "description",
        content:
          "Friendly guidance on Highway 407 ETR, the A25 and A30 bridges, Cobequid Pass and provincial transponders for cars, RVs and motorcycles.",
      },
      { property: "og:title", content: "Canadian Tolls & Transponders | AutoVere" },
      {
        property: "og:description",
        content: "Know which tag you need — long before you reach the gantry.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.autovere.com/ca/tolls" },
      { property: "og:image", content: "https://www.autovere.com/og/autovere-og-ca.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "AutoVere — know the true cost of every kilometre in Canada" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.autovere.com/og/autovere-og-ca.jpg" },
      { name: "thumbnail", content: "https://www.autovere.com/og/autovere-square-ca.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://www.autovere.com/ca/tolls" }],
  }),
  component: TollsGuide,
});
