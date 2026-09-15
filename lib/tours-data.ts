export type SafariTab = 'tsavo' | 'amboseli' | 'mara' | 'taita';

export interface Safari {
  id: string;
  name: string;
  tagline: string;
  days: number;
  nights: number;
  parks: string[];
  lodges: string[];
  tabs: SafariTab[];
  /** Destination slugs used by the expanded destination catalogue. */
  destinationSlugs?: string[];
  rating: number;
  reviewCount: number;
  image: string;
  category: 'short' | 'medium' | 'long';
  popular?: boolean;
  highlights: string[];
  itinerary: { day: string; title: string; morning: string; afternoon: string; overnight: string }[];
  packingTips: string[];
  included?: string[];
  excluded?: string[];
  activityLevel?: number; // 1-5
  comfortLevel?: number; // 1-5
}

// Standard inclusions/exclusions shared across every safari package unless a
// specific package overrides them below. Reflects Bahari Asili's normal
// operating model — adjust per-package via the `included`/`excluded` fields
// on individual entries if a package genuinely differs (e.g. a balloon add-on).
export const DEFAULT_INCLUDED = [
  'KWS park entry fees',
  '4x4 safari vehicle with pop-up roof',
  'English & Italian-speaking driver-guide',
  'Full board (breakfast, lunch, dinner)',
  'Drinking water during game drives',
  'All accommodation as per itinerary',
  'Airport / hotel pickup & drop-off',
];

export const DEFAULT_EXCLUDED = [
  'International & domestic flights',
  'Visa fees',
  'Travel & medical insurance',
  'Tips and gratuities for guides & staff',
  'Alcoholic & premium bottled drinks',
  'Personal expenses & souvenirs',
  'Optional activities (balloon safaris, spa, etc.)',
];

const packingTips = [
  'High SPF sunscreen (50+)',
  'Wide-brim hat',
  'Tropical insect repellent (DEET-based)',
  'Light long-sleeved shirts and trousers (neutral colours)',
  'English 3-pin plug adapter (Type G)',
  'Binoculars (7x50 or 10x42)',
  'Comfortable closed-toe shoes for game walks',
  'Swimwear and flip-flops for lodge pool',
  'Small torch/headlamp',
  'Camera with spare battery',
  'NO DRONES — strictly prohibited in all national parks',
];

export const safaris: Safari[] = [