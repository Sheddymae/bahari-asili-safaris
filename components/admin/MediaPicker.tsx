'use client';

import { useEffect, useState } from 'react';
import { Check, Image as ImageIcon, Search, X } from 'lucide-react';

type MediaItem = { id: string; filename: string; public_url: string; category?: string; alt_text?: string | null };

export default function MediaPicker({ value, onChange, category }: { value?: string | null; onChange: (url: string) => void; category?: string }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    fetch(`/api/admin/media?${params.toString()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(data => { if (!cancelled && data.success) setItems(data.items || []); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [open, category]);

  const visible = items.filter(item => `${item.filename} ${item.alt_text || ''}`.toLowerCase().includes(q.toLowerCase()));

  return <div>
    <div className="flex gap-2">
      <div className="min-w-0 flex-1 rounded-lg border bg-slate-50 p-2">
        {value ? <div className="flex items-center gap-3"><img src={value} alt="Selected" className="h-12 w-16 rounded-md object-cover" /><span className="min-w-0 flex-1 truncate text-xs text-slate-500">{value}</span></div> : <div className="flex h-12 items-center gap-2 text-xs text-slate-400"><ImageIcon className="h-4 w-4" />No image selected</div>}
      </div>
      <button type="button" onClick={() => setOpen(true)} className="shrink-0 rounded-lg bg-cyan-700 px-3 py-2 text-xs font-semibold text-white">Choose media</button>
      {value && <button type="button" onClick={() => onChange('')} className="shrink-0 rounded-lg border px-3 py-2 text-xs font-semibold text-slate-600">Clear</button>}
    </div>
    {open && <div className="fixed inset-0 z-[100] bg-slate-950/50 p-3 sm:p-6"><div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b p-5"><div><p className="text-xs font-bold uppercase tracking-wider text-cyan-700">Media library</p><h3 className="text-xl font-bold">Choose an image</h3></div><button type="button" onClick={() => setOpen(false)}><X /></button></div><div className="border-b p-4"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search media..." className="w-full rounded-xl border py-3 pl-9 pr-3 text-sm" /></div></div><div className="flex-1 overflow-y-auto p-5">{loading ? <div className="p-12 text-center text-sm text-slate-500">Loading media...</div> : visible.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{visible.map(item => <button type="button" key={item.id} onClick={() => { onChange(item.public_url); setOpen(false); }} className={`overflow-hidden rounded-xl border text-left transition hover:shadow-md ${value === item.public_url ? 'ring-2 ring-cyan-600' : ''}`}><div className="aspect-[4/3] bg-slate-100"><img src={item.public_url} alt={item.alt_text || item.filename} className="h-full w-full object-cover" loading="lazy" /></div><div className="flex items-center gap-2 p-3"><span className="min-w-0 flex-1 truncate text-xs font-semibold">{item.filename}</span>{value === item.public_url && <Check className="h-4 w-4 shrink-0 text-cyan-700" />}</div></button>)}</div> : <div className="p-12 text-center text-sm text-slate-500">No media found. Upload an image in Media Library first.</div>}</div><div className="border-t bg-slate-50 p-4 text-right"><button type="button" onClick={() => setOpen(false)} className="rounded-lg border bg-white px-4 py-2.5 text-sm font-semibold">Close</button></div></div></div>}
  </div>;
}
