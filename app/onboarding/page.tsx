import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { PageShell } from '@/components/night/page-shell';
import { StackPicker } from '@/components/onboarding/stack-picker';

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return (
    <PageShell>
      <h1 className="page-title">Pick your stack</h1>
      <p className="dash-sub">We’ll use it to show skills that fit how you build.</p>
      <StackPicker />
    </PageShell>
  );
}
