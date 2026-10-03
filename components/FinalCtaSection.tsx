'use client';

import { ArrowUpRight, MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackConversion } from '@/components/Analytics';
import { getHomeLanding } from '@/lib/home-landing-i18n';
import { PHONE_TEL, whatsappHref } from '@/lib/contact-info';

export default function FinalCtaSection({ onBook }: { onBook: () => void }) {
  const { locale } = useLanguage();
  const e = getHomeLanding(locale);
  return (
    <section className="bg-ocean-deep py-20 text-white sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="border-t border-white/20 pt-5">
          <p className="editorial-label text-orange-300">{e.final.based}</p>
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <h2 className="max-w-5xl font-editorial text-5xl leading-[0.92] tracking-tight sm:text-6xl lg:text-8xl">{e.final.title}</h2>
            <div className="flex flex-col items-start gap-5">
              <button onClick={onBook} className="inline-flex items-center gap-3 border-b border-white/60 pb-2 font-mono-editorial text-[10px] uppercase tracking-[0.16em] text-white hover:border-orange-300 hover:text-orange-300">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />{e.final.plan}
              </button>
              <a href={whatsappHref(e.whatsappMessage)} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion('whatsapp_clicked', { location: 'final_cta' })} className="inline-flex items-center gap-3 font-mono-editorial text-[10px] uppercase tracking-[0.16em] text-white/80 hover:text-orange-300">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />{e.final.whatsapp}
              </a>
              <a href={'tel:' + PHONE_TEL} onClick={() => trackConversion('phone_clicked', { location: 'final_cta' })} className="inline-flex items-center gap-3 font-mono-editorial text-[10px] uppercase tracking-[0.16em] text-white/80 hover:text-orange-300">
                <Phone className="h-4 w-4" aria-hidden="true" />{e.final.call}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
