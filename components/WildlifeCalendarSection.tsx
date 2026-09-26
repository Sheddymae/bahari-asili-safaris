'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Plane } from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useLanguage } from '@/contexts/LanguageContext';
import { prefersReducedMotion } from '@/lib/video-config';

gsap.registerPlugin(ScrollTrigger);

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/* ---------------------------------------------------------------------- */
/* Custom line-art species icons (stroke-based, matches lucide's visual   */
/* weight so they sit naturally next to the CalendarDays header icon).    */
/* Stylised, not zoologically literal — optimised for a clean 24x24 glyph. */
/* ---------------------------------------------------------------------- */

function WildebeestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 9c1.5-2 3-3 5-3 .5-1.5 1.5-2.5 3-2.5s2.5 1 3 2.5c2 0 3.5 1 5 3M4 9c0 1 .5 1.5 1.5 1.5M4 9l-1.5-.5M19.5 10.5c1 0 1.5-.5 1.5-1.5M19.5 10.5L21 10M8 12v6M8 12l-2.5 1M8 12l2 1M16 12v6M16 12l2.5 1M16 12l-2 1M9 9.5c0 2-.5 3-1.5 3.5M15 9.5c0 2 .5 3 1.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ElephantIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 13c0-3.5 2.8-6.5 7-6.5 3 0 4.5 1 5.5 2 1.5-1 3.5-.5 4.3 1 .6 1.2.2 2.5-1 3v2.5c0 1.4-1.1 2-2 2v1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6.5c-3 .3-5 2.3-5 5.5 0 2 1 3.3 2.5 4v2.5M7.5 16v2.5M13 15.5v3M16.5 15.5v3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16.3" cy="9.3" r="0.9" fill="currentColor" />
    </svg>
  );
}

function WhaleSharkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M2.5 13c2-4 6-6.5 10.5-6.5 5 0 8.5 3 9 6.5-.5 3.5-4 6.5-9 6.5C8.5 19.5 4.5 17 2.5 13Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M22 13c1 -1 1.5 -1 1.5 0s-.5 1 -1.5 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M9 6.5 7 3M13 6.2 12 3.2M17 7.5 16.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="6.7" cy="12" r="0.9" fill="currentColor" />
    </svg>
  );
}

function TurtleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 8c3.5 0 6 1.8 6 4.5S15.5 17 12 17s-6-1.8-6-4.5S8.5 8 12 8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 8v9M8.2 9.5l7.6 6M15.8 9.5l-7.6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path
        d="M6 10.5c-1.5-.3-2.5.3-2.8 1.5M18 10.5c1.5-.3 2.5.3 2.8 1.5M8 16.5c-.8 1-1.8 1.4-3 1.2M16 16.5c.8 1 1.8 1.4 3 1.2M17 8.5c.6-1.2 1.6-1.7 2.8-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="17.8" cy="7" r="0.9" fill="currentColor" />
    </svg>
  );
}

function FlamingoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M8 3.5c3 .5 4 3 3 5.5-.7 1.8-.3 2.8 1 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="8.3" cy="4" r="1.3" fill="currentColor" />
      <path
        d="M12 12.5c0 2.5-1 4-1 6.5M12 12.5c1.5.5 2.5-.2 2.7-1.7M9.5 19h5M11 19v1.8M13 19v1.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------- */

interface CalendarRow {
  Icon: (props: { className?: string }) => JSX.Element;
  name: string;
  location: string;
  bestMonths: number[]; // 1-indexed, Jan = 1
  note: string;
}

const CALENDAR_ROWS: CalendarRow[] = [
  {
    Icon: WildebeestIcon,
    name: 'Wildebeest Migration',
    location: 'Masai Mara',
    bestMonths: [7, 8, 9, 10],
    note: 'River crossings peak Jul–Oct',
  },
  {
    Icon: ElephantIcon,
    name: 'Elephant Herds',
    location: 'Tsavo',
    bestMonths: [6, 7, 8, 9, 10],
    note: 'Dry season draws herds to waterholes',
  },
  {
    Icon: WhaleSharkIcon,
    name: 'Whale Sharks',
    location: 'Watamu',
    bestMonths: [11, 12, 1, 2, 3],
    note: 'Plankton blooms attract them close to shore',
  },
  {
    Icon: TurtleIcon,
    name: 'Turtle Nesting',
    location: 'Watamu Marine Park',
    bestMonths: [1, 2, 3],
    note: 'Green & Olive Ridley turtles nest on the beach',
  },
  {
    Icon: FlamingoIcon,
    name: 'Migratory Birds',
    location: 'Kenyan Coast',
    bestMonths: [10, 11, 12, 1, 2, 3, 4],
    note: 'Palearctic migrants overwinter along the coast',
  },
];

export default function WildlifeCalendarSection({ onBook }: { onBook?: (transferType: string) => void }) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoverCell, setHoverCell] = useState<{ row: number; month: number } | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const currentMonth = useMemo(() => new Date().getMonth() + 1, []);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;
    const rows = sectionRef.current.querySelectorAll('.calendar-row');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rows,
        { autoAlpha: 0, x: -20 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const inSeasonNow = CALENDAR_ROWS.filter((r) => r.bestMonths.includes(selectedMonth ?? currentMonth));

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-sand-50/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white border border-safari-200 rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <CalendarDays className="w-3.5 h-3.5 text-safari-600" />
            <span className="font-inter text-xs font-semibold text-safari-700 uppercase tracking-wider">
              {t.wildlifeCalendar?.label || 'Best Time to Visit'}
            </span>
          </div>
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3">
            {t.wildlifeCalendar?.title || 'When nature puts on its show'}
          </h2>
          <p className="font-inter text-muted-foreground text-base max-w-2xl mx-auto">
            {t.wildlifeCalendar?.subtitle || 'A rough guide to peak wildlife seasons — nature doesn\u2019t run on a strict schedule, but these windows give the best odds.'}
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)] lg:gap-8">
          <div className="min-w-0">
        {/* Calendar card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.06)] border border-sand-100 p-5 sm:p-8">
          <div className="overflow-x-auto -mx-2 px-2">
            <div className="min-w-[760px]">
              {/* Month header — clickable to filter the whole calendar */}
              <div className="grid grid-cols-[230px_repeat(12,1fr)] gap-1 mb-4 px-1">
                <div />
                {MONTHS.map((m, i) => {
                  const monthNum = i + 1;
                  const isSelected = selectedMonth === monthNum;
                  const isToday = !selectedMonth && monthNum === currentMonth;
                  return (
                    <button
                      key={i}
                      onClick={() =>
                        setSelectedMonth((prev) => (prev === monthNum ? null : monthNum))
                      }
                      title={`Show what's in season in ${MONTH_NAMES[i]}`}
                      className={`relative text-center font-inter text-[11px] font-bold tracking-wide rounded-full py-1.5 transition-colors duration-150 ${
                        isSelected
                          ? 'bg-safari-500 text-white shadow-sm shadow-safari-500/40'
                          : isToday
                          ? 'bg-safari-50 text-safari-700'
                          : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                      }`}
                    >
                      {m}
                      {isToday && (
                        <span className="absolute -top-1 -right-0.5 w-1.5 h-1.5 rounded-full bg-safari-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Rows */}
              <div className="space-y-3">
                {CALENDAR_ROWS.map((row, ri) => {
                  const activeMonth = selectedMonth ?? undefined;
                  const isInSeasonForSelection =
                    activeMonth !== undefined && row.bestMonths.includes(activeMonth);
                  const dimmed = activeMonth !== undefined && !isInSeasonForSelection;

                  return (
                    <div
                      key={ri}
                      className={`calendar-row grid grid-cols-[230px_repeat(12,1fr)] gap-1 items-center rounded-2xl px-2 py-3 transition-all duration-300 ${
                        dimmed
                          ? 'opacity-35 hover:opacity-70'
                          : isInSeasonForSelection
                          ? 'bg-safari-50 ring-1 ring-safari-200'
                          : 'hover:bg-safari-50/60'
                      }`}
                    >
                      {/* Species label */}
                      <div className="flex items-center gap-3 pr-3">
                        <span
                          className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${
                            isInSeasonForSelection
                              ? 'bg-safari-500 border-safari-500 text-white'
                              : 'bg-safari-50 border-safari-100 text-safari-600'
                          }`}
                        >
                          <row.Icon className="w-5 h-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="font-poppins font-semibold text-sm text-foreground truncate">
                            {row.name}
                          </p>
                          <p className="font-inter text-xs text-muted-foreground truncate">
                            {row.location}
                          </p>
                        </div>
                      </div>

                      {/* Month timeline */}
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                        const isBest = row.bestMonths.includes(month);
                        const isHovered = hoverCell?.row === ri && hoverCell?.month === month;
                        const isSelectedCol = month === selectedMonth;

                        return (
                          <div
                            key={month}
                            className={`relative h-8 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                              isSelectedCol ? 'bg-safari-100/60' : ''
                            }`}
                            onMouseEnter={() => isBest && setHoverCell({ row: ri, month })}
                            onMouseLeave={() => setHoverCell(null)}
                          >
                            {isBest ? (
                              <div
                                className={`h-6 w-full mx-0.5 rounded-full bg-gradient-to-r from-safari-400 via-safari-500 to-safari-600 shadow-sm shadow-safari-500/40 transition-all duration-200 cursor-default ${
                                  isHovered ? 'scale-y-125 shadow-lg shadow-safari-500/50' : ''
                                }`}
                              />
                            ) : (
                              <div className="h-1.5 w-full mx-0.5 rounded-full bg-slate-200" />
                            )}

                            {isBest && isHovered && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 pointer-events-none">
                                <div className="bg-slate-900 text-white text-[11px] font-inter font-medium rounded-lg px-3 py-1.5 whitespace-nowrap shadow-xl">
                                  {row.note}
                                </div>
                                <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Calendar legend and note stay inside the calendar card. */}
        <div className="mt-7 border-t border-slate-100 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FF7A00] px-3 py-1.5 font-inter text-xs font-semibold text-white"><span className="h-1.5 w-1.5 rounded-full bg-white" />{t.wildlifeCalendar?.legendPeak || 'Peak viewing window'}</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 font-inter text-xs font-semibold text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-slate-400" />{t.wildlifeCalendar?.legendOff || 'Off-peak'}</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FF7A00]/20 bg-[#FF7A00]/5 px-3 py-1.5 font-inter text-xs font-semibold text-[#0E7482]"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF7A00] opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF7A00]" /></span>{selectedMonth ? MONTH_NAMES[selectedMonth - 1] : MONTH_NAMES[currentMonth - 1]}</span>
          </div>
          <p className="mt-3 font-inter text-xs italic leading-5 text-slate-400">{t.wildlifeCalendar?.footnote || 'Highlighted months = peak viewing window. Wildlife sightings can never be 100% guaranteed.'}</p>
        </div>

        {/* Live "in season" summary — reflects the selected month, or today by default */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-center">
          <span className="font-inter text-sm text-muted-foreground">
            {selectedMonth ? `In ${MONTH_NAMES[selectedMonth - 1]}:` : 'Right now:'}
          </span>
          {inSeasonNow.length > 0 ? (
            inSeasonNow.map((row) => (
              <span
                key={row.name}
                className="inline-flex items-center gap-1.5 bg-safari-50 border border-safari-200 text-safari-700 text-xs font-inter font-semibold rounded-full px-3 py-1"
              >
                <row.Icon className="w-3.5 h-3.5" />
                {row.name}
              </span>
            ))
          ) : (
            <span className="font-inter text-sm text-muted-foreground italic">
              {t.wildlifeCalendar?.nothingAtPeak || 'nothing at peak this month — check another month above'}
            </span>
          )}
        </div>

          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#0E7482]/8 px-3 py-1.5 font-inter text-[11px] font-bold uppercase tracking-[0.14em] text-[#0E7482]"><Plane className="h-3.5 w-3.5" />{t.transfers?.label || 'Transfers & Services'}</span>
                <span className="h-2 w-2 rounded-full bg-[#FF7A00] shadow-[0_0_0_5px_rgba(255,122,0,0.08)]" />
              </div>
              <h3 className="mt-5 font-poppins text-2xl font-bold leading-tight text-slate-900">{t.transfers?.title || 'We take care of'} <span className="text-[#0E7482]">{t.transfers?.titleHighlight || 'everything'}</span></h3>
              <p className="mt-3 font-inter text-sm leading-6 text-slate-500">{t.transfers?.subtitle || 'From the moment you land to the moment you leave — we are with you.'}</p>
              <div className="mt-6 flex flex-wrap gap-2">{(t.transfers?.airports || []).map((airport) => <Link key={airport.code} href="/transfers" className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-inter text-xs font-bold text-slate-600 transition hover:border-[#0E7482]/30 hover:text-[#0E7482]"><Plane className="h-3 w-3 text-[#FF7A00]" />{airport.code}</Link>)}</div>
              <div className="mt-6 rounded-2xl bg-[#0E7482]/5 p-4"><p className="font-inter text-xs font-bold uppercase tracking-[0.14em] text-[#0E7482]">MYD · MBA · NBO</p><p className="mt-2 font-poppins text-lg font-semibold text-slate-900">{t.transfers?.subtitle || 'From the moment you land to the moment you leave — we are with you.'}</p></div>
              <Link href="/transfers" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0E7482] px-5 py-3.5 font-inter text-sm font-bold text-white transition hover:bg-[#0b6370] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2">{t.transfers?.cta || t.nav.transfers}<ArrowRight className="h-4 w-4" /></Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}