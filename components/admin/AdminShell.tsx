'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Anchor, BarChart3, Bell, BookOpen, CalendarCheck2, CalendarDays, ChevronDown, ChevronRight, FileSpreadsheet, FileText, LayoutDashboard, LogOut, Menu, MapPinned, Newspaper, Package, PanelLeftClose, PanelLeftOpen, ReceiptText, ScrollText, Users, WalletCards, Waves, X } from 'lucide-react';

const nav = [
  { section: 'Workspace', href: '/auth/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { section: 'Workspace', href: '/auth/dashboard/bookings', label: 'Bookings', icon: CalendarCheck2 },
  { section: 'Workspace', href: '/auth/dashboard/calendar', label: 'Calendar', icon: CalendarDays },
  { section: 'Workspace', href: '/auth/dashboard/travelers', label: 'Travelers', icon: Users },
  { section: 'Workspace', href: '/auth/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { section: 'Content', href: '/auth/dashboard/packages', label: 'Safaris', icon: Package },
  { section: 'Content', href: '/auth/dashboard/excursions', label: 'Excursions', icon: MapPinned },
  { section: 'Content', href: '/auth/dashboard/safari-blu', label: 'Safari Blu', icon: Waves },
  { section: 'Content', href: '/auth/dashboard/blog', label: 'Blog', icon: BookOpen },
  { section: 'Content', href: '/auth/dashboard/articles', label: 'Articles', icon: FileText },
  { section: 'Content', href: '/auth/dashboard/news', label: 'News', icon: Newspaper },
  { section: 'Documents', href: '/auth/dashboard/quotations', label: 'Quotations', icon: FileSpreadsheet },
  { section: 'Documents', href: '/auth/dashboard/invoices', label: 'Invoices', icon: FileText },
  { section: 'Documents', href: '/auth/dashboard/vouchers', label: 'Vouchers', icon: ScrollText },
  { section: 'Documents', href: '/auth/dashboard/itineraries', label: 'Itineraries', icon: MapPinned },
  { section: 'Documents', href: '/auth/dashboard/payments', label: 'Payments', icon: WalletCards },
  { section: 'Documents', href: '/auth/dashboard/documents', label: 'Visa Documents', icon: ReceiptText },
];

const sections = ['Workspace', 'Content', 'Documents'];
const defaultOpen = { Workspace: true, Content: true, Documents: false };

type SectionName = keyof typeof defaultOpen;

export default function AdminShell({ children, title, badge }: { children: React.ReactNode; title: string; badge?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<SectionName, boolean>>(defaultOpen);
  const [identity, setIdentity] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    try {
      const savedCollapsed = window.localStorage.getItem('bahari-admin-sidebar-collapsed');
      const savedSections = window.localStorage.getItem('bahari-admin-sidebar-sections');
      if (savedCollapsed === '1') setCollapsed(true);
      if (savedSections) {
        const parsed = JSON.parse(savedSections) as Partial<Record<SectionName, boolean>>;
        setOpenSections((current) => ({ ...current, ...parsed }));
      }
    } catch { /* preferences are optional */ }

    fetch('/api/admin/session').then(async (r) => { if (!r.ok) throw new Error('Unauthorized'); return r.json(); }).then((data) => mounted && setIdentity({ username: data.username || 'Admin', role: data.role || 'owner' })).catch(() => router.push('/auth/login'));
    return () => { mounted = false; };
  }, [router]);

  useEffect(() => {
    try { window.localStorage.setItem('bahari-admin-sidebar-collapsed', collapsed ? '1' : '0'); } catch { /* ignore */ }
  }, [collapsed]);

  useEffect(() => {
    try { window.localStorage.setItem('bahari-admin-sidebar-sections', JSON.stringify(openSections)); } catch { /* ignore */ }
  }, [openSections]);

  useEffect(() => {
    const activeSection = nav.find((item) => item.href !== '/auth/dashboard' && pathname.startsWith(item.href))?.section as SectionName | undefined;
    if (activeSection) setOpenSections((current) => current[activeSection] ? current : { ...current, [activeSection]: true });
  }, [pathname]);

  async function logout() { await fetch('/api/admin/logout', { method: 'POST' }).catch(() => undefined); router.push('/auth/login'); }
  const active = (href: string) => href === '/auth/dashboard' ? pathname === href : pathname.startsWith(href);
  const groupedNav = useMemo(() => Object.fromEntries(sections.map((section) => [section, nav.filter((item) => item.section === section)])), []);

  function toggleSection(section: SectionName) {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }));
  }

  return <div className="min-h-screen bg-[#f5f8fb] text-slate-900">
    <aside className={`fixed inset-y-0 left-0 z-50 border-r border-slate-200 bg-white transition-all duration-200 lg:translate-x-0 ${collapsed ? 'w-[76px]' : 'w-64'} ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex h-full flex-col">
        <div className={`flex h-[76px] items-center border-b border-slate-100 ${collapsed ? 'justify-center px-2' : 'gap-3 px-5'}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-700 text-white"><Anchor className="h-5 w-5" /></div>
          {!collapsed && <div className="min-w-0"><p className="font-bold tracking-tight">Bahari Asili</p><p className="text-xs text-slate-500">Safaris</p></div>}
          <button onClick={() => setOpen(false)} className="ml-auto rounded-lg p-2 hover:bg-slate-100 lg:hidden" aria-label="Close navigation"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pt-5">
          {sections.map((section) => {
            const sectionOpen = openSections[section as SectionName];
            const items = groupedNav[section as SectionName] || [];
            const hasActive = items.some((item) => active(item.href));
            return <div key={section} className="mb-4">
              {collapsed ? (
                <div className="mb-2 border-t border-slate-100 pt-3 first:border-t-0 first:pt-0" aria-hidden="true" />
              ) : (
                <button onClick={() => toggleSection(section as SectionName)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-slate-50" aria-expanded={sectionOpen}>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{section}</span>
                  {sectionOpen ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
                </button>
              )}
              {(sectionOpen || collapsed || hasActive) && <nav className="space-y-1" aria-label={`${section} navigation`}>
                {items.map(({ href, label, icon: Icon }) => <button key={href} onClick={() => { router.push(href); setOpen(false); }} title={collapsed ? label : undefined} aria-label={collapsed ? label : undefined} className={`group flex w-full items-center rounded-xl py-2.5 text-sm font-medium transition ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'} ${active(href) ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <><span className="min-w-0 flex-1 truncate text-left">{label}</span>{label === 'Bookings' && badge ? <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active(href) ? 'bg-white/20' : 'bg-orange-50 text-orange-600'}`}>{badge}</span> : null}</>}
                </button>)}
              </nav>}
            </div>;
          })}
        </div>

        <div className="border-t border-slate-100 p-3">
          <button onClick={() => setCollapsed((value) => !value)} className="mb-2 hidden w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 lg:flex" title={collapsed ? 'Expand navigation' : 'Collapse navigation'}>
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <><PanelLeftClose className="h-4 w-4" />Collapse navigation</>}
          </button>
          {!collapsed && <div className="mb-3 rounded-xl bg-slate-50 p-3"><p className="truncate text-xs font-semibold">Signed in as {identity?.username || 'Admin'}</p><p className="mt-1 text-[11px] capitalize text-slate-500">{identity?.role || 'admin'}</p></div>}
          <button onClick={logout} title={collapsed ? 'Logout' : undefined} className={`flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'}`}><LogOut className="h-4 w-4" />{!collapsed && 'Logout'}</button>
        </div>
      </div>
    </aside>

    {open && <button className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" />}
    <div className={collapsed ? 'lg:pl-[76px]' : 'lg:pl-64'}>
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
  </div>;
}
