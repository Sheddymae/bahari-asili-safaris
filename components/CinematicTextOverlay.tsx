'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { translations, type Locale } from '@/lib/i18n';

export default function CinematicTextOverlay() {
  const { locale, isRTL } = useLanguage();
  const activeLocale = (['en', 'it', 'fr', 'es', 'de', 'ar', 'zh', 'sw'] as Locale[]).includes(locale) ? locale : 'en';
  const hero = translations[activeLocale].hero;

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 pb-28 text-center font-manrope" dir={isRTL && activeLocale === 'ar' ? 'rtl' : 'ltr'} style={{ fontFamily: 'var(--font-manrope), "Noto Sans", "Segoe UI", Arial, sans-serif' }}>
      <h1 className="max-w-full font-extrabold leading-tight text-white drop-shadow-xl" style={{ fontSize: 'clamp(2.35rem, 7.5vw, 6.25rem)', letterSpacing: '-0.045em' }}>BAHARI ASILI SAFARIS</h1>
      <p className="mt-6 max-w-3xl font-bold text-white drop-shadow-md" style={{ fontSize: 'clamp(1.25rem, 2.6vw, 1.85rem)' }}>{hero.title}</p>
      <p className="mt-3 max-w-2xl text-white/90 drop-shadow-md" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)' }}>{hero.subtitle}</p>
    </div>
  );
}
