import 'server-only';
import { cookies } from 'next/headers';
import { getFlag } from '@/lib/analytics/server';

// Where a new user goes after onboarding. Only people who had a page to return to
// (saved by RememberReturn) enter the signup-return experiment: getFlag assigns
// their variant and records the exposure. Step 18: everyone still goes to /explore.
// Step 19 sends the test variant back to the saved page.
export async function pathAfterOnboarding(userId: string): Promise<string> {
  const jar = await cookies();
  const saved = jar.get('hive_return_to')?.value;
  jar.delete('hive_return_to');
  const returnTo = saved ? decodeURIComponent(saved) : '';
  if (!returnTo.startsWith('/') || returnTo.startsWith('//')) return '/explore';

  await getFlag(userId, 'signup-return');
  return '/explore';
}
