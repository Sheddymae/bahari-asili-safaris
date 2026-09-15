'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Compass, Sparkles, ShieldCheck, HeartHandshake, ListChecks } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { prefersReducedMotion } from '@/lib/video-config';

gsap.registerPlugin(ScrollTrigger);

const WHY_ITEMS = [
  { icon: Compass, titleKey: 'whyLocalTitle', titleFallback: 'Local Expertise', bodyKey: 'whyLocalBody', bodyFallback: 'Our knowledge of Kenya allows us to create journeys that go beyond the standard itinerary.' },
  { icon: Sparkles, titleKey: 'whyTailorTitle', titleFallback: 'Tailor-Made Experiences', bodyKey: 'whyTailorBody', bodyFallback: 'We design trips around your interests, travel style, schedule, and expectations.' },
  { icon: ShieldCheck, titleKey: 'whyTrustedTitle', titleFallback: 'Trusted Service', bodyKey: 'whyTrustedBody', bodyFallback: 'From your first enquiry to the end of your journey, our team remains available to assist and guide you.' },
  { icon: HeartHandshake, titleKey: 'whyAuthenticTitle', titleFallback: 'Authentic Experiences', bodyKey: 'whyAuthenticBody', bodyFallback: 'We aim to connect travellers with the real Kenya through wildlife, landscapes, communities, and culture.' },
  { icon: ListChecks, titleKey: 'whyDetailTitle', titleFallback: 'Attention to Detail', bodyKey: 'whyDetailBody', bodyFallback: 'Transport, accommodation, activities, timing, and logistics are carefully coordinated for a smooth journey.' },
];

export default function AboutSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pointerStartX = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(contentRef.current, { y: 30 }, { y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || paused) return;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % WHY_ITEMS.length), 3600);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  const goTo = (direction: 1 | -1) => setActiveIndex((current) => (current + direction + WHY_ITEMS.length) % WHY_ITEMS.length);
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => { pointerStartX.current = event.clientX; };
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(distance) > 50) goTo(distance < 0 ? 1 : -1);
  };
  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    const count = WHY_ITEMS.length;
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;
    return offset;
  };

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden bg-sand-50 py-14 sm:py-18 lg:py-20">
      <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-safari-100/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-ocean-100/20 blur-3xl" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl lg:mb-14">
          <span className="mb-3 block font-inter text-xs font-semibold uppercase tracking-widest text-safari-500">{t.about?.label || 'About Us'}</span>
          <h2 className="mb-4 font-poppins text-3xl font-extrabold leading-tight text-foreground sm:text-5xl lg:text-6xl">Africa, <span className="relative text-safari-500">{t.about?.unfiltered || 'Unfiltered'}<span className="absolute -bottom-2 left-0 -z-10 h-1 w-full bg-safari-300/40" /></span></h2>
          <p className="mb-3 font-poppins text-lg font-semibold text-foreground sm:text-2xl">{t.about?.tagline || 'Discover Kenya. Experience It Differently.'}</p>
          <p className="max-w-2xl font-inter text-base leading-7 text-foreground sm:text-lg">{t.about?.description || 'Travel is more than visiting a destination — it is discovering its landscapes, connecting with its people, and creating memories that remain long after the journey ends.'}</p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div ref={contentRef} className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-poppins text-xl font-bold text-foreground sm:text-2xl">{t.about?.titleHighlight || 'From Safari to the Coast'}</h3>
              <p className="font-inter text-sm leading-7 text-foreground sm:text-base">{t.about?.bodyText || 'We are a Kenya-based safari and travel company creating authentic, carefully designed experiences — from the magnificent wildlife of the national parks and reserves to the breathtaking beauty of the Indian Ocean coast.'}</p>
              <p className="font-inter text-sm leading-7 text-foreground sm:text-base">{t.about?.bodyTextSecondary || 'One journey can take you from the open plains of the Maasai Mara, through the wilderness of Amboseli and Tsavo, and onward to the tropical coastline of Watamu. We work with trusted local partners to make it possible to experience these contrasting sides of Kenya in one thoughtfully planned trip.'}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-xl border border-sand-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-safari-300 hover:shadow-lg sm:p-6"><div className="font-poppins text-2xl font-black text-safari-500 sm:text-3xl">{t.about?.stats1 || '11'}</div><p className="mt-1.5 font-inter text-xs text-foreground sm:text-sm">{t.about?.stats1Label || 'Handcrafted Itineraries'}</p></div>
              <div className="rounded-xl border border-sand-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-ocean-300 hover:shadow-lg sm:p-6"><div className="font-poppins text-2xl font-black text-ocean-700 sm:text-3xl">{t.about?.stats2 || '400+'}</div><p className="mt-1.5 font-inter text-xs text-foreground sm:text-sm">{t.about?.stats2Label || 'Families Hosted Since 2014'}</p></div>
            </div>
            <Link href="/about" prefetch className="inline-flex items-center gap-2 font-inter text-sm font-semibold text-ocean-700 transition-all duration-300 hover:gap-3 hover:text-ocean-800">{t.homeExtras.learnMore} <span aria-hidden="true">→</span></Link>
          </div>

          <div className="relative h-[280px] sm:h-[340px] lg:h-[430px]">
            <div className="absolute inset-0 overflow-hidden rounded-3xl shadow-card"><Image src="/images/safaris/safari-nala-taita.jpg" alt="Kenya Safari Experience" fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px" /></div>
            <div className="absolute bottom-0 right-0 h-40 w-2/3 overflow-hidden rounded-2xl border-4 border-white shadow-card sm:h-52 sm:border-8 lg:h-64"><Image src="/images/safaris/safari-experience-tsavo.jpg" alt="Tsavo Safari" fill className="object-cover" sizes="400px" /></div>
            <div className="absolute -bottom-4 -left-3 -z-10 h-20 w-20 rounded-full bg-safari-500 opacity-20 sm:-bottom-6 sm:-left-6 sm:h-24 sm:w-24" />
          </div>
        </div>

        <div className="mt-12 lg:mt-16">
          <div className="mx-auto mb-7 max-w-2xl text-center lg:mb-9"><span className="mb-2 inline-flex items-center rounded-full bg-safari-100 px-4 py-1.5 font-inter text-xs font-bold uppercase tracking-[0.18em] text-safari-700">{t.about?.label || 'Bahari Asili'}</span><h3 className="mb-2 font-poppins text-2xl font-extrabold text-foreground sm:text-4xl">{t.about?.whyTitle || 'Why Travel With Bahari Asili Safaris?'}</h3><p className="font-inter text-sm leading-6 text-foreground/70 sm:text-base">{t.about?.whySubtitle || 'Every traveller is different, and every journey should feel personal.'}</p></div>
          <div className="relative mx-auto h-[330px] max-w-6xl select-none touch-pan-y overflow-visible sm:h-[350px] lg:h-[360px]" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={() => { pointerStartX.current = null; }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} aria-label="Why travel with Bahari Asili Safaris">
            {WHY_ITEMS.map(({ icon: Icon, titleKey, titleFallback, bodyKey, bodyFallback }, index) => {
              const offset = getOffset(index);
              const isActive = offset === 0;
              const distance = typeof window !== 'undefined' && window.innerWidth < 640 ? 205 : typeof window !== 'undefined' && window.innerWidth < 1024 ? 250 : 285;
              return <article key={titleKey} className={`absolute left-1/2 top-1/2 w-[82vw] max-w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-[1px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isActive ? 'z-30' : 'z-20'}`} style={{ transform: `translate(calc(-50% + ${offset * distance}px), -50%) scale(${isActive ? 1 : 0.84})`, opacity: Math.abs(offset) > 1 ? 0 : isActive ? 1 : 0.68, filter: isActive ? 'none' : 'saturate(0.82)', pointerEvents: Math.abs(offset) > 1 ? 'none' : 'auto' }}><div className={`h-full min-h-[300px] rounded-2xl border bg-white p-6 shadow-xl transition-all duration-700 sm:min-h-[315px] ${isActive ? 'border-safari-300 shadow-[0_20px_60px_rgba(14,116,144,0.18)]' : 'border-sand-200 shadow-card'}`}><div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 ${isActive ? 'bg-safari-500 text-white shadow-[0_0_28px_rgba(249,115,22,0.42)]' : 'bg-safari-50 text-safari-500'}`}><Icon className="h-6 w-6" /></div><h4 className="mb-2 font-poppins text-lg font-bold leading-snug text-foreground">{t.about?.[titleKey as keyof typeof t.about] || titleFallback}</h4><p className="font-inter text-sm leading-6 text-foreground/75 sm:text-base">{t.about?.[bodyKey as keyof typeof t.about] || bodyFallback}</p><div className={`mt-5 h-1 rounded-full transition-all duration-700 ${isActive ? 'w-20 bg-safari-500' : 'w-10 bg-sand-200'}`} /></div></article>;
            })}
          </div>
          <div className="mt-1 flex items-center justify-center gap-3"><button type="button" onClick={() => goTo(-1)} aria-label="Previous benefit" className="group flex h-10 w-10 items-center justify-center rounded-full border border-sand-200 bg-white text-foreground shadow-sm transition-all duration-300 hover:border-safari-300 hover:bg-safari-50 hover:text-safari-600 hover:shadow-[0_0_24px_rgba(249,115,22,0.25)] focus:outline-none focus:ring-2 focus:ring-safari-400"><ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" /></button><div className="flex items-center gap-1.5" aria-label="Carousel position">{WHY_ITEMS.map((item, index) => <button key={item.titleKey} type="button" aria-label={`Go to ${item.titleFallback}`} aria-current={activeIndex === index} onClick={() => setActiveIndex(index)} className={`h-2 rounded-full transition-all duration-500 ${activeIndex === index ? 'w-7 bg-safari-500 shadow-[0_0_12px_rgba(249,115,22,0.45)]' : 'w-2 bg-sand-300 hover:bg-safari-300'}`} />)}</div><button type="button" onClick={() => goTo(1)} aria-label="Next benefit" className="group flex h-10 w-10 items-center justify-center rounded-full border border-sand-200 bg-white text-foreground shadow-sm transition-all duration-300 hover:border-safari-300 hover:bg-safari-50 hover:text-safari-600 hover:shadow-[0_0_24px_rgba(249,115,22,0.25)] focus:outline-none focus:ring-2 focus:ring-safari-400"><ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" /></button></div>
        </div>
        <p className="mt-10 text-center font-poppins text-base font-semibold text-foreground sm:text-xl lg:mt-12">{t.about?.closingLine || 'Explore Kenya. Discover the wild. Feel the coast. Travel with Bahari Asili Safaris.'}</p>
      </div>
    </section>
  );
}
