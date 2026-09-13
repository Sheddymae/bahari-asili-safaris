import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/password';
import {
  signAdminSession,
  ADMIN_COOKIE_NAME,
  ADMIN_ABSOLUTE_SECONDS,
  adminCookieOptions,
  type AdminRole,
} from '@/lib/admin-auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { checkLoginLockout, recordLoginFailure, clearLoginAttempts } from '@/lib/login-lockout';
import { logAdminAction } from '@/lib/audit-log';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const userAgent = req.headers.get('user-agent') || undefined;

  // Fast in-memory backstop (per-IP, resets on cold start) in addition to
  // the durable per-identifier DB lockout below.
  const memoryLimit = checkRateLimit(`admin-login:${ip}`, 20, 15 * 60 * 1000);
  if (!memoryLimit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many login attempts. Please try again in a few minutes.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required.' }, { status: 400 });
    }

    const identifier = `ip:${ip}|user:${username.toLowerCase()}`;
    const lockout = await checkLoginLockout(identifier);
    if (!lockout.allowed) {
      const minutes = Math.ceil((lockout.retryAfterSeconds || 60) / 60);
      return NextResponse.json(
        { success: false, error: `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.` },
        { status: 429 }
      );
    }

    let matchedUsername: string | null = null;
    let matchedRole: AdminRole | null = null;
    let passwordOk = false;

    // Preferred path: a real row in admin_users.
    try {
      const admin = getSupabaseAdmin();
      const { data: userRow } = await admin
        .from('admin_users')
        .select('username, password_hash, role, is_active')
        .ilike('username', username)
        .maybeSingle();

      if (userRow && userRow.is_active && verifyPassword(password, userRow.password_hash)) {
        matchedUsername = userRow.username;
        matchedRole = userRow.role === 'owner' ? 'owner' : 'staff';
        passwordOk = true;
      }
    } catch (err) {
      console.error('admin_users lookup failed, falling back to env admin:', err);
    }

    // Fallback: legacy single-admin env credentials, treated as the owner
    // account. Lets the site keep working before admin_users is seeded.
    if (!passwordOk) {
      const expectedUsername = process.env.ADMIN_USERNAME || 'Admin';
      const passwordHash = process.env.ADMIN_PASSWORD_HASH;
      if (passwordHash && username === expectedUsername && verifyPassword(password, passwordHash)) {
        matchedUsername = expectedUsername;
        matchedRole = 'owner';
        passwordOk = true;
      }
    }

    if (!passwordOk || !matchedUsername || !matchedRole) {
      await recordLoginFailure(identifier);
      await logAdminAction({ username, action: 'login_failed', ip, userAgent });
      return NextResponse.json({ success: false, error: 'Invalid username or password.' }, { status: 401 });
    }

    await clearLoginAttempts(identifier);

    try {
      const admin = getSupabaseAdmin();
      await admin.from('admin_users').update({ last_login_at: new Date().toISOString() }).ilike('username', matchedUsername);
    } catch {
      // Non-fatal — the legacy env admin has no row to update.
    }

    await logAdminAction({ username: matchedUsername, role: matchedRole, action: 'login_success', ip, userAgent });

    const token = await signAdminSession(matchedUsername, matchedRole);
    const res = NextResponse.json({ success: true, username: matchedUsername, role: matchedRole });
    res.cookies.set(ADMIN_COOKIE_NAME, token, adminCookieOptions(ADMIN_ABSOLUTE_SECONDS));
    return res;
  } catch (err) {
    console.error('Admin login error:', err);
    return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 });
  }
}
