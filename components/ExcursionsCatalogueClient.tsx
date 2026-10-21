'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Waves, Leaf, Landmark, Compass } from 'lucide-react';
import PageShell from '@/components/PageShell';
import AnimateOnScroll from '@/components/AnimateOnScroll';
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
  const categoryIcon = {
    marine: Waves,
    nature: Leaf,
    culture: Landmark,
  } as const;
  const featured = excursions[0];

  return (
    <PageShell>
      <main className="min-h-screen bg-sand-50">
        <section className="relative isolate overflow-hidden bg-[#12343B] text-white">
          {featured && (
            <div className="absolute inset-0 -z-20">
              <Image src={featured.image} alt="" fill priority sizes="100vw" className="object-cover opacity-35" />
            </div>
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#102B32]/95 via-[#12343B]/80 to-[#12343B]/35" />
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.2fr_.8fr] lg:items-end lg:px-8 lg:py-24">
            <AnimateOnScroll direction="up">
              <div className="max-w-3xl">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-inter text-xs font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur">
                  <Compass className="h-4 w-4 text-[#FF9A50]" />
                  {t.nav.excursions}
                </span>
                <h1 className="font-poppins text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                  {t.excursions.title} <span className="text-[#FF9A50]">{t.excursions.titleHighlight}</span>
                </h1>
                <p className="mt-5 max-w-2xl font-inter text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                  {t.excursions.subtitle}
                </p>
                <a href="#excursion-grid" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#FF7418] px-5 py-3 font-poppins text-sm font-semibold text-white shadow-lg shadow-black/15 transition hover:bg-[#E9630D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#12343B]">
                  {t.excursions.viewExcursion}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll direction="up" delay={120}>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:max-w-md lg:justify-self-end">
                {(['marine', 'nature', 'culture'] as const).map((category) => {
                  const Icon = categoryIcon[category];
                  return (
                    <div key={category} className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md sm:p-4">
                      <Icon className="mb-3 h-5 w-5 text-[#FF9A50]" />
                      <p className="font-inter text-xs font-semibold leading-5 text-white sm:text-sm">{categoryLabel[category]}</p>
                    </div>
                  );
                })}
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        <section id="excursion-grid" className="scroll-mt-20 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 max-w-2xl sm:mb-10">
              <p className="font-inter text-xs font-bold uppercase tracking-[0.18em] text-ocean-700">{t.nav.excursions}</p>
              <h2 className="mt-2 font-poppins text-2xl font-bold leading-tight text-foreground sm:text-3xl">{t.excursions.title} {t.excursions.titleHighlight}</h2>
              <p className="mt-3 font-inter text-sm leading-6 text-muted-foreground">{t.excursions.subtitle}</p>
            </div>

            {excursions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ocean-700/30 bg-white p-8 text-center sm:p-12">
                <Compass className="mx-auto h-8 w-8 text-ocean-700" />
                <p className="mt-3 font-poppins text-lg font-semibold text-foreground">{t.excursions.title}</p>
                <p className="mt-2 font-inter text-sm text-muted-foreground">{t.excursions.subtitle}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
                {excursions.map((e, index) => {
                  const content = getLocalizedExcursion(e, locale as SupportedLocale);
                  const Icon = categoryIcon[e.category as keyof typeof categoryIcon] || Compass;
                  return (
                    <AnimateOnScroll key={e.id} direction="up" delay={Math.min(index * 60, 300)}>
                      <Link href={`/excursions/${e.id}`} prefetch className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_8px_30px_rgba(31,41,55,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(31,41,55,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600 focus-visible:ring-offset-4">
                        <div className="relative h-56 overflow-hidden sm:h-60">
                          <Image src={e.image} alt={content.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-1.5 backdrop-blur-md">
                            <Icon className="h-3.5 w-3.5 text-[#FF9A50]" />
                            <span className="font-inter text-[11px] font-semibold uppercase tracking-wider text-white">{categoryLabel[e.category]}</span>
                          </div>
                          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-foreground shadow-sm">
                            <Clock className="h-3.5 w-3.5 text-ocean-700" />
                            <span className="font-inter text-xs font-semibold">{content.duration}</span>
                          </div>
                          {e.popular && <div className="absolute bottom-4 left-4 rounded-full bg-[#FF7418] px-3 py-1 font-inter text-[10px] font-bold uppercase tracking-wide text-white">{t.excursions.popular}</div>}
                        </div>
                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                          <h3 className="font-poppins text-xl font-bold leading-snug text-foreground">{content.name}</h3>
                          <p className="mb-5 mt-3 line-clamp-3 flex-1 font-inter text-sm leading-6 text-muted-foreground">{content.description}</p>
                          <span className="inline-flex min-h-10 items-center gap-2 border-t border-border pt-4 font-inter text-sm font-bold text-ocean-700 transition-all group-hover:gap-3">
                            {t.excursions.viewExcursion}
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </Link>
                    </AnimateOnScroll>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
