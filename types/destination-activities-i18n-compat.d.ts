import type { Locale } from '@/lib/i18n';

declare module '@/lib/destination-activities-i18n' {
  /**
   * All IDs rendered by DestinationDetailClient come from the canonical
   * destinationActivities catalogue, whose localized copy is defined for
   * every supported locale. Keep the public UI contract non-null so strict
   * TypeScript builds do not require null checks for known catalogue items.
   */
  export function getLocalizedDestinationActivity(
    id: string,
    locale: Locale
  ): {
    name: string;
    description: string;
    duration: string;
    level: string;
  };
}
