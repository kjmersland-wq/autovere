import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/InfoPage";
import { absUrl, faqScript, breadcrumbScript } from "@/lib/seo";
import { FAQ } from "@/lib/info-content";

const content = FAQ["ca-fr"];

export const Route = createFileRoute("/ca/fr/faq")({
  head: () => ({
    meta: [
      { title: content.meta.title },
      { name: "description", content: content.meta.description },
      { property: "og:title", content: content.meta.title },
      { property: "og:description", content: content.meta.description },
      { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: "https://www.autovere.com/og/autovere-og-ca.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://www.autovere.com/og/autovere-og-ca.jpg" },
      { name: "thumbnail", content: "https://www.autovere.com/og/autovere-square-ca.jpg" },
      { property: "og:url", content: absUrl("/ca/fr/faq") },
    ],
    links: [{ rel: "canonical", href: absUrl("/ca/fr/faq") }],
    scripts: [...faqScript(content.sections), ...breadcrumbScript([{ name: "Accueil", url: absUrl("/ca/fr") }, { name: "FAQ", url: absUrl("/ca/fr/faq") }])],
  }),
  component: CaFrFaqPage,
});

function CaFrFaqPage() {
  return (
    <InfoPage
      eyebrow={content.eyebrow}
      title={content.title}
      intro={content.intro}
      sections={content.sections}
      note={content.note}
    />
  );
}
