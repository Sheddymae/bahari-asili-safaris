'use client';

import { useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowRight, CalendarDays, Clock3, MapPin } from 'lucide-react';
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
  const multiDayMatch = d.match(/(\\d+)\\s*day/);
  if (multiDayMatch && parseInt(multiDayMatch[1], 10) > 1) return false;
  return true;
}

function formatDepartureDate(iso: string, locale: string) {
  const intl = locale === 'zh' ? 'zh-CN' : locale === 'ar' ? 'ar' : locale === 'sw' ? 'sw-KE' : `${locale}-${locale === 'de' ? 'DE' : locale === 'fr' ? 'FR' : locale === 'it' ? 'IT' : locale === 'es' ? 'ES' : 'GB'}`;
  return new Date(iso + 'T00:00:00').toLocaleDateString(intl, { month: 'short', day: 'numeric' });
}

function staggerDelay(index: number) {
  return Math.min(index * 70, 350);
}

function ToursPageInner() {
  const { t, locale } = useLanguage();
  const groupLabels = groupDepartureLabels[locale];
  const [programs, setPrograms] = useState<typeof safaris>([]);
  const [managedExcursions, setManagedExcursions] = useState<typeof excursions>(excursions);
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'day' ? 'day' : searchParams.get('tab') === 'group' ? 'group' : 'private';
  const [groupTours, setGroupTours] = useState<GroupTour[] | null>(null);
  const [selectedTour, setSelectedTour] = useState<string | null>(null);
  const [programsLoading, setProgramsLoading] = useState(true);

  useEffect(() => { getGroupTours().then(setGroupTours); }, []);
  useEffect(() => {
    let active = true;
    fetch('/api/excursions', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { if (active && d.success && Array.isArray(d.excursions)) setManagedExcursions(d.excursions); })
      .catch(() => { /* static catalogue remains available */ });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    let active = true;
    setProgramsLoading(true);
    fetch(`/api/programs?locale=${locale}`)
      .then((r) => r.json())
      .then((d) => { if (active) setPrograms(d.success && Array.isArray(d.programs) ? d.programs : []); })
      .catch(() => { if (active) setPrograms([]); })
      .finally(() => { if (active) setProgramsLoading(false); });
    return () => { active = false; };
  }, [locale]);

  const dayTrips = useMemo(() => managedExcursions.filter((e) => isDayTrip(e.duration)), [managedExcursions]);
  const openBooking = useCallback((name: string) => setSelectedTour(name), []);
  const closeBooking = useCallback(() => setSelectedTour(null), []);

  const tabClass = 'min-h-12 min-w-0 flex-1 rounded-xl px-2 py-3 font-inter text-xs font-semibold leading-tight text-[var(--brand-text-muted)] transition-colors sm:text-sm data-[state=active]:bg-[var(--brand-primary-deep)] data-[state=active]:text-white data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-focus)] focus-visible:ring-offset-2';

  return (
    <PageShell>
      <section aria-labelledby="tours-heading" className="min-h-screen bg-[var(--brand-sand)] pb-16 sm:pb-20">
        <div className="relative overflow-hidden bg-[var(--brand-primary-deep)] text-white">
          <div aria-hidden="true" className="absolute inset-0 opacity-15">
            <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[36px] border-white/30 sm:-right-10 sm:h-96 sm:w-96" />
            <div className="absolute -bottom-24 left-1/4 h-56 w-56 rounded-full border-[24px] border-white/20" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <AnimateOnScroll direction="up">
              <div className="max-w-3xl">
                <span className="mb-3 inline-flex items-center gap-2 font-inter text-xs font-bold uppercase tracking-[0.2em] text-[var(--brand-secondary)] sm:text-sm">
                  <span aria-hidden="true" className="h-px w-7 bg-[var(--brand-secondary)]" />
                  {t.nav.tours}
                </span>
                <h1 id="tours-heading" className="font-poppins text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  {t.tours.title} <span className="text-[var(--brand-secondary)]">{t.tours.titleHighlight}</span>
                </h1>
                <p className="mt-4 max-w-2xl font-inter text-sm leading-7 text-white/85 sm:text-base">
                  {t.tours.description ?? t.tours.subtitle ?? ''}
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <a href="#tour-options" className="inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--brand-secondary)] px-5 py-3 font-inter text-sm font-bold text-[var(--brand-text)] transition-colors hover:bg-[var(--brand-secondary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-primary-deep)]">
                    {t.tours.private}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <Link href="/contact" className="inline-flex min-h-12 items-center justify-center border border-white/50 px-5 py-3 font-inter text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    {t.nav.contact}
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>

        <div id="tour-options" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
          <Tabs defaultValue={initialTab} className="w-full">
            <div className="mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-inter text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-primary-deep)]">{t.nav.tours}</p>
                <h2 className="mt-1 font-poppins text-xl font-bold text-[var(--brand-text)] sm:text-2xl">{t.tours.title} {t.tours.titleHighlight}</h2>
              </div>
              <TabsList aria-label={t.nav.tours} className="grid h-auto w-full grid-cols-3 gap-1 rounded-2xl border border-[var(--brand-border)] bg-white p-1 sm:max-w-xl">
                <TabsTrigger value="group" className={tabClass}>{t.tours.groupJoining}</TabsTrigger>
                <TabsTrigger value="private" className={tabClass}>{t.tours.private}</TabsTrigger>
                <TabsTrigger value="day" className={tabClass}>{t.tours.dayTrips}</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="group" className="mt-0 focus-visible:outline-none">
              {groupTours === null ? (
                <div role="status" className="rounded-2xl border border-[var(--brand-border)] bg-white px-5 py-16 text-center font-inter text-sm text-[var(--brand-text-muted)]">{t.tours.loadingDepartures}</div>
              ) : groupTours.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--brand-border)] bg-white px-5 py-14 text-center sm:py-16">
                  <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-sand)] text-[var(--brand-primary-deep)]"><CalendarDays className="h-5 w-5" aria-hidden="true" /></span>
                  <p className="font-inter text-sm leading-6 text-[var(--brand-text-muted)]">{t.tours.noOpenDepartures}</p>
                  <Link href="/contact" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 bg-[var(--brand-primary-deep)] px-5 py-3 font-inter text-sm font-bold text-white hover:bg-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-focus)] focus-visible:ring-offset-2">
                    {t.nav.contact}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  {groupTours.map((gt, i) => {
                    const date = formatDepartureDate(gt.departure_date, locale);
                    const seats = gt.seats_left;
                    const summary = gt.joined_names.length > 0 && gt.joined_nationality
                      ? groupLabels.joining.replace('{count}', String(gt.joined_names.length)).replace('{nationality}', gt.joined_nationality).replace('{date}', date).replace('{seats}', String(seats)).replace('{seatWord}', seats === 1 ? groupLabels.seat : groupLabels.seats)
                      : `${groupLabels.seatsLeft.replace('{seats}', String(seats))} — ${groupLabels.firstToJoin}`;
                    return (
                      <AnimateOnScroll key={gt.id} direction="up" delay={staggerDelay(i)}>
                        <article className="flex h-full flex-col border border-[var(--brand-border)] bg-white p-5 shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)] sm:p-6">
                          <div className="mb-4 flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--brand-sand)] text-[var(--brand-primary-deep)]"><CalendarDays className="h-5 w-5" aria-hidden="true" /></span>
                            <div><p className="font-inter text-xs text-[var(--brand-text-muted)]">{t.tours.groupJoining}</p><p className="font-inter text-sm font-bold text-[var(--brand-primary-deep)]">{date}</p></div>
                          </div>
                          <h3 className="font-poppins text-lg font-bold leading-snug text-[var(--brand-text)]">{gt.safari_name}</h3>
                          <p className="mt-3 flex-1 font-inter text-sm leading-6 text-[var(--brand-text-muted)]">{summary}</p>
                          <button type="button" onClick={() => openBooking(gt.safari_name)} className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--brand-primary-deep)] px-4 py-3 font-inter text-sm font-bold text-white transition-colors hover:bg-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-focus)] focus-visible:ring-offset-2">
                            {t.inquiryStatus.requestToJoin}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </article>
                      </AnimateOnScroll>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="private" className="mt-0 focus-visible:outline-none">
              {programsLoading ? (
                <div role="status" className="rounded-2xl border border-[var(--brand-border)] bg-white px-5 py-16 text-center font-inter text-sm text-[var(--brand-text-muted)]">{t.tours.loadingDepartures}</div>
              ) : programs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--brand-border)] bg-white px-5 py-14 text-center sm:py-16">
                  <p className="font-inter text-sm leading-6 text-[var(--brand-text-muted)]">{t.tours.noOpenDepartures}</p>
                  <Link href="/contact" className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 bg-[var(--brand-primary-deep)] px-5 py-3 font-inter text-sm font-bold text-white hover:bg-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-focus)] focus-visible:ring-offset-2">
                    {t.nav.contact}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  {programs.map((s, i) => {
                    const content = getLocalizedSafari(s, locale as SafariLocale);
                    return (
                      <AnimateOnScroll key={s.id} direction="up" delay={staggerDelay(i)}>
                        <article className="group flex h-full min-w-0 flex-col overflow-hidden border border-[var(--brand-border)] bg-white shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]">
                          <Link href={`/safaris/${s.id}`} className="relative block aspect-[4/3] overflow-hidden bg-[var(--brand-sand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand-focus)]" aria-label={content.name}>
                            <Image src={s.image} alt={content.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                            <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 bg-white/95 px-3 py-2 font-inter text-xs font-bold text-[var(--brand-primary-deep)] shadow-sm">
                              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{s.days}D / {s.nights}N
                            </span>
                          </Link>
                          <div className="flex flex-1 flex-col p-5 sm:p-6">
                            <h3 className="font-poppins text-lg font-bold leading-snug text-[var(--brand-text)]">{content.name}</h3>
                            <p className="mt-3 flex items-start gap-2 font-inter text-sm leading-6 text-[var(--brand-text-muted)]">
                              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[var(--brand-primary)]" aria-hidden="true" />
                              <span>{content.parks.join(' · ')}</span>
                            </p>
                            <Link href={`/safaris/${s.id}`} className="mt-auto inline-flex min-h-12 items-center justify-between gap-3 border-t border-[var(--brand-border)] pt-4 font-inter text-sm font-bold text-[var(--brand-primary-deep)] hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-focus)]">
                              {t.tours.itinerary}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                          </div>
                        </article>
                      </AnimateOnScroll>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="day" className="mt-0 focus-visible:outline-none">
              {dayTrips.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--brand-border)] bg-white px-5 py-14 text-center font-inter text-sm text-[var(--brand-text-muted)]">{t.tours.noOpenDepartures}</div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  {dayTrips.map((e, i) => {
                    const content = getLocalizedExcursion(e, locale as SupportedLocale);
                    return (
                      <AnimateOnScroll key={e.id} direction="up" delay={staggerDelay(i)}>
                        <article className="group flex h-full min-w-0 flex-col overflow-hidden border border-[var(--brand-border)] bg-white shadow-[var(--shadow-sm)] transition-shadow hover:shadow-[var(--shadow-md)]">
                          <div className="relative aspect-[4/3] overflow-hidden bg-[var(--brand-sand)]">
                            <Image src={e.image} alt={content.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                            <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 bg-white/95 px-3 py-2 font-inter text-xs font-bold text-[var(--brand-primary-deep)] shadow-sm"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{content.duration}</span>
                          </div>
                          <div className="flex flex-1 flex-col p-5 sm:p-6">
                            <h3 className="font-poppins text-lg font-bold leading-snug text-[var(--brand-text)]">{content.name}</h3>
                            <button type="button" onClick={() => openBooking(content.name)} className="mt-auto inline-flex min-h-12 items-center justify-between gap-3 border-t border-[var(--brand-border)] pt-4 text-left font-inter text-sm font-bold text-[var(--brand-primary-deep)] hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-focus)]">
                              {t.common.bookNow}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        </article>
                      </AnimateOnScroll>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
      {selectedTour && <BookingModal isOpen={!!selectedTour} onClose={closeBooking} selectedTour={selectedTour} />}
    </PageShell>
  );
}

export default function ToursPageClient() {
  return <Suspense fallback={<div className="min-h-screen bg-[var(--brand-sand)]" />}><ToursPageInner /></Suspense>;
}
