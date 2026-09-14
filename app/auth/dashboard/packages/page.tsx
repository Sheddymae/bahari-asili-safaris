'use client';

import { useEffect, useMemo, useState } from 'react';
import { Clock3, MapPin, Pencil, Plus, Save, Search, Star, Trash2, X } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import MediaPicker from '@/components/admin/MediaPicker';
import { useAdminData } from '@/components/admin/useAdminData';
import type { Safari } from '@/lib/tours-data';

type Form = Safari;
const blank = (): Form => ({ id: `new-${Date.now()}`, name: 'New Safari Program', tagline: '', days: 1, nights: 0, parks: [], lodges: [], tabs: ['tsavo'], rating: 0, reviewCount: 0, image: '', category: 'short', highlights: [], itinerary: [{ day: 'Day 1', title: 'New day', morning: '', afternoon: '', overnight: '' }], packingTips: [], included: [], excluded: [], activityLevel: 3, comfortLevel: 4 });
const split = (v: string) => v.split(/\n|,/).map(x => x.trim()).filter(Boolean);
const join = (v?: string[]) => Array.isArray(v) ? v.join('\n') : '';

export default function PackagesPage() {
  const { stats } = useAdminData();
  const [programs, setPrograms] = useState<Safari[]>([]);
  const [q, setQ] = useState('');
  const [locale, setLocale] = useState('en');
  const [selected, setSelected] = useState<Form | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [openDay, setOpenDay] = useState(0);

  async function load() {
    const r = await fetch(`/api/admin/programs?locale=${locale}`, { cache: 'no-store' });
    const d = await r.json();
    if (d.success) setPrograms([...(d.programs || []), ...(d.custom || [])]);
    else setMessage(d.error || 'Unable to load programs.');
  }
  useEffect(() => { load(); }, [locale]);
  const visible = useMemo(() => programs.filter(s => `${s.name} ${s.tagline} ${(s.parks || []).join(' ')}`.toLowerCase().includes(q.toLowerCase())), [programs, q]);
  const update = (key: keyof Form, value: any) => setSelected(p => p ? { ...p, [key]: value } : p);

  async function save() {
    if (!selected || !selected.name.trim()) return;
    setBusy(true); setMessage('');
    try {
      const r = await fetch('/api/admin/programs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...selected, locale }) });
      const d = await r.json();
      if (!r.ok || !d.success) throw new Error(d.error || 'Save failed');
      setMessage('Safari program saved successfully.'); await load(); setSelected(null);
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Save failed'); } finally { setBusy(false); }
  }

  async function remove() {
    if (!selected || selected.id.startsWith('new-')) return setSelected(null);
    if (!confirm(`Delete ${selected.name} for ${locale}?`)) return;
    setBusy(true);
    try {
      const r = await fetch('/api/admin/programs', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: selected.id, locale }) });
      const d = await r.json(); if (!r.ok || !d.success) throw new Error(d.error || 'Delete failed');
      setSelected(null); await load();
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Delete failed'); } finally { setBusy(false); }
  }

  return <AdminShell title="Programs & Itineraries" badge={stats?.pending}>
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-700">Product management</p><h2 className="text-2xl font-bold">Safari Programs</h2><p className="text-sm text-slate-500">Manage safari details, images and day-by-day itineraries.</p></div><div className="flex gap-2"><select value={locale} onChange={e => setLocale(e.target.value)} className="rounded-xl border bg-white px-3 py-2.5 text-sm"><option value="en">English</option><option value="it">Italiano</option><option value="fr">Français</option><option value="es">Español</option><option value="de">Deutsch</option><option value="ar">العربية</option><option value="zh">中文</option><option value="sw">Kiswahili</option></select><button onClick={() => setSelected(blank())} className="rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white"><Plus className="mr-2 inline h-4 w-4" />New safari</button></div></div>
      <div className="flex gap-3"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search safari programs..." className="w-full rounded-xl border bg-white py-3 pl-9 pr-3 text-sm" /></div>{message && <div className="rounded-xl bg-slate-900 px-4 py-3 text-xs text-white">{message}</div>}</div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visible.map(s => <button key={s.id} onClick={() => { setSelected({ ...s, itinerary: [...(s.itinerary || [])] }); setOpenDay(0); }} className="rounded-2xl border bg-white p-5 text-left shadow-sm hover:shadow-md"><div className="flex gap-3"><div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">{s.image ? <img src={s.image} alt="" className="h-full w-full object-cover" /> : null}</div><div className="min-w-0"><h3 className="font-bold">{s.name}</h3><p className="mt-1 text-xs text-slate-500">{s.tagline}</p><p className="mt-3 text-xs text-slate-500"><Clock3 className="mr-1 inline h-3 w-3" />{s.days}D/{s.nights}N · <MapPin className="mr-1 inline h-3 w-3" />{s.parks.join(', ')}</p></div></div><div className="mt-4 border-t pt-3 text-xs text-cyan-700"><Pencil className="mr-1 inline h-3.5 w-3.5" />Edit program & itinerary</div></button>)}</div>
      {!visible.length && <div className="rounded-2xl border bg-white p-12 text-center text-sm text-slate-500">No safari programs found.</div>}
    </div>
    {selected && <div className="fixed inset-0 z-[70] bg-slate-950/50 p-3 sm:p-6"><div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b p-5"><div><p className="text-xs uppercase tracking-wider text-cyan-700">{locale} safari editor</p><h3 className="text-xl font-bold">{selected.name}</h3></div><button onClick={() => setSelected(null)}><X /></button></div><div className="flex-1 overflow-y-auto p-5"><div className="grid gap-4 md:grid-cols-2">
      <label className="text-xs font-semibold">Program name<input value={selected.name} onChange={e => update('name', e.target.value)} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label><label className="text-xs font-semibold">Tagline<input value={selected.tagline} onChange={e => update('tagline', e.target.value)} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label><label className="text-xs font-semibold">Slug / ID<input value={selected.id} disabled={!selected.id.startsWith('new-')} onChange={e => update('id', e.target.value)} className="mt-1 w-full rounded-lg border p-2.5 text-sm disabled:bg-slate-50" /></label>
      <div className="text-xs font-semibold md:col-span-2"><span>Main image</span><div className="mt-1"><MediaPicker value={selected.image} onChange={url => update('image', url)} category="safaris" /></div></div>
      <label className="text-xs font-semibold">Days<input type="number" min="1" value={selected.days} onChange={e => update('days', Number(e.target.value))} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label><label className="text-xs font-semibold">Nights<input type="number" min="0" value={selected.nights} onChange={e => update('nights', Number(e.target.value))} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label><label className="text-xs font-semibold">Category<select value={selected.category} onChange={e => update('category', e.target.value)} className="mt-1 w-full rounded-lg border p-2.5 text-sm"><option value="short">Short</option><option value="medium">Medium</option><option value="long">Long</option></select></label><label className="text-xs font-semibold">Rating<input type="number" min="0" max="5" step="0.1" value={selected.rating} onChange={e => update('rating', Number(e.target.value))} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label><label className="text-xs font-semibold">Review count<input type="number" min="0" value={selected.reviewCount} onChange={e => update('reviewCount', Number(e.target.value))} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label><label className="flex items-center gap-2 self-end text-xs font-semibold"><input type="checkbox" checked={!!selected.popular} onChange={e => update('popular', e.target.checked)} /> Featured / popular</label>
      <label className="text-xs font-semibold">Parks / destinations<textarea value={join(selected.parks)} onChange={e => update('parks', split(e.target.value))} rows={3} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label><label className="text-xs font-semibold">Accommodation / lodges<textarea value={join(selected.lodges)} onChange={e => update('lodges', split(e.target.value))} rows={3} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label><label className="text-xs font-semibold md:col-span-2">Highlights<textarea value={join(selected.highlights)} onChange={e => update('highlights', split(e.target.value))} rows={3} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label><label className="text-xs font-semibold md:col-span-2">Packing tips<textarea value={join(selected.packingTips)} onChange={e => update('packingTips', split(e.target.value))} rows={3} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label><label className="text-xs font-semibold">Included<textarea value={join(selected.included)} onChange={e => update('included', split(e.target.value))} rows={4} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label><label className="text-xs font-semibold">Excluded<textarea value={join(selected.excluded)} onChange={e => update('excluded', split(e.target.value))} rows={4} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>
      </div>
      <div className="mt-7"><div className="flex items-center justify-between"><h4 className="font-bold">Day-by-day itinerary</h4><button onClick={() => { const next = [...selected.itinerary, { day: `Day ${selected.itinerary.length + 1}`, title: 'New day', morning: '', afternoon: '', overnight: '' }]; update('itinerary', next); setOpenDay(next.length - 1); }} className="rounded-lg border px-3 py-2 text-xs font-semibold"><Plus className="mr-1 inline h-3.5 w-3.5" />Add day</button></div><div className="mt-3 space-y-3">{selected.itinerary.map((d, i) => <div key={`${i}-${d.day}`} className="rounded-xl border"><button onClick={() => setOpenDay(openDay === i ? -1 : i)} className="flex w-full items-center justify-between p-4 text-left"><span className="font-semibold">{d.day} — {d.title}</span><span className="text-slate-400">{openDay === i ? '−' : '+'}</span></button>{openDay === i && <div className="grid gap-3 border-t p-4 md:grid-cols-2"><label className="text-xs font-semibold">Day<input value={d.day} onChange={e => { const a = [...selected.itinerary]; a[i] = { ...a[i], day: e.target.value }; update('itinerary', a); }} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label><label className="text-xs font-semibold">Title<input value={d.title} onChange={e => { const a = [...selected.itinerary]; a[i] = { ...a[i], title: e.target.value }; update('itinerary', a); }} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>{(['morning', 'afternoon', 'overnight'] as const).map(key => <label key={key} className="text-xs font-semibold md:col-span-2">{key}<textarea value={d[key]} onChange={e => { const a = [...selected.itinerary]; a[i] = { ...a[i], [key]: e.target.value }; update('itinerary', a); }} rows={3} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>)}<button onClick={() => update('itinerary', selected.itinerary.filter((_, n) => n !== i))} className="text-left text-xs font-semibold text-red-600"><Trash2 className="mr-1 inline h-3.5 w-3.5" />Remove day</button></div>}</div>)}</div></div>
      </div><div className="flex items-center justify-between border-t bg-slate-50 p-4"><button onClick={remove} disabled={busy || selected.id.startsWith('new-')} className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 disabled:opacity-40"><Trash2 className="mr-2 inline h-4 w-4" />Delete locale</button><div className="flex gap-2"><button onClick={() => setSelected(null)} className="rounded-lg border px-4 py-2.5 text-sm">Cancel</button><button onClick={save} disabled={busy} className="rounded-lg bg-cyan-700 px-5 py-2.5 text-sm font-semibold text-white"><Save className="mr-2 inline h-4 w-4" />{busy ? 'Saving...' : 'Save & publish'}</button></div></div></div></div>}
  </AdminShell>;
}
