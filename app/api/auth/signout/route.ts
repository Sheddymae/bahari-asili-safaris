import { NextResponse } from 'next/server';
import { AUTH_ACTIVITY_COOKIE, AUTH_ACTIVITY_KEY_COOKIE } from '@/lib/auth-config';

export async function POST() {
  const response = NextResponse.json({ success: true });
  const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: 0 };
  response.cookies.set(AUTH_ACTIVITY_COOKIE, '', options);
  response.cookies.set(AUTH_ACTIVITY_KEY_COOKIE, '', options);
  return response;
}
