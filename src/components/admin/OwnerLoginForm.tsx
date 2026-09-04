import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function OwnerLoginForm() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error: signInError } = await signInWithEmail(email.trim(), password);
    setBusy(false);
    if (signInError) setError("Feil e-post eller passord.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <form onSubmit={submit} className="glass-panel w-full max-w-sm space-y-4 rounded-2xl p-8">
        <h1 className="text-2xl font-semibold tracking-tight">AutoVere kontrollpanel</h1>
        <p className="text-sm text-foreground/60">Kun for eier og administratorer.</p>
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm"
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder="Passord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Logger inn…" : "Logg inn"}
        </Button>
      </form>
    </main>
  );
}
