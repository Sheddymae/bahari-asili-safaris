'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { getLocalizedSafari } from '@/lib/safari-content-i18n';
import SectionHeader from './SectionHeader';
import { useHomeCopy } from './useHomeCopy';
import { useSafariCatalogue } from './useSafariCatalogue';

export default function HomePopularSafaris() {
  const { c, locale, unit } = useHomeCopy();
  const { safaris, safariLocale } = useSafariCatalogue(locale);
  const featured = useMemo(() => {
    const popular = safaris.filter((s) => s.popular && s.category !== 'long');
    const rest = safaris.filter((s) => !s.popular && s.category !== 'long');
    return [...popular, ...rest].slice(0, 3);
  }, [safaris]);
  return (
    <section id="tours" aria-labelledby="home-popular-title" className="bg-sand-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader kicker={c.popular.kicker} title={c.popular.title} sub={c.popular.sub} />
          <Link href="/tours" className="mb-10 inline-flex shrink-0 items-center gap-2 font-inter text-sm font-semibold text-ocean-700 hover:text-ocean-800">{c.popular.seeAll} <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" /></Link>
        </div>
        <span id="home-popular-title" className="sr-only">{c.popular.title}</span>
        <ul className="safari-card-grid list-none p-0">
          {featured.map((safari) => {
            const s = getLocalizedSafari(safari, safariLocale);
            return (
              <li key={safari.id} className="min-w-0">
                <Link href={`/safaris/${safari.id}`} className="group relative flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={safari.image} alt={s.name} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
                    <div className="absolute start-3 top-3"><span className="inline-flex h-7 max-w-full items-center gap-1.5 rounded-pill bg-ocean-100 px-3 text-[13px] font-medium text-ocean-900">{safari.tabs[0] || s.name}</span></div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex h-7 items-center rounded-pill bg-sand-100 px-3 text-[13px] font-medium text-ink-900">{unit(safari.days, safari.days === 1 ? c.units.day : c.units.days)}{safari.nights > 0 ? ` · ${unit(safari.nights, safari.nights === 1 ? c.units.night : c.units.nights)}` : ''}</span>
                      <span className="inline-flex h-7 items-center rounded-pill bg-sand-100 px-3 text-[13px] font-medium text-ink-900">{safari.private ? 'Private' : 'Shared'}</span>
                    </div>
                    <h3 className="font-poppins text-xl text-ocean-900">{s.name}</h3>
                    <p className="line-clamp-2 text-sm text-ink-600">{safari.parks.slice(0, 3).join(' · ')}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-sand-100 pt-4">
                      <span className="text-sm font-semibold text-ember-700">{c.popular.viewSafari} →</span>
                      <span className="text-xs text-ink-600">Quote on request</span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
