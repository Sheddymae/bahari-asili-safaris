export { safaris as coreSafaris, excursions, DEFAULT_INCLUDED, DEFAULT_EXCLUDED } from '@/lib/tours-data';
import { safaris as coreSafaris } from '@/lib/tours-data';
import { safariCatalogueAdditions } from '@/lib/safari-catalogue-additions';

// Public catalogue = existing products + new destination-based products.
// Existing IDs are preserved so historical bookings and URLs remain stable.
export const safaris = [...coreSafaris, ...safariCatalogueAdditions];
