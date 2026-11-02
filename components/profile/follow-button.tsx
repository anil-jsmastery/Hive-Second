'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { toggleFollow } from '@/app/u/[handle]/actions';

// Following is deliberately not tracked: no decision depends on it yet.
export function FollowButton({ handle, signedIn, following: initialFollowing }: {
  handle: string;
  signedIn: boolean;
  following: boolean;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();

  const toSignIn = () => router.push(`/sign-in?redirect_url=/u/${handle}`);

  if (!signedIn) {
    return <button type="button" className="btn-ember" onClick={toSignIn}>Follow</button>;
  }

  function onClick() {
    startTransition(async () => {
      const result = await toggleFollow(handle);
      if ('needsAuth' in result) return toSignIn();
      if ('error' in result) {
        toast(result.error);
        return;
      }
      setFollowing(result.following);
    });
  }

  return following ? (
    <button type="button" className="btn-ghost" onClick={onClick} disabled={pending}>Following</button>
  ) : (
    <button type="button" className="btn-ember" onClick={onClick} disabled={pending}>Follow</button>
  );
}
