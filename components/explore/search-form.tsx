'use client';
import { useRouter } from 'next/navigation';
import { SearchIcon } from '@/components/night/icons';

// Submitting goes to /explore?q=… and keeps the current stack. An empty search removes q.
export function SearchForm({ q, stack }: { q: string; stack: string | null }) {
  const router = useRouter();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get('q') ?? '').trim();
    const params = new URLSearchParams();
    if (value) params.set('q', value);
    if (stack) params.set('stack', stack);
    const qs = params.toString();
    router.push(qs ? `/explore?${qs}` : '/explore');
  }

  return (
    <form className="search" role="search" onSubmit={onSubmit}>
      <label htmlFor="q">Search skills</label>
      <div className="field">
        <SearchIcon />
        <input key={q} id="q" name="q" type="search" defaultValue={q} placeholder="Try “code review” or “auth”" autoComplete="off" />
        <button type="submit" className="btn-ember">Search</button>
      </div>
    </form>
  );
}
