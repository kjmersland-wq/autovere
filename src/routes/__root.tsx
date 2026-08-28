import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { I18nProvider, useLocale } from "../lib/i18n";
import { applyLocalizedSeo, applicationSchema, seoAlternates, seoCopy, siteUrl } from "../lib/seo";
import { registerServiceWorker } from "../lib/pwa";
import { Toaster } from "../components/ui/sonner";
import { PartnerProvider, usePartner } from "../lib/partner-context";
import { partnerCopy } from "../lib/partner-i18n";
import { PartnerHeader } from "../components/partner/PartnerHeader";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { title: "AutoVere — European Toll & Route Planner" },
      {
        name: "description",
        content: "Calculate accurate road tolls, required vignettes, and EV charging costs across Europe.",
      },
      { name: "keywords", content: seoCopy.en.keywords },
      { name: "author", content: "AutoVere" },
      { name: "theme-color", content: "#0b1220" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "AutoVere" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { property: "og:title", content: "AutoVere — European Toll & Route Planner" },
      {
        property: "og:description",
        content: "Calculate accurate road tolls, required vignettes, and EV charging costs across Europe.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "AutoVere" },
      { property: "og:locale", content: "en_GB" },
      ...seoAlternates.map((alternate) => ({ property: "og:locale:alternate", content: alternate.locale })),
      { property: "og:image", content: "https://www.autovere.com/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:url", content: "https://www.autovere.com" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AutoVere — European Toll & Route Planner" },
      { name: "twitter:description", content: "Calculate accurate road tolls, required vignettes, and EV charging costs across Europe." },
      { name: "twitter:image", content: "https://www.autovere.com/og-image.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/icons/icon-192.png" },
      { rel: "canonical", href: siteUrl },
      ...seoAlternates.map((alternate) => ({
        rel: "alternate",
        hrefLang: alternate.lang,
        href: `${siteUrl}/?lang=${alternate.path}`,
      })),
      { rel: "alternate", hrefLang: "x-default", href: siteUrl },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(applicationSchema()) }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <PartnerProvider>
          <LocalizedSeo />
          <PartnerBar />
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          <Toaster position="top-center" />
        </PartnerProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

function LocalizedSeo() {
  const { locale } = useLocale();

  useEffect(() => {
    applyLocalizedSeo(locale);
  }, [locale]);

  return null;
}

function PartnerBar() {
  const partner = usePartner();
  const { locale } = useLocale();
  if (!partner) return null;
  const copy = partnerCopy[locale] ?? partnerCopy.en;
  return <PartnerHeader name={partner.name} logo={partner.logo ?? ""} website={partner.website} visitLabel={copy.header.visitWebsite} partnerLabel={copy.header.partnerLabel} />;
}

