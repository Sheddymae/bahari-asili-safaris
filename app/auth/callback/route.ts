import { NextRequest, NextResponse } from 'next/server';
import { getSafeRedirect } from '@/lib/auth-config';
import { supabase } from '@/lib/supabase';
import { AUTH_ACTIVITY_COOKIE, AUTH_SESSION_COOKIE } from '@/lib/auth-config';
import { buildActivityCookie } from '@/lib/auth-server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const next = getSafeRedirect(req.nextUrl.searchParams.get('next'));

  if (!code) return NextResponse.redirect(new URL('/login?reason=auth_error', req.url));

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.session) return NextResponse.redirect(new URL('/login?reason=auth_error', req.url));

  const response = NextResponse.redirect(new URL(next, req.url));
  const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: 60 * 60 * 24 * 7 };
  response.cookies.set(AUTH_SESSION_COOKIE, data.session.access_token, options);
  response.cookies.set(AUTH_ACTIVITY_COOKIE, buildActivityCookie(data.session.access_token), options);
  return response;
}
