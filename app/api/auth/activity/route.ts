import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { AUTH_ACTIVITY_COOKIE, AUTH_ACTIVITY_KEY_COOKIE } from '@/lib/auth-config';
import { buildActivityCookie, verifyActivityValue } from '@/lib/auth-server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false }, { status: 401 });

  const key = req.cookies.get(AUTH_ACTIVITY_KEY_COOKIE)?.value || randomUUID();
  const current = await verifyActivityValue(req.cookies.get(AUTH_ACTIVITY_COOKIE)?.value, key);
  const force = req.headers.get('x-auth-activity-force') === '1';
  if (!force && (!current || Date.now() - current >= 5 * 60 * 1000)) {
    return NextResponse.json({ success: false, reason: 'inactive' }, { status: 440 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_ACTIVITY_KEY_COOKIE, key, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
  });
  response.cookies.set(AUTH_ACTIVITY_COOKIE, await buildActivityCookie(key), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
