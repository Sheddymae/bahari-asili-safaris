'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileText, Image as ImageIcon, Pencil, Plus, Save, Search, Archive, X } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { useAdminData } from '@/components/admin/useAdminData';

type ContentType = 'excursion' | 'safari_blu' | 'blog' | 'article' | 'news';
type Item = { id?: string; content_type: ContentType; slug: string; locale: string; title: string; excerpt?: string | null; body?: string | null; image?: string | null; category?: string | null; duration?: string | null; location?: string | null; price?: number | null; currency?: string | null; highlights?: string[]; included?: string[]; excluded?: string[]; status: 'draft' | 'published' | 'archived'; featured?: boolean; author?: string | null; tags?: string[]; seo_title?: string | null; seo_description?: string | null; extra?: Record<string, any> };

const labels: Record<ContentType, string> = { excursion: 'Excursions', safari_blu: 'Safari Blu', blog: 'Blog', article: 'Articles', news: 'News' };
const blank = (type: ContentType): Item => ({ content_type: type, slug: '', locale: 'en', title: '', excerpt: '', body: '', image: '', category: '', duration: '', location: 'Watamu, Kenya', price: null, currency: 'KES', highlights: [], included: [], excluded: [], status: 'draft', featured: false, author: '', tags: [], seo_title: '', seo_description: '', extra: {} });
const lines = (value?: string[] | null) => Array.isArray(value) ? value.join('\n') : '';
const array = (value: string) => value.split(/\n|,/).map(x => x.trim()).filter(Boolean);

export default function ContentManager({ type }: { type: ContentType }) {
  const { stats } = useAdminData();
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [q, setQ] = useState('');
  const [locale, setLocale] = useState('en');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    const response = await fetch(`/api/admin/content?type=${type}&locale=${locale}`, { cache: 'no-store' });
    const data = await response.json();
    if (data.success) setItems(data.items || []);
    else setMessage(data.error || 'Unable to load content.');
  };
  useEffect(() => { load(); }, [type, locale]);

  const visible = useMemo(() => items.filter(x => `${x.title} ${x.slug} ${x.category || ''}`.toLowerCase().includes(q.toLowerCase())), [items, q]);
  const update = (key: keyof Item, value: any) => setSelected(current => current ? { ...current, [key]: value } : current);

  async function save() {
    if (!selected) return;
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...selected, locale }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Save failed');
      setMessage(`${labels[type]} saved successfully.`);
      await load();
      setSelected(null);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Save failed'); }
    finally { setBusy(false); }
  }

  async function archive() {
    if (!selected || !confirm(`Archive “${selected.title}”?`)) return;
    setBusy(true);
    try {
      const response = await fetch('/api/admin/content', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content_type: selected.content_type, slug: selected.slug, locale }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Archive failed');
      await load(); setSelected(null); setMessage('Content archived.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Archive failed'); }
    finally { setBusy(false); }
  }

  return <AdminShell title={`${labels[type]} Content`} badge={stats?.pending}>
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-700">Content management</p><h2 className="text-2xl font-bold">{labels[type]}</h2><p className="text-sm text-slate-500">Create, edit, publish and archive customer-facing {labels[type].toLowerCase()}.</p></div>
        <div className="flex gap-2"><select value={locale} onChange={e => setLocale(e.target.value)} className="rounded-xl border bg-white px-3 py-2.5 text-sm"><option value="en">English</option><option value="it">Italiano</option><option value="fr">Français</option><option value="es">Español</option><option value="de">Deutsch</option><option value="sw">Kiswahili</option></select><button onClick={() => setSelected(blank(type))} className="rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white"><Plus className="mr-2 inline h-4 w-4" />New {type === 'safari_blu' ? 'Safari Blu' : type}</button></div>
      </div>
      <div className="flex gap-3"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={q} onChange={e => setQ(e.target.value)} placeholder={`Search ${labels[type].toLowerCase()}...`} className="w-full rounded-xl border bg-white py-3 pl-9 pr-3 text-sm" /></div>{message && <div className="rounded-xl bg-slate-900 px-4 py-3 text-xs text-white">{message}</div>}</div>
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Content</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Updated</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y">{visible.map(item => <tr key={`${item.content_type}-${item.locale}-${item.slug}`} className="hover:bg-slate-50"><td className="px-4 py-4"><div className="flex items-center gap-3">{item.image ? <img src={item.image} alt="" className="h-12 w-16 rounded-lg object-cover" /> : <div className="flex h-12 w-16 items-center justify-center rounded-lg bg-slate-100"><ImageIcon className="h-5 w-5 text-slate-400" /></div>}<div><p className="font-semibold">{item.title || 'Untitled'}</p><p className="text-xs text-slate-400">/{item.slug}</p></div></div></td><td className="px-4 py-4 text-slate-600">{item.category || '—'}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.status === 'published' ? 'bg-cyan-50 text-cyan-700' : item.status === 'archived' ? 'bg-slate-100 text-slate-500' : 'bg-orange-50 text-orange-700'}`}>{item.status}</span></td><td className="px-4 py-4 text-xs text-slate-500">{item.published_at ? new Date(item.published_at).toLocaleDateString() : '—'}</td><td className="px-4 py-4 text-right"><button onClick={() => setSelected({ ...item })} className="rounded-lg border px-3 py-2 text-xs font-semibold hover:bg-slate-50"><Pencil className="mr-1 inline h-3.5 w-3.5" />Edit</button></td></tr>)}</tbody></table></div>{visible.length === 0 && <div className="p-12 text-center text-sm text-slate-500"><FileText className="mx-auto mb-3 h-8 w-8 text-slate-300" />No {labels[type].toLowerCase()} found.</div>}</div>
    </div>
    {selected && <div className="fixed inset-0 z-[70] bg-slate-950/50 p-3 sm:p-6"><div className="mx-auto flex h-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b p-5"><div><p className="text-xs uppercase tracking-wider text-cyan-700">{locale} editor</p><h3 className="text-xl font-bold">{selected.title || `New ${labels[type]}`}</h3></div><button onClick={() => setSelected(null)}><X /></button></div><div className="flex-1 overflow-y-auto p-5"><div className="grid gap-4 md:grid-cols-2">
      <label className="text-xs font-semibold md:col-span-2">Title<input value={selected.title} onChange={e => update('title', e.target.value)} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>
      <label className="text-xs font-semibold">Slug<input value={selected.slug} onChange={e => update('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>
      <label className="text-xs font-semibold">Category<input value={selected.category || ''} onChange={e => update('category', e.target.value)} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>
      <label className="text-xs font-semibold">Main image URL<input value={selected.image || ''} onChange={e => update('image', e.target.value)} placeholder="/images/..." className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>
      <label className="text-xs font-semibold">Duration<input value={selected.duration || ''} onChange={e => update('duration', e.target.value)} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>
      <label className="text-xs font-semibold">Location<input value={selected.location || ''} onChange={e => update('location', e.target.value)} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>
      <label className="text-xs font-semibold">Price<input type="number" value={selected.price ?? ''} onChange={e => update('price', e.target.value === '' ? null : Number(e.target.value))} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>
      <label className="text-xs font-semibold">Currency<input value={selected.currency || 'KES'} onChange={e => update('currency', e.target.value.toUpperCase())} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>
      <label className="text-xs font-semibold md:col-span-2">Excerpt / short description<textarea value={selected.excerpt || ''} onChange={e => update('excerpt', e.target.value)} rows={3} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>
      <label className="text-xs font-semibold md:col-span-2">Article / full content<textarea value={selected.body || ''} onChange={e => update('body', e.target.value)} rows={10} className="mt-1 w-full rounded-lg border p-2.5 text-sm" placeholder="Write the full customer-facing content here..." /></label>
      <label className="text-xs font-semibold md:col-span-2">Highlights<textarea value={lines(selected.highlights)} onChange={e => update('highlights', array(e.target.value))} rows={4} className="mt-1 w-full rounded-lg border p-2.5 text-sm" placeholder="One item per line" /></label>
      <label className="text-xs font-semibold">Included<textarea value={lines(selected.included)} onChange={e => update('included', array(e.target.value))} rows={4} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>
      <label className="text-xs font-semibold">Excluded<textarea value={lines(selected.excluded)} onChange={e => update('excluded', array(e.target.value))} rows={4} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>
      <label className="text-xs font-semibold">Author<input value={selected.author || ''} onChange={e => update('author', e.target.value)} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>
      <label className="text-xs font-semibold">Tags<textarea value={lines(selected.tags)} onChange={e => update('tags', array(e.target.value))} rows={2} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>
      <label className="text-xs font-semibold">SEO title<input value={selected.seo_title || ''} onChange={e => update('seo_title', e.target.value)} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>
      <label className="text-xs font-semibold">SEO description<input value={selected.seo_description || ''} onChange={e => update('seo_description', e.target.value)} className="mt-1 w-full rounded-lg border p-2.5 text-sm" /></label>
      <label className="text-xs font-semibold">Status<select value={selected.status} onChange={e => update('status', e.target.value)} className="mt-1 w-full rounded-lg border p-2.5 text-sm"><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
      <label className="flex items-center gap-2 self-end text-xs font-semibold"><input type="checkbox" checked={!!selected.featured} onChange={e => update('featured', e.target.checked)} /> Featured content</label>
    </div></div><div className="flex items-center justify-between border-t bg-slate-50 p-4"><button onClick={archive} disabled={busy || !selected.slug} className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 disabled:opacity-40"><Archive className="mr-2 inline h-4 w-4" />Archive</button><div className="flex gap-2"><button onClick={() => setSelected(null)} className="rounded-lg border px-4 py-2.5 text-sm">Cancel</button><button onClick={save} disabled={busy} className="rounded-lg bg-cyan-700 px-5 py-2.5 text-sm font-semibold text-white"><Save className="mr-2 inline h-4 w-4" />{busy ? 'Saving...' : selected.status === 'published' ? 'Save & publish' : 'Save draft'}</button></div></div></div></div>}
  </AdminShell>;
}
