import { NextRequest, NextResponse } from 'next/server';
import { getSafeRedirect } from '@/lib/auth-config';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { AUTH_ACTIVITY_COOKIE, AUTH_ACTIVITY_KEY_COOKIE } from '@/lib/auth-config';
import { buildActivityCookie } from '@/lib/auth-activity';
import { randomUUID } from 'crypto';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const next = getSafeRedirect(req.nextUrl.searchParams.get('next'));
  if (!code) return NextResponse.redirect(new URL('/login?reason=auth_error', req.url));

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL('/login?reason=auth_error', req.url));

  const { data: { user } } = await supabase.auth.getUser();
  const { data: { session } } = await supabase.auth.getSession();
  if (!user || !session) return NextResponse.redirect(new URL('/login?reason=auth_error', req.url));

  try {
    const admin = await import('@/lib/supabase-admin').then(m => m.getSupabaseAdmin());
    if (user.email) {
      const email = user.email.toLowerCase();
      const { data: bookings } = await admin.from('bookings').select('id').is('user_id', null).ilike('email', email);
      const ids = (bookings || []).map((row: { id:number }) => row.id);
      if (ids.length) {
        await admin.from('bookings').update({ user_id: user.id }).in('id', ids).is('user_id', null);
        await admin.from('invoices').update({ user_id: user.id }).in('booking_id', ids).is('user_id', null);
      }
      await admin.from('client_documents').update({ user_id: user.id }).eq('email', email).is('user_id', null);
    }
  } catch (linkError) {
    console.error('Auth callback booking linking failed:', linkError);
  }

  const response = NextResponse.redirect(new URL(next, req.url));
  const key = req.cookies.get(AUTH_ACTIVITY_KEY_COOKIE)?.value || randomUUID();
  const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/', maxAge: 60 * 60 * 24 * 30 };
  response.cookies.set(AUTH_ACTIVITY_KEY_COOKIE, key, options);
  response.cookies.set(AUTH_ACTIVITY_COOKIE, await buildActivityCookie(key), options);
  return response;
}
