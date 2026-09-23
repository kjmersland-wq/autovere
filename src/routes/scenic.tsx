import { createFileRoute } from "@tanstack/react-router";

import { ScenicGuide } from "@/components/ScenicGuide";
import { absUrl, appPageHreflangLinks, ogImageMeta, ogImageUrl } from "@/lib/seo";

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
      { property: "og:locale", content: "en_GB" },
      { property: "og:url", content: absUrl("/scenic") },
      ...ogImageMeta(ogImageUrl(null)),
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absUrl("/scenic") }, ...appPageHreflangLinks("scenic")],
  }),
  component: ScenicGuide,
});
