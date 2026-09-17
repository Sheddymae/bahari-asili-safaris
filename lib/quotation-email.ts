import { type Quotation } from '@/lib/supabase';
import { formatLocaleDate, normalizeLocale } from '@/lib/locale-content';

const RESEND_API = 'https://api.resend.com/emails';

// Shared HTML template + sender for a Bahari Asili quotation email.
// Extracted from app/api/quotation/route.ts (Phase 2.1) so the Safari
// Trip Builder can reuse the exact same email without duplicating markup.
// Behavior/contract is unchanged from the original inline version.

export function buildQuotationEmailHtml(q: Quotation & { createdDate: string }): string {
  const subtotal = (q.accommodation_cost || 0) + (q.park_fees || 0) + (q.guide_cost || 0) + (q.transport_cost || 0) + (q.meals_cost || 0) + (q.other_costs || 0);
  const afterDiscount = subtotal - (q.discount || 0);
  const total = afterDiscount + (q.tax || 0);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #1f2937;">
      <div style="background: linear-gradient(135deg, #0e7490 0%, #0e7490 100%); padding: 32px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Bahari Asili Safaris</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Watamu, Kenya · Premium Safari Experiences</p>
      </div>

      <div style="background: #f1f5f9; padding: 20px 32px; border-top: 4px solid #0e7490;">
        <p style="margin: 0; color: #0e7490; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Quotation Reference</p>
        <p style="font-size: 32px; font-weight: 800; color: #0e7490; margin: 8px 0;">${q.quotation_ref}</p>
        <p style="margin: 0; font-size: 13px; color: #64748b;">Valid until: ${formatLocaleDate(new Date(new Date(q.createdDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), normalizeLocale(q.locale))}</p>
      </div>

      <div style="padding: 32px; background: #ffffff; border: 1px solid #e2e8f0;">
        <h2 style="color: #0e7490; font-size: 20px; margin: 0 0 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">Guest Details</h2>
        <table style="width: 100%; margin-bottom: 24px; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; font-weight: 600; color: #64748b; width: 40%;">Name</td>
            <td style="padding: 12px 0; color: #1f2937;">${q.first_name} ${q.last_name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; font-weight: 600; color: #64748b;">Email</td>
            <td style="padding: 12px 0; color: #1f2937;">${q.email}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; font-weight: 600; color: #64748b;">WhatsApp</td>
            <td style="padding: 12px 0; color: #1f2937;">${q.whatsapp || '—'}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-weight: 600; color: #64748b;">Guests</td>
            <td style="padding: 12px 0; color: #1f2937;">${q.adults} Adults${q.children > 0 ? `, ${q.children} Children` : ''}</td>
          </tr>
        </table>

        <h2 style="color: #0e7490; font-size: 20px; margin: 24px 0 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">Travel Itinerary</h2>
        <table style="width: 100%; margin-bottom: 24px; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; font-weight: 600; color: #64748b; width: 40%;">Destination</td>
            <td style="padding: 12px 0; color: #1f2937; font-weight: 600;">${q.destination}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; font-weight: 600; color: #64748b;">Arrival Date</td>
            <td style="padding: 12px 0; color: #1f2937;">${new Date(q.arrival_date).toLocaleDateString()}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; font-weight: 600; color: #64748b;">Departure Date</td>
            <td style="padding: 12px 0; color: #1f2937;">${new Date(q.departure_date).toLocaleDateString()}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; font-weight: 600; color: #64748b;">Duration</td>
            <td style="padding: 12px 0; color: #1f2937;">${q.duration_nights} nights</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-weight: 600; color: #64748b;">Activities</td>
            <td style="padding: 12px 0; color: #1f2937;">${q.activities.join(', ')}</td>
          </tr>
        </table>

        <h2 style="color: #0e7490; font-size: 20px; margin: 24px 0 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">Cost Breakdown</h2>
        <table style="width: 100%; margin-bottom: 24px; font-size: 14px; border-collapse: collapse;">
          ${q.accommodation_cost ? `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 12px 0; color: #64748b;">Accommodation</td><td style="padding: 12px 0; text-align: right; color: #1f2937;">KES ${q.accommodation_cost.toLocaleString()}</td></tr>` : ''}
          ${q.park_fees ? `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 12px 0; color: #64748b;">Park Fees</td><td style="padding: 12px 0; text-align: right; color: #1f2937;">KES ${q.park_fees.toLocaleString()}</td></tr>` : ''}
          ${q.guide_cost ? `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 12px 0; color: #64748b;">Guide & Vehicle</td><td style="padding: 12px 0; text-align: right; color: #1f2937;">KES ${q.guide_cost.toLocaleString()}</td></tr>` : ''}
          ${q.transport_cost ? `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 12px 0; color: #64748b;">Transport & Transfers</td><td style="padding: 12px 0; text-align: right; color: #1f2937;">KES ${q.transport_cost.toLocaleString()}</td></tr>` : ''}
          ${q.meals_cost ? `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 12px 0; color: #64748b;">Meals</td><td style="padding: 12px 0; text-align: right; color: #1f2937;">KES ${q.meals_cost.toLocaleString()}</td></tr>` : ''}
          ${q.other_costs ? `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 12px 0; color: #64748b;">Other Services</td><td style="padding: 12px 0; text-align: right; color: #1f2937;">KES ${q.other_costs.toLocaleString()}</td></tr>` : ''}
          <tr style="border-bottom: 2px solid #0e7490; font-weight: 600;">
            <td style="padding: 12px 0;">Subtotal</td>
            <td style="padding: 12px 0; text-align: right;">KES ${subtotal.toLocaleString()}</td>
          </tr>
          ${q.discount ? `<tr style="border-bottom: 1px solid #f1f5f9; color: #0e7490;"><td style="padding: 12px 0;">Discount</td><td style="padding: 12px 0; text-align: right;">-KES ${q.discount.toLocaleString()}</td></tr>` : ''}
          ${q.tax ? `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 12px 0; color: #64748b;">Tax & Fees</td><td style="padding: 12px 0; text-align: right; color: #1f2937;">KES ${q.tax.toLocaleString()}</td></tr>` : ''}
          <tr style="background: #ffffff;">
            <td style="padding: 16px 0; font-weight: 700; font-size: 16px; color: #0e7490;">TOTAL</td>
            <td style="padding: 16px 0; text-align: right; font-weight: 700; font-size: 16px; color: #0e7490;">KES ${total.toLocaleString()}</td>
          </tr>
        </table>

        <div style="background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #0e7490;"><strong>Next Steps:</strong></p>
          <p style="margin: 8px 0 0; font-size: 13px; color: #0e7490;">1. Review the quotation above<br/>2. Confirm dates and guests<br/>3. Reply to confirm or ask questions<br/>4. Upon acceptance, we'll send an invoice and booking confirmation</p>
        </div>

        ${q.terms ? `<div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 24px 0; font-size: 12px; color: #64748b;"><strong>Terms & Conditions:</strong><br/>${q.terms}</div>` : ''}
      </div>

      <div style="background: #1f2937; padding: 24px; text-align: center; border-radius: 0 0 12px 12px;">
        <p style="color: #64748b; font-size: 13px; margin: 0;">WhatsApp: +254101923355 | Email: bahariasilisafaris@gmail.com</p>
        <p style="color: #64748b; font-size: 11px; margin: 12px 0 0;">© 2026 Bahari Asili Safaris, Watamu. All rights reserved.</p>
      </div>
    </div>
  `;
}

async function sendEmail(
  apiKey: string,
  sender: string,
  to: string,
  subject: string,
  html: string,
  attachments?: { filename: string; content: string }[],
): Promise<boolean> {
  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: [to],
        subject,
        html,
        ...(attachments?.length ? { attachments } : {}),
      }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Resend email error (quotation-email.ts):', { status: res.status, response: errorText, to, subject });
      return false;
    }
    return true;
  } catch (err) {
    console.error('Email request failed (quotation-email.ts):', err, { to, subject });
    return false;
  }
}

/**
 * Format + send a quotation email via Resend, reading EMAIL_API_KEY /
 * EMAIL_SENDER from the environment. Returns false (never throws) if the
 * API key isn't configured or the send fails, matching the previous
 * inline behavior in /api/quotation.
 *
 * `quotationPdfBase64` (optional) attaches the actual downloadable/printable
 * SAFARI QUOTATION document (lib/quotation-generator.ts) alongside the
 * HTML email — previously the quotation only ever existed as an email body.
 */
export async function sendQuotationEmail(quotation: Quotation, createdDate: string, quotationPdfBase64?: string): Promise<boolean> {
  const apiKey = process.env.EMAIL_API_KEY;
  if (!apiKey) {
    console.warn('sendQuotationEmail: EMAIL_API_KEY is not configured — quotation email skipped for', quotation.quotation_ref);
    return false;
  }
  const sender = process.env.EMAIL_SENDER || 'Bahari Asili Safaris <bahariasilisafaris@gmail.com>';
  if (sender.includes('bahariasilisafaris@gmail.com')) {
    console.warn('sendQuotationEmail: EMAIL_SENDER is still Resend\'s sandbox address — it can only deliver to the Resend account\'s own signup email. Verify a domain at https://resend.com/domains and set EMAIL_SENDER to an address on it.');
  }
  const html = buildQuotationEmailHtml({ ...quotation, createdDate });
  const locale = normalizeLocale(quotation.locale);
  const subjects: Record<string, string> = { en: 'Your Bahari Asili Safari Quotation', it: 'Il vostro preventivo safari Bahari Asili', fr: 'Votre devis safari Bahari Asili', es: 'Su presupuesto de safari Bahari Asili', de: 'Ihr Safari-Angebot von Bahari Asili', ar: 'عرض سفاري Bahari Asili الخاص بكم', zh: 'Bahari Asili Safari 报价', sw: 'Nukuu yako ya Safari ya Bahari Asili' };
  return sendEmail(
    apiKey,
    sender,
    quotation.email,
    `${subjects[locale] || subjects.en} – ${quotation.quotation_ref}`,
    html,
    quotationPdfBase64 ? [{ filename: `Quotation-${quotation.quotation_ref}.pdf`, content: quotationPdfBase64 }] : undefined,
  );
}

/**
 * Notify the owner (EMAIL_TO) that a new "Build Your Safari" trip request
 * came in. Previously the Safari Trip Builder only emailed the customer —
 * the owner had no email trail for these requests at all. Reuses the same
 * Resend setup as sendQuotationEmail; never throws (returns false on any
 * failure) so a notification hiccup can never take down the customer-facing
 * submission.
 */
export async function sendAdminTripRequestEmail(quotation: Quotation, createdDate: string): Promise<boolean> {
  try {
    const apiKey = process.env.EMAIL_API_KEY;
    const ownerEmail = process.env.EMAIL_TO;
    if (!apiKey) {
      console.warn('sendAdminTripRequestEmail: EMAIL_API_KEY is not configured — admin notification skipped for', quotation.quotation_ref);
      return false;
    }
    if (!ownerEmail) {
      console.warn('sendAdminTripRequestEmail: EMAIL_TO is not configured — admin notification skipped for', quotation.quotation_ref);
      return false;
    }
    const sender = process.env.EMAIL_SENDER || 'Bahari Asili Safaris <bahariasilisafaris@gmail.com>';
    if (sender.includes('bahariasilisafaris@gmail.com')) {
      console.warn('sendAdminTripRequestEmail: EMAIL_SENDER is still Resend\'s sandbox address — it can only deliver to the Resend account\'s own signup email. Verify a domain at https://resend.com/domains and set EMAIL_SENDER to an address on it.');
    }
    const html = buildQuotationEmailHtml({ ...quotation, createdDate });
    const ok = await sendEmail(
      apiKey,
      sender,
      ownerEmail,
      `New Safari Trip Request – ${quotation.quotation_ref}`,
      html,
    );
    if (!ok) {
      console.error(`Admin trip-request notification FAILED for ${quotation.quotation_ref}, recipient "${ownerEmail}" — see "Resend email error" above for the exact reason.`);
    }
    return ok;
  } catch (err) {
    console.error('Admin trip-request notification failed:', err);
    return false;
  }
}
