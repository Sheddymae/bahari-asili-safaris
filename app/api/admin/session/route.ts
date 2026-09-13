import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifyAdminSession } from '@/lib/admin-auth';

// Note: middleware.ts already blocks unauthenticated requests to
// /api/admin/:path* with a 401, so reaching this handler implies a valid
// session — we still re-verify here so this route is safe standalone too.
export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminSession(token);
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  return NextResponse.json({ success: true, username: session.username, role: session.role });
}
