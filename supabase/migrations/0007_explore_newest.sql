-- Explore shows the newest skills first when nobody is searching (Step 03's search function, updated).
create or replace function public.search_skills(q text default '', stack_filter text default null)
returns setof public.skills
language sql stable security invoker set search_path = public as $$
  with params as (
    select case when coalesce(trim(q), '') = '' then null
                else websearch_to_tsquery('english', q) end as tsq
  )
  select s.*
  from public.skills s, params p
  where (p.tsq is null
         or to_tsvector('english', s.title || ' ' || s.description || ' ' || array_to_string(s.tags, ' ')) @@ p.tsq)
    and (stack_filter is null or s.stack = stack_filter)
  order by
    -- A search ranks by relevance, then stars. With no search, Explore shows the
    -- newest skills first, so a newly published skill is seen instead of sitting
    -- below every established one.
    case when p.tsq is null then 0
         else ts_rank(to_tsvector('english', s.title || ' ' || s.description || ' ' || array_to_string(s.tags, ' ')), p.tsq)
    end desc,
    case when p.tsq is null then s.created_at end desc nulls last,
    s.stars_count desc,
    s.created_at desc
  limit 30
$$;
