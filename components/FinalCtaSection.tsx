'use client';

import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const WHATSAPP_NUMBER = '254101923355';

const whatsappMessages: Record<string, string> = {
  en: "Hello Bahari Asili, I'd like to plan a safari!",
  it: 'Ciao Bahari Asili, vorrei pianificare un safari!',
  fr: 'Bonjour Bahari Asili, je voudrais planifier un safari !',
  es: 'Hola Bahari Asili, me gustaría planificar un safari.',
  de: 'Hallo Bahari Asili, ich möchte eine Safari planen!',
  ar: 'مرحباً بحاري أصيلي، أود التخطيط لرحلة سفاري!',
  zh: '您好 Bahari Asili，我想计划一次野生动物之旅！',
  sw: 'Habari Bahari Asili, ningependa kupanga safari!',
};

export default function FinalCtaSection({ onBook }: { onBook: () => void }) {
  const { t, locale } = useLanguage();
  const e = t.homeExtras;
  const message = encodeURIComponent(whatsappMessages[locale]);
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <section className="relative overflow-hidden py-20 lg:py-24 bg-gradient-to-br from-ocean-800 via-ocean-700 to-ocean-600">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_55%)] pointer-events-none" />
      <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-safari-400/10 blur-3xl pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl px-6 py-12 sm:px-10 sm:py-14">
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4 drop-shadow-[0_3px_8px_rgba(0,0,0,0.35)]">{e.finalTitle}</h2>
          <p className="font-inter text-white text-base sm:text-lg leading-relaxed mb-9 max-w-xl mx-auto drop-shadow-[0_2px_5px_rgba(0,0,0,0.35)]">{e.finalSubtitle}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={onBook} className="inline-flex items-center gap-2 bg-safari-500 hover:bg-safari-600 text-white font-poppins font-semibold text-sm px-7 py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto justify-center">
              {e.finalCta1}<ArrowRight className="w-4 h-4" />
            </button>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/35 text-white font-poppins font-semibold text-sm px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 w-full sm:w-auto justify-center">
              {e.finalCta2}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
