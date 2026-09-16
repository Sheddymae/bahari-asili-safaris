'use client';

import type { CSSProperties } from 'react';
import { Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type SupportedLocale = 'en' | 'it' | 'fr' | 'es' | 'de' | 'ar' | 'zh' | 'sw';

const WHATSAPP_NUMBER = '254101923355';
const CALL_NUMBER = '+254101923355';
const WHATSAPP_MESSAGE = 'Hello Bahari Asili, I need more information about a safari.';

const copy: Record<SupportedLocale, { whatsapp: string; call: string }> = {
  en: { whatsapp: 'WhatsApp', call: 'Call us' },
  it: { whatsapp: 'WhatsApp', call: 'Chiamaci' },
  fr: { whatsapp: 'WhatsApp', call: 'Appelez-nous' },
  es: { whatsapp: 'WhatsApp', call: 'Llámanos' },
  de: { whatsapp: 'WhatsApp', call: 'Anrufen' },
  ar: { whatsapp: 'واتساب', call: 'اتصل بنا' },
  zh: { whatsapp: 'WhatsApp', call: '致电我们' },
  sw: { whatsapp: 'WhatsApp', call: 'Tupigie' },
};

const localeSet = new Set<SupportedLocale>(Object.keys(copy) as SupportedLocale[]);

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px] shrink-0 text-[#25D366]" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.099-.497.099-.198.05-.371.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.113 1.523 5.845L0 24l6.335-1.652A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.868 0-3.706-.502-5.312-1.454l-.381-.226-3.94 1.027 1.05-3.844-.248-.396A9.72 9.72 0 012.25 12C2.25 6.624 6.624 2.25 12 2.25S21.75 6.624 21.75 12 17.376 21.75 12 21.75z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const { locale } = useLanguage();
  const activeLocale: SupportedLocale = localeSet.has(locale as SupportedLocale) ? (locale as SupportedLocale) : 'en';
  const labels = copy[activeLocale];
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-2 pointer-events-none">
      <a href={`tel:${CALL_NUMBER}`} aria-label={labels.call} title={labels.call} className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-ocean-700 text-white shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-ocean-300" >
        <Phone className="h-[18px] w-[18px]" aria-hidden="true" />
        <span className="sr-only">{labels.call}</span>
      </a>
      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label={labels.whatsapp} title={labels.whatsapp} style={{ '--brand': '#25D366' } as CSSProperties} className="whatsapp-breathe group relative pointer-events-auto flex h-11 items-center overflow-hidden rounded-full bg-white/10 pl-[11px] pr-[11px] text-white shadow-[0_0_12px_rgba(37,211,102,0.55)] transition-all duration-300 ease-out hover:pr-5 hover:text-white hover:shadow-[0_0_22px_rgba(37,211,102,0.85)] hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40">
        <span className="absolute -inset-1 -z-10 rounded-full bg-[#25D366]/35 blur-md opacity-70 whatsapp-breathe-glow" />
        <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background-color:var(--brand)]" />
        <span className="relative z-10 flex items-center">
          <WhatsAppIcon />
          <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap font-inter text-sm font-semibold opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:max-w-[120px] group-hover:opacity-100">{labels.whatsapp}</span>
        </span>
      </a>
    </div>
  );
}
