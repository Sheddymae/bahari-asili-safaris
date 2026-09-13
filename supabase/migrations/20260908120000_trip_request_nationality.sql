-- `bookings.nationality` has existed since 20260801100000, but
-- `safari_trip_requests` (the Safari Trip Builder's own table) never had
-- an equivalent column, so nationality collected there had nowhere to go.

ALTER TABLE safari_trip_requests ADD COLUMN IF NOT EXISTS nationality text;
