'use client';

import { useMemo, type ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CalendarCheck2, CalendarDays, CircleDollarSign, Clock3, Package, Plus, RefreshCw, TrendingUp, Users, Wallet } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { formatKES, guests, safeDate, useAdminData } from '@/components/admin/useAdminData';

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) { return <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>; }

export default function DashboardPage() {
  const router = useRouter();
  const { reservations, stats, loading, error, reload } = useAdminData();
  const upcoming = useMemo(() => [...reservations].filter(b => b.arrival_date && b.reservation_status !== 'cancelled').sort((a,b) => new Date(a.arrival_date || 0).getTime()-new Date(b.arrival_date || 0).getTime()).slice(0,5), [reservations]);
  const recent = reservations.slice(0,5);
  const totalGuests = reservations.reduce((n,b) => n + guests(b), 0);
  const packageCount = new Set(reservations.map(b => b.safari_name || 'Custom Safari')).size;

  return <AdminShell title="Travel Agency Dashboard" badge={stats?.pending}>
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-cyan-800 via-cyan-700 to-slate-800 p-6 text-white shadow-sm sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">Good day, Admin</p><h2 className="text-2xl font-bold sm:text-3xl">Your operations at a glance.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-50/80">Manage bookings, travelers, safari packages, schedules and performance from dedicated workspaces.</p></div>
          <div className="flex flex-wrap gap-2"><button onClick={() => router.push('/auth/dashboard/bookings')} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-cyan-800"><Plus className="h-4 w-4" />View Bookings</button><button onClick={() => router.push('/auth/dashboard/calendar')} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold ring-1 ring-white/20"><CalendarDays className="h-4 w-4" />Open Calendar</button></div>
        </div>
      </section>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {([[CalendarCheck2,'Total Bookings',stats?.total ?? '—','bg-cyan-50 text-cyan-700'],[Users,'Guests',totalGuests || '—','bg-emerald-50 text-emerald-700'],[CircleDollarSign,'Paid Revenue',stats ? formatKES(stats.revenue) : '—','bg-orange-50 text-orange-600'],[Wallet,'Outstanding',stats ? formatKES(stats.outstandingBalance) : '—','bg-red-50 text-red-600']] as [ComponentType<{className?:string}>,string,string|number,string][]).map(([Icon,label,value,tone],i) => <Card key={String(label)}><div className="flex items-start justify-between"><div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></div><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">{i === 3 && stats?.outstandingBalance ? 'Action needed' : 'Live'}</span></div><p className="mt-4 text-xs text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></Card>)}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <Card><div className="mb-4 flex items-center justify-between"><div><h3 className="font-semibold">Recent Bookings</h3><p className="text-xs text-slate-500">Latest reservations requiring attention.</p></div><button onClick={() => router.push('/auth/dashboard/bookings')} className="text-xs font-semibold text-cyan-700">View all <ArrowRight className="inline h-3 w-3" /></button></div>
          {loading ? <p className="py-10 text-center text-sm text-slate-400">Loading...</p> : recent.length === 0 ? <p className="py-10 text-center text-sm text-slate-400">No bookings yet.</p> : <div className="divide-y divide-slate-100">{recent.map(b => <button key={b.id} onClick={() => router.push(`/auth/dashboard/bookings?booking=${b.id}`)} className="flex w-full items-center justify-between gap-4 py-3 text-left hover:bg-slate-50"><div className="min-w-0"><p className="truncate text-sm font-semibold">{b.first_name} {b.last_name}</p><p className="truncate text-xs text-slate-500">{b.safari_name || 'Custom Safari'} · {safeDate(b.arrival_date)}</p></div><div className="text-right"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${b.reservation_status === 'confirmed' ? 'bg-cyan-50 text-cyan-700' : b.reservation_status === 'completed' ? 'bg-emerald-50 text-emerald-700' : b.reservation_status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'}`}>{b.reservation_status || 'pending'}</span><p className="mt-1 text-xs font-medium">{formatKES(b.total_price)}</p></div></button>)}</div>}
        </Card>
        <Card><div className="mb-4"><h3 className="font-semibold">Operations Today</h3><p className="text-xs text-slate-500">Live workload indicators.</p></div><div className="grid grid-cols-2 gap-3">{([[Clock3,'Pending approvals',stats?.pending || 0,'/auth/dashboard/bookings'],[CalendarCheck2,'Confirmed trips',stats?.confirmed || 0,'/auth/dashboard/calendar'],[Package,'Active packages',packageCount,'/auth/dashboard/packages'],[TrendingUp,'Completed trips',stats?.completed || 0,'/auth/dashboard/analytics']] as [ComponentType<{className?:string}>,string,number,string][]).map(([Icon,label,value,href]) => <button key={String(label)} onClick={() => router.push(String(href))} className="rounded-xl border border-slate-200 p-4 text-left hover:border-cyan-200 hover:bg-cyan-50/30"><Icon className="h-4 w-4 text-cyan-700" /><p className="mt-3 text-xs text-slate-500">{label}</p><p className="mt-1 text-xl font-bold">{String(value)}</p></button>)}</div></Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card><div className="mb-4 flex items-center justify-between"><div><h3 className="font-semibold">Upcoming Trips</h3><p className="text-xs text-slate-500">Next scheduled journeys.</p></div><button onClick={() => router.push('/auth/dashboard/calendar')} className="text-xs font-semibold text-cyan-700">Calendar <ArrowRight className="inline h-3 w-3" /></button></div>{upcoming.length ? <div className="space-y-3">{upcoming.map(b => <div key={b.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><div className="rounded-lg bg-cyan-100 px-2 py-2 text-center"><p className="text-[9px] font-bold uppercase text-cyan-700">{b.arrival_date ? new Date(b.arrival_date).toLocaleDateString('en-US',{month:'short'}) : '—'}</p><p className="text-lg font-bold text-cyan-800">{b.arrival_date ? new Date(b.arrival_date).getDate() : '—'}</p></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{b.safari_name || 'Custom Safari'}</p><p className="text-xs text-slate-500">{b.first_name} {b.last_name} · {guests(b)} guests</p></div><span className="text-[10px] font-semibold capitalize text-slate-500">{b.reservation_status}</span></div>)}</div> : <p className="py-8 text-sm text-slate-400">No upcoming trips.</p>}</Card>
        <Card><div className="mb-4 flex items-center justify-between"><div><h3 className="font-semibold">Quick Actions</h3><p className="text-xs text-slate-500">Common administration tasks.</p></div><RefreshCw className="h-4 w-4 text-slate-400" /></div><div className="grid grid-cols-2 gap-3"><button onClick={() => router.push('/auth/dashboard/bookings')} className="rounded-xl border border-slate-200 p-4 text-left hover:bg-slate-50"><Plus className="h-4 w-4" /><p className="mt-2 text-sm font-semibold">New booking</p></button><button onClick={() => reload()} className="rounded-xl border border-slate-200 p-4 text-left hover:bg-slate-50"><RefreshCw className="h-4 w-4" /><p className="mt-2 text-sm font-semibold">Refresh data</p></button><button onClick={() => router.push('/auth/dashboard/travelers')} className="rounded-xl border border-slate-200 p-4 text-left hover:bg-slate-50"><Users className="h-4 w-4" /><p className="mt-2 text-sm font-semibold">Find traveler</p></button><button onClick={() => router.push('/auth/dashboard/analytics')} className="rounded-xl border border-slate-200 p-4 text-left hover:bg-slate-50"><TrendingUp className="h-4 w-4" /><p className="mt-2 text-sm font-semibold">View analytics</p></button></div></Card>
      </section>
    </div>
  </AdminShell>;
}
