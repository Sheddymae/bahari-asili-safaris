'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FLAG_COMPONENTS } from '@/components/flags/SvgFlags';
import type { Locale } from '@/lib/i18n';

export const LANGUAGES: {
  code: Locale;
  label: string;
  native: string;
  greeting: string;
  row: 'inner' | 'outer';
}[] = [
  // Keep the established two-arc arrangement: outer arc left-to-right,
  // then inner arc left-to-right. Do not replace this with a grid/dropdown.
  { code: 'de', label: 'German', native: 'Deutsch', greeting: 'Hallo', row: 'outer' },
  { code: 'fr', label: 'French', native: 'Français', greeting: 'Bonjour', row: 'outer' },
  { code: 'it', label: 'Italian', native: 'Italiano', greeting: 'Ciao', row: 'outer' },
  { code: 'en', label: 'English', native: 'English', greeting: 'Hello', row: 'outer' },
  { code: 'sw', label: 'Swahili', native: 'Kiswahili', greeting: 'Habari', row: 'inner' },
  { code: 'ar', label: 'Arabic', native: 'العربية', greeting: 'مرحباً', row: 'inner' },
  { code: 'zh', label: 'Chinese', native: '中文', greeting: '你好', row: 'inner' },
  { code: 'es', label: 'Spanish', native: 'Español', greeting: 'Hola', row: 'inner' },
];

const ARC_START_DEG = 5;
const ARC_END_DEG = 93;
const FLAGS_PER_ROW = 4;
const DESKTOP_INNER_RADIUS = 78;
const DESKTOP_OUTER_RADIUS = 145;
const MOBILE_INNER_RADIUS = 65;
const MOBILE_OUTER_RADIUS = 125;

function tworowPositions(innerRadius: number, outerRadius: number): Record<Locale, { x: number; y: number }> {
  const codes = LANGUAGES.map((l) => l.code);
  const step = (ARC_END_DEG - ARC_START_DEG) / (FLAGS_PER_ROW - 1);

  const entries = codes.map((code, i) => {
    const angleIndex = i % FLAGS_PER_ROW;
    const radius = i < FLAGS_PER_ROW ? outerRadius : innerRadius;
    const deg = ARC_START_DEG + step * angleIndex;
    const rad = (deg * Math.PI) / 180;
    return [code, { x: radius * Math.cos(rad), y: -radius * Math.sin(rad) }] as const;
  });

  return Object.fromEntries(entries) as Record<Locale, { x: number; y: number }>;
}

const DESKTOP_POS = tworowPositions(DESKTOP_INNER_RADIUS, DESKTOP_OUTER_RADIUS);
const MOBILE_POS = tworowPositions(MOBILE_INNER_RADIUS, MOBILE_OUTER_RADIUS);

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return isMobile;
}

export default function LanguageFloatingSelector() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [justSelected, setJustSelected] = useState<Locale | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const positions = isMobile ? MOBILE_POS : DESKTOP_POS;
  const currentLanguage = LANGUAGES.find((lang) => lang.code === locale);

  useEffect(() => {
    return () => {
      if (selectedTimerRef.current) clearTimeout(selectedTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const handleSelect = (code: Locale) => {
    setLocale(code);
    setOpen(false);
    setJustSelected(code);

    if (selectedTimerRef.current) clearTimeout(selectedTimerRef.current);
    selectedTimerRef.current = setTimeout(() => setJustSelected(null), 1500);
  };

  return (
    <div
      ref={wrapperRef}
      className="fixed z-[60]"
      style={{
        left: 'max(16px, env(safe-area-inset-left))',
        bottom: 'max(16px, env(safe-area-inset-bottom))',
      }}
    >
      <div className="relative h-12 w-12 sm:h-[52px] sm:w-[52px]">
        <AnimatePresence>
          {open &&
            LANGUAGES.map((lang, i) => {
              const pos = positions[lang.code];
              const isActive = lang.code === locale;
              const Flag = FLAG_COMPONENTS[lang.code];
              const isOuterFlag = i < FLAGS_PER_ROW;
              const floatDistance = 1.5 + (i % 3) * 0.9;
              const floatDuration = 3.2 + (i % 4) * 0.45;

              return (
                <motion.button
                  key={lang.code}
                  type="button"
                  data-no-glow="true"
                  role="menuitem"
                  aria-label={'Switch language to ' + lang.native}
                  onClick={() => handleSelect(lang.code)}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.72, x: 0, y: 0 }
                  }
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1, scale: 1, x: pos.x, y: pos.y }
                      : { opacity: 1, scale: 1, x: pos.x, y: pos.y }
                  }
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, scale: 0.72, x: 0, y: 0 }
                  }
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.12, y: pos.y - 3 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : 0.36,
                    delay: prefersReducedMotion ? 0 : i * 0.045,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={[
                    'group absolute bottom-0 left-0 flex items-center justify-center rounded-full border bg-white shadow-md transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700 focus-visible:ring-offset-2',
                    isActive
                      ? 'border-ocean-700 ring-2 ring-ocean-700/40'
                      : 'border-border',
                    isOuterFlag ? 'h-9 w-9' : 'h-7 w-7',
                  ].join(' ')}
                >
                  <motion.span
                    className="relative flex h-full w-full items-center justify-center overflow-visible rounded-full"
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : { y: [0, -floatDistance, 0] }
                    }
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : {
                            duration: floatDuration,
                            delay: i * 0.12,
                            repeat: Infinity,
                            repeatType: 'mirror',
                            ease: 'easeInOut',
                          }
                    }
                  >
                    <span className="absolute inset-0 overflow-hidden rounded-full">
                      <Flag className="h-full w-full" />
                    </span>

                    {isActive && (
                      <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-1 rounded-full border border-ocean-700/45"
                        animate={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : { opacity: [0.35, 0.75, 0.35], scale: [1, 1.06, 1] }
                        }
                        transition={
                          prefersReducedMotion
                            ? undefined
                            : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                        }
                      />
                    )}
                  </motion.span>

                  <span className="sr-only">{lang.label}</span>

                  <span
                    className="pointer-events-none absolute left-1/2 top-[-2.5rem] z-[9999] -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 font-inter text-[11px] text-white opacity-0 shadow-lg transition-all duration-150 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    {lang.native}
                  </span>
                </motion.button>
              );
            })}
        </AnimatePresence>

        <motion.button
          type="button"
          data-no-glow="true"
          aria-label={
            currentLanguage
              ? 'Change language. Current language: ' + currentLanguage.native
              : 'Change language'
          }
          aria-expanded={open}
          aria-haspopup="true"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  rotate: open ? 8 : 0,
                  scale: open ? 1.05 : 1,
                }
          }
          whileHover={prefersReducedMotion ? undefined : { scale: open ? 1.08 : 1.05 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-foreground/15 bg-white/95 shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-700 focus-visible:ring-offset-2 sm:h-[52px] sm:w-[52px]"
        >
          <motion.span
            className="absolute inset-0 rounded-full border border-ocean-700/0"
            aria-hidden="true"
            animate={
              prefersReducedMotion || open
                ? { opacity: 0, scale: 1 }
                : { opacity: [0, 0.28, 0], scale: [0.9, 1.12, 1.18] }
            }
            transition={
              prefersReducedMotion || open
                ? undefined
                : { duration: 4.8, repeat: Infinity, repeatDelay: 7, ease: 'easeOut' }
            }
          />

          <Globe
            className="relative z-10 h-5 w-5 text-foreground sm:h-[22px] sm:w-[22px]"
            strokeWidth={1.75}
          />

          <span
            className="pointer-events-none absolute left-1/2 top-[-2.25rem] hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 font-inter text-[11px] text-white opacity-0 shadow-sm transition-all duration-150 group-hover:-translate-y-0.5 group-hover:opacity-100 sm:block"
            aria-hidden="true"
          >
            {currentLanguage?.native ?? locale}
          </span>
        </motion.button>

        <AnimatePresence>
          {justSelected && currentLanguage && (
            <motion.div
              key={justSelected}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 6, scale: 0.96 }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1 }
              }
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 4, scale: 0.98 }
              }
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute bottom-[60px] left-0 whitespace-nowrap rounded-full border border-white/70 bg-white/90 px-3 py-1.5 font-inter text-[11px] font-medium text-foreground shadow-lg backdrop-blur-md sm:bottom-[64px]"
              role="status"
              aria-live="polite"
            >
              {currentLanguage.greeting} · {currentLanguage.native}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
