'use server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { STACKS, type Stack } from '@/lib/constants';
import { createServerSupabase } from '@/lib/supabase/server';
import { setPersonProperties } from '@/lib/analytics/server';
import { pathAfterOnboarding } from '@/lib/return-to';

export async function saveStack(stack: string) {
  if (!STACKS.includes(stack as Stack)) throw new Error('Unknown stack');
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const supabase = await createServerSupabase();
  const { error } = await supabase.from('profiles').update({ stack }).eq('id', userId);
  if (error) throw new Error('Could not save your stack');

  await setPersonProperties(userId, { stack });
  redirect(await pathAfterOnboarding(userId));
}

export async function skipOnboarding() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');
  redirect(await pathAfterOnboarding(userId));
}
