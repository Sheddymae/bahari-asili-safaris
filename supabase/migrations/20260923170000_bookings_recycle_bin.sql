-- Soft-delete / Recycle Bin for reservations.
-- Deleted reservations remain recoverable for 90 days, then are permanently removed.

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_bookings_active_created_at
  ON public.bookings (created_at DESC)
  WHERE is_deleted = false;

CREATE INDEX IF NOT EXISTS idx_bookings_deleted_at
  ON public.bookings (deleted_at)
  WHERE is_deleted = true;

-- Schedule daily cleanup when pg_cron is available in Supabase.
-- The cleanup is intentionally idempotent and only touches soft-deleted rows
-- older than 90 days.
CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
  'bahari-asili-purge-deleted-bookings',
  '15 2 * * *',
  $cron$
    DELETE FROM public.bookings
    WHERE is_deleted = true
      AND deleted_at IS NOT NULL
      AND deleted_at < NOW() - INTERVAL '90 days';
  $cron$
)
WHERE NOT EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'bahari-asili-purge-deleted-bookings'
);
