import { createHmac, timingSafeEqual } from 'crypto';
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

function activitySignature(timestamp: number, token: string) {
  return createHmac('sha256', token).update(String(timestamp)).digest('hex');
}

export function buildActivityCookie(token: string, timestamp = Date.now()) {
  return `${timestamp}.${activitySignature(timestamp, token)}`;
}

export function readActivityTimestamp(token: string) {
  const value = cookies().get(AUTH_ACTIVITY_COOKIE)?.value;
  if (!value) return null;
  const [raw, signature] = value.split('.');
  const timestamp = Number(raw);
  if (!Number.isFinite(timestamp) || !signature) return null;
  const expected = activitySignature(timestamp, token);
  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  return timestamp;
}

export function isInactive(token: string) {
  const timestamp = readActivityTimestamp(token);
  if (!timestamp) return true;
  return Date.now() - timestamp >= INACTIVITY_LIMIT_MS;
}

export function clearAuthCookies(response: Response & { cookies?: unknown }) {
  return response;
}
