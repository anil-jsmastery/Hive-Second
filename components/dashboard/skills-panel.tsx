'use client';
import { useState } from 'react';
import Link from 'next/link';
import { SkillGlyph } from '@/components/night/skill-glyph';
import { ChevronIcon, ForkIcon, LockIcon, StarIcon } from '@/components/night/icons';
import type { SkillRow } from '@/lib/queries/dashboard';
import { timeAgo } from '@/lib/time';

type Tab = 'skills' | 'forks';

function Row({ s }: { s: SkillRow }) {
  const sub = s.forked_from
    ? `Forked from @${s.forked_from.author?.handle ?? ''}, published ${timeAgo(s.created_at)}`
    : `Published ${timeAgo(s.created_at)}`;
  return (
    <li>
      <Link className="srow" href={`/s/${s.slug}`}>
        <span className="glyph sm"><SkillGlyph title={s.title} stars={s.stars_count} /></span>
        <span className="srow-main">
          <span className="srow-title">
            <b>{s.title}</b>
            {s.visibility === 'private' ? <span className="priv"><LockIcon />Private</span> : null}
          </span>
          <span className="srow-sub">{sub}</span>
        </span>
        <span className="fw srow-fw">{s.stack}</span>
        <span className="srow-stat" title="Stars"><StarIcon />{s.stars_count}</span>
        <span className="srow-stat srow-forks" title="Forks"><ForkIcon />{s.fork_count}</span>
        <ChevronIcon />
      </Link>
    </li>
  );
}

// The dashboard's left panel: your skills and your forks, switched with tabs.
export function SkillsPanel({ skills, forks }: { skills: SkillRow[]; forks: SkillRow[] }) {
  const [tab, setTab] = useState<Tab>('skills');
  const list = tab === 'skills' ? skills : forks;
  return (
    <section className="panel" aria-label="Your skills and forks">
      <div className="panel-head">
        <div className="cl-switch" role="tablist" aria-label="Show">
          <button type="button" role="tab" aria-selected={tab === 'skills'} onClick={() => setTab('skills')}>
            Your skills <span className="tab-n">{skills.length}</span>
          </button>
          <button type="button" role="tab" aria-selected={tab === 'forks'} onClick={() => setTab('forks')}>
            Forks <span className="tab-n">{forks.length}</span>
          </button>
        </div>
      </div>
      <ul className="srows">
        {list.length ? list.map((s) => <Row key={s.id} s={s} />) : tab === 'skills' ? (
          <li className="srows-empty">
            <strong>No skills yet</strong>
            You haven’t published a skill yet. <Link href="/publish">Publish a skill</Link>
          </li>
        ) : (
          <li className="srows-empty">
            <strong>No forks yet</strong>
            Fork a skill to make your own version. <Link href="/explore">Explore skills</Link>
          </li>
        )}
      </ul>
    </section>
  );
}
