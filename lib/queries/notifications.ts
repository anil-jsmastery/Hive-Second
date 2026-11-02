import 'server-only';
import { createServerSupabase } from '@/lib/supabase/server';

export type NotificationRow = {
  id: string;
  type: 'fork' | 'comment' | 'follow';
  read_at: string | null;
  created_at: string;
  actor: { handle: string } | null;
  skill: { slug: string; title: string } | null;
};

// The signed-in user's latest notifications, newest first. RLS limits them to
// the current user.
export async function listNotifications(): Promise<NotificationRow[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, read_at, created_at, actor:profiles!notifications_actor_id_fkey(handle), skill:skills!notifications_skill_id_fkey(slug, title)')
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) throw error;
  return (data ?? []) as unknown as NotificationRow[];
}

// How many of the signed-in user's notifications are unread.
export async function unreadCount(): Promise<number> {
  const supabase = await createServerSupabase();
  const { count } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .is('read_at', null);
  return count ?? 0;
}
