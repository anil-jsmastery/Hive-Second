import Link from 'next/link';
import { PageShell } from '@/components/night/page-shell';
import { EmptyState } from '@/components/empty-state';
import { TrackOnMount } from '@/components/analytics/track-on-mount';
import { SearchForm } from '@/components/explore/search-form';
import { StackFilter } from '@/components/explore/stack-filter';
import { SkillCard } from '@/components/explore/skill-card';
import { STACKS } from '@/lib/constants';
import { searchSkills } from '@/lib/queries/search';

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q.trim() : '';
  const rawStack = typeof params.stack === 'string' ? params.stack : null;
  const stack = rawStack && (STACKS as readonly string[]).includes(rawStack) ? rawStack : null;
  const results = await searchSkills(q, stack);

  return (
    <PageShell className="explore">
      <h1 className="page-title">Explore skills</h1>
      <SearchForm q={q} stack={stack} />
      <StackFilter q={q} stack={stack} />
      <p className="count" aria-live="polite">{results.length === 1 ? '1 skill' : `${results.length} skills`}</p>
      <div className="grid">
        {results.map((s, i) => (
          <SkillCard key={s.slug} skill={s} query={q || undefined} rank={i + 1} />
        ))}
        {q && results.length === 0 ? (
          <EmptyState
            title={`No skills match “${q}”`}
            body="Try a shorter search, or browse every skill."
            action={<Link className="link-btn" href="/explore">Browse all skills</Link>}
          />
        ) : null}
      </div>
      {q ? (
        <TrackOnMount key={`${q}|${stack ?? 'All'}`} event="search_performed"
          properties={{ query: q, stack: stack ?? 'All', result_count: results.length }} />
      ) : null}
    </PageShell>
  );
}
