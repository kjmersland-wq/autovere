import { createFileRoute } from "@tanstack/react-router";

import { OwnerAdminApp } from "@/components/admin/OwnerAdminApp";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Trafikk, abonnementer og økonomi | AutoVere" },
      {
        name: "description",
        content:
          "Eierpanel for AutoVere med trafikk per land, abonnementsoversikt, trender og full økonomisk status.",
      },
      { property: "og:title", content: "Admin | AutoVere" },
      { property: "og:description", content: "Full oversikt over trafikk, marked og økonomi." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  return <OwnerAdminApp />;
}

