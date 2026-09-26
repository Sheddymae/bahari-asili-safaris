'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Plane, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ScrollReveal from '@/components/ScrollReveal';

type RevealItem = {
  id: string;
  kind: 'airport' | 'info';
  code?: string;
  title: string;
  description: string;
};

interface StickyRevealInfoCardProps {
  onBook?: (transferType: string) => void;
}

export default function StickyRevealInfoCard({ onBook }: StickyRevealInfoCardProps) {
  const { t, locale } = useLanguage();
  const reducedMotion = useReducedMotion();
  const tr = t.transfers;
  const wildlife = t.wildlifeCalendar;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [started, setStarted] = useState(false);

  const items = useMemo<RevealItem[]>(() => {
    const airports = (tr.airports || []).slice(0, 3);
    const airportItems: RevealItem[] = airports.map((airport: { code: string; name: string; desc: string }) => ({
      id: airport.code,
      kind: 'airport',
      code: airport.code,
      title: airport.name,
      description: airport.desc,
    }));

    const currentMonth = new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date());

    return [
      ...airportItems,
      {
        id: 'peak',
        kind: 'info',
        title: wildlife?.legendPeak || 'Peak viewing window',
        description: wildlife?.footnote || 'Highlighted months offer the best sighting chance. Nature can never be 100% guaranteed.',
      },
      {
        id: 'off-peak',
        kind: 'info',
        title: wildlife?.legendOff || 'Off-peak',
        description: wildlife?.subtitle || 'Wildlife follows nature’s rhythm, not a strict schedule.',
      },
      {
        id: 'current-month',
        kind: 'info',
        title: wildlife?.currentMonth || 'Current month',
        description: currentMonth,
      },
    ];
  }, [locale, tr.airports, wildlife?.footnote, wildlife?.legendOff, wildlife?.legendPeak, wildlife?.subtitle, wildlife?.currentMonth]);

  const activeItem = items[activeIndex] ?? items[0];
  const airportItems = items.filter((item) => item.kind === 'airport');

  useEffect(() => {
    const startTimer = window.setTimeout(() => setStarted(true), 2000);
    return () => window.clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!started || isPaused || reducedMotion || items.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [items.length, isPaused, reducedMotion, started]);

  const selectItem = (index: number) => {
    setActiveIndex(index);
    setStarted(true);
  };

  return (
    <aside className="sticky top-[76px] z-20 w-full lg:top-24 lg:z-10">
      <ScrollReveal direction="right" distance={24}>
        <div
          className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:p-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#FF7A00]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-[#0E7482]/10 blur-3xl" />

          <div className="relative">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#0E7482]/10 bg-[#0E7482]/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0E7482]">
                  <Sparkles className="h-3.5 w-3.5" />
                  {tr.label || 'Transfers & Services'}
                </div>
                <h3 className="font-poppins text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Seamless Transfers
                </h3>
              </div>
              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FF7A00]/10 text-[#FF7A00] sm:flex">
                <Plane className="h-5 w-5" />
              </div>
            </div>

            <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide" aria-label="Airport transfer options">
              {airportItems.map((item, index) => {
                const active = activeItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectItem(index)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E7482]/40 ${
                      active
                        ? 'border-[#0E7482] bg-[#0E7482] text-white shadow-md shadow-[#0E7482]/20'
                        : 'border-slate-200 bg-white/70 text-[#0E7482] hover:border-[#0E7482]/30 hover:bg-white'
                    }`}
                  >
                    <Plane className={`h-3.5 w-3.5 ${active ? 'text-white' : 'text-[#FF7A00]'}`} />
                    {item.code}
                  </button>
                );
              })}
            </div>

            <div className="relative min-h-[198px] overflow-hidden rounded-[1.5rem] border border-slate-100 bg-gradient-to-br from-white via-white to-slate-50/80 p-5 sm:min-h-[208px] sm:p-6">
              <AnimatePresence mode="wait" initial={false}>
                {activeItem && (
                  <motion.div
                    key={activeItem.id}
                    initial={reducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="flex min-h-[156px] flex-col justify-between"
                  >
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        {activeItem.kind === 'airport' ? (
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF7A00]/10 text-[#FF7A00]">
                            <Plane className="h-4 w-4" />
                          </span>
                        ) : (
                          <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${
                            activeItem.id === 'peak'
                              ? 'bg-[#FF7A00]/10 text-[#FF7A00]'
                              : activeItem.id === 'off-peak'
                                ? 'bg-slate-100 text-slate-500'
                                : 'bg-[#FF7A00]/10 text-[#FF7A00]'
                          }`}>
                            <span className={activeItem.id === 'current-month' ? 'relative flex h-2.5 w-2.5' : 'h-2.5 w-5 rounded-full bg-current'}>
                              {activeItem.id === 'current-month' && <span className="absolute inset-0 animate-ping rounded-full bg-[#FF7A00]/50" />}
                              {activeItem.id === 'current-month' && <span className="relative h-2.5 w-2.5 rounded-full bg-[#FF7A00]" />}
                            </span>
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                          {activeItem.kind === 'airport' ? 'Airport transfer' : 'Safari insight'}
                        </span>
                      </div>

                      <h4 className="font-poppins text-lg font-bold leading-tight text-slate-900 sm:text-xl">
                        {activeItem.kind === 'airport' && activeItem.code ? (
                          <>{activeItem.code} · {activeItem.title}</>
                        ) : activeItem.title}
                      </h4>

                      <p className="mt-3 font-inter text-sm leading-6 text-slate-500">
                        {activeItem.kind === 'current-month'
                          ? `${activeItem.description} is the current month — explore the wildlife calendar for the best seasonal windows.`
                          : activeItem.description}
                      </p>
                    </div>

                    {activeItem.kind === 'airport' && onBook ? (
                      <button
                        type="button"
                        onClick={() => onBook(`Airport Transfer – ${activeItem.code}`)}
                        className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#0E7482] transition-colors hover:text-[#095a66]"
                      >
                        Request this transfer
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    ) : (
                      <Link
                        href="/transfers"
                        className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#0E7482] transition-colors hover:text-[#095a66]"
                      >
                        Explore transfers
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-white/70 p-3.5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                  <span className="h-2.5 w-5 rounded-full bg-[#FF7A00]" />
                  {wildlife?.legendPeak || 'Peak viewing window'}
                </span>
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <span className="h-2 w-5 rounded-full bg-slate-200" />
                  {wildlife?.legendOff || 'Off-peak'}
                </span>
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#FF7A00]/40" />
                    <span className="relative h-2.5 w-2.5 rounded-full bg-[#FF7A00]" />
                  </span>
                  {wildlife?.currentMonth || 'Current month'}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="max-w-[280px] font-inter text-xs italic leading-5 text-slate-500">
                  {wildlife?.footnote || 'Highlighted = best sighting chance. Nature can never be 100% guaranteed.'}
                </p>
                <Link
                  href="/transfers"
                  className="hidden shrink-0 items-center gap-1 text-xs font-semibold text-[#0E7482] sm:inline-flex"
                >
                  Transfers <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="flex items-center justify-between gap-3" aria-label="Auto-reveal progress">
                <div className="flex items-center gap-1.5">
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectItem(index)}
                      aria-label={`Show ${item.title}`}
                      className={`h-1.5 rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E7482]/40 ${
                        index === activeIndex ? 'w-6 bg-[#0E7482]' : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {started ? (isPaused ? 'Paused' : 'Auto reveal') : 'Starting'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </aside>
  );
}
