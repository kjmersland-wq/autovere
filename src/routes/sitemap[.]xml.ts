import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { LOCALE_PAGES, LOCALE_ROUTES } from "@/lib/locales";

const BASE_URL = "https://www.autovere.com";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
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

const US_PAGES = ["/us/planner", "/us/garage", "/us/faq", "/us/how-it-works", "/us/partners", "/us/legal"];
const CA_PAGES = [
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
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/europe", changefreq: "weekly", priority: "0.9" },
          { path: "/us", changefreq: "weekly", priority: "0.9" },
          { path: "/ca", changefreq: "weekly", priority: "0.9" },
          ...ENGLISH_PAGES.map((path) => ({ path, changefreq: "monthly" as const, priority: "0.7" })),
          ...US_PAGES.map((path) => ({ path, changefreq: "monthly" as const, priority: "0.6" })),
          ...CA_PAGES.map((path) => ({ path, changefreq: "monthly" as const, priority: "0.6" })),
        ];

        for (const locale of LOCALE_ROUTES) {
          entries.push({ path: `/${locale.prefix}`, changefreq: "weekly", priority: "0.8" });
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
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
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
