import { createFileRoute } from "@tanstack/react-router";

import { PricingTiers } from "@/components/PricingTiers";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Plans & Pricing — Free, Pro and Fleet | AutoVere" },
      {
        name: "description",
        content:
          "Start free with toll, vignette and fuel estimates. Go Pro at €4.99/mo for multi-vehicle garage, GPX export and live pass alerts, or Fleet at €19/mo.",
      },
      { property: "og:title", content: "AutoVere Plans & Pricing" },
      {
        property: "og:description",
        content: "Free road trip cost intelligence, Pro at €4.99/mo, Business/Fleet at €19/mo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Plans &amp; pricing</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Pick the plan that matches your road ahead.
        </h1>
        <p className="mt-4 max-w-2xl text-foreground/75">
          Every plan starts with honest numbers. Upgrade when you want a full garage, offline navigation and
          fleet-grade toll invoicing — cancel whenever the season ends.
        </p>
        <div className="mt-12">
          <PricingTiers />
        </div>
      </section>
    </main>
  );
}
