'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, Compass, Globe2 } from 'lucide-react';

import PageShell from '@/components/PageShell';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { destinations } from '@/lib/destinations-data';
import { getLocalizedDestination } from '@/lib/destination-translations';
import { getExpandedLocalizedDestination } from '@/lib/expanded-destination-translations';
import { destinationPageLabels } from '@/lib/destination-page-i18n';
import { useLanguage } from '@/contexts/LanguageContext';

function staggerDelay(index: number) {
  return Math.min(index * 60, 360);
}

export default function DestinationsPage() {
  const { t, locale } = useLanguage();
  const pageLabels = destinationPageLabels[locale];
  const featured = destinations[0];

  return (
    <PageShell>
      <main className="min-h-screen bg-sand-50">
        <section className="relative isolate overflow-hidden bg-[#12343B] text-white">
          <div className="absolute inset-0 -z-20">
            <Image
              src={featured.heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-35"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#102B32]/95 via-[#12343B]/80 to-[#12343B]/35" />

          <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-[1.15fr_.85fr] lg:items-end lg:px-8 lg:pb-24 lg:pt-24">
            <AnimateOnScroll direction="up">
              <div className="max-w-3xl">
                <span className="mb-4 inline-flex items-center gap-2 border-l-2 border-[#FF7418] pl-3 py-1 font-inter text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                  <Compass className="h-4 w-4 text-[#FF9A50]" />
                  {t.destinationsPage.label}
                </span>
                <h1 className="font-poppins text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                  {t.destinationsPage.title}
                </h1>
                <p className="mt-5 max-w-2xl font-inter text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                  {t.destinationsPage.description}
                </p>
                <a
                  href="#destination-grid"
                  className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FF7418] px-5 py-3 font-poppins text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:bg-[#E9630D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#12343B]"
                >
                  {t.destinationsPage.explore}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll direction="up" delay={120}>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:justify-self-end lg:max-w-md">
                <div className="border border-white/20 bg-[#0D2A30]/65 p-4 sm:p-5">
                  <Globe2 className="mb-4 h-5 w-5 text-[#FF9A50]" />
                  <p className="font-poppins text-3xl font-bold sm:text-4xl">{destinations.length}</p>
                  <p className="mt-1 font-inter text-xs leading-5 text-white/75 sm:text-sm">{t.destinationsPage.label}</p>
                </div>
                <div className="border border-white/20 bg-[#0D2A30]/65 p-4 sm:p-5">
                  <MapPin className="mb-4 h-5 w-5 text-[#FF9A50]" />
                  <p className="font-poppins text-xl font-bold leading-tight sm:text-2xl">{pageLabels.regionFallback}</p>
                  <p className="mt-2 font-inter text-xs leading-5 text-white/75 sm:text-sm">{t.destinationsPage.description}</p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        <section id="destination-grid" className="scroll-mt-20 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 grid min-w-0 gap-3 sm:mb-10 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] sm:items-end sm:gap-8">
              <div className="max-w-2xl">
                <p className="font-inter text-xs font-bold uppercase tracking-[0.18em] text-ocean-700">{t.destinationsPage.label}</p>
                <h2 className="mt-2 font-poppins text-2xl font-bold leading-tight text-foreground sm:text-3xl">
                  {t.destinationsPage.title}
                </h2>
              </div>
              <p className="max-w-xl min-w-0 break-words font-inter text-sm leading-6 text-muted-foreground sm:justify-self-end sm:text-right">
                {t.destinationsPage.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
              {destinations.map((d, i) => {
                const content = getExpandedLocalizedDestination(getLocalizedDestination(d, locale), locale);
                return (
                  <AnimateOnScroll key={d.slug} direction="up" delay={staggerDelay(i)}>
                    <Link
                      href={`/destinations/${d.slug}`}
                      prefetch
                      className="group block h-full min-w-0 overflow-hidden border border-black/10 bg-white transition-colors duration-200 hover:border-ocean-700/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600 focus-visible:ring-offset-4"
                    >
                      <div className="relative h-56 overflow-hidden sm:h-64">
                        <Image
                          src={d.heroImage}
                          alt={`${content.name} ${t.destinationsPage.safariDestination}${d.country ? `, ${d.country}` : ''}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                        <div className="absolute left-4 top-4 flex max-w-[calc(100%-2rem)] items-center gap-2 bg-[#102B32]/90 px-3 py-1.5">
                          <Globe2 className="h-3.5 w-3.5 shrink-0 text-[#FF9A50]" />
                          <span className="truncate font-inter text-[11px] font-semibold uppercase tracking-wider text-white">{d.country || pageLabels.regionFallback}</span>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                          <div className="mb-2 flex items-center gap-1.5 font-inter text-xs font-medium text-white/80">
                            <MapPin className="h-3.5 w-3.5 text-[#FF9A50]" />
                            <span>{d.region || d.country || pageLabels.regionFallback}</span>
                          </div>
                          <h3 className="font-poppins text-2xl font-bold leading-tight text-white sm:text-[1.7rem]">{content.name}</h3>
                        </div>
                      </div>
                      <div className="flex min-h-[172px] min-w-0 flex-col p-5 sm:p-6">
                        <p className="mb-5 line-clamp-3 font-inter text-sm leading-6 text-muted-foreground">{content.tagline}</p>
                        <span className="mt-auto inline-flex min-h-11 min-w-0 items-center gap-2 font-inter text-sm font-bold leading-5 text-ocean-700 transition-colors group-hover:text-[#104B59]">
                          {t.destinationsPage.explore} {content.name}
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
