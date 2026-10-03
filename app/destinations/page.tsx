'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, MapPin } from 'lucide-react';

import PageShell from '@/components/PageShell';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { destinations } from '@/lib/destinations-data';
import { getLocalizedDestination } from '@/lib/destination-translations';
import { getExpandedLocalizedDestination } from '@/lib/expanded-destination-translations';
import { destinationPageLabels } from '@/lib/destination-page-i18n';
import { useLanguage } from '@/contexts/LanguageContext';

function staggerDelay(index: number) {
  return Math.min(index * 70, 420);
}

export default function DestinationsPage() {
  const { t, locale } = useLanguage();
  const pageLabels = destinationPageLabels[locale];

  return (
    <PageShell>
      <section className="bg-paper min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20 lg:pt-20 lg:pb-28">
          <AnimateOnScroll direction="up">
            <header className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-end border-b border-line pb-9 lg:pb-12">
              <div>
                <p className="editorial-label mb-4">{t.destinationsPage.label}</p>
                <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-normal leading-[0.95] tracking-tight text-ink max-w-4xl">
                  {t.destinationsPage.title}
                </h1>
              </div>
              <div className="lg:pb-1">
                <div className="editorial-rule mb-5" />
                <p className="font-grotesk text-sm sm:text-base leading-7 text-ink-soft max-w-xl">
                  {t.destinationsPage.description}
                </p>
              </div>
            </header>
          </AnimateOnScroll>

          <div className="mt-10 lg:mt-14">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-5 gap-y-12 lg:gap-x-7 lg:gap-y-16">
              {destinations.map((d, i) => {
                const content = getExpandedLocalizedDestination(getLocalizedDestination(d, locale), locale);
                const featured = i === 0;
                const wide = i === 1 || i === 4;

                return (
                  <AnimateOnScroll
                    key={d.slug}
                    direction="up"
                    delay={staggerDelay(i)}
                    className={featured ? 'lg:col-span-7' : wide ? 'lg:col-span-7' : 'lg:col-span-5'}
                  >
                    <Link href={`/destinations/${d.slug}`} prefetch className="group block">
                      <article>
                        <div className={`relative overflow-hidden bg-sand-100 ${featured ? 'aspect-[16/10]' : wide ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}>
                          <Image
                            src={d.heroImage}
                            alt={`${content.name} ${t.destinationsPage.safariDestination}${d.country ? `, ${d.country}` : ''}`}
                            fill
                            sizes={featured || wide ? '(max-width: 1024px) 100vw, 58vw' : '(max-width: 1024px) 100vw, 42vw'}
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent opacity-90" />
                          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 text-white">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-3.5 h-3.5 text-orange-300" />
                              <span className="font-mono-editorial text-[10px] uppercase tracking-[0.16em] text-white/80">
                                {d.region || d.country || pageLabels.regionFallback}
                              </span>
                            </div>
                            <h2 className="font-editorial text-3xl sm:text-4xl font-normal leading-none">{content.name}</h2>
                          </div>
                        </div>

                        <div className="border-b border-line py-4 sm:py-5 flex items-start justify-between gap-5">
                          <div className="max-w-2xl">
                            <p className="font-grotesk text-sm leading-6 text-ink-soft">{content.tagline}</p>
                            <p className="mt-2 font-mono-editorial text-[10px] uppercase tracking-[0.15em] text-muted">
                              {d.country || pageLabels.regionFallback}
                            </p>
                          </div>
                          <span className="shrink-0 mt-0.5 inline-flex h-9 w-9 items-center justify-center border border-line text-ink transition-colors group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white" aria-hidden="true">
                            <ArrowUpRight className="w-4 h-4" />
                          </span>
                        </div>
                      </article>
                    </Link>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
