import { createFileRoute } from "@tanstack/react-router";

import { DecalConcepts } from "@/components/DecalConcepts";
import { absUrl } from "@/lib/seo";

const title = "AutoVere Decal Concepts — Design Preview";
const description =
  "Visual preview of official AutoVere car decal concepts: rear-window strip and circular explorer badge. Print-ready artwork and ordering are not included.";

export const Route = createFileRoute("/decals")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: absUrl("/decals") },
    ],
    links: [{ rel: "canonical", href: absUrl("/decals") }],
  }),
  component: DecalsPage,
});

function DecalsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:pt-12 lg:px-8">
      <DecalConcepts />
    </main>
  );
}
