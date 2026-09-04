import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function AdminPlaceholder() {
  const { signOut } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="glass-panel w-full max-w-sm space-y-4 rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">AutoVere kontrollpanel</h1>
        <p className="text-sm text-foreground/80">Innlogging vellykket.</p>
        <p className="text-sm text-foreground/80">Admin-tilgang bekreftet.</p>
        <Button variant="outline" className="w-full" onClick={() => void signOut()}>
          Logg ut
        </Button>
      </div>
    </main>
  );
}
