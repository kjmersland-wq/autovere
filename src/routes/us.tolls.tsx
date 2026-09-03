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
      { property: "og:image", content: "https://www.autovere.com/og/og-us.jpg" },
      { property: "og:image:secure_url", content: "https://www.autovere.com/og/og-us.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "AutoVere — know the true cost of every mile" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.autovere.com/og/og-us.jpg" },
      { name: "twitter:image:alt", content: "AutoVere USA road trip cost planner" },
      { name: "thumbnail", content: "https://www.autovere.com/og/autovere-square-us.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://www.autovere.com/us/tolls" }],
  }),
  component: TollsGuide,
});
