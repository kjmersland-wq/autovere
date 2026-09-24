import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth";
import { useTr } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-4" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.5 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.2 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.4-4.7 7l7.3 5.7c4.3-3.9 7.1-9.8 7.1-17.2z" />
      <path fill="#FBBC05" d="M10.4 28.7a14.4 14.4 0 0 1 0-9.4l-7.8-6.1a24 24 0 0 0 0 21.6l7.8-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2 1.4-4.7 2.3-8.6 2.3-6.4 0-11.7-3.7-13.6-9.1l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

export function AuthModal() {
  const {
    authOpen,
    closeAuth,
    authMode,
    setAuthMode,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const tr = useTr();

  const isSignup = authMode === "signup";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || password.length < 6) {
      toast.error(tr("Enter your email and a password of at least 6 characters."));
      return;
    }
    setBusy(true);
    const { error } = isSignup
      ? await signUpWithEmail(email.trim(), password)
      : await signInWithEmail(email.trim(), password);
    setBusy(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(
      tr(isSignup ? "Welcome aboard — check your inbox to confirm your email." : "Welcome back — the road is ready."),
    );
    setPassword("");
  };

  const google = async () => {
    setBusy(true);
    const { error } = await signInWithGoogle();
    setBusy(false);
    if (error) toast.error(error);
  };

  return (
    <Dialog open={authOpen} onOpenChange={(open) => !open && closeAuth()}>
      <DialogContent className="glass-panel sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl tracking-tight">
            {tr(isSignup ? "Start your AutoVere account" : "Welcome back to AutoVere")}
          </DialogTitle>
          <DialogDescription>
            {tr(
              isSignup
                ? "Save your vehicles, trips and toll tags across every device."
                : "Sign in to reach your garage, saved adventures and Pro features.",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-1 grid grid-cols-2 gap-1 rounded-full border border-border bg-background/50 p-1">
          {(["signin", "signup"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setAuthMode(mode)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                authMode === mode
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70 hover:text-foreground",
              )}
            >
              {tr(mode === "signin" ? "Sign in" : "Create account")}
            </button>
          ))}
        </div>

        <Button type="button" variant="outline" onClick={google} disabled={busy} className="w-full gap-2">
          <GoogleMark /> {tr("Continue with Google")}
        </Button>

        <div className="flex items-center gap-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> {tr("or email")} <span className="h-px flex-1 bg-border" />
        </div>

        <form className="grid gap-4" onSubmit={submit}>
          <div className="grid gap-2">
            <Label htmlFor="auth-email">{tr("Email")}</Label>
            <Input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="auth-password">{tr("Password")}</Label>
            <Input
              id="auth-password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder={tr("At least 6 characters")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full">
            {busy && <Loader2 className="size-4 animate-spin" />}
            {tr(isSignup ? "Create my account" : "Sign in")}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground">
          {tr("By continuing you agree to our terms and privacy notice. We never sell your route data.")}
        </p>
      </DialogContent>
    </Dialog>
  );
}
