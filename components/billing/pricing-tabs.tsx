'use client';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { OrganizationSwitcher, PricingTable, useAuth } from '@clerk/nextjs';
import { TrackOnMount } from '@/components/analytics/track-on-mount';
import { EmptyState } from '@/components/empty-state';

export type PricingTab = 'personal' | 'team';

// Clerk's pricing table drawn as the design's .cl-card plans. Extra rules live in
// app/hive-night-app.css (the quiet Free button, the ember feature checks).
const appearance = {
  elements: {
    pricingTable: 'cl-cards',
    pricingTableCard: 'cl-card',
    pricingTableCard__pro: 'featured',
    pricingTableCard__team: 'featured',
    pricingTableCardHeader: 'cl-head',
    pricingTableCardTitle: 'cl-name',
    pricingTableCardDescription: 'cl-desc',
    pricingTableCardFeeContainer: 'cl-price',
    pricingTableCardFee: 'cl-amount',
    pricingTableCardFeePeriod: 'cl-period',
    pricingTableCardFeePeriodNotice: 'cl-note',
    pricingTableCardFeatures: 'cl-features',
    pricingTableCardFooter: 'cl-foot',
    pricingTableCardFooterButton: 'btn-ember cl-btn',
  },
};

export function PricingTabs({ initialTab, fromPublish }: { initialTab: PricingTab; fromPublish: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { orgId } = useAuth();
  const [tab, setTab] = useState<PricingTab>(initialTab);
  // Only an upgrade that started at the paywall returns to the editor.
  const redirect = fromPublish ? { newSubscriptionRedirectUrl: '/publish?upgraded=1' } : {};

  function select(next: PricingTab) {
    setTab(next);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <>
      <TrackOnMount key={tab} event="pricing_viewed" properties={{ tab }} />
      <div className="cl-switch" role="tablist" aria-label="Who the plan is for">
        <button type="button" role="tab" aria-selected={tab === 'personal'} onClick={() => select('personal')}>For you</button>
        <button type="button" role="tab" aria-selected={tab === 'team'} onClick={() => select('team')}>For teams</button>
      </div>
      {tab === 'personal' ? (
        <PricingTable appearance={appearance} {...redirect} />
      ) : orgId ? (
        <PricingTable for="organization" appearance={appearance} {...redirect} />
      ) : (
        <EmptyState
          title="No team selected"
          body="Create or switch to a team to see team plans."
          action={<OrganizationSwitcher hidePersonal appearance={{ elements: { organizationSwitcherTrigger: 'org' } }} />}
        />
      )}
    </>
  );
}
