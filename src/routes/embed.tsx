import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { stringsFor } from "@/lib/i18n";
import { LOCALE_ROUTES } from "@/lib/locales";

type EmbedSearch = { to?: string; lang?: string };

export const Route = createFileRoute("/embed")({
  validateSearch: (search: Record<string, unknown>): EmbedSearch => ({
    ...(typeof search["to"] === "string" ? { to: search["to"].slice(0, 80) } : {}),
    ...(typeof search["lang"] === "string" ? { lang: search["lang"].slice(0, 5) } : {}),
  }),
  head: () => ({
    meta: [{ title: "AutoVere cost box" }, { name: "robots", content: "noindex" }],
  }),
  component: EmbedBox,
});

/**
 * A partner drops this in with one iframe line:
 *   <iframe src="https://autovere.com/embed?to=Hemsedal&lang=no" width="100%" height="190" style="border:0"></iframe>
 * The visitor types where they start and lands in the full planner with both places filled in.
 */
function EmbedBox() {
  const { to = "", lang = "en" } = Route.useSearch();
  const t = stringsFor(lang);
  const [from, setFrom] = useState("");
  const prefix = LOCALE_ROUTES.find((l) => l.code === lang)?.prefix;
  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({ destination: to, ...(from.trim() ? { origin: from.trim() } : {}) });
    const base = prefix ? `/${prefix}` : "";
    window.open(`https://autovere.com${base}?${params.toString()}`, "_blank", "noopener");
  };
  return (
    <main className="min-h-screen bg-background p-4 text-foreground">
      <form onSubmit={go} className="mx-auto max-w-md rounded-2xl border border-border bg-card p-5">
        <h1 className="text-lg font-semibold tracking-tight">{t.flow.embedTitle(to || "…")}</h1>
        <input
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder={t.flow.embedFrom}
          aria-label={t.flow.embedFrom}
          className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="mt-3 w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          {t.flow.embedCta} →
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          <a href="https://autovere.com" target="_blank" rel="noopener" className="hover:underline">
            AutoVere
          </a>
        </p>
      </form>
    </main>
  );
}
