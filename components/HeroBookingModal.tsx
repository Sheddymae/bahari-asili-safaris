'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import InquiryStatusDisplay from '@/components/InquiryStatusDisplay';
import NationalitySelect from '@/components/NationalitySelect';
import { isCountry } from '@/lib/countries';
import { safaris, excursions } from '@/lib/tours-data';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';

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
  firstName: '', lastName: '', email: '', whatsapp: '', nationality: '', destination: '', adults: '2', children: '0', arrivalDate: '', departureDate: '', message: '',
};

export default function HeroBookingModal({ isOpen, onClose, initialSelection }: HeroBookingModalProps) {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<Status>('idle');
  const [errorDetail, setErrorDetail] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(''); const [showAuth, setShowAuth] = useState(false); const [currency, setCurrency] = useState<'KES'|'USD'|'EUR'>('USD');

  useEffect(() => {
    if (!isOpen) return;
    setForm({ ...emptyForm, destination: initialSelection?.destination || '', adults: String(initialSelection?.adults || 2), arrivalDate: initialSelection?.arrivalDate || '' });
    setStatus('idle'); setErrorDetail(''); setBookingRef(''); setInvoiceNumber(''); setEmailSent(false);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, initialSelection]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const update = (name: keyof FormState, value: string) => setForm((previous) => ({ ...previous, [name]: value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setErrorDetail('');
    const nationality = form.nationality.trim();
    if (!nationality || !isCountry(nationality)) {
      setStatus('error');
      setErrorDetail('Please select your nationality from the country list.');
      return;
    }
    setStatus('loading');
    const children = Math.max(0, parseInt(form.children, 10) || 0);
    const adults = Math.min(30, Math.max(1, parseInt(form.adults, 10) || 1));
    try {
      const messageParts = [form.message.trim(), form.departureDate ? `Departure date: ${form.departureDate}` : '', 'Homepage booking request from the hero booking bar.'].filter(Boolean);
      const selectedItinerary = safaris.find((s) => s.name === form.destination) || excursions.find((e) => e.nameIt === form.destination) || null;
      const response = await fetch('/api/booking', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: (form.firstName + ' ' + form.lastName).trim(), travelers: { adults, children, kidsAges: [] }, dates: { arrival: form.arrivalDate }, firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(), whatsapp: form.whatsapp.trim(), nationality, adults, children, kidsAges: [], arrivalDate: form.arrivalDate, safariName: form.destination.trim(), message: messageParts.join('\n'), userId: user?.id || null, locale, itinerary: selectedItinerary || { id: form.destination, name: form.destination, title: form.destination, type: 'service' }, total: 0, currency }),
      });
      let data: any = null;
      try { data = await response.json(); } catch { data = null; }
      if (!response.ok || !data?.success || !data?.bookingRef) throw new Error(data?.error || 'We could not save your booking. Please try again.');
      setBookingRef(String(data.bookingRef)); setInvoiceNumber(String(data.invoiceNumber || '')); setEmailSent(data.emailSent === true); setStatus('success');
    } catch (error) {
      console.error('Hero booking submission failed:', error);
      setErrorDetail(error instanceof Error ? error.message : 'We could not save your booking. Please try again.'); setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="hero-booking-title" className="relative z-10 w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-[4px] bg-white shadow-xl">
        <div className="sticky top-0 z-20 flex items-center justify-between rounded-t-3xl border-b border-border bg-white px-6 py-5 sm:px-8">
          <div>
            <p className="font-inter text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-secondary)]">Bahari Asili Safaris</p>
            <h2 id="hero-booking-title" className="mt-1 font-poppins text-xl font-bold text-foreground sm:text-2xl">{t.booking?.title || 'Complete your booking'}</h2>
            <p className="mt-1 font-inter text-sm text-muted-foreground">{t.booking?.subtitle || 'Tell us about your trip and our team will confirm availability.'}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close booking form" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors hover:bg-sand-100"><X className="h-5 w-5 text-foreground" /></button>
        </div>

        {status === 'success' ? (
          <div className="p-6 sm:p-8"><InquiryStatusDisplay bookingRef={bookingRef} firstName={form.firstName} email={form.email} whatsapp={form.whatsapp} emailSent={emailSent} status="pending" />{invoiceNumber && <p className="mt-4 text-center text-sm font-semibold text-ocean-700">Invoice {invoiceNumber}</p>}{!user && <button type="button" onClick={()=>setShowAuth(true)} className="mt-4 w-full rounded-[4px] bg-[var(--brand-primary)] px-5 py-3.5 font-poppins font-semibold text-white">Create Account to Track</button>}{user && <button type="button" onClick={()=>window.location.href='/dashboard'} className="mt-4 w-full rounded-[4px] bg-[var(--brand-primary)] px-5 py-3.5 font-poppins font-semibold text-white">View Invoice in Dashboard</button>}<button type="button" onClick={onClose} className="mt-3 w-full brand-button brand-button-secondary px-5 py-3.5 font-poppins font-semibold text-foreground">Continue</button></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
            <div className="rounded-[4px] border border-ocean-100 bg-sand-50 p-4"><div className="flex flex-wrap gap-x-6 gap-y-2 font-inter text-sm text-foreground"><span><strong>Destination:</strong> {form.destination || 'Not selected'}</span><span><strong>Guests:</strong> {form.adults}</span><span><strong>Arrival:</strong> {form.arrivalDate || 'Not selected'}</span></div></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="font-inter text-sm font-medium text-foreground">{t.booking?.firstName || 'First name'} *<input required value={form.firstName} onChange={(event) => update('firstName', event.target.value)} placeholder={t.booking?.firstNamePlaceholder || 'First name'} className="mt-1.5 w-full rounded-[4px] border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" /></label>
              <label className="font-inter text-sm font-medium text-foreground">{t.booking?.lastName || 'Last name'} *<input required value={form.lastName} onChange={(event) => update('lastName', event.target.value)} placeholder={t.booking?.lastNamePlaceholder || 'Last name'} className="mt-1.5 w-full rounded-[4px] border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="font-inter text-sm font-medium text-foreground">{t.booking?.email || 'Email'} *<input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder={t.booking?.emailPlaceholder || 'you@example.com'} className="mt-1.5 w-full rounded-[4px] border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" /></label>
              <label className="font-inter text-sm font-medium text-foreground">WhatsApp<input value={form.whatsapp} onChange={(event) => update('whatsapp', event.target.value)} placeholder="+254..." className="mt-1.5 w-full rounded-[4px] border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="font-inter text-sm font-medium text-foreground">Destination *<input required value={form.destination} onChange={(event) => update('destination', event.target.value)} className="mt-1.5 w-full rounded-[4px] border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" /></label>
              <label className="font-inter text-sm font-medium text-foreground">Guests *<input required type="number" min="1" max="30" value={form.adults} onChange={(event) => update('adults', event.target.value)} className="mt-1.5 w-full rounded-[4px] border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" /></label>
              <label className="font-inter text-sm font-medium text-foreground">Children<input type="number" min="0" max="10" value={form.children} onChange={(event) => update('children', event.target.value)} className="mt-1.5 w-full rounded-[4px] border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="font-inter text-sm font-medium text-foreground">Arrival date *<input required type="date" value={form.arrivalDate} onChange={(event) => update('arrivalDate', event.target.value)} className="mt-1.5 w-full rounded-[4px] border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" /></label>
              <label className="font-inter text-sm font-medium text-foreground">Departure date<input type="date" min={form.arrivalDate || undefined} value={form.departureDate} onChange={(event) => update('departureDate', event.target.value)} className="mt-1.5 w-full rounded-[4px] border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" /></label>
            </div>
            <NationalitySelect id="hero-booking-nationality" value={form.nationality} onChange={(country) => { update('nationality', country); setErrorDetail(''); }} label={t.booking?.nationality || 'Nationality'} required error={status === 'error' && (!form.nationality || !isCountry(form.nationality.trim()))} errorMessage={status === 'error' && (!form.nationality || !isCountry(form.nationality.trim())) ? 'Please select your nationality from the country list.' : undefined} placeholder="Type country name or code (e.g. KE or IT)" helperText="Type a country name or ISO code such as KE or IT, then select it from the list." />
            <div className="rounded-[4px] border border-safari-200 bg-safari-50 p-4"><div className="flex items-center justify-between"><p className="text-sm font-semibold">Price breakdown</p><select value={currency} onChange={event=>setCurrency(event.target.value as 'KES'|'USD'|'EUR')} className="rounded-lg border border-border bg-white px-2 py-2 text-xs font-semibold"><option value="KES">KES</option><option value="USD">USD</option><option value="EUR">EUR</option></select></div><div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground"><span>Accommodation</span><span className="text-right">To confirm</span><span>Park fees</span><span className="text-right">To confirm</span><span>Guide &amp; vehicle</span><span className="text-right">To confirm</span><span>Meals &amp; transfers</span><span className="text-right">To confirm</span></div></div><label className="block font-inter text-sm font-medium text-foreground">Message / special requests<textarea rows={4} value={form.message} onChange={(event) => update('message', event.target.value)} placeholder="Tell us anything important about your trip..." className="mt-1.5 w-full resize-none rounded-[4px] border border-border bg-muted px-4 py-3 text-sm outline-none transition focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100" /></label>
            {status === 'error' && <div className="flex items-start gap-3 rounded-[4px] border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" /><div><p className="font-semibold">Booking could not be submitted.</p><p className="mt-1">{errorDetail}</p></div></div>}
            <div className="flex flex-col-reverse gap-3 sm:flex-row"><button type="button" onClick={onClose} className="flex-1 rounded-[4px] bg-sand-100 px-5 py-3.5 font-poppins font-semibold text-foreground transition-colors hover:bg-sand-200">Cancel</button><button type="submit" disabled={status === 'loading'} className="inline-flex flex-1 items-center justify-center gap-2 rounded-[4px] bg-[var(--brand-secondary)] px-5 py-3.5 font-poppins font-semibold text-foreground transition hover:bg-[var(--brand-secondary)]-600 disabled:cursor-not-allowed disabled:opacity-70">{status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}{status === 'loading' ? 'Submitting booking...' : 'Submit booking'}</button></div>
            <p className="text-center font-inter text-xs text-muted-foreground">Your booking is saved through our secure booking system and appears in the admin reservations dashboard.</p>
          </form>
        )}
      </div><AuthModal isOpen={showAuth} onClose={()=>setShowAuth(false)} defaultMode="signup" initialEmail={form.email} /></div>
  );
}
