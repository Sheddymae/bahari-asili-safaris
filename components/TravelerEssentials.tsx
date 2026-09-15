'use client';

import Link from 'next/link';
import { ArrowRight, Backpack, CalendarDays, CreditCard, FileCheck2, HeartPulse, MapPinned } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import AnimateOnScroll from '@/components/AnimateOnScroll';
import { useLanguage } from '@/contexts/LanguageContext';
import { travelerEssentialsTranslations } from '@/lib/traveler-essentials-i18n';

const ESSENTIAL_ICONS = [FileCheck2, CalendarDays, Backpack, CreditCard, HeartPulse, MapPinned];

export default function TravelerEssentials() {
  const { locale, isRTL } = useLanguage();
  const content = travelerEssentialsTranslations[locale] ?? travelerEssentialsTranslations.en;
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const displayedIndex = hoveredIndex ?? activeIndex;

  return (
    <section
      key={locale}
      lang={locale}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="traveler-essentials relative overflow-hidden border-y border-sand-200 bg-white py-12 sm:py-16 lg:py-20"
      aria-labelledby="traveler-essentials-title"
      data-traveler-locale={locale}
    >
      <style jsx>{`
        .travel-smart-tabs {
          position: relative;
          width: 100%;
          height: 470px;
          max-width: 1180px;
          margin: 0 auto;
          isolation: isolate;
        }

        .travel-smart-card {
          position: absolute;
          top: 50%;
          left: 50%;
          display: block;
          width: min(390px, 31vw);
          min-height: 390px;
          overflow: hidden;
          border: 1px solid rgba(225, 214, 193, 0.9);
          border-radius: 28px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.94), rgba(248,246,241,0.78));
          box-shadow:
            0 18px 45px rgba(13, 27, 42, 0.10),
            inset 0 1px 0 rgba(255,255,255,0.9);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          transform-origin: 50% 92%;
          transition:
            transform 850ms cubic-bezier(0.22, 1, 0.36, 1),
            width 850ms cubic-bezier(0.22, 1, 0.36, 1),
            min-height 850ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 650ms ease,
            box-shadow 650ms ease,
            border-color 500ms ease;
          will-change: transform, width;
          cursor: pointer;
        }

        .travel-smart-card::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(circle at 18% 8%, rgba(255,255,255,0.95), transparent 30%),
            linear-gradient(135deg, rgba(255,112,0,0.08), transparent 48%, rgba(8,126,164,0.06));
          opacity: 0.75;
        }

        .travel-smart-card.is-active {
          width: min(430px, 34vw);
          min-height: 410px;
          box-shadow:
            0 34px 80px rgba(13, 27, 42, 0.19),
            0 0 0 1px rgba(255,112,0,0.10),
            inset 0 1px 0 rgba(255,255,255,0.95);
          border-color: rgba(255,112,0,0.30);
        }

        .travel-smart-card:hover,
        .travel-smart-card:focus-visible {
          border-color: rgba(255,112,0,0.42);
        }

        .travel-smart-card-inner {
          position: relative;
          z-index: 1;
          display: flex;
          height: 100%;
          min-width: 0;
          min-height: inherit;
          flex-direction: column;
          padding: 30px;
        }

        .travel-smart-card-icon {
          display: flex;
          height: 52px;
          width: 52px;
          flex: 0 0 52px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(225, 214, 193, 0.75);
          border-radius: 16px;
          background: rgba(255,255,255,0.88);
          color: #ff7000;
          box-shadow: 0 9px 24px rgba(13,27,42,0.08);
          transition: transform 500ms cubic-bezier(0.22,1,0.36,1), box-shadow 500ms ease;
        }

        .travel-smart-card.is-active .travel-smart-card-icon {
          transform: scale(1.07) rotate(-2deg);
          box-shadow: 0 12px 30px rgba(255,112,0,0.16);
        }

        .travel-smart-card-copy {
          min-width: 0;
          margin-top: 28px;
        }

        .travel-smart-card-title {
          max-width: 100%;
          overflow-wrap: anywhere;
          font-size: 1.22rem;
          line-height: 1.2;
          font-weight: 800;
          color: #0d1b2a;
          transition: font-size 500ms ease, transform 500ms ease;
        }

        .travel-smart-card.is-active .travel-smart-card-title {
          font-size: 1.55rem;
        }

        .travel-smart-card-description,
        .travel-smart-card-link {
          opacity: 0;
          visibility: hidden;
          transform: translateY(18px);
          pointer-events: none;
          transition:
            opacity 420ms ease,
            visibility 420ms ease,
            transform 650ms cubic-bezier(0.22,1,0.36,1);
        }

        .travel-smart-card.is-active .travel-smart-card-description,
        .travel-smart-card.is-active .travel-smart-card-link {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          pointer-events: auto;
        }

        .travel-smart-card-description {
          margin-top: 16px;
          max-width: 31rem;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(13,27,42,0.70);
        }

        .travel-smart-card-link {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 8px;
          margin-top: auto;
          padding-top: 24px;
          color: #087ea4;
          font-size: 0.86rem;
          font-weight: 800;
        }

        .travel-smart-card-link svg {
          transition: transform 300ms ease;
        }

        .travel-smart-card-link:hover svg,
        .travel-smart-card-link:focus-visible svg {
          transform: translateX(5px);
        }

        .travel-smart-card-index {
          position: absolute;
          right: 24px;
          bottom: 22px;
          z-index: 2;
          display: flex;
          height: 30px;
          min-width: 30px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(225,214,193,0.7);
          border-radius: 999px;
          background: rgba(255,255,255,0.65);
          color: rgba(13,27,42,0.52);
          font: 700 0.68rem/1 var(--font-manrope, sans-serif);
          backdrop-filter: blur(10px);
          transition: opacity 350ms ease, transform 350ms ease;
        }

        .travel-smart-card.is-active .travel-smart-card-index {
          opacity: 0;
          transform: scale(0.8);
        }

        .travel-smart-instruction {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(13,27,42,0.45);
          font: 700 0.68rem/1 var(--font-manrope, sans-serif);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          white-space: nowrap;
          pointer-events: none;
        }

        @media (max-width: 999px) {
          .travel-smart-tabs {
            height: auto;
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .travel-smart-card,
          .travel-smart-card.is-active {
            position: relative;
            inset: auto;
            width: 100%;
            min-height: 270px;
            transform: none !important;
            opacity: 1 !important;
          }

          .travel-smart-card-inner {
            min-height: 270px;
            padding: 22px;
          }

          .travel-smart-card-title,
          .travel-smart-card.is-active .travel-smart-card-title {
            font-size: 1.08rem;
          }

          .travel-smart-card-description,
          .travel-smart-card.is-active .travel-smart-card-description,
          .travel-smart-card-link,
          .travel-smart-card.is-active .travel-smart-card-link {
            opacity: 1;
            visibility: visible;
            transform: none;
            pointer-events: auto;
          }

          .travel-smart-card-index,
          .travel-smart-instruction {
            display: none;
          }
        }

        @media (max-width: 639px) {
          .travel-smart-tabs {
            grid-template-columns: 1fr;
          }

          .travel-smart-card-inner {
            min-height: 245px;
            padding: 20px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .travel-smart-card,
          .travel-smart-card-icon,
          .travel-smart-card-title,
          .travel-smart-card-description,
          .travel-smart-card-link,
          .travel-smart-card-link svg,
          .travel-smart-card-index {
            transition: none !important;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-ocean-100/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-safari-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <div className="mx-auto mb-9 max-w-3xl text-center sm:mb-11">
            <span className="mb-2 inline-block font-inter text-xs font-bold uppercase tracking-[0.2em] text-safari-500">{content.label}</span>
            <h2 id="traveler-essentials-title" className="font-poppins text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">{content.title}</h2>
            <p className="mt-3 font-inter text-sm leading-6 text-foreground/70 sm:text-base sm:leading-7">{content.subtitle}</p>
          </div>
        </AnimateOnScroll>

        <div
          className="travel-smart-tabs"
          aria-label={content.title}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {content.items.map(({ title, text, href }, index) => {
            const Icon = ESSENTIAL_ICONS[index] ?? MapPinned;
            const isActive = displayedIndex === index;
            const distance = index - displayedIndex;
            const absDistance = Math.abs(distance);
            const direction = isRTL ? -1 : 1;

            let transform: string;
            let zIndex: number;
            let opacity = 1;

            if (isActive) {
              transform = 'translate(-50%, -50%) translateX(0) translateY(0) rotate(0deg) scale(1)';
              zIndex = 50;
            } else {
              const x = direction * distance * 82;
              const y = absDistance * 7;
              const rotation = direction * distance * 2.2;
              const scale = Math.max(0.86, 1 - absDistance * 0.035);
              zIndex = 40 - absDistance;
              opacity = Math.max(0.72, 1 - absDistance * 0.05);
              transform = `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) rotate(${rotation}deg) scale(${scale})`;
            }

            const cardStyle = {
              transform,
              zIndex,
              opacity,
            } as CSSProperties;

            return (
              <Link
                key={`${locale}-${index}-${title}`}
                href={href}
                aria-label={title}
                aria-current={isActive ? 'true' : undefined}
                onMouseEnter={() => setHoveredIndex(index)}
                onFocus={() => setHoveredIndex(index)}
                onClick={() => setActiveIndex(index)}
                className={`travel-smart-card group focus:outline-none focus-visible:ring-2 focus-visible:ring-safari-400 focus-visible:ring-offset-4 ${isActive ? 'is-active' : ''}`}
                style={cardStyle}
              >
                <div className="travel-smart-card-inner">
                  <div className="travel-smart-card-icon" aria-hidden="true">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="travel-smart-card-copy">
                    <h3 className="travel-smart-card-title font-poppins">{title}</h3>
                    <p className="travel-smart-card-description font-inter">{text}</p>
                  </div>

                  <span className="travel-smart-card-link font-inter">
                    {content.learnMore}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>

                <span className="travel-smart-card-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              </Link>
            );
          })}

          <span className="travel-smart-instruction" aria-hidden="true">Hover to reveal · Focus to explore</span>
        </div>
      </div>
    </section>
  );
}
