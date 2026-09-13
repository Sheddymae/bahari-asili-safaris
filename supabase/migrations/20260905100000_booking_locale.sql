-- Persist the language selected on the public website at booking time.
-- Existing reservations default to English for backwards compatibility.
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'en';
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_locale_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_locale_check CHECK (locale IN ('en','it','fr','es','de','ar','zh','sw'));
CREATE INDEX IF NOT EXISTS idx_bookings_locale ON bookings(locale);

-- Safari Builder requests need the same customer-language persistence.
ALTER TABLE safari_trip_requests ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'en';
ALTER TABLE safari_trip_requests DROP CONSTRAINT IF EXISTS safari_trip_requests_locale_check;
ALTER TABLE safari_trip_requests ADD CONSTRAINT safari_trip_requests_locale_check CHECK (locale IN ('en','it','fr','es','de','ar','zh','sw'));
CREATE INDEX IF NOT EXISTS idx_safari_trip_requests_locale ON safari_trip_requests(locale);
