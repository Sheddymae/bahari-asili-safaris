'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowUpRight } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Excursion } from '@/lib/tours-data';
import { getLocalizedExcursion, type SupportedLocale } from '@/lib/excursion-content-i18n';

export default function ExcursionsCatalogueClient({ excursions }: { excursions: Excursion[] }) {
  const { t, locale } = useLanguage();
  const categoryLabel: Record<string, string> = {
    marine: t.excursions.marineCategory,
    nature: t.excursions.natureCategory,
    culture: t.excursions.cultureCategory,
  };

  return (
    <PageShell>
      <section className="min-h-screen bg-paper">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-24 lg:pt-20 lg:pb-32">
          <header className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-16 items-end border-b border-line pb-10 lg:pb-14">
            <div>
              <p className="editorial-label mb-4">{t.nav.excursions}</p>
              <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl font-normal leading-[0.94] tracking-tight text-ink">
                {t.excursions.title} {t.excursions.titleHighlight}
              </h1>
            </div>
            <div>
              <div className="editorial-rule mb-5" />
              <p className="font-grotesk text-sm sm:text-base leading-7 text-ink-soft max-w-xl">
                {t.excursions.subtitle}
              </p>
            </div>
          </header>

          <div className="mt-12 lg:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-14 lg:gap-x-8 lg:gap-y-20">
            {excursions.map((e, i) => {
              const content = getLocalizedExcursion(e, locale as SupportedLocale);
              const large = i % 4 === 0 || i % 4 === 3;
              return (
                <Link key={e.id} href={`/excursions/${e.id}`} prefetch className={`group block ${large ? 'lg:col-span-7' : 'lg:col-span-5'}`}>
                  <article>
                    <div className={`relative overflow-hidden bg-sand-100 ${large ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}>
                      <Image src={e.image} alt={content.name} fill sizes={large ? '(max-width: 1024px) 100vw, 58vw' : '(max-width: 1024px) 100vw, 42vw'} className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                      <div className="absolute left-4 top-4 flex items-center gap-2">
                        <span className="bg-ink/85 px-2.5 py-1 font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-white">{categoryLabel[e.category]}</span>
                        {e.popular && <span className="bg-orange-500 px-2.5 py-1 font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-white">{t.excursions.popular}</span>}
                      </div>
                      <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 bg-paper/90 px-2.5 py-1.5 text-ink">
                        <Clock className="h-3 w-3 text-orange-600" />
                        <span className="font-mono-editorial text-[9px] uppercase tracking-[0.1em]">{content.duration}</span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 text-white">
                        <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal leading-none">{content.name}</h2>
                      </div>
                    </div>
                    <div className="border-b border-line py-4 sm:py-5 flex items-start justify-between gap-5">
                      <p className="font-grotesk text-sm leading-6 text-ink-soft max-w-2xl line-clamp-3">{content.description}</p>
                      <span className="shrink-0 inline-flex h-9 w-9 items-center justify-center border border-line text-ink transition-colors group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white" aria-hidden="true">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
