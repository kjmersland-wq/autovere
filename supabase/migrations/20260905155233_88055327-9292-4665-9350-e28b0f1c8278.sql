-- Re-assert the anon/authenticated INSERT policy on public.page_views.
--
-- Confirmed via direct REST calls against the live database (2026-09-05) that
-- this policy — originally defined in
-- 20260831145700_ac87071f-6635-4e87-bc0b-ddda89008f4e.sql — is not currently
-- active: every anon insert is rejected with "new row violates row-level
-- security policy for table page_views" (error 42501), identical to the
-- rejection an anon insert gets on a table with no insert policy at all. This
-- is why no real page visits have ever reached the table: even with the
-- client wired up to call trackPageView() on every navigation, every insert
-- was silently discarded (trackPageView never surfaces analytics errors, by
-- design, so the app kept working with no visible symptom besides an empty
-- Admin traffic panel).
--
-- Idempotent: safe to run even if the policy already exists.
drop policy if exists "Anyone can record a page view" on public.page_views;

create policy "Anyone can record a page view"
on public.page_views for insert
to anon, authenticated
with check (true);

grant insert on public.page_views to anon, authenticated;