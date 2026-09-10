CREATE POLICY "Admins can view POI cache" ON public.poi_corridor_cache FOR SELECT TO authenticated USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.has_partner_access(_partner_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.partner_users
    WHERE partner_id = _partner_id AND user_id = auth.uid()
  )
$$;
REVOKE ALL ON FUNCTION public.has_partner_access(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_partner_access(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_partner_access(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_partner_access(uuid) TO service_role;

REVOKE ALL ON FUNCTION public.activate_partner_access(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.activate_partner_access(text) FROM anon;
REVOKE ALL ON FUNCTION public.activate_partner_access(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.activate_partner_access(text) TO service_role;

REVOKE ALL ON FUNCTION public.redeem_partner_referral(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.redeem_partner_referral(text) FROM anon;
REVOKE ALL ON FUNCTION public.redeem_partner_referral(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_partner_referral(text) TO service_role;

CREATE OR REPLACE FUNCTION public.activate_partner_access_for_user(_code_hash text, _user_id uuid, _email text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  access_row public.partner_access_codes%ROWTYPE;
BEGIN
  SELECT * INTO access_row FROM public.partner_access_codes
  WHERE code_hash = _code_hash
    AND used_at IS NULL
    AND disabled_at IS NULL
    AND expires_at > now()
  FOR UPDATE;
  IF access_row.id IS NULL THEN RAISE EXCEPTION 'invalid_or_expired_code'; END IF;
  IF lower(trim(_email)) <> lower(access_row.email) THEN RAISE EXCEPTION 'email_mismatch'; END IF;
  INSERT INTO public.partner_users(partner_id, user_id, role)
  VALUES (access_row.partner_id, _user_id, 'owner')
  ON CONFLICT (partner_id, user_id) DO NOTHING;
  UPDATE public.partner_access_codes SET used_at = now(), used_by = _user_id WHERE id = access_row.id;
  RETURN access_row.partner_id;
END;
$$;
REVOKE ALL ON FUNCTION public.activate_partner_access_for_user(text, uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.activate_partner_access_for_user(text, uuid, text) FROM anon;
REVOKE ALL ON FUNCTION public.activate_partner_access_for_user(text, uuid, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.activate_partner_access_for_user(text, uuid, text) TO service_role;

CREATE OR REPLACE FUNCTION public.redeem_partner_referral_for_user(_code text, _user_id uuid)
RETURNS TABLE(partner_id uuid, discount_percent integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code_row public.partner_referral_codes%ROWTYPE;
  inserted_count integer;
BEGIN
  SELECT * INTO code_row FROM public.partner_referral_codes
  WHERE upper(code) = upper(trim(_code)) AND active = true
  FOR UPDATE;
  IF code_row.id IS NULL THEN RAISE EXCEPTION 'invalid_code'; END IF;
  INSERT INTO public.partner_redemptions(partner_id, referral_code_id, user_id)
  VALUES (code_row.partner_id, code_row.id, _user_id)
  ON CONFLICT (referral_code_id, user_id) DO NOTHING;
  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  IF inserted_count > 0 THEN
    UPDATE public.partner_referral_codes SET redemption_count = redemption_count + 1 WHERE id = code_row.id;
    INSERT INTO public.partner_events(partner_id, referral_code_id, event_type, path)
    VALUES (code_row.partner_id, code_row.id, 'conversion', '/partners/redeem');
  END IF;
  RETURN QUERY SELECT code_row.partner_id, code_row.discount_percent;
END;
$$;
REVOKE ALL ON FUNCTION public.redeem_partner_referral_for_user(text, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.redeem_partner_referral_for_user(text, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.redeem_partner_referral_for_user(text, uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_partner_referral_for_user(text, uuid) TO service_role;