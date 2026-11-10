import 'server-only';
import { cookies } from 'next/headers';
import { getFlag } from '@/lib/analytics/server';

// Where a new user goes after onboarding. Only people who had a page to return to
// (saved by RememberReturn) enter the signup-return experiment: getFlag assigns
// their variant and records the exposure. The test variant goes back to the saved
// page; the control goes to /explore, as before.
export async function pathAfterOnboarding(userId: string): Promise<string> {
  const jar = await cookies();
  const saved = jar.get('hive_return_to')?.value;
  jar.delete('hive_return_to');
  const returnTo = saved ? decodeURIComponent(saved) : '';
  if (!returnTo.startsWith('/') || returnTo.startsWith('//')) return '/explore';

  const variant = await getFlag(userId, 'signup-return');
  return variant === 'test' ? returnTo : '/explore';
}
