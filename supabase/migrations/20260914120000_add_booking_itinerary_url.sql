-- The admin Detailed Itineraries workspace stores the generated public PDF
-- URL separately from the structured JSON itinerary on bookings.
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS itinerary_url text;

-- Make the new column visible to Supabase/PostgREST immediately after the
-- migration instead of waiting for an automatic schema-cache refresh.
NOTIFY pgrst, 'reload schema';
