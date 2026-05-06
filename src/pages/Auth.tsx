import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/pricing", { replace: true });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fn = mode === "signin"
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/pricing` },
        });
    const { error } = await fn;
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(mode === "signin" ? "Welcome back." : "Account created.");
    navigate("/pricing");
  };

  return (
    <PageShell>
      <SEO title="Sign in — AutoVere" description="Sign in to your AutoVere account." type="website" />
      <section className="container max-w-md py-24">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">
          {mode === "signin" ? "Welcome back." : "Create your account."}
        </h1>
        <p className="text-muted-foreground mb-8">
          {mode === "signin" ? "Sign in to manage your AutoVere Premium." : "Start with AutoVere Premium."}
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="text-sm text-muted-foreground mt-6 underline"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </section>
    </PageShell>
  );
};

export default Auth;
