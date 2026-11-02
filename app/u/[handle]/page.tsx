import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { PageShell } from '@/components/night/page-shell';
import { AvatarInitial } from '@/components/night/avatar-initial';
import { EmptyState } from '@/components/empty-state';
import { SkillCard } from '@/components/explore/skill-card';
import { FollowButton } from '@/components/profile/follow-button';
import { followCounts, getProfileByHandle, isFollowing, skillsByAuthor } from '@/lib/queries/profile';

export default async function ProfilePage({ params }: PageProps<'/u/[handle]'>) {
  const { handle } = await params;
  const profile = await getProfileByHandle(handle);
  if (!profile) notFound();

  const { userId } = await auth();
  const [counts, following, skills] = await Promise.all([
    followCounts(profile.id),
    isFollowing(profile.id, userId),
    skillsByAuthor(profile.id),
  ]);
  const isMe = userId === profile.id;

  return (
    <PageShell className="detail">
      <header className="d-top">
        <div className="d-head">
          <AvatarInitial handle={profile.handle} className="av p-av" />
          <div className="d-intro">
            <h1 className="d-title">{profile.display_name}</h1>
            <div className="d-by">
              <b>@{profile.handle}</b>
              {profile.stack ? <span className="fw">{profile.stack}</span> : null}
            </div>
            <div className="p-counts">
              <span><b>{counts.followers}</b> {counts.followers === 1 ? 'follower' : 'followers'}</span>
              <span><b>{counts.following}</b> following</span>
            </div>
          </div>
        </div>
        {isMe ? null : (
          <div className="d-actions">
            <FollowButton key={String(following)} handle={profile.handle} signedIn={Boolean(userId)} following={following} />
          </div>
        )}
      </header>
      <section className="section">
        <div className="section-head"><h2>Published skills</h2></div>
        {skills.length ? (
          <div className="grid">
            {skills.map((s) => <SkillCard key={s.slug} skill={s} />)}
          </div>
        ) : (
          <EmptyState title="No skills yet" body={`@${profile.handle} hasn’t published a skill yet.`} />
        )}
      </section>
    </PageShell>
  );
}
