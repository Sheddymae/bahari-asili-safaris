import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSession,
  refreshAdminSession,
  adminCookieOptions,
  ADMIN_IDLE_SECONDS,
} from '@/lib/admin-auth';

const PROTECTED_API_PREFIX = '/api/admin';
const PROTECTED_PAGE = '/auth/dashboard';
const LOGIN_PAGE = '/auth/login';
const LOGIN_API = '/api/admin/login';

// Lightweight abuse protection for public booking submissions.
// This is intentionally conservative and does not replace provider-level WAF/rate limiting.
const bookingHits = new Map<string, { count: number; resetAt: number }>();
const BOOKING_WINDOW_MS = 10 * 60 * 1000;
const BOOKING_MAX = 8;

function isLoginApi(pathname: string) {
  return pathname === LOGIN_API || pathname === `${LOGIN_API}/`;
}

function getClientKey(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

function applySecurityHeaders(res: NextResponse) {
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get('host') || '';
  const isPreviewHost = host.includes('vercel.app');

  if (pathname === '/api/booking' && req.method === 'POST') {
    const key = getClientKey(req);
    const now = Date.now();
    const existing = bookingHits.get(key);
    const hit = !existing || existing.resetAt <= now
      ? { count: 1, resetAt: now + BOOKING_WINDOW_MS }
      : { count: existing.count + 1, resetAt: existing.resetAt };
    bookingHits.set(key, hit);

    if (hit.count > BOOKING_MAX) {
      return applySecurityHeaders(new NextResponse(JSON.stringify({
        success: false,
        error: 'Too many booking requests. Please wait a few minutes and try again.',
      }), { status: 429, headers: { 'content-type': 'application/json', 'Retry-After': String(Math.ceil((hit.resetAt - now) / 1000)) } }));
    }
  }

  if (isLoginApi(pathname)) {
    const res = NextResponse.next();
    if (isPreviewHost) res.headers.set('x-robots-tag', 'noindex, nofollow');
    return applySecurityHeaders(res);
  }

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminSession(token);
  const needsAuth = pathname.startsWith(PROTECTED_API_PREFIX) || pathname.startsWith(PROTECTED_PAGE);

  if (needsAuth && !session) {
    if (pathname.startsWith('/api/')) {
      return applySecurityHeaders(new NextResponse(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } }));
    }
    const loginUrl = new URL(LOGIN_PAGE, req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === LOGIN_PAGE && session) return NextResponse.redirect(new URL(PROTECTED_PAGE, req.url));

  if (needsAuth && session) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-admin-username', session.username);
    requestHeaders.set('x-admin-role', session.role);
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    const idleElapsed = Date.now() - session.lastActivity;
    if (idleElapsed > (ADMIN_IDLE_SECONDS * 1000) / 4) {
      const refreshed = await refreshAdminSession(session);
      res.cookies.set(ADMIN_COOKIE_NAME, refreshed, adminCookieOptions(ADMIN_IDLE_SECONDS));
    }
    if (isPreviewHost) res.headers.set('x-robots-tag', 'noindex, nofollow');
    return applySecurityHeaders(res);
  }

  const res = NextResponse.next();
  if (isPreviewHost) res.headers.set('x-robots-tag', 'noindex, nofollow');
  return applySecurityHeaders(res);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/|videos/).*)'],
};
