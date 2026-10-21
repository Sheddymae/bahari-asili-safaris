'use client';

import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackConversion } from '@/components/Analytics';
import { getHomeLanding } from '@/lib/home-landing-i18n';
import { PHONE_TEL, whatsappHref } from '@/lib/contact-info';

export default function FinalCtaSection({ onBook }: { onBook: () => void }) {
  const { locale } = useLanguage();
  const e = getHomeLanding(locale);
  return (
    <section className="bg-ocean-800 py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-3xl text-balance font-poppins text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">{e.final.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl font-inter text-base leading-7 text-white/90">{e.final.based}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
          <button onClick={onBook} className="inline-flex min-h-12 items-center justify-center gap-2 bg-safari-500 px-6 py-3.5 font-poppins text-sm font-semibold text-white transition-colors hover:bg-safari-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-800 sm:px-7">
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />{e.final.plan}
          </button>
          <a href={whatsappHref(e.whatsappMessage)} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion('whatsapp_clicked', { location: 'final_cta' })} className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/50 px-6 py-3.5 font-poppins text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-800 sm:px-7">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />{e.final.whatsapp}
          </a>
          <a href={`tel:${PHONE_TEL}`} onClick={() => trackConversion('phone_clicked', { location: 'final_cta' })} className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/50 px-6 py-3.5 font-poppins text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-800 sm:px-7">
            <Phone className="h-4 w-4" aria-hidden="true" />{e.final.call}
          </a>
        </div>
      </div>
    </section>
  );
}
