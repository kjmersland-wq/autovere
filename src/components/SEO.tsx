import { useEffect } from "react";
import { SUPPORTED_LANGS, DEFAULT_LANG } from "@/i18n/config";
import { detectLangFromPath } from "@/i18n/routing";

type Props = {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, any> | Record<string, any>[];
};

const SITE = "https://autovere.com";
const OG_LOCALE_BY_LANG: Record<(typeof SUPPORTED_LANGS)[number], string> = {
  en: "en_US",
  no: "nb_NO",
  de: "de_DE",
  sv: "sv_SE",
  fr: "fr_FR",
};

const setMeta = (selector: string, attr: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [a, v] = selector.replace("meta[", "").replace("]", "").split("=");
    el.setAttribute(a, v.replace(/"/g, ""));
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const setLink = (rel: string, href: string, hreflang?: string) => {
  const sel = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(sel);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    if (hreflang) el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.href = href;
};

const stripLang = (path: string) => {
  const seg = path.split("/").filter(Boolean)[0];
  if (seg && (SUPPORTED_LANGS as readonly string[]).includes(seg)) {
    const rest = "/" + path.split("/").slice(2).join("/");
    return rest === "//" ? "/" : rest || "/";
  }
  return path;
};

const buildLocalized = (path: string, lang: string) => {
  const clean = stripLang(path);
  if (clean === "/") return lang === DEFAULT_LANG ? `${SITE}/` : `${SITE}/${lang}`;
  return lang === DEFAULT_LANG ? `${SITE}${clean}` : `${SITE}/${lang}${clean}`;
};

export const SEO = ({ title, description, canonical, image, type = "website", jsonLd }: Props) => {
  useEffect(() => {
    document.title = title.length > 60 ? title.slice(0, 57) + "…" : title;

    const desc = description.length > 160 ? description.slice(0, 157) + "…" : description;
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:type"]', "content", type);
    if (image) setMeta('meta[property="og:image"]', "content", image);

    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", desc);
    if (image) setMeta('meta[name="twitter:image"]', "content", image);

    const path = typeof window !== "undefined" ? window.location.pathname : "/";
    const lang = detectLangFromPath(path);
    const canonicalUrl = canonical || buildLocalized(path, lang);
    setLink("canonical", canonicalUrl);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:locale"]', "content", OG_LOCALE_BY_LANG[lang]);

    // hreflang for all supported languages + x-default
    document
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((n) => n.remove());
    SUPPORTED_LANGS.forEach((l) => setLink("alternate", buildLocalized(path, l), l));
    setLink("alternate", buildLocalized(path, DEFAULT_LANG), "x-default");

    document.querySelectorAll('script[data-seo-jsonld="true"]').forEach((n) => n.remove());
    if (jsonLd) {
      const arr = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      arr.forEach((obj) => {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.dataset.seoJsonld = "true";
        s.text = JSON.stringify(obj);
        document.head.appendChild(s);
      });
    }
  }, [title, description, canonical, image, type, JSON.stringify(jsonLd)]);

  return null;
};
