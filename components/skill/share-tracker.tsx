'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { trackClient } from '@/lib/analytics/client';

// Someone opened a shared link (?ref=share): send share_link_opened once, then drop
// the parameter so a reload or a copied URL doesn't count again.
export function ShareTracker({ slug }: { slug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sent = useRef(false);
  const isShare = searchParams.get('ref') === 'share';

  useEffect(() => {
    if (!isShare || sent.current) return;
    sent.current = true;
    trackClient('share_link_opened', { slug });
    const params = new URLSearchParams(window.location.search);
    params.delete('ref');
    const rest = params.toString();
    router.replace(rest ? `${pathname}?${rest}` : pathname, { scroll: false });
  }, [isShare, slug, pathname, router]);

  return null;
}
