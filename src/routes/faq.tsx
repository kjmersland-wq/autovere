import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/InfoPage";
import { absUrl, faqScript } from "@/lib/seo";
import { GLOBAL_FAQ } from "@/lib/global-content";

const content = GLOBAL_FAQ;

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: content.meta.title },
      { name: "description", content: content.meta.description },
      { property: "og:title", content: content.meta.title },
      { property: "og:description", content: content.meta.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: absUrl("/faq") },
    ],
    links: [{ rel: "canonical", href: absUrl("/faq") }],
    scripts: faqScript(content.sections),
  }),
  component: GlobalFaq,
});

function GlobalFaq() {
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
