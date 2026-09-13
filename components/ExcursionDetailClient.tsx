'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, MapPin, Check, X, Info, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useLanguage } from '@/contexts/LanguageContext';
import { type Excursion, excursions } from '@/lib/tours-data';

export default function ExcursionDetailClient({ excursion }: { excursion: Excursion }) {
  const { t, locale } = useLanguage();

  const name = locale === 'it' ? excursion.nameIt : excursion.name;
  const description = locale === 'it' ? excursion.descriptionIt : excursion.description;
  const startingLocation = (locale === 'it' ? excursion.startingLocationIt : excursion.startingLocation) ?? excursion.startingLocation;
  const whatToExpect = (locale === 'it' ? excursion.whatToExpectIt : excursion.whatToExpect) ?? excursion.whatToExpect ?? [];
  const included = (locale === 'it' ? excursion.includedIt : excursion.included) ?? excursion.included ?? [];
  const notIncluded = (locale === 'it' ? excursion.notIncludedIt : excursion.notIncluded) ?? excursion.notIncluded ?? [];
  const goodToKnow = (locale === 'it' ? excursion.goodToKnowIt : excursion.goodToKnow) ?? excursion.goodToKnow ?? [];
  const ee = t.excursions;

  const related = excursions.filter((e) => e.category === excursion.category && e.id !== excursion.id).slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        {/* Hero */}
        <div className="relative h-[50vh] min-h-[360px]">
          <Image src={excursion.image} alt={name} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10">
              <Link
                href="/excursions"
                prefetch
                className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-inter mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> {ee.backToAll}
              </Link>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-inter font-semibold">
                  <Clock className="w-3.5 h-3.5" /> {excursion.duration}
                </span>
              </div>
              <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                {name}
              </h1>
              <p className="font-inter text-white/85 text-base mt-2 max-w-2xl">{description}</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          {startingLocation && (
            <div className="flex items-center gap-2 mb-8 text-muted-foreground font-inter text-sm">
              <MapPin className="w-4 h-4 text-safari-500" />
              {startingLocation}
            </div>
          )}

          {/* Highlights */}
          <div className="flex flex-wrap gap-2 mb-10">
            {excursion.highlights.map((h, i) => (
              <span
                key={i}
                className="bg-sand-50 text-foreground font-inter text-sm px-3 py-1.5 rounded-full border border-sand-200"
              >
                {h}
              </span>
            ))}
          </div>

          {/* What to expect */}
          {whatToExpect.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-safari-500" />
                <h2 className="font-poppins font-bold text-xl text-foreground">{ee.whatToExpect}</h2>
              </div>
              <ul className="space-y-3">
                {whatToExpect.map((line, i) => (
                  <li key={i} className="font-inter text-foreground text-base leading-relaxed flex gap-3">
                    <span className="w-1.5 h-1.5 mt-2.5 bg-safari-500 rounded-full flex-shrink-0" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Included / Not included */}
          {(included.length > 0 || notIncluded.length > 0) && (
            <div className="grid sm:grid-cols-2 gap-5 mb-12">
              {included.length > 0 && (
                <div className="bg-sand-50 rounded-2xl p-6">
                  <h3 className="font-poppins font-bold text-base text-foreground mb-4">{ee.includedTitle}</h3>
                  <ul className="space-y-2.5">
                    {included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 font-inter text-sm text-foreground">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {notIncluded.length > 0 && (
                <div className="bg-sand-50 rounded-2xl p-6">
                  <h3 className="font-poppins font-bold text-base text-foreground mb-4">{ee.notIncludedTitle}</h3>
                  <ul className="space-y-2.5">
                    {notIncluded.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 font-inter text-sm text-muted-foreground">
                        <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Good to know */}
          {goodToKnow.length > 0 && (
            <div className="mb-12 border border-safari-200 bg-safari-50/40 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-safari-600" />
                <h3 className="font-poppins font-bold text-base text-foreground">{ee.goodToKnow}</h3>
              </div>
              <ul className="space-y-2">
                {goodToKnow.map((line, i) => (
                  <li key={i} className="font-inter text-sm text-foreground leading-relaxed">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="bg-foreground rounded-2xl p-8 sm:p-10 text-center">
            <h3 className="font-poppins font-bold text-2xl text-white mb-3">{ee.askAboutExcursion.replace('this excursion', name)}</h3>
            <p className="font-inter text-white/70 text-sm mb-6 max-w-lg mx-auto">
              Tell us your dates and group size {'\u2014'} we&apos;ll confirm availability and, if it&apos;s useful, suggest a safari
              to pair it with.
            </p>
            <Link
              href={`/?book=${excursion.id}`}
              className="inline-flex items-center justify-center gap-2 bg-safari-500 hover:bg-safari-600 text-white font-poppins font-semibold text-sm px-8 py-3.5 rounded-xl transition-all hover:shadow-md"
            >
              {ee.requestThisExcursion}
            </Link>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <h3 className="font-poppins font-bold text-xl text-foreground mb-6">{ee.moreLikeThis}</h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/excursions/${r.id}`}
                    prefetch
                    className="group rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-shadow bg-white"
                  >
                    <div className="relative h-32 w-full overflow-hidden">
                      <Image
                        src={r.image}
                        alt={r.name}
                        fill
                        sizes="33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-poppins font-semibold text-sm text-foreground">{r.name}</p>
                      <p className="font-inter text-xs text-muted-foreground mt-1">{r.duration}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
