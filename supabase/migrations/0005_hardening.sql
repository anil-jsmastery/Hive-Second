-- Security hardening, so Supabase's security advisor has nothing to flag that
-- the app doesn't need.

-- 1. Pin the search path of the session helpers. Every RLS policy calls them,
--    so a fixed search path stops a look-alike function in another schema from
--    being picked up instead.
alter function public.requesting_user_id() set search_path = '';
alter function public.requesting_org_id() set search_path = '';

-- 2. Trigger functions only run through their triggers, so nobody needs to call
--    them through the API. Postgres doesn't check EXECUTE when a trigger fires,
--    so the triggers keep working.
revoke execute on function public.on_skill_created() from public, anon, authenticated;
revoke execute on function public.on_star_created() from public, anon, authenticated;
revoke execute on function public.on_star_deleted() from public, anon, authenticated;
revoke execute on function public.on_comment_created() from public, anon, authenticated;
revoke execute on function public.on_follow_created() from public, anon, authenticated;

-- 3. slug_taken answers only "is this slug used?". The app calls it when a
--    signed-in user publishes or forks, so signed-out visitors don't need it.
revoke execute on function public.slug_taken(text) from public, anon;
grant execute on function public.slug_taken(text) to authenticated;
