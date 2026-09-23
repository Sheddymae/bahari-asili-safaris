import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { ADMIN_COOKIE_NAME, verifyAdminSession } from '@/lib/admin-auth';

export async function GET(_req: NextRequest) {
  try {
    const token = _req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifyAdminSession(token);
    if (!session || session.role !== 'owner') {
      return NextResponse.json({ success: false, error: 'Only owner accounts can access the Recycle Bin.' }, { status: 403 });
    }

    const admin = getSupabaseAdmin();
    const { data, error, count } = await admin
      .from('bookings')
      .select('*', { count: 'exact' })
      .eq('is_deleted', true)
      .order('deleted_at', { ascending: false });

    if (error) {
      console.error('Recycle Bin fetch error:', error);
      return NextResponse.json({ success: false, error: error.message || 'Failed to load the Recycle Bin.' }, { status: 500 });
    }

    const now = Date.now();
    const reservations = (data || []).map((booking: any) => {
      const deletedAt = booking.deleted_at ? new Date(booking.deleted_at).getTime() : now;
      const expiresAt = deletedAt + 90 * 24 * 60 * 60 * 1000;
      return {
        ...booking,
        bin_expires_at: new Date(expiresAt).toISOString(),
        days_remaining: Math.max(0, Math.ceil((expiresAt - now) / (24 * 60 * 60 * 1000))),
      };
    });

    return NextResponse.json({ success: true, reservations, total: count ?? reservations.length });
  } catch (err) {
    console.error('Recycle Bin route error:', err);
    return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 });
  }
}
