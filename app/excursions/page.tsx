import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import PageShell from '@/components/PageShell';
import { excursions } from '@/lib/tours-data';
import { useLanguage } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  title: 'Watamu Excursions — Marine, Nature & Culture Day Trips',
  description:
    'Day and half-day excursions from Watamu: snorkelling at Mida Creek, mangrove canoe trips, Gede Ruins, Marafa gorge, Malindi town, and Dabaso village. Book alongside or instead of a safari.',
  alternates: { canonical: '/excursions' },
  openGraph: {
    title: 'Watamu Excursions — Bahari Asili Safaris',
    description:
      'Marine, nature, and cultural excursions from Watamu — snorkelling, mangroves, ruins, and village life on the Kenyan coast.',
    type: 'website',
    url: '/excursions',
  },
};



export default function ExcursionsPage() {
  const { t } = useLanguage();
  const categoryLabel: Record<string, string> = {
    marine: t.excursions.marineCategory,
    nature: t.excursions.natureCategory,
    culture: t.excursions.cultureCategory,
  };
  return (
    <PageShell>
      <section className="py-16 lg:py-24 bg-sand-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="font-inter text-safari-500 font-semibold text-sm tracking-widest uppercase block mb-2">
              {t.nav.excursions}
            </span>
            <h1 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
              {t.excursions.title} {t.excursions.titleHighlight}
            </h1>
            <p className="font-inter text-muted-foreground max-w-2xl mx-auto">
              {t.excursions.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {excursions.map((e) => (
              <Link
                key={e.id}
                href={`/excursions/${e.id}`}
                prefetch
                className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow bg-white flex flex-col"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={e.image}
                    alt={e.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-safari-500" />
                    <span className="font-inter text-xs font-semibold text-foreground">{e.duration}</span>
                  </div>
                  {e.popular && (
                    <div className="absolute top-3 left-3 bg-safari-500 rounded-full px-3 py-1 shadow-sm">
                      <span className="font-inter font-bold text-[10px] tracking-wide uppercase text-white">
                        {t.excursions.popular}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="font-inter text-white/70 text-[11px] font-semibold tracking-widest uppercase block mb-1">
                      {categoryLabel[e.category]}
                    </span>
                    <h2 className="font-poppins font-bold text-xl text-white leading-snug">{e.name}</h2>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="font-inter text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                    {e.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-inter text-sm font-semibold text-ocean-700 group-hover:gap-2.5 transition-all">
                    {t.excursions.viewExcursion}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
