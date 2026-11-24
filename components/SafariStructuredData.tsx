import type { Safari } from '@/lib/tours-data';
import { SITE_URL } from '@/lib/site';
import { safariRouteSlug } from '@/lib/safari-slugs';


type Props = {
  safari: Safari;
  siteUrl?: string;
};

export default function SafariStructuredData({ safari, siteUrl }: Props) {
  const baseUrl = (siteUrl || SITE_URL).replace(/\/$/, '');
  const pageUrl = `${baseUrl}/safaris/${encodeURIComponent(safariRouteSlug(safari))}`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    '@id': `${pageUrl}#trip`,
    name: safari.name,
    description: safari.tagline,
    url: pageUrl,
    touristType: ['Wildlife and nature travellers'],
    itinerary: {
      '@type': 'ItemList',
      name: `${safari.name} day-by-day itinerary`,
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
      name: 'Bahari Asili Safaris',
      url: baseUrl,
    },
    touristDestination: safari.parks.map((park) => ({
      '@type': 'TouristDestination',
      name: park,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
