import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PageShell } from '@/components/night/page-shell';
import { PlusIcon } from '@/components/night/icons';
import { Sparkline } from '@/components/dashboard/sparkline';
import { SkillsPanel } from '@/components/dashboard/skills-panel';
import { NotificationList } from '@/components/dashboard/notification-list';
import { markAllNotificationsRead } from '@/app/dashboard/actions';
import { getCurrentProfile } from '@/lib/profile';
import { ensureOrganization } from '@/lib/organization';
import { dashboardStats, skillRows, type StatKey } from '@/lib/queries/dashboard';
import { listNotifications } from '@/lib/queries/notifications';

const STATS: { key: StatKey; label: string }[] = [
  { key: 'stars', label: 'Stars received' },
  { key: 'published', label: 'Skills published' },
  { key: 'forks', label: 'Forks of your skills' },
  { key: 'followers', label: 'Followers' },
];

export default async function DashboardPage() {
  const me = await getCurrentProfile();
  if (!me) redirect('/sign-in?redirect_url=/dashboard');

  const org = await ensureOrganization();
  const [stats, skills, forks, notifications, teamSkills] = await Promise.all([
    dashboardStats(),
    skillRows({ authorId: me.id, forks: false }),
    skillRows({ authorId: me.id, forks: true }),
    listNotifications(),
    org ? skillRows({ orgId: org.id }) : Promise.resolve([]),
  ]);
  const unread = notifications.filter((n) => !n.read_at).length;

  return (
    <PageShell className="dash">
      <div className="dash-top">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="dash-sub">Welcome back, @{me.handle}. Here’s how your skills are doing.</p>
        </div>
        <Link className="btn-ember dash-cta" href="/publish"><PlusIcon />Publish a skill</Link>
      </div>
      <div className="stats">
        {STATS.map(({ key, label }) => {
          const s = stats[key];
          return (
            <div key={key} className="stat">
              <span className="stat-label">{label}</span>
              <span className="stat-value">{s.total}</span>
              <span className="stat-foot">
                <span className="stat-delta">{s.week ? `+${s.week} this week` : 'No change this week'}</span>
                <Sparkline values={s.series} />
              </span>
            </div>
          );
        })}
      </div>
      <div className="dash-grid">
        <SkillsPanel skills={skills} forks={forks} team={org ? { name: org.name, skills: teamSkills } : null} />
        <aside className="panel" aria-label="Activity">
          <div className="panel-head">
            <h2>Activity {unread ? <span className="new-count">{unread} new</span> : null}</h2>
            {unread ? (
              <form action={markAllNotificationsRead}>
                <button type="submit" className="link-btn">Mark all as read</button>
              </form>
            ) : null}
          </div>
          <NotificationList notifications={notifications} />
        </aside>
      </div>
    </PageShell>
  );
}
