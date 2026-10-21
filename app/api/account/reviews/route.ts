import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: 'Please sign in to manage your reviews.' }, { status: 401 });

  const { data, error } = await supabase.from('customer_reviews')
    .select('booking_id,booking_ref,safari_name,rating,review_text,created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Could not load guest reviews:', error.message);
    return NextResponse.json({ success: false, error: 'Reviews are not available yet. Please try again later.' }, { status: 503 });
  }
  return NextResponse.json({ success: true, reviews: data || [] }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: 'Please sign in before submitting a review.' }, { status: 401 });

  let body: { bookingId?: number; rating?: number; text?: string; authorName?: string };
  try { body = await request.json(); } catch {
    return NextResponse.json({ success: false, error: 'Invalid review submission.' }, { status: 400 });
  }
  const bookingId = Number(body.bookingId);
  const rating = Number(body.rating);
  const reviewText = typeof body.text === 'string' ? body.text.trim() : '';
  const authorName = typeof body.authorName === 'string' ? body.authorName.trim().slice(0, 100) : '';
  if (!Number.isSafeInteger(bookingId) || bookingId <= 0 || !Number.isInteger(rating) || rating < 1 || rating > 5 || reviewText.length < 10 || reviewText.length > 2000) {
    return NextResponse.json({ success: false, error: 'Choose a rating and write a review between 10 and 2,000 characters.' }, { status: 400 });
  }

  const { data: booking, error: bookingError } = await supabase.from('bookings')
    .select('id,user_id,booking_ref,safari_name,arrival_date,status')
    .eq('id', bookingId).eq('user_id', user.id).maybeSingle();
  if (bookingError || !booking) return NextResponse.json({ success: false, error: 'We could not match this booking to your account.' }, { status: 404 });
  const arrival = new Date(String(booking.arrival_date) + 'T00:00:00Z');
  if (!Number.isFinite(arrival.getTime()) || arrival.getTime() > Date.now() || String(booking.status).toLowerCase().includes('cancel')) {
    return NextResponse.json({ success: false, error: 'Reviews can be submitted after the booked trip date, for non-cancelled bookings.' }, { status: 400 });
  }

  const { data: review, error } = await supabase.from('customer_reviews').insert({
    user_id: user.id,
    booking_id: booking.id,
    booking_ref: booking.booking_ref,
    safari_name: booking.safari_name,
    author_name: authorName || String(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Guest'),
    rating,
    review_text: reviewText,
    status: 'published',
  }).select('booking_id,booking_ref,safari_name,rating,review_text,created_at').single();

  if (error) {
    if (error.code === '23505') return NextResponse.json({ success: false, error: 'A review has already been submitted for this booking.' }, { status: 409 });
    console.error('Guest review submission failed:', error.message);
    return NextResponse.json({ success: false, error: 'We could not save your review. Please try again.' }, { status: 500 });
  }
  return NextResponse.json({ success: true, review }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
}
