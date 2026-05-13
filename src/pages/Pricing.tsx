import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Check, Sparkles, Heart, ArrowRight, ShieldCheck, Infinity as InfinityIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useSubscription } from "@/hooks/useSubscription";
import { useFormatPrice } from "@/lib/price";
import { toast } from "sonner";

const Pricing = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openCheckout, loading: checkoutLoading } = useStripeCheckout();
  const { isActive, subscription, userId, refetch } = useSubscription();
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [portalLoading, setPortalLoading] = useState(false);

  const FREE = t("pages.pricing.free_features", { returnObjects: true }) as string[];
  const PREMIUM = t("pages.pricing.premium_features", { returnObjects: true }) as string[];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      toast.success(t("pages.pricing.welcome_premium"));
      refetch();
    }
  }, [refetch, t]);

  const handleSubscribe = async () => {
    const priceId = interval === "month" ? "premium_monthly" : "premium_yearly";
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.info(t("pages.pricing.please_sign_in"));
      navigate("/auth");
      return;
    }
    await openCheckout({ priceId, customerEmail: user.email, userId: user.id });
  };

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error || !data?.url) throw new Error("Could not open portal");
      window.open(data.url, "_blank");
    } catch (e) {
      toast.error(t("pages.pricing.portal_error"));
    } finally {
      setPortalLoading(false);
    }
  };

  return (
  <PageShell>
    <SEO title={t("pages.pricing.seo_title")} description={t("pages.pricing.seo_desc")} type="website" />

    <section className="container pt-16 pb-12">
      <div className="max-w-3xl">
        <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.pricing.eyebrow")}</div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.05]">
          {t("pages.pricing.h1_a")} <span className="text-gradient">{t("pages.pricing.h1_b")}</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{t("pages.pricing.lead")}</p>
      </div>
    </section>

    <section className="container pb-20">
      <div className="grid lg:grid-cols-2 gap-6 items-stretch">
        <div className="glass rounded-3xl p-10 flex flex-col">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
            <Heart className="w-3.5 h-3.5" /> {t("pages.pricing.free_label")}
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-bold tracking-tighter">{t("pages.pricing.free_price")}</span>
            <span className="text-muted-foreground">{t("pages.pricing.free_per")}</span>
          </div>
          <p className="text-muted-foreground mb-8 leading-relaxed">{t("pages.pricing.free_lead")}</p>
          <ul className="space-y-3 mb-10 flex-1">
            {FREE.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="rounded-xl border-border/60 hover:bg-secondary/40">
            <Link to="/#advisor">{t("pages.pricing.free_cta")} <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>

        <div className="relative rounded-3xl p-10 flex flex-col overflow-hidden bg-gradient-glow border border-primary/30 shadow-glow">
          <div className="absolute top-6 right-6">
            <span className="text-[10px] font-medium px-3 py-1 rounded-full glass uppercase tracking-wider">
              {t("pages.pricing.recommended")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent mb-4">
            <Sparkles className="w-3.5 h-3.5" /> {t("pages.pricing.premium_label")}
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-5xl font-bold tracking-tighter text-gradient">
              {interval === "month" ? "€6.99" : "€59"}
            </span>
            <span className="text-muted-foreground">/ {interval}</span>
          </div>
          <div className="text-xs text-muted-foreground mb-4">
            {interval === "month" ? t("pages.pricing.yearly_save") : t("pages.pricing.billed_yearly")}
          </div>
          <div className="inline-flex p-1 rounded-full bg-secondary/40 border border-border/40 mb-6 self-start">
            {(["month", "year"] as const).map((i) => (
              <button
                key={i}
                onClick={() => setInterval(i)}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition ${
                  interval === i ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {i === "month" ? t("pages.pricing.monthly") : t("pages.pricing.yearly")}
              </button>
            ))}
          </div>
          <p className="text-muted-foreground mb-8 leading-relaxed">{t("pages.pricing.premium_lead")}</p>
          <ul className="space-y-3 mb-10 flex-1">
            {PREMIUM.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          {isActive ? (
            <div className="space-y-3">
              <div className="text-sm text-accent font-medium text-center">
                {t("pages.pricing.on_premium")}
                {subscription?.cancel_at_period_end && ` ${t("pages.pricing.cancels_at_end")}`}
              </div>
              <Button size="lg" variant="outline" onClick={openPortal} disabled={portalLoading} className="w-full rounded-xl">
                {portalLoading ? t("pages.pricing.opening") : t("pages.pricing.manage")}
              </Button>
            </div>
          ) : (
            <Button size="lg" onClick={handleSubscribe} disabled={checkoutLoading} className="bg-gradient-primary hover:opacity-90 rounded-xl gap-2">
              {checkoutLoading ? t("pages.pricing.opening_checkout") : (
                <>{userId ? t("pages.pricing.subscribe") : t("pages.pricing.sign_in_subscribe")} <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          )}
          <div className="text-[11px] text-muted-foreground mt-4 text-center">{t("pages.pricing.cancel_anytime")}</div>
        </div>
      </div>
    </section>

    <section className="container pb-24">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass rounded-3xl p-8">
          <ShieldCheck className="w-6 h-6 text-accent mb-4" />
          <h3 className="text-lg font-semibold tracking-tight mb-2">{t("pages.pricing.reassurance.t1")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("pages.pricing.reassurance.b1")}</p>
        </div>
        <div className="glass rounded-3xl p-8">
          <Heart className="w-6 h-6 text-accent mb-4" />
          <h3 className="text-lg font-semibold tracking-tight mb-2">{t("pages.pricing.reassurance.t2")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("pages.pricing.reassurance.b2")}</p>
        </div>
        <div className="glass rounded-3xl p-8">
          <InfinityIcon className="w-6 h-6 text-accent mb-4" />
          <h3 className="text-lg font-semibold tracking-tight mb-2">{t("pages.pricing.reassurance.t3")}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("pages.pricing.reassurance.b3")}</p>
        </div>
      </div>
    </section>

    <section className="container pb-32 max-w-3xl">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">{t("pages.pricing.faq_h")}</h2>
      <div className="space-y-6">
        {(["q1", "q2", "q3", "q4"] as const).map((k) => (
          <div key={k} className="glass rounded-2xl p-6">
            <div className="font-semibold mb-2">{t(`pages.pricing.faqs.${k}`)}</div>
            <div className="text-sm text-muted-foreground leading-relaxed">{t(`pages.pricing.faqs.${k.replace("q", "a")}`)}</div>
          </div>
        ))}
      </div>
    </section>
  </PageShell>
  );
};

export default Pricing;
