import { useEffect } from "react";

type Props = {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, any> | Record<string, any>[];
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

const setLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
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

    const url = canonical || (typeof window !== "undefined" ? window.location.href : "");
    if (url) {
      setLink("canonical", url);
      setMeta('meta[property="og:url"]', "content", url);
    }

    // JSON-LD
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
