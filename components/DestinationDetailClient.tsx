'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Clock, ChevronDown, ChevronUp, Sparkles, CalendarDays, ArrowLeft, Landmark } from 'lucide-react';
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
      <main className="overflow-x-hidden">
        <div className="relative h-[50vh] min-h-[360px]">
          <Image src={destination.heroImage} alt={content.name} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="mx-auto w-full max-w-5xl min-w-0 px-4 pb-10 sm:px-6 lg:px-8">
              <Link href="/destinations" prefetch className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-inter mb-4 transition-colors"><ArrowLeft className="w-4 h-4" /> {tt.backToAll}</Link>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-safari-400" /><span className="font-inter text-xs font-semibold text-safari-300 uppercase tracking-wider">{ee.destGuideLabel}</span></div>
                {destination.country && <span className="text-white/70 text-xs font-inter">• {destination.country}</span>}
                {destination.region && <span className="text-white/60 text-xs font-inter">• {destination.region}</span>}
              </div>
              <h1 className="max-w-full break-words font-poppins text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">{content.name}</h1>
              <p className="mt-2 max-w-2xl break-words font-inter text-base leading-relaxed text-white/90">{content.tagline}</p>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-5xl min-w-0 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <p className="mb-8 max-w-3xl break-words font-inter text-base leading-relaxed text-foreground">{content.intro}</p>
          {content.history && <section className="mb-10 rounded-xl border border-border bg-white p-5 sm:p-7"><div className="flex items-center gap-3 mb-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sand-50 text-safari-500"><Landmark className="w-5 h-5" /></span><div><p className="font-inter text-xs font-semibold uppercase tracking-widest text-safari-500">{pageLabels.story}</p><h2 className="font-poppins font-bold text-xl sm:text-2xl text-foreground">{pageLabels.historyTitle} {content.name}</h2></div></div><p className="font-inter text-foreground/80 leading-relaxed max-w-4xl">{content.history}</p></section>}
          <div className="mb-12 grid min-w-0 gap-5 sm:grid-cols-2">
            <div className="min-w-0 rounded-xl border border-border bg-sand-50 p-5 sm:p-6"><div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-safari-500" /><h2 className="font-poppins font-bold text-lg text-foreground">{tt.wildlifeTitle}</h2></div><ul className="space-y-2">{content.wildlifeHighlights.map((h, i) => <li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-safari-500 flex-shrink-0 mt-2" /><span className="font-inter text-sm text-foreground leading-relaxed">{h}</span></li>)}</ul></div>
            <div className="min-w-0 rounded-xl border border-ocean-100 bg-ocean-50 p-5 sm:p-6"><div className="flex items-center gap-2 mb-4"><CalendarDays className="w-5 h-5 text-ocean-700" /><h2 className="font-poppins font-bold text-lg text-foreground">{tt.bestTimeTitle}</h2></div><p className="font-inter text-sm text-foreground leading-relaxed">{content.bestSeason}</p></div>
          </div>
          {activities.length > 0 && <section className="mb-12"><div className="mb-5 flex min-w-0 flex-col items-start justify-between gap-3 sm:flex-row sm:items-end"><div><p className="font-inter text-xs font-semibold uppercase tracking-widest text-safari-500">{activityLabels.eyebrow}</p><h2 className="mt-1 break-words font-poppins text-2xl font-bold text-foreground">{activityLabels.title} {content.name}</h2></div></div><div className="grid min-w-0 gap-5 sm:grid-cols-2">{activities.map((activity) => { const localized = getLocalizedDestinationActivity(activity.id, locale); if (!localized) return null; return <article key={activity.id} className="min-w-0 overflow-hidden rounded-xl border border-border bg-white transition-colors hover:border-ocean-300"><div className="relative h-44"><Image src={activity.image} alt={localized.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" /><span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] break-words rounded-full bg-black/75 px-3 py-1 text-xs font-inter font-semibold text-white">{localized.level}</span></div><div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="font-poppins font-bold text-base text-foreground">{localized.name}</h3><span className="shrink-0 font-inter text-xs text-muted-foreground">{localized.duration}</span></div><p className="font-inter text-sm text-foreground/75 leading-relaxed mt-2">{localized.description}</p></div></article>; })}</div></section>}
          {relatedSafaris.length > 0 && <div className="mb-12"><h2 className="font-poppins font-bold text-2xl text-foreground mb-5">{ee.safarisToPrefix} {content.name}</h2><div className="grid min-w-0 gap-5 sm:grid-cols-2 lg:grid-cols-3">{relatedSafaris.map((safari) => <Link key={safari.id} href={`/safaris/${safari.id}`} prefetch className="block min-w-0 overflow-hidden rounded-xl border border-border bg-white transition-colors hover:border-ocean-300"><div className="relative h-40"><Image src={safari.image} alt={safari.name} fill className="object-cover" sizes="400px" /></div><div className="p-4"><p className="mb-1 break-words font-poppins text-sm font-semibold text-foreground">{safari.name}</p><div className="flex items-center gap-3 text-xs text-muted-foreground font-inter"><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {safari.days} {tt.days}</span><span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-accent text-accent" /> {safari.rating}</span></div></div></Link>)}</div></div>}
          {content.faqs.length > 0 && <div className="mb-12"><h2 className="font-poppins font-bold text-2xl text-foreground mb-5">{tt.faqTitle}</h2><div className="space-y-3">{content.faqs.map((faq, i) => <div key={i} className="border border-border rounded-xl overflow-hidden"><button type="button" aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex min-h-11 w-full items-center justify-between gap-4 bg-white px-5 py-4 text-left transition-colors hover:bg-sand-50"><span className="min-w-0 break-words font-inter text-sm font-semibold text-foreground">{faq.q}</span>{openFaq === i ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}</button>{openFaq === i && <div className="px-5 pb-4 bg-white"><p className="font-inter text-sm text-foreground leading-relaxed">{faq.a}</p></div>}</div>)}</div></div>}
          <div className="flex min-w-0 flex-col items-start justify-between gap-4 rounded-xl bg-ocean-700 p-5 sm:flex-row sm:items-center sm:p-8"><div className="min-w-0"><p className="break-words font-poppins text-lg font-bold text-white">{ee.readyToExplore} {content.name}?</p><p className="font-inter text-white/70 text-sm mt-1">{tt.noPricesNote}</p></div><Link href="/tours" prefetch className="inline-flex min-h-11 max-w-full flex-shrink-0 items-center justify-center rounded-lg bg-safari-500 px-6 py-3.5 text-center font-poppins text-sm font-semibold text-white transition-colors hover:bg-safari-600">{tt.bookNow}</Link></div>
        </div>
      </main>
      <Footer />
    </>
  );
}
