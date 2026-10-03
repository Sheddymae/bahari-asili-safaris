'use client';

import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Calendar, ArrowUpRight, Compass } from 'lucide-react';
import PageShell from '@/components/PageShell';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { safaris, excursions } from '@/lib/safari-catalogue';
import { getGroupTours, type GroupTour } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { groupDepartureLabels } from '@/lib/group-departure-i18n';
import { getLocalizedSafari, type SafariLocale } from '@/lib/safari-content-i18n';
import { getLocalizedExcursion, type SupportedLocale } from '@/lib/excursion-content-i18n';

const BookingModal = dynamic(() => import('@/components/BookingModal'), { ssr: false });

function isDayTrip(duration: string): boolean {
  const d = duration.toLowerCase();
  if (d.includes('night')) return false;
  const multiDayMatch = d.match(/(\d+)\s*day/);
  if (multiDayMatch && parseInt(multiDayMatch[1], 10) > 1) return false;
  return true;
}

function formatDepartureDate(iso: string, locale: string) {
  const intl =
    locale === 'zh'
      ? 'zh-CN'
      : locale === 'ar'
        ? 'ar'
        : locale === 'sw'
          ? 'sw-KE'
          : `${locale}-${locale === 'de' ? 'DE' : locale === 'fr' ? 'FR' : locale === 'it' ? 'IT' : locale === 'es' ? 'ES' : 'GB'}`;

  return new Date(iso + 'T00:00:00').toLocaleDateString(intl, {
    month: 'short',
    day: 'numeric',
  });
}

function staggerDelay(index: number) {
  return Math.min(index * 80, 400);
}

function ToursPageInner() {
  const { t, locale } = useLanguage();
  const groupLabels = groupDepartureLabels[locale];
  const [programs, setPrograms] = useState<typeof safaris>([]);
  const [managedExcursions, setManagedExcursions] = useState<typeof excursions>(excursions);
  const searchParams = useSearchParams();
  const initialTab =
    searchParams.get('tab') === 'day'
      ? 'day'
      : searchParams.get('tab') === 'group'
        ? 'group'
        : 'private';

  const [groupTours, setGroupTours] = useState<GroupTour[] | null>(null);
  const [selectedTour, setSelectedTour] = useState<string | null>(null);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getGroupTours().then(setGroupTours);
  }, []);

  useEffect(() => {
    let active = true;

    fetch('/api/excursions', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (active && d.success && Array.isArray(d.excursions)) {
          setManagedExcursions(d.excursions);
        }
      })
      .catch(() => {})
      .finally(() => {});

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setProgramsLoading(true);

    fetch(`/api/programs?locale=${locale}`)
      .then((r) => r.json())
      .then((d) => {
        if (active) {
          setPrograms(d.success && Array.isArray(d.programs) ? d.programs : []);
        }
      })
      .catch(() => {
        if (active) setPrograms([]);
      })
      .finally(() => {
        if (active) setProgramsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [locale]);

  const dayTrips = useMemo(
    () => managedExcursions.filter((e) => isDayTrip(e.duration)),
    [managedExcursions]
  );

  const filteredPrograms = useMemo(() => {
    if (filter === 'All') return programs;

    const term = filter === 'Maasai Mara' ? 'mara' : filter.toLowerCase();

    return programs.filter((s) =>
      s.parks?.some((park) => park.toLowerCase().includes(term))
    );
  }, [filter, programs]);

  const openBooking = useCallback((name: string) => setSelectedTour(name), []);
  const closeBooking = useCallback(() => setSelectedTour(null), []);

  return (
    <PageShell>
      <section className="bg-paper min-h-screen pt-12 pb-24 lg:pt-20 lg:pb-32">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <header className="relative overflow-hidden border-b border-line pb-12 lg:pb-16">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-coral/10 blur-3xl pointer-events-none" />
            <div className="grid lg:grid-cols-[1.1fr_0.7fr] gap-10 lg:gap-20 items-end">
              <div>
                <div className="mb-5 flex items-center gap-3 font-mono-editorial text-[9px] uppercase tracking-[0.2em] text-coral">
                  <span className="h-px w-8 bg-coral" />
                  {t.nav.tours}
                </div>
                <h1 className="font-editorial text-6xl sm:text-7xl lg:text-[7.5rem] font-normal leading-[0.82] tracking-[-0.035em] text-ink">
                  {t.tours.title}
                  <span className="block text-ocean">{t.tours.titleHighlight}</span>
                </h1>
              </div>

              <div className="lg:pb-2">
                <div className="mb-5 flex items-center gap-2 text-coral">
                  <Compass className="h-4 w-4" />
                  <span className="font-mono-editorial text-[9px] uppercase tracking-[0.18em]">
                    From the coast into the wild
                  </span>
                </div>
                <p className="font-grotesk text-sm sm:text-base leading-7 text-ink-soft max-w-xl">
                  {t.tours.subtitle}
                </p>
              </div>
            </div>
          </header>

          <Tabs defaultValue={initialTab} className="w-full mt-10 lg:mt-14">
            <TabsList className="w-full max-w-3xl bg-transparent border-b border-line rounded-none p-0 h-auto mb-12 grid grid-cols-3">
              <TabsTrigger
                value="group"
                className="rounded-none border-b-2 border-transparent py-3 font-mono-editorial text-[10px] uppercase tracking-[0.14em] data-[state=active]:border-coral data-[state=active]:text-ink"
              >
                {t.tours.groupJoining}
              </TabsTrigger>
              <TabsTrigger
                value="private"
                className="rounded-none border-b-2 border-transparent py-3 font-mono-editorial text-[10px] uppercase tracking-[0.14em] data-[state=active]:border-coral data-[state=active]:text-ink"
              >
                {t.tours.private}
              </TabsTrigger>
              <TabsTrigger
                value="day"
                className="rounded-none border-b-2 border-transparent py-3 font-mono-editorial text-[10px] uppercase tracking-[0.14em] data-[state=active]:border-orange-500 data-[state=active]:text-ink"
              >
                {t.tours.dayTrips}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="group">
              {groupTours === null ? (
                <div className="py-16 font-grotesk text-sm text-muted text-center">
                  {t.tours.loadingDepartures}
                </div>
              ) : groupTours.length === 0 ? (
                <div className="py-16 text-center">
                  <Calendar className="w-8 h-8 text-muted mx-auto mb-3" />
                  <p className="font-grotesk text-sm text-muted">
                    {t.tours.noOpenDepartures}
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-10">
                  {groupTours.map((gt, i) => {
                    const date = formatDepartureDate(gt.departure_date, locale);
                    const seats = gt.seats_left;
                    const summary =
                      gt.joined_names.length > 0 && gt.joined_nationality
                        ? groupLabels.joining
                            .replace('{count}', String(gt.joined_names.length))
                            .replace('{nationality}', gt.joined_nationality)
                            .replace('{date}', date)
                            .replace('{seats}', String(seats))
                            .replace(
                              '{seatWord}',
                              seats === 1 ? groupLabels.seat : groupLabels.seats
                            )
                        : `${groupLabels.seatsLeft.replace('{seats}', String(seats))} — ${groupLabels.firstToJoin}`;

                    return (
                      <AnimateOnScroll
                        key={gt.id}
                        direction="up"
                        delay={staggerDelay(i)}
                        className={i % 3 === 0 ? 'lg:col-span-7' : 'lg:col-span-5'}
                      >
                        <article className="border-b border-line pb-5 h-full">
                          <div className="flex items-center gap-2 mb-3 font-mono-editorial text-[10px] uppercase tracking-[0.12em] text-coral">
                            <Calendar className="w-3.5 h-3.5" />
                            {date}
                          </div>
                          <h3 className="font-editorial text-3xl text-ink">{gt.safari_name}</h3>
                          <p className="font-grotesk text-sm leading-6 text-ink-soft mt-2 mb-5">
                            {summary}
                          </p>
                          <button
                            onClick={() => openBooking(gt.safari_name)}
                            className="inline-flex items-center gap-2 bg-ocean-deep hover:bg-ocean text-white font-grotesk font-semibold text-sm px-5 py-2.5 transition-colors"
                          >
                            {t.inquiryStatus.requestToJoin}
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </article>
                      </AnimateOnScroll>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="private">
              <div className="mb-8 flex flex-wrap items-center gap-2">
                <span className="mr-2 font-mono-editorial text-[9px] uppercase tracking-[0.16em] text-muted">
                  Explore by landscape
                </span>
                {['All', 'Tsavo', 'Amboseli', 'Maasai Mara', 'Taita Hills'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    aria-pressed={filter === item}
                    className={`border px-3.5 py-2 font-mono-editorial text-[9px] uppercase tracking-[0.12em] transition-all ${filter === item ? 'border-ocean-deep bg-ocean-deep text-white' : 'border-line text-ink-soft hover:border-ocean hover:text-ocean'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {programsLoading ? (
                <div className="py-16 font-grotesk text-sm text-muted text-center">
                  {t.tours.loadingDepartures}
                </div>
              ) : filteredPrograms.length === 0 ? (
                <div className="py-16 font-grotesk text-sm text-muted text-center">
                  {t.tours.noOpenDepartures}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-14">
                  {filteredPrograms.map((s, i) => {
                    const content = getLocalizedSafari(s, locale as SafariLocale);
                    const wide = i % 4 === 0 || i % 4 === 3;

                    return (
                      <AnimateOnScroll
                        key={s.id}
                        direction="up"
                        delay={staggerDelay(i)}
                        className={wide ? 'lg:col-span-7' : 'lg:col-span-5'}
                      >
                        <Link href={`/safaris/${s.id}`} prefetch className="group block">
                          <div
                            className={`relative overflow-hidden bg-sand-100 ${wide ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}
                          >
                            <Image
                              src={s.image}
                              alt={content.name}
                              fill
                              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                              sizes={
                                wide
                                  ? '(max-width: 1024px) 100vw, 58vw'
                                  : '(max-width: 1024px) 100vw, 42vw'
                              }
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                              <p className="font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-coral mb-2">
                                {content.parks.join(' · ')}
                              </p>
                              <h3 className="font-editorial text-3xl sm:text-4xl text-white">
                                {content.name}
                              </h3>
                            </div>
                          </div>
                          <div className="border-b border-line py-4 flex items-center justify-between gap-4">
                            <span className="font-grotesk text-sm text-ink-soft">{content.tagline}</span>
                            <span className="font-mono-editorial text-[9px] uppercase tracking-[0.12em] text-muted">
                              {s.days}D / {s.nights}N · {s.rating}
                            </span>
                          </div>
                        </Link>
                      </AnimateOnScroll>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="day">
              <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-12">
                {dayTrips.map((e, i) => {
                  const content = getLocalizedExcursion(e, locale as SupportedLocale);
                  const wide = i % 4 === 0 || i % 4 === 3;

                  return (
                    <AnimateOnScroll
                      key={e.id}
                      direction="up"
                      delay={staggerDelay(i)}
                      className={wide ? 'lg:col-span-7' : 'lg:col-span-5'}
                    >
                      <article className="group">
                        <div
                          className={`relative overflow-hidden bg-sand-100 ${wide ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}
                        >
                          <Image
                            src={e.image}
                            alt={content.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                            sizes={
                              wide
                                ? '(max-width: 1024px) 100vw, 58vw'
                                : '(max-width: 1024px) 100vw, 42vw'
                            }
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                          <div className="absolute left-4 top-4 bg-ink/85 px-2.5 py-1 font-mono-editorial text-[9px] uppercase tracking-[0.14em] text-white">
                            {e.category}
                          </div>
                          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                            <h3 className="font-editorial text-3xl sm:text-4xl text-white">
                              {content.name}
                            </h3>
                          </div>
                        </div>
                        <div className="border-b border-line py-4 flex items-center justify-between gap-4">
                          <span className="font-grotesk text-sm text-ink-soft">{content.duration}</span>
                          <button
                            onClick={() => openBooking(content.name)}
                            className="inline-flex items-center gap-1.5 font-mono-editorial text-[9px] uppercase tracking-[0.12em] text-ink hover:text-orange-600"
                          >
                            {t.common.bookNow}
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </article>
                    </AnimateOnScroll>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {selectedTour && (
        <BookingModal
          isOpen={!!selectedTour}
          onClose={closeBooking}
          selectedTour={selectedTour}
        />
      )}
    </PageShell>
  );
}

export default function ToursPageClient() {
  return (
    <Suspense fallback={null}>
      <ToursPageInner />
    </Suspense>
  );
}
