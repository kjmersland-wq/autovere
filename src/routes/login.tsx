import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";
import { loginCopy } from "@/lib/login-i18n";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { locale } = useLocale();
  const copy = loginCopy[locale] ?? loginCopy.en;
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
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
        <p className="mt-3 text-sm text-muted-foreground">{copy.subtitle}</p>
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
        {message && (
          <p className="mt-4 text-sm text-muted-foreground" role="status">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
