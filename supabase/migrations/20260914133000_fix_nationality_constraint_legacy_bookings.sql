-- The first nationality constraint correctly blocked blank values, but it also
-- blocked legitimate updates to older bookings that predate mandatory nationality.
-- Backfill those legacy rows first, then enforce the rule for all future writes.

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_nationality_required;

UPDATE public.bookings
SET nationality = 'Not provided'
WHERE nationality IS NULL
   OR length(btrim(nationality)) = 0;

ALTER TABLE public.bookings
  ALTER COLUMN nationality SET NOT NULL;

ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_nationality_required
  CHECK (length(btrim(nationality)) > 0);

NOTIFY pgrst, 'reload schema';
