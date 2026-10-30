import Link from 'next/link';
import { HiveMark } from '@/components/hive-mark';
import { NavLink } from '@/components/nav-link';

export function SiteHeader() {
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
        </nav>
        <div className="bar-right">
          <Link className="signin" href="/sign-in">Sign in</Link>
        </div>
      </div>
    </header>
  );
}
