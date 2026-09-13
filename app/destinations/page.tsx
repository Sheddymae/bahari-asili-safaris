'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';

import PageShell from '@/components/PageShell';
import { destinations } from '@/lib/destinations-data';
import { getLocalizedDestination } from '@/lib/destination-translations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DestinationsPage() {
  const { t, locale } = useLanguage();

  return (
    <PageShell>
      <section className="py-16 lg:py-24 bg-sand-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="font-inter text-safari-500 font-semibold text-sm tracking-widest uppercase block mb-2">
              {t.destinationsPage.label}
            </span>

            <h1 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
              {t.destinationsPage.title}
            </h1>

            <p className="font-inter text-muted-foreground max-w-2xl mx-auto">
              {t.destinationsPage.description}
            </p>
          </div>

          {/* Destinations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {destinations.map((d) => {
            const content = getLocalizedDestination(d, locale);
            return (
              <Link
                key={d.slug}
                href={`/destinations/${d.slug}`}
                prefetch
                className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow bg-white"
              >
                <div className="relative h-64 w-full overflow-hidden">

                  <Image
                    src={d.heroImage}
                    alt={`${content.name} ${t.destinationsPage.safariDestination}, Kenya`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-1.5 text-white/80 text-xs font-inter font-medium mb-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {t.destinationsPage.kenya}
                    </div>

                    <h2 className="font-poppins font-bold text-2xl text-white">
                      {d.name}
                    </h2>
                  </div>
                </div>

                <div className="p-6">

                  <p className="font-inter text-sm text-muted-foreground mb-4 line-clamp-2">
                    {content.tagline}
                  </p>

                  <span className="inline-flex items-center gap-1.5 font-inter text-sm font-semibold text-ocean-700 group-hover:gap-2.5 transition-all">
                    {t.destinationsPage.explore} {content.name}
                    <ArrowRight className="w-4 h-4" />
                  </span>

                </div>
              </Link>
            );
          })}
          </div>

        </div>
      </section>
    </PageShell>
  );
}