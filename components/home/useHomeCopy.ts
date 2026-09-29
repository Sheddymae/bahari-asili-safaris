'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { getHomeLanding, formatUnit } from '@/lib/home-landing-i18n';

export function useHomeCopy() {
  const { locale, t, isRTL } = useLanguage();
  return { c: getHomeLanding(locale), locale, t, isRTL, unit: (n: number | string, unit: string) => formatUnit(locale, n, unit) };
}
