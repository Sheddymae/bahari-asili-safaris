import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { AUTH_ACTIVITY_COOKIE, AUTH_SESSION_COOKIE, INACTIVITY_LIMIT_MS } from '@/lib/auth-config';

export function getAccessTokenFromCookies() {
  return cookies().get(AUTH_SESSION_COOKIE)?.value || null;
}

export async function getServerUser() {
  const token = getAccessTokenFromCookies();
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return { user: data.user, accessToken: token };
}

export async function activitySignature(timestamp: number, token: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(token),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(String(timestamp)));
  return Array.from(new Uint8Array(signature)).map(value => value.toString(16).padStart(2, '0')).join('');
}

export async function buildActivityCookie(token: string, timestamp = Date.now()) {
  return `${timestamp}.${await activitySignature(timestamp, token)}`;
}

export async function readActivityTimestamp(token: string) {
  const value = cookies().get(AUTH_ACTIVITY_COOKIE)?.value;
  if (!value) return null;
  const [raw, signature] = value.split('.');
  const timestamp = Number(raw);
  if (!Number.isFinite(timestamp) || !signature) return null;
  const expected = await activitySignature(timestamp, token);
  if (signature.length !== expected.length) return null;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  return mismatch === 0 ? timestamp : null;
}

export async function isInactive(token: string) {
  const timestamp = await readActivityTimestamp(token);
  if (!timestamp) return true;
  return Date.now() - timestamp >= INACTIVITY_LIMIT_MS;
}
