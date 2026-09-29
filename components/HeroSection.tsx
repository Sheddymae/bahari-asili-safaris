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

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 250);
    return () => window.clearTimeout(id);
  }, []);

  const updateMenuPosition = useCallback(() => {
    const button = locationButtonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom + 6, left: rect.left, width: rect.width });
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
      if (event.key === 'Escape') setIsLocOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isLocOpen]);

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
        <div className="fixed z-[10000] max-h-72 overflow-y-auto rounded-xl border border-border bg-white shadow-2xl" style={{ top: menuPosition.top, left: menuPosition.left, width: menuPosition.width }} role="listbox" aria-label={t.bookingOverlay.selectDest}>
          {locations.map((loc) => (
            <button key={loc} type="button" role="option" aria-selected={location === loc} onClick={() => { setLocation(loc); setIsLocOpen(false); }} className="block w-full border-b border-sand-100 px-4 py-3 text-left font-inter text-sm text-foreground transition-colors last:border-0 hover:bg-sand-50 hover:text-ocean-700">
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
        <CinematicTextOverlay onPlan={() => onBook({ destination: location, adults: Math.min(30, Math.max(1, Number.parseInt(people, 10) || 1)), arrivalDate: date })} />
        <div className={(mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0') + ' hidden sm:block absolute bottom-6 left-1/2 z-30 w-full -translate-x-1/2 px-4 transition-all duration-300 sm:bottom-8 sm:px-6'} style={{ pointerEvents: mounted ? 'auto' : 'none' }}>
          <div className="mx-auto flex max-w-5xl flex-col items-stretch gap-2 rounded-2xl border border-white/30 bg-white/95 p-3 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:p-4">
            <div className="relative min-w-0 flex-1">
              <button ref={locationButtonRef} type="button" aria-haspopup="listbox" aria-expanded={isLocOpen} onClick={() => { if (!isLocOpen) updateMenuPosition(); setIsLocOpen((open) => !open); }} className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left transition-colors hover:bg-sand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600">
                <MapPin className="h-4 w-4 flex-shrink-0 text-safari-500" />
                <span className="min-w-0 flex-1">
                  <span className="block font-inter text-xs font-medium text-muted-foreground">{t.hero.location}</span>
                  <span className={'block truncate font-inter text-sm ' + (location ? 'font-medium text-foreground' : 'text-muted-foreground')}>{location || t.bookingOverlay.selectDest}</span>
                </span>
                <ChevronDown className={'h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform ' + (isLocOpen ? 'rotate-180' : '')} />
              </button>
            </div>

            <div className="hidden h-10 w-px self-center bg-muted sm:block" />

            <label className="min-w-0 flex-1">
              <span className="flex items-center gap-2 rounded-xl px-4 py-3 transition-colors hover:bg-sand-50">
                <Users className="h-4 w-4 flex-shrink-0 text-safari-500" />
                <span className="min-w-0 flex-1">
                  <span className="block font-inter text-xs font-medium text-muted-foreground">{t.hero.people}</span>
                  <input type="number" min="1" max="30" value={people} onChange={(e) => setPeople(e.target.value)} className="w-full border-none bg-transparent font-inter text-sm font-medium text-foreground outline-none" aria-label={t.hero.people} />
                </span>
              </span>
            </label>

            <div className="hidden h-10 w-px self-center bg-muted sm:block" />

            <label className="min-w-0 flex-1">
              <span className="flex items-center gap-2 rounded-xl px-4 py-3 transition-colors hover:bg-sand-50">
                <CalendarDays className="h-4 w-4 flex-shrink-0 text-safari-500" />
                <span className="min-w-0 flex-1">
                  <span className="block font-inter text-xs font-medium text-muted-foreground">{t.hero.date}</span>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full cursor-pointer border-none bg-transparent font-inter text-sm text-foreground outline-none" aria-label={t.hero.date} />
                </span>
              </span>
            </label>

            <button type="button" onClick={handleBookClick} className="whitespace-nowrap rounded-xl bg-book px-8 py-3.5 font-poppins font-semibold text-white transition-colors hover:bg-book-600 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-book focus-visible:ring-offset-2">
              {t.hero.bookNow} →
            </button>
          </div>
        </div>
      </CinematicHeroVideo>
      {dropdown}
    </>
  );
}
