import { createFileRoute } from "@tanstack/react-router";

import { TollsGuide } from "@/components/TollsGuide";

export const Route = createFileRoute("/us/tolls")({
  head: () => ({
    meta: [
      { title: "Tolls & Express Lanes Explained — United States | AutoVere" },
      {
        name: "description",
        content:
          "Friendly, up-to-date guidance on turnpikes, cashless tolling, express lanes and E-ZPass, SunPass and FasTrak tags for cars, RVs and motorcycles.",
      },
      { property: "og:title", content: "US Tolls & Express Lanes | AutoVere" },
      {
        property: "og:description",
        content: "Know which transponder you need — long before you reach the toll gantry.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/us/tolls" }],
  }),
  component: TollsGuide,
});
