import { PageShell } from '@/components/night/page-shell';
import { PricingTabs, type PricingTab } from '@/components/billing/pricing-tabs';

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const tab: PricingTab = params.tab === 'team' ? 'team' : 'personal';

  return (
    <PageShell className="pricing">
      <h1 className="page-title">Plans</h1>
      <p className="sub">Public skills are free. Pay only when you need private ones.</p>
      <PricingTabs initialTab={tab} fromPublish={params.from === 'publish'} />
    </PageShell>
  );
}
