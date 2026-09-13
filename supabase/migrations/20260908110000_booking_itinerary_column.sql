-- Same class of bug as the cost-breakdown/currency migration: custom
-- Safari Trip Builder itineraries are computed and saved on
-- `safari_trip_requests.itinerary`, but the mirrored `bookings` row never
-- received it. Both lib/visa-itinerary-generator.ts and the new
-- lib/itinerary-generator.ts need somewhere on `bookings` to read a
-- custom day-by-day itinerary from (catalogue safaris still resolve their
-- itinerary from lib/tours-data.ts by name, unaffected by this column).

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS itinerary jsonb;
