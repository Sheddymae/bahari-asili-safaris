import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locale-content';
import { generatePremiumInvoicePDF } from '@/lib/invoice-generator';
import type { Booking } from '@/lib/supabase';

const RESEND_API = 'https://api.resend.com/emails';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendEmail(apiKey: string, sender: string, to: string, subject: string, html: string, attachment: { filename: string; content: string }): Promise<boolean> {
  try {
    const response = await fetch(RESEND_API, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: sender, to: [to], subject, html, attachments: [attachment] }),
    });
    if (!response.ok) {
      console.error('Invoice email failed:', await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Invoice email request failed:', error);
    return false;
  }
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
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
    const kidsAges = Array.isArray(body.kidsAges) ? body.kidsAges.map(Number).filter((age: number) => Number.isFinite(age) && age >= 1 && age <= 16) : [];
    const message = String(body.message || '').trim();
    const locale = normalizeLocale(body.locale);

    if (!bookingRef || !firstName || !lastName || !isValidEmail(email) || !safariName || !arrivalDate) {
      return NextResponse.json({ success: false, error: 'Complete booking information is required to generate the invoice.' }, { status: 400 });
    }

    const invoiceBooking = {
      booking_ref: bookingRef,
      first_name: firstName,
      last_name: lastName,
      email,
      whatsapp,
      nationality: nationality || null,
      adults,
      children,
      kids_ages: children > 0 ? kidsAges : null,
      arrival_date: arrivalDate,
      safari_name: safariName,
      message,
      reservation_status: 'pending' as Booking['reservation_status'],
      booking_type: (body.bookingType || 'safari') as Booking['booking_type'],
      locale,
    };

    const { base64, dataUrl } = await generatePremiumInvoicePDF(invoiceBooking, locale);
    const invoiceFilename = `Bahari-Asili-Provisional-Invoice-${bookingRef}.pdf`;
    const emailApiKey = process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY;
    const emailSender = process.env.EMAIL_SENDER || 'Bahari Asili Safaris <onboarding@resend.dev>';
    let emailSent = false;

    if (emailApiKey) {
      const fullName = escapeHtml(`${firstName} ${lastName}`);
      const safeTour = escapeHtml(safariName);
      const html = `<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;color:#1f2937"><div style="background:#0e7490;padding:24px;border-radius:14px 14px 0 0;color:#fff"><h1 style="margin:0;font-size:22px">Your Provisional Invoice</h1><p style="margin:6px 0 0;color:#dff7fb">Bahari Asili Safaris · Booking ${escapeHtml(bookingRef)}</p></div><div style="padding:24px;background:#fff;border:1px solid #e2e8f0"><p style="margin-top:0">Dear ${fullName},</p><p>Thank you for your booking request for <strong>${safeTour}</strong>.</p><p>We have generated your provisional invoice automatically from the tour and traveller details you selected. The PDF includes the itinerary, description, inclusions, exclusions, travel date, guests and booking information.</p><p style="margin-bottom:0">Final pricing, availability and any accommodation or pickup changes will be confirmed by our team before payment.</p></div><div style="background:#1f2937;padding:18px;border-radius:0 0 14px 14px;text-align:center;color:#cbd5e1;font-size:12px">WhatsApp: +254101923355 · sheddymae02@gmail.com</div></div>`;
      emailSent = await sendEmail(emailApiKey, emailSender, email, `Provisional Invoice – ${bookingRef}`, html, { filename: invoiceFilename, content: base64 });
    }

    return NextResponse.json({ success: true, invoiceGenerated: true, invoiceEmailSent: emailSent, invoiceFilename, invoiceBase64: base64, invoiceDataUrl: dataUrl });
  } catch (error) {
    console.error('Customer invoice generation failed:', error);
    return NextResponse.json({ success: false, error: 'The booking was saved, but the provisional invoice could not be generated.' }, { status: 500 });
  }
}
