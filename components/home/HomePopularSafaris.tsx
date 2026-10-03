'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { trackConversion } from '@/components/Analytics';
import { getLocalizedSafari } from '@/lib/safari-content-i18n';
import { useHomeCopy } from './useHomeCopy';
import { useSafariCatalogue } from './useSafariCatalogue';

export default function HomePopularSafaris({ onBook }: { onBook: (name?: string) => void }) {
  const { c, locale, unit } = useHomeCopy();
  const { safaris, safariLocale } = useSafariCatalogue(locale);
  const featured = useMemo(() => {
    const popular = safaris.filter((s) => s.popular && s.category !== 'long');
    const rest = safaris.filter((s) => !s.popular && s.category !== 'long');
    return [...popular, ...rest].slice(0, 4);
  }, [safaris]);

  return (
    <section id="tours" aria-labelledby="home-popular-title" className="bg-paper py-24 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
          <div>
            <p className="editorial-label text-coral">{c.popular.kicker}</p>
            <h2 id="home-popular-title" className="mt-5 max-w-md font-editorial text-5xl leading-[0.9] tracking-[-0.025em] text-ink sm:text-6xl lg:text-7xl">{c.popular.title}</h2>
          </div>
          <div className="flex items-end justify-between gap-8 border-b border-line pb-5">
            <p className="max-w-xl font-grotesk text-sm leading-6 text-ink-soft">{c.popular.sub}</p>
            <Link href="/tours" className="hidden shrink-0 items-center gap-2 font-mono-editorial text-[10px] uppercase tracking-[0.18em] text-ocean hover:text-coral sm:inline-flex">
              {c.popular.seeAll}<ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-12">
          {featured.map((safari, index) => {
            const s = getLocalizedSafari(safari, safariLocale);
            const featuredLayout = index === 0 ? 'lg:col-span-7 lg:row-span-2' : index === 1 ? 'lg:col-span-5' : index === 2 ? 'lg:col-span-5' : 'lg:col-span-7';
            const imageHeight = index === 0 ? 'h-[27rem] sm:h-[38rem]' : index === 3 ? 'h-72' : 'h-60 sm:h-72';
            return (
              <article key={safari.id} className={'group ' + featuredLayout}>
                <Link href={'/safaris/' + safari.id} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-4">
                  <div className={'relative overflow-hidden bg-ocean-deep ' + imageHeight}>
                    <Image src={safari.image} alt={s.name} fill sizes={index === 0 ? '(max-width: 1024px) 100vw, 58vw' : '(max-width: 1024px) 100vw, 42vw'} className="object-cover transition duration-1000 ease-out group-hover:scale-[1.045]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/45 via-transparent to-transparent opacity-80" />
                    <span className="absolute left-4 top-4 border border-white/40 bg-ocean-deep/35 px-2.5 py-1.5 font-mono-editorial text-[9px] uppercase tracking-[0.16em] text-white backdrop-blur-md">0{index + 1}</span>
                  </div>
                </Link>
                <div className="grid gap-4 border-b border-line pt-5 pb-5 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-mono-editorial text-[9px] uppercase tracking-[0.16em] text-coral">{unit(safari.days, safari.days === 1 ? c.units.day : c.units.days)}{safari.nights > 0 && <> / {unit(safari.nights, safari.nights === 1 ? c.units.night : c.units.nights)}</>}</span>
                      <span className="text-line" aria-hidden="true">•</span>
                      <span className="font-grotesk text-xs text-muted">{safari.parks.slice(0, 3).join(' · ')}</span>
                    </div>
                    <h3 className="mt-2 font-editorial text-2xl leading-tight text-ink sm:text-3xl">{s.name}</h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-4 sm:pt-1">
                    <button type="button" onClick={() => { trackConversion('booking_started', { location: 'popular_safari' }); onBook(s.name); }} className="font-mono-editorial text-[10px] uppercase tracking-[0.13em] text-ocean hover:text-coral">{c.popular.requestItinerary}</button>
                    <Link href={'/safaris/' + safari.id} className="inline-flex h-9 w-9 items-center justify-center border border-line text-ocean hover:border-coral hover:bg-shell focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean" aria-label={c.popular.viewSafari}><ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <Link href="/tours" className="mt-12 inline-flex items-center gap-2 border-b border-ink pb-1 font-mono-editorial text-[10px] uppercase tracking-[0.16em] text-ink sm:hidden">{c.popular.seeAll}<ArrowUpRight className="h-4 w-4" aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
