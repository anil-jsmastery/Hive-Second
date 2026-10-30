import type { CSSProperties } from 'react';
import { hashStr, seeded } from '@/lib/hash';

// Each skill gets its own little honeycomb emblem: the pattern comes from the
// title, and busier emblems mean more stars. A port of glyph() in the design file.
export function SkillGlyph({ title, stars }: { title: string; stars: number }) {
  const r = 9;
  const w = Math.sqrt(3) * r;
  const ri = 8;
  const c = 28;
  const centers: [number, number][] = [
    [c, c], [c + w, c], [c - w, c],
    [c + w / 2, c - 1.5 * r], [c - w / 2, c - 1.5 * r],
    [c + w / 2, c + 1.5 * r], [c - w / 2, c + 1.5 * r],
  ];
  const rand = seeded(hashStr(title || 'skill') || 1);
  // Deterministic shuffle (Fisher-Yates), identical in every browser.
  const order = [0, 1, 2, 3, 4, 5, 6];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const lit = new Set(order.slice(0, Math.min(7, 3 + Math.round(stars / 18))));

  return (
    <svg viewBox="0 0 56 56" aria-hidden="true">
      {centers.map(([x, y], i) => {
        const pts: string[] = [];
        for (let k = 0; k < 6; k++) {
          const a = (Math.PI / 180) * (60 * k - 90);
          pts.push(`${(x + ri * Math.cos(a)).toFixed(1)},${(y + ri * Math.sin(a)).toFixed(1)}`);
        }
        const on = lit.has(i);
        const o = on ? (0.35 + rand() * 0.55).toFixed(2) : '0';
        return (
          <polygon key={i} className={on ? 'g-cell on' : 'g-cell'} points={pts.join(' ')}
            style={{ '--i': i, '--o': o } as CSSProperties} />
        );
      })}
    </svg>
  );
}
