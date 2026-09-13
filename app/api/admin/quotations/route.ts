import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// GET /api/admin/quotations
// Query params: search, status, page, page_size
// Lists Safari Trip Builder quotations (safari_trip_requests) — a
// separate table from `bookings`, so this needs its own list route rather
// than reusing /api/admin/reservations.
export async function GET(req: NextRequest) {
  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch (err) {
    console.error('Admin quotations: Supabase admin client unavailable:', err);
    return NextResponse.json(
      { success: false, error: 'Server is missing Supabase configuration (SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL).' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('page_size') || '25', 10) || 25));

    let query = admin.from('safari_trip_requests').select('*', { count: 'exact' }).order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (search) {
      const like = `%${search}%`;
      query = query.or(
        [
          `quotation_ref.ilike.${like}`,
          `first_name.ilike.${like}`,
          `last_name.ilike.${like}`,
          `email.ilike.${like}`,
          `whatsapp.ilike.${like}`,
          `nationality.ilike.${like}`,
        ].join(',')
      );
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) {
      console.error('Admin quotations fetch error:', error.message, error.details, error.hint);
      return NextResponse.json({ success: false, error: 'Failed to fetch quotations.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, quotations: data, total: count ?? 0, page, pageSize });
  } catch (err) {
    console.error('Admin quotations route error:', err);
    return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 });
  }
}
