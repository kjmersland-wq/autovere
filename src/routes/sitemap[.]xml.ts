import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { LOCALE_PAGES, LOCALE_ROUTES } from "@/lib/locales";
import { BASE_URL, PRIMARY_MARKET_PREFIXES, challengeHreflangLinks, corridorHreflangLinks, homepageHreflangLinks } from "@/lib/seo";
import { SEO_CORRIDORS } from "@/data/seo-corridors";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
  /** xhtml:link alternates for a genuinely proven localized-equivalent group (homepage / Challenge). */
  alternates?: { hrefLang: string; href: string }[];
}

/**
 * The app has no per-page content-edit timestamps to report, so every entry
 * shares one <lastmod>: the date this sitemap response was generated. That's
 * still an accurate, non-fabricated signal (confirms the URL was live and
 * checked as of this date) — precise per-page dates would need an editorial
 * "last changed" field, which doesn't exist in the CMS yet.
 */
const LASTMOD = new Date().toISOString().slice(0, 10);

const APP_PAGES = [...LOCALE_PAGES];
const LEGAL_PAGES = ["privacy", "terms"] as const;
const REGIONAL_PAGES = [...APP_PAGES.filter((page) => !LEGAL_PAGES.includes(page as typeof LEGAL_PAGES[number])), "legal"];

/**
 * Core markets for pSEO corridor pages in the sitemap (see the loop below for
 * why the other 10 language trees are intentionally left out for now).
 */
const SITEMAP_CORRIDOR_CORE_MARKETS = new Set(["no", "se", "dk", "de"]);

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0", alternates: homepageHreflangLinks() },
          { path: "/europe", changefreq: "weekly", priority: "0.9" },
          { path: "/cost-index", changefreq: "monthly", priority: "0.7" },
          { path: "/us", changefreq: "weekly", priority: "0.9", alternates: homepageHreflangLinks() },
          { path: "/ca", changefreq: "weekly", priority: "0.9", alternates: homepageHreflangLinks() },
          ...APP_PAGES.map((page) => ({ path: `/${page}`, changefreq: "monthly" as const, priority: "0.7" })),
          ...REGIONAL_PAGES.map((page) => ({ path: `/us/${page}`, changefreq: "monthly" as const, priority: "0.6" })),
          ...REGIONAL_PAGES.map((page) => ({ path: `/ca/${page}`, changefreq: "monthly" as const, priority: "0.6" })),
          ...["faq", "how-it-works", "partners", "legal"].map((page) => ({ path: `/ca/fr/${page}`, changefreq: "monthly" as const, priority: "0.6" })),
          { path: "/challenge", changefreq: "monthly", priority: "0.8", alternates: challengeHreflangLinks() },
          ...PRIMARY_MARKET_PREFIXES.map((prefix) => ({
            path: `/challenge/${prefix}`,
            changefreq: "monthly" as const,
            priority: "0.8",
            alternates: challengeHreflangLinks(),
          })),
        ];

        for (const locale of LOCALE_ROUTES) {
          // /us and every /us/<page> are already listed explicitly above (US_PAGES) —
          // looping them in here too would duplicate every one of those URLs.
          if (locale.prefix === "us") continue;
          entries.push({
            path: `/${locale.prefix}`,
            changefreq: "weekly",
            priority: "0.8",
            alternates: homepageHreflangLinks(),
          });
          for (const page of LOCALE_PAGES) {
            entries.push({ path: `/${locale.prefix}/${page}`, changefreq: "monthly", priority: "0.6" });
          }
        }

        // pSEO corridor route pages — English root + the core-market language
        // trees for each of the 15 corridors. The other 10 language trees stay
        // live and fully linked in-app (via /scenic and cross-links) but are
        // deliberately left out of the sitemap for now: submitting all 15
        // language variants of all 15 corridors at once (225 near-duplicate
        // URLs) outruns this domain's current crawl budget/authority, which is
        // what was driving most of the "Discovered/Crawled - not indexed"
        // Search Console backlog. Revisit once the core markets are indexed.
        for (const corridor of SEO_CORRIDORS) {
          entries.push({
            path: `/routes/${corridor.slug}`,
            changefreq: "monthly",
            priority: "0.6",
            alternates: corridorHreflangLinks(corridor.slug),
          });
          for (const locale of LOCALE_ROUTES) {
            if (!SITEMAP_CORRIDOR_CORE_MARKETS.has(locale.prefix)) continue;
            entries.push({ path: `/${locale.prefix}/routes/${corridor.slug}`, changefreq: "monthly", priority: "0.6" });
          }
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            `    <lastmod>${LASTMOD}</lastmod>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            ...(e.alternates ?? []).map(
              (a) => `    <xhtml:link rel="alternate" hreflang="${a.hrefLang}" href="${a.href}"/>`,
            ),
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
