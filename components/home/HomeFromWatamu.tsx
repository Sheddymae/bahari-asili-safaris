'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { SafariTab } from '@/lib/tours-data';
import { useHomeCopy } from './useHomeCopy';
import { useSafariCatalogue } from './useSafariCatalogue';

const REGIONS: { key: SafariTab; fallback: string; image: string }[] = [
  { key: 'tsavo', fallback: 'Tsavo', image: '/images/safaris/safari-experience-tsavo.jpg' },
  { key: 'amboseli', fallback: 'Amboseli', image: '/images/safaris/safari-inside-tsavo-amboseli.jpg' },
  { key: 'mara', fallback: 'Maasai Mara', image: '/images/safaris/safari-zazu.jpg' },
  { key: 'taita', fallback: 'Taita Hills', image: '/images/safaris/safari-nala-taita.jpg' },
];

export default function HomeFromWatamu() {
  const { c, t, locale, unit } = useHomeCopy();
  const { safaris } = useSafariCatalogue(locale);
  const tabLabels = t.tours?.tabLabels;

  const rows = useMemo(() => REGIONS.map(({ key, fallback, image }) => {
    const list = safaris.filter((s) => s.tabs.includes(key));
    if (!list.length) return null;
    const days = list.map((s) => s.days);
    const labels = (tabLabels ?? {}) as Record<string, string>;
    return { key, name: labels[key] || fallback, count: list.length, min: Math.min(...days), max: Math.max(...days), image };
  }).filter((row): row is NonNullable<typeof row> => row !== null), [safaris, tabLabels]);

  return (
    <section aria-labelledby="home-watamu-title" className="border-y border-line bg-shell py-24 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="editorial-label text-coral">{c.watamu.kicker}</p>
            <h2 id="home-watamu-title" className="mt-5 max-w-xl font-editorial text-5xl leading-[0.88] tracking-[-0.025em] text-ink sm:text-6xl lg:text-7xl">{c.watamu.title}</h2>
            <p className="mt-8 max-w-md font-grotesk text-base leading-7 text-ink-soft">{c.watamu.body}</p>
            <div className="mt-10 grid max-w-md grid-cols-[minmax(0,1fr)_6.5rem] items-end gap-5 border-t border-line pt-5">
              <p className="font-mono-editorial text-[9px] uppercase leading-5 tracking-[0.14em] text-muted">{c.watamu.note}</p>
              <div className="relative aspect-[4/5] overflow-hidden bg-ocean-deep">
                <Image src="/images/safaris/safari-experience-tsavo.jpg" alt="" fill sizes="104px" className="object-cover" />
                <div className="absolute inset-0 bg-ocean-deep/15" />
                <span className="absolute inset-x-2 bottom-2 font-mono-editorial text-[8px] uppercase tracking-[0.12em] text-white">Watamu → bush</span>
              </div>
            </div>
            <Link href="/destinations" className="mt-8 inline-flex items-center gap-3 border-b border-ink pb-2 font-mono-editorial text-[10px] uppercase tracking-[0.16em] text-ink hover:border-coral hover:text-coral">{c.watamu.cta}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          <div className="border-t border-line">
            <div className="grid grid-cols-[2.2rem_1.2fr_0.8fr_0.8fr_auto] gap-4 border-b border-line py-3 font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-muted">
              <span aria-hidden="true" /><span>{c.watamu.colDestination}</span><span>{c.watamu.colProgrammes}</span><span>{c.watamu.colLength}</span><span aria-hidden="true" />
            </div>
            <ul>
              {rows.map((row, index) => (
                <li key={row.key} className="group border-b border-line">
                  <Link href={'/destinations/' + row.key} className="grid grid-cols-[2.2rem_1fr_auto] items-center gap-4 py-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 sm:grid-cols-[2.2rem_5.5rem_1.2fr_0.8fr_0.8fr_auto] sm:gap-4">
                    <span className="font-mono-editorial text-[10px] text-coral">0{index + 1}</span>
                    <div className="relative hidden aspect-[4/3] overflow-hidden bg-sand-100 sm:block"><Image src={row.image} alt="" fill sizes="88px" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" /></div>
                    <span className="font-editorial text-2xl leading-none text-ink transition-colors group-hover:text-ocean sm:text-3xl">{row.name}</span>
                    <span className="hidden font-grotesk text-sm text-muted sm:block">{unit(row.count, row.count === 1 ? c.units.programme : c.units.programmes)}</span>
                    <span className="hidden font-grotesk text-sm text-muted sm:block">{unit(row.min === row.max ? row.min : row.min + '–' + row.max, row.max === 1 ? c.units.day : c.units.days)}</span>
                    <ArrowUpRight className="h-4 w-4 text-ocean transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
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
