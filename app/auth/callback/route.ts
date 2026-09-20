import { NextRequest, NextResponse } from 'next/server';
import { getSafeRedirect } from '@/lib/auth-config';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { AUTH_ACTIVITY_COOKIE, AUTH_ACTIVITY_KEY_COOKIE } from '@/lib/auth-config';
import { buildActivityCookie } from '@/lib/auth-server';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const next = getSafeRedirect(req.nextUrl.searchParams.get('next'));
  if (!code) return NextResponse.redirect(new URL('/login?reason=auth_error', req.url));

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL('/login?reason=auth_error', req.url));

  const { data: { user } } = await supabase.auth.getUser();
  const { data: { session } } = await supabase.auth.getSession();
  if (!user || !session) return NextResponse.redirect(new URL('/login?reason=auth_error', req.url));

  const response = NextResponse.redirect(new URL(next, req.url));
  const key = req.cookies.get(AUTH_ACTIVITY_KEY_COOKIE)?.value || randomUUID();
  const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: 60 * 60 * 24 * 30 };
  response.cookies.set(AUTH_ACTIVITY_KEY_COOKIE, key, options);
  response.cookies.set(AUTH_ACTIVITY_COOKIE, await buildActivityCookie(key), options);
  return response;
}
