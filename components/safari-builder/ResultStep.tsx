'use client';

import { useState } from 'react';
import { Calendar, MapPin, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import type { SafariBuilderResult } from '@/lib/quotation-pricing';

interface ResultStepProps {
  plan: SafariBuilderResult | null;
  planLoading: boolean;
  planError: string | null;
  requestPayload: Record<string, unknown>;
  adults: number;
  childrenCount: number;
  onSubmitted: (quotationRef: string) => void;
}

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  nationality: string;
  specialRequests: string;
}

function formatKES(n: number) {
  return `KES ${Math.round(n).toLocaleString()}`;
}

export default function ResultStep({ plan, planLoading, planError, requestPayload, adults, childrenCount, onSubmitted }: ResultStepProps) {
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

  if (planLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-ocean-700 animate-spin" />
        <p className="font-inter text-sm text-muted-foreground">{t.safariBuilder.result.calculatingTitle}</p>
      </div>
    );
  }

  if (planError || !plan) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <AlertTriangle className="w-8 h-8 text-destructive" />
        <p className="font-inter text-sm text-foreground max-w-sm">
          {planError || t.safariBuilder.result.errorTitle}
        </p>
      </div>
    );
  }

  const { pricing } = plan;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitState === 'loading' || submitState === 'done') return; // prevent duplicate submit
    setSubmitState('loading');
    setSubmitError('');

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`;

      const res = await fetch('/api/safari-builder', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'submit',
          ...requestPayload,
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          whatsapp: form.whatsapp,
          nationality: form.nationality,
          special_requests: form.specialRequests,
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSubmitError(data.error || t.common.error);
        setSubmitState('error');
        return;
      }
      setSubmitState('done');
      onSubmitted(data.quotation_ref);
    } catch {
      setSubmitError(t.common.error);
      setSubmitState('error');
    }
  }

  if (submitState === 'done') {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#0e7490]/10 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-primary" />
        </div>
        <h2 className="font-poppins font-bold text-2xl text-foreground">{t.safariBuilder.result.quoteSuccessTitle}</h2>
        <p className="font-inter text-sm text-muted-foreground max-w-sm">
          {t.safariBuilder.result.quoteSuccessSubtitle}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-poppins font-bold text-xl sm:text-2xl text-foreground mb-1">{t.safariBuilder.result.yourSafariTitle}</h2>
        <p className="font-inter text-sm text-muted-foreground">
          {plan.nights} {t.safariBuilder.result.nights} · {adults} {t.safariBuilder.result.adults}{childrenCount > 0 ? ` · ${childrenCount} ${t.safariBuilder.result.children}` : ''}
        </p>
      </div>

      {/* Itinerary */}
      <div>
        <h3 className="font-poppins font-semibold text-base text-foreground mb-4 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-ocean-700" /> {t.safariBuilder.result.itineraryTitle}
          <span className="font-inter text-xs font-normal text-muted-foreground ml-1">({t.safariBuilder.result.itineraryNotice})</span>
        </h3>
        <ol className="space-y-3">
          {plan.itinerary.map((day) => (
            <li key={day.day} className="flex gap-4 bg-sand-50 rounded-xl border border-sand-200 p-4">
              <div className="w-9 h-9 rounded-full bg-ocean-700 text-white flex items-center justify-center font-poppins font-bold text-xs flex-shrink-0">
                {day.day}
              </div>
              <div>
                <p className="font-poppins font-semibold text-sm text-foreground mb-0.5">{day.title}</p>
                <p className="font-inter text-xs text-foreground">{day.description}</p>
                <p className="font-inter text-[11px] text-safari-600 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {t.safariBuilder.result.overnightLabel}: {day.overnight}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Pricing breakdown */}
      <div>
        <h3 className="font-poppins font-semibold text-base text-foreground mb-4">{t.safariBuilder.result.breakdownTitle}</h3>
        <div className="bg-white rounded-2xl border border-border shadow-card p-6">
          <dl className="space-y-2.5 font-inter text-sm">
            <Row label={t.safariBuilder.result.accommodationCost} value={pricing.accommodation_cost} />
            <Row label={t.safariBuilder.result.parkFees} value={pricing.park_fees} />
            <Row label={t.safariBuilder.result.guideCost} value={pricing.guide_cost} />
            <Row label={t.safariBuilder.result.transportCost} value={pricing.transport_cost} />
            <Row label={t.safariBuilder.result.mealsCost} value={pricing.meals_cost} />
            <Row label={t.safariBuilder.result.otherCosts} value={pricing.other_costs} />
            {pricing.discount > 0 && <Row label={t.safariBuilder.result.discount} value={-pricing.discount} highlight="green" />}
            <Row label={t.safariBuilder.result.tax} value={pricing.tax} />
          </dl>
          <div className="border-t border-border mt-4 pt-4 flex items-center justify-between">
            <span className="font-poppins font-bold text-foreground">{t.safariBuilder.result.totalEstimate}</span>
            <span className="font-poppins font-black text-xl text-ocean-700">{formatKES(pricing.total_cost)}</span>
          </div>
          <p className="font-inter text-[11px] text-muted-foreground mt-3">
            {t.safariBuilder.result.disclaimer}
          </p>
        </div>
      </div>

      {/* Request form */}
      <form onSubmit={handleSubmit} className="bg-sand-50 rounded-2xl border border-sand-200 p-6 space-y-4">
        <h3 className="font-poppins font-semibold text-base text-foreground">{t.safariBuilder.result.requestQuoteTitle}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="sr-only">{t.safariBuilder.result.firstNameLabel}</label>
            <input
              id="firstName"
              required
              placeholder={t.safariBuilder.result.firstNameLabel}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-border focus:border-ocean-500 outline-none font-inter text-sm"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="sr-only">{t.safariBuilder.result.lastNameLabel}</label>
            <input
              id="lastName"
              required
              placeholder={t.safariBuilder.result.lastNameLabel}
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-border focus:border-ocean-500 outline-none font-inter text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">{t.safariBuilder.result.emailLabel}</label>
            <input
              id="email"
              type="email"
              required
              placeholder={t.safariBuilder.result.emailLabel}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-border focus:border-ocean-500 outline-none font-inter text-sm"
            />
          </div>
          <div>
            <label htmlFor="whatsapp" className="sr-only">{t.safariBuilder.result.whatsappLabel}</label>
            <input
              id="whatsapp"
              placeholder={t.safariBuilder.result.whatsappLabel}
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-border focus:border-ocean-500 outline-none font-inter text-sm"
            />
          </div>
          <div>
            <label htmlFor="nationality" className="sr-only">{t.booking.nationality}</label>
            <input
              id="nationality"
              placeholder={t.booking.nationalityPlaceholder}
              value={form.nationality}
              onChange={(e) => setForm({ ...form, nationality: e.target.value })}
              className="w-full h-11 px-4 rounded-xl border border-border focus:border-ocean-500 outline-none font-inter text-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="specialRequests" className="sr-only">{t.safariBuilder.result.notesLabel}</label>
          <textarea
            id="specialRequests"
            placeholder={t.safariBuilder.result.notesLabel}
            rows={3}
            value={form.specialRequests}
            onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-ocean-500 outline-none font-inter text-sm resize-none"
          />
        </div>
        {submitState === 'error' && <p className="text-sm text-destructive font-inter">{submitError}</p>}
        <button
          type="submit"
          disabled={submitState === 'loading'}
          className="w-full bg-book hover:bg-book-600 text-white font-poppins font-semibold py-3.5 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitState === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> {t.safariBuilder.result.submitting}
            </>
          ) : (
            t.safariBuilder.result.submitQuoteBtn
          )}
        </button>
      </form>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: number; highlight?: 'green' }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-foreground">{label}</dt>
      <dd className={highlight === 'green' ? 'text-primary font-medium' : 'text-foreground'}>{formatKES(value)}</dd>
    </div>
  );
}
