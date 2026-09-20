import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { AUTH_ACTIVITY_COOKIE, AUTH_ACTIVITY_KEY_COOKIE, INACTIVITY_LIMIT_MS } from '@/lib/auth-config';

export async function getServerUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user || null;
}

export async function getServerSession() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session ? { user, session } : null;
}

import { verifyActivityValue } from '@/lib/auth-activity';

export async function readActivityTimestamp() {
  const store = await cookies();
  const secret = store.get(AUTH_ACTIVITY_KEY_COOKIE)?.value;
  return verifyActivityValue(store.get(AUTH_ACTIVITY_COOKIE)?.value, secret || '');
}

export async function isInactive() {
  const timestamp = await readActivityTimestamp();
  return !timestamp || Date.now() - timestamp >= INACTIVITY_LIMIT_MS;
}
