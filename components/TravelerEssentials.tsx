'use client';

import Link from 'next/link';
import { ArrowRight, Backpack, CalendarDays, CreditCard, FileCheck2, HeartPulse, MapPinned } from 'lucide-react';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { useLanguage } from '@/contexts/LanguageContext';

const ESSENTIALS = [
  { icon: FileCheck2, title: 'Entry & documents', text: 'Keep your passport, visa or entry authorization, travel insurance and booking documents together. Check official requirements before departure.', href: '/contact' },
  { icon: CalendarDays, title: 'When to travel', text: 'Plan around the experiences you want: wildlife, migration, beach time, culture or a combination of safari and coast.', href: '/destinations' },
  { icon: Backpack, title: 'What to pack', text: 'Light layers, comfortable shoes, sun protection, a reusable water bottle and essentials for changing safari and coastal conditions.', href: '/tours' },
  { icon: CreditCard, title: 'Money & payments', text: 'Carry a practical payment option and a small amount of local currency. Confirm accepted payment methods before travelling.', href: '/contact' },
  { icon: HeartPulse, title: 'Health & comfort', text: 'Review current travel-health guidance, prescriptions and personal needs well before your journey.', href: '/contact' },
  { icon: MapPinned, title: 'Plan your route', text: 'Combine parks, experiences and the coast into one route with realistic travel times between destinations.', href: '/build-your-safari' },
];

export default function TravelerEssentials() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden border-y border-sand-200 bg-white py-14 sm:py-16 lg:py-20" aria-labelledby="traveler-essentials-title">
      <div className="pointer-events-none absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-ocean-100/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-safari-100/40 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <div className="mx-auto mb-9 max-w-3xl text-center sm:mb-10">
            <span className="mb-3 inline-block font-inter text-xs font-bold uppercase tracking-[0.2em] text-safari-500">Travel Smart</span>
            <h2 id="traveler-essentials-title" className="font-poppins text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">Everything you need before you travel</h2>
            <p className="mt-3 font-inter text-sm leading-6 text-foreground/70 sm:text-base sm:leading-7">A quick planning guide for a smoother Kenya journey. Always confirm current entry, health and payment requirements before departure.</p>
          </div>
        </AnimateOnScroll>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ESSENTIALS.map(({ icon: Icon, title, text, href }, index) => (
            <AnimateOnScroll key={title} direction="up" delay={index * 50}>
              <Link href={href} className="group flex h-full min-h-[180px] flex-col rounded-2xl border border-sand-200 bg-sand-50/60 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-safari-300 hover:bg-white hover:shadow-[0_18px_45px_rgba(14,116,144,0.12)] focus:outline-none focus:ring-2 focus:ring-safari-400 focus:ring-offset-2 sm:p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-safari-500 shadow-sm transition-all duration-300 group-hover:bg-safari-500 group-hover:text-white group-hover:shadow-[0_0_22px_rgba(249,115,22,0.35)]"><Icon className="h-5.5 w-5.5" /></div>
                <h3 className="font-poppins text-base font-bold text-foreground sm:text-lg">{title}</h3>
                <p className="mt-2 flex-1 font-inter text-sm leading-6 text-foreground/70">{text}</p>
                <span className="mt-3 inline-flex items-center gap-1 font-inter text-xs font-bold text-ocean-700 transition-all duration-300 group-hover:gap-2">{t.homeExtras?.learnMore || 'Learn more'} <ArrowRight className="h-3.5 w-3.5" /></span>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
