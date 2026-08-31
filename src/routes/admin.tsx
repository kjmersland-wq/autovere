import { createFileRoute } from "@tanstack/react-router";

import { AdminDashboard } from "@/components/AdminDashboard";
import { SiteHeader } from "@/components/SiteHeader";
import { useAdmin } from "@/hooks/useAdmin";

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
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <main className="min-h-screen">
        <SiteHeader />
        <p className="mx-auto max-w-6xl px-5 py-20 text-sm text-muted-foreground sm:px-8">Laster admin…</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen">
        <SiteHeader />
        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <h1 className="text-3xl font-semibold tracking-tight">Ingen tilgang</h1>
          <p className="mt-3 text-foreground/75">Denne siden er forbeholdt eieren av AutoVere.</p>
        </section>
      </main>
    );
  }

  return <AdminDashboard />;
}
