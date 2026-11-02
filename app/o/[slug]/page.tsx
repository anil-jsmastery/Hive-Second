import { notFound } from 'next/navigation';
import { PageShell } from '@/components/night/page-shell';
import { EmptyState } from '@/components/empty-state';
import { SkillCard } from '@/components/explore/skill-card';
import { createServerSupabase } from '@/lib/supabase/server';
import { CARD_FIELDS, type SkillCardData } from '@/lib/queries/search';

export default async function TeamPage({ params }: PageProps<'/o/[slug]'>) {
  const { slug } = await params;
  const supabase = await createServerSupabase();
  const { data: org, error } = await supabase
    .from('organizations')
    .select('id, slug, name')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  if (!org) notFound();

  // RLS shows private team skills only to members with this team active.
  const { data, error: skillsError } = await supabase
    .from('skills')
    .select(CARD_FIELDS)
    .eq('org_id', org.id)
    .order('created_at', { ascending: false });
  if (skillsError) throw skillsError;
  const skills = (data ?? []) as unknown as SkillCardData[];

  return (
    <PageShell className="detail">
      <header className="d-top">
        <div className="d-head">
          <span className="org-av p-av" aria-hidden="true">{(org.name[0] ?? '?').toUpperCase()}</span>
          <div className="d-intro">
            <h1 className="d-title">{org.name}</h1>
            <div className="d-by">
              <span className="tag">Team</span>
            </div>
          </div>
        </div>
      </header>
      <section className="section">
        <div className="section-head"><h2>Team skills</h2></div>
        {skills.length ? (
          <div className="grid">
            {skills.map((s) => <SkillCard key={s.slug} skill={s} />)}
          </div>
        ) : (
          <EmptyState title="No team skills yet" body={`Skills published for ${org.name} show up here.`} />
        )}
      </section>
    </PageShell>
  );
}
