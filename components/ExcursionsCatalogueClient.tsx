'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Excursion } from '@/lib/tours-data';
import { getLocalizedExcursion, type SupportedLocale } from '@/lib/excursion-content-i18n';

export default function ExcursionsCatalogueClient({ excursions }: { excursions: Excursion[] }) {
  const { t, locale } = useLanguage();
  const categoryLabel: Record<string, string> = { marine: t.excursions.marineCategory, nature: t.excursions.natureCategory, culture: t.excursions.cultureCategory };
  return (
    <PageShell>
      <section className="min-h-screen bg-sand-50 py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-2 block text-sm font-semibold uppercase tracking-widest text-safari-500">{t.nav.excursions}</span>
            <h1 className="mb-4 font-poppins text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">{t.excursions.title} {t.excursions.titleHighlight}</h1>
            <p className="mx-auto max-w-2xl text-muted-foreground">{t.excursions.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {excursions.map((e) => {
              const content = getLocalizedExcursion(e, locale as SupportedLocale);
              return (
                <Link key={e.id} href={`/excursions/${e.id}`} prefetch className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-card transition-shadow hover:shadow-card-hover">
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image src={e.image} alt={content.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 media-overlay" />
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 backdrop-blur-sm"><Clock className="h-3 w-3 text-safari-500" /><span className="text-xs font-semibold text-foreground">{content.duration}</span></div>
                    {e.popular && <div className="absolute left-3 top-3 rounded-full bg-safari-500 px-3 py-1 shadow-sm"><span className="text-[10px] font-bold uppercase tracking-wide media-text">{t.excursions.popular}</span></div>}
                    <div className="absolute bottom-0 left-0 right-0 p-5"><span className="mb-1 block text-[11px] font-semibold uppercase tracking-widest media-text-muted">{categoryLabel[e.category]}</span><h2 className="font-poppins text-xl font-bold leading-snug media-text">{content.name}</h2></div>
                  </div>
                  <div className="flex flex-1 flex-col p-6"><p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">{content.description}</p><span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-700 transition-all group-hover:gap-2.5">{t.excursions.viewExcursion}<ArrowRight className="h-4 w-4" /></span></div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
