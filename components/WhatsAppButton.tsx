'use client';

import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type SupportedLocale = 'en' | 'it' | 'fr' | 'es' | 'de' | 'ar' | 'zh' | 'sw';

const WHATSAPP_NUMBER = '254101923355';
const WHATSAPP_MESSAGE = 'Hello Bahari Asili, I need more information about a safari.';

const labels: Record<SupportedLocale, string> = {
  en: 'Chat on WhatsApp',
  it: 'Chatta su WhatsApp',
  fr: 'Discuter sur WhatsApp',
  es: 'Chatear por WhatsApp',
  de: 'Auf WhatsApp chatten',
  ar: 'تواصل معنا عبر واتساب',
  zh: '通过 WhatsApp 联系我们',
  sw: 'Zungumza nasi WhatsApp',
};

const localeSet = new Set<SupportedLocale>(Object.keys(labels) as SupportedLocale[]);

export default function WhatsAppButton() {
  const { locale } = useLanguage();
  const activeLocale: SupportedLocale = localeSet.has(locale as SupportedLocale)
    ? (locale as SupportedLocale)
    : 'en';
  const label = labels[activeLocale];
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="fixed bottom-5 left-5 z-[9999] flex items-end justify-start pointer-events-none">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        title={label}
        className="group pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl ring-2 ring-white transition-all duration-200 hover:scale-110 hover:brightness-95 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 sm:h-16 sm:w-16"
      >
        <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.2} aria-hidden="true" />
        <span className="pointer-events-none absolute left-[calc(100%+0.75rem)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-xl opacity-0 -translate-x-2 transition-all duration-200 group-hover:block group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:block group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
          {label}
        </span>
      </a>
    </div>
  );
}
