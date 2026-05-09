import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { PageShell } from '@/components/PageShell';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { detectLangFromPath, localizePath } from '@/i18n/routing';
import type { Lang } from '@/i18n/config';

const getSafeNextPath = (search: string, lang: Lang): string => {
  const params = new URLSearchParams(search);
  const next = params.get('next');
  if (
    !next ||
    !next.startsWith('/') ||
    next.startsWith('//') ||
    next.includes('://') ||
    next.includes('\\')
  ) {
    return localizePath('/pricing', lang);
  }
  return localizePath(next, lang);
};

const Auth = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { t } = useTranslation();
  const lang = detectLangFromPath(pathname);
  const nextPath = useMemo(() => getSafeNextPath(search, lang), [search, lang]);

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(nextPath, { replace: true });
    });
  }, [navigate, nextPath]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fn =
      mode === 'signin'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}${nextPath}` },
          });

    const { error } = await fn;
    setLoading(false);

    if (error) return toast.error(error.message);
    toast.success(mode === 'signin' ? t('pages.auth.welcome_toast') : t('pages.auth.created_toast'));
    navigate(nextPath);
  };

  return (
    <PageShell>
      <SEO title={t('pages.auth.seo_title')} description={t('pages.auth.seo_desc')} type="website" noindex />
      <section className="container max-w-md py-24">
        <h1 className="text-4xl font-bold tracking-tighter mb-2">
          {mode === 'signin' ? t('pages.auth.welcome_back') : t('pages.auth.create_account')}
        </h1>
        <p className="text-muted-foreground mb-8">
          {mode === 'signin' ? t('pages.auth.lead_signin') : t('pages.auth.lead_signup')}
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">{t('pages.auth.email')}</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">{t('pages.auth.password')}</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
            {loading ? '…' : mode === 'signin' ? t('pages.auth.sign_in') : t('pages.auth.create')}
          </Button>
        </form>
        <button
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="text-sm text-muted-foreground mt-6 underline"
        >
          {mode === 'signin' ? t('pages.auth.need_account') : t('pages.auth.have_account')}
        </button>
      </section>
    </PageShell>
  );
};

export default Auth;
