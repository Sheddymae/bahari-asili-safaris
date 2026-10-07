import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id || !user.email) return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 });

  const admin = getSupabaseAdmin();
  const email = user.email.trim().toLowerCase();

  const { data: bookings, error: bookingError } = await admin
    .from('bookings')
    .select('id')
    .is('user_id', null)
    .ilike('email', email);

  if (bookingError) return NextResponse.json({ success: false, error: bookingError.message }, { status: 500 });

  const bookingIds = (bookings || []).map((row: { id: number }) => row.id);
  if (bookingIds.length) {
    await admin.from('bookings').update({ user_id: user.id }).in('id', bookingIds).is('user_id', null);
    await admin.from('invoices').update({ user_id: user.id }).in('booking_id', bookingIds).is('user_id', null);
  }

  await admin.from('client_documents').update({ user_id: user.id }).eq('email', email).is('user_id', null);

  return NextResponse.json({ success: true, linkedBookings: bookingIds.length });
}
