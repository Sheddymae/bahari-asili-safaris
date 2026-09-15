import { destinations } from '@/lib/destinations-data';
import { type PricingBreakdown, type SafariBuilderInput, type SafariBuilderResult, type ItineraryDay, DESTINATION_RATES } from '@/lib/quotation-pricing';
import { EXTENDED_DESTINATION_RATES } from '@/lib/safari-builder-destination-rates';

export type BookingCurrency = 'KES' | 'USD' | 'EUR';
export type PricingMode = 'manual' | 'benchmark';
export interface ManagedDestinationRate { accommodationPerNight: number; parkFeePerAdultPerDay: number; parkFeePerChildPerDay: number; guideVehiclePerDay: number; mealsPerAdultPerDay: number; mealsPerChildPerDay: number; pricingMode: PricingMode; competitorReference: number; targetMarkupPercent: number; active: boolean; }
export interface CurrencyRate { currency: BookingCurrency; kesPerUnit: number; active: boolean; }
export interface PricingConfig { destinations: Record<string, ManagedDestinationRate>; currencies: Record<BookingCurrency, CurrencyRate>; }
export const DEFAULT_CURRENCY_RATES: Record<BookingCurrency, CurrencyRate> = { KES: { currency: 'KES', kesPerUnit: 1, active: true }, USD: { currency: 'USD', kesPerUnit: 129.5, active: true }, EUR: { currency: 'EUR', kesPerUnit: 151, active: true } };

export function defaultPricingConfig(): PricingConfig {
  const rates: Record<string, ManagedDestinationRate> = {};
  Object.entries(EXTENDED_DESTINATION_RATES).forEach(([slug, r]) => {
    rates[slug] = { ...r, pricingMode: 'manual', competitorReference: 0, targetMarkupPercent: 0, active: true };
  });
  return { destinations: rates, currencies: { ...DEFAULT_CURRENCY_RATES } };
}

type RateField = 'accommodationPerNight' | 'parkFeePerAdultPerDay' | 'parkFeePerChildPerDay' | 'guideVehiclePerDay' | 'mealsPerAdultPerDay' | 'mealsPerChildPerDay';
function effectiveRate(rate: ManagedDestinationRate, field: RateField): number {
  const manual = Number(rate[field]) || 0;
  if (rate.pricingMode !== 'benchmark' || !(rate.competitorReference > 0)) return manual;
  const markup = Math.max(-100, Math.min(500, Number(rate.targetMarkupPercent) || 0));
  return Math.max(0, rate.competitorReference * (1 + markup / 100));
}

/**
 * Convert the server-authoritative KES calculation into the currency selected
 * by the customer. Currency rates are stored as KES per one unit of currency,
 * so KES / kesPerUnit gives USD or EUR. The returned currency is deliberately
 * the selected currency; callers must never have to infer it from the source
 * calculation.
 */
function convertBreakdown(kes: PricingBreakdown, currency: BookingCurrency, currencies: Record<BookingCurrency, CurrencyRate>): PricingBreakdown {
  const rate = currencies[currency];
  const kesPerUnit = currency === 'KES' ? 1 : Number(rate?.kesPerUnit) || 0;
  if (currency !== 'KES' && kesPerUnit <= 0) {
    throw new Error(`No valid KES exchange rate is configured for ${currency}.`);
  }
  const convert = (value: number) => currency === 'KES' ? Math.round(value) : Math.round((value / kesPerUnit) * 100) / 100;
  const converted = {
    accommodation_cost: convert(kes.accommodation_cost),
    park_fees: convert(kes.park_fees),
    guide_cost: convert(kes.guide_cost),
    transport_cost: convert(kes.transport_cost),
    meals_cost: convert(kes.meals_cost),
    other_costs: convert(kes.other_costs),
    discount: convert(kes.discount),
    tax: convert(kes.tax),
    total_cost: convert(kes.total_cost),
    currency,
  };

  // PricingBreakdown predates customer-selectable currencies and currently
  // declares currency as KES-only. Keep that shared legacy type unchanged so
  // existing quotation code remains compatible, while preserving the real
  // selected currency at runtime for the builder/UI/API response.
  return converted as PricingBreakdown;
}

function splitNights(totalNights: number, slugs: string[]) {
  const base = Math.floor(totalNights / slugs.length);
  let remainder = totalNights - base * slugs.length;
  return slugs.map((slug) => ({ slug, nights: base + (remainder-- > 0 ? 1 : 0) }));
}

function buildGenericItinerary(input: SafariBuilderInput, split: { slug: string; nights: number }[]): ItineraryDay[] {
  const days: ItineraryDay[] = [];
  let day = 1;
  let previous = input.startLocation;
  split.forEach(({ slug, nights }) => {
    const dest = destinations.find((d) => d.slug === slug);
    const name = dest?.name || slug;
    days.push({ day: day++, title: `${previous} → ${name}`, location: name, description: `Transfer to ${name} and settle in for an afternoon experience or game drive.`, overnight: name });
    for (let i = 1; i < nights; i++) {
      days.push({ day: day++, title: `${name} — full day`, location: name, description: `Morning and afternoon activities in ${name}, focused on ${dest?.wildlifeHighlights[0]?.toLowerCase() || 'wildlife and local experiences'}.`, overnight: name });
    }
    previous = name as typeof input.startLocation;
  });
  days.push({ day: day++, title: `${previous} → ${input.endLocation}`, location: input.endLocation, description: `Final morning experience followed by transfer to ${input.endLocation}.`, overnight: input.endLocation });
  return days;
}

export function buildManagedSafariPlan(input: SafariBuilderInput, currency: BookingCurrency, config: PricingConfig): SafariBuilderResult {
  const nights = Math.round((new Date(input.departureDate).getTime() - new Date(input.arrivalDate).getTime()) / (1000 * 60 * 60 * 24));
  const slugs = (input.destinationSlugs as unknown as string[]);
  const split = splitNights(nights, slugs);
  const accMultiplier = input.accommodationType === 'standard' ? 0.8 : input.accommodationType === 'luxury' ? 1.6 : 1;
  let accommodation = 0; let parkFees = 0; let guide = 0; let meals = 0;
  split.forEach(({ slug, nights: n }) => {
    const fallback = EXTENDED_DESTINATION_RATES[slug] || DESTINATION_RATES[slug as keyof typeof DESTINATION_RATES];
    const managed = config.destinations[slug];
    const rate: ManagedDestinationRate = managed || (fallback ? { ...fallback, pricingMode: 'manual', competitorReference: 0, targetMarkupPercent: 0, active: true } : { accommodationPerNight: 0, parkFeePerAdultPerDay: 0, parkFeePerChildPerDay: 0, guideVehiclePerDay: 0, mealsPerAdultPerDay: 0, mealsPerChildPerDay: 0, pricingMode: 'manual', competitorReference: 0, targetMarkupPercent: 0, active: false });
    if (!rate.active) return;
    accommodation += effectiveRate(rate, 'accommodationPerNight') * accMultiplier * n;
    parkFees += (effectiveRate(rate, 'parkFeePerAdultPerDay') * input.adults + effectiveRate(rate, 'parkFeePerChildPerDay') * input.children) * n;
    guide += effectiveRate(rate, 'guideVehiclePerDay') * n;
    meals += (effectiveRate(rate, 'mealsPerAdultPerDay') * input.adults + effectiveRate(rate, 'mealsPerChildPerDay') * input.children) * n;
  });
  let transport = 0;
  const longHaul = new Set(['mara', 'serengeti', 'ngorongoro', 'samburu', 'mount-kenya', 'queen-elizabeth', 'bwindi', 'murchison-falls', 'akagera']);
  for (let i = 0; i < slugs.length + 1; i++) {
    const a = i === 0 ? '' : slugs[i - 1];
    const b = i === slugs.length ? '' : slugs[i];
    transport += longHaul.has(a) || longHaul.has(b) ? 16000 : 7000;
  }
  const subtotal = accommodation + parkFees + guide + transport + meals;
  const other = 0;
  const discount = 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + other - discount + tax;
  const kes: PricingBreakdown = { accommodation_cost: Math.round(accommodation), park_fees: Math.round(parkFees), guide_cost: Math.round(guide), transport_cost: Math.round(transport), meals_cost: Math.round(meals), other_costs: other, discount, tax, total_cost: Math.round(total), currency: 'KES' };
  const pricing = convertBreakdown(kes, currency, config.currencies);
  const itinerary = buildGenericItinerary(input, split);
  const selectedDestinations = slugs.map((slug) => destinations.find((d) => d.slug === slug)).filter(Boolean) as typeof destinations;
  return { nights, nightsPerDestination: split.map((s) => ({ ...s, slug: s.slug as any, name: destinations.find((d) => d.slug === s.slug)?.name || s.slug })), itinerary, pricing, destinations: selectedDestinations };
}
