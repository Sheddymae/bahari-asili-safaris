import type { Booking } from './supabase';
import { safaris } from './tours-data';

export interface ResolvedItineraryDay {
  dayLabel: string;
  title: string;
  bodyLines: string[];
  overnight?: string;
}

/**
 * Resolve a booking's day-by-day itinerary regardless of source:
 *  - Custom Safari Trip Builder bookings store it directly on
 *    `booking.itinerary` (ItineraryDay[] — day: number, location,
 *    description, overnight).
 *  - Fixed-catalogue safari/excursion bookings have no per-booking
 *    itinerary; it's looked up from `lib/tours-data.ts` by safari name
 *    (day: string, morning, afternoon, overnight).
 * Both are normalized to the same shape so a single PDF renderer can
 * handle either case without caring which one it got.
 */
export function resolveItinerary(booking: Booking): ResolvedItineraryDay[] {
  if (Array.isArray(booking.itinerary) && booking.itinerary.length > 0) {
    return booking.itinerary.map((d) => ({
      dayLabel: typeof d.day === 'number' ? `Day ${d.day}` : String(d.day || ''),
      title: d.title || '',
      bodyLines: [d.location, d.description].filter(Boolean) as string[],
      overnight: d.overnight,
    }));
  }
  const safari = safaris.find((s) => s.name === booking.safari_name);
  if (safari?.itinerary?.length) {
    return safari.itinerary.map((d) => ({
      dayLabel: d.day,
      title: d.title || '',
      bodyLines: [d.morning, d.afternoon].filter(Boolean) as string[],
      overnight: d.overnight,
    }));
  }
  return [];
}
