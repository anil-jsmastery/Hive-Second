'use client';
import { useEffect } from 'react';

// Keeps the hero subheading as wide as the heading's longest line, and never
// more than two lines (the design file's fitLead).
export function FitLead() {
  useEffect(() => {
    const fit = () => {
      const h = document.querySelector<HTMLElement>('.hero h1');
      const l = document.querySelector<HTMLElement>('.hero .lead');
      if (!h || !l) return;
      l.style.maxWidth = '';
      const range = document.createRange();
      range.selectNodeContents(h);
      const w = range.getBoundingClientRect().width;
      if (w) l.style.maxWidth = `${Math.ceil(w)}px`;
      const lh = parseFloat(getComputedStyle(l).lineHeight);
      if (l.getBoundingClientRect().height > lh * 2.5) l.style.maxWidth = '';
    };
    fit();
    window.addEventListener('resize', fit);
    document.fonts?.ready.then(fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return null;
}
