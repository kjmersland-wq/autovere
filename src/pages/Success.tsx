import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageShell } from '@/components/PageShell';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { LLink, detectLangFromPath, localizePath } from '@/i18n/routing';

const REDIRECT_SECONDS = 5;
const PREMIUM_FEATURE_COUNT = 8;

const Success = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const lang = detectLangFromPath(pathname);
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  const homePath = localizePath('/', lang);

  useEffect(() => {
    if (countdown <= 0) {
      navigate(homePath, { replace: true });
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, homePath, navigate]);

  const premiumFeatures = t('pages.pricing.premium_features', {
    returnObjects: true,
  }) as string[];

  const features = Array.isArray(premiumFeatures)
    ? premiumFeatures.slice(0, PREMIUM_FEATURE_COUNT)
    : [];

  return (
    <PageShell>
      <SEO
        title={t('pages.success.seo_title')}
        description={t('pages.success.seo_desc')}
        type="website"
      />

      <section className="container pt-24 pb-32 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-8 shadow-glow">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.05]">
          {t('pages.success.heading_a')}{' '}
          <span className="text-gradient">{t('pages.success.heading_b')}</span>
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-12">
          {t('pages.success.lead')}
        </p>

        {features.length > 0 && (
          <div className="glass rounded-3xl p-8 mb-12 max-w-md w-full text-left">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">
              {t('pages.success.features_heading')}
            </p>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-gradient-primary hover:opacity-90 rounded-xl gap-2"
          >
            <LLink to="/">
              {t('pages.success.redirect_cta')} <ArrowRight className="w-4 h-4" />
            </LLink>
          </Button>

          <p className="text-sm text-muted-foreground">
            {t('pages.success.redirect_auto', { count: countdown })}
          </p>
        </div>
      </section>
    </PageShell>
  );
};

export default Success;
