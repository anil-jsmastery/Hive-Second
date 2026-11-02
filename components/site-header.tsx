import Link from 'next/link';
import { Show, SignInButton } from '@clerk/nextjs';
import { HiveMark } from '@/components/hive-mark';
import { NavLink } from '@/components/nav-link';
import { UserMenu } from '@/components/user-menu';
import { getCurrentProfile } from '@/lib/profile';
import { unreadCount } from '@/lib/queries/notifications';

export async function SiteHeader() {
  const profile = await getCurrentProfile();
  const unread = profile ? await unreadCount() : 0;
  return (
    <header className="site-header">
      <div className="bar-inner">
        <Link className="logo" href="/">
          <HiveMark />
          <span className="logo-text">Hive</span>
        </Link>
        <nav className="nav-links" aria-label="Main">
          <NavLink href="/explore">Explore</NavLink>
          <NavLink href="/publish">Publish</NavLink>
          <Show when="signed-in">
            <NavLink href="/dashboard">
              Dashboard{unread ? <span className="new-count ml-1.5">{unread}</span> : null}
            </NavLink>
          </Show>
        </nav>
        <div className="bar-right">
          <Show when="signed-out">
            <SignInButton>
              <button type="button" className="signin">Sign in</button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserMenu handle={profile?.handle ?? null} />
          </Show>
        </div>
      </div>
    </header>
  );
}
