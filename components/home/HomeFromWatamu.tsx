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
    <section aria-labelledby="home-watamu-title" className="bg-white py-16 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-8">
        <div>
          <span className="font-inter text-xs font-bold uppercase tracking-[0.18em] text-safari-600">{c.watamu.kicker}</span>
          <h2 id="home-watamu-title" className="mt-2 font-poppins text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl">{c.watamu.title}</h2>
          <p className="mt-4 font-inter text-base leading-7 text-muted-foreground">{c.watamu.body}</p>
          <p className="mt-4 font-inter text-sm leading-6 text-muted-foreground">{c.watamu.note}</p>
          <Link href="/destinations" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ocean-700 px-5 py-3 font-inter text-sm font-semibold text-white hover:bg-ocean-800">{c.watamu.cta} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-3 bg-sand-50 px-4 py-3 font-inter text-xs font-bold uppercase tracking-wider text-muted-foreground"><span>{c.watamu.colDestination}</span><span>{c.watamu.colProgrammes}</span><span>{c.watamu.colLength}</span></div>
          <ul className="divide-y divide-border">{rows.map((row) => <li key={row.key}><Link href={`/destinations/${row.key}`} className="grid grid-cols-[1.2fr_1fr_1fr] items-center gap-3 px-4 py-4 hover:bg-sand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600 focus-visible:ring-inset"><span className="font-poppins text-sm font-semibold text-foreground">{row.name}</span><span className="font-inter text-sm text-muted-foreground">{unit(row.count, row.count === 1 ? c.units.programme : c.units.programmes)}</span><span className="font-inter text-sm text-muted-foreground">{unit(row.min === row.max ? row.min : `${row.min}–${row.max}`, row.max === 1 ? c.units.day : c.units.days)}</span></Link></li>)}</ul>
        </div>
      </div>
    </section>
  );
}
