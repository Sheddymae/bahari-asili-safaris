-- `bookings` only ever stored a single flat amount_paid / payment_method /
-- payment_date, overwritten on every payment. That's enough to compute a
-- running balance but loses the actual history a payment receipt needs to
-- show (spec: "PAYMENT HISTORY — Date, Receipt Number, Payment Method,
-- Transaction Reference, Amount, Currency, Status, Notes"). This table adds
-- that history without touching the existing flat fields on `bookings`,
-- which stay as the authoritative running total (amount_paid/balance_due)
-- for anything that only needs the current state.

CREATE TABLE IF NOT EXISTS payments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  booking_id bigint NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  receipt_number text NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'KES',
  method text NOT NULL CHECK (method IN ('Cash','Card','Bank','Link','M-Pesa','PayPal')),
  reference text,
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received','pending','failed','refunded')),
  notes text,
  recorded_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Server-side (service-role) access only — payments are written/read
-- exclusively through the admin API route, same trust model as `bookings`
-- admin fields. No public policy is created here.
