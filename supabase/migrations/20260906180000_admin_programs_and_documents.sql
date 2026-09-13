-- Admin-managed safari programs, localized content and visa/payment documents.
CREATE TABLE IF NOT EXISTS safari_programs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug text NOT NULL,
  locale text NOT NULL DEFAULT 'en' CHECK (locale IN ('en','it','fr','es','de','ar','zh','sw')),
  name text NOT NULL,
  tagline text,
  days integer NOT NULL DEFAULT 1,
  nights integer NOT NULL DEFAULT 0,
  parks jsonb NOT NULL DEFAULT '[]'::jsonb,
  lodges jsonb NOT NULL DEFAULT '[]'::jsonb,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  itinerary jsonb NOT NULL DEFAULT '[]'::jsonb,
  packing_tips jsonb NOT NULL DEFAULT '[]'::jsonb,
  included jsonb NOT NULL DEFAULT '[]'::jsonb,
  excluded jsonb NOT NULL DEFAULT '[]'::jsonb,
  image text,
  category text,
  rating numeric(3,1),
  review_count integer DEFAULT 0,
  activity_level integer DEFAULT 3,
  comfort_level integer DEFAULT 4,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(slug, locale)
);

ALTER TABLE safari_programs DROP CONSTRAINT IF EXISTS safari_programs_slug_key;

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_receipt_url text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS visa_itinerary_url text;

CREATE INDEX IF NOT EXISTS idx_safari_programs_slug_locale ON safari_programs(slug, locale);

ALTER TABLE safari_programs ENABLE ROW LEVEL SECURITY;
-- Admin APIs use service role. Public program API only exposes curated rows server-side.
