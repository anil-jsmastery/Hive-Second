'use client';
import Link from 'next/link';
import { SkillGlyph } from '@/components/night/skill-glyph';
import { LockIcon, StarIcon } from '@/components/night/icons';
import { trackClient } from '@/lib/analytics/client';
import type { SkillCardData } from '@/lib/queries/search';

// The whole card is one link, so the author and team are shown as text.
export function SkillCard({ skill, query, rank }: { skill: SkillCardData; query?: string; rank?: number }) {
  const { slug, title, description, tags, stack, stars_count, visibility, author, org, forked_from } = skill;

  return (
    <Link
      className="skill"
      href={`/s/${slug}`}
      onClick={query !== undefined && rank !== undefined ? () => trackClient('search_result_opened', { query, rank, slug }) : undefined}
    >
      <div className="skill-top">
        <span className="glyph"><SkillGlyph title={title} stars={stars_count} /></span>
        <div className="skill-name">
          <h2>{title}</h2>
          {forked_from ? (
            <span className="author">forked from @{forked_from.author?.handle ?? ''}</span>
          ) : author ? (
            <span className="author">@{author.handle}</span>
          ) : null}
        </div>
      </div>
      <p>{description}</p>
      <div className="meta">
        <span className="fw">{stack}</span>
        {org ? <span className="tag">{org.name}</span> : null}
        {visibility === 'private' ? <span className="priv"><LockIcon />Private</span> : null}
        {tags.map((t) => <span key={t} className="tag">{t}</span>)}
        <span className="stars" aria-label={`${stars_count} stars`}><StarIcon />{stars_count}</span>
      </div>
    </Link>
  );
}
