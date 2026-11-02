// A small trend line under each dashboard stat (the design file's spark()).
export function Sparkline({ values }: { values: number[] }) {
  const w = 96;
  const h = 32;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const pts = values.map((v, i) => [i * (w / (values.length - 1)), h - 3 - ((v - min) / (max - min || 1)) * (h - 8)]);
  const line = pts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ');
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <polygon points={`0,${h} ${line} ${w},${h}`} fill="rgba(246,166,35,.12)" />
      <polyline points={line} fill="none" stroke="#F6A623" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
