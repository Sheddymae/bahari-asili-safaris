import './globals.css';
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { cookies } from 'next/headers';
import { translations, type Locale } from '@/lib/i18n';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import LanguageFloatingSelector from '@/components/LanguageFloatingSelector';
import CookieConsent from '@/components/CookieConsent';
import Analytics from '@/components/Analytics';
import WhatsAppButton from '@/components/WhatsAppButton';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bahari-asili-safaris.vercel.app';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Bahari Asili Safaris | Kenya Safaris from Watamu',
    template: '%s | Bahari Asili Safaris',
  },
  description: 'Plan Kenya safaris from Watamu to Tsavo, Amboseli, Masai Mara and Taita Hills, plus Indian Ocean experiences, transfers and private excursions.',
  keywords: [
    'Watamu safaris', 'Kenya safaris', 'Tsavo safari', 'Amboseli safari', 'Masai Mara safari',
    'Taita Hills safari', 'Kenya coast', 'safari from Watamu', 'private Kenya safari',
  ],
  alternates: { canonical: '/', languages: { en: '/', it: '/', fr: '/', es: '/', de: '/', ar: '/', zh: '/', sw: '/' } },
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  icons: {
    icon: [
      { url: '/images/logo/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/logo/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/images/logo/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    alternateLocale: ['it_IT', 'fr_FR', 'es_ES', 'de_DE', 'ar', 'zh_CN', 'sw_KE'],
    url: siteUrl,
    siteName: 'Bahari Asili Safaris',
    title: 'Bahari Asili Safaris | Kenya Safaris from Watamu',
    description: 'Private Kenya safaris, coastal experiences and transfers planned from Watamu with local support.',
    images: [{ url: '/images/logo/icon-512.png', width: 512, height: 512, alt: 'Bahari Asili Safaris' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bahari Asili Safaris | Kenya Safaris from Watamu',
    description: 'Private Kenya safaris, coastal experiences and transfers planned from Watamu.',
    images: ['/images/logo/icon-512.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieLocale = cookies().get('bahari-locale')?.value as Locale | undefined;
  const initialLocale = cookieLocale && Object.prototype.hasOwnProperty.call(translations, cookieLocale) ? cookieLocale : 'en';
  return (
    <html lang={initialLocale} dir={initialLocale === 'ar' ? 'rtl' : 'ltr'} className={`scroll-smooth bg-sand-50 ${manrope.variable}`}>
      <body className="bg-sand-50">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-lg focus:bg-white focus:px-4 focus:py-3 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ocean-600">
          Skip to main content
        </a>
        <AuthProvider>
          <LanguageProvider initialLocale={initialLocale}>
            {children}
            <LanguageFloatingSelector />
            <WhatsAppButton />
            <CookieConsent locale={initialLocale} />
          </LanguageProvider>
        </AuthProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
