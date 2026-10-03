'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BuilderProgress from './BuilderProgress';
import TripDetailsStep, { type TripDetailsValue } from './TripDetailsStep';
import TravellersStep, { type TravellersValue } from './TravellersStep';
import InterestsStep from './InterestsStep';
import DestinationsStep from './DestinationsStep';
import ResultStep from './ResultStep';
import { translations } from '@/lib/i18n';
import { type SafariBuilderResult } from '@/lib/quotation-pricing';
import { type BookingCurrency } from '@/lib/managed-safari-pricing';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SafariBuilder() {
  const { t, locale } = useLanguage();
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
  // Default to USD for international visitors — the overwhelming majority of
  // our traffic — since a first quote in KES reads as unfamiliar and adds
  // friction. Swahili-locale visitors are more likely local/regional, so
  // default them to KES instead. Either way it's a one-click switch in the
  // result step.
  const [currency, setCurrency] = useState<BookingCurrency>(locale === 'sw' ? 'KES' : 'USD');
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
      const today = new Date().toISOString().slice(0, 10);
      if (!trip.arrivalDate) e.dates = safariBuilder.validation.arrivalRequired;
      else if (trip.arrivalDate < today) e.dates = safariBuilder.validation.arrivalRequired;
      else if (!trip.departureDate) e.dates = safariBuilder.validation.departureRequired;
      else if (new Date(trip.departureDate) <= new Date(trip.arrivalDate)) e.dates = safariBuilder.validation.departureAfterArrival;
      if (!trip.startLocation) e.locations = safariBuilder.validation.startRequired;
      else if (!trip.endLocation) e.locations = safariBuilder.validation.endRequired;
    }
    if (step === 1) {
      if (travellers.adults < 1 || travellers.adults > 30) e.adults = safariBuilder.validation.adultRequired; e.adults = safariBuilder.validation.adultRequired;
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
    setPlanLoading(true);
    setPlanError(null);
    fetch('/api/safari-builder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'estimate', ...requestPayload }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data.success) {
          setPlanError(data.error || safariBuilder.result.errorTitle);
          setPlan(null);
          return;
        }
        setPlan(data as SafariBuilderResult);
      })
      .catch(() => {
        if (!cancelled) setPlanError(safariBuilder.result.errorTitle);
      })
      .finally(() => {
        if (!cancelled) setPlanLoading(false);
      });
    return () => { cancelled = true; };
    // The request payload is intentionally captured when the result step is
    // entered. Currency is a dependency because changing it requires a new
    // server-authoritative estimate.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, currency, safariBuilder]);

  return (
    <section className="min-h-screen bg-paper py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <header className="mb-10 grid gap-8 border-b border-line pb-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="editorial-label text-orange">{t.nav.buildSafari}</p><h1 className="mt-4 max-w-3xl font-editorial text-5xl leading-[0.92] tracking-tight text-ink sm:text-6xl lg:text-7xl">{safariBuilder.hero.title}</h1></div><p className="max-w-xs font-mono-editorial text-[9px] uppercase leading-5 tracking-[0.12em] text-muted lg:text-right">COAST → BUSH<br/>A PERSONALISED KENYA JOURNEY</p></header>
        <BuilderProgress steps={STEP_LABELS} currentStep={step} />
        <div className="border-y border-line bg-paper p-5 sm:p-8 lg:p-10">
          {step === 0 && <TripDetailsStep value={trip} onChange={setTrip} errors={errors} />}
          {step === 1 && <TravellersStep value={travellers} onChange={setTravellers} errors={errors} />}
          {step === 2 && <InterestsStep value={interests} onChange={setInterests} />}
          {step === 3 && <DestinationsStep value={destinationSlugs} onChange={setDestinationSlugs} errors={errors} />}
          {step === 4 && <ResultStep plan={plan} planLoading={planLoading} planError={planError} requestPayload={requestPayload} adults={travellers.adults} childrenCount={travellers.children} currency={currency} onCurrencyChange={setCurrency} onSubmitted={() => {}} />}
          {step < 4 && <div className="flex items-center justify-between mt-10 border-t border-line pt-6"><button type="button" onClick={goBack} disabled={step === 0} className="font-mono-editorial text-[9px] uppercase tracking-[0.12em] text-muted hover:text-ink disabled:opacity-0 flex items-center gap-1 px-2"><ChevronLeft className="w-4 h-4" /> {t.common.back}</button><button type="button" onClick={goNext} className="bg-orange hover:bg-ink text-ink hover:text-paper font-mono-editorial text-[10px] uppercase tracking-[0.14em] px-7 py-3 transition-all flex items-center gap-1.5">{t.common.continue} <ChevronRight className="w-4 h-4" /></button></div>}
          {step === 4 && <div className="mt-8 pt-6 border-t border-border"><button type="button" onClick={goBack} className="font-inter text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1"><ChevronLeft className="w-4 h-4" /> {t.common.back}</button></div>}
        </div>
      </div>
    </section>
  );
}
