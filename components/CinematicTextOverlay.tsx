'use client';

import { MessageCircle, ArrowDown } from 'lucide-react';
import { trackConversion } from '@/components/Analytics';
import { whatsappHref } from '@/lib/contact-info';
import { useHomeCopy } from '@/components/home/useHomeCopy';

export default function CinematicTextOverlay({ onPlan }: { onPlan: () => void }) {
  const { c } = useHomeCopy();

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5 pb-28 pt-28 text-center sm:pb-48 lg:px-8">
      <div className="mb-5 flex items-center gap-3 text-[10px] font-mono font-medium uppercase tracking-[0.34em] text-white/75 sm:text-xs">
        <span className="h-px w-8 bg-coral/80 sm:w-12" aria-hidden="true" />
        <span>{c.hero.kicker}</span>
        <span className="h-px w-8 bg-coral/80 sm:w-12" aria-hidden="true" />
      </div>

      <h1
        className="max-w-5xl font-editorial font-medium leading-[.9] text-white drop-shadow-[0_10px_35px_rgba(0,0,0,.35)]"
        style={{ fontSize: 'clamp(3.35rem, 9vw, 8.2rem)', letterSpacing: '-0.045em' }}
      >
        {c.hero.title}
      </h1>

      <p className="mt-6 max-w-xl font-grotesk text-sm leading-6 text-white/85 drop-shadow-md sm:text-base sm:leading-7 lg:text-lg">
        {c.hero.subtitle}
      </p>

      <div className="mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row">
        <button
          type="button"
          onClick={() => { trackConversion('booking_started', { location: 'hero' }); onPlan(); }}
          className="group inline-flex min-h-12 items-center justify-center gap-3 border border-coral bg-coral px-8 py-3.5 font-grotesk text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_35px_rgba(0,0,0,.2)] transition-all duration-300 hover:bg-coral/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-deep"
        >
          {c.hero.plan}
          <span aria-hidden="true">→</span>
        </button>

        <a
          href={whatsappHref(c.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackConversion('whatsapp_clicked', { location: 'hero' })}
          className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/60 bg-black/10 px-8 py-3.5 font-grotesk text-sm font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-ocean-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          {c.hero.whatsapp}
        </a>
      </div>

      <p className="mt-6 max-w-2xl font-mono text-[9px] uppercase tracking-[0.24em] text-white/65 sm:text-[10px]">
        {c.hero.destinations}
      </p>

      <div className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-white/55 lg:flex">
        <span>Explore Kenya</span>
        <ArrowDown className="h-3.5 w-3.5 animate-bounce" aria-hidden="true" />
      </div>
    </div>
  );
}
