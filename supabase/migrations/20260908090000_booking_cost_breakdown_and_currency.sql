-- The `bookings` table only ever stored a flat `total_price`, so the
-- invoice generator's itemized cost breakdown (lib/invoice-generator.ts)
-- had nothing to read for any booking and silently fell back to a single
-- total line. The Safari Trip Builder (app/api/safari-builder/route.ts)
-- already computes a full breakdown via lib/quotation-pricing.ts and saves
-- it on `safari_trip_requests`, but never copied it onto the mirrored
-- `bookings` row. These columns close that gap so every booking type can
-- carry the same breakdown fields the invoice/voucher generators expect.
--
-- Also adds `currency`, which did not exist anywhere on `bookings` — every
-- amount was implicitly KES, but lib/voucher-generator.ts labelled it USD.
-- Defaulting to KES matches the only currency actually computed today
-- (lib/quotation-pricing.ts: "All money in KES").

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS accommodation_cost numeric(12,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS park_fees numeric(12,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guide_cost numeric(12,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS transport_cost numeric(12,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS meals_cost numeric(12,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS other_costs numeric(12,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount numeric(12,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS tax numeric(12,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'KES';
