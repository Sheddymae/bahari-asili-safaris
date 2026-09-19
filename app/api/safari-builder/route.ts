import { NextRequest, NextResponse } from 'next/server';
import { supabase, type Quotation } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { sendQuotationEmail, sendAdminTripRequestEmail } from '@/lib/quotation-email';
import { generateQuotationPDF } from '@/lib/quotation-generator';
import { normalizeLocale } from '@/lib/locale-content';
import {
  validateBuilderInput,
  SafariBuilderValidationError,
  type SafariBuilderInput,
} from '@/lib/quotation-pricing';
import { buildManagedSafariPlan, type BookingCurrency } from '@/lib/managed-safari-pricing';
import { getManagedPricingConfig } from '@/lib/safari-pricing-server';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeCurrency(value: unknown): BookingCurrency {
  return value === 'USD' || value === 'EUR' ? value : 'KES';
}

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
  const { count } = await admin.from('safari_trip_requests').select('id', { count: 'exact', head: true }).gte('created_at', `${y}-${m}-${day}T00:00:00Z`);
  return `${datePrefix}-${String((count ?? 0) + 1).padStart(3, '0')}`;
}

// Server-authoritative pricing: the customer may choose display currency, but
// never submits a price. Rates are loaded from the admin pricing table and
// recalculated here for both estimates and final submissions.
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ success: false, error: 'Invalid request body.' }, { status: 400 }); }

  const action = body.action === 'submit' ? 'submit' : 'estimate';
  const currency = normalizeCurrency(body.currency);

  let input: SafariBuilderInput;
  try {
    input = validateBuilderInput(body as Partial<SafariBuilderInput>);
  } catch (err) {
    if (err instanceof SafariBuilderValidationError) return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    console.error('Safari builder validation exception:', err);
    return NextResponse.json({ success: false, error: 'Invalid trip details.' }, { status: 400 });
  }

  const pricingConfig = await getManagedPricingConfig();
  if (!pricingConfig.currencies[currency]?.active) {
    return NextResponse.json({ success: false, error: 'That currency is currently unavailable. Please choose another currency.' }, { status: 400 });
  }
  const plan = buildManagedSafariPlan(input, currency, pricingConfig);

  if (action === 'estimate') return NextResponse.json({ success: true, ...plan });

  const firstName = String(body.first_name || '').trim();
  const lastName = String(body.last_name || '').trim();
  const email = String(body.email || '').trim();
  const whatsapp = String(body.whatsapp || '').trim();
  const nationality = String(body.nationality || '').trim();
  const specialRequests = typeof body.special_requests === 'string' ? body.special_requests.trim() : '';
  const locale = normalizeLocale(body.locale);

  if (!firstName || !lastName) return NextResponse.json({ success: false, error: 'First and last name are required.' }, { status: 400 });
  if (!isValidEmail(email)) return NextResponse.json({ success: false, error: 'A valid email is required.' }, { status: 400 });

  let admin;
  try { admin = getSupabaseAdmin(); } catch (err) {
    console.error('Safari builder: Supabase admin client unavailable:', err);
    return NextResponse.json({ success: false, error: 'Server is missing Supabase configuration. Please try again later or contact us directly.' }, { status: 500 });
  }

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
  if (insertError && (insertError as { code?: string }).code === '42703' && /locale/i.test(insertError.message)) {
    const { locale: _omit, ...payloadWithoutLocale } = tripRequestPayload;
    ({ error: insertError } = await admin.from('safari_trip_requests').insert(payloadWithoutLocale));
  }
  if (insertError) {
    console.error('Safari builder insert error:', insertError.message, (insertError as { code?: string }).code);
    return NextResponse.json({ success: false, error: 'Could not save your request. Please try again.' }, { status: 500 });
  }

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
    package_description: `Custom safari designed by the client. Start: ${input.startLocation}. End: ${input.endLocation}. Destinations: ${plan.destinations.map((d) => d.name).join(', ')}. Accommodation: ${input.accommodationType}. Traveller ages: ${input.childrenAges.length ? input.childrenAges.join(', ') : 'None provided'}.`,
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
  try { quotationPdfBase64 = (await generateQuotationPDF(quotation)).base64; } catch (err) { console.error('Safari builder: quotation PDF generation failed:', err); }
  const issuedAt = new Date().toISOString();
  const emailSent = await sendQuotationEmail(quotation, issuedAt, quotationPdfBase64);
  if (emailSent) await admin.from('safari_trip_requests').update({ email_sent: true }).eq('quotation_ref', quotationRef);

  await sendAdminTripRequestEmail(quotation, new Date().toISOString()).catch((err) => { console.error('Admin trip-request email failed:', err); return false; });

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
      invoice_generated: Boolean(quotationPdfBase64),
      invoice_status: quotationPdfBase64 ? 'sent' : 'draft',
      invoice_number: quotationRef,
      message: specialRequests ? `${specialRequests}\n\n(Full itinerary & pricing: safari_trip_requests, ref ${quotationRef})` : `Full itinerary & pricing: safari_trip_requests, ref ${quotationRef}`,
      reservation_status: 'pending',
      payment_status: 'unpaid',
      user_id: userId,
    });
    if (mirrorError) console.error('Safari builder: mirroring into bookings failed:', mirrorError.message);
  } catch (err) { console.error('Safari builder: mirroring into bookings threw:', err); }

  return NextResponse.json({
    success: true,
    quotation_ref: quotationRef,
    emailSent,
    invoiceGenerated: Boolean(quotationPdfBase64),
    invoiceFilename: `Bahari-Asili-Safari-Estimate-Invoice-${quotationRef}.pdf`,
    invoiceDataUrl: quotationPdfBase64 ? `data:application/pdf;base64,${quotationPdfBase64}` : null,
    quotationPdfBase64,
    issuedAt,
    ...plan,
  });
}
