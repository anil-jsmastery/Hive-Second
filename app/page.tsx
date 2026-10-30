import { Honeycomb } from '@/components/night/honeycomb';
import { HeroCta } from '@/components/landing/hero-cta';
import { ActivityFeed, type FeedRow } from '@/components/landing/activity-feed';
import { FitLead } from '@/components/landing/fit-lead';
import { latestActivity } from '@/lib/queries/activity';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const rows = (await latestActivity()) as FeedRow[];

  return (
    <section className="hero">
      <Honeycomb fx={0.7} fy={0.45} />
      <div className="hero-inner">
        <div className="intro">
          <h1>The registry for agent skills.</h1>
          <p className="lead">Find, install and share the Markdown playbooks your AI agents run on, from code reviews to commit messages.</p>
          <HeroCta />
        </div>
        <ActivityFeed rows={rows} />
      </div>
      <FitLead />
    </section>
  );
}
