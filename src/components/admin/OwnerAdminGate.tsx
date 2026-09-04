import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { checkAdminAccess, type AdminAccessResult } from "@/lib/admin-auth.functions";
import { OwnerLoginForm } from "@/components/admin/OwnerLoginForm";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

function StatusCard({ title, body, showLogout }: { title: string; body: string; showLogout: boolean }) {
  const { signOut } = useAuth();
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="glass-panel w-full max-w-sm space-y-4 rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">AutoVere kontrollpanel</h1>
        <p className="text-sm text-foreground/80">{title}</p>
        <p className="text-sm text-foreground/60">{body}</p>
        {showLogout && (
          <Button variant="outline" className="w-full" onClick={() => void signOut()}>
            Logg ut
          </Button>
        )}
      </div>
    </main>
  );
}

export function OwnerAdminGate() {
  const { user, loading: authLoading } = useAuth();
  const checkAccess = useServerFn(checkAdminAccess);
  const [result, setResult] = useState<AdminAccessResult | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!user) {
      setResult(null);
      return;
    }
    let alive = true;
    setChecking(true);
    void checkAccess()
      .then((r) => {
        if (alive) setResult(r);
      })
      .catch(() => {
        if (alive) setResult({ status: "error", message: "Uventet feil under autentisering." });
      })
      .finally(() => {
        if (alive) setChecking(false);
      });
    return () => {
      alive = false;
    };
  }, [user, checkAccess]);

  if (authLoading) {
    return <StatusCard title="Laster…" body="" showLogout={false} />;
  }

  if (!user) {
    return <OwnerLoginForm />;
  }

  if (checking || !result) {
    return <StatusCard title="Bekrefter admin-tilgang…" body="" showLogout={false} />;
  }

  if (result.status === "unauthenticated") {
    return <OwnerLoginForm />;
  }

  if (result.status === "unauthorized") {
    return (
      <StatusCard
        title="Ingen admin-tilgang"
        body="Denne kontoen er logget inn, men har ikke admin-rollen."
        showLogout
      />
    );
  }

  if (result.status === "error") {
    return <StatusCard title="Uventet feil" body={result.message} showLogout />;
  }

  return <AdminPlaceholder />;
}
