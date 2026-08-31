create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.has_active_subscription(uuid, text) from anon, authenticated, public;