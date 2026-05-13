import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface SeoProps {
  title: string;
  description: string;
  path: string; // app-relative path, e.g. "/ev/database"
  type?: "website" | "article";
  image?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE = "https://www.autovere.com";
const BRAND = "AUTOVERE";

/**
 * Per-route SEO head. Renders <title>, meta description, canonical,
 * Open Graph and optional JSON-LD. Title is automatically suffixed
 * with the brand name unless it already contains it.
 */
export const Seo = ({
  title,
  description,
  path,
  type = "website",
  image,
  noindex,
  jsonLd,
}: SeoProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("no") ? "no" : "en";
  const fullTitle = title.includes(BRAND) ? title : `${title} — ${BRAND}`;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${SITE}${cleanPath === "/" ? "/" : cleanPath}`;
  const jsonLdArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={lang === "no" ? "nb_NO" : "en_US"} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {jsonLdArray.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};
