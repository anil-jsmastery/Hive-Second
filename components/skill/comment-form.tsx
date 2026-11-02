'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { postComment } from '@/app/s/[slug]/actions';

export function CommentForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const result = await postComment(slug, body);
      if ('needsAuth' in result) return router.push(`/sign-in?redirect_url=/s/${slug}`);
      if ('error' in result) {
        setError(result.error);
        return;
      }
      setError('');
      setBody('');
    });
  }

  return (
    <form className="c-form" onSubmit={onSubmit}>
      <div className={error ? 'fld err' : 'fld'}>
        <label htmlFor="c-text">Add a comment</label>
        <textarea
          className="inp"
          id="c-text"
          rows={3}
          placeholder="What worked, what didn’t, what you’d add"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'c-text-err' : undefined}
        />
        <p className="err-msg" id="c-text-err">{error}</p>
      </div>
      <div className="c-row">
        <button type="submit" className="btn-ember" disabled={pending}>{pending ? 'Posting…' : 'Post comment'}</button>
      </div>
    </form>
  );
}
