export const INACTIVITY_LIMIT_MS = 5 * 60 * 1000;
export const INACTIVITY_WARNING_MS = INACTIVITY_LIMIT_MS - 30 * 1000;

export const AUTH_SESSION_COOKIE = 'bahari-auth-session';
export const AUTH_ACTIVITY_COOKIE = 'bahari-auth-activity';
export const AUTH_ACTIVITY_KEY_COOKIE = 'bahari-auth-activity-key';
export const AUTH_REASON_PARAM = 'reason';

export function isSafeRedirect(value: string | null | undefined): value is string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return false;
  try {
    const url = new URL(value, 'https://bahari.local');
    return url.origin === 'https://bahari.local' && !url.pathname.startsWith('/api/');
  } catch {
    return false;
  }
}

export function getSafeRedirect(value: string | null | undefined, fallback = '/dashboard') {
  return isSafeRedirect(value) ? value : fallback;
}
