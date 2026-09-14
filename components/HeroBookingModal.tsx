'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, CheckCircle, ChevronDown, Loader2, Search, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import InquiryStatusDisplay from '@/components/InquiryStatusDisplay';
import { COUNTRIES, isCountry } from '@/lib/countries';

export interface HeroBookingSelection {
  destination?: string;
  adults?: number;
  arrivalDate?: string;
}

interface HeroBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelection?: HeroBookingSelection;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  nationality: string;
  destination: string;
  adults: string;
  children: string;
  arrivalDate: string;
  departureDate: string;
  message: string;
}

const emptyForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  whatsapp: '',
  nationality: '',
  destination: '',
  adults: '2',
  children: '0',
  arrivalDate: '',
  departureDate: '',
  message: '',
};

export default function HeroBookingModal({
  isOpen,
  onClose,
  initialSelection,
}: HeroBookingModalProps) {
  const { t, locale } = useLanguage();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<Status>('idle');
  const [errorDetail, setErrorDetail] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const nationalityRef = useRef<HTMLDivElement>(null);

  const filteredCountries = useMemo(() => {
    const query = form.nationality.trim().toLocaleLowerCase();
    if (!query) return COUNTRIES;
    return COUNTRIES.filter((country) => country.toLocaleLowerCase().startsWith(query));
  }, [form.nationality]);

  useEffect(() => {
    if (!isOpen) return;
    setForm({
      ...emptyForm,
      destination: initialSelection?.destination || '',
      adults: String(initialSelection?.adults || 2),
      arrivalDate: initialSelection?.arrivalDate || '',
    });
    setStatus('idle');
    setErrorDetail('');
    setBookingRef('');
    setEmailSent(false);
    setNationalityOpen(false);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialSelection]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNationalityOpen(false);
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!nationalityOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (!nationalityRef.current?.contains(event.target as Node)) {
        setNationalityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [nationalityOpen]);

  const update = (name: keyof FormState, value: string) => {
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const selectNationality = (country: string) => {
    update('nationality', country);
    setNationalityOpen(false);
    setErrorDetail('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorDetail('');

    const nationality = form.nationality.trim();
    if (!nationality) {
      setStatus('error');
      setErrorDetail('Nationality is required. Please select your country of nationality.');
      setNationalityOpen(true);
      return;
    }

    if (!isCountry(nationality)) {
      setStatus('error');
      setErrorDetail('Please select a nationality from the country list. Start typing to search by country name.');
      setNationalityOpen(true);
      return;
    }

    setStatus('loading');

    const children = Math.max(0, parseInt(form.children, 10) || 0);
    const adults = Math.min(30, Math.max(1, parseInt(form.adults, 10) || 1));

    try {
      const messageParts = [
        form.message.trim(),
        form.departureDate ? `Departure date: ${form.departureDate}` : '',
        'Homepage booking request from the hero booking bar.',
      ].filter(Boolean);

      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          whatsapp: form.whatsapp.trim(),
          nationality,
          adults,
          children,
          kidsAges: [],
          arrivalDate: form.arrivalDate,
          safariName: form.destination.trim(),
          message: messageParts.join('\n'),
          userId: null,
          locale,
        }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok || !data?.success || !data?.bookingRef) {
        throw new Error(data?.error || 'We could not save your booking. Please try again.');
      }

      setBookingRef(String(data.bookingRef));
      setEmailSent(data.emailSent === true);
      setStatus('success');
    } catch (error) {
      console.error('Hero booking submission failed:', error);
      setErrorDetail(error instanceof Error ? error.message : 'We could not save your booking. Please try again.');
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hero-booking-title"
        className="relative z-10 w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-20 flex items-center justify-between rounded-t-3xl border-b border-border bg-white px-6 py-5 sm:px-8">
          <div>
            <p className="font-inter text-xs font-semibold uppercase tracking-[0.16em] text-safari-500">Bahari Asili Safaris</p>
            <h2 id="hero-booking-title" className="mt-1 font-poppins text-xl font-bold text-foreground sm:text-2xl">
              {t.booking?.title || 'Complete your booking'}
            </h2>
            <p className="mt-1 font-inter text-sm text-muted-foreground">
              {t.booking?.subtitle || 'Tell us about your trip and our team will confirm availability.'}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close booking form" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-sand-100">
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {status === 'success' ? (
          <div className="p-6 sm:p-8">
            <InquiryStatusDisplay bookingRef={bookingRef} firstName={form.firstName} email={form.email} whatsapp={form.whatsapp} emailSent={emailSent} status="pending" />
            <button type="button" onClick={onClose} className="mt-6 w-full rounded-xl bg-ocean-700 px-5 py-3.5 font-poppins font-semibold text-white transition-colors hover:bg-ocean-800">
              Continue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
            <div className="rounded-2xl border border-ocean-100 bg-ocean-50/70 p-4">
              <div className="flex flex-wrap gap-x-6 gap-y-2 font-inter text-sm text-foreground">
                <span><strong>Destination:</strong> {form.destination || 'Not selected'}</span>
                <span><strong>Guests:</strong> {form.adults}</span>
                <span><strong>Arrival:</strong> {form.arrivalDate || 'Not selected'}</span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="font-inter text-sm font-medium text-foreground">
                {t.booking?.firstName || 'First name'} *
                <input required value={form.firstName} onChange={(event) => update('firstName', event.target.value)} placeholder={t.booking?.firstNamePlaceholder || 'First name'} className="mt-1.5 w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" />
              </label>
              <label className="font-inter text-sm font-medium text-foreground">
                {t.booking?.lastName || 'Last name'} *
                <input required value={form.lastName} onChange={(event) => update('lastName', event.target.value)} placeholder={t.booking?.lastNamePlaceholder || 'Last name'} className="mt-1.5 w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="font-inter text-sm font-medium text-foreground">
                {t.booking?.email || 'Email'} *
                <input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder={t.booking?.emailPlaceholder || 'you@example.com'} className="mt-1.5 w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" />
              </label>
              <label className="font-inter text-sm font-medium text-foreground">
                WhatsApp
                <input value={form.whatsapp} onChange={(event) => update('whatsapp', event.target.value)} placeholder="+254..." className="mt-1.5 w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="font-inter text-sm font-medium text-foreground">
                Destination *
                <input required value={form.destination} onChange={(event) => update('destination', event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" />
              </label>
              <label className="font-inter text-sm font-medium text-foreground">
                Guests *
                <input required type="number" min="1" max="30" value={form.adults} onChange={(event) => update('adults', event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" />
              </label>
              <label className="font-inter text-sm font-medium text-foreground">
                Children
                <input type="number" min="0" max="10" value={form.children} onChange={(event) => update('children', event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="font-inter text-sm font-medium text-foreground">
                Arrival date *
                <input required type="date" value={form.arrivalDate} onChange={(event) => update('arrivalDate', event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" />
              </label>
              <label className="font-inter text-sm font-medium text-foreground">
                Departure date
                <input type="date" min={form.arrivalDate || undefined} value={form.departureDate} onChange={(event) => update('departureDate', event.target.value)} className="mt-1.5 w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" />
              </label>
            </div>

            <div ref={nationalityRef} className="relative">
              <label htmlFor="booking-nationality" className="block font-inter text-sm font-medium text-foreground">
                Nationality <span className="text-red-600">*</span>
              </label>
              <div className="relative mt-1.5">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="booking-nationality"
                  required
                  autoComplete="off"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={nationalityOpen}
                  aria-controls="booking-nationality-options"
                  value={form.nationality}
                  onFocus={() => setNationalityOpen(true)}
                  onChange={(event) => {
                    update('nationality', event.target.value);
                    setNationalityOpen(true);
                  }}
                  placeholder="Type to search your country"
                  className={`w-full rounded-xl border bg-muted py-3 pl-11 pr-11 text-sm outline-none transition focus:ring-2 ${
                    status === 'error' && (!form.nationality || !isCountry(form.nationality.trim()))
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-border focus:border-ocean-600 focus:ring-ocean-100'
                  }`}
                />
                <ChevronDown className={`pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-transform ${nationalityOpen ? 'rotate-180' : ''}`} />
              </div>

              {nationalityOpen && (
                <div
                  id="booking-nationality-options"
                  role="listbox"
                  className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-border bg-white p-1 shadow-2xl"
                >
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <button
                        key={country}
                        type="button"
                        role="option"
                        aria-selected={form.nationality === country}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectNationality(country)}
                        className="w-full rounded-lg px-4 py-2.5 text-left font-inter text-sm text-foreground transition-colors hover:bg-sand-50 hover:text-ocean-700"
                      >
                        {country}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 font-inter text-sm text-muted-foreground">No country starts with “{form.nationality}”.</div>
                  )}
                </div>
              )}
              <p className="mt-1.5 font-inter text-xs text-muted-foreground">Start typing and select your country from the list.</p>
            </div>

            <label className="block font-inter text-sm font-medium text-foreground">
              Message / special requests
              <textarea rows={4} value={form.message} onChange={(event) => update('message', event.target.value)} placeholder="Tell us anything important about your trip..." className="mt-1.5 w-full resize-none rounded-xl border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" />
            </label>

            {status === 'error' && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div><p className="font-semibold">Booking could not be submitted.</p><p className="mt-1">{errorDetail}</p></div>
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button type="button" onClick={onClose} className="flex-1 rounded-xl bg-sand-100 px-5 py-3.5 font-poppins font-semibold text-foreground transition-colors hover:bg-sand-200">Cancel</button>
              <button type="submit" disabled={status === 'loading'} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-book px-5 py-3.5 font-poppins font-semibold text-white transition hover:bg-book-600 disabled:cursor-not-allowed disabled:opacity-70">
                {status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                {status === 'loading' ? 'Submitting booking...' : 'Submit booking'}
              </button>
            </div>

            <p className="text-center font-inter text-xs text-muted-foreground">
              Your booking is saved through our secure booking system and appears in the admin reservations dashboard.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
