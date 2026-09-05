import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/InfoPage";
import { GLOBAL_PRIVACY } from "@/lib/global-content";
import { absUrl, appPageHreflangLinks } from "@/lib/seo";

const content = GLOBAL_PRIVACY;

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: content.meta.title },
      { name: "description", content: content.meta.description },
      { property: "og:title", content: content.meta.title },
      { property: "og:description", content: content.meta.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absUrl("/privacy") },
      ...appPageHreflangLinks("privacy", false),
    ],
  }),
  component: GlobalPrivacy,
});

function GlobalPrivacy() {
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
