import './globals.css';
import './responsive.css';
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { translations, type Locale } from '@/lib/i18n';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import LanguageFloatingSelector from '@/components/LanguageFloatingSelector';
import CookieConsent from '@/components/CookieConsent';
import Analytics from '@/components/Analytics';
import WhatsAppButton from '@/components/WhatsAppButton';
import SessionGuard from '@/components/auth/SessionGuard';
import { SITE_URL } from '@/lib/site';
import { isLocale, localeAlternates } from '@/lib/i18n-routing';



export const viewport = { width: 'device-width', initialScale: 1, colorScheme: 'light' } as const;

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const localeValue = requestHeaders.get('x-bahari-locale') || 'en';
  const locale = isLocale(localeValue) ? localeValue : 'en';
  const pathname = requestHeaders.get('x-bahari-path') || '/';
  const canonical = new URL(pathname, SITE_URL).toString();
  const openGraphLocale: Record<string, string> = {
    en: 'en_KE', it: 'it_IT', fr: 'fr_FR', es: 'es_ES',
    de: 'de_DE', ar: 'ar', zh: 'zh_CN', sw: 'sw_KE',
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: 'Bahari Asili Safaris | Kenya Safaris from Watamu', template: '%s | Bahari Asili Safaris' },
    description: 'Plan Kenya safaris from Watamu to Tsavo, Amboseli, Masai Mara and Taita Hills, plus Indian Ocean experiences, transfers and private excursions.',
    alternates: {
      canonical,
      languages: localeAlternates(pathname, SITE_URL),
    },
    robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    icons: { icon: [{ url: '/images/logo/icon-192.png', sizes: '192x192', type: 'image/png' }, { url: '/images/logo/icon-512.png', sizes: '512x512', type: 'image/png' }], apple: '/images/logo/apple-touch-icon.png' },
    openGraph: { type: 'website', locale: openGraphLocale[locale] || 'en_KE', url: canonical, siteName: 'Bahari Asili Safaris', title: 'Bahari Asili Safaris | Kenya Safaris from Watamu', description: 'Private Kenya safaris, coastal experiences and transfers planned from Watamu with local support.', images: [{ url: '/images/logo/icon-512.png', width: 512, height: 512, alt: 'Bahari Asili Safaris' }] },
    twitter: { card: 'summary_large_image', title: 'Bahari Asili Safaris | Kenya Safaris from Watamu', description: 'Private Kenya safaris, coastal experiences and transfers planned from Watamu.', images: ['/images/logo/icon-512.png'] },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get('x-bahari-locale');
  const cookieLocale = cookieStore.get('bahari-locale')?.value;
  const candidateLocale = headerLocale || cookieLocale || 'en';
  const initialLocale: Locale = Object.prototype.hasOwnProperty.call(translations, candidateLocale) ? candidateLocale as Locale : 'en';
  return (
    <html lang={initialLocale} dir={initialLocale === 'ar' ? 'rtl' : 'ltr'} className="scroll-smooth bg-sand-50">
      <body className="bg-sand-50">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ocean-600">Skip to main content</a>
        <AuthProvider>
          <LanguageProvider initialLocale={initialLocale}>
            <SessionGuard />
            {children}
            <LanguageFloatingSelector />
            <WhatsAppButton />
            <CookieConsent />
          </LanguageProvider>
        </AuthProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
