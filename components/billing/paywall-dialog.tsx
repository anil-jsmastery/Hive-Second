'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { trackClient } from '@/lib/analytics/client';
import { FEATURES } from '@/lib/constants';

export type PaywallFeature = (typeof FEATURES)[keyof typeof FEATURES];
export const DRAFT_KEY = 'hive:publish-draft';

const COPY: Record<PaywallFeature, { body: string; price: string; tab: 'personal' | 'team' }> = {
  private_skills: { body: 'Upgrade to Pro to publish skills only you can see.', price: 'Pro: $8/month', tab: 'personal' },
  team_private_skills: {
    body: 'Upgrade your team to Team to publish skills only your team can see.',
    price: 'Team: $20/month',
    tab: 'team',
  },
};

// Opens when publishing a private skill without the plan feature. "See plans" keeps
// the draft in sessionStorage so the form can restore it after checkout.
export function PaywallDialog({ feature, draft, onClose, onPublicInstead }: {
  feature: PaywallFeature | null;
  draft: Record<string, string>;
  onClose: () => void;
  onPublicInstead: () => void;
}) {
  const router = useRouter();
  const tracked = useRef(false);
  const open = feature !== null;

  useEffect(() => {
    if (!open) {
      tracked.current = false;
      return;
    }
    if (tracked.current) return;
    tracked.current = true;
    trackClient('paywall_shown', { feature });
  }, [open, feature]);

  if (!feature) return null;
  const copy = COPY[feature];

  function seePlans() {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, visibility: 'private' }));
    } catch {}
    router.push(`/pricing?tab=${copy.tab}&from=publish`);
  }

  return (
    <Dialog open onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className="hive-dialog">
        <DialogTitle>Private skills are a paid feature</DialogTitle>
        <DialogDescription>{copy.body}</DialogDescription>
        <div className="side-card paywall-price">{copy.price}</div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-ember" onClick={seePlans}>See plans</button>
          <button type="button" className="btn-ghost" onClick={onPublicInstead}>Publish as public instead</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
