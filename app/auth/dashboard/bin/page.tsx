'use client';

import { useEffect, useState } from 'react';
import { ArchiveRestore, Clock3, RefreshCw, RotateCcw, Trash2, UserRound } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { formatKES, safeDate, type Booking } from '@/components/admin/useAdminData';

type BinBooking = Booking & { deleted_at?: string; bin_expires_at?: string; days_remaining?: number };

export default function BinPage() {
  const [reservations, setReservations] = useState<BinBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/bin', { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Failed to load the Recycle Bin.');
      setReservations(Array.isArray(data.reservations) ? data.reservations : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load the Recycle Bin.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 3500);
  }

  async function action(id: number, actionName: 'restore' | 'permanent_delete') {
    const label = actionName === 'restore' ? 'restore this reservation' : 'permanently delete this reservation';
    if (!window.confirm('Are you sure you want to ' + label + '?')) return;

    setBusy(actionName + '-' + id);
    try {
      const response = await fetch('/api/admin/reservations/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionName }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Action failed.');
      notify(actionName === 'restore' ? 'Reservation restored.' : 'Reservation permanently deleted.');
      await load();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setBusy('');
    }
  }

  return (
    <AdminShell title="Recycle Bin">
      <div className="space-y-5">
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900 p-6 text-white shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">Reservation recovery</p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Recycle Bin</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-200">Deleted reservations are retained for 90 days. Restore them at any time or permanently remove them before automatic cleanup.</p>
            </div>
            <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold ring-1 ring-white/20 hover:bg-white/15">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
          </div>
        </section>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">
            <div>
              <h3 className="font-semibold">Deleted reservations</h3>
              <p className="text-xs text-slate-500">{reservations.length} reservation{reservations.length === 1 ? '' : 's'} currently in the bin.</p>
            </div>
            <ArchiveRestore className="h-5 w-5 text-cyan-700" />
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-400">Loading Recycle Bin...</div>
          ) : reservations.length === 0 ? (
            <div className="py-16 text-center">
              <ArchiveRestore className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-600">The Recycle Bin is empty.</p>
              <p className="mt-1 text-xs text-slate-400">Deleted reservations will appear here for 90 days.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {reservations.map((booking) => (
                <div key={booking.id} className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-cyan-700">{booking.booking_ref || '#' + booking.id}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">{booking.days_remaining ?? '—'} days remaining</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      <span className="inline-flex items-center gap-1.5 font-medium"><UserRound className="h-3.5 w-3.5 text-slate-400" />{booking.first_name} {booking.last_name}</span>
                      <span className="text-slate-500">{booking.safari_name || 'Custom Safari'}</span>
                      <span className="text-slate-500">{safeDate(booking.arrival_date)}</span>
                      <span className="font-medium">{formatKES(booking.total_price)}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">Deleted {safeDate(booking.deleted_at)} · Auto-removal {safeDate(booking.bin_expires_at)}</p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => action(booking.id!, 'restore')} disabled={busy === 'restore-' + booking.id} className="inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-3.5 py-2.5 text-xs font-semibold text-white disabled:opacity-50">
                      <RotateCcw className="h-4 w-4" /> {busy === 'restore-' + booking.id ? 'Restoring...' : 'Restore'}
                    </button>
                    <button onClick={() => action(booking.id!, 'permanent_delete')} disabled={busy === 'permanent_delete-' + booking.id} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">
                      <Trash2 className="h-4 w-4" /> {busy === 'permanent_delete-' + booking.id ? 'Deleting...' : 'Delete permanently'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-xs leading-5">Reservations remain recoverable for 90 days from the deletion timestamp. The daily database cleanup permanently removes records after that period.</p>
        </div>
      </div>
      {toast && <div className="fixed bottom-5 right-5 z-[80] rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl">{toast}</div>}
    </AdminShell>
  );
}
