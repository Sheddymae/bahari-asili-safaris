import { NextRequest, NextResponse } from 'next/server';
import { AUTH_ACTIVITY_COOKIE } from '@/lib/auth-config';
import { buildActivityCookie, getAccessTokenFromCookies, isInactive } from '@/lib/auth-server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const token = getAccessTokenFromCookies();
  if (!token) return NextResponse.json({ success: false }, { status: 401 });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    const response = NextResponse.json({ success: false }, { status: 401 });
    response.cookies.delete(AUTH_ACTIVITY_COOKIE);
    return response;
  }

  const force = req.headers.get('x-auth-activity-force') === '1';
  if (!force && await isInactive(token)) {
    return NextResponse.json({ success: false, reason: 'inactive' }, { status: 440 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_ACTIVITY_COOKIE, await buildActivityCookie(token), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
