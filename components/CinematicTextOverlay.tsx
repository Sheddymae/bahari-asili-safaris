'use client';

import { MessageCircle, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
import { trackConversion } from '@/components/Analytics';
import { whatsappHref } from '@/lib/contact-info';
import { useHomeCopy } from '@/components/home/useHomeCopy';

export default function CinematicTextOverlay({ onPlan }: { onPlan: () => void }) {
  const { c } = useHomeCopy();

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 pb-44 pt-24 text-center sm:px-6 sm:pb-48 lg:pb-44">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-black/30 px-4 py-2 font-inter text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-sm backdrop-blur-md sm:text-xs">
          <span className="h-2 w-2 rounded-full bg-[var(--brand-secondary)]" aria-hidden="true" />
          {c.hero.kicker}
        </p>
        <h1 className="mx-auto mt-5 max-w-4xl font-poppins text-white drop-shadow-xl sm:mt-6" style={{ fontSize: 'clamp(2.25rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.04em' }}>
          {c.hero.title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl font-inter text-sm leading-6 text-white drop-shadow-md sm:mt-6 sm:text-base sm:leading-7 lg:text-lg">
          {c.hero.subtitle}
        </p>
        <div className="mx-auto mt-7 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:items-center">
          <button type="button" onClick={() => { trackConversion('booking_started', { location: 'hero' }); onPlan(); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--brand-secondary)] px-7 py-3.5 font-poppins text-sm font-bold text-[var(--brand-text)] shadow-lg transition-colors hover:bg-[var(--brand-secondary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            {c.hero.plan}<ArrowDownRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <a href={whatsappHref(c.whatsappMessage)} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion('whatsapp_clicked', { location: 'hero' })} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/75 bg-black/25 px-7 py-3.5 font-poppins text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[var(--brand-primary-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />{c.hero.whatsapp}
          </a>
        </div>
        <p className="mx-auto mt-3 max-w-2xl font-inter text-[10px] font-semibold uppercase leading-5 tracking-[0.12em] text-white/90 drop-shadow-md sm:text-xs">{c.hero.destinations}</p>
      </div>
    </div>
  );
}
