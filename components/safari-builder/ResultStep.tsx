'use client';

import { useState } from 'react';
import { Calendar, MapPin, Loader2, CheckCircle2, AlertTriangle, WalletCards } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import type { SafariBuilderResult } from '@/lib/quotation-pricing';
import type { BookingCurrency } from '@/lib/managed-safari-pricing';

interface ResultStepProps {
  plan: SafariBuilderResult | null;
  planLoading: boolean;
  planError: string | null;
  requestPayload: Record<string, unknown>;
  adults: number;
  childrenCount: number;
  currency: BookingCurrency;
  onCurrencyChange: (currency: BookingCurrency) => void;
  onSubmitted: (quotationRef: string) => void;
}

interface ContactForm { firstName: string; lastName: string; email: string; whatsapp: string; nationality: string; specialRequests: string; }

const currencyLabels: Record<string, Record<BookingCurrency, string>> = {
  en: { KES: 'Kenyan Shilling (KES)', USD: 'US Dollar (USD)', EUR: 'Euro (EUR)' },
  it: { KES: 'Scellino keniota (KES)', USD: 'Dollaro USA (USD)', EUR: 'Euro (EUR)' },
  fr: { KES: 'Shilling kényan (KES)', USD: 'Dollar américain (USD)', EUR: 'Euro (EUR)' },
  es: { KES: 'Chelín keniano (KES)', USD: 'Dólar estadounidense (USD)', EUR: 'Euro (EUR)' },
  de: { KES: 'Kenia-Schilling (KES)', USD: 'US-Dollar (USD)', EUR: 'Euro (EUR)' },
  ar: { KES: 'شلن كيني (KES)', USD: 'دولار أمريكي (USD)', EUR: 'يورو (EUR)' },
  zh: { KES: '肯尼亚先令 (KES)', USD: '美元 (USD)', EUR: '欧元 (EUR)' },
  sw: { KES: 'Shilingi ya Kenya (KES)', USD: 'Dola ya Marekani (USD)', EUR: 'Euro (EUR)' },
};

function formatMoney(n: number, currency: BookingCurrency) {
  const fractionDigits = currency === 'KES' ? 0 : 2;
  return new Intl.NumberFormat(undefined, { style: 'currency', currency, minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(n);
}

export default function ResultStep({ plan, planLoading, planError, requestPayload, adults, childrenCount, currency, onCurrencyChange, onSubmitted }: ResultStepProps) {
  const { user, session } = useAuth();
  const { locale, t } = useLanguage();
  const [form, setForm] = useState<ContactForm>({
    firstName: (user?.user_metadata?.full_name as string)?.split(' ')[0] || '',
    lastName: (user?.user_metadata?.full_name as string)?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    whatsapp: (user?.user_metadata?.whatsapp as string) || '',
    nationality: (user?.user_metadata?.nationality as string) || '',
    specialRequests: '',
  });
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');

  if (planLoading) return <div className="flex flex-col items-center justify-center py-24 gap-3"><Loader2 className="w-8 h-8 text-ocean-700 animate-spin" /><p className="font-inter text-sm text-muted-foreground">{t.safariBuilder.result.calculatingTitle}</p></div>;
  if (planError || !plan) return <div className="flex flex-col items-center justify-center py-24 gap-3 text-center"><AlertTriangle className="w-8 h-8 text-destructive" /><p className="font-inter text-sm text-foreground max-w-sm">{planError || t.safariBuilder.result.errorTitle}</p></div>;

  const { pricing } = plan;
  const labels = currencyLabels[locale] || currencyLabels.en;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitState === 'loading' || submitState === 'done') return;
    setSubmitState('loading'); setSubmitError('');
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
      const res = await fetch('/api/safari-builder', { method: 'POST', headers, body: JSON.stringify({ action: 'submit', ...requestPayload, first_name: form.firstName, last_name: form.lastName, email: form.email, whatsapp: form.whatsapp, nationality: form.nationality, special_requests: form.specialRequests, locale }) });
      const data = await res.json();
      if (!res.ok || !data.success) { setSubmitError(data.error || t.common.error); setSubmitState('error'); return; }
      setSubmitState('done'); onSubmitted(data.quotation_ref);
    } catch { setSubmitError(t.common.error); setSubmitState('error'); }
  }

  if (submitState === 'done') return <div className="flex flex-col items-center justify-center py-20 gap-4 text-center"><div className="w-16 h-16 rounded-full bg-[#0e7490]/10 flex items-center justify-center"><CheckCircle2 className="w-9 h-9 text-primary" /></div><h2 className="font-poppins font-bold text-2xl text-foreground">{t.safariBuilder.result.quoteSuccessTitle}</h2><p className="font-inter text-sm text-muted-foreground max-w-sm">{t.safariBuilder.result.quoteSuccessSubtitle}</p></div>;

  return (
    <div className="space-y-10">
      <div><h2 className="font-poppins font-bold text-xl sm:text-2xl text-foreground mb-1">{t.safariBuilder.result.yourSafariTitle}</h2><p className="font-inter text-sm text-muted-foreground">{plan.nights} {t.safariBuilder.result.nights} · {adults} {t.safariBuilder.result.adults}{childrenCount > 0 ? ` · ${childrenCount} ${t.safariBuilder.result.children}` : ''}</p></div>

      <div>
        <h3 className="font-poppins font-semibold text-base text-foreground mb-4 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-ocean-700" /> {t.safariBuilder.result.itineraryTitle}<span className="font-inter text-xs font-normal text-muted-foreground ml-1">({t.safariBuilder.result.itineraryNotice})</span></h3>
        <ol className="space-y-3">{plan.itinerary.map((day) => <li key={day.day} className="flex gap-4 bg-sand-50 rounded-xl border border-sand-200 p-4"><div className="w-9 h-9 rounded-full bg-ocean-700 text-white flex items-center justify-center font-poppins font-bold text-xs flex-shrink-0">{day.day}</div><div><p className="font-poppins font-semibold text-sm text-foreground mb-0.5">{day.title}</p><p className="font-inter text-xs text-foreground">{day.description}</p><p className="font-inter text-[11px] text-safari-600 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> {t.safariBuilder.result.overnightLabel}: {day.overnight}</p></div></li>)}</ol>
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
          <h3 className="font-poppins font-semibold text-base text-foreground">{t.safariBuilder.result.breakdownTitle}</h3>
          <label className="flex items-center gap-2 text-sm font-inter font-medium text-foreground">
            <WalletCards className="w-4 h-4 text-ocean-700" />
            <span className="sr-only">Currency</span>
            <select value={currency} onChange={(e) => onCurrencyChange(e.target.value as BookingCurrency)} className="h-10 rounded-xl border border-border bg-white px-3 outline-none focus:border-ocean-500 focus:ring-2 focus:ring-ocean-100">
              {(['KES', 'USD', 'EUR'] as BookingCurrency[]).map((code) => <option key={code} value={code}>{labels[code]}</option>)}
            </select>
          </label>
        </div>
        <div className="bg-white rounded-2xl border border-border shadow-card p-6">
          <dl className="space-y-2.5 font-inter text-sm">
            <Row label={t.safariBuilder.result.accommodationCost} value={pricing.accommodation_cost} currency={pricing.currency} />
            <Row label={t.safariBuilder.result.parkFees} value={pricing.park_fees} currency={pricing.currency} />
            <Row label={t.safariBuilder.result.guideCost} value={pricing.guide_cost} currency={pricing.currency} />
            <Row label={t.safariBuilder.result.transportCost} value={pricing.transport_cost} currency={pricing.currency} />
            <Row label={t.safariBuilder.result.mealsCost} value={pricing.meals_cost} currency={pricing.currency} />
            <Row label={t.safariBuilder.result.otherCosts} value={pricing.other_costs} currency={pricing.currency} />
            {pricing.discount > 0 && <Row label={t.safariBuilder.result.discount} value={-pricing.discount} currency={pricing.currency} highlight="green" />}
            <Row label={t.safariBuilder.result.tax} value={pricing.tax} currency={pricing.currency} />
          </dl>
          <div className="border-t border-border mt-4 pt-4 flex items-center justify-between gap-4"><span className="font-poppins font-bold text-foreground">{t.safariBuilder.result.totalEstimate}</span><span className="font-poppins font-black text-xl text-ocean-700">{formatMoney(pricing.total_cost, pricing.currency)}</span></div>
          <p className="font-inter text-[11px] text-muted-foreground mt-3">{t.safariBuilder.result.disclaimer}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-sand-50 rounded-2xl border border-sand-200 p-6 space-y-4">
        <h3 className="font-poppins font-semibold text-base text-foreground">{t.safariBuilder.result.requestQuoteTitle}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <input id="firstName" required placeholder={t.safariBuilder.result.firstNameLabel} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full h-11 px-4 rounded-xl border border-border focus:border-ocean-500 outline-none font-inter text-sm" />
          <input id="lastName" required placeholder={t.safariBuilder.result.lastNameLabel} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full h-11 px-4 rounded-xl border border-border focus:border-ocean-500 outline-none font-inter text-sm" />
          <input id="email" type="email" required placeholder={t.safariBuilder.result.emailLabel} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full h-11 px-4 rounded-xl border border-border focus:border-ocean-500 outline-none font-inter text-sm" />
          <input id="whatsapp" placeholder={t.safariBuilder.result.whatsappLabel} value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="w-full h-11 px-4 rounded-xl border border-border focus:border-ocean-500 outline-none font-inter text-sm" />
          <input id="nationality" placeholder={t.booking.nationalityPlaceholder} value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} className="w-full h-11 px-4 rounded-xl border border-border focus:border-ocean-500 outline-none font-inter text-sm" />
        </div>
        <textarea id="specialRequests" placeholder={t.safariBuilder.result.notesLabel} rows={3} value={form.specialRequests} onChange={(e) => setForm({ ...form, specialRequests: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border focus:border-ocean-500 outline-none font-inter text-sm resize-none" />
        {submitState === 'error' && <p className="text-sm text-destructive font-inter">{submitError}</p>}
        <button type="submit" disabled={submitState === 'loading'} className="w-full bg-book hover:bg-book-600 text-white font-poppins font-semibold py-3.5 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2">{submitState === 'loading' ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.safariBuilder.result.submitting}</> : t.safariBuilder.result.submitQuoteBtn}</button>
      </form>
    </div>
  );
}

function Row({ label, value, currency, highlight }: { label: string; value: number; currency: BookingCurrency; highlight?: 'green' }) {
  return <div className="flex items-center justify-between"><dt className="text-foreground">{label}</dt><dd className={highlight === 'green' ? 'text-primary font-medium' : 'text-foreground'}>{formatMoney(value, currency)}</dd></div>;
}
