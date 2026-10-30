import { hashStr } from '@/lib/hash';

const AV_COLORS = ['#F6A623', '#E8894A', '#D9B56A', '#8FA3B8', '#C9A0DC', '#7FC8A9'];

// A tinted circle with the handle's first letter. The color comes from the handle.
export function AvatarInitial({ handle, className = 'av' }: { handle: string; className?: string }) {
  const color = AV_COLORS[hashStr(handle) % AV_COLORS.length];
  return (
    <span className={className} style={{ background: `${color}26`, color }} aria-hidden="true">
      {(handle[0] ?? '?').toUpperCase()}
    </span>
  );
}
