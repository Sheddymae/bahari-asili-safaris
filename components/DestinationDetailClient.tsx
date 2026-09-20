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
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-slate-950/10" />
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10">
              <Link href="/destinations" prefetch className="inline-flex items-center gap-1.5 text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] hover:text-white text-sm font-inter mb-4 transition-colors"><ArrowLeft className="w-4 h-4" /> {tt.backToAll}</Link>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-safari-400" /><span className="font-inter text-xs font-semibold text-safari-300 uppercase tracking-wider">{ee.destGuideLabel}</span></div>
                {destination.country && <span className="text-white/90 text-xs drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] font-inter">• {destination.country}</span>}
                {destination.region && <span className="media-text-muted text-xs font-inter">• {destination.region}</span>}
              </div>
              <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">{content.name}</h1>
              <p className="font-inter text-white/90 text-base drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)] mt-2 max-w-2xl">{content.tagline}</p>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <p className="font-inter text-foreground text-base leading-relaxed mb-8 max-w-3xl">{content.intro}</p>
          {content.history && <section className="mb-10 rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-card"><div className="flex items-center gap-3 mb-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sand-50 text-safari-500"><Landmark className="w-5 h-5" /></span><div><p className="font-inter text-xs font-semibold uppercase tracking-widest text-safari-500">{pageLabels.story}</p><h2 className="font-poppins font-bold text-xl sm:text-2xl text-foreground">{pageLabels.historyTitle} {content.name}</h2></div></div><p className="font-inter text-foreground/80 leading-relaxed max-w-4xl">{content.history}</p></section>}
          <div className="grid sm:grid-cols-2 gap-5 mb-12">
            <div className="bg-sand-50 rounded-2xl p-6"><div className="flex items-center gap-2 mb-4"><Sparkles className="w-5 h-5 text-safari-500" /><h2 className="font-poppins font-bold text-lg text-foreground">{tt.wildlifeTitle}</h2></div><ul className="space-y-2">{content.wildlifeHighlights.map((h, i) => <li key={i} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-safari-500 flex-shrink-0 mt-2" /><span className="font-inter text-sm text-foreground leading-relaxed">{h}</span></li>)}</ul></div>
            <div className="bg-ocean-50 rounded-2xl p-6"><div className="flex items-center gap-2 mb-4"><CalendarDays className="w-5 h-5 text-ocean-700" /><h2 className="font-poppins font-bold text-lg text-foreground">{tt.bestTimeTitle}</h2></div><p className="font-inter text-sm text-foreground leading-relaxed">{content.bestSeason}</p></div>
          </div>
          {activities.length > 0 && <section className="mb-12"><div className="flex items-end justify-between gap-4 mb-5"><div><p className="font-inter text-xs font-semibold uppercase tracking-widest text-safari-500">{activityLabels.eyebrow}</p><h2 className="font-poppins font-bold text-2xl text-foreground mt-1">{activityLabels.title} {content.name}</h2></div></div><div className="grid sm:grid-cols-2 gap-5">{activities.map((activity) => { const localized = getLocalizedDestinationActivity(activity.id, locale); if (!localized) return null; return <article key={activity.id} className="overflow-hidden rounded-2xl border border-border bg-white shadow-card hover:shadow-card-hover transition-shadow"><div className="relative h-44"><Image src={activity.image} alt={localized.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" /><span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-inter font-semibold media-text backdrop-blur-sm">{localized.level}</span></div><div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="font-poppins font-bold text-base text-foreground">{localized.name}</h3><span className="shrink-0 font-inter text-xs text-muted-foreground">{localized.duration}</span></div><p className="font-inter text-sm text-foreground/75 leading-relaxed mt-2">{localized.description}</p></div></article>; })}</div></section>}
          {relatedSafaris.length > 0 && <div className="mb-12"><h2 className="font-poppins font-bold text-2xl text-foreground mb-5">{ee.safarisToPrefix} {content.name}</h2><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{relatedSafaris.map((safari) => <Link key={safari.id} href={`/safaris/${safari.id}`} prefetch className="block bg-white rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-shadow overflow-hidden"><div className="relative h-40"><Image src={safari.image} alt={safari.name} fill className="object-cover" sizes="400px" /></div><div className="p-4"><p className="font-poppins font-semibold text-foreground text-sm mb-1">{safari.name}</p><div className="flex items-center gap-3 text-xs text-muted-foreground font-inter"><span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {safari.days} {tt.days}</span><span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-accent text-accent" /> {safari.rating}</span></div></div></Link>)}</div></div>}
          {content.faqs.length > 0 && <div className="mb-12"><h2 className="font-poppins font-bold text-2xl text-foreground mb-5">{tt.faqTitle}</h2><div className="space-y-3">{content.faqs.map((faq, i) => <div key={i} className="border border-border rounded-xl overflow-hidden"><button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-sand-50 transition-colors text-left"><span className="font-inter font-semibold text-sm text-foreground">{faq.q}</span>{openFaq === i ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}</button>{openFaq === i && <div className="px-5 pb-4 bg-white"><p className="font-inter text-sm text-foreground leading-relaxed">{faq.a}</p></div>}</div>)}</div></div>}
          <div className="bg-ocean-700 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4"><div><p className="font-poppins font-bold text-white text-lg drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">{ee.readyToExplore} {content.name}?</p><p className="font-inter media-text-muted text-sm mt-1">{tt.noPricesNote}</p></div><Link href="/tours" prefetch className="flex-shrink-0 bg-safari-500 hover:bg-safari-600 text-white font-poppins font-semibold text-sm px-8 py-3.5 rounded-xl transition-all hover:shadow-md whitespace-nowrap">{tt.bookNow}</Link></div>
        </div>
      </main>
      <Footer />
    </>
  );
}
