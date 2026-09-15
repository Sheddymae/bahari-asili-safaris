import type { Locale } from './i18n';
import type { Destination } from './destinations-data';
import { destinationTranslations } from './destination-translations';
import { expandedDestinationTranslations } from './expanded-destination-translations';

/**
 * Resolves destination-derived content used inside safari detail pages.
 * The safari itself may come from Supabase/static catalogue, while these
 * supporting sections (best season, wildlife and FAQs) live in destination
 * data. Keep the relationship intact and localize only the customer-facing
 * copy; never alter booking/pricing/catalogue data.
 */
export function getLocalizedSafariDestination(destination: Destination, locale: Locale): Destination {
  if (locale === 'en') return destination;

  const translated = destinationTranslations[locale]?.[destination.slug]
    ?? expandedDestinationTranslations[locale]?.[destination.slug];

  if (!translated) return destination;

  return {
    ...destination,
    ...translated,
    slug: destination.slug,
    heroImage: destination.heroImage,
    wildlifeHighlights: translated.wildlifeHighlights ?? destination.wildlifeHighlights,
    faqs: translated.faqs ?? destination.faqs,
  };
}
