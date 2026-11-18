import type { Locale } from '@/lib/i18n';

export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'it', 'fr', 'es', 'de', 'ar', 'zh', 'sw'];
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/** English keeps the existing public URLs; the other languages use stable prefixes. */
export function localizedPath(pathname: string, locale: Locale): string {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const segments = cleanPath.split('/');
  if (isLocale(segments[1] || '')) segments.splice(1, 1);
  const path = segments.join('/') || '/';
  return locale === DEFAULT_LOCALE ? path : `/${locale}${path === '/' ? '' : path}`;
}

export function localeAlternates(pathname: string, siteUrl: string): Record<string, string> {
  return Object.fromEntries([
    ...SUPPORTED_LOCALES.map((locale) => [locale, new URL(localizedPath(pathname, locale), siteUrl).toString()]),
    ['x-default', new URL(localizedPath(pathname, DEFAULT_LOCALE), siteUrl).toString()],
  ]);
}
