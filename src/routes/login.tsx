import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";
import { loginCopy } from "@/lib/login-i18n";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { locale } = useLocale();
  const copy = loginCopy[locale] ?? loginCopy.en;
  const navigate = useNavigate();
  const [mode, setMode] = useState<"password" | "magic-link">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitPassword(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = (await response.json().catch(() => ({}))) as { code?: string };
      if (!response.ok) {
        if (data.code === "rate_limited") setMessage(copy.errorRateLimited);
        else if (data.code === "invalid_credentials") setMessage(copy.errorInvalidCredentials);
        else setMessage(copy.errorGeneric);
        return;
      }
      navigate({ to: "/account" });
    } catch {
      setMessage(copy.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  async function submitMagicLink(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (!response.ok) throw new Error(copy.errorGeneric);
      setMessage(copy.checkEmail);
    } catch {
      setMessage(copy.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="panel w-full max-w-md p-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          {copy.back}
        </Link>
        <h1 className="mt-8 text-3xl font-extrabold">{copy.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{mode === "password" ? copy.subtitle : copy.magicLinkSubtitle}</p>

        {mode === "password" ? (
          <form onSubmit={submitPassword} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold" htmlFor="email">
              {copy.emailLabel}
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-foreground outline-none focus:border-primary/60"
              />
            </label>
            <label className="block text-sm font-semibold" htmlFor="password">
              {copy.passwordLabel}
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-foreground outline-none focus:border-primary/60"
              />
            </label>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground">
                {copy.forgotPassword}
              </Link>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? copy.loggingIn : copy.loginButton}
            </Button>
          </form>
        ) : (
          <form onSubmit={submitMagicLink} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold" htmlFor="magic-email">
              {copy.emailLabel}
              <input
                id="magic-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-foreground outline-none focus:border-primary/60"
              />
            </label>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? copy.sending : copy.sendButton}
            </Button>
          </form>
        )}

        {message && (
          <p className="mt-4 text-sm text-muted-foreground" role="status">
            {message}
          </p>
        )}

        <div className="mt-6 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          {copy.orDivider}
          <span className="h-px flex-1 bg-border" />
        </div>
        <button
          type="button"
          onClick={() => {
            setMode(mode === "password" ? "magic-link" : "password");
            setMessage("");
          }}
          className="mt-4 w-full text-center text-sm font-semibold text-primary hover:underline"
        >
          {mode === "password" ? copy.useMagicLinkInstead : copy.usePasswordInstead}
        </button>
      </div>
    </main>
  );
}
