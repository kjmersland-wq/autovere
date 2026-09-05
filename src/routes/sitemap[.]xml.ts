import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { LOCALE_PAGES, LOCALE_ROUTES } from "@/lib/locales";
import { BASE_URL, PRIMARY_MARKET_PREFIXES, challengeHreflangLinks, homepageHreflangLinks } from "@/lib/seo";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
  /** xhtml:link alternates for a genuinely proven localized-equivalent group (homepage / Challenge). */
  alternates?: { hreflang: string; href: string }[];
}

const ENGLISH_PAGES = [
  "/planner",
  "/tolls",
  "/scenic",
  "/garage",
  "/faq",
  "/how-it-works",
  "/pricing",
  "/partners",
  "/privacy",
  "/terms",
];

const US_PAGES = [
  "/us/planner",
  "/us/tolls",
  "/us/scenic",
  "/us/garage",
  "/us/pricing",
  "/us/faq",
  "/us/how-it-works",
  "/us/partners",
  "/us/legal",
];
const CA_PAGES = [
  "/ca/planner",
  "/ca/tolls",
  "/ca/scenic",
  "/ca/garage",
  "/ca/pricing",
  "/ca/faq",
  "/ca/how-it-works",
  "/ca/partners",
  "/ca/legal",
  "/ca/fr/faq",
  "/ca/fr/how-it-works",
  "/ca/fr/partners",
  "/ca/fr/legal",

];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0", alternates: homepageHreflangLinks() },
          { path: "/europe", changefreq: "weekly", priority: "0.9" },
          { path: "/us", changefreq: "weekly", priority: "0.9", alternates: homepageHreflangLinks() },
          { path: "/ca", changefreq: "weekly", priority: "0.9", alternates: homepageHreflangLinks() },
          ...ENGLISH_PAGES.map((path) => ({ path, changefreq: "monthly" as const, priority: "0.7" })),
          ...US_PAGES.map((path) => ({ path, changefreq: "monthly" as const, priority: "0.6" })),
          ...CA_PAGES.map((path) => ({ path, changefreq: "monthly" as const, priority: "0.6" })),
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

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            ...(e.alternates ?? []).map(
              (a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}"/>`,
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
