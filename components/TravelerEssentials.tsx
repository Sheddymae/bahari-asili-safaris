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
      className="traveler-essentials relative overflow-hidden border-y border-line bg-paper py-16 sm:py-20 lg:py-24"
      aria-labelledby="traveler-essentials-title"
      data-traveler-locale={locale}
    >
      <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-sand/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-ocean/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <div className="mb-10 max-w-3xl border-b border-line pb-7 lg:mb-14">
            <span className="editorial-label text-orange">{content.label}</span>
            <h2 id="traveler-essentials-title" className="mt-4 max-w-2xl font-editorial text-5xl leading-[0.92] tracking-tight text-ink sm:text-6xl lg:text-7xl">{content.title}</h2>
            <p className="mt-5 max-w-2xl font-grotesk text-sm leading-6 text-ink-soft sm:text-base">{content.subtitle}</p>
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
                className={`absolute left-1/2 top-1/2 w-[82vw] max-w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-none p-[1px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? 'z-30' : 'z-20'}`}
                style={{
                  transform: `translate(calc(-50% + ${direction * offset * cardDistance}px), -50%) scale(${isActive ? 1 : 0.84})`,
                  opacity: absOffset > 1 ? 0 : isActive ? 1 : 0.68,
                  filter: isActive ? 'none' : 'saturate(0.82)',
                  pointerEvents: absOffset > 1 ? 'none' : 'auto',
                }}
              >
                <div className={`h-full min-h-[310px] rounded-none border bg-paper p-6 shadow-none transition-all duration-700 sm:min-h-[325px] ${isActive ? 'border-ocean shadow-[0_20px_60px_rgba(14,116,144,0.18)]' : 'border-line shadow-none'}`}>
                  <Link
                    href={href}
                    aria-label={title}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => setActiveIndex(index)}
                    className="block h-full rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4"
                  >
                    <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-none transition-all duration-500 ${isActive ? 'bg-orange text-white shadow-[0_0_28px_rgba(249,115,22,0.42)]' : 'bg-sand text-orange'}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-editorial text-lg font-bold leading-snug text-foreground sm:text-xl">{title}</h3>
                    <p className="font-grotesk text-sm leading-6 text-foreground/75 sm:text-base">{text}</p>
                    <div className={`mt-5 h-1 rounded-full transition-all duration-700 ${isActive ? 'w-20 bg-orange' : 'w-10 bg-sand-200'}`} />
                    <span className="mt-5 inline-flex items-center gap-2 font-grotesk text-sm font-semibold text-ocean transition-all duration-300 hover:gap-3 hover:text-ocean">
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
            className="group flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-foreground shadow-sm transition-all duration-300 hover:border-ocean hover:bg-sand hover:text-orange hover:shadow-[0_0_24px_rgba(249,115,22,0.25)] focus:outline-none focus:ring-2 focus:ring-orange"
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
                className={`h-2 rounded-full transition-all duration-500 ${activeIndex === index ? 'w-7 bg-orange shadow-[0_0_12px_rgba(249,115,22,0.45)]' : 'w-2 bg-line hover:bg-orange'}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="Next travel tip"
            className="group flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-foreground shadow-sm transition-all duration-300 hover:border-ocean hover:bg-sand hover:shadow-[0_0_24px_rgba(249,115,22,0.25)] focus:outline-none focus:ring-2 focus:ring-orange"
          >
            <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
