/*
 * Booking -> invoice -> client dashboard document workflow.
 *
 * Existing Bahari bookings use bigint IDs and reservation_status, so the new
 * tables intentionally reference bookings(id) as bigint and add a canonical
 * status column alongside the existing admin reservation_status field.
 */

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS itinerary_snapshot jsonb,
  ADD COLUMN IF NOT EXISTS status text,
  ADD COLUMN IF NOT EXISTS total_amount numeric(12,2),
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD';

UPDATE public.bookings
SET itinerary_snapshot = COALESCE(
  itinerary_snapshot,
  itinerary,
  jsonb_build_object('id', booking_ref, 'title', COALESCE(safari_name, 'Safari'))
)
WHERE itinerary_snapshot IS NULL;

UPDATE public.bookings
SET status = CASE reservation_status
  WHEN 'confirmed' THEN 'confirmed'
  WHEN 'cancelled' THEN 'cancelled'
  ELSE 'pending_confirmation'
END
WHERE status IS NULL;

UPDATE public.bookings
SET total_amount = COALESCE(total_amount, total_price, 0)
WHERE total_amount IS NULL;

UPDATE public.bookings
SET currency = COALESCE(NULLIF(currency, ''), 'USD')
WHERE currency IS NULL OR currency = '';

ALTER TABLE public.bookings
  ALTER COLUMN itinerary_snapshot SET NOT NULL;

ALTER TABLE public.bookings
  ALTER COLUMN status SET DEFAULT 'pending_confirmation';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'bookings_client_status_check'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_client_status_check
      CHECK (status IN ('pending_confirmation','confirmed','cancelled'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id bigint NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  invoice_number text UNIQUE NOT NULL,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending',
  itinerary jsonb,
  pdf_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT invoices_status_check CHECK (status IN ('pending','paid','cancelled','overdue'))
);

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_booking_id ON public.invoices(booking_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON public.invoices(created_at DESC);

CREATE TABLE IF NOT EXISTS public.client_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_id bigint REFERENCES public.bookings(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('invoice','voucher','visa_support','receipt','itinerary')),
  title text NOT NULL,
  pdf_url text NOT NULL,
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent','viewed')),
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_client_documents_user_id ON public.client_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_booking_id ON public.client_documents(booking_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_created_at ON public.client_documents(created_at DESC);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients can view their bookings" ON public.bookings;
CREATE POLICY "Clients can view their bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Service role manages bookings" ON public.bookings;
CREATE POLICY "Service role manages bookings"
  ON public.bookings FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Clients can view their invoices" ON public.invoices;
CREATE POLICY "Clients can view their invoices"
  ON public.invoices FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Service role manages invoices" ON public.invoices;
CREATE POLICY "Service role manages invoices"
  ON public.invoices FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Clients can view their documents" ON public.client_documents;
CREATE POLICY "Clients can view their documents"
  ON public.client_documents FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Clients can mark their documents viewed" ON public.client_documents;
CREATE POLICY "Clients can mark their documents viewed"
  ON public.client_documents FOR UPDATE TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Service role manages client documents" ON public.client_documents;
CREATE POLICY "Service role manages client documents"
  ON public.client_documents FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Private bucket. Existing deployments created this bucket as public; make the
-- access model private so PDFs are only delivered through authenticated checks
-- and short-lived signed URLs.
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

DROP POLICY IF EXISTS "public_read_documents" ON storage.objects;

DROP POLICY IF EXISTS "Clients can read their document objects" ON storage.objects;
CREATE POLICY "Clients can read their document objects"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1
      FROM public.client_documents d
      WHERE d.user_id = (select auth.uid())
        AND d.pdf_url = name
    )
  );

-- Server-side uploads use the service_role key and therefore bypass Storage RLS.
DROP POLICY IF EXISTS "Service role manages document objects" ON storage.objects;
CREATE POLICY "Service role manages document objects"
  ON storage.objects FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Year-scoped invoice numbering, serialized by row lock.
CREATE TABLE IF NOT EXISTS public.invoice_sequences (
  invoice_year integer PRIMARY KEY,
  next_number integer NOT NULL DEFAULT 1
);

CREATE OR REPLACE FUNCTION public.next_bahari_invoice_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_year integer := EXTRACT(YEAR FROM now())::integer;
  sequence_number integer;
BEGIN
  INSERT INTO public.invoice_sequences(invoice_year, next_number)
  VALUES (current_year, 2)
  ON CONFLICT (invoice_year)
  DO UPDATE SET next_number = public.invoice_sequences.next_number + 1
  RETURNING next_number - 1 INTO sequence_number;

  RETURN 'BAS-' || current_year::text || '-' || lpad(sequence_number::text, 4, '0');
END;
$$;

REVOKE ALL ON FUNCTION public.next_bahari_invoice_number() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.next_bahari_invoice_number() TO service_role;

GRANT SELECT ON public.bookings TO authenticated;
GRANT SELECT ON public.invoices TO authenticated;
GRANT SELECT, UPDATE ON public.client_documents TO authenticated;
