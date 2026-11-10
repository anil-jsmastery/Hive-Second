'use client';
import { useState, useTransition } from 'react';
import { STACKS } from '@/lib/constants';
import { saveStack, skipOnboarding } from '@/app/onboarding/actions';

export function StackPicker() {
  const [stack, setStack] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <div className="vis mt-9 min-[561px]:grid-cols-3!" role="radiogroup" aria-label="Stack">
        {STACKS.map((s) => (
          <label key={s} className="vis-opt">
            <input type="radio" name="stack" value={s} checked={stack === s} onChange={() => setStack(s)} />
            <span className="radio" aria-hidden="true" />
            <span className="vis-title">{s}</span>
          </label>
        ))}
      </div>
      <div className="mt-9 flex items-center gap-4">
        <button
          type="button"
          className="btn-ember p-submit max-w-80"
          disabled={!stack || pending}
          onClick={() => stack && startTransition(() => saveStack(stack))}
        >
          {pending ? 'Saving…' : 'Continue'}
        </button>
        <form action={skipOnboarding}><button type="submit" className="link-btn">Skip for now</button></form>
      </div>
    </>
  );
}
