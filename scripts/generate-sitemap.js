import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(new URL(".", import.meta.url).pathname, "..");
const SITE = "https://autovere.com";

const i18nConfig = readFileSync(resolve(ROOT, "src/i18n/config.ts"), "utf8");
const carsData = readFileSync(resolve(ROOT, "src/data/cars.ts"), "utf8");

const langsMatch = i18nConfig.match(/SUPPORTED_LANGS\s*=\s*\[([^\]]+)\]/s);
const defaultMatch = i18nConfig.match(/DEFAULT_LANG:\s*Lang\s*=\s*"([^"]+)"/);

if (!langsMatch || !defaultMatch) {
  throw new Error("Could not parse SUPPORTED_LANGS/DEFAULT_LANG from src/i18n/config.ts");
}

const langs = [...langsMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
const DEFAULT_LANG = defaultMatch[1];

const extractBlock = (name) => {
  const match = carsData.match(new RegExp(`const\\s+${name}[\\s\\S]*?=\\s*\\[([\\s\\S]*?)\\n\\];`, "m"));
  return match?.[1] ?? "";
};

const extractSlugs = (block) => [...block.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

const carBlock = extractBlock("CAR_META");
const collectionBlock = extractBlock("COLLECTION_META");
const personalityBlock = extractBlock("PERSONALITY_META");
const learnBlock = extractBlock("LEARN_META");

const carSlugs = extractSlugs(carBlock);
const collectionSlugs = extractSlugs(collectionBlock);
const personalitySlugs = extractSlugs(personalityBlock);
const learnSlugs = extractSlugs(learnBlock);

const comparePairs = new Set();
for (const entry of carBlock.matchAll(/\{\s*slug:\s*"([^"]+)"[\s\S]*?comparesWellWith:\s*\[([^\]]*)\]/g)) {
  const source = entry[1];
  const targets = [...entry[2].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  for (const target of targets) {
    const pair = [source, target].sort().join("::");
    comparePairs.add(pair);
  }
}

const staticPaths = [
  "/",
  "/cars",
  "/compare",
  "/collections",
  "/personalities",
  "/learn",
  "/watch",
  "/pricing",
  "/contact",
  "/help",
  "/discover",
  "/legal/terms",
  "/legal/privacy",
  "/legal/cookies",
  "/legal/refund",
  "/legal/subscriptions",
];

const paths = new Set(staticPaths);
carSlugs.forEach((slug) => paths.add(`/cars/${slug}`));
collectionSlugs.forEach((slug) => paths.add(`/collections/${slug}`));
personalitySlugs.forEach((slug) => paths.add(`/personalities/${slug}`));
learnSlugs.forEach((slug) => paths.add(`/learn/${slug}`));
for (const pair of comparePairs) {
  const [a, b] = pair.split("::");
  paths.add(`/compare/${a}-vs-${b}`);
}

const localizePath = (path, lang) => {
  if (path === "/") return lang === DEFAULT_LANG ? `${SITE}/` : `${SITE}/${lang}`;
  return lang === DEFAULT_LANG ? `${SITE}${path}` : `${SITE}/${lang}${path}`;
};

const today = new Date().toISOString().slice(0, 10);
const sortedPaths = [...paths].sort((a, b) => a.localeCompare(b));

const entries = [];
for (const path of sortedPaths) {
  for (const lang of langs) {
    const loc = localizePath(path, lang);
    const alternates = langs
      .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${localizePath(path, l)}"/>`)
      .join("\n");
    entries.push(
      [
        "  <url>",
        `    <loc>${loc}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        "    <changefreq>weekly</changefreq>",
        alternates,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${localizePath(path, DEFAULT_LANG)}"/>`,
        "  </url>",
      ].join("\n"),
    );
  }
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ...entries,
  "</urlset>",
  "",
].join("\n");

writeFileSync(resolve(ROOT, "public/sitemap.xml"), xml, "utf8");
console.log(`Generated sitemap with ${entries.length} localized URLs across ${langs.length} languages.`);
