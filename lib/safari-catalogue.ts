export { safaris as coreSafaris, excursions, DEFAULT_INCLUDED, DEFAULT_EXCLUDED } from '@/lib/tours-data';
import { safaris as coreSafaris } from '@/lib/tours-data';
import { safariCatalogueAdditions } from '@/lib/safari-catalogue-additions';
import { regionalSafariAdditions } from '@/lib/regional-safari-additions';
=======
import { regionalSafaris } from '@/lib/regional-safaris';

// Public catalogue = existing products + destination-based products.
// Existing IDs are preserved so historical bookings and URLs remain stable.
export const safaris = [...coreSafaris, ...safariCatalogueAdditions, ...regionalSafariAdditions];
=======
export const safaris = [...coreSafaris, ...safariCatalogueAdditions, ...regionalSafaris];
