'use client';

import Link from 'next/link';
import { ArrowRight, Backpack, CalendarDays, CreditCard, ChevronLeft, ChevronRight, FileCheck2, HeartPulse, MapPinned } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { useLanguage } from '@/contexts/LanguageContext';
import { travelerEssentialsTranslations } from '@/lib/traveler-essentials-i18n';
import { prefersReducedMotion } from '@/lib/video-config';

const ESSENTIAL_ICONS = [FileCheck2, CalendarDays, Backpack, CreditCard, HeartPulse, MapPinned];

export default function TravelerEssentials() {
  const { locale, isRTL } = useLanguage();
  const content = travelerEssentialsTranslations[locale] ?? travelerEssentialsTranslations.en;
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cardDistance, setCardDistance] = useState(285);
  const pointerStartX = useRef<number | null>(null);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    const updateDistance = () => {
      setCardDistance(window.innerWidth < 640 ? 170 : window.innerWidth < 1024 ? 235 : 285);
    };
    updateDistance();
    window.addEventListener('resize', updateDistance, { passive: true });
    return () => window.removeEventListener('resize', updateDistance);
  }, []);

  useEffect(() => {
    if (reducedMotion || paused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % content.items.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [content.items.length, paused, reducedMotion]);

  const goTo = (direction: 1 | -1) => {
    setActiveIndex((current) => (current + direction + content.items.length) % content.items.length);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(distance) > 50) goTo(distance < 0 ? 1 : -1);
  };

  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    const count = content.items.length;
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;
    return offset;
  };

  return (
    <section
      key={locale}
      lang={locale}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="traveler-essentials relative overflow-hidden border-y border-sand-200 bg-white py-14 sm:py-18 lg:py-20"
      aria-labelledby="traveler-essentials-title"
      data-traveler-locale={locale}
    >
      <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-safari-100/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-ocean-100/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-14">
            <span className="mb-3 block font-inter text-xs font-semibold uppercase tracking-widest text-safari-500">{content.label}</span>
            <h2 id="traveler-essentials-title" className="font-poppins text-3xl font-extrabold leading-tight text-foreground sm:text-5xl lg:text-6xl">{content.title}</h2>
            <p className="mx-auto mt-4 max-w-3xl font-inter text-base leading-7 text-foreground/70 sm:text-lg">{content.subtitle}</p>
          </div>
        </AnimateOnScroll>

        <div
          className="relative mx-auto h-[350px] max-w-6xl select-none touch-pan-y overflow-visible sm:h-[370px] lg:h-[390px]"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { pointerStartX.current = null; }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          aria-label={content.title}
        >
          {content.items.map(({ title, text, href }, index) => {
            const Icon = ESSENTIAL_ICONS[index] ?? MapPinned;
            const offset = getOffset(index);
            const isActive = offset === 0;
            const direction = isRTL ? -1 : 1;
            const absOffset = Math.abs(offset);

            return (
              <article
                key={`${locale}-${index}-${title}`}
                className={`absolute left-1/2 top-1/2 w-[82vw] max-w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-[1px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? 'z-30' : 'z-20'}`}
                style={{
                  transform: `translate(calc(-50% + ${direction * offset * cardDistance}px), -50%) scale(${isActive ? 1 : 0.84})`,
                  opacity: absOffset > 1 ? 0 : isActive ? 1 : 0.68,
                  filter: isActive ? 'none' : 'saturate(0.82)',
                  pointerEvents: absOffset > 1 ? 'none' : 'auto',
                }}
              >
                <div className={`h-full min-h-[310px] rounded-2xl border bg-white p-6 shadow-xl transition-all duration-700 sm:min-h-[325px] ${isActive ? 'border-safari-300 shadow-[0_20px_60px_rgba(14,116,144,0.18)]' : 'border-sand-200 shadow-card'}`}>
                  <Link
                    href={href}
                    aria-label={title}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => setActiveIndex(index)}
                    className="block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-safari-400 focus-visible:ring-offset-4"
                  >
                    <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 ${isActive ? 'bg-safari-500 text-white shadow-[0_0_28px_rgba(249,115,22,0.42)]' : 'bg-safari-50 text-safari-500'}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-poppins text-lg font-bold leading-snug text-foreground sm:text-xl">{title}</h3>
                    <p className="font-inter text-sm leading-6 text-foreground/75 sm:text-base">{text}</p>
                    <div className={`mt-5 h-1 rounded-full transition-all duration-700 ${isActive ? 'w-20 bg-safari-500' : 'w-10 bg-sand-200'}`} />
                    <span className="mt-5 inline-flex items-center gap-2 font-inter text-sm font-semibold text-ocean-700 transition-all duration-300 hover:gap-3 hover:text-ocean-800">
                      {content.learnMore}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-1 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goTo(-1)}
            aria-label="Previous travel tip"
            className="group flex h-12 w-12 items-center justify-center rounded-full border border-sand-200 bg-white text-foreground shadow-sm transition-all duration-300 hover:border-safari-300 hover:bg-safari-50 hover:text-safari-600 hover:shadow-[0_0_24px_rgba(249,115,22,0.25)] focus:outline-none focus:ring-2 focus:ring-safari-400"
          >
            <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </button>

          <div className="flex items-center gap-1.5" aria-label="Travel tips position">
            {content.items.map((item, index) => (
              <button
                key={`${locale}-dot-${index}`}
                type="button"
                aria-label={`Go to ${item.title}`}
                aria-current={activeIndex === index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-500 ${activeIndex === index ? 'w-7 bg-safari-500 shadow-[0_0_12px_rgba(249,115,22,0.45)]' : 'w-2 bg-sand-300 hover:bg-safari-300'}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="Next travel tip"
            className="group flex h-12 w-12 items-center justify-center rounded-full border border-sand-200 bg-white text-foreground shadow-sm transition-all duration-300 hover:border-safari-300 hover:bg-safari-50 hover:shadow-[0_0_24px_rgba(249,115,22,0.25)] focus:outline-none focus:ring-2 focus:ring-safari-400"
          >
            <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
