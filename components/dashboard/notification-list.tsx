import { AvatarInitial } from '@/components/night/avatar-initial';
import { CommentIcon, FollowIcon, ForkIcon } from '@/components/night/icons';
import { openNotification } from '@/app/dashboard/actions';
import type { NotificationRow } from '@/lib/queries/notifications';
import { timeAgo } from '@/lib/time';

const BADGE = { fork: ForkIcon, comment: CommentIcon, follow: FollowIcon };

function NoteText({ n }: { n: NotificationRow }) {
  const actor = <b>@{n.actor?.handle}</b>;
  if (n.type === 'follow') return <>{actor} followed you</>;
  const verb = n.type === 'fork' ? 'forked' : 'commented on';
  return <>{actor} {verb} <b>{n.skill?.title}</b></>;
}

// The Activity panel's list: each notification is a form that marks it read and
// opens the skill or profile.
export function NotificationList({ notifications }: { notifications: NotificationRow[] }) {
  return (
    <ul className="notes">
      {notifications.length ? notifications.map((n) => {
        const Badge = BADGE[n.type];
        return (
          <li key={n.id} className={n.read_at ? 'note-li' : 'note-li unread'}>
            <form action={openNotification.bind(null, n.id)}>
              <button type="submit" className="note-btn">
                <span className="note-av">
                  <AvatarInitial handle={n.actor?.handle ?? ''} />
                  <span className={`badge ${n.type}`}><Badge /></span>
                </span>
                <div className="note-main">
                  <span className="note-text"><NoteText n={n} /></span>
                  <span className="note-time">
                    {n.read_at ? null : <span className="udot" role="img" aria-label="Unread" />}
                    {timeAgo(n.created_at)}
                  </span>
                </div>
              </button>
            </form>
          </li>
        );
      }) : (
        <li className="srows-empty">
          <strong>Nothing yet</strong>
          When someone forks, comments or follows, it shows up here.
        </li>
      )}
    </ul>
  );
}
