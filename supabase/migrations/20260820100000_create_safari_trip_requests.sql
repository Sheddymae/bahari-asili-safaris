/*
# Phase 2.1 — Safari Trip Builder requests

## Summary
Stores each "Build Your Safari" submission: the trip parameters the visitor
chose, the server-generated itinerary, and the server-calculated pricing
breakdown (same fields as the existing `Quotation` shape in lib/supabase.ts,
so this composes with the existing quotation email flow rather than
inventing a parallel one).

## Security model (deliberately different from `bookings`)
`bookings` is a no-auth, single-tenant table where anon can SELECT everything
(pre-existing design, unrelated to this migration). This table holds
account-linked trip requests, so it gets real per-user RLS instead:

- No direct anon/authenticated INSERT policy. All writes happen through
  /app/api/safari-builder/route.ts using the service-role client
  (lib/supabase-admin.ts), which validates the request and computes
  pricing server-side before writing — mirrors the pattern already used
  by the admin reservations routes.
- Authenticated users may SELECT only their own rows (user_id = auth.uid()).
  Guest submissions (user_id IS NULL) aren't retrievable by anyone through
  the anon/authenticated role — only via the service role (admin), matching
  "guests can request without an account, but nothing exposes their data
  to other visitors."
*/

CREATE TABLE IF NOT EXISTS safari_trip_requests (
  id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id              UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Trip parameters as submitted
  arrival_date         DATE NOT NULL,
  departure_date       DATE NOT NULL,
  nights               INTEGER NOT NULL,
  start_location       TEXT NOT NULL,
  end_location          TEXT NOT NULL,
  adults               INTEGER NOT NULL DEFAULT 1,
  children             INTEGER NOT NULL DEFAULT 0,
  children_ages        INTEGER[] NOT NULL DEFAULT '{}',
  interests            TEXT[] NOT NULL DEFAULT '{}',
  destination_slugs    TEXT[] NOT NULL DEFAULT '{}',
  accommodation_type   TEXT NOT NULL DEFAULT 'midrange',

  -- Server-generated itinerary (array of {day, title, location, description, overnight})
  itinerary            JSONB NOT NULL,

  -- Server-calculated pricing breakdown (same field names as the Quotation type)
  accommodation_cost   NUMERIC NOT NULL DEFAULT 0,
  park_fees            NUMERIC NOT NULL DEFAULT 0,
  guide_cost           NUMERIC NOT NULL DEFAULT 0,
  transport_cost       NUMERIC NOT NULL DEFAULT 0,
  meals_cost           NUMERIC NOT NULL DEFAULT 0,
  other_costs          NUMERIC NOT NULL DEFAULT 0,
  discount             NUMERIC NOT NULL DEFAULT 0,
  tax                  NUMERIC NOT NULL DEFAULT 0,
  total_cost           NUMERIC NOT NULL DEFAULT 0,
  currency             TEXT NOT NULL DEFAULT 'KES',

  -- Contact + status
  first_name           TEXT NOT NULL,
  last_name             TEXT NOT NULL,
  email                TEXT NOT NULL,
  whatsapp             TEXT,
  special_requests     TEXT,
  quotation_ref        TEXT NOT NULL UNIQUE,
  email_sent           BOOLEAN NOT NULL DEFAULT false,
  status                TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'in_review', 'quoted', 'closed')),

  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_safari_trip_requests_user_id ON safari_trip_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_safari_trip_requests_created_at ON safari_trip_requests (created_at DESC);

ALTER TABLE safari_trip_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_trip_requests_select" ON safari_trip_requests;
CREATE POLICY "own_trip_requests_select" ON safari_trip_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policy for anon/authenticated: all writes go
-- through the service-role client in /api/safari-builder, which bypasses
-- RLS by design (same pattern as app/api/admin/reservations/route.ts).
