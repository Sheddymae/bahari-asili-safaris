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
    <section aria-labelledby="final-cta-title" className="bg-ocean-deep py-20 text-paper sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="border-t border-white/15 pt-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="editorial-label text-orange-300">{e.final.based}</p>
            <span className="h-px w-10 bg-white/20" aria-hidden="true" />
            <p className="font-mono-editorial text-[9px] uppercase tracking-[0.16em] text-white/45">Watamu / Kenya / Indian Ocean</p>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-24 lg:items-end">
            <div>
              <h2 id="final-cta-title" className="max-w-5xl font-editorial text-5xl leading-[0.9] tracking-tight sm:text-6xl lg:text-8xl">
                {e.final.title}
              </h2>
              <p className="mt-7 max-w-xl border-l border-orange-300/60 pl-5 font-grotesk text-sm leading-6 text-white/65">
                {e.final.plan}
              </p>
            </div>

            <div className="border-t border-white/15">
              <button
                type="button"
                onClick={onBook}
                className="group flex w-full items-center justify-between border-b border-white/15 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-deep"
              >
                <span className="flex items-center gap-3 font-mono-editorial text-[10px] uppercase tracking-[0.16em] text-white">
                  <span className="flex h-7 w-7 items-center justify-center border border-orange-300/60 text-orange-300">
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  {e.final.plan}
                </span>
                <span className="font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-white/40">01</span>
              </button>

              <a
                href={whatsappHref(e.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackConversion('whatsapp_clicked', { location: 'final_cta' })}
                className="flex w-full items-center justify-between border-b border-white/15 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-deep"
              >
                <span className="flex items-center gap-3 font-mono-editorial text-[10px] uppercase tracking-[0.16em] text-white/80">
                  <MessageCircle className="h-4 w-4 text-orange-300" aria-hidden="true" />
                  {e.final.whatsapp}
                </span>
                <span className="font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-white/40">02</span>
              </a>

              <a
                href={'tel:' + PHONE_TEL}
                onClick={() => trackConversion('phone_clicked', { location: 'final_cta' })}
                className="flex w-full items-center justify-between border-b border-white/15 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-deep"
              >
                <span className="flex items-center gap-3 font-mono-editorial text-[10px] uppercase tracking-[0.16em] text-white/80">
                  <Phone className="h-4 w-4 text-orange-300" aria-hidden="true" />
                  {e.final.call}
                </span>
                <span className="font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-white/40">03</span>
              </a>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
            <p className="font-mono-editorial text-[9px] uppercase tracking-[0.16em] text-white/40">Private journeys / Coast &amp; bush / Kenya</p>
            <p className="font-mono-editorial text-[9px] uppercase tracking-[0.16em] text-white/40">Bahari Asili Safaris</p>
          </div>
        </div>
      </div>
    </section>
  );
}