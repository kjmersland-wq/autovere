import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/InfoPage";
import { NO_TERMS } from "@/lib/global-content-no";

const content = NO_TERMS;

export const Route = createFileRoute("/no/terms")({
  head: () => ({
    meta: [
      { title: content.meta.title },
      { name: "description", content: content.meta.description },
      { property: "og:title", content: content.meta.title },
      { property: "og:description", content: content.meta.description },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://www.autovere.com/og/og-no.jpg" },
      { property: "og:image:secure_url", content: "https://www.autovere.com/og/og-no.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://www.autovere.com/og/og-no.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
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
