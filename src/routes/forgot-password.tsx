import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";
import { forgotPasswordCopy } from "@/lib/login-i18n";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPasswordPage });

function ForgotPasswordPage() {
  const { locale } = useLocale();
  const copy = forgotPasswordCopy[locale] ?? forgotPasswordCopy.en;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/login?action=forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = (await response.json().catch(() => ({}))) as { code?: string };
      if (!response.ok && data.code === "rate_limited") {
        setMessage(copy.errorRateLimited);
        return;
      }
      if (!response.ok && data.code === "invalid_email") {
        setMessage(copy.errorGeneric);
        return;
      }
      setSent(true);
      setMessage(copy.checkEmail);
    } catch {
      setMessage(copy.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-scenic bg-scenic--minimal flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="panel w-full max-w-md p-6">
        <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
          {copy.back}
        </Link>
        <h1 className="mt-8 text-3xl font-extrabold">{copy.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{copy.subtitle}</p>
        {!sent && (
          <form onSubmit={submit} className="mt-6 space-y-4">
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
      </div>
    </main>
  );
}
