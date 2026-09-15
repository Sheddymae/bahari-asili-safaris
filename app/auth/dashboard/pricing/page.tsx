'use client';

import { useEffect, useState } from 'react';
import { Save, RefreshCw, TrendingUp, CircleDollarSign } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

const DESTINATIONS = ['tsavo', 'amboseli', 'mara', 'taita'];
const CURRENCIES = ['KES', 'USD', 'EUR'];

type Row = Record<string, any>;

export default function PricingAdminPage() {
  const [destinations, setDestinations] = useState<Row[]>([]);
  const [currencies, setCurrencies] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function load() {
    setLoading(true); setMessage('');
    try {
      const res = await fetch('/api/admin/pricing');
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not load pricing.');
      setDestinations(data.destinations);
      setCurrencies(data.currencies);
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Could not load pricing.'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function updateDestination(slug: string, key: string, value: any) {
    setDestinations(rows => rows.map(row => row.destination_slug === slug ? { ...row, [key]: value } : row));
  }
  function updateCurrency(currency: string, key: string, value: any) {
    setCurrencies(rows => rows.map(row => row.currency === currency ? { ...row, [key]: value } : row));
  }

  async function save() {
    setSaving(true); setMessage('');
    try {
      const res = await fetch('/api/admin/pricing', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ destinations, currencies }) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not save pricing.');
      setMessage(`Pricing saved by ${data.updatedBy || 'admin'}. New Safari Builder estimates will use these settings.`);
      await load();
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Could not save pricing.'); }
    finally { setSaving(false); }
  }

  const field = (row: Row, key: string) => Number(row[key] ?? 0);

  return <AdminShell title="Safari Pricing & Currencies">
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">Revenue controls</p><h2 className="mt-1 text-2xl font-bold">Safari pricing</h2><p className="mt-1 max-w-2xl text-sm text-slate-500">Set the authoritative KES cost inputs used by the Safari Builder. You can price manually or use a competitor benchmark plus your target markup.</p></div>
        <div className="flex gap-2"><button onClick={load} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"><RefreshCw className="h-4 w-4" />Refresh</button><button onClick={save} disabled={saving || loading} className="inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-800 disabled:opacity-50"><Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save pricing'}</button></div>
      </div>

      {message && <div className="rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-cyan-900">{message}</div>}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-5"><div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-cyan-700" /><h3 className="font-bold">Destination rate controls</h3></div><p className="mt-1 text-xs text-slate-500">All values are KES. Benchmark mode uses competitor reference × (1 + markup%).</p></div>
        {loading ? <div className="p-8 text-sm text-slate-500">Loading pricing…</div> : <div className="overflow-x-auto"><table className="min-w-[1100px] w-full text-sm"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-3">Destination</th><th className="p-3">Mode</th><th className="p-3">Accommodation / night</th><th className="p-3">Park adult / day</th><th className="p-3">Park child / day</th><th className="p-3">Guide + vehicle / day</th><th className="p-3">Meals adult / day</th><th className="p-3">Meals child / day</th><th className="p-3">Competitor ref.</th><th className="p-3">Markup %</th></tr></thead><tbody>{DESTINATIONS.map(slug => { const row = destinations.find(r => r.destination_slug === slug) || { destination_slug: slug, pricing_mode: 'manual' }; return <tr key={slug} className="border-t border-slate-100 align-top"><td className="p-3 font-bold capitalize">{slug}</td><td className="p-3"><select value={row.pricing_mode || 'manual'} onChange={e => updateDestination(slug, 'pricing_mode', e.target.value)} className="rounded-lg border border-slate-200 px-2 py-2"><option value="manual">Manual</option><option value="benchmark">Benchmark</option></select></td>{[['accommodation_per_night','Accommodation'],['park_fee_adult_per_day','Park adult'],['park_fee_child_per_day','Park child'],['guide_vehicle_per_day','Guide + vehicle'],['meals_adult_per_day','Meals adult'],['meals_child_per_day','Meals child'],['competitor_reference','Competitor ref']].map(([key,label]) => <td key={key} className="p-3"><label className="sr-only">{label}</label><input type="number" min="0" step="0.01" value={field(row,key)} onChange={e => updateDestination(slug,key,e.target.value)} className="w-32 rounded-lg border border-slate-200 px-2.5 py-2 outline-none focus:border-cyan-500" /></td>)}<td className="p-3"><input type="number" min="-100" max="500" step="0.5" value={field(row,'target_markup_percent')} onChange={e => updateDestination(slug,'target_markup_percent',e.target.value)} className="w-24 rounded-lg border border-slate-200 px-2.5 py-2 outline-none focus:border-cyan-500" /></td></tr>})}</tbody></table></div>}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 p-5"><div className="flex items-center gap-2"><CircleDollarSign className="h-5 w-5 text-cyan-700" /><h3 className="font-bold">Customer currencies</h3></div><p className="mt-1 text-xs text-slate-500">Set how many Kenyan shillings equal one unit of the selected currency. The customer chooses KES, USD or EUR on the final booking step.</p></div>
        {loading ? <div className="p-8 text-sm text-slate-500">Loading currencies…</div> : <div className="grid gap-4 p-5 sm:grid-cols-3">{CURRENCIES.map(code => { const row = currencies.find(r => r.currency === code) || { currency: code, kes_per_unit: code === 'KES' ? 1 : 1, active: true }; return <div key={code} className="rounded-xl border border-slate-200 p-4"><p className="font-bold">{code}</p><p className="mt-1 text-xs text-slate-500">KES per 1 {code}</p><input type="number" min="0.0001" step="0.0001" disabled={code === 'KES'} value={Number(row.kes_per_unit || 1)} onChange={e => updateCurrency(code,'kes_per_unit',e.target.value)} className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-cyan-500 disabled:bg-slate-50" /><label className="mt-3 flex items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={row.active !== false} disabled={code === 'KES'} onChange={e => updateCurrency(code,'active',e.target.checked)} /> Available to customers</label></div>})}</div>}
      </section>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900"><strong>Pricing safety:</strong> the browser never controls the final total. The server recalculates the quotation from these admin settings. Benchmark mode is an optional pricing aid, not a live competitor feed; an administrator must enter/refresh the competitor reference rate.</div>
    </div>
  </AdminShell>;
}
