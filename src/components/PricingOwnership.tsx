import { Banknote, Wrench, Battery, Shield, TrendingUp, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Car } from "@/data/cars";
import { useLoc, loc } from "@/lib/loc";

const ownershipFor = (car: Car, lang: "en" | "no", t: (k: string) => string) => {
  const tagStr = loc(car.tag, "en").toLowerCase();
  const climateStr = loc(car.climate, "en").toLowerCase();
  const tier =
    car.score >= 94 ? t("pages.car.po.tier_top") :
    car.score >= 88 ? t("pages.car.po.tier_premium") :
    t("pages.car.po.tier_mid");
  const stress =
    tagStr.includes("winter") || climateStr.includes("excellent")
      ? t("pages.car.po.stress_low")
      : t("pages.car.po.stress_avg");
  const value =
    car.score >= 94
      ? t("pages.car.po.value_strong")
      : t("pages.car.po.value_fair");
  const charging = car.range
    ? t("pages.car.po.charging_home")
    : "—";
  const typeStr = loc(car.type, "en").toLowerCase();
  const insurance = typeStr.includes("performance")
    ? t("pages.car.po.ins_higher")
    : t("pages.car.po.ins_standard");
  const resale = car.score >= 94
    ? t("pages.car.po.resale_well")
    : t("pages.car.po.resale_gentle");
  return { tier, stress, value, charging, insurance, resale };
};

export const PricingOwnership = ({ car }: { car: Car }) => {
  const { t } = useTranslation();
  const { l, lang } = useLoc();
  const o = ownershipFor(car, lang, t);

  return (
    <section className="container pb-24">
      <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.car.po.eyebrow")}</div>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10 leading-tight max-w-3xl">
        {t("pages.car.po.h", { name: car.name })}
      </h2>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
        <div className="glass rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent mb-4">
              <Banknote className="w-3.5 h-3.5" /> {t("pages.car.po.estimated")}
            </div>
            <div className="text-5xl md:text-6xl font-bold tracking-tighter mb-2">
              {l(car.startingPrice) || "—"}
            </div>
            <div className="text-sm text-muted-foreground mb-6">
              {t("pages.car.po.starting_meta")}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{t("pages.car.po.positioning")}</div>
                <div className="font-medium">{o.tier}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{t("pages.car.po.stress")}</div>
                <div className="font-medium">{o.stress}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{t("pages.car.po.insurance")}</div>
                <div className="font-medium">{o.insurance}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">{t("pages.car.po.resale")}</div>
                <div className="font-medium">{o.resale}</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/40 text-[11px] text-muted-foreground leading-relaxed">
              {t("pages.car.po.disclaimer")}
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent">
            <Sparkles className="w-3.5 h-3.5" /> {t("pages.car.po.ai_value")}
          </div>
          <p className="text-xl leading-relaxed">
            <span className="text-foreground font-medium">{o.value}</span>
          </p>

          <div className="grid sm:grid-cols-2 gap-5 pt-2">
            <div className="flex gap-3">
              <Battery className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold mb-1">{t("pages.car.po.charging_t")}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{o.charging}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Wrench className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold mb-1">{t("pages.car.po.maint_t")}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {t("pages.car.po.maint_b")}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold mb-1">{t("pages.car.po.long_t")}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {t("pages.car.po.long_b")}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <TrendingUp className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold mb-1">{t("pages.car.po.ratio_t")}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {t("pages.car.po.ratio_b")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
