import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const text = await response.text();
      let data: { error?: string } = {};
      try { data = text ? JSON.parse(text) : {}; } catch { /* non-JSON response, e.g. a server error page */ }
      if (!response.ok) throw new Error(data.error || "Could not send the login email.");
      setMessage("Check your email for a secure AutoVere login link.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not send the login email."); }
    finally { setLoading(false); }
  }
  return <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground"><div className="panel w-full max-w-md p-6"><Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Back to planner</Link><h1 className="mt-8 text-3xl font-extrabold">Sign in to AutoVere</h1><p className="mt-3 text-sm text-muted-foreground">Enter the email used for your subscription. We will send a secure sign-in link.</p><form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-semibold" htmlFor="email">Email<input id="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-foreground outline-none focus:border-primary/60" /></label><Button type="submit" disabled={loading} className="w-full">{loading ? "Sending..." : "Send login link"}</Button></form>{message && <p className="mt-4 text-sm text-muted-foreground" role="status">{message}</p>}</div></main>;
}