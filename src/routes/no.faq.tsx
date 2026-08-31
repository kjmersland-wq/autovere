import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/InfoPage";
import { absUrl, faqScript } from "@/lib/seo";
import { NO_FAQ } from "@/lib/global-content-no";

const content = NO_FAQ;

export const Route = createFileRoute("/no/faq")({
  head: () => ({
    meta: [
      { title: content.meta.title },
      { name: "description", content: content.meta.description },
      { property: "og:title", content: content.meta.title },
      { property: "og:description", content: content.meta.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: absUrl("/no/faq") },
    ],
    links: [{ rel: "canonical", href: absUrl("/no/faq") }],
    scripts: faqScript(content.sections),
  }),
  component: NoInfoPage,
});

function NoInfoPage() {
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
