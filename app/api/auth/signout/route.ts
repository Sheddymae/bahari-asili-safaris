import { NextResponse } from 'next/server';
import { AUTH_ACTIVITY_COOKIE, AUTH_SESSION_COOKIE } from '@/lib/auth-config';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_SESSION_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
  response.cookies.set(AUTH_ACTIVITY_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 });
  return response;
}
