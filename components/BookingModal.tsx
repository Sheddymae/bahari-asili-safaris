'use client';

import { useEffect, useMemo, useState } from 'react';
import { X, MessageCircle, Send, AlertCircle, UserPlus, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { safaris, excursions } from '@/lib/tours-data';
import AuthModal from '@/components/AuthModal';
import InquiryStatusDisplay from '@/components/InquiryStatusDisplay';
import NationalitySelect from '@/components/NationalitySelect';
import { isCountry } from '@/lib/countries';

const WHATSAPP_NUMBER = '254101923355';
type Status = 'idle' | 'loading' | 'success' | 'error';
type Step = 1 | 2 | 3;

interface BookingModalProps { isOpen: boolean; onClose: () => void; selectedTour?: string; }
interface FormState {
  firstName: string; lastName: string; email: string; whatsapp: string; nationality: string;
  adults: string; children: string; arrivalDate: string; safari: string; message: string;
}

const stepCopy = {
  en: { steps: ['Who is travelling', 'When & which safari', 'Contact details'], back: 'Back', next: 'Continue', step: 'Step', of: 'of', required: 'Required fields are marked *', confirm: 'Send booking request', sending: 'Sending…', whatsapp: 'Prefer WhatsApp? Message us instead.' },
  it: { steps: ['Chi viaggia', 'Quando e quale safari', 'Contatti'], back: 'Indietro', next: 'Continua', step: 'Passo', of: 'di', required: 'I campi obbligatori sono contrassegnati con *', confirm: 'Invia richiesta', sending: 'Invio…', whatsapp: 'Preferisci WhatsApp? Scrivici direttamente.' },
  fr: { steps: ['Qui voyage', 'Quand et quel safari', 'Coordonnées'], back: 'Retour', next: 'Continuer', step: 'Étape', of: 'sur', required: 'Les champs obligatoires sont marqués *', confirm: 'Envoyer la demande', sending: 'Envoi…', whatsapp: 'Vous préférez WhatsApp ? Écrivez-nous directement.' },
  es: { steps: ['Quién viaja', 'Cuándo y qué safari', 'Contacto'], back: 'Atrás', next: 'Continuar', step: 'Paso', of: 'de', required: 'Los campos obligatorios llevan *', confirm: 'Enviar solicitud', sending: 'Enviando…', whatsapp: '¿Prefieres WhatsApp? Escríbenos directamente.' },
  de: { steps: ['Wer reist', 'Wann und welches Safari', 'Kontaktdaten'], back: 'Zurück', next: 'Weiter', step: 'Schritt', of: 'von', required: 'Pflichtfelder sind mit * markiert', confirm: 'Anfrage senden', sending: 'Senden…', whatsapp: 'Lieber WhatsApp? Schreiben Sie uns direkt.' },
  ar: { steps: ['من يسافر', 'متى وأي سفاري', 'بيانات الاتصال'], back: 'رجوع', next: 'متابعة', step: 'الخطوة', of: 'من', required: 'الحقول المطلوبة تحمل *', confirm: 'إرسال الطلب', sending: 'جارٍ الإرسال…', whatsapp: 'تفضل واتساب؟ أرسل لنا رسالة مباشرة.' },
  zh: { steps: ['谁要出行', '时间和 Safari', '联系方式'], back: '返回', next: '继续', step: '步骤', of: '/', required: '必填项标有 *', confirm: '发送预订请求', sending: '发送中…', whatsapp: '更喜欢 WhatsApp？直接联系我们。' },
  sw: { steps: ['Nani anasafiri', 'Lini na safari gani', 'Maelezo ya mawasiliano'], back: 'Rudi', next: 'Endelea', step: 'Hatua', of: 'ya', required: 'Sehemu muhimu zimewekewa *', confirm: 'Tuma ombi la kuhifadhi', sending: 'Inatuma…', whatsapp: 'Unapendelea WhatsApp? Tutumie ujumbe moja kwa moja.' },
} as const;

export function formatKidsAges(ages: number[] | null | undefined, locale: string): string {
  if (!ages?.length) return '';
  const years = locale === 'it' ? 'anni' : locale === 'fr' ? 'ans' : locale === 'es' ? 'años' : locale === 'de' ? 'Jahre' : locale === 'ar' ? 'سنوات' : locale === 'zh' ? '岁' : locale === 'sw' ? 'miaka' : 'yrs';
  return `${ages.join(', ')} ${years}`;
}

export default function BookingModal({ isOpen, onClose, selectedTour }: BookingModalProps) {
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const copy = stepCopy[locale as keyof typeof stepCopy] || stepCopy.en;
  const [step, setStep] = useState<Step>(1);
  const [status, setStatus] = useState<Status>('idle');
  const [errorDetail, setErrorDetail] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [kidsAges, setKidsAges] = useState<(number | '')[]>([]);
  const [kidsAgesError, setKidsAgesError] = useState(false);
  const [form, setForm] = useState<FormState>({ firstName: '', lastName: '', email: '', whatsapp: '', nationality: '', adults: '2', children: '0', arrivalDate: '', safari: selectedTour || '', message: '' });
  const childCount = Math.min(Math.max(parseInt(form.children, 10) || 0, 0), 10);
  const allSafariNames = useMemo(() => safaris.map((s) => ({ name: s.name, days: s.days })), []);

  useEffect(() => {
    setKidsAges((previous) => previous.length === childCount ? previous : childCount < previous.length ? previous.slice(0, childCount) : [...previous, ...Array(childCount - previous.length).fill('')]);
    setKidsAgesError(false);
  }, [childCount]);

  useEffect(() => {
    if (!user || !isOpen) return;
    const meta = user.user_metadata || {};
    const parts = String(meta.full_name || '').trim().split(/\s+/);
    setForm((previous) => ({ ...previous, firstName: parts[0] || previous.firstName, lastName: parts.slice(1).join(' ') || previous.lastName, email: user.email || previous.email, whatsapp: meta.whatsapp || previous.whatsapp, nationality: meta.nationality || previous.nationality }));
  }, [user, isOpen]);

  useEffect(() => { if (selectedTour) setForm((previous) => ({ ...previous, safari: selectedTour })); }, [selectedTour]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) { setStep(1); setStatus('idle'); setErrorDetail(''); setBookingRef(''); setShowAuthPrompt(false); }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  const handleKidsAgeChange = (index: number, value: string) => { setKidsAges((previous) => { const next = [...previous]; next[index] = value === '' ? '' : parseInt(value, 10); return next; }); setKidsAgesError(false); };

  const validateStep = (target: Step) => {
    if (target === 1) {
      if (!form.firstName.trim() || !form.lastName.trim() || (parseInt(form.adults, 10) || 0) < 1) return false;
      if (childCount > 0 && kidsAges.some((age) => age === '')) { setKidsAgesError(true); return false; }
    }
    if (target === 2 && (!form.arrivalDate || !form.safari)) return false;
    if (target === 3 && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !isCountry(form.nationality.trim()))) return false;
    return true;
  };

  const buildWhatsAppMsg = (ref = bookingRef) => encodeURIComponent(['*Bahari Asili Safaris booking*', ref ? `Ref: ${ref}` : '', `Name: ${form.firstName} ${form.lastName}`, `Adults: ${form.adults} | Children: ${form.children}${childCount ? ` (Ages: ${kidsAges.join(', ')})` : ''}`, `Safari: ${form.safari}`, `Date: ${form.arrivalDate}`, form.email ? `Email: ${form.email}` : '', form.whatsapp ? `WhatsApp: ${form.whatsapp}` : '', form.message ? `Notes: ${form.message}` : ''].filter(Boolean).join('\n'));

  const downloadInvoice = async (ref: string, bookingType?: string) => {
    const invoiceRes = await fetch('/api/booking/invoice', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/pdf' }, body: { bookingRef: ref, firstName: form.firstName, lastName: form.lastName, email: form.email, whatsapp: form.whatsapp, nationality: form.nationality, adults: parseInt(form.adults, 10), children: childCount, kidsAges: kidsAges.filter((age): age is number => age !== ''), arrivalDate: form.arrivalDate, safariName: form.safari, message: form.message, bookingType, locale } });
    if (!invoiceRes.ok) { let detail = `Invoice generation failed (HTTP ${invoiceRes.status}).`; try { const data = await invoiceRes.json(); if (data?.error) detail = data.error; } catch {} throw new Error(detail); }
    if (!(invoiceRes.headers.get('content-type') || '').includes('application/pdf')) throw new Error('Invoice service returned an invalid PDF response.');
    const blob = await invoiceRes.blob();
    if (!blob.size) throw new Error('Invoice PDF is empty.');
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = invoiceRes.headers.get('content-disposition')?.match(/filename="?([^";]+)"?/i)?.[1] || `Bahari-Asili-Provisional-Invoice-${ref}.pdf`; anchor.style.display = 'none'; document.body.appendChild(anchor); anchor.click(); anchor.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateStep(3)) { setErrorDetail(!form.nationality.trim() || !isCountry(form.nationality.trim()) ? 'Please select your nationality from the country list.' : 'Please enter a valid email address.'); return; }
    setStatus('loading'); setErrorDetail('');
    try {
      const resolvedAges = kidsAges.filter((age): age is number => age !== '');
      const response = await fetch('/api/booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, email: form.email, whatsapp: form.whatsapp, nationality: form.nationality, adults: parseInt(form.adults, 10), children: childCount, kidsAges: resolvedAges, arrivalDate: form.arrivalDate, safariName: form.safari, message: form.message, userId: user?.id || null, locale }) });
      const data = await response.json();
      if (!response.ok || !data.success || !data.bookingRef) throw new Error(data.error || 'Booking could not be saved.');
      setBookingRef(data.bookingRef); setEmailSent(data.emailSent === true); setShowAuthPrompt(!user);
      await downloadInvoice(data.bookingRef, data.bookingType); setStatus('success');
    } catch (error) { console.error('Booking/invoice error:', error); setErrorDetail(error instanceof Error ? error.message : 'The booking was saved, but the invoice could not be generated.'); setStatus('error'); }
  };

  if (!isOpen) return null;
  const ageLabel = (index: number) => locale === 'it' ? `Età bambino ${index + 1}` : locale === 'fr' ? `Âge enfant ${index + 1}` : locale === 'es' ? `Edad niño ${index + 1}` : locale === 'de' ? `Alter Kind ${index + 1}` : locale === 'ar' ? `عمر الطفل ${index + 1}` : locale === 'zh' ? `儿童 ${index + 1} 年龄` : locale === 'sw' ? `Umri wa mtoto ${index + 1}` : `Child ${index + 1} age`;
  const selectAge = locale === 'it' ? 'Seleziona età' : locale === 'fr' ? 'Sélectionner' : locale === 'es' ? 'Seleccionar edad' : locale === 'de' ? 'Alter auswählen' : locale === 'ar' ? 'اختر العمر' : locale === 'zh' ? '选择年龄' : locale === 'sw' ? 'Chagua umri' : 'Select age';

  return <>
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button aria-label="Close" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-labelledby="booking-modal-title" className="relative bg-white rounded-3xl shadow-hero w-full max-w-lg max-h-[92vh] overflow-y-auto z-10">
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-border px-5 sm:px-6 py-5 z-10">
          <div className="flex items-start justify-between gap-4"><div><h2 id="booking-modal-title" className="font-poppins font-bold text-xl text-foreground">{t.booking.title}</h2><p className="font-inter text-muted-foreground text-sm mt-1">{copy.step} {step} {copy.of} 3 · {copy.steps[step - 1]}</p></div><button onClick={onClose} aria-label="Close" className="w-9 h-9 shrink-0 rounded-full bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button></div>
          <div className="grid grid-cols-3 gap-1.5 mt-4">{[1, 2, 3].map((n) => <div key={n} className={`h-1.5 rounded-full ${n <= step ? 'bg-ocean-700' : 'bg-border'}`} />)}</div>
        </div>

        {status === 'success' ? <div className="px-6 py-10"><div className="text-center mb-5"><CheckCircle className="w-14 h-14 text-ocean-700 mx-auto mb-3" /><h3 className="font-poppins font-bold text-xl">{t.booking.success}</h3></div><InquiryStatusDisplay bookingRef={bookingRef} firstName={form.firstName} email={form.email} whatsapp={form.whatsapp} emailSent={emailSent} status="pending" />{showAuthPrompt && <div className="mt-5 bg-ocean-50 border border-ocean-200 rounded-xl p-4 flex gap-3"><UserPlus className="w-5 h-5 text-ocean-700 shrink-0" /><div><p className="font-semibold text-sm">{t.bookingModal.createAccountTitle}</p><p className="text-xs text-muted-foreground mt-1 mb-3">{t.bookingModal.createAccountDesc}</p><button onClick={() => setAuthModalOpen(true)} className="rounded-lg bg-ocean-700 text-white px-4 py-2 text-sm font-semibold">{t.bookingModal.createAccountBtn}</button></div></div>}<div className="grid grid-cols-2 gap-3 mt-6"><a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMsg(bookingRef)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white py-3 font-semibold"><MessageCircle className="w-4 h-4" />WhatsApp</a><button onClick={onClose} className="rounded-xl bg-ocean-700 text-white py-3 font-semibold">OK</button></div></div> : <form onSubmit={submit} className="px-5 sm:px-6 py-6">
          <div className="mb-5 rounded-xl bg-sand-50 border border-border px-4 py-3 text-xs text-muted-foreground">{copy.required}</div>
          {step === 1 && <div className="space-y-4"><div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium mb-1.5">{t.booking.firstName} *</label><input required autoFocus name="firstName" value={form.firstName} onChange={handleChange} placeholder={t.booking.firstNamePlaceholder} className="w-full border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ocean-100" /></div><div><label className="block text-sm font-medium mb-1.5">{t.booking.lastName} *</label><input required name="lastName" value={form.lastName} onChange={handleChange} placeholder={t.booking.lastNamePlaceholder} className="w-full border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ocean-100" /></div></div><div className="grid grid-cols-2 gap-3"><div><label className="block text-sm font-medium mb-1.5">{t.booking.adults} *</label><input required type="number" min="1" max="30" name="adults" value={form.adults} onChange={handleChange} className="w-full border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ocean-100" /></div><div><label className="block text-sm font-medium mb-1.5">{t.booking.children}</label><input type="number" min="0" max="10" name="children" value={form.children} onChange={handleChange} className="w-full border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-ocean-100" /></div></div>{childCount > 0 && <div className={`rounded-2xl border p-4 space-y-3 ${kidsAgesError ? 'border-red-400 bg-red-50' : 'border-safari-200 bg-safari-50'}`}><p className="text-sm font-semibold">{locale === 'it' ? 'Età dei bambini' : locale === 'fr' ? 'Âge des enfants' : locale === 'es' ? 'Edades de los niños' : locale === 'de' ? 'Kinderalter' : locale === 'ar' ? 'أعمار الأطفال' : locale === 'zh' ? '儿童年龄' : locale === 'sw' ? 'Umri wa watoto' : 'Children ages'} *</p><div className={`grid gap-3 ${childCount === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>{kidsAges.map((age, index) => <div key={index}><label className="block text-xs font-medium mb-1">{ageLabel(index)}</label><select value={age === '' ? '' : String(age)} onChange={(e) => handleKidsAgeChange(index, e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 bg-white"><option value="">{selectAge}</option>{Array.from({ length: 17 }, (_, n) => <option key={n} value={n}>{n} {locale === 'it' ? 'anni' : locale === 'fr' ? 'ans' : locale === 'es' ? 'años' : locale === 'de' ? 'Jahre' : locale === 'ar' ? 'سنوات' : locale === 'zh' ? '岁' : locale === 'sw' ? 'miaka' : 'yrs'}</option>)}</select></div>)}</div>{kidsAgesError && <p className="text-xs text-red-700 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />Please select every child age.</p>}</div>}</div>}
          {step === 2 && <div className="space-y-4"><div><label className="block text-sm font-medium mb-1.5">{t.booking.safari} *</label><select required autoFocus name="safari" value={form.safari} onChange={handleChange} className="w-full border border-border rounded-xl px-4 py-3 bg-muted"><option value="">{t.booking.safariPlaceholder}</option><optgroup label={t.bookingOptions.safarisGroup}>{allSafariNames.map((s) => <option key={s.name} value={s.name}>{s.name} — {s.days} {t.tours.days}</option>)}</optgroup><optgroup label={t.bookingOptions.excursionsGroup}>{excursions.map((item) => <option key={item.id} value={item.nameIt}>{item.nameIt}</option>)}</optgroup><optgroup label={t.bookingOptions.transfersGroup}><option value="Airport Transfer – MYD (Malindi)">Airport Transfer – MYD (Malindi)</option><option value="Airport Transfer – MBA (Mombasa)">Airport Transfer – MBA (Mombasa)</option><option value="Airport Transfer – NBO (Nairobi)">Airport Transfer – NBO (Nairobi)</option><option value="Private 4×4 Driver">Private 4×4 Driver</option></optgroup><option value="Altro / Other">Altro / Other</option></select></div><div><label className="block text-sm font-medium mb-1.5">{t.booking.arrivalDate} *</label><input required type="date" name="arrivalDate" value={form.arrivalDate} onChange={handleChange} className="w-full border border-border rounded-xl px-4 py-3 bg-muted" /></div><div><label className="block text-sm font-medium mb-1.5">{t.booking.message}</label><textarea name="message" rows={4} value={form.message} onChange={handleChange} placeholder={t.booking.messagePlaceholder} className="w-full border border-border rounded-xl px-4 py-3 bg-muted resize-none" /></div></div>}
          {step === 3 && <div className="space-y-4"><div><label className="block text-sm font-medium mb-1.5">{t.booking.email} *</label><input required autoFocus type="email" name="email" value={form.email} onChange={handleChange} placeholder={t.booking.emailPlaceholder} className="w-full border border-border rounded-xl px-4 py-3 bg-muted" /></div><div><label className="block text-sm font-medium mb-1.5">{t.booking.whatsapp}</label><input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder={t.booking.whatsappPlaceholder} className="w-full border border-border rounded-xl px-4 py-3 bg-muted" /></div><NationalitySelect id="booking-modal-nationality" value={form.nationality} onChange={(country) => { setForm((previous) => ({ ...previous, nationality: country })); setErrorDetail(''); }} label={t.booking.nationality} required error={status === 'error' && (!form.nationality || !isCountry(form.nationality.trim()))} errorMessage={status === 'error' && (!form.nationality || !isCountry(form.nationality.trim())) ? 'Please select your nationality from the country list.' : undefined} placeholder="Type country name or code (e.g. KE or IT)" helperText="Type a country name or ISO code such as KE or IT, then select it from the list." /></div>}
          {status === 'error' && <div className="mt-4 flex gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />{errorDetail || t.booking.error}</div>}
          <div className="flex gap-3 mt-6">{step > 1 && <button type="button" onClick={() => setStep((step - 1) as Step)} className="flex-1 flex items-center justify-center gap-2 border border-border rounded-xl py-3.5 font-semibold"><ArrowLeft className="w-4 h-4" />{copy.back}</button>}{step < 3 ? <button type="button" onClick={() => { if (validateStep(step)) { setErrorDetail(''); setStep((step + 1) as Step); } else setErrorDetail('Please complete the required fields before continuing.'); }} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-safari-500 hover:bg-safari-600 text-white py-3.5 font-semibold">{copy.next}<ArrowRight className="w-4 h-4" /></button> : <button type="submit" disabled={status === 'loading'} className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-safari-500 hover:bg-safari-600 disabled:opacity-60 text-white py-3.5 font-semibold"><Send className="w-4 h-4" />{status === 'loading' ? copy.sending : copy.confirm}</button>}</div>
        </form>}
      </div>
    </div>
    <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultMode="signup" />
  </>;
}
