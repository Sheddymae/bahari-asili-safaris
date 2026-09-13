'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Mail, RefreshCw, Search, X } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

interface QuotationRow {
  id: number;
  quotation_ref: string;
  first_name: string;
  last_name: string;
  email: string;
  whatsapp: string;
  nationality?: string | null;
  destination?: string;
  arrival_date?: string;
  departure_date?: string;
  duration_nights?: number;
  adults: number;
  children: number;
  total_cost?: number;
  currency?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  created_at?: string;
}

const statusClass: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600',
  sent: 'bg-cyan-50 text-cyan-700',
  accepted: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
};

function safeDate(v?: string) {
  if (!v) return '—';
  try { return new Date(v).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return v; }
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<QuotationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<QuotationRow | null>(null);
  const [busy, setBusy] = useState('');
  const [toast, setToast] = useState('');

  function notify(s: string) { setToast(s); setTimeout(() => setToast(''), 3500); }

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      const r = await fetch(`/api/admin/quotations?${params.toString()}`);
      const d = await r.json();
      if (d.success) setQuotations(d.quotations || []);
    } catch {
      notify('Failed to load quotations');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [search, status]);

  const filtered = useMemo(() => quotations, [quotations]);

  async function runAction(actionName: 'generate_pdf' | 'resend_email' | 'update_status', extra: Record<string, unknown> = {}) {
    if (!selected?.id) return;
    setBusy(actionName);
    try {
      const r = await fetch(`/api/admin/quotations/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionName, ...extra }),
      });
      const d = await r.json();
      if (!r.ok || !d.success) throw new Error(d.error || 'Action failed');

      if (actionName === 'generate_pdf' || actionName === 'resend_email') {
        const openUrl = d.url || d.dataUrl;
        if (openUrl) window.open(openUrl, '_blank', 'noopener,noreferrer');
        if (actionName === 'resend_email') {
          if (!d.emailConfigured) notify('Email sending is not configured on the server.');
          else notify(d.emailSent ? 'Quotation emailed to customer' : 'Email failed to send');
        } else {
          notify('Quotation PDF generated');
        }
      } else {
        setSelected(d.quotation);
        notify('Status updated');
      }
      await load();
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setBusy('');
    }
  }

  return (
    <AdminShell title="Quotations">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, ref..." className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm" />
            </div>
            <select value={status} onChange={e => setStatus(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <button onClick={load} className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"><RefreshCw className="h-4 w-4" /></button>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-400">
                <tr><th className="p-3">Ref</th><th className="p-3">Guest</th><th className="p-3">Destination</th><th className="p-3">Total</th><th className="p-3">Status</th></tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan={5} className="p-6 text-center text-slate-400">Loading…</td></tr>}
                {!loading && filtered.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-400">No quotations found.</td></tr>}
                {filtered.map(q => (
                  <tr key={q.id} onClick={() => setSelected(q)} className={`cursor-pointer border-t border-slate-100 hover:bg-slate-50 ${selected?.id === q.id ? 'bg-cyan-50/50' : ''}`}>
                    <td className="p-3 font-mono text-xs">{q.quotation_ref}</td>
                    <td className="p-3">{q.first_name} {q.last_name}</td>
                    <td className="p-3">{q.destination || '—'}</td>
                    <td className="p-3">{q.currency || 'KES'} {Number(q.total_cost || 0).toLocaleString('en-KE')}</td>
                    <td className="p-3"><span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass[q.status] || ''}`}>{q.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="w-full rounded-xl border border-slate-200 p-4 lg:w-96">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{selected.quotation_ref}</p>
              <button onClick={() => setSelected(null)} className="rounded-lg p-1 hover:bg-slate-100"><X className="h-4 w-4" /></button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {[['Guest', `${selected.first_name} ${selected.last_name}`], ['Email', selected.email], ['WhatsApp', selected.whatsapp], ['Nationality', selected.nationality || '—'], ['Destination', selected.destination || '—'], ['Arrival', safeDate(selected.arrival_date)], ['Nights', String(selected.duration_nights || '—')], ['Guests', `${selected.adults}A${selected.children ? ` + ${selected.children}C` : ''}`], ['Total', `${selected.currency || 'KES'} ${Number(selected.total_cost || 0).toLocaleString('en-KE')}`], ['Created', safeDate(selected.created_at)]].map(([a, b]) => (
                <div key={a} className="rounded-lg bg-slate-50 p-2"><p className="text-[10px] uppercase text-slate-400">{a}</p><p className="mt-0.5 font-medium">{b}</p></div>
              ))}
            </div>

            <label className="mt-4 block text-xs font-semibold">Status
              <select value={selected.status} onChange={e => runAction('update_status', { status: e.target.value })} className="mt-1 w-full rounded-lg border p-2 text-sm">
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>

            <div className="mt-4 flex flex-wrap gap-2">
              <button disabled={busy === 'generate_pdf'} onClick={() => runAction('generate_pdf')} className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white"><Download className="h-3.5 w-3.5" /> View / Download PDF</button>
              <button disabled={busy === 'resend_email'} onClick={() => runAction('resend_email')} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold"><Mail className="h-3.5 w-3.5" /> Resend to customer</button>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">&ldquo;Resend&rdquo; emails the quotation PDF to the customer via Resend. If EMAIL_API_KEY isn&apos;t set on the server, the PDF still opens but no email goes out.</p>
          </div>
        )}
      </div>

      {toast && <div className="fixed bottom-5 right-5 z-[80] rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl">{toast}</div>}
    </AdminShell>
  );
}
