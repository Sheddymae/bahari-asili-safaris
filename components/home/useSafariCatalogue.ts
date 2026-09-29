'use client';

import { useEffect, useState } from 'react';
import { safaris as staticSafaris } from '@/lib/safari-catalogue';
import type { Safari } from '@/lib/tours-data';
import type { SafariLocale } from '@/lib/safari-content-i18n';

const LOCALES = ['en', 'it', 'fr', 'es', 'de', 'ar', 'zh', 'sw'];

export function useSafariCatalogue(locale: string): { safaris: Safari[]; safariLocale: SafariLocale } {
  const safariLocale = (LOCALES.includes(locale) ? locale : 'en') as SafariLocale;
  const [safaris, setSafaris] = useState<Safari[]>(staticSafaris);
  useEffect(() => {
    let active = true;
    fetch(`/api/programs?locale=${safariLocale}`)
      .then((response) => response.json())
      .then((data) => {
        if (!active || !data?.success || !Array.isArray(data.programs) || data.programs.length === 0) return;
        setSafaris(data.programs as Safari[]);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [safariLocale]);
  return { safaris, safariLocale };
}
