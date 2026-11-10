'use client';
import { useEffect } from 'react';

// Remembers the page that sent someone to sign in (Clerk's redirect_url), so
// onboarding can send them back there after sign-up (the signup-return experiment,
// Steps 18 and 19). Sign-up's forced redirect to /onboarding would otherwise lose it.
export function RememberReturn() {
  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('redirect_url');
    if (!raw) return;
    try {
      const url = new URL(raw, window.location.origin);
      if (url.origin !== window.location.origin) return;
      // Only a specific page is worth returning to: not the home page, the auth pages or onboarding.
      if (url.pathname === '/' || /^\/(sign-in|sign-up|onboarding)\b/.test(url.pathname)) return;
      const path = url.pathname + url.search;
      document.cookie = `hive_return_to=${encodeURIComponent(path)}; path=/; max-age=3600; samesite=lax`;
    } catch {
      // Not a valid address: nothing to remember.
    }
  }, []);
  return null;
}
