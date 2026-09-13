'use client';

import { useState, useEffect } from 'react';
import { X, MessageCircle, Send, CheckCircle, AlertCircle, Download, UserPlus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { safaris, excursions } from '@/lib/tours-data';
import { generateVoucherPDF } from '@/lib/voucher-generator';
import type { Booking } from '@/lib/supabase';
import AuthModal from '@/components/AuthModal';
import InquiryStatusDisplay from '@/components/InquiryStatusDisplay';

const WHATSAPP_NUMBER = '254101923355';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTour?: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  nationality: string;
  adults: string;
  children: string;
  arrivalDate: string;
  safari: string;
  message: string;
}

// Formats kids_ages array for display: [5, 9] → "5, 9 anni"
export function formatKidsAges(ages: number[] | null | undefined, locale: string): string {
  if (!ages || ages.length === 0) return '';
  const years = locale === 'it' ? 'anni' : locale === 'fr' ? 'ans' : locale === 'es' ? 'años' : locale === 'de' ? 'Jahre' : locale === 'ar' ? 'سنوات' : locale === 'zh' ? '岁' : locale === 'sw' ? 'miaka' : 'yrs';
  const anni = years;
  return ages.join(', ') + ' ' + anni;
}


export default function BookingModal({ isOpen, onClose, selectedTour }: BookingModalProps) {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const [status, setStatus] = useState<Status>('idle');
  const [bookingRef, setBookingRef] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [kidsAges, setKidsAges] = useState<(number | '')[]>([]);
  const [kidsAgesError, setKidsAgesError] = useState(false);
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    whatsapp: '',
    nationality: '',
    adults: '2',
    children: '0',
    arrivalDate: '',
    safari: selectedTour || '',
    message: '',
  });

  // Sync kidsAges array length with children count
  useEffect(() => {
    const count = Math.min(Math.max(parseInt(form.children) || 0, 0), 10);
    setKidsAges(prev => {
      if (prev.length === count) return prev;
      if (count < prev.length) return prev.slice(0, count);
      return [...prev, ...Array(count - prev.length).fill('')];
    });
    setKidsAgesError(false);
  }, [form.children]);

  // Auto-fill from user profile
  useEffect(() => {
    if (user && isOpen) {
      const meta = user.user_metadata || {};
      const fullName: string = meta.full_name || '';
      const parts = fullName.trim().split(' ');
      setForm(prev => ({
        ...prev,
        firstName: parts[0] || prev.firstName,
        lastName: parts.slice(1).join(' ') || prev.lastName,
        email: user.email || prev.email,
        whatsapp: meta.whatsapp || prev.whatsapp,
        nationality: meta.nationality || prev.nationality,
      }));
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (selectedTour) setForm(prev => ({ ...prev, safari: selectedTour }));
  }, [selectedTour]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStatus('idle');
      setBookingRef('');
      setShowAuthPrompt(false);
      setKidsAgesError(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleKidsAgeChange = (index: number, value: string) => {
    setKidsAges(prev => {
      const next = [...prev];
      next[index] = value === '' ? '' : parseInt(value);
      return next;
    });
    setKidsAgesError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all child ages are selected
    const childCount = parseInt(form.children) || 0;
    if (childCount > 0 && kidsAges.some(a => a === '')) {
      setKidsAgesError(true);
      return;
    }

    setStatus('loading');

    try {
      const resolvedAges = kidsAges.filter((a): a is number => a !== '');

      // Submit to the server — it is the single source of truth for saving the
      // booking and generating the reservation number. (Previously this modal
      // also inserted directly into Supabase from the client with its own
      // separately-generated ref, which created a duplicate row with a
      // mismatched reference number every time someone booked.)
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          whatsapp: form.whatsapp,
          nationality: form.nationality,
          adults: parseInt(form.adults),
          children: childCount,
          kidsAges: resolvedAges,
          arrivalDate: form.arrivalDate,
          safariName: form.safari,
          message: form.message,
          userId: user?.id || null,
          locale,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.bookingRef) {
        throw new Error(data.error || 'Booking could not be saved.');
      }

      const ref: string = data.bookingRef;
      setBookingRef(ref);
      setEmailSent(data.emailSent === true);

      // The booking is already safely saved server-side at this point — a
      // failure past here (e.g. the client-side PDF generator failing to
      // load) must NOT be reported to the customer as "booking failed", or
      // they will assume it wasn't saved and resubmit, creating a duplicate
      // reservation for the same trip. So we flip to success immediately,
      // then best-effort generate/download the voucher in its own try/catch.
      if (!user) setShowAuthPrompt(true);
      setStatus('success');

      try {
        // Generate the voucher PDF using the confirmed reservation number and
        // auto-download it for the customer. The server already emailed a
        // copy of this same voucher, so a failure here just means no local
        // auto-download — nothing about the booking itself is affected.
        const voucherBooking: Booking = {
          booking_ref: ref,
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          whatsapp: form.whatsapp,
          nationality: form.nationality,
          adults: parseInt(form.adults),
          children: childCount,
          kids_ages: resolvedAges.length > 0 ? resolvedAges : null,
          arrival_date: form.arrivalDate,
          safari_name: form.safari,
          message: form.message,
          reservation_status: 'pending',
          booking_type: data.bookingType,
          locale,
        };
        const { dataUrl } = await generateVoucherPDF(voucherBooking);

        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${ref}.pdf`;
        a.click();
      } catch (voucherErr) {
        console.error('Voucher PDF generation/download failed (booking was still saved):', voucherErr);
      }
    } catch (err) {
      console.error('Booking error:', err);
      setStatus('error');
    }
  };

  const buildWhatsAppMsg = () => {
    const childCount = parseInt(form.children) || 0;
    const agesStr = childCount > 0 && kidsAges.length > 0
      ? ` (Ages: ${kidsAges.join(', ')})`
      : '';
    const lines = [
      `*Booking – Bahari Asili Safaris*`,
      bookingRef ? `Ref: ${bookingRef}` : '',
      `Name: ${form.firstName} ${form.lastName}`,
      `Email: ${form.email}`,
      form.nationality ? `Nationality: ${form.nationality}` : '',
      `Adults: ${form.adults} | Children: ${form.children}${agesStr}`,
      `Safari: ${form.safari}`,
      `Date: ${form.arrivalDate}`,
      form.message ? `Notes: ${form.message}` : '',
    ].filter(Boolean);
    return encodeURIComponent(lines.join('\n'));
  };

  if (!isOpen) return null;

  const childCount = parseInt(form.children) || 0;
  const allSafariNames = safaris.map(s => ({ name: s.name, days: s.days }));

  const childAgeLabel = (i: number) =>
    locale === 'it'
      ? `Età Bambino ${i + 1}`
      : locale === 'fr'
        ? `Âge Enfant ${i + 1}`
        : `Child ${i + 1} Age`;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          className="relative bg-white rounded-3xl shadow-hero w-full max-w-lg max-h-[90vh] overflow-y-auto z-10"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white rounded-t-3xl border-b border-border px-6 py-5 flex items-center justify-between z-10">
            <div>
              <h2 id="booking-modal-title" className="font-poppins font-bold text-xl text-foreground">{t.booking.title}</h2>
              <p className="font-inter text-muted-foreground text-sm mt-0.5">{t.booking.subtitle}</p>
            </div>
            <button onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full bg-muted hover:bg-muted flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-foreground" />
            </button>
          </div>

          {/* Guest banner */}
          {!user && status === 'idle' && (
            <div className="mx-6 mt-4 bg-ocean-50 border border-ocean-200 rounded-xl px-4 py-3 flex items-start gap-3">
              <UserPlus className="w-4 h-4 text-ocean-600 flex-shrink-0 mt-0.5" />
              <p className="font-inter text-sm text-ocean-800">
                <button onClick={() => setAuthModalOpen(true)} className="font-semibold underline">{t.bookingModal.signUpLink}</button> {t.bookingModal.toSaveVouchers}
              </p>
            </div>
          )}

          {/* Success */}
          {status === 'success' ? (
            <div className="px-6 py-10">
              <div className="mb-6">
                <InquiryStatusDisplay
                  bookingRef={bookingRef}
                  firstName={form.firstName}
                  email={form.email}
                  whatsapp={form.whatsapp}
                  emailSent={emailSent}
                  status="pending"
                />
              </div>
              {showAuthPrompt && !user && (
                <div className="bg-ocean-50 border border-ocean-200 rounded-xl px-4 py-4 mb-4 text-left">
                  <div className="flex items-start gap-3">
                    <UserPlus className="w-5 h-5 text-ocean-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-inter font-semibold text-ocean-800 text-sm mb-1">{t.bookingModal.createAccountTitle}</p>
                      <p className="font-inter text-xs text-ocean-600 mb-3">{t.bookingModal.createAccountDesc}</p>
                      <button onClick={() => setAuthModalOpen(true)} className="font-inter text-sm font-semibold text-white bg-ocean-700 hover:bg-ocean-800 px-4 py-2 rounded-lg transition-colors">
                        {t.bookingModal.createAccountBtn}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMsg()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary text-white font-poppins font-semibold text-sm py-3 rounded-xl transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
                <button onClick={() => { setStatus('idle'); onClose(); }} className="flex-1 bg-ocean-700 hover:bg-ocean-800 text-white font-poppins font-semibold text-sm py-3 rounded-xl transition-all">
                  OK
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.booking.firstName} <span className="text-safari-500">*</span></label>
                  <input type="text" name="firstName" required value={form.firstName} onChange={handleChange} placeholder={t.booking.firstNamePlaceholder} className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 transition-all bg-muted" />
                </div>
                <div>
                  <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.booking.lastName} <span className="text-safari-500">*</span></label>
                  <input type="text" name="lastName" required value={form.lastName} onChange={handleChange} placeholder={t.booking.lastNamePlaceholder} className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 transition-all bg-muted" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.booking.email} <span className="text-safari-500">*</span></label>
                <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder={t.booking.emailPlaceholder} className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 transition-all bg-muted" />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.booking.whatsapp}</label>
                <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder={t.booking.whatsappPlaceholder} className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 transition-all bg-muted" />
              </div>

              {/* Nationality */}
              <div>
                <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.booking.nationality}</label>
                <input type="text" name="nationality" value={form.nationality} onChange={handleChange} placeholder={t.booking.nationalityPlaceholder} className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 transition-all bg-muted" />
              </div>

              {/* Adults + Children */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.booking.adults}</label>
                  <input type="number" name="adults" min="1" max="30" value={form.adults} onChange={handleChange} className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 transition-all bg-muted" />
                </div>
                <div>
                  <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.booking.children}</label>
                  <input type="number" name="children" min="0" max="10" value={form.children} onChange={handleChange} className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 transition-all bg-muted" />
                </div>
              </div>

              {/* Dynamic child age dropdowns */}
              {childCount > 0 && (
                <div className={`rounded-2xl border p-4 space-y-3 transition-all ${kidsAgesError ? 'border-destructive bg-[#ef4444]/10' : 'border-safari-200 bg-safari-50'}`}>
                  <p className="font-inter text-sm font-semibold text-foreground">
                    {locale === 'it' ? 'Età dei bambini' : locale === 'fr' ? 'Âge des enfants' : locale === 'es' ? 'Edades de los niños' : locale === 'de' ? 'Kinderalter' : locale === 'ar' ? 'أعمار الأطفال' : locale === 'zh' ? '儿童年龄' : locale === 'sw' ? 'Umri wa watoto' : 'Children ages'} <span className="text-safari-500">*</span>
                  </p>
                  <div className={`grid gap-3 ${childCount === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {kidsAges.map((age, i) => (
                      <div key={i}>
                        <label className="font-inter text-xs font-medium text-foreground block mb-1">
                          {childAgeLabel(i)}
                        </label>
                        <select
                          value={age === '' ? '' : String(age)}
                          onChange={e => handleKidsAgeChange(i, e.target.value)}
                          className={`w-full border rounded-xl px-3 py-2.5 font-inter text-sm text-foreground outline-none focus:ring-2 transition-all bg-white cursor-pointer ${
                            kidsAgesError && age === ''
                              ? 'border-destructive focus:border-destructive focus:ring-[#ef4444]/30'
                              : 'border-border focus:border-ocean-600 focus:ring-ocean-100'
                          }`}
                        >
                          <option value="">
                            {locale === 'it' ? '— Seleziona età —' : locale === 'fr' ? '— Sélectionner —' : locale === 'es' ? '— Seleccionar edad —' : locale === 'de' ? '— Alter auswählen —' : locale === 'ar' ? '— اختر العمر —' : locale === 'zh' ? '— 选择年龄 —' : locale === 'sw' ? '— Chagua umri —' : '— Select age —'}
                          </option>
                          {Array.from({ length: 18 }, (_, n) => (
                            <option key={n} value={String(n)}>
                              {n} {locale === 'it' ? 'anni' : locale === 'fr' ? 'ans' : locale === 'es' ? 'años' : locale === 'de' ? 'Jahre' : locale === 'ar' ? 'سنوات' : locale === 'zh' ? '岁' : locale === 'sw' ? 'miaka' : 'yrs'}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                  {kidsAgesError && (
                    <p className="font-inter text-xs text-destructive flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {locale === 'it' ? 'Seleziona l\'età di ogni bambino prima di procedere.' : locale === 'fr' ? 'Veuillez sélectionner l\'âge de chaque enfant.' : locale === 'es' ? 'Selecciona la edad de cada niño antes de continuar.' : locale === 'de' ? 'Bitte wählen Sie das Alter jedes Kindes aus.' : locale === 'ar' ? 'يرجى اختيار عمر كل طفل قبل المتابعة.' : locale === 'zh' ? '请在提交前选择每个孩子的年龄。' : locale === 'sw' ? 'Tafadhali chagua umri wa kila mtoto kabla ya kuendelea.' : 'Please select an age for each child before submitting.'}
                    </p>
                  )}
                </div>
              )}

              {/* Arrival date */}
              <div>
                <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.booking.arrivalDate} <span className="text-safari-500">*</span></label>
                <input type="date" name="arrivalDate" required value={form.arrivalDate} onChange={handleChange} className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 transition-all bg-muted cursor-pointer" />
              </div>

              {/* Safari select */}
              <div>
                <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.booking.safari} <span className="text-safari-500">*</span></label>
                <select name="safari" required value={form.safari} onChange={handleChange} className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 transition-all bg-muted cursor-pointer">
                  <option value="">{t.booking.safariPlaceholder}</option>
                  <optgroup label={t.bookingOptions.safarisGroup}>
                    {allSafariNames.map(s => <option key={s.name} value={s.name}>{s.name} — {s.days} {t.tours.days}</option>)}
                  </optgroup>
                  <optgroup label={t.bookingOptions.excursionsGroup}>
                    {excursions.map(e => <option key={e.id} value={e.nameIt}>{e.nameIt}</option>)}
                  </optgroup>
                  <optgroup label={t.bookingOptions.transfersGroup}>
                    <option value="Airport Transfer – MYD (Malindi)">Airport Transfer – MYD (Malindi)</option>
                    <option value="Airport Transfer – MBA (Mombasa)">Airport Transfer – MBA (Mombasa)</option>
                    <option value="Airport Transfer – NBO (Nairobi)">Airport Transfer – NBO (Nairobi)</option>
                    <option value="Private 4×4 Driver">Private 4×4 Driver</option>
                    <option value="Transfer aeroporto">Transfer aeroporto / Airport transfer</option>
                  </optgroup>
                  <option value="Altro / Other">Altro / Other</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="font-inter text-sm font-medium text-foreground block mb-1.5">{t.booking.message}</label>
                <textarea name="message" rows={3} value={form.message} onChange={handleChange} placeholder={t.booking.messagePlaceholder} className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm text-foreground outline-none focus:border-ocean-600 focus:ring-2 focus:ring-ocean-100 transition-all bg-muted resize-none" />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                  <p className="font-inter text-sm text-destructive">{t.booking.error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMsg()}`, '_blank')}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary text-white font-poppins font-semibold text-sm py-3.5 rounded-xl transition-all hover:shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t.booking.whatsappBtn}
                </button>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex-1 flex items-center justify-center gap-2 bg-safari-500 hover:bg-safari-600 disabled:opacity-60 text-white font-poppins font-semibold text-sm py-3.5 rounded-xl transition-all hover:shadow-md"
                >
                  <Send className="w-4 h-4" />
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      {locale === 'it' ? 'Invio...' : locale === 'fr' ? 'Envoi...' : locale === 'es' ? 'Enviando...' : locale === 'de' ? 'Wird gesendet...' : locale === 'ar' ? 'جارٍ الإرسال...' : locale === 'zh' ? '发送中...' : locale === 'sw' ? 'Inatuma...' : 'Sending...'}
                    </span>
                  ) : t.booking.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode="signup"
      />
    </>
  );
}
