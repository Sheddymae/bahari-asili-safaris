'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
          <span className="inline-flex items-center gap-2 font-inter text-xs font-bold uppercase tracking-[0.18em] text-ocean-700"><span aria-hidden="true" className="h-0.5 w-6 bg-safari-500" />{c.watamu.kicker}</span>
          <h2 id="home-watamu-title" className="mt-2 font-poppins text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl">{c.watamu.title}</h2>
          <p className="mt-4 font-inter text-base leading-7 text-muted-foreground">{c.watamu.body}</p>
          <p className="mt-4 font-inter text-sm leading-6 text-muted-foreground">{c.watamu.note}</p>
          <Link href="/destinations" className="mt-6 inline-flex items-center gap-2 brand-button brand-button-primary px-5 py-3">{c.watamu.cta} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {rows.map((row) => (
            <Link key={row.key} href={`/destinations/${row.key}`} className="group relative min-h-64 overflow-hidden rounded-card bg-white shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600">
              <Image src={row.image} alt={row.name} fill sizes="(min-width:640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 className="font-poppins text-xl font-semibold">{row.name}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex h-7 items-center rounded-pill bg-white/90 px-3 text-[13px] font-medium text-ink-900">{row.count} {row.count === 1 ? c.units.programme : c.units.programmes}</span>
                  <span className="inline-flex h-7 items-center rounded-pill bg-white/90 px-3 text-[13px] font-medium text-ink-900">{row.min === row.max ? `${row.min} ${row.max === 1 ? c.units.day : c.units.days}` : `${row.min}–${row.max} ${c.units.days}`}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
