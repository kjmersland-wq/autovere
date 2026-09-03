import { createFileRoute } from "@tanstack/react-router";

import { AdminDashboard } from "@/components/AdminDashboard";


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
  // The dashboard renders immediately; the metrics themselves are still
  // fetched through the server-side owner check, so non-owners simply see
  // no figures instead of a hard block screen.
  return <AdminDashboard />;
}

