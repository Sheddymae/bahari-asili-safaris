'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, Image as ImageIcon, Search, Trash2, Upload, X } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import { useAdminData } from '@/components/admin/useAdminData';

type Category = 'safaris' | 'excursions' | 'safari_blu' | 'blog' | 'gallery' | 'general';
type Media = { id: string; filename: string; storage_path: string; public_url: string; mime_type: string; size_bytes: number; category: Category; alt_text?: string | null; uploaded_by?: string | null; created_at: string };

const categories: { value: Category; label: string }[] = [
  { value: 'safaris', label: 'Safaris' },
  { value: 'excursions', label: 'Excursions' },
  { value: 'safari_blu', label: 'Safari Blu' },
  { value: 'blog', label: 'Blog' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'general', label: 'General' },
];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaPage() {
  const { stats } = useAdminData();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Media[]>([]);
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [q, setQ] = useState('');
  const [uploadCategory, setUploadCategory] = useState<Category>('general');
  const [altText, setAltText] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const load = async () => {
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (q.trim()) params.set('q', q.trim());
    const response = await fetch(`/api/admin/media?${params}`, { cache: 'no-store' });
    const data = await response.json();
    if (data.success) setItems(data.items || []);
    else setMessage(data.error || 'Unable to load media.');
  };

  useEffect(() => { load(); }, [category]);

  const visible = useMemo(() => {
    if (!q.trim()) return items;
    const needle = q.toLowerCase();
    return items.filter(item => `${item.filename} ${item.alt_text || ''}`.toLowerCase().includes(needle));
  }, [items, q]);

  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setBusy(true); setMessage('');
    try {
      for (const file of files) {
        const form = new FormData();
        form.append('file', file);
        form.append('category', uploadCategory);
        form.append('alt_text', altText);
        const response = await fetch('/api/admin/media', { method: 'POST', body: form });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(`${file.name}: ${data.error || 'Upload failed'}`);
      }
      setMessage(`${files.length} image${files.length === 1 ? '' : 's'} uploaded successfully.`);
      setAltText('');
      if (inputRef.current) inputRef.current.value = '';
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed');
    } finally { setBusy(false); }
  }

  async function remove(item: Media) {
    if (!confirm(`Delete ${item.filename}? This removes the stored image.`)) return;
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/admin/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, storage_path: item.storage_path }) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Delete failed');
      await load(); setMessage('Media deleted.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Delete failed'); }
    finally { setBusy(false); }
  }

  async function copyUrl(item: Media) {
    await navigator.clipboard.writeText(item.public_url);
    setCopied(item.id); window.setTimeout(() => setCopied(null), 1600);
  }

  return <AdminShell title="Media Library" badge={stats?.pending}>
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-700">Content management</p><h2 className="text-2xl font-bold">Media Library</h2><p className="text-sm text-slate-500">Upload and organize production images for safaris, excursions, Safari Blu, blog and gallery content.</p></div>
        <div className="flex flex-wrap gap-2">
          <select value={uploadCategory} onChange={e => setUploadCategory(e.target.value as Category)} className="rounded-xl border bg-white px-3 py-2.5 text-sm">{categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={upload} className="hidden" />
          <button disabled={busy} onClick={() => inputRef.current?.click()} className="rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Upload className="mr-2 inline h-4 w-4" />{busy ? 'Working...' : 'Upload images'}</button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 shadow-sm"><div className="grid gap-3 md:grid-cols-[1fr_220px_1fr] md:items-center"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} placeholder="Search filename or alt text..." className="w-full rounded-xl border py-3 pl-9 pr-3 text-sm" /></div><select value={category} onChange={e => setCategory(e.target.value as Category | 'all')} className="rounded-xl border px-3 py-3 text-sm"><option value="all">All media</option>{categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select><div className="text-xs text-slate-500">JPG, PNG, WebP or GIF · maximum 10 MB each</div></div><div className="mt-3 grid gap-2 md:grid-cols-[1fr_auto]"><input value={altText} onChange={e => setAltText(e.target.value)} placeholder="Optional alt text applied to the next upload batch" className="rounded-xl border px-3 py-2.5 text-sm" /><span className="rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500">Use descriptive filenames for SEO and accessibility.</span></div></div>

      {message && <div className="flex items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-xs text-white"><span>{message}</span><button onClick={() => setMessage('')} aria-label="Dismiss"><X className="h-4 w-4" /></button></div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visible.map(item => <article key={item.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="aspect-[4/3] bg-slate-100"><img src={item.public_url} alt={item.alt_text || item.filename} className="h-full w-full object-cover" loading="lazy" /></div><div className="p-4"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-sm font-semibold" title={item.filename}>{item.filename}</p><p className="mt-1 text-[11px] text-slate-400">{formatSize(item.size_bytes)} · {item.category}</p></div><ImageIcon className="h-4 w-4 shrink-0 text-slate-400" /></div><div className="mt-3 flex gap-2"><button onClick={() => copyUrl(item)} className="flex-1 rounded-lg border px-2.5 py-2 text-xs font-semibold hover:bg-slate-50">{copied === item.id ? <><Check className="mr-1 inline h-3.5 w-3.5" />Copied</> : <><Copy className="mr-1 inline h-3.5 w-3.5" />Copy URL</>}</button><button onClick={() => remove(item)} disabled={busy} className="rounded-lg border border-red-200 px-2.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50" aria-label={`Delete ${item.filename}`}><Trash2 className="h-3.5 w-3.5" /></button></div></div></article>)}</div>
      {!visible.length && <div className="rounded-2xl border bg-white p-14 text-center text-sm text-slate-500"><ImageIcon className="mx-auto mb-3 h-8 w-8 text-slate-300" />No media found. Upload your first production image.</div>}
    </div>
  </AdminShell>;
}
