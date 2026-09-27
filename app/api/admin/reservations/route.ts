import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// GET /api/admin/reservations
// Query params: search, status, booking_type, date_range (today|week|month), page, page_size
export async function GET(req: NextRequest) {
  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch (err) {
    console.error('Admin reservations: Supabase admin client unavailable:', err);
    return NextResponse.json(
      { success: false, error: 'Server is missing Supabase configuration (SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL).' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status') || '';
    const bookingType = searchParams.get('booking_type') || '';
    const dateRange = searchParams.get('date_range') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('page_size') || '25', 10) || 25));

    // The main reservations workspace only shows active bookings. Soft-deleted
    // records are retained in the Recycle Bin and are never mixed into totals.
    // Recycle Bin migration is expected in production. Keep a compatibility
    // fallback so the admin can still read legacy databases while the migration
    // is being applied; once is_deleted exists, only active records are returned.
    let query = admin.from('bookings').select('*', { count: 'exact' }).eq('is_deleted', false).order('created_at', { ascending: false });

    if (status) query = query.eq('reservation_status', status);
    if (bookingType) query = query.eq('booking_type', bookingType);

    if (search) {
      const like = `%${search}%`;
      query = query.or(
        [
          `booking_ref.ilike.${like}`,
          `first_name.ilike.${like}`,
          `last_name.ilike.${like}`,
          `email.ilike.${like}`,
          `whatsapp.ilike.${like}`,
          `safari_name.ilike.${like}`,
          `nationality.ilike.${like}`,
        ].join(',')
      );
    }

    const now = new Date();
    if (dateRange === 'today') {
      const today = now.toISOString().slice(0, 10);
      query = query.eq('arrival_date', today);
    } else if (dateRange === 'week') {
      const start = new Date(now);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      query = query.gte('arrival_date', start.toISOString().slice(0, 10)).lt('arrival_date', end.toISOString().slice(0, 10));
    } else if (dateRange === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      query = query.gte('arrival_date', start.toISOString().slice(0, 10)).lt('arrival_date', end.toISOString().slice(0, 10));
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    let result = await query;
    let recycleBinAvailable = true;

    // Supabase returns a schema-cache error when the Recycle Bin migration has
    // not reached the connected project yet. Do not let that take the entire
    // admin dashboard offline.
    if (result.error && /is_deleted|column .* does not exist|schema cache/i.test(result.error.message || '')) {
      recycleBinAvailable = false;
      let legacyQuery = admin.from('bookings').select('*', { count: 'exact' }).order('created_at', { ascending: false });
      if (status) legacyQuery = legacyQuery.eq('reservation_status', status);
      if (bookingType) legacyQuery = legacyQuery.eq('booking_type', bookingType);
      if (search) {
        const like = '%' + search + '%';
        legacyQuery = legacyQuery.or([
          'booking_ref.ilike.' + like, 'first_name.ilike.' + like, 'last_name.ilike.' + like,
          'email.ilike.' + like, 'whatsapp.ilike.' + like, 'safari_name.ilike.' + like,
          'nationality.ilike.' + like,
        ].join(','));
      }
      if (dateRange === 'today') {
        const today = new Date().toISOString().slice(0, 10);
        legacyQuery = legacyQuery.eq('arrival_date', today);
      } else if (dateRange === 'week') {
        const start = new Date(); start.setDate(start.getDate() - start.getDay());
        const end = new Date(start); end.setDate(end.getDate() + 7);
        legacyQuery = legacyQuery.gte('arrival_date', start.toISOString().slice(0, 10)).lt('arrival_date', end.toISOString().slice(0, 10));
      } else if (dateRange === 'month') {
        const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const end = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
        legacyQuery = legacyQuery.gte('arrival_date', start.toISOString().slice(0, 10)).lt('arrival_date', end.toISOString().slice(0, 10));
      }
      legacyQuery = legacyQuery.range(from, to);
      result = await legacyQuery;
    }

    if (result.error) {
      console.error('Admin reservations fetch error:', result.error.message, result.error.details, result.error.hint);
      return NextResponse.json({ success: false, error: 'Failed to fetch reservations.' }, { status: 500 });
    }

    const stats = await computeStats(admin, recycleBinAvailable);

    return NextResponse.json({
      success: true,
      reservations: result.data,
      total: result.count ?? 0,
      recycleBinAvailable,
      page,
      pageSize,
      stats,
    });
  } catch (err) {
    console.error('Admin reservations route error:', err);
    return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 });
  }
}

interface Stats {
  total: number;
  today: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  revenue: number;
  quotedRevenue: number;
  confirmedRevenue: number;
  outstandingBalance: number;
}

// Computed defensively: any single failed count (e.g. a column not yet migrated)
// falls back to 0 instead of taking down the whole stats block / the route.
async function computeStats(admin: ReturnType<typeof getSupabaseAdmin>, recycleBinAvailable = true): Promise<Stats> {
  const todayStr = new Date().toISOString().slice(0, 10);

  const safeCount = async (build: () => PromiseLike<{ count: number | null; error: any }>): Promise<number> => {
    try {
      const { count, error } = await build();
      if (error) {
        console.error('Stats count error:', error.message);
        return 0;
      }
      return count ?? 0;
    } catch (err) {
      console.error('Stats count exception:', err);
      return 0;
    }
  };

  const active = (query: any) => recycleBinAvailable ? query.eq('is_deleted', false) : query;

  const [total, today, pending, confirmed, cancelled, completed, revenue, quotedRevenue, confirmedRevenue, outstandingBalance] = await Promise.all([
    safeCount(() => active(admin.from('bookings').select('id', { count: 'exact', head: true }))),
    safeCount(() =>
      active(admin.from('bookings').select('id', { count: 'exact', head: true }))
        .gte('created_at', `${todayStr}T00:00:00.000Z`)
        .lte('created_at', `${todayStr}T23:59:59.999Z`)
    ),
    safeCount(() => active(admin.from('bookings').select('id', { count: 'exact', head: true })).eq('reservation_status', 'pending')),
    safeCount(() => active(admin.from('bookings').select('id', { count: 'exact', head: true })).eq('reservation_status', 'confirmed')),
    safeCount(() => active(admin.from('bookings').select('id', { count: 'exact', head: true })).eq('reservation_status', 'cancelled')),
    safeCount(() => active(admin.from('bookings').select('id', { count: 'exact', head: true })).eq('reservation_status', 'completed')),
    (async () => {
      try {
        const { data, error } = await active(admin.from('bookings').select('total_price')).eq('payment_status', 'paid');
        if (error) {
          console.error('Revenue query error:', error.message);
          return 0;
        }
        return (data || []).reduce((sum: number, row: any) => sum + (Number(row.total_price) || 0), 0);
      } catch (err) {
        console.error('Revenue query exception:', err);
        return 0;
      }
    })(),
    (async () => {
      try {
        const { data, error } = await active(admin.from('bookings').select('total_price')).in('invoice_status', ['quoted', 'sent']);
        if (error) return 0;
        return (data || []).reduce((sum: number, row: any) => sum + (Number(row.total_price) || 0), 0);
      } catch {
        return 0;
      }
    })(),
    (async () => {
      try {
        const { data, error } = await active(admin.from('bookings').select('total_price')).in('invoice_status', ['confirmed', 'paid', 'partially_paid']);
        if (error) return 0;
        return (data || []).reduce((sum: number, row: any) => sum + (Number(row.total_price) || 0), 0);
      } catch {
        return 0;
      }
    })(),
    (async () => {
      try {
        const { data, error } = await active(admin.from('bookings').select('balance_due')).gt('balance_due', 0);
        if (error) return 0;
        return (data || []).reduce((sum: number, row: any) => sum + (Number(row.balance_due) || 0), 0);
      } catch {
        return 0;
      }
    })(),
  ]);

  return { total, today, pending, confirmed, cancelled, completed, revenue, quotedRevenue, confirmedRevenue, outstandingBalance };
}
