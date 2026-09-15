'use client';

import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Calendar, MapPin, Star, Clock } from 'lucide-react';
import PageShell from '@/components/PageShell';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { safaris, excursions } from '@/lib/safari-catalogue';
import { getGroupTours, type GroupTour } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { groupDepartureLabels } from '@/lib/group-departure-i18n';

const BookingModal = dynamic(() => import('@/components/BookingModal'), { ssr: false });

function isDayTrip(duration: string): boolean {
  const d = duration.toLowerCase();
  if (d.includes('night')) return false;
  const multiDayMatch = d.match(/(\d+)\s*day/);
  if (multiDayMatch && parseInt(multiDayMatch[1], 10) > 1) return false;
  return true;
}

function formatDepartureDate(iso: string, locale: string) {
  const intl = locale === 'zh' ? 'zh-CN' : locale === 'ar' ? 'ar' : locale === 'sw' ? 'sw-KE' : `${locale}-${locale === 'de' ? 'DE' : locale === 'fr' ? 'FR' : locale === 'it' ? 'IT' : locale === 'es' ? 'ES' : 'GB'}`;
  return new Date(iso + 'T00:00:00').toLocaleDateString(intl, { month: 'short', day: 'numeric' });
}

function staggerDelay(index: number) {
  return Math.min(index * 80, 400);
}

function ToursPageInner() {
  const { t, locale } = useLanguage();
  const groupLabels = groupDepartureLabels[locale];
  const [programs, setPrograms] = useState<typeof safaris>([]);
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'day' ? 'day' : searchParams.get('tab') === 'group' ? 'group' : 'private';
  const [groupTours, setGroupTours] = useState<GroupTour[] | null>(null);
  const [selectedTour, setSelectedTour] = useState<string | null>(null);
  const [programsLoading, setProgramsLoading] = useState(true);

  useEffect(() => { getGroupTours().then(setGroupTours); }, []);
  useEffect(() => {
    let active = true;
    setProgramsLoading(true);
    fetch(`/api/programs?locale=${locale}`)
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        if (d.success && Array.isArray(d.programs)) setPrograms(d.programs);
        else setPrograms([]);
      })
      .catch(() => { if (active) setPrograms([]); })
      .finally(() => { if (active) setProgramsLoading(false); });
    return () => { active = false; };
  }, [locale]);

  const dayTrips = useMemo(() => excursions.filter((e) => isDayTrip(e.duration)), []);
  const openBooking = useCallback((name: string) => setSelectedTour(name), []);
  const closeBooking = useCallback(() => setSelectedTour(null), []);

  return (
    <PageShell>
      <section className="py-16 lg:py-24 bg-sand-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll direction="up">
            <div className="text-center mb-10">
              <span className="font-inter text-safari-500 font-semibold text-sm tracking-widest uppercase block mb-2">{t.nav.tours}</span>
              <h1 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground">{t.tours.title} {t.tours.titleHighlight}</h1>
            </div>
          </AnimateOnScroll>

          <Tabs defaultValue={initialTab} className="w-full">
            <TabsList className="mx-auto flex w-full max-w-xl bg-white border border-border rounded-full p-1 h-auto mb-10">
              <TabsTrigger value="group" className="flex-1 rounded-full py-2.5 font-inter text-sm data-[state=active]:bg-ocean-700 data-[state=active]:text-white">{t.tours.groupJoining}</TabsTrigger>
              <TabsTrigger value="private" className="flex-1 rounded-full py-2.5 font-inter text-sm data-[state=active]:bg-ocean-700 data-[state=active]:text-white">{t.tours.private}</TabsTrigger>
              <TabsTrigger value="day" className="flex-1 rounded-full py-2.5 font-inter text-sm data-[state=active]:bg-ocean-700 data-[state=active]:text-white">{t.tours.dayTrips}</TabsTrigger>
            </TabsList>

            <TabsContent value="group">
              {groupTours === null ? (
                <div className="text-center py-16 font-inter text-muted-foreground">{t.tours.loadingDepartures}</div>
              ) : groupTours.length === 0 ? (
                <div className="text-center py-16"><Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" /><p className="font-inter text-muted-foreground">{t.tours.noOpenDepartures}</p></div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {groupTours.map((gt, i) => {
                    const date = formatDepartureDate(gt.departure_date, locale);
                    const seats = gt.seats_left;
                    const summary = gt.joined_names.length > 0 && gt.joined_nationality
                      ? groupLabels.joining.replace('{count}', String(gt.joined_names.length)).replace('{nationality}', gt.joined_nationality).replace('{date}', date).replace('{seats}', String(seats)).replace('{seatWord}', seats === 1 ? groupLabels.seat : groupLabels.seats)
                      : `${groupLabels.seatsLeft.replace('{seats}', String(seats))} — ${groupLabels.firstToJoin}`;
                    return (
                      <AnimateOnScroll key={gt.id} direction="up" delay={staggerDelay(i)}>
                        <div className="bg-white rounded-2xl border border-border shadow-card p-6 flex flex-col h-full">
                          <div className="flex items-center gap-2 text-ocean-700 mb-3"><Calendar className="w-4 h-4" /><span className="font-inter text-sm font-semibold">{date}</span></div>
                          <h3 className="font-poppins font-bold text-lg text-foreground mb-2">{gt.safari_name}</h3>
                          <p className="font-inter text-sm text-foreground mb-4 flex-1">{summary}</p>
                          <button onClick={() => openBooking(gt.safari_name)} className="bg-book hover:bg-book-600 text-white font-poppins font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">{t.inquiryStatus.requestToJoin}</button>
                        </div>
                      </AnimateOnScroll>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="private">
              {programsLoading ? (
                <div className="text-center py-16 font-inter text-muted-foreground">{t.tours.loadingDepartures}</div>
              ) : programs.length === 0 ? (
                <div className="text-center py-16 font-inter text-muted-foreground">{t.tours.noOpenDepartures}</div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {programs.map((s, i) => (
                    <AnimateOnScroll key={s.id} direction="up" delay={staggerDelay(i)}>
                      <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden flex flex-col h-full">
                        <div className="relative h-40 w-full"><Image src={s.image} alt={s.name} fill className="object-cover" /></div>
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="font-poppins font-bold text-base text-foreground mb-1">{s.name}</h3>
                          <p className="font-inter text-xs text-muted-foreground mb-3 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {s.parks.join(', ')}</p>
                          <div className="flex items-center gap-1 mb-4"><Star className="w-3.5 h-3.5 fill-safari-500 text-safari-500" /><span className="font-inter text-xs text-foreground">{s.rating} ({s.reviewCount})</span><span className="font-inter text-xs text-muted-foreground ml-auto">{s.days}D/{s.nights}N</span></div>
                          <Link href={`/safaris/${s.id}`} prefetch className="mt-auto text-center border border-book text-book hover:bg-book/5 font-poppins font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">{t.tours.bookNow}</Link>
                        </div>
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="day">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {dayTrips.map((e, i) => (
                  <AnimateOnScroll key={e.id} direction="up" delay={staggerDelay(i)}>
                    <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden flex flex-col h-full">
                      <div className="relative h-40 w-full"><Image src={e.image} alt={e.name} fill className="object-cover" /></div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-poppins font-bold text-base text-foreground mb-1">{e.name}</h3>
                        <p className="font-inter text-xs text-muted-foreground mb-4 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {e.duration}</p>
                        <button onClick={() => openBooking(e.name)} className="mt-auto bg-book hover:bg-book-600 text-white font-poppins font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">{t.common.bookNow}</button>
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      {selectedTour && <BookingModal isOpen={!!selectedTour} onClose={closeBooking} selectedTour={selectedTour} />}
    </PageShell>
  );
}

export default function ToursPageClient() { return <Suspense fallback={null}><ToursPageInner /></Suspense>; }