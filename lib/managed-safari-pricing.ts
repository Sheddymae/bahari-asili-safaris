import { type SafariTab } from '@/lib/tours-data';
import { buildSafariPlan, type PricingBreakdown, type SafariBuilderInput, type SafariBuilderResult, DESTINATION_RATES } from '@/lib/quotation-pricing';

export type BookingCurrency = 'KES' | 'USD' | 'EUR';
export type PricingMode = 'manual' | 'benchmark';

export interface ManagedDestinationRate { accommodationPerNight: number; parkFeePerAdultPerDay: number; parkFeePerChildPerDay: number; guideVehiclePerDay: number; mealsPerAdultPerDay: number; mealsPerChildPerDay: number; pricingMode: PricingMode; competitorReference: number; targetMarkupPercent: number; active: boolean; }
export interface CurrencyRate { currency: BookingCurrency; kesPerUnit: number; active: boolean; }
export interface PricingConfig { destinations: Partial<Record<SafariTab, ManagedDestinationRate>>; currencies: Record<BookingCurrency, CurrencyRate>; }

export const DEFAULT_CURRENCY_RATES: Record<BookingCurrency, CurrencyRate> = {
  KES: { currency: 'KES', kesPerUnit: 1, active: true },
  USD: { currency: 'USD', kesPerUnit: 129.5, active: true },
  EUR: { currency: 'EUR', kesPerUnit: 151, active: true },
};

export function defaultPricingConfig(): PricingConfig {
  const destinations = {} as Partial<Record<SafariTab, ManagedDestinationRate>>;
  (Object.keys(DESTINATION_RATES) as SafariTab[]).forEach((slug) => {
    const r = DESTINATION_RATES[slug];
    destinations[slug] = { accommodationPerNight: r.accommodationPerNight, parkFeePerAdultPerDay: r.parkFeePerAdultPerDay, parkFeePerChildPerDay: r.parkFeePerChildPerDay, guideVehiclePerDay: r.guideVehiclePerDay, mealsPerAdultPerDay: r.mealsPerAdultPerDay, mealsPerChildPerDay: r.mealsPerChildPerDay, pricingMode: 'manual', competitorReference: 0, targetMarkupPercent: 0, active: true };
  });
  return { destinations, currencies: { ...DEFAULT_CURRENCY_RATES } };
}

function effectiveRate(rate: ManagedDestinationRate, field: keyof Pick<ManagedDestinationRate, 'accommodationPerNight' | 'parkFeePerAdultPerDay' | 'parkFeeChildPerDay' | 'guideVehiclePerDay' | 'mealsPerAdultPerDay' | 'mealsPerChildPerDay'>): number {
  const manual = Number(rate[field]) || 0;
  if (rate.pricingMode !== 'benchmark' || !(rate.competitorReference > 0)) return manual;
  const markup = Math.max(-100, Math.min(500, Number(rate.targetMarkupPercent) || 0));
  return Math.max(0, rate.competitorReference * (1 + markup / 100));
}

function convertBreakdown(kes: PricingBreakdown, currency: BookingCurrency, currencies: Record<BookingCurrency, CurrencyRate>): PricingBreakdown {
  const kesPerUnit = currencies[currency]?.kesPerUnit || 1;
  const convert = (value: number) => Math.round((value / kesPerUnit) * 100) / 100;
  return { accommodation_cost: convert(kes.accommodation_cost), park_fees: convert(kes.park_fees), guide_cost: convert(kes.guide_cost), transport_cost: convert(kes.transport_cost), meals_cost: convert(kes.meals_cost), other_costs: convert(kes.other_costs), discount: convert(kes.discount), tax: convert(kes.tax), total_cost: convert(kes.total_cost), currency: currency as 'KES' };
}

export function buildManagedSafariPlan(input: SafariBuilderInput, currency: BookingCurrency, config: PricingConfig): SafariBuilderResult {
  const base = buildSafariPlan(input);
  const nights = base.nights;
  const split = base.nightsPerDestination;
  const accMultiplier = input.accommodationType === 'standard' ? 0.8 : input.accommodationType === 'luxury' ? 1.6 : 1;
  let accommodation = 0; let parkFees = 0; let guide = 0; let meals = 0;

  split.forEach(({ slug, nights: n }) => {
    const managed = config.destinations[slug];
    const fallback = DESTINATION_RATES[slug];
    const rate: ManagedDestinationRate = managed || { ...fallback, pricingMode: 'manual', competitorReference: 0, targetMarkupPercent: 0, active: true };
    if (!rate.active) return;
    accommodation += effectiveRate(rate, 'accommodationPerNight') * accMultiplier * n;
    parkFees += (effectiveRate(rate, 'parkFeePerAdultPerDay') * input.adults + effectiveRate(rate, 'parkFeePerChildPerDay') * input.children) * n;
    guide += effectiveRate(rate, 'guideVehiclePerDay') * n;
    meals += (effectiveRate(rate, 'mealsPerAdultPerDay') * input.adults + effectiveRate(rate, 'mealsPerChildPerDay') * input.children) * n;
  });

  let transport = 0;
  const legs = ['start', ...input.destinationSlugs, 'end'] as (SafariTab | 'start' | 'end')[];
  for (let i = 0; i < legs.length - 1; i++) transport += legs[i] === 'mara' || legs[i + 1] === 'mara' ? 16000 : 7000;
  const other = Math.round((accommodation + parkFees + guide + meals) * 0.03);
  const subtotal = accommodation + parkFees + guide + transport + meals + other;
  const discount = nights >= 7 ? Math.round(subtotal * 0.05) : 0;
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * 0.16);
  const kesPricing: PricingBreakdown = { accommodation_cost: Math.round(accommodation), park_fees: Math.round(parkFees), guide_cost: Math.round(guide), transport_cost: Math.round(transport), meals_cost: Math.round(meals), other_costs: other, discount, tax, total_cost: Math.round(taxable + tax), currency: 'KES' };
  return { ...base, pricing: convertBreakdown(kesPricing, currency, config.currencies) };
}
