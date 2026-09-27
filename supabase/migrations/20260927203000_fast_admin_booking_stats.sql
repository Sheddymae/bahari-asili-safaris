-- Fast aggregate stats for the admin dashboard.
-- The service-role client calls this function so the dashboard does not issue
-- ten separate count/sum queries on every refresh.
CREATE OR REPLACE FUNCTION public.get_admin_booking_stats()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'total', COUNT(*) FILTER (WHERE is_deleted = false),
    'today', COUNT(*) FILTER (
      WHERE is_deleted = false
        AND created_at >= date_trunc('day', now())
        AND created_at < date_trunc('day', now()) + interval '1 day'
    ),
    'pending', COUNT(*) FILTER (WHERE is_deleted = false AND reservation_status = 'pending'),
    'confirmed', COUNT(*) FILTER (WHERE is_deleted = false AND reservation_status = 'confirmed'),
    'cancelled', COUNT(*) FILTER (WHERE is_deleted = false AND reservation_status = 'cancelled'),
    'completed', COUNT(*) FILTER (WHERE is_deleted = false AND reservation_status = 'completed'),
    'revenue', COALESCE(SUM(total_price) FILTER (WHERE is_deleted = false AND payment_status = 'paid'), 0),
    'quotedRevenue', COALESCE(SUM(total_price) FILTER (WHERE is_deleted = false AND invoice_status IN ('quoted', 'sent')), 0),
    'confirmedRevenue', COALESCE(SUM(total_price) FILTER (WHERE is_deleted = false AND invoice_status IN ('confirmed', 'paid', 'partially_paid')), 0),
    'outstandingBalance', COALESCE(SUM(balance_due) FILTER (WHERE is_deleted = false AND balance_due > 0), 0)
  )
  FROM public.bookings;
$$;

REVOKE ALL ON FUNCTION public.get_admin_booking_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_admin_booking_stats() TO service_role;
