'use client';
import { useState } from 'react';
import Link from 'next/link';
import { SkillGlyph } from '@/components/night/skill-glyph';
import { ChevronIcon, ForkIcon, LockIcon, StarIcon } from '@/components/night/icons';
import type { SkillRow } from '@/lib/queries/dashboard';
import { timeAgo } from '@/lib/time';

type Tab = 'skills' | 'forks' | 'team';

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

// The dashboard's left panel: your skills, your forks and, when a team is active,
// the team's skills, switched with tabs.
export function SkillsPanel({ skills, forks, team }: {
  skills: SkillRow[];
  forks: SkillRow[];
  team: { name: string; skills: SkillRow[] } | null;
}) {
  const [selected, setTab] = useState<Tab>('skills');
  const tab = selected === 'team' && !team ? 'skills' : selected;
  const list = tab === 'skills' ? skills : tab === 'forks' ? forks : team?.skills ?? [];
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
          {team ? (
            <button type="button" role="tab" aria-selected={tab === 'team'} onClick={() => setTab('team')}>
              Team: {team.name} <span className="tab-n">{team.skills.length}</span>
            </button>
          ) : null}
        </div>
      </div>
      <ul className="srows">
        {list.length ? list.map((s) => <Row key={s.id} s={s} />) : tab === 'skills' ? (
          <li className="srows-empty">
            <strong>No skills yet</strong>
            You haven’t published a skill yet. <Link href="/publish">Publish a skill</Link>
          </li>
        ) : tab === 'team' ? (
          <li className="srows-empty">
            <strong>No team skills yet</strong>
            Publish a skill as your team to see it here. <Link href="/publish">Publish a skill</Link>
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
