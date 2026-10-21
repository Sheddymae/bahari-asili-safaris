'use client';

import { MessageCircle, ArrowDownRight } from 'lucide-react';
import { trackConversion } from '@/components/Analytics';
import { whatsappHref } from '@/lib/contact-info';
import { useHomeCopy } from '@/components/home/useHomeCopy';

export default function CinematicTextOverlay({ onPlan }: { onPlan: () => void }) {
  const { c } = useHomeCopy();
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5 pb-10 pt-24 text-center sm:items-start sm:px-8 sm:pb-36 sm:pt-28 lg:px-12 xl:px-16">
      <div className="w-full max-w-5xl">
        <p className="inline-flex items-center gap-2 border-l-2 border-[var(--brand-secondary)] bg-black/25 px-3 py-2 font-inter text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm sm:text-xs">
          {c.hero.kicker}
        </p>
        <h1 className="mt-5 max-w-4xl font-poppins font-extrabold leading-[1.04] text-white drop-shadow-xl sm:mt-6" style={{ fontSize: 'clamp(2.4rem, 6.4vw, 5.1rem)', letterSpacing: '-0.04em' }}>
          {c.hero.title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl font-inter text-base leading-7 text-white drop-shadow-md sm:mx-0 sm:mt-6 sm:text-lg sm:leading-8">
          {c.hero.subtitle}
        </p>
        <div className="mx-auto mt-7 flex w-full max-w-md flex-col items-stretch gap-3 sm:mx-0 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap">
          <button type="button" onClick={() => { trackConversion('booking_started', { location: 'hero' }); onPlan(); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--brand-secondary)] px-7 py-3.5 font-poppins text-sm font-bold text-white shadow-lg transition-colors hover:bg-[var(--brand-secondary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            {c.hero.plan}<ArrowDownRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <a href={whatsappHref(c.whatsappMessage)} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion('whatsapp_clicked', { location: 'hero' })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/75 bg-black/20 px-7 py-3.5 font-poppins text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[var(--brand-primary-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />{c.hero.whatsapp}
          </a>
        </div>
        <p className="mx-auto mt-6 max-w-2xl font-inter text-xs font-semibold uppercase leading-6 tracking-[0.12em] text-white/90 drop-shadow-md sm:mx-0 sm:mt-7 sm:text-sm">{c.hero.destinations}</p>
      </div>
    </div>
  );
}
