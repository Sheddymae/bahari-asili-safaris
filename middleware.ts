import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSession,
  refreshAdminSession,
  adminCookieOptions,
  ADMIN_IDLE_SECONDS,
} from '@/lib/admin-auth';

// Edge runtime — only edge-safe code (jose) may run here.
// Database calls stay inside Node.js API routes.

const PROTECTED_API_PREFIX = '/api/admin';
const PROTECTED_PAGE = '/auth/dashboard';
const LOGIN_PAGE = '/auth/login';

// IMPORTANT:
// The login endpoint MUST remain publicly reachable.
// Otherwise middleware returns "Unauthorized" before the login
// API route can verify the username/password.
const LOGIN_API = '/api/admin/login';

// Treat both /api/admin/login and /api/admin/login/ as public.
// This prevents the login request from ever being rejected by the
// admin-protection rule before the credentials are checked.
function isLoginApi(pathname: string) {
  return pathname === LOGIN_API || pathname === `${LOGIN_API}/`;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get('host') || '';
  const isPreviewHost = host.includes('vercel.app');

  // ------------------------------------------------------------
  // ALLOW THE LOGIN API WITHOUT AN EXISTING SESSION
  // ------------------------------------------------------------
  if (isLoginApi(pathname)) {
    const res = NextResponse.next();

    if (isPreviewHost) {
      res.headers.set('x-robots-tag', 'noindex, nofollow');
    }

    return res;
  }

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminSession(token);

  const needsAuth =
    !isLoginApi(pathname) &&
    (pathname.startsWith(PROTECTED_API_PREFIX) ||
      pathname.startsWith(PROTECTED_PAGE));

  // ------------------------------------------------------------
  // UNAUTHENTICATED ACCESS TO PROTECTED ROUTES
  // ------------------------------------------------------------
  if (needsAuth && !session) {
    if (pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: 'Unauthorized',
        }),
        {
          status: 401,
          headers: {
            'content-type': 'application/json',
          },
        }
      );
    }

    const loginUrl = new URL(LOGIN_PAGE, req.url);
    loginUrl.searchParams.set('redirect', pathname);

    return NextResponse.redirect(loginUrl);
  }

  // ------------------------------------------------------------
  // ALREADY LOGGED IN → SEND TO DASHBOARD
  // ------------------------------------------------------------
  if (pathname === LOGIN_PAGE && session) {
    return NextResponse.redirect(
      new URL(PROTECTED_PAGE, req.url)
    );
  }

  // ------------------------------------------------------------
  // AUTHENTICATED PROTECTED REQUEST
  // ------------------------------------------------------------
  if (needsAuth && session) {
    const requestHeaders = new Headers(req.headers);

    requestHeaders.set(
      'x-admin-username',
      session.username
    );

    requestHeaders.set(
      'x-admin-role',
      session.role
    );

    const res = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    // Refresh the idle timeout periodically instead of
    // rewriting the cookie on every request.
    const idleElapsed =
      Date.now() - session.lastActivity;

    if (
      idleElapsed >
      (ADMIN_IDLE_SECONDS * 1000) / 4
    ) {
      const refreshed =
        await refreshAdminSession(session);

      res.cookies.set(
        ADMIN_COOKIE_NAME,
        refreshed,
        adminCookieOptions(ADMIN_IDLE_SECONDS)
      );
    }

    if (isPreviewHost) {
      res.headers.set(
        'x-robots-tag',
        'noindex, nofollow'
      );
    }

    return res;
  }

  // ------------------------------------------------------------
  // PUBLIC REQUEST
  // ------------------------------------------------------------
  const res = NextResponse.next();

  if (isPreviewHost) {
    res.headers.set(
      'x-robots-tag',
      'noindex, nofollow'
    );
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|videos/).*)',
  ],
};