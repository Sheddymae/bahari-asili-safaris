-- Require nationality for every new or updated booking without breaking
-- historical rows that may have been created before nationality was mandatory.
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_nationality_required
  CHECK (length(btrim(coalesce(nationality, ''))) > 0)
  NOT VALID;
