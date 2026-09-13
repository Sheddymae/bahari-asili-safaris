import { NextRequest, NextResponse } from 'next/server';
import { supabase, type Quotation } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { sendQuotationEmail, sendAdminTripRequestEmail } from '@/lib/quotation-email';
import { generateQuotationPDF } from '@/lib/quotation-generator';
import { normalizeLocale } from '@/lib/locale-content';
import {
  validateBuilderInput,
  buildSafariPlan,
  SafariBuilderValidationError,
  type SafariBuilderInput,
} from '@/lib/quotation-pricing';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Derive the authenticated user (if any) from a Bearer token, rather than
 * trusting a client-supplied user_id. The client sends its Supabase access
 * token (already held client-side via supabase-js); we verify it here with
 * the anon client, which validates the JWT against Supabase Auth. Never
 * throws — an invalid/missing token just means "guest".
 */
async function getAuthenticatedUserId(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return null;
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return null;
    return data.user.id;
  } catch {
    return null;
  }
}

async function generateQuotationRef(admin: ReturnType<typeof getSupabaseAdmin>): Promise<string> {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePrefix = `BAQ-${y}${m}${day}`;

  const { count } = await admin
    .from('safari_trip_requests')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', `${y}-${m}-${day}T00:00:00Z`);

  const seq = (count ?? 0) + 1;
  return `${datePrefix}-${String(seq).padStart(3, '0')}`;
}

// action: 'estimate' -> validate + price + itinerary only, no save/email.
// action: 'submit'   -> same calculation, then save + email the quotation.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const action = body.action === 'submit' ? 'submit' : 'estimate';

  let input: SafariBuilderInput;
  try {
    input = validateBuilderInput(body as Partial<SafariBuilderInput>);
  } catch (err) {
    if (err instanceof SafariBuilderValidationError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
    console.error('Safari builder validation exception:', err);
    return NextResponse.json({ success: false, error: 'Invalid trip details.' }, { status: 400 });
  }

  // Always recalculate server-side — the client-submitted total (if any) is ignored.
  const plan = buildSafariPlan(input);

  if (action === 'estimate') {
    return NextResponse.json({ success: true, ...plan });
  }

  // --- submit: validate contact details, save, email ---
  const firstName = String(body.first_name || '').trim();
  const lastName = String(body.last_name || '').trim();
  const email = String(body.email || '').trim();
  const whatsapp = String(body.whatsapp || '').trim();
  const nationality = String(body.nationality || '').trim();
  const specialRequests = typeof body.special_requests === 'string' ? body.special_requests.trim() : '';
  const locale = normalizeLocale(body.locale);

  if (!firstName || !lastName) {
    return NextResponse.json({ success: false, error: 'First and last name are required.' }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ success: false, error: 'A valid email is required.' }, { status: 400 });
  }

  let admin;
  try {
    admin = getSupabaseAdmin();
  } catch (err) {
    console.error('Safari builder: Supabase admin client unavailable:', err);
    return NextResponse.json(
      { success: false, error: 'Server is missing Supabase configuration. Please try again later or contact us directly.' },
      { status: 500 }
    );
  }

  // Derive the user from their session token — never trust a client-supplied user_id.
  const userId = await getAuthenticatedUserId(req);

  const quotationRef = await generateQuotationRef(admin);

  const tripRequestPayload: Record<string, unknown> = {
    user_id: userId,
    arrival_date: input.arrivalDate,
    departure_date: input.departureDate,
    nights: plan.nights,
    start_location: input.startLocation,
    end_location: input.endLocation,
    adults: input.adults,
    children: input.children,
    children_ages: input.childrenAges,
    interests: input.interests,
    destination_slugs: input.destinationSlugs,
    accommodation_type: input.accommodationType,
    itinerary: plan.itinerary,
    accommodation_cost: plan.pricing.accommodation_cost,
    park_fees: plan.pricing.park_fees,
    guide_cost: plan.pricing.guide_cost,
    transport_cost: plan.pricing.transport_cost,
    meals_cost: plan.pricing.meals_cost,
    other_costs: plan.pricing.other_costs,
    discount: plan.pricing.discount,
    tax: plan.pricing.tax,
    total_cost: plan.pricing.total_cost,
    currency: plan.pricing.currency,
    first_name: firstName,
    last_name: lastName,
    email,
    whatsapp,
    nationality: nationality || null,
    special_requests: specialRequests,
    quotation_ref: quotationRef,
    locale,
  };

  let { error: insertError } = await admin.from('safari_trip_requests').insert(tripRequestPayload);

  // Self-heal against schema drift: `locale` was added to this table by a
  // migration (20260905100000_booking_locale.sql) that may not have been
  // applied to every environment yet. Postgres reports a missing column as
  // error code 42703 ("column ... does not exist"). Rather than fail the
  // customer's request over a column we can safely omit, retry once without
  // it — the row still saves correctly, just without the locale tag.
  if (insertError && (insertError as { code?: string }).code === '42703' && /locale/i.test(insertError.message)) {
    console.warn(
      'Safari builder: "locale" column missing on safari_trip_requests — retrying insert without it. ' +
      'Run supabase/migrations/20260905100000_booking_locale.sql against this database to fix permanently.'
    );
    const { locale: _omit, ...payloadWithoutLocale } = tripRequestPayload;
    ({ error: insertError } = await admin.from('safari_trip_requests').insert(payloadWithoutLocale));
  }

  if (insertError) {
    console.error('Safari builder insert error:', insertError.message, (insertError as { code?: string }).code);
    return NextResponse.json({ success: false, error: 'Could not save your request. Please try again.' }, { status: 500 });
  }

  // Reuse the exact same quotation email template/sender as /api/quotation.
  const quotation: Quotation = {
    quotation_ref: quotationRef,
    first_name: firstName,
    last_name: lastName,
    email,
    whatsapp,
    nationality: nationality || null,
    adults: input.adults,
    children: input.children,
    kids_ages: input.childrenAges,
    arrival_date: input.arrivalDate,
    departure_date: input.departureDate,
    duration_nights: plan.nights,
    destination: plan.destinations.map((d) => d.name).join(', '),
    activities: input.interests,
    accommodation_type: input.accommodationType,
    accommodation_cost: plan.pricing.accommodation_cost,
    park_fees: plan.pricing.park_fees,
    guide_cost: plan.pricing.guide_cost,
    transport_cost: plan.pricing.transport_cost,
    meals_cost: plan.pricing.meals_cost,
    other_costs: plan.pricing.other_costs,
    discount: plan.pricing.discount,
    tax: plan.pricing.tax,
    total_cost: plan.pricing.total_cost,
    currency: plan.pricing.currency,
    terms: 'This is an estimated quotation based on the trip you designed. Final pricing is confirmed once we check lodge availability for your dates.',
    status: 'sent',
    user_id: userId || undefined,
    locale,
  };

  let quotationPdfBase64: string | undefined;
  try {
    const pdf = await generateQuotationPDF(quotation);
    quotationPdfBase64 = pdf.base64;
  } catch (err) {
    console.error('Safari builder: quotation PDF generation failed:', err);
  }

  const emailSent = await sendQuotationEmail(quotation, new Date().toISOString(), quotationPdfBase64);

  if (emailSent) {
    await admin.from('safari_trip_requests').update({ email_sent: true }).eq('quotation_ref', quotationRef);
  }

  // --- Notify the owner + surface this request in the unified admin dashboard ---
  // The Safari Trip Builder previously only wrote to `safari_trip_requests` and
  // emailed the customer — the admin dashboard only ever reads from `bookings`,
  // so these requests were saved but invisible to the admin and never triggered
  // an owner notification. Both steps below are best-effort and intentionally
  // never block or fail the customer-facing response: the authoritative record
  // is the `safari_trip_requests` row already saved above.
  await sendAdminTripRequestEmail(quotation, new Date().toISOString()).catch((err) => {
    console.error('Admin trip-request email failed:', err);
    return false;
  });

  try {
    const { error: mirrorError } = await admin.from('bookings').insert({
      booking_ref: quotationRef,
      first_name: firstName,
      last_name: lastName,
      email,
      whatsapp,
      nationality: nationality || null,
      adults: input.adults,
      children: input.children,
      kids_ages: input.childrenAges.length > 0 ? input.childrenAges : null,
      arrival_date: input.arrivalDate,
      safari_name: `Safari Trip Builder – ${plan.destinations.map((d) => d.name).join(', ')}`,
      booking_type: 'custom',
      total_price: plan.pricing.total_cost,
      locale,
      // Mirror the same itemized breakdown saved on safari_trip_requests so
      // the invoice/voucher generators (which read from `bookings`) can
      // show the full cost breakdown instead of falling back to a flat total.
      accommodation_cost: plan.pricing.accommodation_cost,
      park_fees: plan.pricing.park_fees,
      guide_cost: plan.pricing.guide_cost,
      transport_cost: plan.pricing.transport_cost,
      meals_cost: plan.pricing.meals_cost,
      other_costs: plan.pricing.other_costs,
      discount: plan.pricing.discount,
      tax: plan.pricing.tax,
      currency: plan.pricing.currency,
      itinerary: plan.itinerary,
      message: specialRequests
        ? `${specialRequests}\n\n(Full itinerary & pricing: safari_trip_requests, ref ${quotationRef})`
        : `Full itinerary & pricing: safari_trip_requests, ref ${quotationRef}`,
      reservation_status: 'pending',
      payment_status: 'unpaid',
      user_id: userId,
    });
    if (mirrorError) {
      // Log only — never fail the request over this, the trip request is
      // already safely persisted in safari_trip_requests above.
      console.error('Safari builder: mirroring into bookings failed:', mirrorError.message);
    }
  } catch (err) {
    console.error('Safari builder: mirroring into bookings threw:', err);
  }

  return NextResponse.json({ success: true, quotation_ref: quotationRef, emailSent, quotationPdfBase64, ...plan });
}
