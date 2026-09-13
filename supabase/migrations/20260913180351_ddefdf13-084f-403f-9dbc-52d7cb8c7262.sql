CREATE TABLE public.price_snapshots (
  snapshot_key text PRIMARY KEY,
  source text NOT NULL DEFAULT '',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.price_snapshots TO service_role;
ALTER TABLE public.price_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view price snapshots" ON public.price_snapshots FOR SELECT TO authenticated USING (public.is_admin());
CREATE TRIGGER price_snapshots_set_updated_at BEFORE UPDATE ON public.price_snapshots FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();