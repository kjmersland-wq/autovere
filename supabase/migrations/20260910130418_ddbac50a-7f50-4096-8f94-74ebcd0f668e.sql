CREATE TYPE public.partner_application_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.partner_status AS ENUM ('active', 'suspended');
CREATE TYPE public.partner_user_role AS ENUM ('owner', 'manager');
CREATE TYPE public.partner_event_type AS ENUM ('link_click', 'signup', 'conversion');

CREATE TABLE public.partner_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_name text NOT NULL,
  country text NOT NULL,
  website text,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  description text,
  locale text NOT NULL DEFAULT 'en',
  status public.partner_application_status NOT NULL DEFAULT 'pending',
  reviewed_by uuid,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.partner_applications TO authenticated;
GRANT ALL ON public.partner_applications TO service_role;
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view partner applications" ON public.partner_applications FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update partner applications" ON public.partner_applications FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE UNIQUE INDEX partner_applications_pending_email_idx ON public.partner_applications (lower(contact_email)) WHERE status = 'pending';
CREATE TRIGGER partner_applications_set_updated_at BEFORE UPDATE ON public.partner_applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid UNIQUE REFERENCES public.partner_applications(id) ON DELETE SET NULL,
  organisation_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  country text NOT NULL,
  website text,
  logo_url text,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  status public.partner_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.partners TO authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER partners_set_updated_at BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.partner_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role public.partner_user_role NOT NULL DEFAULT 'owner',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (partner_id, user_id)
);
GRANT SELECT ON public.partner_users TO authenticated;
GRANT ALL ON public.partner_users TO service_role;
ALTER TABLE public.partner_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own partner access" ON public.partner_users FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_partner_access(_partner_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.partner_users
    WHERE partner_id = _partner_id AND user_id = auth.uid()
  )
$$;
GRANT EXECUTE ON FUNCTION public.has_partner_access(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_partner_access(uuid) TO service_role;

CREATE POLICY "Partner users can view own profile" ON public.partners FOR SELECT TO authenticated USING (public.has_partner_access(id) OR public.is_admin());
CREATE POLICY "Partner owners can update own profile" ON public.partners FOR UPDATE TO authenticated USING (public.has_partner_access(id) OR public.is_admin()) WITH CHECK (public.has_partner_access(id) OR public.is_admin());

CREATE TABLE public.partner_access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  email text NOT NULL,
  code_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  used_by uuid,
  disabled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.partner_access_codes TO authenticated;
GRANT ALL ON public.partner_access_codes TO service_role;
ALTER TABLE public.partner_access_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view partner access codes" ON public.partner_access_codes FOR SELECT TO authenticated USING (public.is_admin());

CREATE TABLE public.partner_referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  discount_percent integer NOT NULL DEFAULT 25 CHECK (discount_percent BETWEEN 1 AND 100),
  active boolean NOT NULL DEFAULT true,
  redemption_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.partner_referral_codes TO authenticated;
GRANT ALL ON public.partner_referral_codes TO service_role;
ALTER TABLE public.partner_referral_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partner users can view own referral codes" ON public.partner_referral_codes FOR SELECT TO authenticated USING (public.has_partner_access(partner_id) OR public.is_admin());
CREATE TRIGGER partner_referral_codes_set_updated_at BEFORE UPDATE ON public.partner_referral_codes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.partner_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  referral_code_id uuid NOT NULL REFERENCES public.partner_referral_codes(id) ON DELETE CASCADE,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referral_code_id, user_id)
);
GRANT SELECT ON public.partner_redemptions TO authenticated;
GRANT ALL ON public.partner_redemptions TO service_role;
ALTER TABLE public.partner_redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view partner redemptions" ON public.partner_redemptions FOR SELECT TO authenticated USING (public.is_admin());

CREATE TABLE public.partner_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  referral_code_id uuid REFERENCES public.partner_referral_codes(id) ON DELETE SET NULL,
  event_type public.partner_event_type NOT NULL,
  visitor_id text,
  session_id text,
  path text,
  locale text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.partner_events TO authenticated;
GRANT ALL ON public.partner_events TO service_role;
ALTER TABLE public.partner_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partner users can view own aggregate event rows" ON public.partner_events FOR SELECT TO authenticated USING (public.has_partner_access(partner_id) OR public.is_admin());
CREATE INDEX partner_events_partner_created_idx ON public.partner_events(partner_id, created_at DESC);

CREATE TABLE public.poi_corridor_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text NOT NULL UNIQUE,
  source text NOT NULL DEFAULT 'openstreetmap',
  categories text[] NOT NULL DEFAULT '{}',
  payload jsonb NOT NULL DEFAULT '[]'::jsonb,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.poi_corridor_cache TO service_role;
ALTER TABLE public.poi_corridor_cache ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER poi_corridor_cache_set_updated_at BEFORE UPDATE ON public.poi_corridor_cache FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.activate_partner_access(_code_hash text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  access_row public.partner_access_codes%ROWTYPE;
  current_email text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'authentication_required'; END IF;
  SELECT lower(email) INTO current_email FROM auth.users WHERE id = auth.uid();
  SELECT * INTO access_row FROM public.partner_access_codes
  WHERE code_hash = _code_hash
    AND used_at IS NULL
    AND disabled_at IS NULL
    AND expires_at > now()
  FOR UPDATE;
  IF access_row.id IS NULL THEN RAISE EXCEPTION 'invalid_or_expired_code'; END IF;
  IF current_email IS NULL OR current_email <> lower(access_row.email) THEN RAISE EXCEPTION 'email_mismatch'; END IF;
  INSERT INTO public.partner_users(partner_id, user_id, role)
  VALUES (access_row.partner_id, auth.uid(), 'owner')
  ON CONFLICT (partner_id, user_id) DO NOTHING;
  UPDATE public.partner_access_codes SET used_at = now(), used_by = auth.uid() WHERE id = access_row.id;
  RETURN access_row.partner_id;
END;
$$;
REVOKE ALL ON FUNCTION public.activate_partner_access(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.activate_partner_access(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.activate_partner_access(text) TO service_role;

CREATE OR REPLACE FUNCTION public.redeem_partner_referral(_code text)
RETURNS TABLE(partner_id uuid, discount_percent integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code_row public.partner_referral_codes%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'authentication_required'; END IF;
  SELECT * INTO code_row FROM public.partner_referral_codes
  WHERE upper(code) = upper(trim(_code)) AND active = true
  FOR UPDATE;
  IF code_row.id IS NULL THEN RAISE EXCEPTION 'invalid_code'; END IF;
  INSERT INTO public.partner_redemptions(partner_id, referral_code_id, user_id)
  VALUES (code_row.partner_id, code_row.id, auth.uid())
  ON CONFLICT (referral_code_id, user_id) DO NOTHING;
  IF FOUND THEN
    UPDATE public.partner_referral_codes SET redemption_count = redemption_count + 1 WHERE id = code_row.id;
    INSERT INTO public.partner_events(partner_id, referral_code_id, event_type, path)
    VALUES (code_row.partner_id, code_row.id, 'conversion', '/partners/redeem');
  END IF;
  RETURN QUERY SELECT code_row.partner_id, code_row.discount_percent;
END;
$$;
REVOKE ALL ON FUNCTION public.redeem_partner_referral(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.redeem_partner_referral(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_partner_referral(text) TO service_role;