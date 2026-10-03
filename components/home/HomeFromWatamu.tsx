'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
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
    <section aria-labelledby="home-watamu-title" className="border-y border-line bg-paper py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="editorial-label text-orange-600">{c.watamu.kicker}</p>
            <h2 id="home-watamu-title" className="mt-4 font-editorial text-5xl leading-[0.95] tracking-tight text-ink sm:text-6xl">{c.watamu.title}</h2>
            <p className="mt-7 max-w-md font-grotesk text-base leading-7 text-ink-soft">{c.watamu.body}</p>
            <p className="mt-5 max-w-md border-l border-orange-500 pl-4 font-mono-editorial text-[10px] uppercase leading-5 tracking-[0.12em] text-muted">{c.watamu.note}</p>
            <Link href="/destinations" className="mt-8 inline-flex items-center gap-3 border-b border-ink pb-2 font-mono-editorial text-[10px] uppercase tracking-[0.16em] text-ink hover:border-orange-500 hover:text-orange-600">
              {c.watamu.cta}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="border-t border-line">
            <div className="grid grid-cols-[1.2fr_0.8fr_0.8fr_auto] gap-4 border-b border-line py-3 font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-muted">
              <span>{c.watamu.colDestination}</span><span>{c.watamu.colProgrammes}</span><span>{c.watamu.colLength}</span><span aria-hidden="true" />
            </div>
            <ul>
              {rows.map((row, index) => (
                <li key={row.key} className="border-b border-line">
                  <Link href={'/destinations/' + row.key} className="group grid grid-cols-[auto_1fr] items-center gap-4 py-6 sm:grid-cols-[2.2rem_1.2fr_0.8fr_0.8fr_auto] sm:gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600 focus-visible:ring-offset-2">
                    <span className="font-mono-editorial text-[10px] text-orange-600">0{index + 1}</span>
                    <span className="font-editorial text-2xl text-ink group-hover:text-ocean-700 sm:text-3xl">{row.name}</span>
                    <span className="hidden font-grotesk text-sm text-muted sm:block">{unit(row.count, row.count === 1 ? c.units.programme : c.units.programmes)}</span>
                    <span className="hidden font-grotesk text-sm text-muted sm:block">{unit(row.min === row.max ? row.min : row.min + '–' + row.max, row.max === 1 ? c.units.day : c.units.days)}</span>
                    <ArrowUpRight className="h-4 w-4 text-ocean-700 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
