import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { OwnerLoginGate } from "@/components/admin/OwnerLoginGate";

export function OwnerAdminApp() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();

  if (authLoading) {
    return <main className="flex min-h-screen items-center justify-center text-foreground/60">Laster…</main>;
  }

  if (!user) {
    return <OwnerLoginGate />;
  }

  if (adminLoading) {
    return <main className="flex min-h-screen items-center justify-center text-foreground/60">Laster…</main>;
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-16">
        <div className="glass-panel max-w-sm rounded-2xl p-8 text-center">
          <p className="text-sm text-foreground/80">
            Denne siden er forbeholdt eier av AutoVere. Kontoen din har ikke admin-tilgang.
          </p>
        </div>
      </main>
    );
  }

  return <AdminShell />;
}
