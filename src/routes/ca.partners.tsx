import { createFileRoute } from "@tanstack/react-router";

import { PartnersPage } from "@/components/PartnersPage";
import { PARTNERS } from "@/lib/info-content";
import { appPageHreflangLinks } from "@/lib/seo";

const content = PARTNERS["ca"];

export const Route = createFileRoute("/ca/partners")({
  head: () => ({
    meta: [
      { title: content.meta.title },
      { name: "description", content: content.meta.description },
      { property: "og:title", content: content.meta.title },
      { property: "og:description", content: content.meta.description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_CA" },
      { property: "og:url", content: "https://www.autovere.com/ca/partners" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: "https://www.autovere.com/og/autovere-og-ca.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://www.autovere.com/og/autovere-og-ca.jpg" },
      { name: "thumbnail", content: "https://www.autovere.com/og/autovere-square-ca.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://www.autovere.com/ca/partners" },
      ...appPageHreflangLinks("partners"),
    ],
  }),
  component: CaPartnersPage,
});

function CaPartnersPage() {
  return (
    <PartnersPage
      lang="en"
      localized={{ eyebrow: content.eyebrow, title: content.title, intro: content.intro }}
    />
  );
}
