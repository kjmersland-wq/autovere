import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLink as Link, localizedPath } from "@/components/AppLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";
import { resetPasswordCopy } from "@/lib/login-i18n";

export const Route = createFileRoute("/{-$lang}/reset-password")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { locale } = useLocale();
  const copy = resetPasswordCopy[locale] ?? resetPasswordCopy.en;
  const [token] = useState(() => new URLSearchParams(window.location.search).get("token") ?? "");
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    if (password.length < 8) {
      setMessage(copy.errorWeak);
      return;
    }
    if (password !== confirm) {
      setMessage(copy.errorMismatch);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/login?action=reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, newPassword: password }) });
      if (!response.ok) throw new Error(copy.errorGeneric);
      setSuccess(true);
      setMessage(copy.success);
    } catch {
      setMessage(copy.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <main className="bg-scenic flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="panel w-full max-w-md p-6 text-center">
          <div className="flex justify-end">
            <LanguageSwitcher />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{copy.invalidLink}</p>
          <Link to="/forgot-password" className="mt-4 inline-block">
            <Button>{copy.requestNewLink}</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-scenic flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="panel w-full max-w-md p-6">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
        <h1 className="mt-2 text-3xl font-extrabold">{copy.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{copy.subtitle}</p>
        {!success ? (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold" htmlFor="password">
              {copy.passwordLabel}
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-foreground outline-none focus:border-primary/60"
              />
            </label>
            <label className="block text-sm font-semibold" htmlFor="confirm">
              {copy.confirmLabel}
              <input
                id="confirm"
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-foreground outline-none focus:border-primary/60"
              />
            </label>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? copy.submitting : copy.submitButton}
            </Button>
          </form>
        ) : (
          <Button className="mt-6 w-full" onClick={() => navigate({ to: localizedPath("/account", locale) as never })}>
            {copy.goToAccount}
          </Button>
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
