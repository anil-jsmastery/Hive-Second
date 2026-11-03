import 'server-only';
import { cookies } from 'next/headers';
import { PostHog } from 'posthog-node';
import type { EventName, EventProps } from './events';

// Swarm agents carry a hive_cohort cookie (set in instrumentation-client.ts), so
// events sent from the server get the same cohort and persona as their browser
// events. Real visitors never have it. Outside a request (no cookies), it's skipped.
async function swarmProperties(): Promise<Record<string, string>> {
  try {
    const jar = await cookies();
    const cohort = jar.get('hive_cohort')?.value;
    if (!cohort) return {};
    const persona = jar.get('hive_persona')?.value;
    return { cohort, ...(persona ? { persona } : {}) };
  } catch {
    return {};
  }
}

function client() {
  return new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
}

// distinctId is the Clerk user id. Pass orgId when the action happens inside a team.
export async function trackServer<E extends EventName>(
  distinctId: string,
  event: E,
  properties: EventProps[E],
  orgId?: string | null,
) {
  const ph = client();
  ph.capture({
    distinctId,
    event,
    properties: { ...(await swarmProperties()), ...properties, source: 'server' },
    ...(orgId ? { groups: { organization: orgId } } : {}),
  });
  await ph.shutdown();
}

export async function setPersonProperties(userId: string, properties: Record<string, string>) {
  const ph = client();
  ph.identify({ distinctId: userId, properties });
  await ph.shutdown();
}

export async function identifyOrganization(orgId: string, properties: { name: string; slug: string }) {
  const ph = client();
  ph.groupIdentify({ groupType: 'organization', groupKey: orgId, properties });
  await ph.shutdown();
}

export async function getFlag(userId: string, key: string) {
  const ph = client();
  const value = await ph.getFeatureFlag(key, userId);
  await ph.shutdown();
  return value;
}
