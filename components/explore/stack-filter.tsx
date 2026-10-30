import Link from 'next/link';
import { STACKS } from '@/lib/constants';

// The URL is the state: each chip links to /explore with its stack, keeping q.
export function StackFilter({ q, stack }: { q: string; stack: string | null }) {
  const href = (s: string | null) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (s) params.set('stack', s);
    const qs = params.toString();
    return qs ? `/explore?${qs}` : '/explore';
  };

  return (
    <div className="chips" role="group" aria-label="Filter by stack">
      <Link className="chip" href={href(null)} aria-pressed={stack === null}>All</Link>
      {STACKS.map((s) => (
        <Link key={s} className="chip" href={href(s)} aria-pressed={stack === s}>{s}</Link>
      ))}
    </div>
  );
}
