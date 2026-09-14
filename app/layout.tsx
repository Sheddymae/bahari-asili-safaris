import './globals.css';
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { cookies } from 'next/headers';
import { Manrope } from 'next/font/google';
import { translations, type Locale } from '@/lib/i18n';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/toaster';
import LanguageFloatingSelector from '@/components/LanguageFloatingSelector';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bahari-asili-safaris.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Bahari Asili Safaris - Watamu & Kenya Safaris',
    template: '%s | Bahari Asili Safaris',
  },
  description: 'Kenya safaris from Watamu to Tsavo, Amboseli, Masai Mara & Taita Hills, plus Indian Ocean coastal experiences, transfers & excursions.',
  keywords: [
    'Watamu safaris', 'Kenya safaris', 'Tsavo safari', 'Amboseli safari', 'Masai Mara safari',
    'Taita Hills safari', 'Kenya coast', 'Indian Ocean experiences', 'safari from Watamu',
  ],
  alternates: { canonical: '/' },
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
    url: siteUrl,
    siteName: 'Bahari Asili Safaris',
    title: 'Bahari Asili Safaris - Watamu & Kenya Safaris',
    description: 'Kenya safaris from Watamu to Tsavo, Amboseli, Masai Mara & Taita Hills, plus Indian Ocean coastal experiences, transfers & excursions.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieLocale = cookies().get('bahari-locale')?.value as Locale | undefined;
  const initialLocale = cookieLocale && Object.prototype.hasOwnProperty.call(translations, cookieLocale) ? cookieLocale : 'en';
  return (
    <html lang={initialLocale} className={`scroll-smooth bg-sand-50 ${manrope.variable}`}>
      <body className="bg-sand-50">
        <AuthProvider>
          <LanguageProvider initialLocale={initialLocale}>
            {children}
            <LanguageFloatingSelector />
          </LanguageProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
