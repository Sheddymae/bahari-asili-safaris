'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Users, CalendarDays, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import CinematicHeroVideo from './CinematicHeroVideo';
import CinematicTextOverlay from './CinematicTextOverlay';
import { prefersReducedMotion } from '@/lib/video-config';
import type { HeroBookingSelection } from './HeroBookingModal';

const locations = [
  'Tsavo East, Kenya',
  'Masai Mara, Kenya',
  'Amboseli, Kenya',
  'Taita Hills, Kenya',
  'Lake Nakuru, Kenya',
  'Tsavo West, Kenya',
  'Watamu Beach',
  'Lamu Island',
];

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
    const id = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(id);
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

  const handleScrollClick = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleBookClick = useCallback(() => {
    onBook({
      destination: location,
      adults: Math.min(30, Math.max(1, parseInt(people, 10) || 1)),
      arrivalDate: date,
    });
  }, [date, location, onBook, people]);

  const showBookingForm = mounted;
  const dropdown = isLocOpen && typeof document !== 'undefined'
    ? createPortal(
        <div
          className="fixed z-[10000] max-h-72 overflow-y-auto rounded-xl border border-border bg-white shadow-2xl"
          style={{ top: menuPosition.top, left: menuPosition.left, width: menuPosition.width }}
          role="listbox"
          aria-label="Choose destination"
        >
          {locations.map((loc) => (
            <button
              key={loc}
              type="button"
              role="option"
              aria-selected={location === loc}
              onClick={() => {
                setLocation(loc);
                setIsLocOpen(false);
              }}
              className="block w-full border-b border-sand-100 px-4 py-3 text-left font-inter text-sm text-foreground transition-colors last:border-0 hover:bg-sand-50 hover:text-ocean-700"
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
        <CinematicTextOverlay />
        {!prefersReducedMotion() && (
          <div
            className={`absolute bottom-8 left-1/2 z-30 w-full -translate-x-1/2 px-4 transition-all duration-500 sm:px-6 ${showBookingForm ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ pointerEvents: showBookingForm ? 'auto' : 'none' }}
          >
            <div className="mx-auto flex max-w-5xl flex-col items-stretch gap-2 rounded-2xl bg-white/95 p-3 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center sm:p-4">
              <div className="relative min-w-0 flex-1">
                <button
                  ref={locationButtonRef}
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isLocOpen}
                  onClick={() => {
                    if (!isLocOpen) updateMenuPosition();
                    setIsLocOpen((open) => !open);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-4 py-3 transition-colors hover:bg-sand-50"
                >
                  <MapPin className="h-4 w-4 flex-shrink-0 text-safari-500" />
                  <div className="min-w-0 flex-1 text-left">
                    <div className="font-inter text-xs font-medium text-muted-foreground">{t.hero?.location || 'Location'}</div>
                    <div className={`truncate font-inter text-sm ${location ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{location || 'Where to?'}</div>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 flex-shrink-0 text-muted-foreground transition-transform ${isLocOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
              <div className="hidden h-10 w-px self-center bg-muted sm:block" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 rounded-xl px-4 py-3 transition-colors hover:bg-sand-50">
                  <Users className="h-4 w-4 flex-shrink-0 text-safari-500" />
                  <div className="min-w-0 flex-1">
                    <div className="font-inter text-xs font-medium text-muted-foreground">{t.hero?.people || 'Guests'}</div>
                    <input type="number" min="1" max="30" value={people} onChange={(e) => setPeople(e.target.value)} className="w-full border-none bg-transparent font-inter text-sm font-medium text-foreground outline-none" />
                  </div>
                </div>
              </div>
              <div className="hidden h-10 w-px self-center bg-muted sm:block" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 rounded-xl px-4 py-3 transition-colors hover:bg-sand-50">
                  <CalendarDays className="h-4 w-4 flex-shrink-0 text-safari-500" />
                  <div className="min-w-0 flex-1">
                    <div className="font-inter text-xs font-medium text-muted-foreground">{t.hero?.date || 'When'}</div>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full cursor-pointer border-none bg-transparent font-inter text-sm text-foreground outline-none" />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleBookClick}
                className="glow-button whitespace-nowrap rounded-xl bg-book px-8 py-3.5 font-poppins font-semibold text-white transition-all duration-200 hover:bg-book-600 active:scale-95"
              >
                {t.hero?.bookNow || 'Check Availability'} →
              </button>
            </div>
          </div>
        )}
      </CinematicHeroVideo>
      {dropdown}
    </>
  );
}
