import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PageShell } from '@/components/night/page-shell';
import { PublishForm } from '@/components/publish/publish-form';
import { PublishStarted } from '@/components/publish/publish-started';
import type { Variant } from '@/lib/analytics/events';

export default async function PublishPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in?redirect_url=/publish');
  const variant: Variant = 'control';

  return (
    <PageShell className="publish">
      <PublishStarted variant={variant} />
      <h1 className="page-title">Publish a skill</h1>
      <div className="publish-grid">
        <PublishForm variant={variant} />
      </div>
    </PageShell>
  );
}
