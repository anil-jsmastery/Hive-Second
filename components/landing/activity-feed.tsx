'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { timeAgo } from '@/lib/time';

export type FeedRow = {
  id: string;
  type: 'published' | 'forked' | 'starred' | 'commented';
  created_at: string;
  actor: { display_name: string; handle: string } | null;
  skill: { slug: string; title: string } | null;
};

const VERBS: Record<FeedRow['type'], string> = {
  published: 'published',
  forked: 'forked',
  starred: 'starred',
  commented: 'commented on',
};
const ROWS = 8;
const REFRESH_MS = 15000;
const FRESH_MS = 1500;

// "Happening now": the latest activity, refreshed while the page is visible.
// As in the design: the first rows rise in one by one; a new row slides in at
// the top with the sweep while the oldest slides out below; the live dot pings
// and one lit honeycomb cell flares. Hovering or focusing the card pauses it.
export function ActivityFeed({ rows }: { rows: FeedRow[] }) {
  const router = useRouter();
  const paused = useRef(false);
  const liveDot = useRef<HTMLSpanElement>(null);
  const [list, setList] = useState(rows);
  const listRef = useRef(rows);
  const [introIds] = useState(() => new Set(rows.map((r) => r.id)));
  const [fresh, setFresh] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused.current && document.visibilityState === 'visible') router.refresh();
    }, REFRESH_MS);
    return () => clearInterval(timer);
  }, [router]);

  useEffect(() => {
    const known = new Set(listRef.current.map((r) => r.id));
    const added = rows.filter((r) => !known.has(r.id));
    if (!added.length) return;

    // Keep the old rows for now: the fixed-height list hides the extras, so the
    // oldest row slides out of view while the new one slides in.
    const next = [...added, ...listRef.current];
    listRef.current = next;
    setList(next);
    setFresh(new Set(added.map((r) => r.id)));

    const dot = liveDot.current;
    if (dot) {
      dot.classList.remove('ping');
      void dot.offsetWidth;
      dot.classList.add('ping');
    }
    const cells = [...document.querySelectorAll<SVGPolygonElement>('.hero .comb .cell.lit')]
      .filter((c) => parseFloat(c.getAttribute('points') ?? '0') > 820);
    const cell = cells[Math.floor(Math.random() * cells.length)];
    if (cell) {
      cell.classList.remove('flare');
      void cell.getBoundingClientRect();
      cell.classList.add('flare');
      setTimeout(() => cell.classList.remove('flare'), 1700);
    }

    const t = setTimeout(() => {
      const trimmed = listRef.current.slice(0, ROWS);
      listRef.current = trimmed;
      setList(trimmed);
      setFresh(new Set());
    }, FRESH_MS);
    return () => clearTimeout(t);
  }, [rows]);

  const pause = () => { paused.current = true; };
  const resume = () => { paused.current = false; };

  // Intro rows keep their class (so the rise-in never replays); new rows get
  // "enter fresh" while they animate, then no animation class at all.
  const rowClass = (id: string) => (fresh.has(id) ? 'enter fresh' : introIds.has(id) ? 'intro' : undefined);

  return (
    <section className="feed" aria-labelledby="feed-title"
      onMouseEnter={pause} onMouseLeave={resume} onFocus={pause} onBlur={resume}>
      <div className="feed-head">
        <h2 id="feed-title">Happening now</h2>
        <span className="live" ref={liveDot} aria-hidden="true" />
      </div>
      {list.length === 0 ? (
        <div className="empty small">
          <strong>It’s quiet in here</strong>
          New skills will show up here as people publish them.
        </div>
      ) : (
        <ol style={{ '--rows': ROWS } as CSSProperties}>
          {list.map((r, i) => (
            <li key={r.id} className={rowClass(r.id)} style={{ '--i': i } as CSSProperties}>
              <span className={`dot ${r.type}`} aria-hidden="true"><i /></span>
              <span className="text">
                <span className="user">{r.actor?.display_name ?? 'Someone'}</span>{' '}
                {VERBS[r.type]}{' '}
                {r.skill ? <Link href={`/s/${r.skill.slug}`}>{r.skill.title}</Link> : 'a skill'}
              </span>
              <span className="time">{timeAgo(r.created_at)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
