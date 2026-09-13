import { destinations, type Destination } from '@/lib/destinations-data';
import { type SafariTab } from '@/lib/tours-data';

/**
 * Server-authoritative pricing for the Safari Trip Builder (and, going
 * forward, any other flow that needs a Kenya safari cost estimate).
 *
 * There is no live rates feed or existing calculator anywhere else in the
 * project — the `Quotation` type in lib/supabase.ts only *describes* a cost
 * breakdown that an admin fills in by hand when emailing a quote. This file
 * is the first real calculator, and it's intentionally simple/transparent:
 * per-destination day rates rather than a black box. Every figure below is
 * an estimate for planning purposes, clearly labeled as such in the UI —
 * never presented as a confirmed/available price.
 *
 * All money in KES.
 */

export interface DestinationRate {
  /** Accommodation per room/unit per night, mid-range lodge tier. */
  accommodationPerNight: number;
  /** Park/conservancy entry fee per adult per day. */
  parkFeePerAdultPerDay: number;
  /** Park/conservancy entry fee per child per day. */
  parkFeePerChildPerDay: number;
  /** Guide + 4x4 vehicle, per day, covers the whole vehicle not per person. */
  guideVehiclePerDay: number;
  /** Full board meals, per adult per day. */
  mealsPerAdultPerDay: number;
  /** Full board meals, per child per day. */
  mealsPerChildPerDay: number;
}

// Rates are deliberately close across parks — Bahari Asili prices are
// lodge-driven more than park-driven — with Mara slightly higher (longer
// transfer, higher-tier camps) and Taita slightly lower (closer, simpler
// camps). Update here only; every caller reads through this table.
export const DESTINATION_RATES: Record<SafariTab, DestinationRate> = {
  tsavo: {
    accommodationPerNight: 14000,
    parkFeePerAdultPerDay: 2500,
    parkFeePerChildPerDay: 1200,
    guideVehiclePerDay: 9000,
    mealsPerAdultPerDay: 3000,
    mealsPerChildPerDay: 1500,
  },
  amboseli: {
    accommodationPerNight: 15500,
    parkFeePerAdultPerDay: 2800,
    parkFeePerChildPerDay: 1300,
    guideVehiclePerDay: 9500,
    mealsPerAdultPerDay: 3200,
    mealsPerChildPerDay: 1600,
  },
  mara: {
    accommodationPerNight: 18000,
    parkFeePerAdultPerDay: 3500,
    parkFeePerChildPerDay: 1700,
    guideVehiclePerDay: 12000,
    mealsPerAdultPerDay: 3500,
    mealsPerChildPerDay: 1750,
  },
  taita: {
    accommodationPerNight: 12500,
    parkFeePerAdultPerDay: 2000,
    parkFeePerChildPerDay: 1000,
    guideVehiclePerDay: 8000,
    mealsPerAdultPerDay: 2800,
    mealsPerChildPerDay: 1400,
  },
};

// Flat transport cost per leg (road transfer between two locations, e.g.
// Watamu -> Tsavo, or Tsavo -> Amboseli), covering the vehicle for that
// transfer day. Coast-based transfers are shorter/cheaper than transfers
// involving Mara or Nairobi.
export const COAST_LOCATIONS = ['Watamu', 'Malindi', 'Mombasa', 'Diani'] as const;
export const INLAND_LOCATIONS = ['Nairobi', 'Airport (JKIA/Mombasa)'] as const;
export type StartEndLocation = (typeof COAST_LOCATIONS)[number] | (typeof INLAND_LOCATIONS)[number];

export const ALL_LOCATIONS: StartEndLocation[] = [...COAST_LOCATIONS, ...INLAND_LOCATIONS];

function transportLegCost(destA: SafariTab | 'start' | 'end', destB: SafariTab): number {
  // Mara legs are long-haul (road) so cost more regardless of the other end.
  if (destA === 'mara' || destB === 'mara') return 16000;
  return 7000;
}

export interface SafariInterest {
  key: string;
  label: string;
}

export const SAFARI_INTERESTS: SafariInterest[] = [
  { key: 'wildlife', label: 'Wildlife' },
  { key: 'big-five', label: 'Big Five' },
  { key: 'elephants', label: 'Elephants' },
  { key: 'photography', label: 'Photography' },
  { key: 'kilimanjaro', label: 'Kilimanjaro views' },
  { key: 'migration', label: 'Great Migration' },
  { key: 'beach-safari', label: 'Beach + Safari' },
  { key: 'family', label: 'Family' },
  { key: 'honeymoon', label: 'Honeymoon / romantic' },
  { key: 'adventure', label: 'Adventure' },
  { key: 'relaxed-luxury', label: 'Relaxed / luxury' },
  { key: 'short-safari', label: 'Short safari' },
];

export interface SafariBuilderInput {
  arrivalDate: string; // YYYY-MM-DD
  departureDate: string; // YYYY-MM-DD
  startLocation: StartEndLocation;
  endLocation: StartEndLocation;
  adults: number;
  children: number;
  childrenAges: number[];
  interests: string[];
  destinationSlugs: SafariTab[]; // order = itinerary order
  accommodationType?: 'standard' | 'midrange' | 'luxury';
}

export interface PricingBreakdown {
  accommodation_cost: number;
  park_fees: number;
  guide_cost: number;
  transport_cost: number;
  meals_cost: number;
  other_costs: number;
  discount: number;
  tax: number;
  total_cost: number;
  currency: 'KES';
}

export interface ItineraryDay {
  day: number;
  title: string;
  location: string;
  description: string;
  overnight: string;
}

export interface SafariBuilderResult {
  nights: number;
  nightsPerDestination: { slug: SafariTab; name: string; nights: number }[];
  itinerary: ItineraryDay[];
  pricing: PricingBreakdown;
  destinations: Destination[];
}

export class SafariBuilderValidationError extends Error {}

/** Validate the raw shape the API receives; throws SafariBuilderValidationError with a user-facing message. */
export function validateBuilderInput(input: Partial<SafariBuilderInput>): SafariBuilderInput {
  const {
    arrivalDate, departureDate, startLocation, endLocation,
    adults, children, childrenAges, interests, destinationSlugs, accommodationType,
  } = input;

  if (!arrivalDate || !departureDate) {
    throw new SafariBuilderValidationError('Arrival and departure dates are required.');
  }
  const arrival = new Date(arrivalDate);
  const departure = new Date(departureDate);
  if (Number.isNaN(arrival.getTime()) || Number.isNaN(departure.getTime())) {
    throw new SafariBuilderValidationError('Dates are invalid.');
  }
  if (departure <= arrival) {
    throw new SafariBuilderValidationError('Departure date must be after the arrival date.');
  }
  const nights = Math.round((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
  if (nights < 1 || nights > 30) {
    throw new SafariBuilderValidationError('Trip length must be between 1 and 30 nights.');
  }

  if (!startLocation || !ALL_LOCATIONS.includes(startLocation as StartEndLocation)) {
    throw new SafariBuilderValidationError('Starting location is invalid.');
  }
  if (!endLocation || !ALL_LOCATIONS.includes(endLocation as StartEndLocation)) {
    throw new SafariBuilderValidationError('Ending location is invalid.');
  }

  const adultsNum = Number(adults);
  if (!Number.isInteger(adultsNum) || adultsNum < 1 || adultsNum > 20) {
    throw new SafariBuilderValidationError('At least 1 adult is required.');
  }
  const childrenNum = Number(children) || 0;
  if (!Number.isInteger(childrenNum) || childrenNum < 0 || childrenNum > 12) {
    throw new SafariBuilderValidationError('Number of children is invalid.');
  }
  const ages = Array.isArray(childrenAges) ? childrenAges.map(Number) : [];
  if (childrenNum > 0 && ages.length !== childrenNum) {
    throw new SafariBuilderValidationError("Please provide each child's age.");
  }
  if (ages.some((a) => !Number.isInteger(a) || a < 0 || a > 17)) {
    throw new SafariBuilderValidationError('Children ages must be between 0 and 17.');
  }

  const slugs = Array.isArray(destinationSlugs) ? (destinationSlugs as SafariTab[]) : [];
  if (slugs.length === 0) {
    throw new SafariBuilderValidationError('Select at least one destination.');
  }
  const validSlugs = new Set(destinations.map((d) => d.slug));
  for (const s of slugs) {
    if (!validSlugs.has(s)) {
      throw new SafariBuilderValidationError(`Unknown destination: ${s}`);
    }
  }

  const interestList = Array.isArray(interests) ? interests.filter((i) => typeof i === 'string') : [];

  return {
    arrivalDate,
    departureDate,
    startLocation: startLocation as StartEndLocation,
    endLocation: endLocation as StartEndLocation,
    adults: adultsNum,
    children: childrenNum,
    childrenAges: ages,
    interests: interestList,
    destinationSlugs: slugs,
    accommodationType: (accommodationType as SafariBuilderInput['accommodationType']) || 'midrange',
  };
}

/** Split total nights as evenly as possible across the selected destinations, in the order chosen. */
function splitNights(totalNights: number, destSlugs: SafariTab[]): { slug: SafariTab; nights: number }[] {
  const base = Math.floor(totalNights / destSlugs.length);
  let remainder = totalNights - base * destSlugs.length;
  return destSlugs.map((slug) => {
    const extra = remainder > 0 ? 1 : 0;
    if (remainder > 0) remainder -= 1;
    return { slug, nights: base + extra };
  });
}

const ACCOMMODATION_MULTIPLIER: Record<NonNullable<SafariBuilderInput['accommodationType']>, number> = {
  standard: 0.8,
  midrange: 1,
  luxury: 1.6,
};

/**
 * Deterministic, server-authoritative pricing + itinerary generation.
 * Never trust a client-submitted total — always call this to get the real numbers.
 */
export function buildSafariPlan(input: SafariBuilderInput): SafariBuilderResult {
  const nights = Math.round(
    (new Date(input.departureDate).getTime() - new Date(input.arrivalDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const split = splitNights(nights, input.destinationSlugs);
  const accMultiplier = ACCOMMODATION_MULTIPLIER[input.accommodationType || 'midrange'];

  let accommodation_cost = 0;
  let park_fees = 0;
  let guide_cost = 0;
  let meals_cost = 0;
  let transport_cost = 0;

  const nightsPerDestination = split.map(({ slug, nights: n }) => {
    const rate = DESTINATION_RATES[slug];
    const dest = destinations.find((d) => d.slug === slug)!;

    accommodation_cost += rate.accommodationPerNight * accMultiplier * n;
    park_fees += (rate.parkFeePerAdultPerDay * input.adults + rate.parkFeePerChildPerDay * input.children) * n;
    guide_cost += rate.guideVehiclePerDay * n;
    meals_cost += (rate.mealsPerAdultPerDay * input.adults + rate.mealsPerChildPerDay * input.children) * n;

    return { slug, name: dest.name, nights: n };
  });

  // Transport legs: start -> first destination -> ... -> last destination -> end
  const legs: (SafariTab | 'start' | 'end')[] = ['start', ...input.destinationSlugs, 'end'];
  for (let i = 0; i < legs.length - 1; i++) {
    const a = legs[i];
    const b = legs[i + 1];
    if (a === 'start' || b === 'end') {
      // transfers to/from a coastal or inland start/end point — flat rate,
      // slightly higher if either end of that leg touches Mara
      transport_cost += transportLegCost(a === 'start' ? (b as SafariTab) : (a as SafariTab), (b === 'end' ? (a as SafariTab) : (b as SafariTab)));
    } else {
      transport_cost += transportLegCost(a as SafariTab, b as SafariTab);
    }
  }

  const other_costs = Math.round((accommodation_cost + park_fees + guide_cost + meals_cost) * 0.03); // misc: park ranger tips pool, conservancy levy, etc.

  const subtotal = accommodation_cost + park_fees + guide_cost + transport_cost + meals_cost + other_costs;

  // Simple loyalty-style discount for longer trips — transparent, not negotiated.
  const discount = nights >= 7 ? Math.round(subtotal * 0.05) : 0;

  const taxable = subtotal - discount;
  const tax = Math.round(taxable * 0.16); // Kenya VAT on tourism services, standard rate

  const total_cost = Math.round(taxable + tax);

  const pricing: PricingBreakdown = {
    accommodation_cost: Math.round(accommodation_cost),
    park_fees: Math.round(park_fees),
    guide_cost: Math.round(guide_cost),
    transport_cost: Math.round(transport_cost),
    meals_cost: Math.round(meals_cost),
    other_costs,
    discount,
    tax,
    total_cost,
    currency: 'KES',
  };

  const itinerary = buildItinerary(input, nightsPerDestination);
  const selectedDestinations = input.destinationSlugs
    .map((slug) => destinations.find((d) => d.slug === slug))
    .filter((d): d is Destination => !!d);

  return { nights, nightsPerDestination, itinerary, pricing, destinations: selectedDestinations };
}

function buildItinerary(
  input: SafariBuilderInput,
  nightsPerDestination: { slug: SafariTab; nights: number }[]
): ItineraryDay[] {
  const days: ItineraryDay[] = [];
  let dayCounter = 1;
  let previousLocation = input.startLocation as string;

  nightsPerDestination.forEach(({ slug, nights: n }, idx) => {
    const dest = destinations.find((d) => d.slug === slug)!;
    const isFirst = idx === 0;

    // Arrival/transfer day into this destination
    days.push({
      day: dayCounter++,
      title: isFirst ? `${previousLocation} → ${dest.name}` : `${previousLocation} → ${dest.name}`,
      location: dest.name,
      description: `Road transfer to ${dest.name}${isFirst ? ' from ' + previousLocation : ''}, arriving in time for an afternoon game drive.`,
      overnight: dest.name,
    });

    // Full days in this destination (n includes the arrival night, so n-1 extra full days)
    for (let i = 1; i < n; i++) {
      days.push({
        day: dayCounter++,
        title: `${dest.name} — full day`,
        location: dest.name,
        description: `Morning and afternoon game drives in ${dest.name}, focused on ${dest.wildlifeHighlights[0]?.toLowerCase() || 'wildlife viewing'}.`,
        overnight: dest.name,
      });
    }

    previousLocation = dest.name;
  });

  // Final day: return to end location
  days.push({
    day: dayCounter++,
    title: `${previousLocation} → ${input.endLocation}`,
    location: input.endLocation,
    description: `Final morning game drive, then transfer back to ${input.endLocation}.`,
    overnight: input.endLocation,
  });

  return days;
}
