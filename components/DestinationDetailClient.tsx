'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Clock, ChevronDown, ChevronUp, Sparkles, CalendarDays, ArrowLeft, Landmark, ArrowUpRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { type Destination, getSafarisForDestination } from '@/lib/destinations-data';
import { getLocalizedDestination } from '@/lib/destination-translations';
import { getExpandedLocalizedDestination } from '@/lib/expanded-destination-translations';
import { destinationPageLabels } from '@/lib/destination-page-i18n';
import { regionalSafaris } from '@/lib/regional-safaris';
import { getRegionalSafariDestinationSlugs } from '@/lib/regional-safari-destinations';
import { getActivitiesForDestination } from '@/lib/destination-activities';
import { getLocalizedDestinationActivity, destinationActivitiesLabels } from '@/lib/destination-activities-i18n';

export default function DestinationDetailClient({ destination }: { destination: Destination }) {
  const { t, locale } = useLanguage();
  const content = getExpandedLocalizedDestination(getLocalizedDestination(destination, locale), locale);
  const tt = t.tours;
  const ee = t.homeExtras;
  const pageLabels = destinationPageLabels[locale];
  const activityLabels = destinationActivitiesLabels[locale];
  const baseSafaris = getSafarisForDestination(destination.slug);
  const regionalForDestination = regionalSafaris.filter((safari) => getRegionalSafariDestinationSlugs(safari.id).includes(destination.slug));
  const relatedSafaris = [...baseSafaris, ...regionalForDestination].filter((safari, index, all) => all.findIndex((item) => item.id === safari.id) === index);
  const activities = getActivitiesForDestination(destination.slug);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden bg-paper pt-20">
        <section className="relative min-h-[70vh] lg:min-h-[78vh] flex items-end overflow-hidden">
          <Image src={destination.heroImage} alt={content.name} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/5" />
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-9 sm:pb-12 lg:pb-16">
            <Link href="/destinations" prefetch className="inline-flex items-center gap-2 font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-white/75 hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-3.5 h-3.5" /> {tt.backToAll}
            </Link>

            <div className="grid lg:grid-cols-[1fr_0.7fr] gap-8 lg:gap-16 items-end">
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 font-mono-editorial text-[10px] uppercase tracking-[0.16em] text-orange-200">
                    <MapPin className="w-3.5 h-3.5" /> {ee.destGuideLabel}
                  </span>
                  {destination.country && <span className="font-mono-editorial text-[10px] uppercase tracking-[0.16em] text-white/65">{destination.country}</span>}
                  {destination.region && <span className="font-mono-editorial text-[10px] uppercase tracking-[0.16em] text-white/55">{destination.region}</span>}
                </div>
                <h1 className="font-editorial text-6xl sm:text-7xl lg:text-8xl font-normal leading-[0.86] tracking-tight text-white max-w-5xl">{content.name}</h1>
              </div>
              <p className="font-grotesk text-sm sm:text-base leading-7 text-white/80 max-w-xl lg:justify-self-end">{content.tagline}</p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="grid lg:grid-cols-[0.75fr_1.25fr] gap-8 lg:gap-20 py-14 lg:py-20 border-b border-line">
            <div>
              <p className="editorial-label">{pageLabels.story}</p>
              <div className="editorial-rule mt-4" />
            </div>
            <p className="font-editorial text-2xl sm:text-3xl lg:text-4xl leading-[1.15] text-ink">{content.intro}</p>
          </section>

          {content.history && (
            <section className="grid lg:grid-cols-[0.75fr_1.25fr] gap-8 lg:gap-20 py-12 lg:py-16 border-b border-line">
              <div>
                <p className="editorial-label">{pageLabels.historyTitle}</p>
                <h2 className="font-editorial text-2xl lg:text-3xl text-ink mt-3">{content.name}</h2>
              </div>
              <p className="font-grotesk text-sm sm:text-base leading-7 text-ink-soft max-w-3xl">{content.history}</p>
            </section>
          )}

          <section className="grid lg:grid-cols-2 border-b border-line">
            <div className="py-12 lg:py-16 lg:pr-12 lg:border-r border-line">
              <div className="flex items-center gap-3 mb-7">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-ink">{tt.wildlifeTitle}</h2>
              </div>
              <ul className="divide-y divide-line">
                {content.wildlifeHighlights.map((h, i) => (
                  <li key={i} className="py-4 flex gap-4">
                    <span className="font-mono-editorial text-[10px] text-muted pt-1">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-grotesk text-sm leading-6 text-ink-soft">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="py-12 lg:py-16 lg:pl-12">
              <div className="flex items-center gap-3 mb-7">
                <CalendarDays className="w-4 h-4 text-ocean-600" />
                <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-ink">{tt.bestTimeTitle}</h2>
              </div>
              <p className="font-grotesk text-sm sm:text-base leading-7 text-ink-soft max-w-xl">{content.bestSeason}</p>
            </div>
          </section>

          {activities.length > 0 && (
            <section className="py-14 lg:py-20 border-b border-line">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-9">
                <div>
                  <p className="editorial-label">{activityLabels.eyebrow}</p>
                  <h2 className="font-editorial text-4xl sm:text-5xl text-ink mt-2">{activityLabels.title} {content.name}</h2>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {activities.map((activity) => {
                  const localized = getLocalizedDestinationActivity(activity.id, locale);
                  if (!localized) return null;
                  return (
                    <article key={activity.id} className="group">
                      <div className="relative aspect-[4/3] overflow-hidden bg-sand-100">
                        <Image src={activity.image} alt={localized.name} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px" />
                        <span className="absolute left-3 top-3 bg-ink/80 px-2.5 py-1 font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-white">{localized.level}</span>
                      </div>
                      <div className="border-b border-line py-4">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-editorial text-2xl text-ink">{localized.name}</h3>
                          <span className="shrink-0 font-mono-editorial text-[9px] uppercase tracking-[0.12em] text-muted">{localized.duration}</span>
                        </div>
                        <p className="font-grotesk text-sm leading-6 text-ink-soft mt-2">{localized.description}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {relatedSafaris.length > 0 && (
            <section className="py-14 lg:py-20 border-b border-line">
              <div className="flex items-end justify-between gap-5 mb-9">
                <div>
                  <p className="editorial-label">{ee.safarisToPrefix}</p>
                  <h2 className="font-editorial text-4xl sm:text-5xl text-ink mt-2">{content.name}</h2>
                </div>
                <Link href="/tours" prefetch className="hidden sm:inline-flex items-center gap-2 font-mono-editorial text-[10px] uppercase tracking-[0.14em] text-ink hover:text-orange-600 transition-colors">
                  {tt.bookNow} <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {relatedSafaris.map((safari) => (
                  <Link key={safari.id} href={`/safaris/${safari.id}`} prefetch className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-sand-100">
                      <Image src={safari.image} alt={safari.name} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px" />
                    </div>
                    <div className="border-b border-line py-4">
                      <h3 className="font-editorial text-2xl text-ink">{safari.name}</h3>
                      <div className="flex items-center gap-4 mt-2 font-mono-editorial text-[9px] uppercase tracking-[0.12em] text-muted">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {safari.days} {tt.days}</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-current" /> {safari.rating}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {content.faqs.length > 0 && (
            <section className="py-14 lg:py-20 border-b border-line">
              <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-8 lg:gap-20">
                <div>
                  <p className="editorial-label">{tt.faqTitle}</p>
                  <h2 className="font-editorial text-4xl sm:text-5xl text-ink mt-2">{content.name}</h2>
                </div>
                <div className="divide-y divide-line border-t border-line">
                  {content.faqs.map((faq, i) => (
                    <div key={i}>
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-start justify-between gap-6 py-5 text-left"
                        aria-expanded={openFaq === i}
                      >
                        <span className="font-grotesk font-semibold text-sm sm:text-base text-ink">{faq.q}</span>
                        {openFaq === i ? <ChevronUp className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-muted shrink-0 mt-0.5" />}
                      </button>
                      {openFaq === i && <div className="pb-5 pr-8"><p className="font-grotesk text-sm leading-6 text-ink-soft">{faq.a}</p></div>}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="py-16 lg:py-24">
            <div className="bg-ocean-deep px-6 py-12 sm:px-10 lg:px-16 lg:py-16 grid lg:grid-cols-[1fr_auto] gap-8 items-end">
              <div>
                <p className="editorial-label !text-white/55">{ee.readyToExplore}</p>
                <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white mt-2">{content.name}?</h2>
                <p className="font-grotesk text-sm leading-6 text-white/65 mt-4 max-w-xl">{tt.noPricesNote}</p>
              </div>
              <Link href="/tours" prefetch className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-grotesk font-semibold text-sm px-7 py-3.5 transition-colors whitespace-nowrap">
                {tt.bookNow} <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
