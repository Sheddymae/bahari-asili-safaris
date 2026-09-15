'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BuilderProgress from './BuilderProgress';
import TripDetailsStep, { type TripDetailsValue } from './TripDetailsStep';
import TravellersStep, { type TravellersValue } from './TravellersStep';
import InterestsStep from './InterestsStep';
import DestinationsStep from './DestinationsStep';
import ResultStep from './ResultStep';
import { translations, type Locale } from '@/lib/i18n';
import { type SafariBuilderResult } from '@/lib/quotation-pricing';
import { type BookingCurrency } from '@/lib/managed-safari-pricing';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SafariBuilder() {
  const { t, locale } = useLanguage();

  // Keep this route resilient if a cached/older translation bundle is missing
  // the safariBuilder namespace. All eight supported locales currently define
  // it, but the structural guard prevents a blank client-side exception during
  // a deployment while preserving the selected locale whenever its copy exists.
  const safariBuilder = t.safariBuilder ?? (translations.en as typeof t).safariBuilder;
  const STEP_LABELS = [
    safariBuilder.stepper.trip,
    safariBuilder.stepper.travellers,
    safariBuilder.stepper.style,
    safariBuilder.stepper.destinations,
    safariBuilder.stepper.result,
  ];
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currency, setCurrency] = useState<BookingCurrency>('KES');
  const [trip, setTrip] = useState<TripDetailsValue>({ arrivalDate: '', departureDate: '', startLocation: '', endLocation: '' });
  const [travellers, setTravellers] = useState<TravellersValue>({ adults: 2, children: 0, childrenAges: [] });
  const [interests, setInterests] = useState<string[]>([]);
  const [destinationSlugs, setDestinationSlugs] = useState<string[]>([]);
  const [plan, setPlan] = useState<SafariBuilderResult | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  const requestPayload = { arrivalDate: trip.arrivalDate, departureDate: trip.departureDate, startLocation: trip.startLocation, endLocation: trip.endLocation, adults: travellers.adults, children: travellers.children, childrenAges: travellers.childrenAges, interests, destinationSlugs, currency };

  const validateStep = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!trip.arrivalDate) e.dates = safariBuilder.validation.arrivalRequired;
      else if (!trip.departureDate) e.dates = safariBuilder.validation.departureRequired;
      else if (new Date(trip.departureDate) <= new Date(trip.arrivalDate)) e.dates = safariBuilder.validation.departureAfterArrival;
      if (!trip.startLocation) e.locations = safariBuilder.validation.startRequired;
      else if (!trip.endLocation) e.locations = safariBuilder.validation.endRequired;
    }
    if (step === 1) {
      if (travellers.adults < 1) e.adults = safariBuilder.validation.adultRequired;
      if (travellers.children > 0 && travellers.childrenAges.length !== travellers.children) e.childrenAges = safariBuilder.validation.childAgesRequired;
    }
    if (step === 3 && destinationSlugs.length === 0) e.destinations = safariBuilder.validation.destinationRequired;
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [step, trip, travellers, destinationSlugs, safariBuilder]);

  const goNext = () => { if (validateStep()) setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1)); };
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  useEffect(() => {
    if (step !== 4) return;
    let cancelled = false;
    setPlanLoading(true); setPlanError(null);
    fetch('/api/safari-builder', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'estimate', ...requestPayload }) }).then(async (res) => {
      const data = await res.json();
      if (cancelled) return;
      if (!res.ok || !data.success) { setPlanError(data.error || safariBuilder.result.errorTitle); setPlan(null); return; }
      setPlan(data as SafariBuilderResult);
    }).catch(() => { if (!cancelled) setPlanError(safariBuilder.result.errorTitle); }).finally(() => { if (!cancelled) setPlanLoading(false); });
    return () => { cancelled = true; };
  }, [step, currency, safariBuilder, requestPayload]);

  return (
    <section className="py-14 lg:py-20 bg-sand-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10"><span className="font-inter text-safari-500 font-semibold text-sm tracking-widest uppercase block mb-2">{t.nav.buildSafari}</span><h1 className="font-poppins font-bold text-3xl sm:text-4xl text-foreground">{safariBuilder.hero.title}</h1></div>
        <BuilderProgress steps={STEP_LABELS} currentStep={step} />
        <div className="bg-white rounded-3xl border border-border shadow-card p-6 sm:p-10">
          {step === 0 && <TripDetailsStep value={trip} onChange={setTrip} errors={errors} />}
          {step === 1 && <TravellersStep value={travellers} onChange={setTravellers} errors={errors} />}
          {step === 2 && <InterestsStep value={interests} onChange={setInterests} />}
          {step === 3 && <DestinationsStep value={destinationSlugs} onChange={setDestinationSlugs} errors={errors} />}
          {step === 4 && <ResultStep plan={plan} planLoading={planLoading} planError={planError} requestPayload={requestPayload} adults={travellers.adults} childrenCount={travellers.children} currency={currency} onCurrencyChange={setCurrency} onSubmitted={() => {}} />}
          {step < 4 && <div className="flex items-center justify-between mt-10 pt-6 border-t border-border"><button type="button" onClick={goBack} disabled={step === 0} className="font-inter text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-0 flex items-center gap-1 px-2"><ChevronLeft className="w-4 h-4" /> {t.common.back}</button><button type="button" onClick={goNext} className="bg-book hover:bg-book-600 text-white font-poppins font-semibold px-7 py-3 rounded-xl transition-all flex items-center gap-1.5">{t.common.continue} <ChevronRight className="w-4 h-4" /></button></div>}
          {step === 4 && <div className="mt-8 pt-6 border-t border-border"><button type="button" onClick={goBack} className="font-inter text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> {t.common.back}</button></div>}
        </div>
      </div>
    </section>
  );
}
