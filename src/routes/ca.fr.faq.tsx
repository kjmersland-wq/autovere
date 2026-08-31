import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/InfoPage";
import { absUrl, faqScript } from "@/lib/seo";
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
      { property: "og:url", content: absUrl("/ca/fr/faq") },
    ],
    links: [{ rel: "canonical", href: absUrl("/ca/fr/faq") }],
    scripts: faqScript(content.sections),
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
