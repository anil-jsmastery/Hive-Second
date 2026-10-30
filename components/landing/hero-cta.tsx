'use client';
import Link from 'next/link';
import { trackClient } from '@/lib/analytics/client';

export function HeroCta() {
  return (
    <Link className="btn-ember cta" href="/explore" onClick={() => trackClient('landing_cta_clicked', { cta: 'hero' })}>
      Explore skills
    </Link>
  );
}
