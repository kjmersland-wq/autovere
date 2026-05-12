import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle, Mail } from "lucide-react";

type Mode = "signin" | "signup" | "reset";

const Auth = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/pricing", { replace: true });
    });
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      setResetSent(true);
      return;
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/pricing` },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      setVerifyEmail(email);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success(t("pages.auth.welcome_toast"));
    navigate("/pricing");
  };

  // Email verification confirmation screen
  if (verifyEmail) {
    return (
      <PageShell>
        <SEO title={t("pages.auth.seo_title")} description={t("pages.auth.seo_desc")} type="website" />
        <section className="container max-w-md py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter mb-3">
            {t("pages.auth.check_email_title")}
          </h1>
          <p className="text-muted-foreground mb-3 leading-relaxed">
            {t("pages.auth.check_email_lead", { email: verifyEmail })}
          </p>
          <p className="text-sm text-muted-foreground/70">
            {t("pages.auth.check_email_note")}
          </p>
        </section>
      </PageShell>
    );
  }

  // Password reset sent confirmation screen
  if (resetSent) {
    return (
      <PageShell>
        <SEO title={t("pages.auth.seo_title")} description={t("pages.auth.seo_desc")} type="website" />
        <section className="container max-w-md py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter mb-3">
            {t("pages.auth.reset_sent")}
          </h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {t("pages.auth.reset_sent_lead", { email })}
          </p>
          <button
            onClick={() => { setMode("signin"); setResetSent(false); }}
            className="text-sm text-accent hover:underline"
          >
            ← {t("pages.auth.back_to_signin")}
          </button>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SEO title={t("pages.auth.seo_title")} description={t("pages.auth.seo_desc")} type="website" />
      <section className="container max-w-md py-24">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">
          {mode === "signin"
            ? t("pages.auth.welcome_back")
            : mode === "signup"
            ? t("pages.auth.create_account")
            : t("pages.auth.reset_password")}
        </h1>
        <p className="text-muted-foreground mb-8">
          {mode === "signin"
            ? t("pages.auth.lead_signin")
            : mode === "signup"
            ? t("pages.auth.lead_signup")
            : t("pages.auth.reset_lead")}
        </p>

        <form onSubmit={onSubmit} className="space-y-4" aria-label={mode === "signin" ? t("pages.auth.sign_in") : mode === "signup" ? t("pages.auth.create") : t("pages.auth.reset_password")}>
          <div>
            <Label htmlFor="auth-email">{t("pages.auth.email")}</Label>
            <Input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {mode !== "reset" && (
            <div>
              <Label htmlFor="auth-password">{t("pages.auth.password")}</Label>
              <Input
                id="auth-password"
                type="password"
                required
                minLength={8}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                aria-describedby={mode === "signup" ? "pw-hint" : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {mode === "signup" && (
                <p id="pw-hint" className="text-[11px] text-muted-foreground mt-1">
                  Minimum 8 characters
                </p>
              )}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
            {loading
              ? "…"
              : mode === "signin"
              ? t("pages.auth.sign_in")
              : mode === "signup"
              ? t("pages.auth.create")
              : t("pages.auth.reset_password")}
          </Button>
        </form>

        <div className="mt-6 space-y-2 text-sm">
          {mode === "signin" && (
            <>
              <button
                onClick={() => setMode("signup")}
                className="block text-muted-foreground underline"
              >
                {t("pages.auth.need_account")}
              </button>
              <button
                onClick={() => setMode("reset")}
                className="block text-muted-foreground underline"
              >
                {t("pages.auth.forgot_password")}
              </button>
            </>
          )}
          {mode === "signup" && (
            <button
              onClick={() => setMode("signin")}
              className="block text-muted-foreground underline"
            >
              {t("pages.auth.have_account")}
            </button>
          )}
          {mode === "reset" && (
            <button
              onClick={() => setMode("signin")}
              className="block text-muted-foreground underline"
            >
              ← {t("pages.auth.back_to_signin")}
            </button>
          )}
        </div>
      </section>
    </PageShell>
  );
};

export default Auth;
