-- Dashboard stats for the signed-in user: totals, this week's additions and an
-- 8-week cumulative series per stat. Returns counts only (never who starred,
-- forked or followed), so it can safely read past RLS on stars.
create or replace function public.dashboard_stats()
returns json
language sql
stable
security definer
set search_path = public
as $$
  with me as (
    select public.requesting_user_id() as id
  ),
  my_skills as (
    select s.id, s.stars_count, s.forked_from_id, s.created_at
    from public.skills s, me
    where s.author_id = me.id
  ),
  events as (
    select 'stars' as stat, st.created_at
    from public.stars st
    where st.skill_id in (select id from my_skills)
    union all
    select 'forks', f.created_at
    from public.skills f
    where f.forked_from_id in (select id from my_skills)
      and f.author_id <> (select id from me)
    union all
    select 'followers', fo.created_at
    from public.follows fo, me
    where fo.following_id = me.id
    union all
    select 'published', ms.created_at
    from my_skills ms
    where ms.forked_from_id is null
  ),
  weeks as (
    select generate_series(7, 0, -1) as w
  ),
  per_stat as (
    select
      stat,
      count(*) as total,
      count(*) filter (where created_at > now() - interval '7 days') as week,
      (
        select json_agg(c order by w desc)
        from (
          select w, count(*) filter (where e2.created_at <= now() - make_interval(weeks => w)) as c
          from weeks
          left join events e2 on e2.stat = e.stat
          group by w
        ) series
      ) as series
    from events e
    group by stat
  ),
  stats as (
    select s.stat, coalesce(p.total, 0) as total, coalesce(p.week, 0) as week,
           coalesce(p.series, '[0,0,0,0,0,0,0,0]'::json) as series
    from (values ('stars'), ('forks'), ('followers'), ('published')) as s(stat)
    left join per_stat p on p.stat = s.stat
  )
  select json_object_agg(
    stat,
    json_build_object(
      'total', case when stat = 'stars'
                    then (select coalesce(sum(stars_count), 0) from my_skills)
                    else total end,
      'week', week,
      'series', series
    )
  )
  from stats;
$$;

revoke execute on function public.dashboard_stats() from public, anon;
grant execute on function public.dashboard_stats() to authenticated;
