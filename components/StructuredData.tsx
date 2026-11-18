import { SITE_URL } from '@/lib/site';

export default function StructuredData() {
  const siteUrl = SITE_URL;
  const phone = '+254101923355';
  const email = 'bahariasilisafaris@gmail.com';

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TravelAgency',
        '@id': `${siteUrl}/#business`,
        name: 'Bahari Asili Safaris',
        url: siteUrl,
        description:
          'Kenyan-owned safari and travel company based in Watamu, Kenya, arranging private and group safaris, coastal experiences, excursions and transfers.',
        telephone: phone,
        email,
        logo: `${siteUrl}/images/logo/icon-512.png`,
        image: `${siteUrl}/images/logo/icon-512.png`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Watamu',
          addressRegion: 'Kilifi County',
          addressCountry: 'KE',
        },
        areaServed: [
          { '@type': 'Country', name: 'Kenya' },
          { '@type': 'Country', name: 'Tanzania' },
        ],
        knowsLanguage: ['en', 'it', 'fr', 'es', 'de', 'ar', 'zh', 'sw'],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: phone,
          email,
          contactType: 'customer service',
          availableLanguage: ['English', 'Italian', 'French', 'Spanish', 'German', 'Arabic', 'Chinese', 'Swahili'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Bahari Asili Safaris',
        publisher: { '@id': `${siteUrl}/#business` },
        inLanguage: ['en', 'it', 'fr', 'es', 'de', 'ar', 'zh', 'sw'],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${siteUrl}/#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
