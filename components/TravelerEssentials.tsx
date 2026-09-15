'use client';

import Link from 'next/link';
import { ArrowRight, Backpack, CalendarDays, CreditCard, FileCheck2, HeartPulse, MapPinned } from 'lucide-react';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { useLanguage } from '@/contexts/LanguageContext';
import { travelerEssentialsTranslations } from '@/lib/traveler-essentials-i18n';

const ESSENTIAL_ICONS = [FileCheck2, CalendarDays, Backpack, CreditCard, HeartPulse, MapPinned];

export default function TravelerEssentials() {
  const { locale, isRTL } = useLanguage();
  const content = travelerEssentialsTranslations[locale] ?? travelerEssentialsTranslations.en;

  return (
    <section
      key={locale}
      lang={locale}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="traveler-essentials relative overflow-hidden border-y border-sand-200 bg-white py-12 sm:py-16 lg:py-20"
      aria-labelledby="traveler-essentials-title"
      data-traveler-locale={locale}
    >
      <div className="pointer-events-none absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-ocean-100/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-safari-100/40 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-10">
            <span className="mb-2 inline-block font-inter text-xs font-bold uppercase tracking-[0.2em] text-safari-500">{content.label}</span>
            <h2 id="traveler-essentials-title" className="font-poppins text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">{content.title}</h2>
            <p className="mt-3 font-inter text-sm leading-6 text-foreground/70 sm:text-base sm:leading-7">{content.subtitle}</p>
          </div>
        </AnimateOnScroll>

        <div key={`traveler-grid-${locale}`} className="traveler-essentials-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map(({ title, text, href }, index) => {
            const Icon = ESSENTIAL_ICONS[index] ?? MapPinned;
            return (
              <AnimateOnScroll key={`${locale}-${index}-${title}`} direction="up" delay={index * 45}>
                <Link
                  href={href}
                  className="traveler-essential-card group flex h-full min-h-[170px] flex-col rounded-2xl border border-sand-200 bg-sand-50/70 p-5 shadow-sm focus:outline-none focus:ring-2 focus:ring-safari-400 focus:ring-offset-2 sm:p-6"
                >
                  <div className="mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-safari-500 shadow-sm sm:mb-4 sm:h-11 sm:w-11">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-poppins text-base font-bold leading-snug text-foreground sm:text-lg">{title}</h3>
                  <p className="traveler-essential-description mt-2 flex-1 font-inter text-sm leading-6 text-foreground/70">{text}</p>
                  <span className="mt-3 inline-flex items-center gap-1 font-inter text-xs font-bold text-ocean-700">
                    {content.learnMore} <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
