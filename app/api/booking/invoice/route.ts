import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { normalizeLocale } from '@/lib/locale-content';
import { resolveBookingPackage, addBookingDays } from '@/lib/booking-document';
import { generateCustomerInvoicePDF } from '@/lib/customer-invoice-generator';

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
      console.error('Booking invoice email failed:', await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Booking invoice email request failed:', error);
    return false;
  }
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
      return NextResponse.json({ success: false, error: 'Complete booking information, including nationality, is required to generate the booking invoice.' }, { status: 400 });
    }

    const pkg = await resolveBookingPackage(safariName, locale);
    const packageDays = Math.max(1, Number(pkg.days) || 1);
    const departureDate = String(body.departureDate || '').trim() || addBookingDays(arrivalDate, packageDays);

    // Customer booking invoice: use the exact reference returned by /api/booking.
    // No pricing is inferred here. The admin-controlled quoted invoice owns pricing.
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
    const invoiceFilename = `Bahari-Asili-Booking-Invoice-${bookingRef}.pdf`;

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
      if (updateError) console.error('Could not persist generated booking invoice details:', updateError.message);
    } catch (persistError) {
      console.error('Booking invoice persistence failed:', persistError);
    }

    const emailApiKey = process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY;
    const emailSender = process.env.EMAIL_SENDER || 'Bahari Asili Safaris <onboarding@resend.dev>';
    let invoiceEmailSent = false;

    if (emailApiKey) {
      const fullName = escapeHtml(`${firstName} ${lastName}`);
      const safeTour = escapeHtml(safariName);
      const html = `<div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#1f2937"><div style="background:#0e7490;padding:24px;border-radius:14px 14px 0 0;color:#fff"><h1 style="margin:0;font-size:22px">Your Booking Invoice</h1><p style="margin:6px 0 0;color:#dff7fb">Bahari Asili Safaris · ${escapeHtml(bookingRef)}</p></div><div style="padding:24px;background:#fff;border:1px solid #e2e8f0"><p style="margin-top:0">Dear ${fullName},</p><p>Thank you for your booking request for <strong>${safeTour}</strong>.</p><p>Your attached booking invoice contains your traveller information, selected package, package description, parks and destinations, accommodation information, complete day-by-day itinerary, highlights, inclusions, exclusions, packing and travel notes, dates, traveller numbers and special requests.</p><p><strong>This first booking invoice does not contain pricing.</strong> Bahari Asili Safaris will review your request and send the official quoted invoice separately with the approved accommodation, park fees, guide, transport, meals, other costs, discounts, taxes and total.</p><p style="margin-bottom:0">Availability, accommodation, routing and final pricing are confirmed by Bahari Asili Safaris before payment.</p></div><div style="background:#1f2937;padding:18px;border-radius:0 0 14px 14px;text-align:center;color:#cbd5e1;font-size:12px">WhatsApp: +254 101 923 355 · sheddymae02@gmail.com</div></div>`;
      invoiceEmailSent = await sendEmail(emailApiKey, emailSender, email, `Your Booking Invoice – ${bookingRef}`, html, { filename: invoiceFilename, content: base64 });
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
        'X-Booking-Reference': bookingRef,
      },
    });
  } catch (error) {
    console.error('Customer booking invoice generation failed:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'The booking was saved, but the booking invoice could not be generated.' }, { status: 500 });
  }
}
