'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { SafariTab } from '@/lib/tours-data';
import { useHomeCopy } from './useHomeCopy';
import { useSafariCatalogue } from './useSafariCatalogue';

const REGIONS: { key: SafariTab; fallback: string }[] = [
  { key: 'tsavo', fallback: 'Tsavo' }, { key: 'amboseli', fallback: 'Amboseli' },
  { key: 'mara', fallback: 'Maasai Mara' }, { key: 'taita', fallback: 'Taita Hills' },
];

export default function HomeFromWatamu() {
  const { c, t, locale, unit } = useHomeCopy();
  const { safaris } = useSafariCatalogue(locale);
  const tabLabels = t.tours?.tabLabels;
  const rows = useMemo(() => REGIONS.map(({ key, fallback }) => {
    const list = safaris.filter((s) => s.tabs.includes(key));
    if (!list.length) return null;
    const days = list.map((s) => s.days);
    const labels = (tabLabels ?? {}) as Record<string, string>;
    return { key, name: labels[key] || fallback, count: list.length, min: Math.min(...days), max: Math.max(...days) };
  }).filter((row): row is NonNullable<typeof row> => row !== null), [safaris, tabLabels]);
  return (
    <section aria-labelledby="home-watamu-title" className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:gap-10 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16 lg:px-8">
        <div className="min-w-0">
          <span className="font-inter text-xs font-bold uppercase tracking-[0.18em] text-safari-600">{c.watamu.kicker}</span>
          <h2 id="home-watamu-title" className="mt-2 font-poppins text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl">{c.watamu.title}</h2>
          <p className="mt-4 font-inter text-base leading-7 text-muted-foreground">{c.watamu.body}</p>
          <p className="mt-4 font-inter text-sm leading-6 text-muted-foreground">{c.watamu.note}</p>
          <Link href="/destinations" className="mt-6 inline-flex min-h-11 items-center gap-2 bg-ocean-700 px-5 py-3 font-inter text-sm font-semibold text-white transition-colors hover:bg-ocean-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600 focus-visible:ring-offset-2">{c.watamu.cta} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /></Link>
        </div>
        <div className="min-w-0 overflow-hidden border border-border">
          <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2 bg-sand-50 px-3 py-3 font-inter text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:gap-3 sm:px-4 sm:text-xs"><span className="min-w-0 break-words">{c.watamu.colDestination}</span><span className="min-w-0 break-words">{c.watamu.colProgrammes}</span><span className="min-w-0 break-words">{c.watamu.colLength}</span></div>
          <ul className="divide-y divide-border">{rows.map((row) => <li key={row.key}><Link href={`/destinations/${row.key}`} className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 px-3 py-4 transition-colors hover:bg-sand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600 focus-visible:ring-inset sm:gap-3 sm:px-4"><span className="min-w-0 break-words font-poppins text-sm font-semibold leading-5 text-foreground">{row.name}</span><span className="min-w-0 break-words font-inter text-xs leading-5 text-muted-foreground sm:text-sm">{unit(row.count, row.count === 1 ? c.units.programme : c.units.programmes)}</span><span className="min-w-0 break-words font-inter text-xs leading-5 text-muted-foreground sm:text-sm">{unit(row.min === row.max ? row.min : `${row.min}–${row.max}`, row.max === 1 ? c.units.day : c.units.days)}</span></Link></li>)}</ul>
        </div>
      </div>
    </section>
  );
}
