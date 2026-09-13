import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminSession, adminCookieOptions } from '@/lib/admin-auth';
import { logAdminAction } from '@/lib/audit-log';
import { getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminSession(token);

  if (session) {
    await logAdminAction({
      username: session.username,
      role: session.role,
      action: 'logout',
      ip: getClientIp(req),
      userAgent: req.headers.get('user-agent') || undefined,
    });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE_NAME, '', adminCookieOptions(0));
  return res;
}
