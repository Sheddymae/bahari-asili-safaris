import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { normalizeLocale } from '@/lib/locale-content';
import { safaris as safariCatalogue } from '@/lib/safari-catalogue';
import { rowToSafari } from '@/lib/program-utils';
import { getManagedPricingConfig } from '@/lib/safari-pricing-server';
import { buildManagedSafariPlan, type BookingCurrency } from '@/lib/managed-safari-pricing';
import { generateCustomerInvoicePDF, type CustomerInvoicePackage } from '@/lib/customer-invoice-generator';
import type { Booking } from '@/lib/supabase';

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
      console.error('Invoice email failed:', await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error('Invoice email request failed:', error);
    return false;
  }
}

function normalizeCurrency(value: unknown): BookingCurrency {
  return value === 'USD' || value === 'EUR' ? value : 'KES';
}

function addDays(dateString: string, days: number): string {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + Math.max(0, days));
  return date.toISOString().slice(0, 10);
}

function destinationSlugsFromParks(parks: string[]): string[] {
  const result: string[] = [];
  for (const park of parks) {
    const p = park.toLowerCase();
    const slug = p.includes('tsavo') ? 'tsavo'
      : p.includes('amboseli') ? 'amboseli'
      : (p.includes('mara') || p.includes('masai')) ? 'mara'
      : p.includes('taita') ? 'taita'
      : '';
    if (slug && !result.includes(slug)) result.push(slug);
  }
  return result;
}

async function resolvePackage(safariName: string, locale: ReturnType<typeof normalizeLocale>): Promise<CustomerInvoicePackage> {
  const normalizedName = safariName.trim().toLowerCase();
  const catalogueMatch = safariCatalogue.find((s) => s.name.trim().toLowerCase() === normalizedName);
  const slug = catalogueMatch?.id;

  // Admin-managed content is authoritative for customer documents. Try the
  // customer's selected locale first, then only use the canonical English
  // row when the requested locale itself is English.
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
    console.warn('Could not load admin-managed package content for invoice:', error);
  }

  if (locale !== 'en') {
    // Do not silently substitute an English CMS row for a non-English booking.
    // The catalogue object is used only as a structural fallback for older
    // packages that have no localized CMS row yet.
    if (catalogueMatch) return catalogueMatch as unknown as CustomerInvoicePackage;
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
    const requestedCurrency = normalizeCurrency(body.currency);

    if (!bookingRef || !firstName || !lastName || !isValidEmail(email) || !safariName || !arrivalDate || !nationality) {
      return NextResponse.json({ success: false, error: 'Complete booking information, including nationality, is required to generate the invoice.' }, { status: 400 });
    }

    const pkg = await resolvePackage(safariName, locale);
    const packageDays = Math.max(1, Number(pkg.days) || 1);
    const packageNights = Math.max(0, Number(pkg.nights ?? packageDays - 1));
    const departureDate = String(body.departureDate || '').trim() || addDays(arrivalDate, packageDays);

    let costs: any = {
      accommodation_cost: Number(body.accommodation_cost) || 0,
      park_fees: Number(body.park_fees) || 0,
      guide_cost: Number(body.guide_cost) || 0,
      transport_cost: Number(body.transport_cost) || 0,
      meals_cost: Number(body.meals_cost) || 0,
      other_costs: Number(body.other_costs) || 0,
      discount: Number(body.discount) || 0,
      tax: Number(body.tax) || 0,
      total_cost: Number(body.total_price || body.total_cost) || 0,
      currency: requestedCurrency,
    };

    // Normal package bookings historically sent only the package name. Build
    // the same server-authoritative itemized estimate used by Safari Trip
    // Builder so the invoice never has to invent a flat total on the client.
    const destinationSlugs = destinationSlugsFromParks(pkg.parks || []);
    const catalogueMatch = safariCatalogue.find((s) => s.name.trim().toLowerCase() === safariName.toLowerCase());
    const catalogueSlugs = catalogueMatch?.tabs?.filter((s: string) => ['tsavo', 'amboseli', 'mara', 'taita'].includes(s)) || [];
    const pricingSlugs = destinationSlugs.length ? destinationSlugs : catalogueSlugs;

    if (pricingSlugs.length && !costs.total_cost) {
      try {
        const pricingConfig = await getManagedPricingConfig();
        if (pricingConfig.currencies[requestedCurrency]?.active !== false) {
          const comfort = Number(pkg.comfortLevel || catalogueMatch?.comfortLevel || 4);
          const accommodationType = comfort >= 5 ? 'luxury' : comfort <= 2 ? 'standard' : 'midrange';
          const plan = buildManagedSafariPlan({
            arrivalDate,
            departureDate,
            startLocation: 'Watamu',
            endLocation: 'Watamu',
            adults,
            children,
            childrenAges: kidsAges,
            interests: [],
            destinationSlugs: pricingSlugs as any,
            accommodationType,
          }, requestedCurrency, pricingConfig);
          costs = {
            accommodation_cost: plan.pricing.accommodation_cost,
            park_fees: plan.pricing.park_fees,
            guide_cost: plan.pricing.guide_cost,
            transport_cost: plan.pricing.transport_cost,
            meals_cost: plan.pricing.meals_cost,
            other_costs: plan.pricing.other_costs,
            discount: plan.pricing.discount,
            tax: plan.pricing.tax,
            total_cost: plan.pricing.total_cost,
            currency: requestedCurrency,
          };
        }
      } catch (pricingError) {
        console.warn('Could not calculate package pricing for customer invoice:', pricingError);
      }
    }

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
      costs,
    };

    const { base64, dataUrl } = await generateCustomerInvoicePDF(invoiceInput);
    const invoiceFilename = `Bahari-Asili-Provisional-Invoice-${bookingRef}.pdf`;

    // Persist the exact package itinerary and itemized values onto the booking
    // so the admin dashboard can reproduce the same document later.
    try {
      const admin = getSupabaseAdmin();
      const bookingUpdate: Record<string, unknown> = {
        itinerary: pkg.itinerary || [],
        currency: costs.currency || requestedCurrency,
        accommodation_cost: costs.accommodation_cost || 0,
        park_fees: costs.park_fees || 0,
        guide_cost: costs.guide_cost || 0,
        transport_cost: costs.transport_cost || 0,
        meals_cost: costs.meals_cost || 0,
        other_costs: costs.other_costs || 0,
        discount: costs.discount || 0,
        tax: costs.tax || 0,
        total_price: costs.total_cost || null,
        invoice_generated: true,
        invoice_status: 'sent',
        invoice_number: bookingRef,
        updated_at: new Date().toISOString(),
      };
      const { error: updateError } = await admin.from('bookings').update(bookingUpdate).eq('booking_ref', bookingRef);
      if (updateError) console.error('Could not persist generated invoice details:', updateError.message);
    } catch (persistError) {
      console.error('Invoice persistence failed:', persistError);
    }

    const emailApiKey = process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY;
    const emailSender = process.env.EMAIL_SENDER || 'Bahari Asili Safaris <onboarding@resend.dev>';
    let invoiceEmailSent = false;

    if (emailApiKey) {
      const fullName = escapeHtml(`${firstName} ${lastName}`);
      const safeTour = escapeHtml(safariName);
      const html = `<div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#1f2937"><div style="background:#0e7490;padding:24px;border-radius:14px 14px 0 0;color:#fff"><h1 style="margin:0;font-size:22px">Your Provisional Invoice</h1><p style="margin:6px 0 0;color:#dff7fb">Bahari Asili Safaris · ${escapeHtml(bookingRef)}</p></div><div style="padding:24px;background:#fff;border:1px solid #e2e8f0"><p style="margin-top:0">Dear ${fullName},</p><p>Thank you for your booking request for <strong>${safeTour}</strong>.</p><p>Your attached PDF contains your traveller information, selected package, package description, parks and accommodation, complete day-by-day itinerary, highlights, inclusions, exclusions, packing notes and the available provisional cost breakdown.</p><p style="margin-bottom:0">Final availability, accommodation, routing and pricing are confirmed by Bahari Asili Safaris before payment.</p></div><div style="background:#1f2937;padding:18px;border-radius:0 0 14px 14px;text-align:center;color:#cbd5e1;font-size:12px">WhatsApp: +254 101 923 355 · sheddymae02@gmail.com</div></div>`;
      invoiceEmailSent = await sendEmail(emailApiKey, emailSender, email, `Provisional Invoice – ${bookingRef}`, html, { filename: invoiceFilename, content: base64 });
    } else {
      console.warn('EMAIL_API_KEY / RESEND_API_KEY is not configured. Invoice generated for download but not emailed.');
    }

    return NextResponse.json({
      success: true,
      invoiceGenerated: true,
      invoiceEmailSent,
      invoiceFilename,
      invoiceBase64: base64,
      invoiceDataUrl: dataUrl,
      package: pkg,
      costs,
    });
  } catch (error) {
    console.error('Customer invoice generation failed:', error);
    return NextResponse.json({ success: false, error: 'The booking was saved, but the provisional invoice could not be generated.' }, { status: 500 });
  }
}
