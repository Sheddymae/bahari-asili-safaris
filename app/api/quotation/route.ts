import { NextRequest, NextResponse } from 'next/server';
import { type Quotation } from '@/lib/supabase';
import { sendQuotationEmail } from '@/lib/quotation-email';
import { generateQuotationPDF } from '@/lib/quotation-generator';
import { normalizeLocale } from '@/lib/locale-content';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    const locale = normalizeLocale(body.locale);
    const quotation: Quotation = {
      quotation_ref: body.quotation_ref,
      booking_ref: body.booking_ref,
      first_name: String(body.first_name || '').trim(),
      last_name: String(body.last_name || '').trim(),
      email: String(body.email || '').trim(),
      whatsapp: String(body.whatsapp || '').trim(),
      adults: parseInt(body.adults) || 1,
      children: parseInt(body.children) || 0,
      kids_ages: body.kids_ages || [],
      arrival_date: body.arrival_date,
      departure_date: body.departure_date,
      duration_nights: parseInt(body.duration_nights) || 1,
      destination: String(body.destination || '').trim(),
      activities: Array.isArray(body.activities) ? body.activities : [],
      accommodation_type: body.accommodation_type,
      accommodation_cost: body.accommodation_cost,
      park_fees: body.park_fees,
      guide_cost: body.guide_cost,
      transport_cost: body.transport_cost,
      meals_cost: body.meals_cost,
      other_costs: body.other_costs,
      discount: body.discount,
      tax: body.tax,
      total_cost: body.total_cost,
      currency: body.currency || 'KES',
      terms: body.terms,
      status: 'sent',
      user_id: body.user_id,
      locale,
    };

    if (!isValidEmail(quotation.email)) {
      return NextResponse.json({ success: false, error: 'Valid email is required.' }, { status: 400 });
    }

    // Generate the actual downloadable/printable SAFARI QUOTATION document
    // (previously the quotation only existed as an HTML email body — see
    // lib/quotation-generator.ts). Never let a PDF-rendering hiccup block
    // the email from going out.
    let quotationPdfBase64: string | undefined;
    try {
      const pdf = await generateQuotationPDF(quotation);
      quotationPdfBase64 = pdf.base64;
    } catch (err) {
      console.error('Quotation PDF generation failed:', err);
    }

    // Send quotation email (shared template/sender — see lib/quotation-email.ts,
    // also used by /api/safari-builder so both flows send an identical-looking quote)
    const emailSent = await sendQuotationEmail(quotation, new Date().toISOString(), quotationPdfBase64);

    return NextResponse.json({ success: true, quotation_ref: quotation.quotation_ref, emailSent, quotationPdfBase64 });
  } catch (err) {
    console.error('Quotation API error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to generate quotation. Please try again.' },
      { status: 500 },
    );
  }
}
