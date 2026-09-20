import { NextRequest, NextResponse } from 'next/server';
import { AUTH_ACTIVITY_COOKIE, AUTH_SESSION_COOKIE } from '@/lib/auth-config';
import { buildActivityCookie } from '@/lib/auth-server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const accessToken = typeof body?.accessToken === 'string' ? body.accessToken : '';
  if (!accessToken) return NextResponse.json({ success: false }, { status: 400 });

  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) return NextResponse.json({ success: false }, { status: 401 });

  const response = NextResponse.json({ success: true, userId: data.user.id });
  response.cookies.set(AUTH_SESSION_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.set(AUTH_ACTIVITY_COOKIE, buildActivityCookie(accessToken), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
