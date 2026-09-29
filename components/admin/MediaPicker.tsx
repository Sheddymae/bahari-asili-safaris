'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, Image as ImageIcon, Search, X } from 'lucide-react';

type MediaItem = {
  id: string;
  filename: string;
  public_url: string;
  category?: string;
  alt_text?: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  safaris: 'Safaris',
  excursions: 'Excursions',
  safari_blu: 'Safari Blu',
  blog: 'Blog',
  gallery: 'Gallery',
  general: 'General',
};

export default function MediaPicker({ value, onChange, category }: { value?: string | null; onChange: (url: string) => void; category?: string }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setError('');

    // The picker loads the complete production library. The content category
    // is preferred when possible, but is not a hard restriction.
    fetch('/api/admin/media', { cache: 'no-store' })
      .then(async response => {
        const data = await response.json().catch(() => null);
        if (!response.ok || !data?.success) {
          throw new Error(data?.error || 'Unable to load media library.');
        }
        if (!cancelled) setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch(err => {
        if (!cancelled) {
          setItems([]);
          setError(err instanceof Error ? err.message : 'Unable to load media library.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [open]);

  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter(item => !needle || (item.filename + ' ' + (item.alt_text || '') + ' ' + (item.category || '')).toLowerCase().includes(needle));
  }, [items, q]);

  const preferred = category ? visible.filter(item => item.category === category) : visible;
  const displayItems = preferred.length ? preferred : visible;

  return <div>
    <div className="flex gap-2">
      <div className="min-w-0 flex-1 rounded-lg border bg-slate-50 p-2">
        {value ? <div className="flex items-center gap-3"><img src={value} alt="Selected" className="h-12 w-16 rounded-md object-cover" /><span className="min-w-0 flex-1 truncate text-xs text-slate-500">{value}</span></div> : <div className="flex h-12 items-center gap-2 text-xs text-slate-400"><ImageIcon className="h-4 w-4" />No image selected</div>}
      </div>
      <button type="button" onClick={() => setOpen(true)} className="shrink-0 rounded-lg bg-cyan-700 px-3 py-2 text-xs font-semibold text-white">Choose media</button>
      {value && <button type="button" onClick={() => onChange('')} className="shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold text-slate-600">Clear</button>}
    </div>

    {open && <div className="fixed inset-0 z-[100] bg-slate-950/50 p-3 sm:p-6"><div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b p-5"><div><p className="text-xs font-bold uppercase tracking-wider text-cyan-700">Media library</p><h3 className="text-xl font-bold">Choose an image</h3><p className="mt-1 text-xs text-slate-500">{category && CATEGORY_LABELS[category] ? 'Showing all uploads, with ' + CATEGORY_LABELS[category] + ' preferred.' : 'Choose from all uploaded production images.'}</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Close media library"><X /></button></div>
      <div className="border-b p-4"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search filename, alt text or category..." className="w-full rounded-xl border py-3 pl-9 pr-3 text-sm" /></div></div>
      <div className="flex-1 overflow-y-auto p-5">{loading ? <div className="p-12 text-center text-sm text-slate-500">Loading media...</div> : error ? <div className="mx-auto max-w-xl rounded-xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-700">{error}</div> : displayItems.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{displayItems.map(item => <button type="button" key={item.id} onClick={() => { onChange(item.public_url); setOpen(false); }} className={'overflow-hidden rounded-xl border text-left transition hover:shadow-md ' + (value === item.public_url ? 'ring-2 ring-cyan-600' : '')}><div className="aspect-[4/3] bg-slate-100"><img src={item.public_url} alt={item.alt_text || item.filename} className="h-full w-full object-cover" loading="lazy" /></div><div className="flex items-center gap-2 p-3"><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">{item.filename}</span><span className="mt-1 block text-[10px] font-medium uppercase tracking-wide text-slate-400">{CATEGORY_LABELS[item.category || ''] || item.category || 'General'}</span></span>{value === item.public_url && <Check className="h-4 w-4 shrink-0 text-cyan-700" />}</div></button>)}</div> : <div className="p-12 text-center text-sm text-slate-500"><ImageIcon className="mx-auto mb-3 h-8 w-8 text-slate-300" />No media found. Upload an image in Media Library first.</div>}</div>
      <div className="border-t bg-slate-50 p-4 text-right"><button type="button" onClick={() => setOpen(false)} className="rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold">Close</button></div>
    </div></div>}
  </div>;
}
