import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSession,
  refreshAdminSession,
  adminCookieOptions,
  ADMIN_IDLE_SECONDS,
} from '@/lib/admin-auth';
import { AUTH_ACTIVITY_COOKIE, AUTH_ACTIVITY_KEY_COOKIE, INACTIVITY_LIMIT_MS } from '@/lib/auth-config';
import { buildActivityCookie, verifyActivityValue } from '@/lib/auth-activity';

const PROTECTED_API_PREFIX = '/api/admin';
const ADMIN_PAGE_PREFIX = '/auth/dashboard';
const ADMIN_LEGACY_PREFIX = '/admin';
const ADMIN_LOGIN = '/auth/login';
const CUSTOMER_LOGIN = '/login';
const CUSTOMER_PROTECTED_PREFIXES = ['/dashboard', '/account'];
function applySecurityHeaders(res: NextResponse, protectedRoute = false) {
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.headers.set('X-DNS-Prefetch-Control', 'on');
  res.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  if (process.env.NODE_ENV === 'production') {
    res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  if (protectedRoute) res.headers.set('Cache-Control', 'private, no-store, max-age=0, must-revalidate');
  return res;
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach(cookie => to.cookies.set(cookie));
  return to;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get('host') || '';
  const isPreviewHost = host.includes('vercel.app');

  const adminToken = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const adminSession = await verifyAdminSession(adminToken);
  if (adminSession && (pathname === '/dashboard' || pathname === '/login' || pathname === '/signup')) return NextResponse.redirect(new URL(ADMIN_PAGE_PREFIX, req.url));
  // The login endpoint must remain public so an unauthenticated admin can obtain
  // the session cookie that protects the rest of /api/admin.
  const isAdminLoginApi = pathname === '/api/admin/login';
  const isAdminRoute = pathname.startsWith(ADMIN_PAGE_PREFIX) || pathname === ADMIN_LEGACY_PREFIX || pathname.startsWith(ADMIN_LEGACY_PREFIX + '/') || (pathname.startsWith(PROTECTED_API_PREFIX) && !isAdminLoginApi);

  if (isAdminRoute) {
    if (!adminSession) {
      if (pathname.startsWith('/api/')) return applySecurityHeaders(NextResponse.json({ success: false, error: 'Unauthorized' }), true);
      const url = new URL(ADMIN_LOGIN, req.url);
      url.searchParams.set('redirect', pathname + req.nextUrl.search);
      return applySecurityHeaders(NextResponse.redirect(url), true);
    }
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-admin-username', adminSession.username);
    requestHeaders.set('x-admin-role', adminSession.role);
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    const idleElapsed = Date.now() - adminSession.lastActivity;
    if (idleElapsed > (ADMIN_IDLE_SECONDS * 1000) / 4) {
      const refreshed = await refreshAdminSession(adminSession);
      res.cookies.set(ADMIN_COOKIE_NAME, refreshed, adminCookieOptions(ADMIN_IDLE_SECONDS));
    }
    if (isPreviewHost) res.headers.set('x-robots-tag', 'noindex, nofollow');
    return applySecurityHeaders(res, true);
  }

  let supabaseResponse = NextResponse.next({ request: req });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key_for_development',
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();
  const activityKey = req.cookies.get(AUTH_ACTIVITY_KEY_COOKIE)?.value || (user ? crypto.randomUUID() : '');
  const activityValue = req.cookies.get(AUTH_ACTIVITY_COOKIE)?.value;
  let activity = activityKey ? await verifyActivityValue(activityValue, activityKey) : null;

  if (user && !activity) {
    activity = Date.now();
    const value = await buildActivityCookie(activityKey, activity);
    supabaseResponse.cookies.set(AUTH_ACTIVITY_KEY_COOKIE, activityKey, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
    supabaseResponse.cookies.set(AUTH_ACTIVITY_COOKIE, value, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
  }

  const inactive = Boolean(user && activity && Date.now() - activity >= INACTIVITY_LIMIT_MS);
  const isCustomerRoute = CUSTOMER_PROTECTED_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(prefix + '/'));

  if (inactive) {
    const clearCookies = (response: NextResponse) => {
      response.cookies.set(AUTH_ACTIVITY_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
      response.cookies.set(AUTH_ACTIVITY_KEY_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
      return response;
    };
    if (pathname.startsWith('/api/')) {
      return applySecurityHeaders(clearCookies(copyCookies(supabaseResponse, NextResponse.json({ success: false, reason: 'inactive' }, { status: 401 }))), true);
    }
    const url = new URL(CUSTOMER_LOGIN, req.url);
    url.searchParams.set('reason', 'inactive');
    if (isCustomerRoute) url.searchParams.set('redirect', pathname);
    return applySecurityHeaders(clearCookies(copyCookies(supabaseResponse, NextResponse.redirect(url))), isCustomerRoute);
  }

  if ((pathname === CUSTOMER_LOGIN || pathname === '/signup') && user) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (isCustomerRoute && !user) {
    const url = new URL(CUSTOMER_LOGIN, req.url);
    url.searchParams.set('redirect', pathname);
    const redirect = copyCookies(supabaseResponse, NextResponse.redirect(url));
    return applySecurityHeaders(redirect, true);
  }

  if (isPreviewHost) supabaseResponse.headers.set('x-robots-tag', 'noindex, nofollow');
  return applySecurityHeaders(supabaseResponse, isCustomerRoute);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/|videos/).*)'],
};
