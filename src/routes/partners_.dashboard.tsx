import { createFileRoute } from "@tanstack/react-router";
import { PartnerDashboard } from "@/components/PartnerDashboard";

export const Route = createFileRoute("/partners_/dashboard")({
  head: () => ({ meta: [{ title: "Partner Dashboard | AutoVere" }, { name: "description", content: "Secure AutoVere partner dashboard for codes, profile and aggregated programme results." }, { property: "og:title", content: "AutoVere Partner Dashboard" }, { property: "og:description", content: "Secure partner access for approved AutoVere organisations." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: PartnerDashboard,
});