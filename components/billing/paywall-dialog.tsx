'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { LockIcon } from '@/components/night/icons';
import { trackClient } from '@/lib/analytics/client';
import { FEATURES } from '@/lib/constants';

export type PaywallFeature = (typeof FEATURES)[keyof typeof FEATURES];
export const DRAFT_KEY = 'hive:publish-draft';

const COPY: Record<PaywallFeature, { body: string; plan: string; price: string; tab: 'personal' | 'team' }> = {
  private_skills: { body: 'Upgrade to Pro to publish skills only you can see.', plan: 'Pro', price: '$8', tab: 'personal' },
  team_private_skills: {
    body: 'Upgrade your team to Team to publish skills only your team can see.',
    plan: 'Team',
    price: '$20',
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
  const { body, plan, price, tab } = COPY[feature];

  function seePlans() {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, visibility: 'private' }));
    } catch {}
    router.push(`/pricing?tab=${tab}&from=publish`);
  }

  return (
    <Dialog open onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className="hive-dialog paywall">
        <div className="paywall-head">
          <span className="paywall-icon"><LockIcon /></span>
          <DialogTitle className="paywall-title">Private skills are a paid feature</DialogTitle>
          <DialogDescription className="paywall-sub">{body}</DialogDescription>
        </div>
        <div className="paywall-plan">
          <span className="paywall-plan-name">{plan}</span>
          <span className="paywall-plan-price"><b>{price}</b>/month</span>
        </div>
        <div className="paywall-actions">
          <button type="button" className="btn-ember" onClick={seePlans}>See plans</button>
          <button type="button" className="btn-ghost" onClick={onPublicInstead}>Publish as public instead</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
