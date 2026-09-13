import { SignJWT, jwtVerify } from 'jose';

// Edge-compatible (uses `jose`, not `crypto`) — safe to import from middleware.ts.

export const ADMIN_COOKIE_NAME = 'bas_admin_session';

export type AdminRole = 'owner' | 'staff';

// Two independent limits on a session:
//  - IDLE:     30 min of no activity -> logged out (spec requirement).
//  - ABSOLUTE: 8h from login, no matter how active -> logged out.
export const ADMIN_IDLE_SECONDS = 30 * 60;
export const ADMIN_ABSOLUTE_SECONDS = 8 * 60 * 60;

function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      'ADMIN_SESSION_SECRET is not set (or too short). Set a long random string in your environment variables.'
    );
  }
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  username: string;
  role: AdminRole;
  sessionStart: number; // ms epoch — fixed at login, never refreshed
  lastActivity: number; // ms epoch — refreshed on every authenticated request
}

/** Sign a brand-new session (call this at login). */
export async function signAdminSession(username: string, role: AdminRole): Promise<string> {
  const now = Date.now();
  return await new SignJWT({ username, role, sessionStart: now, lastActivity: now })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_ABSOLUTE_SECONDS}s`)
    .sign(getSecretKey());
}

/**
 * Re-sign a session that has already passed verifyAdminSession, refreshing
 * lastActivity to now (sliding idle window) while keeping the original
 * sessionStart (so the 8h absolute cap can't be extended indefinitely).
 */
export async function refreshAdminSession(payload: AdminSessionPayload): Promise<string> {
  const now = Date.now();
  const remainingAbsoluteMs = payload.sessionStart + ADMIN_ABSOLUTE_SECONDS * 1000 - now;
  const remainingSeconds = Math.max(1, Math.floor(remainingAbsoluteMs / 1000));
  return await new SignJWT({
    username: payload.username,
    role: payload.role,
    sessionStart: payload.sessionStart,
    lastActivity: now,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${remainingSeconds}s`)
    .sign(getSecretKey());
}

/**
 * Returns the decoded session payload, or null if missing/invalid/expired/idle.
 * Enforces both the 30-min idle timeout and the 8h absolute cap.
 */
export async function verifyAdminSession(token: string | undefined | null): Promise<AdminSessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      (payload.role !== 'owner' && payload.role !== 'staff') ||
      typeof payload.username !== 'string' ||
      typeof payload.sessionStart !== 'number' ||
      typeof payload.lastActivity !== 'number'
    ) {
      return null;
    }

    const now = Date.now();
    if (now - payload.lastActivity > ADMIN_IDLE_SECONDS * 1000) return null; // idle timeout
    if (now - payload.sessionStart > ADMIN_ABSOLUTE_SECONDS * 1000) return null; // absolute cap

    return {
      username: payload.username,
      role: payload.role,
      sessionStart: payload.sessionStart,
      lastActivity: payload.lastActivity,
    };
  } catch {
    return null;
  }
}

/** Cookie options shared by login (set) and logout (clear). */
export function adminCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  };
}
