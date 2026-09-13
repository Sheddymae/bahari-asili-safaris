'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { Booking, formatKES, guests, safeDate, useAdminData } from '@/components/admin/useAdminData';

export default function CalendarPage() {
  const { reservations, stats, loading } = useAdminData();
  const [month, setMonth] = useState(() => new Date());
  const [selected, setSelected] = useState('');
  const y = month.getFullYear();
  const m = month.getMonth();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();

  const byDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    reservations.forEach((b) => {
      if (!b.arrival_date) return;
      const key = b.arrival_date.slice(0, 10);
      map.set(key, [...(map.get(key) || []), b]);
    });
    return map;
  }, [reservations]);

  const selectedBookings = selected ? byDate.get(selected) || [] : [];

  return (
    <AdminShell title="Reservation Calendar" badge={stats?.pending}>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Planning</p>
            <h2 className="text-2xl font-bold">Calendar</h2>
            <p className="text-sm text-slate-500">See arrivals by day and open operational details.</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border bg-white p-1">
            <button onClick={() => setMonth(new Date(y, m - 1, 1))} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></button>
            <span className="min-w-36 text-center text-sm font-semibold">{month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => setMonth(new Date(y, m + 1, 1))} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Next month"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_330px]">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-slate-400">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d} className="py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: first }, (_, i) => <div key={`empty-${i}`} className="min-h-24 rounded-xl bg-slate-50/50" />)}
              {Array.from({ length: days }, (_, i) => {
                const day = i + 1;
                const key = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const items = byDate.get(key) || [];
                const today = new Date().toISOString().slice(0, 10);
                return (
                  <button key={key} onClick={() => setSelected(key)} className={`min-h-24 rounded-xl border p-2 text-left transition ${selected === key ? 'border-cyan-500 bg-cyan-50' : 'border-slate-100 hover:border-cyan-200 hover:bg-slate-50'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${key === today ? 'flex h-6 w-6 items-center justify-center rounded-full bg-cyan-700 text-white' : 'text-slate-600'}`}>{day}</span>
                      {items.length > 0 && <span className="rounded-full bg-orange-50 px-1.5 py-0.5 text-[9px] font-bold text-orange-700">{items.length}</span>}
                    </div>
                    <div className="mt-2 space-y-1">
                      {items.slice(0, 2).map((b) => <div key={b.id} className="truncate rounded bg-slate-100 px-1.5 py-1 text-[9px] font-medium">{b.first_name} {b.last_name}</div>)}
                      {items.length > 2 && <p className="text-[9px] text-slate-400">+{items.length - 2} more</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-cyan-50 p-2 text-cyan-700"><CalendarDays className="h-4 w-4" /></div>
              <div><h3 className="font-semibold">{selected ? safeDate(selected) : 'Select a date'}</h3><p className="text-xs text-slate-500">{selectedBookings.length} reservation{selectedBookings.length === 1 ? '' : 's'}</p></div>
            </div>
            {loading ? <p className="py-8 text-sm text-slate-400">Loading...</p> : selected ? (
              <div className="mt-5 space-y-3">
                {selectedBookings.length ? selectedBookings.map((b) => (
                  <div key={b.id} className="rounded-xl border p-3">
                    <p className="text-sm font-semibold">{b.first_name} {b.last_name}</p>
                    <p className="mt-1 text-xs text-slate-500">{b.safari_name || 'Custom Safari'} · {guests(b)} guests</p>
                    <div className="mt-2 flex justify-between text-xs"><span className="capitalize">{b.reservation_status}</span><span className="font-semibold">{formatKES(b.total_price)}</span></div>
                  </div>
                )) : <p className="py-8 text-sm text-slate-400">No arrivals on this date.</p>}
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Pending approvals</p><p className="mt-1 text-2xl font-bold">{stats?.pending || 0}</p></div>
                <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Confirmed trips</p><p className="mt-1 text-2xl font-bold">{stats?.confirmed || 0}</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
