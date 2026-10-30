import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { PageShell } from '@/components/night/page-shell';
import { SkillGlyph } from '@/components/night/skill-glyph';
import { AvatarInitial } from '@/components/night/avatar-initial';
import { BackIcon, HexIcon, LockIcon } from '@/components/night/icons';
import { TrackOnMount } from '@/components/analytics/track-on-mount';
import { SkillActions } from '@/components/skill/skill-actions';
import { Markdown } from '@/components/skill/markdown';
import { ShareTracker } from '@/components/skill/share-tracker';
import { MoreLikeThis } from '@/components/skill/more-like-this';
import { getSkill, hasStarred } from '@/lib/queries/skill';
import { createServerSupabase } from '@/lib/supabase/server';
import { timeAgo } from '@/lib/time';

export default async function SkillPage({ params }: PageProps<'/s/[slug]'>) {
  const { slug } = await params;
  const skill = await getSkill(slug);
  if (!skill) notFound();

  const { userId } = await auth();
  const supabase = await createServerSupabase();
  const [starred, { count: commentCount }] = await Promise.all([
    hasStarred(skill.id, userId),
    supabase.from('comments').select('id', { count: 'exact', head: true }).eq('skill_id', skill.id),
  ]);

  const { title, description, content, tags, stack, visibility, stars_count, author, org, forked_from, created_at } = skill;
  const handle = author?.handle ?? '';

  return (
    <PageShell className="detail">
      <Link className="back" href="/explore"><BackIcon />Explore skills</Link>
      <header className="d-top">
        <div className="d-head">
          <span className="glyph lg"><SkillGlyph title={title} stars={stars_count} /></span>
          <div className="d-intro">
            <h1 className="d-title">{title}</h1>
            <p className="d-desc">{description}</p>
            <div className="d-by">
              <AvatarInitial handle={handle} />
              <span>
                by <Link className="no-underline" href={`/u/${handle}`}><b>@{handle}</b></Link>
                {forked_from ? (
                  <>
                    , forked from <Link href={`/s/${forked_from.slug}`}>{forked_from.title}</Link> by @{forked_from.author?.handle}
                  </>
                ) : null}
              </span>
              {org ? <Link className="no-underline" href={`/o/${org.slug}`}><span className="tag">{org.name}</span></Link> : null}
              {visibility === 'private' ? <span className="priv"><LockIcon />Private</span> : null}
            </div>
          </div>
        </div>
        <SkillActions key={slug} slug={slug} isPublic={visibility === 'public'} starred={starred} starsCount={stars_count} />
      </header>
      <div className="d-grid">
        <div className="d-main">
          <article className="doc">
            <div className="doc-bar"><HexIcon /><span>{slug}.md</span></div>
            <Markdown content={content} />
          </article>
        </div>
        <aside className="d-side">
          <section className="side-card">
            <h2 className="side-title">About</h2>
            <dl className="side-meta">
              <dt>Stack</dt><dd><span className="fw">{stack}</span></dd>
              <dt>Tags</dt><dd>{tags.map((t) => <span key={t} className="tag">{t}</span>)}</dd>
              <dt>Stars</dt><dd>{stars_count}</dd>
              <dt>Comments</dt><dd>{commentCount ?? 0}</dd>
              <dt>Published</dt><dd>{timeAgo(created_at)}</dd>
            </dl>
          </section>
          <MoreLikeThis skill={{ slug, stack, tags }} />
        </aside>
      </div>
      <TrackOnMount key={slug} event="skill_viewed"
        properties={{ slug, stack, author_handle: handle, visibility: visibility === 'private' ? 'private' : 'public' }} />
      <ShareTracker slug={slug} />
    </PageShell>
  );
}
