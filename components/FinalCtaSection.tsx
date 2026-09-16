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
    <section className="py-20 lg:py-24 bg-ocean-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">{e.finalTitle}</h2>
        <p className="font-inter text-white/85 text-base sm:text-lg mb-9 max-w-xl mx-auto">{e.finalSubtitle}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onBook} className="inline-flex items-center gap-2 bg-safari-500 hover:bg-safari-600 text-white font-poppins font-semibold text-sm px-7 py-3.5 rounded-xl transition-all hover:shadow-lg w-full sm:w-auto justify-center">
            {e.finalCta1}<ArrowRight className="w-4 h-4" />
          </button>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-poppins font-semibold text-sm px-7 py-3.5 rounded-xl transition-all w-full sm:w-auto justify-center">
            {e.finalCta2}
          </a>
        </div>
      </div>
    </section>
  );
}
