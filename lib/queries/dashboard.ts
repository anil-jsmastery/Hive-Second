import 'server-only';
import { createServerSupabase } from '@/lib/supabase/server';

export type StatKey = 'stars' | 'forks' | 'followers' | 'published';
export type Stat = { total: number; week: number; series: number[] };
export type DashboardStats = Record<StatKey, Stat>;

const EMPTY: Stat = { total: 0, week: 0, series: [0, 0, 0, 0, 0, 0, 0, 0] };

// Totals, this week's additions and 8-week series, from the dashboard_stats()
// database function (counts only, for the signed-in user).
export async function dashboardStats(): Promise<DashboardStats> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.rpc('dashboard_stats');
  if (error) throw error;
  const d = (data ?? {}) as Partial<DashboardStats>;
  return {
    stars: d.stars ?? EMPTY,
    forks: d.forks ?? EMPTY,
    followers: d.followers ?? EMPTY,
    published: d.published ?? EMPTY,
  };
}

export type SkillRow = {
  id: string;
  slug: string;
  title: string;
  stack: string;
  stars_count: number;
  visibility: 'public' | 'private';
  created_at: string;
  forked_from: { slug: string; author: { handle: string } | null } | null;
  fork_count: number;
};

// Dashboard rows: your original skills, your forks, or a team's skills, newest
// first, each with how many visible forks it has.
export async function skillRows(filter: { authorId?: string; orgId?: string; forks?: boolean }): Promise<SkillRow[]> {
  const supabase = await createServerSupabase();
  let query = supabase
    .from('skills')
    .select('id, slug, title, stack, stars_count, visibility, created_at, forked_from:forked_from_id(slug, author:profiles!skills_author_id_fkey(handle))');
  if (filter.authorId) query = query.eq('author_id', filter.authorId);
  if (filter.orgId) query = query.eq('org_id', filter.orgId);
  if (filter.forks === true) query = query.not('forked_from_id', 'is', null);
  if (filter.forks === false) query = query.is('forked_from_id', null);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  const rows = (data ?? []) as unknown as Omit<SkillRow, 'fork_count'>[];
  if (!rows.length) return [];
  const { data: forks } = await supabase
    .from('skills')
    .select('forked_from_id')
    .in('forked_from_id', rows.map((r) => r.id));
  const counts = new Map<string, number>();
  for (const f of forks ?? []) {
    const id = f.forked_from_id as string;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return rows.map((r) => ({ ...r, fork_count: counts.get(r.id) ?? 0 }));
}
