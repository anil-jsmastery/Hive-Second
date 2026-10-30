import type { CSSProperties } from 'react';
import { seeded } from '@/lib/hash';

type HoneycombProps = { fx: number; fy: number; max?: number; seed?: number };

// Honeycomb background: cells light up like windows at night. A port of drawComb
// in build-plan/design/hive-night.html. Deterministic, so the server and the
// browser draw the same cells.
export function Honeycomb({ fx, fy, max = 0.26, seed = 11 }: HoneycombProps) {
  const W = 1400;
  const H = 760;
  const r = 36;
  const w = Math.sqrt(3) * r;
  const vs = 1.5 * r;
  const focusX = W * fx;
  const focusY = H * fy;
  const ri = r - 3;
  const rand = seeded(seed);
  const cells: { points: string; o?: string; d?: string }[] = [];

  for (let row = -1; row <= Math.ceil(H / vs) + 1; row++) {
    for (let col = -1; col <= Math.ceil(W / w) + 1; col++) {
      const cx = col * w + (row % 2 ? w / 2 : 0);
      const cy = row * vs;
      const pts: string[] = [];
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 180) * (60 * k - 90);
        pts.push(`${(cx + ri * Math.cos(a)).toFixed(1)},${(cy + ri * Math.sin(a)).toFixed(1)}`);
      }
      const dist = Math.hypot(cx - focusX, cy - focusY);
      const chance = Math.max(0.04, max - dist / 2600);
      if (rand() < chance) {
        const o = (0.18 + rand() * 0.6).toFixed(2);
        const d = (0.2 + dist / 700 + rand() * 0.3).toFixed(2);
        cells.push({ points: pts.join(' '), o, d });
      } else {
        cells.push({ points: pts.join(' ') });
      }
    }
  }

  return (
    <svg className="comb" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {cells.map((c, i) =>
        c.o ? (
          <polygon key={i} className="cell lit" points={c.points} style={{ '--o': c.o, '--d': `${c.d}s` } as CSSProperties} />
        ) : (
          <polygon key={i} className="cell" points={c.points} />
        ),
      )}
    </svg>
  );
}
