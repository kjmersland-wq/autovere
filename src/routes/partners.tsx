import { createFileRoute } from "@tanstack/react-router";

import { PartnersPage } from "@/components/PartnersPage";
import { absUrl, appPageHreflangLinks } from "@/lib/seo";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners — Give your members 25% off AutoVere Pro | AutoVere" },
      {
        name: "description",
        content:
          "Become an AutoVere partner: give your members real toll, vignette, fuel and charging costs before they set off, plus 25% off AutoVere Pro. No software to build.",
      },
      { property: "og:title", content: "Become an AutoVere Partner — 25% off for your members" },
      {
        property: "og:description",
        content:
          "A genuinely useful member benefit for motoring, motorhome, EV and touring organisations across Europe, the USA and Canada.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_GB" },
      { property: "og:url", content: absUrl("/partners") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absUrl("/partners") }, ...appPageHreflangLinks("partners")],
  }),
  component: () => <PartnersPage lang="en" />,
});
