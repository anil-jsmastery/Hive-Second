import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { AvatarInitial } from '@/components/night/avatar-initial';
import { EmptyState } from '@/components/empty-state';
import { CommentForm } from '@/components/skill/comment-form';
import { createServerSupabase } from '@/lib/supabase/server';
import { timeAgo } from '@/lib/time';

export async function Comments({ skillId, slug }: { skillId: string; slug: string }) {
  const { userId } = await auth();
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from('comments')
    .select('id, body, created_at, author:profiles!comments_author_id_fkey(handle)')
    .eq('skill_id', skillId)
    .order('created_at', { ascending: true });
  const comments = data ?? [];

  return (
    <section className="comments">
      <h2>Comments <span className="c-count">{comments.length}</span></h2>
      {comments.length ? (
        comments.map((c) => {
          const handle = c.author?.handle ?? '';
          return (
            <div key={c.id} className="c-card">
              <AvatarInitial handle={handle} />
              <div>
                <div className="c-head">
                  <Link className="no-underline" href={`/u/${handle}`}><b>@{handle}</b></Link>
                  <span>{timeAgo(c.created_at)}</span>
                </div>
                <p className="c-body whitespace-pre-line">{c.body}</p>
              </div>
            </div>
          );
        })
      ) : (
        <EmptyState small title="No comments yet" body="Tried this skill? Share how it went." />
      )}
      {userId ? (
        <CommentForm slug={slug} />
      ) : (
        <p className="c-signin"><Link href={`/sign-in?redirect_url=/s/${slug}`}>Sign in</Link> to comment.</p>
      )}
    </section>
  );
}
