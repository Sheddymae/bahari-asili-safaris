'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';

import PageShell from '@/components/PageShell';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { destinations } from '@/lib/destinations-data';
import { getLocalizedDestination } from '@/lib/destination-translations';
import { useLanguage } from '@/contexts/LanguageContext';

function staggerDelay(index: number) {
  return Math.min(index * 60, 360);
}

export default function DestinationsPage() {
  const { t, locale } = useLanguage();

  return (
    <PageShell>
      <section className="py-16 lg:py-24 bg-sand-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll direction="up">
            <div className="text-center mb-12 lg:mb-14">
              <span className="font-inter text-safari-500 font-semibold text-sm tracking-widest uppercase block mb-2">{t.destinationsPage.label}</span>
              <h1 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">{t.destinationsPage.title}</h1>
              <p className="font-inter text-muted-foreground max-w-3xl mx-auto">{t.destinationsPage.description}</p>
            </div>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {destinations.map((d, i) => {
              const content = getLocalizedDestination(d, locale);
              return (
                <AnimateOnScroll key={d.slug} direction="up" delay={staggerDelay(i)}>
                  <Link
                    href={`/destinations/${d.slug}`}
                    prefetch
                    className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 bg-white block hover:-translate-y-1"
                  >
                    <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                      <Image src={d.heroImage} alt={`${content.name} ${t.destinationsPage.safariDestination}${d.country ? `, ${d.country}` : ''}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                      <div className="absolute top-4 left-4 rounded-full border border-white/25 bg-black/20 px-3 py-1 backdrop-blur-md">
                        <span className="font-inter text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/90">{d.country || 'East Africa'}</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="flex items-center gap-1.5 text-white/80 text-xs font-inter font-medium mb-1.5"><MapPin className="w-3.5 h-3.5" />{d.region || d.country || t.destinationsPage.kenya}</div>
                        <h2 className="font-poppins font-bold text-2xl text-white leading-tight">{content.name}</h2>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="font-inter text-sm text-muted-foreground mb-4 line-clamp-3 min-h-[4.5rem]">{content.tagline}</p>
                      <span className="inline-flex items-center gap-1.5 font-inter text-sm font-semibold text-ocean-700 group-hover:gap-2.5 transition-all">{t.destinationsPage.explore} {content.name}<ArrowRight className="w-4 h-4" /></span>
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
