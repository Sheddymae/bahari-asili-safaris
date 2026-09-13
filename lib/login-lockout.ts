import { getSupabaseAdmin } from '@/lib/supabase-admin';

// Node-only (uses the Supabase service-role client). Do NOT import from
// middleware.ts (edge runtime) — this is only used from the login API route.
//
// Unlike lib/rate-limit.ts (in-memory, resets on cold serverless starts),
// this persists fail counts in the `admin_login_attempts` table so a real
// 5-fails -> 15-minute lock holds even across separate function invocations.

export const LOGIN_MAX_ATTEMPTS = 5;
export const LOGIN_LOCK_MINUTES = 15;

export interface LockoutStatus {
  allowed: boolean;
  retryAfterSeconds?: number;
}

/** Checks whether `identifier` (e.g. "ip:1.2.3.4|user:Admin") is currently locked out. */
export async function checkLoginLockout(identifier: string): Promise<LockoutStatus> {
  try {
    const admin = getSupabaseAdmin();
    const { data } = await admin
      .from('admin_login_attempts')
      .select('locked_until')
      .eq('identifier', identifier)
      .maybeSingle();

    if (data?.locked_until) {
      const lockedUntil = new Date(data.locked_until).getTime();
      const now = Date.now();
      if (lockedUntil > now) {
        return { allowed: false, retryAfterSeconds: Math.ceil((lockedUntil - now) / 1000) };
      }
    }
    return { allowed: true };
  } catch (err) {
    // Fail open on infra errors — a misconfigured/unreachable DB should not
    // itself become a way to lock every admin out permanently. The in-memory
    // limiter in lib/rate-limit.ts still applies as a backstop.
    console.error('checkLoginLockout error:', err);
    return { allowed: true };
  }
}

/** Records a failed attempt; locks the identifier once it hits LOGIN_MAX_ATTEMPTS. */
export async function recordLoginFailure(identifier: string): Promise<void> {
  try {
    const admin = getSupabaseAdmin();
    const { data } = await admin
      .from('admin_login_attempts')
      .select('fail_count, locked_until')
      .eq('identifier', identifier)
      .maybeSingle();

    const now = Date.now();
    // If a previous lock has expired, treat this as a fresh count.
    const stillLocked = data?.locked_until && new Date(data.locked_until).getTime() > now;
    const nextCount = stillLocked ? (data?.fail_count || 0) : (data?.fail_count || 0) + 1;

    const shouldLock = nextCount >= LOGIN_MAX_ATTEMPTS;
    const lockedUntil = shouldLock ? new Date(now + LOGIN_LOCK_MINUTES * 60 * 1000).toISOString() : (stillLocked ? data!.locked_until : null);

    await admin.from('admin_login_attempts').upsert(
      {
        identifier,
        fail_count: shouldLock ? 0 : nextCount,
        locked_until: lockedUntil,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'identifier' }
    );
  } catch (err) {
    console.error('recordLoginFailure error:', err);
  }
}

/** Clears the failure count on a successful login. */
export async function clearLoginAttempts(identifier: string): Promise<void> {
  try {
    const admin = getSupabaseAdmin();
    await admin.from('admin_login_attempts').delete().eq('identifier', identifier);
  } catch (err) {
    console.error('clearLoginAttempts error:', err);
  }
}
