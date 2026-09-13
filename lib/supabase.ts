import { createClient } from '@supabase/supabase-js';

// Use environment variables with fallback to placeholder values for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key_for_development';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Booking {
  id?: number;
  booking_ref: string;
  first_name: string;
  last_name: string;
  email: string;
  whatsapp: string;
  adults: number;
  children: number;
  arrival_date: string;
  safari_name: string;
  message: string;
  email_sent?: boolean;
  reservation_status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  user_id?: string | null;
  voucher_path?: string | null;
  kids_ages?: number[] | null;
  created_at?: string;
  booking_type?: 'safari' | 'excursion' | 'hotel' | 'transfer' | 'custom' | 'contact';
  nationality?: string | null;
  pickup_location?: string | null;
  hotel_name?: string | null;
  total_price?: number | null;
  payment_status?: 'unpaid' | 'partial' | 'paid';
  admin_notes?: string | null;
  invoice_generated?: boolean;
  voucher_generated?: boolean;
  invoice_url?: string | null;
  voucher_url?: string | null;
  payment_receipt_url?: string | null;
  visa_itinerary_url?: string | null;
  confirmed_at?: string | null;
  updated_at?: string;
  invoice_status?: 'draft' | 'quoted' | 'sent' | 'confirmed' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
  invoice_number?: string | null;
  deposit_amount?: number | null;
  amount_paid?: number;
  balance_due?: number | null;
  payment_method?: string | null;
  payment_date?: string | null;
  due_date?: string | null;
  locale?: import('./i18n').Locale;
  accommodation_cost?: number | null;
  park_fees?: number | null;
  guide_cost?: number | null;
  transport_cost?: number | null;
  meals_cost?: number | null;
  other_costs?: number | null;
  discount?: number | null;
  tax?: number | null;
  currency?: string;
  itinerary?: { day: number | string; title: string; location?: string; description?: string; morning?: string; afternoon?: string; overnight?: string }[] | null;
  itinerary_url?: string | null;
}

export interface Payment {
  id?: number;
  booking_id: number;
  receipt_number: string;
  amount: number;
  currency?: string;
  method: 'Cash' | 'Card' | 'Bank' | 'Link' | 'M-Pesa' | 'PayPal';
  reference?: string | null;
  status?: 'received' | 'pending' | 'failed' | 'refunded';
  notes?: string | null;
  recorded_by?: string | null;
  created_at?: string;
}

export interface EmailLog {
  id?: number;
  booking_id: number;
  email_type: 'confirmation' | 'quote' | 'payment_reminder' | 'pre_departure_reminder' | 'review_request' | 'custom';
  subject: string;
  recipient: string;
  success?: boolean;
  error_message?: string | null;
  sent_at?: string;
}

export interface Quotation {
  id?: number;
  quotation_ref: string;
  booking_ref?: string;
  first_name: string;
  last_name: string;
  email: string;
  whatsapp: string;
  nationality?: string | null;
  adults: number;
  children: number;
  kids_ages?: number[] | null;
  arrival_date: string;
  departure_date: string;
  duration_nights: number;
  destination: string;
  activities: string[];
  accommodation_type?: string;
  accommodation_cost?: number;
  park_fees?: number;
  guide_cost?: number;
  transport_cost?: number;
  meals_cost?: number;
  other_costs?: number;
  discount?: number;
  tax?: number;
  total_cost: number;
  currency: string;
  terms?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  user_id?: string | null;
  created_at?: string;
  sent_at?: string;
  expires_at?: string;
  locale?: import('./i18n').Locale;
}

export async function getBookingRefSequence(dateStr: string): Promise<number> {
  try {
    const { count } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('arrival_date', dateStr);
    return (count ?? 0) + 1;
  } catch (error) {
    // Return default sequence number if database is not available
    return 1;
  }
}

export function buildBookingRef(arrivalDate: string, seq: number): string {
  const d = new Date(arrivalDate);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const n = String(seq).padStart(3, '0');
  return `BA-${y}${m}${day}-${n}`;
}

export async function saveBooking(booking: Booking): Promise<{ data: Booking | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .maybeSingle();
    return { data, error };
  } catch (error) {
    // Return error if database is not available
    console.warn('Booking save attempted with placeholder Supabase instance');
    return { data: null, error: new Error('Database not configured') };
  }
}

// --- Phase 2: Group Joining safaris (/tours "Group Joining" tab) ---

export interface GroupTour {
  id: number;
  safari_id: string;
  safari_name: string;
  departure_date: string;
  total_seats: number;
  seats_left: number;
  joined_names: string[];
  joined_nationality: string | null;
  status: 'open' | 'full' | 'departed' | 'cancelled';
}

/**
 * Fetch upcoming open group departures for the Group Joining tab. Never
 * throws — returns an empty array if Supabase isn't configured yet or the
 * table doesn't exist, so the tab degrades to an empty state instead of
 * crashing the page.
 */
export async function getGroupTours(): Promise<GroupTour[]> {
  try {
    const { data, error } = await supabase
      .from('group_tours')
      .select('*')
      .eq('status', 'open')
      .gte('departure_date', new Date().toISOString().slice(0, 10))
      .order('departure_date', { ascending: true });
    if (error || !data) return [];
    return data as GroupTour[];
  } catch {
    return [];
  }
}

// --- Phase 2: DB-backed gallery captions ---

export interface GalleryImageRow {
  id: number;
  src: string;
  alt: string;
  caption: string | null;
  category: 'safari' | 'coast' | 'culture' | 'marine' | 'sunsets';
  sort_order: number;
}

/**
 * Fetch active gallery images with their human captions. Returns an empty
 * array (never throws) if Supabase isn't reachable — callers should fall
 * back to a static image list so the gallery still renders.
 */
export async function getGalleryImages(): Promise<GalleryImageRow[]> {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('id, src, alt, caption, category, sort_order')
      .eq('active', true)
      .order('sort_order', { ascending: true });
    if (error || !data) return [];
    return data as GalleryImageRow[];
  } catch {
    return [];
  }
}

// Note: quotation persistence (saveQuotation/getQuotationByRef/etc.) was removed —
// /api/quotation only emails a quotation PDF, it never wrote to a `quotations` table,
// and nothing else in the app called these. The `Quotation` interface above is still
// used to type that route's request body.
