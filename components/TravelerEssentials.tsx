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
          display: flex;
          gap: 12px;
          align-items: stretch;
          width: 100%;
          min-height: 370px;
        }

        .travel-smart-card {
          position: relative;
          flex: 0 0 var(--travel-card-width);
          width: var(--travel-card-width);
          min-width: 0;
          min-height: 370px;
          overflow: hidden;
          border: 1px solid rgba(225, 214, 193, 0.72);
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.76);
          box-shadow: 0 12px 35px rgba(13, 27, 42, 0.06);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          transition:
            flex-basis 900ms cubic-bezier(0.22, 1, 0.36, 1),
            width 900ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 500ms ease,
            box-shadow 500ms ease,
            border-color 500ms ease;
          will-change: flex-basis, width, transform;
        }

        .travel-smart-card:hover,
        .travel-smart-card:focus-within {
          transform: translateY(-4px);
          box-shadow: 0 24px 55px rgba(13, 27, 42, 0.12);
          border-color: rgba(255, 112, 0, 0.28);
        }

        .travel-smart-card::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.05) 48%, rgba(255,112,0,0.08));
          transition: opacity 500ms ease;
        }

        .travel-smart-card.is-active::before {
          opacity: 1;
        }

        .travel-smart-card-inner {
          position: relative;
          z-index: 1;
          display: flex;
          height: 100%;
          min-width: 0;
          flex-direction: column;
          padding: 26px;
        }

        .travel-smart-card-icon {
          display: flex;
          height: 48px;
          width: 48px;
          flex: 0 0 48px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(225, 214, 193, 0.6);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.8);
          color: #ff7000;
          box-shadow: 0 7px 20px rgba(13, 27, 42, 0.06);
          transition: transform 500ms ease, box-shadow 500ms ease;
        }

        .travel-smart-card.is-active .travel-smart-card-icon {
          transform: scale(1.05);
          box-shadow: 0 10px 26px rgba(255, 112, 0, 0.14);
        }

        .travel-smart-card-copy {
          min-width: 0;
          margin-top: 24px;
        }

        .travel-smart-card-title {
          overflow: hidden;
          font-size: 1.18rem;
          line-height: 1.25;
          font-weight: 800;
          color: #0d1b2a;
          transition: font-size 500ms ease, transform 500ms ease;
        }

        .travel-smart-card.is-active .travel-smart-card-title {
          font-size: 1.45rem;
        }

        .travel-smart-card-description,
        .travel-smart-card-link {
          opacity: 0;
          visibility: hidden;
          transform: translateY(12px);
          pointer-events: none;
          transition:
            opacity 450ms ease,
            visibility 450ms ease,
            transform 650ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .travel-smart-card.is-active .travel-smart-card-description,
        .travel-smart-card.is-active .travel-smart-card-link {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
          pointer-events: auto;
        }

        .travel-smart-card-description {
          margin-top: 14px;
          font-size: 0.98rem;
          line-height: 1.7;
          color: rgba(13, 27, 42, 0.7);
        }

        .travel-smart-card-link {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 7px;
          margin-top: auto;
          padding-top: 24px;
          color: #087ea4;
          font-size: 0.82rem;
          font-weight: 800;
        }

        .travel-smart-card-link svg {
          transition: transform 300ms ease;
        }

        .travel-smart-card-link:hover svg,
        .travel-smart-card-link:focus-visible svg {
          transform: translateX(4px);
        }

        .travel-smart-tab-hint {
          position: absolute;
          right: 22px;
          bottom: 20px;
          left: 22px;
          pointer-events: none;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          opacity: 0.5;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0d1b2a;
          transition: opacity 400ms ease;
        }

        .travel-smart-card.is-active .travel-smart-tab-hint {
          opacity: 0;
        }

        @media (max-width: 999px) {
          .travel-smart-tabs {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
            min-height: 0;
          }

          .travel-smart-card {
            width: 100%;
            min-height: 260px;
            flex-basis: 100%;
          }

          .travel-smart-card-inner {
            padding: 20px;
          }

          .travel-smart-card-title,
          .travel-smart-card.is-active .travel-smart-card-title {
            font-size: 1.05rem;
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

          .travel-smart-tab-hint {
            display: none;
          }
        }

        @media (max-width: 639px) {
          .travel-smart-tabs {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .travel-smart-card {
            min-height: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .travel-smart-card,
          .travel-smart-card::before,
          .travel-smart-card-icon,
          .travel-smart-card-title,
          .travel-smart-card-description,
          .travel-smart-card-link,
          .travel-smart-card-link svg {
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
            const width = index === displayedIndex ? 40 : 12;

            return (
              <Link
                key={`${locale}-${index}-${title}`}
                href={href}
                aria-label={title}
                aria-current={isActive ? 'true' : undefined}
                onMouseEnter={() => setHoveredIndex(index)}
                onFocus={() => setHoveredIndex(index)}
                onClick={() => setActiveIndex(index)}
                className={`travel-smart-card group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-safari-400 focus-visible:ring-offset-4 ${isActive ? 'is-active' : ''}`}
                style={{ '--travel-card-width': `${width}%` } as CSSProperties}
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

                <span className="travel-smart-tab-hint" aria-hidden="true">{title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
