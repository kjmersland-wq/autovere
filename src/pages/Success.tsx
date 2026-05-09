import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import { PageShell } from '@/components/PageShell';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { localizePath, useLang } from '@/i18n/routing';

const Success = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = useLang();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const redirect = window.setTimeout(() => {
      navigate(localizePath('/', lang), { replace: true });
    }, 5000);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(redirect);
    };
  }, [navigate, lang]);

  return (
    <PageShell>
      <SEO
        title={t('pages.pricing.welcome_premium')}
        description={t('pages.pricing.welcome_premium')}
        type="website"
      />

      <section className="container max-w-2xl py-24">
        <div className="glass rounded-3xl p-10 text-center">
          <CheckCircle2 className="w-14 h-14 mx-auto mb-6 text-accent" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-gradient">
            {t('pages.pricing.welcome_premium')}
          </h1>
          <p className="text-muted-foreground mb-8">{t('pages.pricing.success_redirecting', { seconds })}</p>
          <Button onClick={() => navigate(localizePath('/', lang))} className="rounded-xl bg-gradient-primary">
            {t('pages.pricing.success_go_home')}
          </Button>
        </div>
      </section>
    </PageShell>
  );
};

export default Success;
