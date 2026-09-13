'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { destinations } from '@/lib/destinations-data';

export default function HomeDestinationsSection() {
  const { t } = useLanguage();
  const e = t.homeExtras;

  return (
    <section className="py-20 lg:py-28 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-inter text-safari-500 font-semibold text-sm tracking-widest uppercase block mb-2">
              {e.destLabel}
            </span>
            <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">
              {e.destTitle}
            </h2>
          </div>
          <p className="font-inter text-muted-foreground text-base max-w-md lg:text-right">
            {e.destSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {destinations.map((d) => (
            <Link
              key={d.slug}
              href={`/destinations/${d.slug}`}
              prefetch
              className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow h-64 sm:h-80"
            >
              <Image
                src={d.heroImage}
                alt={`${d.name} safari destination, Kenya`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <h3 className="font-poppins font-bold text-lg sm:text-xl text-white leading-tight">{d.name}</h3>
                <span className="hidden sm:block mt-1.5 font-inter text-xs text-white/80 group-hover:text-white transition-colors line-clamp-2">
                  {d.tagline}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/destinations"
            prefetch
            className="inline-flex items-center gap-2 font-inter font-semibold text-sm text-ocean-700 hover:text-ocean-800 transition-colors"
          >
            {e.destCta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
