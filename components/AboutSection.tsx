'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Compass, Sparkles, ShieldCheck, HeartHandshake, ListChecks } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { prefersReducedMotion } from '@/lib/video-config';

gsap.registerPlugin(ScrollTrigger);

/**
 * AboutSection Component (Redesigned for Cinematic Experience)
 *
 * Features:
 * - Large editorial heading
 * - Split layout with cinematic imagery + expanded intro copy
 * - "Why Travel With Us" feature grid, filling the white space beneath
 *   the split layout with content instead of leaving it empty
 * - Subtle fade-in reveal on scroll into view (no parallax, no mouse tracking)
 * - Premium typography and spacing
 *
 * Update: "Why Travel With Us" header is now centered, and each card
 * gets an animated gradient outline (fades in on hover, safari-colored)
 * plus a soft lift/glow instead of a flat border-color swap.
 */

const WHY_ITEMS = [
  {
    icon: Compass,
    titleKey: 'whyLocalTitle',
    titleFallback: 'Local Expertise',
    bodyKey: 'whyLocalBody',
    bodyFallback: 'Our knowledge of Kenya allows us to create journeys that go beyond the standard itinerary.',
  },
  {
    icon: Sparkles,
    titleKey: 'whyTailorTitle',
    titleFallback: 'Tailor-Made Experiences',
    bodyKey: 'whyTailorBody',
    bodyFallback: 'We design trips around your interests, travel style, schedule, and expectations.',
  },
  {
    icon: ShieldCheck,
    titleKey: 'whyTrustedTitle',
    titleFallback: 'Trusted Service',
    bodyKey: 'whyTrustedBody',
    bodyFallback: 'From your first enquiry to the end of your journey, our team remains available to assist and guide you.',
  },
  {
    icon: HeartHandshake,
    titleKey: 'whyAuthenticTitle',
    titleFallback: 'Authentic Experiences',
    bodyKey: 'whyAuthenticBody',
    bodyFallback: 'We aim to connect travellers with the real Kenya through wildlife, landscapes, communities, and culture.',
  },
  {
    icon: ListChecks,
    titleKey: 'whyDetailTitle',
    titleFallback: 'Attention to Detail',
    bodyKey: 'whyDetailBody',
    bodyFallback: 'Transport, accommodation, activities, timing, and logistics are carefully coordinated for a smooth journey.',
  },
];

export default function AboutSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageLeftRef = useRef<HTMLDivElement>(null);
  const imageRightRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);

  // Subtle fade-in reveal only — no parallax, no scroll-scrubbed motion
  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    // Scope all GSAP animations + ScrollTriggers created inside this callback
    // to sectionRef. ctx.revert() on cleanup only tears down THIS component's
    // own animations/triggers (and restores any inline styles they set) —
    // it never touches ScrollTriggers owned by other sections on the page.
    // (Previously this used `ScrollTrigger.getAll().forEach(t => t.kill())`,
    // which killed every ScrollTrigger in the whole app on unmount/Fast
    // Refresh, including ones from sibling sections — that mismatch between
    // GSAP's DOM mutations and React's own reconciliation is what caused the
    // "Failed to execute 'removeChild' on 'Node'" runtime error.)
    const ctx = gsap.context(() => {
      // Content reveal — animates position only, never opacity. Content is
      // always visible by default (no autoAlpha/opacity-0 starting state),
      // so if ScrollTrigger never fires — e.g. full-page screenshot tools
      // that resize the viewport instead of firing real scroll events, bots,
      // or a slow/failed script — the section is still fully readable, just
      // without the slide-up flourish.
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { y: 30 },
          {
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              markers: false,
            },
          }
        );
      }

      // Why-travel-with-us grid — same fail-safe approach: position-only
      // animation, cards are visible from the first render.
      if (whyRef.current) {
        gsap.fromTo(
          whyRef.current.children,
          { y: 24 },
          {
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: whyRef.current,
              start: 'top 85%',
              markers: false,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 lg:py-32 bg-sand-50 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-safari-100/30 rounded-full -z-10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-ocean-100/20 rounded-full -z-10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="max-w-3xl mb-16 lg:mb-24">
          <span className="font-inter text-safari-500 font-semibold text-xs tracking-widest uppercase block mb-4">
            {t.about?.label || 'About Us'}
          </span>
          <h2 className="font-poppins font-extrabold text-4xl sm:text-5xl lg:text-6xl text-foreground leading-tight mb-6 text-balance">
            Africa,{' '}
            <span className="text-safari-500 relative">
              {t.about?.unfiltered || 'Unfiltered'}
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-safari-300/40 -z-10" />
            </span>
          </h2>
          <p className="font-poppins font-semibold text-xl sm:text-2xl text-foreground mb-4">
            {t.about?.tagline || 'Discover Kenya. Experience It Differently.'}
          </p>
          <p className="font-inter text-foreground text-lg leading-relaxed max-w-2xl">
            {t.about?.description ||
              'Travel is more than visiting a destination — it is discovering its landscapes, connecting with its people, and creating memories that remain long after the journey ends.'}
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div ref={contentRef} className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-poppins font-bold text-2xl text-foreground">
                {t.about?.titleHighlight || 'From Safari to the Coast'}
              </h3>
              <p className="font-inter text-foreground text-base leading-relaxed">
                {t.about?.bodyText ||
                  "We are a Kenya-based safari and travel company creating authentic, carefully designed experiences — from the magnificent wildlife of the national parks and reserves to the breathtaking beauty of the Indian Ocean coast."}
              </p>
              <p className="font-inter text-foreground text-base leading-relaxed">
                {t.about?.bodyTextSecondary ||
                  'One journey can take you from the open plains of the Maasai Mara, through the wilderness of Amboseli and Tsavo, and onward to the tropical coastline of Watamu. We work with trusted local partners to make it possible to experience these contrasting sides of Kenya in one thoughtfully planned trip.'}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white rounded-xl p-6 border border-sand-200 hover:border-safari-300 transition-colors">
                <div className="font-poppins font-black text-3xl text-safari-500">
                  {t.about?.stats1 || '11'}
                </div>
                <p className="font-inter text-sm text-foreground mt-2">
                  {t.about?.stats1Label || 'Handcrafted Itineraries'}
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-sand-200 hover:border-ocean-300 transition-colors">
                <div className="font-poppins font-black text-3xl text-ocean-700">
                  {t.about?.stats2 || '400+'}
                </div>
                <p className="font-inter text-sm text-foreground mt-2">
                  {t.about?.stats2Label || 'Families Hosted Since 2014'}
                </p>
              </div>
            </div>

            <Link
              href="/about"
              prefetch
              className="inline-flex items-center gap-2 font-inter font-semibold text-sm text-ocean-700 hover:text-ocean-800 transition-colors"
            >
              {t.homeExtras.learnMore}
            </Link>
          </div>

          {/* Right Images - Editorial Layout */}
          <div className="relative hidden lg:block">
            {/* Large featured image */}
            <div
              ref={imageLeftRef}
              className="rounded-2xl overflow-hidden h-96 shadow-card will-change-transform"
            >
              <Image
                src="/images/safaris/safari-nala-taita.jpg"
                alt="Kenya Safari Experience"
                fill
                className="object-cover"
                sizes="500px"
              />
            </div>

            {/* Secondary image with accent */}
            <div
              ref={imageRightRef}
              className="absolute bottom-0 right-0 w-2/3 rounded-2xl overflow-hidden h-64 shadow-card border-8 border-white will-change-transform"
            >
              <Image
                src="/images/safaris/safari-experience-tsavo.jpg"
                alt="Tsavo Safari"
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>

            {/* Accent box */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-safari-500 rounded-full opacity-20 -z-10" />
          </div>
        </div>

        {/* Why Travel With Us — fills the space below the split layout */}
        <div className="mt-20 lg:mt-28">
          {/* Header now centered */}
          <div className="max-w-2xl mx-auto mb-10 lg:mb-12 text-center">
            <h3 className="font-poppins font-extrabold text-2xl sm:text-3xl text-foreground mb-3">
              {t.about?.whyTitle || 'Why Travel With Bahari Asili Safaris?'}
            </h3>
            <p className="font-inter text-foreground/80 text-base leading-relaxed">
              {t.about?.whySubtitle ||
                'Every traveller is different, and every journey should feel personal.'}
            </p>
          </div>

          <div
            ref={whyRef}
            className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-6"
          >
            {WHY_ITEMS.map(({ icon: Icon, titleKey, titleFallback, bodyKey, bodyFallback }) => (
              <div
                key={titleKey}
                className="group relative rounded-xl p-[1.5px] transition-transform duration-300 hover:-translate-y-1"
              >
                {/* Animated gradient outline — invisible at rest, fades in on hover */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--safari-500, #f97316), var(--safari-300, #fdba74), var(--safari-500, #f97316))',
                  }}
                />

                {/* Card content */}
                <div className="relative bg-white rounded-xl p-6 h-full border border-sand-200 group-hover:border-transparent group-hover:shadow-card transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-safari-50 flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-safari-100">
                    <Icon className="w-5 h-5 text-safari-500" />
                  </div>
                  <h4 className="font-poppins font-bold text-base text-foreground mb-2">
                    {t.about?.[titleKey as keyof typeof t.about] || titleFallback}
                  </h4>
                  <p className="font-inter text-sm text-foreground/80 leading-relaxed">
                    {t.about?.[bodyKey as keyof typeof t.about] || bodyFallback}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing line */}
        <p className="font-poppins font-semibold text-lg sm:text-xl text-foreground text-center mt-16 lg:mt-20">
          {t.about?.closingLine ||
            'Explore Kenya. Discover the wild. Feel the coast. Travel with Bahari Asili Safaris.'}
        </p>
      </div>
    </section>
  );
}