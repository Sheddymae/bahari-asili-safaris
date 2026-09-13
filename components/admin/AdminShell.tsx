'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Anchor, BarChart3, Bell, CalendarCheck2, CalendarDays, FileSpreadsheet, FileText, LayoutDashboard, LogOut, Menu, MapPinned, Package, ReceiptText, ScrollText, Users, WalletCards, X } from 'lucide-react';

const nav = [
  { href: '/auth/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/auth/dashboard/bookings', label: 'Bookings', icon: CalendarCheck2 },
  { href: '/auth/dashboard/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/auth/dashboard/travelers', label: 'Travelers', icon: Users },
  { href: '/auth/dashboard/packages', label: 'Programs', icon: Package },
  { href: '/auth/dashboard/quotations', label: 'Quotations', icon: FileSpreadsheet },
  { href: '/auth/dashboard/invoices', label: 'Invoices', icon: FileText },
  { href: '/auth/dashboard/vouchers', label: 'Vouchers', icon: ScrollText },
  { href: '/auth/dashboard/itineraries', label: 'Itineraries', icon: MapPinned },
  { href: '/auth/dashboard/payments', label: 'Payments', icon: WalletCards },
  { href: '/auth/dashboard/documents', label: 'Visa Documents', icon: ReceiptText },
  { href: '/auth/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminShell({ children, title, badge }: { children: React.ReactNode; title: string; badge?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [identity, setIdentity] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch('/api/admin/session')
      .then(async (r) => {
        if (!r.ok) throw new Error('Unauthorized');
        return r.json();
      })
      .then((data) => mounted && setIdentity({ username: data.username || 'Admin', role: data.role || 'owner' }))
      .catch(() => router.push('/auth/login'));
    return () => { mounted = false; };
  }, [router]);

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => undefined);
    router.push('/auth/login');
  }

  const active = (href: string) => href === '/auth/dashboard' ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#f5f8fb] text-slate-900">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-700 text-white"><Anchor className="h-5 w-5" /></div>
            <div><p className="font-bold tracking-tight">Bahari Asili</p><p className="text-xs text-slate-500">Safaris</p></div>
            <button onClick={() => setOpen(false)} className="ml-auto rounded-lg p-2 hover:bg-slate-100 lg:hidden" aria-label="Close navigation"><X className="h-5 w-5" /></button>
          </div>
          <div className="px-4 pt-6">
            <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
            <nav className="space-y-1">
              {nav.map(({ href, label, icon: Icon }) => (
                <button key={href} onClick={() => { router.push(href); setOpen(false); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active(href) ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Icon className="h-4 w-4" />{label}
                  {label === 'Bookings' && badge ? <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${active(href) ? 'bg-white/20' : 'bg-orange-50 text-orange-600'}`}>{badge}</span> : null}
                </button>
              ))}
            </nav>
          </div>
          <div className="mt-auto border-t border-slate-100 p-4">
            <div className="mb-3 rounded-xl bg-slate-50 p-3"><p className="text-xs font-semibold">Signed in as {identity?.username || 'Admin'}</p><p className="mt-1 text-[11px] capitalize text-slate-500">{identity?.role || 'admin'}</p></div>
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600"><LogOut className="h-4 w-4" />Logout</button>
          </div>
        </div>
      </aside>
      {open && <button className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" />}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-[76px] items-center gap-3 px-4 sm:px-6 xl:px-8">
            <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
            <div className="min-w-0 flex-1"><p className="text-xs text-slate-400">Bahari Asili Safaris</p><h1 className="truncate text-lg font-bold">{title}</h1></div>
            <button onClick={() => router.push('/auth/dashboard/bookings')} className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50" aria-label="Open bookings"><Bell className="h-5 w-5" />{badge ? <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" /> : null}</button>
            <div className="hidden items-center gap-2 sm:flex"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">{(identity?.username || 'A').slice(0,1).toUpperCase()}</div><div className="hidden xl:block"><p className="text-xs font-semibold">{identity?.username || 'Admin'}</p><p className="text-[10px] capitalize text-slate-500">{identity?.role || 'admin'}</p></div></div>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 xl:p-8">{children}</main>
      </div>
    </div>
  );
}
