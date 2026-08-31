import { Lock, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

/**
 * Staging protection banner for the Canadian routes (/ca).
 * Content stays visible, but the banner asks for owner sign-in first.
 */
export function StagingBanner({ label = "🇨🇦 Canada — staging preview" }: { label?: string }) {
  const { user, openAuth, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return (
      <div className="border-b border-primary/30 bg-primary/10">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-5 py-2 text-xs font-medium text-primary sm:px-8">
          <ShieldCheck className="size-4" /> {label} — signed in as {user.email}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-amber-400/30 bg-amber-400/10">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-5 py-2.5 sm:px-8">
        <Lock className="size-4 text-amber-300" />
        <p className="text-xs font-medium text-amber-100/90">
          {label} · protected content. Sign in for owner access to full Canadian toll data and saved trips.
        </p>
        <Button size="sm" className="ml-auto h-7 text-xs" onClick={() => openAuth("signin")}>
          Sign in for access
        </Button>
      </div>
    </div>
  );
}
