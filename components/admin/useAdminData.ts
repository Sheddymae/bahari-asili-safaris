'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export type Booking = {
  id?: number; booking_ref?: string; first_name?: string; last_name?: string; email?: string; whatsapp?: string; nationality?: string;
  safari_name?: string; arrival_date?: string; adults?: number; children?: number; total_price?: number | string | null;
  reservation_status?: string; payment_status?: string; payment_method?: string; amount_paid?: number | string | null;
  balance_due?: number | string | null; hotel_name?: string; pickup_location?: string; message?: string; admin_notes?: string;
  created_at?: string; invoice_number?: string; invoice_status?: string; invoice_url?: string; voucher_url?: string; payment_receipt_url?: string; visa_itinerary_url?: string; itinerary_url?: string; booking_type?: string;
  accommodation_cost?: number | string | null; park_fees?: number | string | null; guide_cost?: number | string | null; transport_cost?: number | string | null; meals_cost?: number | string | null; other_costs?: number | string | null; discount?: number | string | null; tax?: number | string | null; currency?: string | null; is_deleted?: boolean; deleted_at?: string | null;
  [key: string]: unknown;
};

export type Stats = { total: number; today: number; pending: number; confirmed: number; cancelled: number; completed: number; revenue: number; quotedRevenue: number; confirmedRevenue: number; outstandingBalance: number };

export function formatKES(value: number | string | null | undefined) { return `KES ${Number(value || 0).toLocaleString('en-KE')}`; }
export function safeDate(value?: string) { if (!value) return '—'; const d = new Date(value); return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('en-GB'); }
export function guests(b: Booking) { return Number(b.adults || 0) + Number(b.children || 0); }

export function useAdminData() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async (params?: URLSearchParams, options?: { silent?: boolean }) => {
    if (!options?.silent) setLoading(true);
    setError('');
    try {
      const query = params ? new URLSearchParams(params.toString()) : new URLSearchParams();
      query.set('page', '1'); query.set('page_size', '100');
      const response = await fetch(`/api/admin/reservations?${query.toString()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (response.status === 401) { router.push('/auth/login'); return; }
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Failed to load reservations');
      setReservations(Array.isArray(data.reservations) ? data.reservations : []);
      setStats(data.stats || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load reservations');
    } finally {
      if (!options?.silent) setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    reload();
    const interval = window.setInterval(() => reload(undefined, { silent: true }), 15000);
    const handleFocus = () => reload(undefined, { silent: true });
    window.addEventListener('focus', handleFocus);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [reload]);

  return { reservations, stats, loading, error, reload, setReservations };
}
