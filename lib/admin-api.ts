import { NextResponse, type NextRequest } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSession,
  type AdminRole,
  type AdminSessionPayload,
} from '@/lib/admin-auth';

/**
 * Re-verifies the signed admin session cookie inside an API route.
 *
 * middleware.ts already gates every /api/admin/* request and forwards the
 * caller's identity in x-admin-* headers, but the headers and the routing
 * matcher are not a substitute for checking the session in the handler. A new
 * route, a matcher change or a direct invocation would otherwise be open.
 */
export async function getAdminSession(req: NextRequest): Promise<AdminSessionPayload | null> {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSession(token);
}

export function unauthorizedAdminResponse() {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}

export function forbiddenAdminResponse(message = 'You do not have permission to perform this action.') {
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}

/** Returns the session, or null when the caller must be rejected with 401. */
export async function requireAdmin(req: NextRequest): Promise<AdminSessionPayload | null> {
  return getAdminSession(req);
}

export function isOwner(session: Pick<AdminSessionPayload, 'role'> | null): boolean {
  return session?.role === ('owner' satisfies AdminRole);
}
