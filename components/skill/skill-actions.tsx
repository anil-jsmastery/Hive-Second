'use client';
import { useEffect, useRef, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { InstallIcon, LinkIcon, StarIcon } from '@/components/night/icons';
import { installSkill, toggleStar } from '@/app/s/[slug]/actions';

export function SkillActions({ slug, isPublic, starred: initialStarred, starsCount: initialCount }: {
  slug: string;
  isPublic: boolean;
  starred: boolean;
  starsCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [starred, setStarred] = useState(initialStarred);
  const [starsCount, setStarsCount] = useState(initialCount);
  const [starPending, startStar] = useTransition();
  const [installPending, startInstall] = useTransition();
  const published = useRef(false);
  const justPublished = searchParams.get('published') === '1';

  useEffect(() => {
    if (!justPublished || published.current) return;
    published.current = true;
    toast('Published');
    const params = new URLSearchParams(window.location.search);
    params.delete('published');
    const rest = params.toString();
    router.replace(rest ? `${pathname}?${rest}` : pathname, { scroll: false });
  }, [justPublished, pathname, router]);

  const toSignIn = () => router.push(`/sign-in?redirect_url=/s/${slug}`);

  function onStar() {
    startStar(async () => {
      const result = await toggleStar(slug);
      if ('needsAuth' in result) return toSignIn();
      if ('error' in result) {
        toast(result.error);
        return;
      }
      setStarred(result.starred);
      setStarsCount(result.starsCount);
      toast(result.starred ? 'Starred' : 'Star removed');
    });
  }

  function onShare() {
    navigator.clipboard.writeText(`${location.origin}/s/${slug}?ref=share`).catch(() => {});
    toast('Link copied');
  }

  function onInstall() {
    startInstall(async () => {
      const result = await installSkill(slug);
      if ('needsAuth' in result) return toSignIn();
      if ('error' in result) {
        toast(result.error);
        return;
      }
      await navigator.clipboard.writeText(result.command).catch(() => {});
      toast('Install command copied', { description: <code className="font-mono">{result.command}</code> });
    });
  }

  return (
    <div className="d-actions">
      <button type="button" className="btn-ghost star-btn" aria-pressed={starred} onClick={onStar} disabled={starPending}>
        <StarIcon className="star-ic" />
        <span className="star-lbl">{starred ? 'Starred' : 'Star'}</span>
        <span className="star-n">{starsCount}</span>
      </button>
      {isPublic ? (
        <button type="button" className="btn-ghost icon-btn" aria-label="Share" title="Copy link" onClick={onShare}>
          <LinkIcon />
        </button>
      ) : null}
      <button type="button" className="btn-ember d-install" onClick={onInstall} disabled={installPending}>
        <InstallIcon />Install
      </button>
    </div>
  );
}
