'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Users, CalendarDays, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackConversion } from '@/components/Analytics';
import CinematicHeroVideo from './CinematicHeroVideo';
import CinematicTextOverlay from './CinematicTextOverlay';
import type { HeroBookingSelection } from './HeroBookingModal';

const locations = ['Tsavo East, Kenya', 'Masai Mara, Kenya', 'Amboseli, Kenya', 'Taita Hills, Kenya', 'Lake Nakuru, Kenya', 'Tsavo West, Kenya', 'Watamu Beach', 'Lamu Island'];

export default function HeroSection({ onBook }: { onBook: (selection: HeroBookingSelection) => void }) {
  const { t } = useLanguage();
  const [location, setLocation] = useState('');
  const [people, setPeople] = useState('2');
  const [date, setDate] = useState('');
  const [isLocOpen, setIsLocOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const locationButtonRef = useRef<HTMLButtonElement>(null);
  const [activeLocationIndex, setActiveLocationIndex] = useState(-1);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 250);
    return () => window.clearTimeout(id);
  }, []);

  const updateMenuPosition = useCallback(() => {
    const button = locationButtonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom + 8, left: rect.left, width: rect.width });
  }, []);

  useEffect(() => {
    if (!isLocOpen) return;
    updateMenuPosition();
    const handlePosition = () => updateMenuPosition();
    window.addEventListener('resize', handlePosition);
    window.addEventListener('scroll', handlePosition, true);
    return () => {
      window.removeEventListener('resize', handlePosition);
      window.removeEventListener('scroll', handlePosition, true);
    };
  }, [isLocOpen, updateMenuPosition]);

  useEffect(() => {
    if (!isLocOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLocOpen(false);
        setActiveLocationIndex(-1);
        locationButtonRef.current?.focus();
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveLocationIndex((index) => Math.min(index + 1, locations.length - 1));
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveLocationIndex((index) => Math.max(index - 1, 0));
      }
      if (event.key === 'Enter' && activeLocationIndex >= 0) {
        event.preventDefault();
        setLocation(locations[activeLocationIndex]);
        setIsLocOpen(false);
        setActiveLocationIndex(-1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeLocationIndex, isLocOpen]);

  const handleBookClick = useCallback(() => {
    trackConversion('booking_started', { location: 'hero_quick_start' });
    onBook({
      destination: location,
      adults: Math.min(30, Math.max(1, Number.parseInt(people, 10) || 1)),
      arrivalDate: date,
    });
  }, [date, location, onBook, people]);

  const dropdown = isLocOpen && typeof document !== 'undefined'
    ? createPortal(
        <div
          className="fixed z-[10000] max-h-72 overflow-y-auto border border-line bg-paper/98 shadow-editorial backdrop-blur-xl"
          style={{ top: menuPosition.top, left: menuPosition.left, width: menuPosition.width }}
          role="listbox"
          aria-label={t.bookingOverlay.selectDest}
        >
          {locations.map((loc, index) => (
            <button
              key={loc}
              type="button"
              role="option"
              aria-selected={location === loc}
              aria-current={activeLocationIndex === index ? 'true' : undefined}
              onClick={() => { setLocation(loc); setIsLocOpen(false); setActiveLocationIndex(-1); }}
              className={'block w-full border-b border-line/60 px-4 py-3 text-left font-grotesk text-sm transition-colors last:border-0 hover:bg-shell hover:text-ocean ' + (activeLocationIndex === index ? 'bg-shell text-ocean' : 'text-ink')}
            >
              {loc}
            </button>
          ))}
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <CinematicHeroVideo>
        <CinematicTextOverlay
          onPlan={() => onBook({
            destination: location,
            adults: Math.min(30, Math.max(1, Number.parseInt(people, 10) || 1)),
            arrivalDate: date,
          })}
        />

        <div
          className={(mounted ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0') + ' absolute bottom-3 left-1/2 z-30 w-full -translate-x-1/2 px-3 transition-all duration-500 sm:bottom-6 sm:px-6 lg:bottom-8'}
          style={{ pointerEvents: mounted ? 'auto' : 'none' }}
        >
          <div className="mx-auto grid max-w-6xl border border-white/25 bg-paper/95 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,.22)] backdrop-blur-xl sm:grid-cols-[1.35fr_.75fr_1fr_auto] sm:items-stretch sm:p-2">
            <div className="relative min-w-0">
              <button
                ref={locationButtonRef}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isLocOpen}
                onClick={() => {
                  if (!isLocOpen) {
                    updateMenuPosition();
                    setActiveLocationIndex(Math.max(0, locations.indexOf(location)));
                  } else {
                    setActiveLocationIndex(-1);
                  }
                  setIsLocOpen((open) => !open);
                }}
                className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-shell focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean"
              >
                <MapPin className="h-4 w-4 flex-shrink-0 text-coral" />
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{t.hero.location}</span>
                  <span className={'mt-0.5 block truncate font-grotesk text-sm ' + (location ? 'font-medium text-ink' : 'text-muted-foreground')}>{location || t.bookingOverlay.selectDest}</span>
                </span>
                <ChevronDown className={'h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform ' + (isLocOpen ? 'rotate-180' : '')} />
              </button>
            </div>

            <div className="hidden w-px bg-line/80 sm:block" />

            <label className="min-w-0">
              <span className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-shell">
                <Users className="h-4 w-4 flex-shrink-0 text-coral" />
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{t.hero.people}</span>
                  <input type="number" min="1" max="30" value={people} onChange={(e) => setPeople(e.target.value)} className="mt-0.5 w-full border-none bg-transparent font-grotesk text-sm font-medium text-ink outline-none" aria-label={t.hero.people} />
                </span>
              </span>
            </label>

            <div className="hidden w-px bg-line/80 sm:block" />

            <label className="min-w-0">
              <span className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-shell">
                <CalendarDays className="h-4 w-4 flex-shrink-0 text-coral" />
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{t.hero.date}</span>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-0.5 w-full cursor-pointer border-none bg-transparent font-grotesk text-sm text-ink outline-none" aria-label={t.hero.date} />
                </span>
              </span>
            </label>

            <button
              type="button"
              onClick={handleBookClick}
              className="min-h-14 w-full whitespace-nowrap bg-coral px-6 py-3.5 font-grotesk text-xs font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-coral/90 hover:shadow-lg active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 sm:w-auto sm:px-8"
            >
              {t.hero.bookNow} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </CinematicHeroVideo>
      {dropdown}
    </>
  );
}
