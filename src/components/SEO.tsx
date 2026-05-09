import { useEffect, useMemo } from "react";
import { SUPPORTED_LANGS, DEFAULT_LANG } from "@/i18n/config";
import { detectLangFromPath } from "@/i18n/routing";

type JsonLd = Record<string, unknown>;

type Props = {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageType?: string;
  keywords?: string;
  type?: "website" | "article";
  jsonLd?: JsonLd | JsonLd[];
  noindex?: boolean;
};

const SITE = "https://autovere.com";
const DEFAULT_OG_IMAGE = `${SITE}/og-autovere-1200x630.jpg`;
const DEFAULT_OG_ALT = "AUTOVERE — AI-Powered Car Intelligence";
const DEFAULT_OG_WIDTH = 1200;
const DEFAULT_OG_HEIGHT = 630;
const OG_LOCALE_BY_LANG: Record<(typeof SUPPORTED_LANGS)[number], string> = {
  en: "en_US",
  no: "nb_NO",
  de: "de_DE",
  sv: "sv_SE",
  fr: "fr_FR",
  pl: "pl_PL",
  it: "it_IT",
  es: "es_ES",
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

const setMultiMetaByProperty = (property: string, values: string[]) => {
  document.head.querySelectorAll(`meta[property="${property}"]`).forEach((n) => n.remove());
  values.forEach((value) => {
    const el = document.createElement("meta");
    el.setAttribute("property", property);
    el.setAttribute("content", value);
    document.head.appendChild(el);
  });
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

const toAbsoluteUrl = (url: string) => {
  try {
    return new URL(url, SITE).toString();
  } catch {
    return url;
  }
};

const normalizeCanonical = (url: string) => {
  try {
    const parsed = new URL(url, SITE);
    parsed.hash = "";
    parsed.search = "";
    if (parsed.origin === SITE && parsed.pathname !== "/") {
      parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    }
    return parsed.toString();
  } catch {
    return url;
  }
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

export const SEO = ({
  title,
  description,
  canonical,
  image,
  imageAlt = DEFAULT_OG_ALT,
  imageWidth,
  imageHeight,
  imageType,
  keywords,
  type = "website",
  jsonLd,
  noindex = false,
}: Props) => {
  const serializedJsonLd = useMemo(() => JSON.stringify(jsonLd ?? null), [jsonLd]);

  useEffect(() => {
    document.title = title.length > 60 ? title.slice(0, 57) + "…" : title;

    const desc = description.length > 160 ? description.slice(0, 157) + "…" : description;
    setMeta('meta[name="description"]', "content", desc);
    if (keywords) setMeta('meta[name="keywords"]', "content", keywords);
    setMeta(
      'meta[name="robots"]',
      "content",
      noindex ? "noindex, nofollow, noarchive" : "index, follow, max-image-preview:large",
    );
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:type"]', "content", type);
    setMeta('meta[property="og:site_name"]', "content", "AUTOVERE");
    const socialImage = toAbsoluteUrl(image || DEFAULT_OG_IMAGE);
    setMeta('meta[property="og:image"]', "content", socialImage);
    setMeta('meta[property="og:image:alt"]', "content", imageAlt);
    if (imageType || socialImage.endsWith(".jpg") || socialImage.endsWith(".jpeg")) {
      setMeta('meta[property="og:image:type"]', "content", imageType || "image/jpeg");
    }
    if (imageWidth || socialImage === DEFAULT_OG_IMAGE) {
      setMeta('meta[property="og:image:width"]', "content", String(imageWidth || DEFAULT_OG_WIDTH));
    }
    if (imageHeight || socialImage === DEFAULT_OG_IMAGE) {
      setMeta('meta[property="og:image:height"]', "content", String(imageHeight || DEFAULT_OG_HEIGHT));
    }

    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", desc);
    setMeta('meta[name="twitter:image"]', "content", socialImage);
    setMeta('meta[name="twitter:image:alt"]', "content", imageAlt);

    const path = typeof window !== "undefined" ? window.location.pathname : "/";
    const lang = detectLangFromPath(path);
    const canonicalUrl = normalizeCanonical(canonical || buildLocalized(path, lang));
    setLink("canonical", canonicalUrl);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[name="twitter:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:locale"]', "content", OG_LOCALE_BY_LANG[lang]);
    setMeta('meta[name="language"]', "content", lang);
    setMultiMetaByProperty(
      "og:locale:alternate",
      SUPPORTED_LANGS.filter((l) => l !== lang).map((l) => OG_LOCALE_BY_LANG[l]),
    );

    // hreflang for all supported languages + x-default
    document
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((n) => n.remove());
    SUPPORTED_LANGS.forEach((l) => setLink("alternate", buildLocalized(path, l), l));
    setLink("alternate", buildLocalized(path, DEFAULT_LANG), "x-default");

    document.querySelectorAll('script[data-seo-jsonld="true"]').forEach((n) => n.remove());
    if (serializedJsonLd !== "null") {
      const parsed = JSON.parse(serializedJsonLd) as JsonLd | JsonLd[];
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      arr.forEach((obj) => {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.dataset.seoJsonld = "true";
        s.text = JSON.stringify(obj);
        document.head.appendChild(s);
      });
    }
  }, [title, description, canonical, image, imageAlt, imageWidth, imageHeight, imageType, keywords, type, noindex, serializedJsonLd]);

  return null;
};
