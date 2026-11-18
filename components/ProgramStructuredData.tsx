import type { ProgramGuide } from '@/lib/program-guide';
import type { Safari } from '@/lib/tours-data';

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://bahari-asili-safaris.vercel.app').replace(/\/$/, '');
}

/**
 * JSON-LD generated from the same ProgramGuide object that renders the visible
 * sections, so markup and visible content cannot drift. No Offer or rating is
 * emitted because the business publishes neither a fixed from-price nor
 * first-party verified reviews on the page.
 */
export default function ProgramStructuredData({ guide, safari }: { guide: ProgramGuide; safari: Safari }) {
  const site = baseUrl();
  const pageUrl = `${site}/safaris/${encodeURIComponent(guide.slug)}`;

  const trip = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': `${pageUrl}#trip`,
    name: guide.name,
    description: guide.answerCapsule,
    url: pageUrl,
    inLanguage: 'en',
    dateModified: guide.reviewed,
    touristType: [
      guide.children.capsule.includes('older children') ? 'Families with older children' : 'Families',
      'Couples',
      'Small groups',
    ],
    itinerary: {
      '@type': 'ItemList',
      name: `${guide.name} day-by-day itinerary`,
      numberOfItems: safari.itinerary.length,
      itemListElement: safari.itinerary.map((day, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'TouristAttraction',
          name: day.title || day.day,
          description: [day.morning, day.afternoon, day.overnight].filter(Boolean).join(' '),
        },
      })),
    },
    provider: {
      '@type': 'TravelAgency',
      '@id': `${site}/#business`,
      name: 'Bahari Asili Safaris',
      url: site,
    },
    touristDestination: safari.parks.map((park) => ({ '@type': 'TouristDestination', name: park })),
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumbs`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: site },
      { '@type': 'ListItem', position: 2, name: 'Safaris', item: `${site}/tours` },
      { '@type': 'ListItem', position: 3, name: guide.name, item: pageUrl },
    ],
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: guide.faqs.map((entry) => ({
      '@type': 'Question',
      name: entry.q,
      acceptedAnswer: { '@type': 'Answer', text: entry.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(trip).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq).replace(/</g, '\\u003c') }} />
    </>
  );
}
