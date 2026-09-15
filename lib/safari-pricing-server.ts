import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { defaultPricingConfig, type BookingCurrency, type ManagedDestinationRate, type PricingConfig } from '@/lib/managed-safari-pricing';

export async function getManagedPricingConfig(): Promise<PricingConfig> {
  const fallback = defaultPricingConfig();
  try {
    const admin = getSupabaseAdmin();
    const [{ data: destinationRows }, { data: currencyRows }] = await Promise.all([
      admin.from('safari_pricing_settings').select('*').eq('active', true),
      admin.from('safari_currency_settings').select('*').eq('active', true),
    ]);

    for (const row of destinationRows || []) {
      const slug = String(row.destination_slug);
      if (!(slug in fallback.destinations)) continue;
      fallback.destinations[slug] = {
        accommodationPerNight: Number(row.accommodation_per_night) || 0,
        parkFeePerAdultPerDay: Number(row.park_fee_adult_per_day) || 0,
        parkFeePerChildPerDay: Number(row.park_fee_child_per_day) || 0,
        guideVehiclePerDay: Number(row.guide_vehicle_per_day) || 0,
        mealsPerAdultPerDay: Number(row.meals_adult_per_day) || 0,
        mealsPerChildPerDay: Number(row.meals_child_per_day) || 0,
        pricingMode: row.pricing_mode === 'benchmark' ? 'benchmark' : 'manual',
        competitorReference: Number(row.competitor_reference) || 0,
        targetMarkupPercent: Number(row.target_markup_percent) || 0,
        active: row.active !== false,
      } satisfies ManagedDestinationRate;
    }

    for (const row of currencyRows || []) {
      const currency = String(row.currency) as BookingCurrency;
      if (!(currency in fallback.currencies)) continue;
      fallback.currencies[currency] = {
        currency,
        kesPerUnit: Number(row.kes_per_unit) || fallback.currencies[currency].kesPerUnit,
        active: row.active !== false,
      };
    }
  } catch (error) {
    console.warn('Safari pricing settings unavailable; using safe defaults.', error);
  }
  return fallback;
}
