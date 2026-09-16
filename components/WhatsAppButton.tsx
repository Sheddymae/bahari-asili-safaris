'use client';

import { Phone, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

type SupportedLocale = 'en' | 'it' | 'fr' | 'es' | 'de' | 'ar' | 'zh' | 'sw';

const WHATSAPP_NUMBER = '254101923355';
const CALL_NUMBER = '+254101923355';
const WHATSAPP_MESSAGE = 'Hello Bahari Asili, I need more information about a safari.';

const copy: Record<SupportedLocale, { contact: string; whatsapp: string; call: string }> = {
  en: { contact: 'Contact us', whatsapp: 'WhatsApp', call: 'Call us' },
  it: { contact: 'Contattaci', whatsapp: 'WhatsApp', call: 'Chiamaci' },
  fr: { contact: 'Contactez-nous', whatsapp: 'WhatsApp', call: 'Appelez-nous' },
  es: { contact: 'Contáctanos', whatsapp: 'WhatsApp', call: 'Llámanos' },
  de: { contact: 'Kontakt', whatsapp: 'WhatsApp', call: 'Anrufen' },
  ar: { contact: 'اتصل بنا', whatsapp: 'واتساب', call: 'اتصل بنا' },
  zh: { contact: '联系我们', whatsapp: 'WhatsApp', call: '致电我们' },
  sw: { contact: 'Wasiliana nasi', whatsapp: 'WhatsApp', call: 'Tupigie' },
};

const localeSet = new Set<SupportedLocale>(Object.keys(copy) as SupportedLocale[]);

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.099-.497.099-.198.05-.371.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.113 1.523 5.845L0 24l6.335-1.652A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.868 0-3.706-.502-5.312-1.454l-.381-.226-3.94 1.027 1.05-3.844-.248-.396A9.72 9.72 0 012.25 12C2.25 6.624 6.624 2.25 12 2.25S21.75 6.624 21.75 12 17.376 21.75 12 21.75z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const activeLocale: SupportedLocale = localeSet.has(locale as SupportedLocale) ? (locale as SupportedLocale) : 'en';
  const labels = copy[activeLocale];
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3">
      <div className={`flex flex-col items-end gap-2 transition-all duration-200 ${open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`} aria-hidden={!open}>
        <a href={`tel:${CALL_NUMBER}`} aria-label={labels.call} className="group relative flex min-h-11 items-center overflow-hidden rounded-full bg-white/10 px-3 text-white shadow-lg transition-all duration-300 ease-out hover:pr-5 hover:scale-105 hover:text-white focus:outline-none focus:ring-4 focus:ring-ocean-300">
          <span className="absolute inset-0 rounded-full bg-ocean-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative z-10 flex items-center"><Phone className="h-5 w-5" aria-hidden="true" /><span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap font-inter text-sm font-semibold opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:max-w-[120px] group-hover:opacity-100">{labels.call}</span></span>
        </a>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label={labels.whatsapp} className="group relative flex min-h-11 items-center overflow-hidden rounded-full bg-white/10 px-3 text-white shadow-lg transition-all duration-300 ease-out hover:pr-5 hover:scale-105 hover:text-white focus:outline-none focus:ring-4 focus:ring-[#25D366]/40">
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative z-10 flex items-center"><WhatsAppIcon /><span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap font-inter text-sm font-semibold opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:max-w-[120px] group-hover:opacity-100">{labels.whatsapp}</span></span>
        </a>
      </div>

      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={labels.contact} title={labels.contact} className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-ocean-700 text-white shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition-all duration-300 hover:scale-105 hover:bg-ocean-800 focus:outline-none focus:ring-4 focus:ring-ocean-300 active:scale-95">
        {open ? (
          <X className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" aria-hidden="true" />
        ) : (
          <span className="relative flex h-7 w-8 items-center justify-center">
            <WhatsAppIcon />
            <span className="absolute right-0 flex h-5 w-5 translate-x-1 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true">
              <Phone className="h-5 w-5" />
            </span>
          </span>
        )}
        <span className="sr-only">{labels.contact}</span>
      </button>
    </div>
  );
}
