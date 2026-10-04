'use client';

import { MessageCircle } from 'lucide-react';
import { trackConversion } from '@/components/Analytics';
import { whatsappHref } from '@/lib/contact-info';
import { useHomeCopy } from '@/components/home/useHomeCopy';

export default function CinematicTextOverlay({ onPlan }: { onPlan: () => void }) {
  const { c } = useHomeCopy();
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-start justify-center px-6 pb-28 pt-28 text-left sm:px-10 lg:px-16 sm:pb-44 lg:max-w-3xl">
      <p className="font-inter text-xs font-bold uppercase tracking-[0.22em] text-white/90 drop-shadow-md sm:text-sm">{c.hero.kicker}</p>
      <h1 className="mt-4 max-w-4xl font-poppins font-extrabold leading-[1.08] text-white drop-shadow-xl" style={{ fontSize: 'clamp(2.25rem, 6.2vw, 4.75rem)', letterSpacing: '-0.03em' }}>{c.hero.title}</h1>
      <p className="mt-5 max-w-2xl font-inter text-base leading-7 text-white/95 drop-shadow-md sm:text-lg">{c.hero.subtitle}</p>
      <div className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row">
        <button type="button" onClick={()=>{ trackConversion('booking_started',{location:'hero'}); onPlan(); }} className="brand-button brand-button-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 hover:bg-book-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">{c.hero.plan}</button>
        <a href={whatsappHref(c.whatsappMessage)} target="_blank" rel="noopener noreferrer" onClick={() => trackConversion('whatsapp_clicked', { location: 'hero' })} className="inline-flex items-center justify-center gap-2 brand-button brand-button-secondary border-white/80 px-7 py-3.5 font-poppins text-base text-white hover:bg-white hover:text-ocean-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          <MessageCircle className="h-5 w-5" aria-hidden="true" />{c.hero.whatsapp}
        </a>
      </div>
      <div className="mt-6 flex flex-wrap gap-2" aria-label="Destinations">
        {c.hero.destinations.split(' · ').map((destination) => (
          <span key={destination} className="inline-flex h-7 items-center rounded-pill bg-white/15 px-3 text-[13px] font-medium text-white backdrop-blur-sm">{destination}</span>
        ))}
      </div>
    </div>
  );
}
