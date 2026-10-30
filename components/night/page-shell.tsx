import type { ReactNode } from 'react';

// Every inner page: the soft ember glow at the top, then the centered content.
export function PageShell({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <section className={`page ${className}`.trim()}>
      <div className="glow" aria-hidden="true" />
      <div className="wrap">{children}</div>
    </section>
  );
}
