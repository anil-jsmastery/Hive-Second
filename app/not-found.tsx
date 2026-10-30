import Link from 'next/link';
import { PageShell } from '@/components/night/page-shell';

export default function NotFound() {
  return (
    <PageShell>
      <h1 className="page-title">Page not found</h1>
      <p className="dash-sub">This page doesn’t exist. Head back to Explore to find a skill.</p>
      <div className="mt-7">
        <Link className="btn-ember dash-cta" href="/explore">Explore skills</Link>
      </div>
    </PageShell>
  );
}
