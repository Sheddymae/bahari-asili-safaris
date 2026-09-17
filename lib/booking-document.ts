import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { normalizeLocale } from '@/lib/locale-content';
import { safaris as safariCatalogue } from '@/lib/safari-catalogue';
import { rowToSafari } from '@/lib/program-utils';
import type { CustomerInvoicePackage } from '@/lib/customer-invoice-generator';

/**
 * Admin editors sometimes store the day number inside the itinerary title
 * (for example, "Day 1 — Watamu → Tsavo East"). The PDF renderer already
 * supplies the day number, so normalize that redundant prefix here. This
 * keeps the document readable without changing the underlying program data.
 */
function normalizeItineraryTitle(value: unknown): string {
  return String(value || '')
    .trim()
    .replace(/^(?:day|jour|día|dia|tag|siku)\s*\d+\s*[—–-]\s*/i, '')
    .trim();
}

function normalizeBookingPackage(pkg: CustomerInvoicePackage): CustomerInvoicePackage {
  return {
    ...pkg,
    itinerary: Array.isArray(pkg.itinerary)
      ? pkg.itinerary.map((day) => ({
          ...day,
          title: normalizeItineraryTitle(day.title),
        }))
      : [],
  };
}

/**
 * Resolve the exact package/program content that belongs to a booking.
 * Admin-managed localized program content wins; the static catalogue is the
 * fallback. This keeps the customer booking document and admin documents on
 * the same program source of truth.
 */
export async function resolveBookingPackage(
  safariName: string,
  locale: ReturnType<typeof normalizeLocale>,
): Promise<CustomerInvoicePackage> {
  const normalizedName = safariName.trim().toLowerCase();
  const catalogueMatch = safariCatalogue.find(
    (s) => s.name.trim().toLowerCase() === normalizedName,
  );
  const slug = catalogueMatch?.id;

  try {
    const admin = getSupabaseAdmin();
    if (slug) {
      const { data } = await admin
        .from('safari_programs')
        .select('*')
        .eq('slug', slug)
        .eq('locale', locale)
        .maybeSingle();
      if (data) return normalizeBookingPackage(rowToSafari(data) as unknown as CustomerInvoicePackage);
    }

    const { data } = await admin
      .from('safari_programs')
      .select('*')
      .eq('locale', locale);
    const match = (data || []).find(
      (row: any) => String(row.name || '').trim().toLowerCase() === normalizedName,
    );
    if (match) return normalizeBookingPackage(rowToSafari(match) as unknown as CustomerInvoicePackage);
  } catch (error) {
    console.warn('Could not load admin-managed package content for booking document:', error);
  }

  if (catalogueMatch) return normalizeBookingPackage(catalogueMatch as unknown as CustomerInvoicePackage);

  return normalizeBookingPackage({
    name: safariName,
    tagline:
      'The selected service will be arranged according to your booking request and confirmed by Bahari Asili Safaris.',
    days: 1,
    nights: 0,
    parks: [],
    lodges: [],
    highlights: [],
    itinerary: [
      {
        day: 1,
        title: safariName,
        location: 'Watamu, Kenya',
        description:
          'Your requested service details, timing, route and final arrangements will be confirmed by Bahari Asili Safaris.',
        overnight: 'To be confirmed',
      },
    ],
    packingTips: [],
    included: [],
    excluded: [],
  });
}

export function addBookingDays(dateString: string, days: number): string {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + Math.max(0, days));
  return date.toISOString().slice(0, 10);
}
