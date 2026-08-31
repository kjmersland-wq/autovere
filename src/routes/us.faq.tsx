import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/InfoPage";
import { absUrl, faqScript } from "@/lib/seo";
import { FAQ } from "@/lib/info-content";

const content = FAQ["us"];

export const Route = createFileRoute("/us/faq")({
  head: () => ({
    meta: [
      { title: content.meta.title },
      { name: "description", content: content.meta.description },
      { property: "og:title", content: content.meta.title },
      { property: "og:description", content: content.meta.description },
      { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: absUrl("/us/faq") },
    ],
    links: [{ rel: "canonical", href: absUrl("/us/faq") }],
    scripts: faqScript(content.sections),
  }),
  component: UsFaqPage,
});

function UsFaqPage() {
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
