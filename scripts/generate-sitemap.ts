import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE = "https://www.autovere.com";
const LANGS = ["en", "no"] as const;
const DEFAULT = "en";

const STATIC_PATHS = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly" },
  { path: "/pricing", changefreq: "monthly" },
  { path: "/contact", changefreq: "monthly" },
  { path: "/faq", changefreq: "monthly" },
  { path: "/help", changefreq: "monthly" },
  { path: "/discover", changefreq: "weekly" },
  { path: "/cars", changefreq: "weekly" },
  { path: "/compare", changefreq: "monthly" },
  { path: "/collections", changefreq: "weekly" },
  { path: "/personalities", changefreq: "monthly" },
  { path: "/learn", changefreq: "weekly" },
  { path: "/watch", changefreq: "weekly" },
  { path: "/garage", changefreq: "monthly" },
  { path: "/ev", changefreq: "weekly", priority: "0.9" },
  { path: "/ev/database", changefreq: "weekly", priority: "0.9" },
  { path: "/ev/reviews", changefreq: "weekly" },
  { path: "/ev/models", changefreq: "weekly" },
  { path: "/ev/networks", changefreq: "monthly" },
  { path: "/ev/charging", changefreq: "monthly" },
  { path: "/ev/route-planner", changefreq: "monthly" },
  { path: "/ev/calculator", changefreq: "monthly" },
  { path: "/ev/guides", changefreq: "weekly" },
  { path: "/ev/compare", changefreq: "monthly" },
  { path: "/ev/advisor", changefreq: "monthly" },
  { path: "/ev/markets", changefreq: "monthly" },
  { path: "/ev/news", changefreq: "daily", priority: "0.9" },
  { path: "/legal/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/cookies", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/refund", changefreq: "yearly", priority: "0.3" },
  { path: "/legal/subscriptions", changefreq: "yearly", priority: "0.3" },
];

async function loadDynamic() {
  const out: { path: string; changefreq: string }[] = [];
  const evModels = await import("../src/data/ev-models");
  evModels.EV_MODELS.forEach((m) => out.push({ path: `/ev/models/${m.slug}`, changefreq: "monthly" }));
  const networks = await import("../src/data/charging-networks");
  networks.CHARGING_NETWORKS.forEach((n) => out.push({ path: `/ev/networks/${n.slug}`, changefreq: "monthly" }));
  const articles = await import("../src/data/articles");
  // best-effort: any exported array of objects with .slug
  const anyMod = articles as unknown as Record<string, unknown>;
  for (const v of Object.values(anyMod)) {
    if (Array.isArray(v)) {
      for (const item of v) {
        const it = item as { slug?: string };
        if (it && typeof it === "object" && typeof it.slug === "string") {
          out.push({ path: `/ev/news/${it.slug}`, changefreq: "monthly" });
        }
      }
    }
  }
  return out;
}

const localize = (path: string, lang: string) => {
  if (path === "/") return lang === DEFAULT ? `${BASE}/` : `${BASE}/${lang}`;
  return lang === DEFAULT ? `${BASE}${path}` : `${BASE}/${lang}${path}`;
};

function urlBlock(p: { path: string; changefreq?: string; priority?: string }, lang: string) {
  const loc = localize(p.path, lang);
  const alts = LANGS.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${localize(p.path, l)}"/>`
  ).join("\n");
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${localize(p.path, DEFAULT)}"/>`;
  return [
    `  <url>`,
    `    <loc>${loc}</loc>`,
    p.changefreq ? `    <changefreq>${p.changefreq}</changefreq>` : null,
    p.priority ? `    <priority>${p.priority}</priority>` : null,
    alts,
    xDefault,
    `  </url>`,
  ].filter(Boolean).join("\n");
}

const dynamic = await loadDynamic();
const all = [...STATIC_PATHS, ...dynamic];

const blocks: string[] = [];
for (const p of all) for (const l of LANGS) blocks.push(urlBlock(p, l));

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  blocks.join("\n") +
  `\n</urlset>\n`;

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml: ${all.length} paths × ${LANGS.length} langs = ${blocks.length} URLs`);
