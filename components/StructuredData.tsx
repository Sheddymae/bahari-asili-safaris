export default function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bahari-asili-safaris.vercel.app';
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'TouristInformationCenter', '@id': `${siteUrl}/#business`, name: 'Bahari Asili Safaris', url: siteUrl, description: 'Kenyan owned safari and travel company based in Watamu, offering Kenya safaris, coastal experiences, excursions and transfers.', telephone: '+254101923355', email: 'info@bahariasili.com', address: { '@type': 'PostalAddress', addressLocality: 'Watamu', addressCountry: 'KE' }, areaServed: 'Kenya', knowsLanguage: ['en', 'it', 'fr', 'es', 'de', 'ar', 'zh', 'sw'] },
      { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: siteUrl, name: 'Bahari Asili Safaris', publisher: { '@id': `${siteUrl}/#business` }, inLanguage: ['en', 'it', 'fr', 'es', 'de', 'ar', 'zh', 'sw'] },
      { '@type': 'BreadcrumbList', '@id': `${siteUrl}/#breadcrumbs`, itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }] },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
