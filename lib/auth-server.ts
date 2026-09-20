import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { AUTH_ACTIVITY_COOKIE, AUTH_ACTIVITY_KEY_COOKIE, INACTIVITY_LIMIT_MS } from '@/lib/auth-config';

export async function getServerUser() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user || null;
}

export async function getServerSession() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session ? { user, session } : null;
}

export async function activitySignature(timestamp: number, secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(String(timestamp)));
  return Array.from(new Uint8Array(signature)).map(value => value.toString(16).padStart(2, '0')).join('');
}

export async function buildActivityCookie(secret: string, timestamp = Date.now()) {
  return `${timestamp}.${await activitySignature(timestamp, secret)}`;
}

export async function verifyActivityValue(value: string | null | undefined, secret: string) {
  if (!value || !secret) return null;
  const [raw, signature] = value.split('.');
  const timestamp = Number(raw);
  if (!Number.isFinite(timestamp) || timestamp > Date.now() + 5000 || !signature) return null;
  const expected = await activitySignature(timestamp, secret);
  if (signature.length !== expected.length) return null;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  return mismatch === 0 ? timestamp : null;
}

export async function readActivityTimestamp() {
  const store = cookies();
  const secret = store.get(AUTH_ACTIVITY_KEY_COOKIE)?.value;
  return verifyActivityValue(store.get(AUTH_ACTIVITY_COOKIE)?.value, secret || '');
}

export async function isInactive() {
  const timestamp = await readActivityTimestamp();
  return !timestamp || Date.now() - timestamp >= INACTIVITY_LIMIT_MS;
}
