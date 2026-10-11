import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/InfoPage";
import { GLOBAL_REFUND } from "@/lib/global-content";
import { absUrl, appPageHreflangLinks, ogImageMeta, ogImageUrl } from "@/lib/seo";

const content = GLOBAL_REFUND;

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: content.meta.title },
      { name: "description", content: content.meta.description },
      { property: "og:title", content: content.meta.title },
      { property: "og:description", content: content.meta.description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_GB" },
      { property: "og:url", content: absUrl("/refund") },
      ...ogImageMeta(ogImageUrl(null)),
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absUrl("/refund") }],
  }),
  component: GlobalRefund,
});

function GlobalRefund() {
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
