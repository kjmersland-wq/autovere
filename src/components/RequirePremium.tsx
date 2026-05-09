import { ReactNode } from 'react';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LLink } from '@/i18n/routing';
import { usePremium } from '@/hooks/usePremium';

type RequirePremiumProps = {
  children: ReactNode;
  fallbackHeightClassName?: string;
};

export function RequirePremium({ children, fallbackHeightClassName = 'min-h-[320px]' }: RequirePremiumProps) {
  const { t } = useTranslation();
  const { isPremium, loading } = usePremium();

  if (loading) {
    return <div className={`rounded-3xl bg-secondary/30 animate-pulse ${fallbackHeightClassName}`} />;
  }

  if (isPremium) return <>{children}</>;

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-border/40 ${fallbackHeightClassName}`}>
      <div className="absolute inset-0 blur-sm pointer-events-none opacity-60 bg-gradient-glow" />
      <div className="absolute inset-0 backdrop-blur-sm bg-background/65" />
      <div className="relative z-10 p-8 md:p-10 text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
          <Lock className="w-5 h-5 text-white" />
        </div>
        <div className="text-xs uppercase tracking-[0.25em] text-accent flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          {t('premium.lock.eyebrow')}
        </div>
        <h3 className="text-2xl font-bold tracking-tight">{t('premium.lock.title')}</h3>
        <p className="text-muted-foreground max-w-lg">{t('premium.lock.body')}</p>
        <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 rounded-xl gap-2">
          <LLink to="/pricing">
            {t('premium.lock.cta')} <ArrowRight className="w-4 h-4" />
          </LLink>
        </Button>
      </div>
    </div>
  );
}

export function RequirePremiumRoute({ children }: { children: ReactNode }) {
  const { isPremium, loading } = usePremium();
  if (loading) return null;
  if (!isPremium) return <Navigate to="/pricing" replace />;
  return <>{children}</>;
}
