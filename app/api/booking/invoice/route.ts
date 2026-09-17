import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { normalizeLocale } from '@/lib/locale-content';
import { safaris as safariCatalogue } from '@/lib/safari-catalogue';
import { rowToSafari } from '@/lib/program-utils';
import { generateCustomerInvoicePDF, type CustomerInvoicePackage } from '@/lib/customer-invoice-generator';

const RESEND_API = 'https://api.resend.com/emails';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
}

async function sendEmail(apiKey: string, sender: string, to: string, subject: string, html: string, attachment?: { filename: string; content: string }): Promise<boolean> {
  try {
    const body: Record<string, unknown> = { from: sender, to: [to], subject, html };
    if (attachment) body.attachments = [attachment];
    const response = await fetch(RESEND_API, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      console.error('Booking PDF email failed:', await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Booking PDF email request failed:', error);
    return false;
  }
}

function addDays(dateString: string, days: number): string {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + Math.max(0, days));
  return date.toISOString().slice(0, 10);
}

async function resolvePackage(safariName: string, locale: ReturnType<typeof normalizeLocale>): Promise<CustomerInvoicePackage> {
  const normalizedName = safariName.trim().toLowerCase();
  const catalogueMatch = safariCatalogue.find((s) => s.name.trim().toLowerCase() === normalizedName);
  const slug = catalogueMatch?.id;

  try {
    const admin = getSupabaseAdmin();
    if (slug) {
      const { data } = await admin.from('safari_programs').select('*').eq('slug', slug).eq('locale', locale).maybeSingle();
      if (data) return rowToSafari(data) as unknown as CustomerInvoicePackage;
    }
    const { data } = await admin.from('safari_programs').select('*').eq('locale', locale);
    const match = (data || []).find((row: any) => String(row.name || '').trim().toLowerCase() === normalizedName);
    if (match) return rowToSafari(match) as unknown as CustomerInvoicePackage;
  } catch (error) {
    console.warn('Could not load admin-managed package content for booking PDF:', error);
  }

  if (catalogueMatch) return catalogueMatch as unknown as CustomerInvoicePackage;

  return {
    name: safariName,
    tagline: 'The selected service will be arranged according to your booking request and confirmed by Bahari Asili Safaris.',
    days: 1,
    nights: 0,
    parks: [],
    lodges: [],
    highlights: [],
    itinerary: [{ day: 1, title: safariName, location: 'Watamu, Kenya', description: 'Your requested service details, timing, route and final arrangements will be confirmed by Bahari Asili Safaris.', overnight: 'To be confirmed' }],
    packingTips: [],
    included: [],
    excluded: [],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bookingRef = String(body.bookingRef || '').trim();
    const firstName = String(body.firstName || '').trim();
    const lastName = String(body.lastName || '').trim();
    const email = String(body.email || '').trim();
    const whatsapp = String(body.whatsapp || '').trim();
    const nationality = String(body.nationality || '').trim();
    const safariName = String(body.safariName || '').trim();
    const arrivalDate = String(body.arrivalDate || '').trim();
    const adults = Math.max(1, Number(body.adults) || 1);
    const children = Math.max(0, Number(body.children) || 0);
    const kidsAges = Array.isArray(body.kidsAges) ? body.kidsAges.map(Number).filter((age: number) => Number.isFinite(age) && age >= 0 && age <= 17) : [];
    const message = String(body.message || '').trim();
    const locale = normalizeLocale(body.locale);

    if (!bookingRef || !firstName || !lastName || !isValidEmail(email) || !safariName || !arrivalDate || !nationality) {
      return NextResponse.json({ success: false, error: 'Complete booking information, including nationality, is required to generate the booking PDF.' }, { status: 400 });
    }

    const pkg = await resolvePackage(safariName, locale);
    const packageDays = Math.max(1, Number(pkg.days) || 1);
    const departureDate = String(body.departureDate || '').trim() || addDays(arrivalDate, packageDays);

    // IMPORTANT BUSINESS RULE:
    // The automatic customer PDF is a booking-request/itinerary document only.
    // Do NOT calculate, infer, or expose any price, cost breakdown, tax, park fee,
    // accommodation fee, transport fee, discount, or total here. Pricing is
    // controlled by the admin and is sent later as the official quoted invoice
    // and/or voucher after the booking has been reviewed.
    const invoiceInput = {
      booking_ref: bookingRef,
      first_name: firstName,
      last_name: lastName,
      email,
      whatsapp,
      nationality,
      adults,
      children,
      kids_ages: children > 0 ? kidsAges : null,
      arrival_date: arrivalDate,
      departure_date: departureDate,
      safari_name: safariName,
      message,
      reservation_status: 'pending',
      locale,
      package: pkg,
      costs: null,
    };

    const { base64 } = await generateCustomerInvoicePDF(invoiceInput);
    const invoiceFilename = `Bahari-Asili-Booking-Request-${bookingRef}.pdf`;

    try {
      const admin = getSupabaseAdmin();
      const bookingUpdate: Record<string, unknown> = {
        itinerary: pkg.itinerary || [],
        invoice_generated: true,
        invoice_status: 'sent',
        invoice_number: bookingRef,
        updated_at: new Date().toISOString(),
      };
      const { error: updateError } = await admin.from('bookings').update(bookingUpdate).eq('booking_ref', bookingRef);
      if (updateError) console.error('Could not persist generated booking PDF details:', updateError.message);
    } catch (persistError) {
      console.error('Booking PDF persistence failed:', persistError);
    }

    const emailApiKey = process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY;
    const emailSender = process.env.EMAIL_SENDER || 'Bahari Asili Safaris <onboarding@resend.dev>';
    let invoiceEmailSent = false;

    if (emailApiKey) {
      const fullName = escapeHtml(`${firstName} ${lastName}`);
      const safeTour = escapeHtml(safariName);
      const html = `<div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#1f2937"><div style="background:#0e7490;padding:24px;border-radius:14px 14px 0 0;color:#fff"><h1 style="margin:0;font-size:22px">Your Booking Request</h1><p style="margin:6px 0 0;color:#dff7fb">Bahari Asili Safaris · ${escapeHtml(bookingRef)}</p></div><div style="padding:24px;background:#fff;border:1px solid #e2e8f0"><p style="margin-top:0">Dear ${fullName},</p><p>Thank you for your booking request for <strong>${safeTour}</strong>.</p><p>Your attached PDF contains your traveller information, selected package, package description, parks and destinations, accommodation information, complete day-by-day itinerary, highlights, inclusions, exclusions, packing and travel notes, dates, traveller numbers and special requests.</p><p><strong>Pricing is not included in this automatic document.</strong> Bahari Asili Safaris will review your request and send the official quoted invoice and/or voucher separately with the approved cost breakdown, taxes, fees, discounts and total.</p><p style="margin-bottom:0">Availability, accommodation, routing and final pricing are confirmed by Bahari Asili Safaris before payment.</p></div><div style="background:#1f2937;padding:18px;border-radius:0 0 14px 14px;text-align:center;color:#cbd5e1;font-size:12px">WhatsApp: +254 101 923 355 · sheddymae02@gmail.com</div></div>`;
      invoiceEmailSent = await sendEmail(apiKey, emailSender, email, `Booking Request – ${bookingRef}`, html, { filename: invoiceFilename, content: base64 });
    }

    const pdfBytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoiceFilename}"`,
        'Content-Length': String(pdfBytes.byteLength),
        'Cache-Control': 'no-store, max-age=0',
        'X-Invoice-Generated': 'true',
        'X-Invoice-Email-Sent': String(invoiceEmailSent),
      },
    });
  } catch (error) {
    console.error('Customer booking PDF generation failed:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'The booking was saved, but the booking PDF could not be generated.' }, { status: 500 });
  }
}
