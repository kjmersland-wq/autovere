import { createFileRoute } from "@tanstack/react-router";

import { PricingTiers } from "@/components/PricingTiers";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/us/pricing")({
  head: () => ({
    meta: [
      { title: "Plans & Pricing — Free, Pro and Fleet | AutoVere USA" },
      {
        name: "description",
        content:
          "Start free with toll, express lane and gas estimates. Go Pro for a multi-vehicle garage, GPX export and live pass alerts, or pick Fleet for your whole crew.",
      },
      { property: "og:title", content: "AutoVere Plans & Pricing — USA" },
      {
        property: "og:description",
        content: "Free road trip cost intelligence, Pro for serious travelers, Fleet for teams.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/us/pricing" }],
  }),
  component: UsPricingPage,
});

function UsPricingPage() {
  return (
    <main className="min-h-screen">
      <SiteHeader region="us" />
      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Plans &amp; pricing</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Pick the plan that matches the road ahead.
        </h1>
        <p className="mt-4 max-w-2xl text-foreground/75">
          Every plan starts with honest numbers. Upgrade whenever you want a full garage, offline navigation and
          fleet-grade toll invoicing — and cancel any time the season winds down.
        </p>
        <div className="mt-12">
          <PricingTiers />
        </div>
      </section>
    </main>
  );
}
