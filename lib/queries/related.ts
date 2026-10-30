import 'server-only';
import { createServerSupabase } from '@/lib/supabase/server';
import { CARD_FIELDS, type SkillCardData } from '@/lib/queries/search';

// "More like this": up to 3 original skills that share the stack or a tag, most
// starred first. RLS decides which ones the viewer can see.
export async function relatedSkills(skill: { slug: string; stack: string; tags: string[] }): Promise<SkillCardData[]> {
  const supabase = await createServerSupabase();
  const filters: string[] = [];
  if (skill.stack !== 'Any') filters.push(`stack.eq."${skill.stack}"`);
  if (skill.tags.length) filters.push(`tags.ov.{${skill.tags.join(',')}}`);
  let query = supabase.from('skills').select(CARD_FIELDS).neq('slug', skill.slug).is('forked_from_id', null);
  if (filters.length) query = query.or(filters.join(','));
  const { data, error } = await query.order('stars_count', { ascending: false }).limit(3);
  if (error) throw error;
  return (data ?? []) as unknown as SkillCardData[];
}
