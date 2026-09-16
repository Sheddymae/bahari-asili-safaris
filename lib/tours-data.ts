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
  priceTier?: 'budget' | 'mid-range' | 'luxury'; // optional override — derived from comfortLevel if unset
}

// Per-person pricing is quote-based (varies by group size and dates), so we
// show a tier badge instead of a number. If a safari doesn't set `priceTier`
// explicitly, we derive one from its existing `comfortLevel` (1-5) so every
// safari gets a sensible badge with zero extra data entry.
export function getPriceTier(safari: Pick<Safari, 'priceTier' | 'comfortLevel'>): 'budget' | 'mid-range' | 'luxury' {
  if (safari.priceTier) return safari.priceTier;
  const c = safari.comfortLevel ?? 3;
  if (c <= 2) return 'budget';
  if (c >= 4) return 'luxury';
  return 'mid-range';
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
  {
    id: 'experience',
    priceTier: 'mid-range',
    name: '2-Day Tsavo East Safari',
    tagline: 'Your first taste of the wild Kenya',
    days: 2,
    nights: 1,
    parks: ['Tsavo East'],
    lodges: ['Voi Wildlife Lodge', 'Manyatta Camp'],
    rating: 4.9,
    reviewCount: 148,
    tabs: ['tsavo'],
    image: '/images/safaris/safari-experience-tsavo.jpg',
    category: 'short',
    activityLevel: 2, // 1-5 scale, illustrative — review against real trip pace
    comfortLevel: 4, // 1-5 scale, illustrative — review against actual lodges
    popular: true,
    highlights: ['Red-dust elephants', 'Mudanda Rock viewpoint', 'Aruba Dam wildlife', 'Big tusker sightings'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Watamu → Tsavo East',
        morning: 'Early departure from Watamu. Drive through scenic Malindi and Galana River landscapes, entering Tsavo East through the Voi gate. Check into Voi Wildlife Lodge and enjoy the spectacular waterhole view over lunch.',
        afternoon: 'Afternoon game drive across the Voi Plains. Spot the famous red-dust elephants, buffalo herds, zebras, and if you are lucky, lions resting under the acacia trees. Sundowner at the lodge.',
        overnight: 'Voi Wildlife Lodge or Manyatta Camp',
      },
      {
        day: 'Day 2',
        title: 'Tsavo East → Watamu',
        morning: 'Sunrise game drive — golden light makes for incredible photography. Visit Mudanda Rock, a dramatic natural dam attracting hundreds of elephants, and Aruba Dam teeming with hippos and crocodiles.',
        afternoon: 'Depart Tsavo East after a late breakfast. Return drive through the bush back to Watamu, arriving late afternoon.',
        overnight: 'Return to Watamu',
      },
    ],
    packingTips,
  },
  {
    id: 'inside',
    priceTier: 'mid-range',
    name: '3-Day Tsavo East & Amboseli Safari',
    tagline: 'Elephants, red dust, and Kilimanjaro skies',
    days: 3,
    nights: 2,
    parks: ['Tsavo East', 'Amboseli'],
    lodges: ['Voi Wildlife Lodge', 'AA Lodge Amboseli'],
    rating: 4.9,
    reviewCount: 122,
    tabs: ['tsavo', 'amboseli'],
    image: '/images/safaris/safari-inside-tsavo-amboseli.jpg',
    category: 'short',
    activityLevel: 2, // 1-5 scale, illustrative — review against real trip pace
    comfortLevel: 4, // 1-5 scale, illustrative — review against actual lodges
    highlights: ['Big Five wildlife', 'Mt Kilimanjaro panoramas', '400+ elephant herds', 'Observation Hill'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Watamu → Tsavo East',
        morning: 'Depart Watamu at dawn. Enter Tsavo East National Park through Voi gate. Settle into the lodge with sweeping waterhole views.',
        afternoon: 'Afternoon game drive spotting red elephants, lions, leopards, and cheetahs on the Voi plains. Campfire dinner at the lodge.',
        overnight: 'Voi Wildlife Lodge',
      },
      {
        day: 'Day 2',
        title: 'Tsavo East → Amboseli',
        morning: 'Morning game drive in Tsavo East — best hours for predator sightings. Visit the classic Mudanda Rock viewpoint.',
        afternoon: 'Transfer to Amboseli National Park via Tsavo East\'s Kimana gate. First views of Kilimanjaro at sunset are breathtaking. Afternoon game drive with massive elephant herds.',
        overnight: 'AA Lodge Amboseli',
      },
      {
        day: 'Day 3',
        title: 'Amboseli → Watamu',
        morning: 'Dawn game drive — catch elephants silhouetted against the snow-capped Kilimanjaro at sunrise. Visit Observation Hill for panoramic views of the swamp.',
        afternoon: 'Late breakfast at lodge. Return journey to Watamu, arriving evening.',
        overnight: 'Return to Watamu',
      },
    ],
    packingTips,
  },
  {
    id: 'nala',
    name: '3-Day Tsavo East & Taita Hills Safari',
    tagline: 'The secret garden of the Taita Hills',
    days: 3,
    nights: 2,
    parks: ['Tsavo East', 'Taita Hills'],
    lodges: ['Sentrim Tsavo', 'Salt Lick Safari Lodge'],
    rating: 4.8,
    reviewCount: 94,
    tabs: ['taita', 'tsavo'],
    image: '/images/safaris/safari-nala-taita.jpg',
    category: 'short',
    activityLevel: 3, // 1-5 scale, illustrative — review against real trip pace
    comfortLevel: 4, // 1-5 scale, illustrative — review against actual lodges
    highlights: ['Salt Lick waterhole by night', 'Taita Hills endemic birds', 'Red elephants of Tsavo', 'Underground bunker hide'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Watamu → Tsavo East',
        morning: 'Early morning departure from Watamu to Tsavo East. Enter through Sala gate with views over the Galana River corridor.',
        afternoon: 'Afternoon game drive focusing on the riverine areas where lions and leopards hunt. Overnight at Sentrim Tsavo with spectacular savanna views.',
        overnight: 'Sentrim Tsavo',
      },
      {
        day: 'Day 2',
        title: 'Tsavo East → Taita Hills',
        morning: 'Game drive to the iconic Mudanda Rock. Watch elephants queue to drink at the natural dam below.',
        afternoon: 'Transfer to the magical Taita Hills Wildlife Sanctuary. Salt Lick Safari Lodge is built on stilts above a floodlit waterhole — animals arrive freely at all hours. Underground bunker viewing at dusk.',
        overnight: 'Salt Lick Safari Lodge',
      },
      {
        day: 'Day 3',
        title: 'Taita Hills → Watamu',
        morning: 'Early morning waterhole watch from the lodge. Spot hyenas, buffalo, and nocturnal animals returning to the bush. Final game drive through the Taita Hills sanctuary.',
        afternoon: 'Depart after brunch. Return to Watamu coast.',
        overnight: 'Return to Watamu',
      },
    ],
    packingTips,
  },
  {
    id: 'simba-timon',
    priceTier: 'mid-range',
    name: '4-Day Tsavo & Amboseli Safari',
    tagline: 'Three parks, one legendary journey',
    days: 4,
    nights: 3,
    parks: ['Tsavo East', 'Tsavo West', 'Amboseli'],
    lodges: ['Voi Wildlife Lodge', 'Kilima Camp', 'AA Lodge Amboseli'],
    rating: 4.9,
    reviewCount: 107,
    tabs: ['tsavo', 'amboseli'],
    image: '/images/safaris/safari-simba-timon.jpg',
    category: 'medium',
    activityLevel: 3, // 1-5 scale, illustrative — review against real trip pace
    comfortLevel: 4, // 1-5 scale, illustrative — review against actual lodges
    popular: true,
    highlights: ['Mzima Springs hippos', 'Shetani Lava flow', 'Kilimanjaro elephants', 'Man-Eaters of Tsavo history'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Watamu → Tsavo East',
        morning: 'Departure from Watamu at dawn. Drive to Tsavo East, Kenya\'s largest national park.',
        afternoon: 'Afternoon game drive on the Voi Plains. Settle into Voi Wildlife Lodge overlooking the active waterhole.',
        overnight: 'Voi Wildlife Lodge',
      },
      {
        day: 'Day 2',
        title: 'Full day Tsavo East',
        morning: 'Sunrise game drive visiting Mudanda Rock and the famous Aruba Dam — one of Africa\'s great wildlife spectacles.',
        afternoon: 'Afternoon drives to the Yatta Plateau. Learn the story of the Man-Eaters of Tsavo at the park information centre.',
        overnight: 'Voi Wildlife Lodge',
      },
      {
        day: 'Day 3',
        title: 'Tsavo West → Amboseli',
        morning: 'Cross to Tsavo West. Snorkel with hippos and crocodiles at the crystal-clear Mzima Springs. Walk the Shetani Lava flow boardwalk.',
        afternoon: 'Transfer to Amboseli through Chyulu Hills. First views of Kilimanjaro at sunset. Evening game drive with tuskers.',
        overnight: 'Kilima Camp / AA Lodge Amboseli',
      },
      {
        day: 'Day 4',
        title: 'Amboseli → Watamu',
        morning: 'Final sunrise game drive. Elephants at the swamp with Kilimanjaro glowing behind them — the iconic Kenya photograph.',
        afternoon: 'Return journey to the Watamu coast.',
        overnight: 'Return to Watamu',
      },
    ],
    packingTips,
  },
  {
    id: 'zazu',
    priceTier: 'mid-range',
    name: '3-Day Masai Mara Safari',
    tagline: 'The Masai Mara — Africa\'s greatest wildlife show',
    days: 3,
    nights: 2,
    parks: ['Masai Mara'],
    lodges: ['Manyatta Camp', 'Sentrim Mara'],
    rating: 5.0,
    reviewCount: 183,
    tabs: ['mara'],
    image: '/images/safaris/safari-zazu.jpg',
    category: 'short',
    activityLevel: 2, // 1-5 scale, illustrative — review against real trip pace
    comfortLevel: 5, // 1-5 scale, illustrative — review against actual lodges
    popular: true,
    highlights: ['Great Wildebeest Migration (Jul–Oct)', 'Big Five in one day', 'Maasai village visit', 'Hot air balloon optional'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Watamu → Masai Mara',
        morning: 'Early flight or road transfer from the coast to the Masai Mara. Check into camp and enjoy a welcome bush lunch with views over the Mara River.',
        afternoon: 'Afternoon game drive on the open Mara plains — lions, cheetahs, and massive elephant herds await. Sundowner with acacia silhouettes.',
        overnight: 'Manyatta Camp or Sentrim Mara',
      },
      {
        day: 'Day 2',
        title: 'Full Day Masai Mara',
        morning: 'Full-day game drive with packed bush picnic. Witness the famous wildebeest migration river crossing (July–October) — one of the most dramatic scenes in nature.',
        afternoon: 'Afternoon drive tracking the big cats. Visit a traditional Maasai village in the late afternoon, meet the warriors and elders.',
        overnight: 'Manyatta Camp or Sentrim Mara',
      },
      {
        day: 'Day 3',
        title: 'Masai Mara → Watamu',
        morning: 'Dawn game drive — catch the sunrise over the Mara River. Lions are most active at this hour.',
        afternoon: 'Transfer back to Watamu coast.',
        overnight: 'Return to Watamu',
      },
    ],
    packingTips,
  },
  {
    id: 'twiga',
    priceTier: 'mid-range',
    name: '4-Day Tsavo, Taita Hills & Amboseli Safari',
    tagline: 'Tall horizons across four landscapes',
    days: 4,
    nights: 3,
    parks: ['Tsavo East', 'Taita Hills', 'Amboseli'],
    lodges: ['Voi Wildlife Lodge', 'Salt Lick Safari Lodge', 'AA Lodge Amboseli'],
    rating: 4.8,
    reviewCount: 79,
    tabs: ['taita', 'amboseli'],
    image: '/images/safaris/safari-twiga.jpg',
    category: 'medium',
    activityLevel: 3, // 1-5 scale, illustrative — review against real trip pace
    comfortLevel: 4, // 1-5 scale, illustrative — review against actual lodges
    highlights: ['Salt Lick nocturnal waterhole', 'Amboseli elephant families', 'Tsavo big tuskers', 'Taita Hills biodiversity'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Watamu → Tsavo East',
        morning: 'Depart Watamu early and drive to Tsavo East. Enter through Sala gate following the Galana River.',
        afternoon: 'Afternoon game drive through the open plains. Red dust elephants are the star attraction.',
        overnight: 'Voi Wildlife Lodge',
      },
      {
        day: 'Day 2',
        title: 'Tsavo East → Taita Hills',
        morning: 'Early game drive at Mudanda Rock and Aruba Dam.',
        afternoon: 'Transfer to the Taita Hills Wildlife Sanctuary. Check into the iconic Salt Lick Safari Lodge. Underground bunker game viewing at dusk as animals crowd the waterhole.',
        overnight: 'Salt Lick Safari Lodge',
      },
      {
        day: 'Day 3',
        title: 'Taita Hills → Amboseli',
        morning: 'Dawn waterhole watch and final drive in Taita Hills sanctuary.',
        afternoon: 'Transfer to Amboseli. Afternoon game drive with the first views of Kilimanjaro and massive elephant herds.',
        overnight: 'AA Lodge Amboseli',
      },
      {
        day: 'Day 4',
        title: 'Amboseli → Watamu',
        morning: 'Sunrise drive in Amboseli — elephants at the swamp with Kilimanjaro.',
        afternoon: 'Return to Watamu coast.',
        overnight: 'Return to Watamu',
      },
    ],
    packingTips,
  },
  {
    id: 'rafiki',
    priceTier: 'mid-range',
    name: '5-Day Tsavo, Taita Hills & Amboseli Safari',
    tagline: 'Five days of pure Kenya wilderness',
    days: 5,
    nights: 4,
    parks: ['Tsavo East', 'Tsavo West', 'Taita Hills', 'Amboseli'],
    lodges: ['Voi Wildlife Lodge', 'Sentrim Tsavo', 'Salt Lick Safari Lodge', 'AA Lodge Amboseli'],
    rating: 4.9,
    reviewCount: 61,
    tabs: ['taita', 'tsavo'],
    image: '/images/safaris/safari-rafiki.jpg',
    category: 'medium',
    activityLevel: 3, // 1-5 scale, illustrative — review against real trip pace
    comfortLevel: 4, // 1-5 scale, illustrative — review against actual lodges
    highlights: ['Mzima Springs hippos', 'Salt Lick by night', 'Shetani Lava flow', 'Full Big Five experience', 'Kilimanjaro views'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Watamu → Tsavo East',
        morning: 'Early departure from Watamu to Tsavo East. Enter through Sala gate following the scenic Galana River.',
        afternoon: 'Afternoon game drive on the Voi Plains. Spot the famous red-dust elephants and settle into the lodge.',
        overnight: 'Voi Wildlife Lodge',
      },
      {
        day: 'Day 2',
        title: 'Full day Tsavo East',
        morning: 'Sunrise game drive to Mudanda Rock and Aruba Dam. Hundreds of elephants gather here in the dry season.',
        afternoon: 'Afternoon drives toward the Yatta Plateau escarpment. Search for the elusive leopard and cheetah.',
        overnight: 'Sentrim Tsavo',
      },
      {
        day: 'Day 3',
        title: 'Tsavo West → Taita Hills',
        morning: 'Cross to Tsavo West. Explore Mzima Springs where hippos and crocodiles lurk in crystal water. Walk the Shetani Lava flow boardwalk.',
        afternoon: 'Transfer to Taita Hills Wildlife Sanctuary and check into Salt Lick Safari Lodge.',
        overnight: 'Salt Lick Safari Lodge',
      },
      {
        day: 'Day 4',
        title: 'Taita Hills → Amboseli',
        morning: 'Dawn waterhole watch and morning drive in Taita Hills.',
        afternoon: 'Transfer to Amboseli. Afternoon game drive in the shadow of Kilimanjaro.',
        overnight: 'AA Lodge Amboseli',
      },
      {
        day: 'Day 5',
        title: 'Amboseli → Watamu',
        morning: 'Final sunrise game drive in Amboseli — elephants at the Enkongo Narok swamp.',
        afternoon: 'Return to Watamu coast.',
        overnight: 'Return to Watamu',
      },
    ],
    packingTips,
  },
  {
    id: 'tumbili',
    name: '4-Day Masai Mara & Lake Nakuru Safari',
    tagline: 'Flamingos, Mara lions, and endless savanna',
    days: 4,
    nights: 3,
    parks: ['Lake Nakuru', 'Masai Mara'],
    lodges: ['Milimani Hotel Nakuru', 'Manyatta Camp'],
    rating: 4.8,
    reviewCount: 88,
    tabs: ['mara'],
    image: '/images/safaris/safari-tumbili.jpg',
    category: 'medium',
    activityLevel: 3, // 1-5 scale, illustrative — review against real trip pace
    comfortLevel: 3, // 1-5 scale, illustrative — review against actual lodges
    highlights: ['Pink flamingo lake', 'White and black rhino sanctuary', 'Masai Mara Big Five', 'Mara River crossing'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Watamu → Lake Nakuru',
        morning: 'Long transfer from Watamu to the Great Rift Valley. Arrive Lake Nakuru and check into hotel.',
        afternoon: 'Afternoon game drive in Lake Nakuru National Park. The lake turns pink with thousands of flamingos. Search for the rare white rhino in the sanctuary.',
        overnight: 'Milimani Hotel Nakuru',
      },
      {
        day: 'Day 2',
        title: 'Lake Nakuru → Masai Mara',
        morning: 'Morning game drive around Lake Nakuru — spot waterbuck, baboon, and the resident lion pride.',
        afternoon: 'Transfer to the world-famous Masai Mara. Late afternoon arrival and first game drive at golden hour.',
        overnight: 'Manyatta Camp',
      },
      {
        day: 'Day 3',
        title: 'Full day Masai Mara',
        morning: 'Full-day game drive with bush picnic. Seek out the wildebeest migration and river crossings (Jul–Oct). Lions, cheetahs, leopards, and hyenas hunt on the open plains.',
        afternoon: 'Afternoon drive and optional Maasai village visit.',
        overnight: 'Manyatta Camp',
      },
      {
        day: 'Day 4',
        title: 'Masai Mara → Watamu',
        morning: 'Last sunrise drive on the Mara before transfer.',
        afternoon: 'Return to Watamu coast, arriving evening.',
        overnight: 'Return to Watamu',
      },
    ],
    packingTips,
  },
  {
    id: 'tembo',
    priceTier: 'mid-range',
    name: '6-Day Grand Kenya Safari',
    tagline: 'Six days — the full heart of Kenya',
    days: 6,
    nights: 5,
    parks: ['Masai Mara', 'Lake Nakuru', 'Amboseli', 'Tsavo East'],
    lodges: ['Sentrim Mara', 'Milimani Hotel Nakuru', 'AA Lodge Amboseli', 'Voi Wildlife Lodge'],
    rating: 5.0,
    reviewCount: 52,
    tabs: ['mara', 'amboseli'],
    image: '/images/safaris/safari-tembo.jpg',
    category: 'long',
    activityLevel: 4, // 1-5 scale, illustrative — review against real trip pace
    comfortLevel: 4, // 1-5 scale, illustrative — review against actual lodges
    popular: true,
    highlights: ['Great Migration', 'Flamingo shores', 'Kilimanjaro sunrise', 'Big tuskers of Tsavo', 'Full Big Five'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Watamu → Lake Nakuru',
        morning: 'Drive from Watamu to the Rift Valley. Arrive Lake Nakuru and settle into the hotel.',
        afternoon: 'Afternoon drive: flamingo lake, lion pride, white rhinos in the sanctuary.',
        overnight: 'Milimani Hotel Nakuru',
      },
      {
        day: 'Day 2',
        title: 'Lake Nakuru → Masai Mara',
        morning: 'Morning game drive in Nakuru — waterbuck, giraffe, tree-climbing lions.',
        afternoon: 'Transfer to Masai Mara. Late afternoon game drive on arrival.',
        overnight: 'Sentrim Mara',
      },
      {
        day: 'Day 3',
        title: 'Full day Masai Mara',
        morning: 'Full-day game drive. Witness the Mara River wildebeest crossing (Jul–Oct). Cheetahs, leopards, elephants, and massive hippo pods.',
        afternoon: 'Maasai village cultural visit. Sundowner on the Mara escarpment.',
        overnight: 'Sentrim Mara',
      },
      {
        day: 'Day 4',
        title: 'Masai Mara → Amboseli',
        morning: 'Dawn game drive, then transfer south to Amboseli National Park.',
        afternoon: 'Afternoon drive with Kilimanjaro and elephant herds.',
        overnight: 'AA Lodge Amboseli',
      },
      {
        day: 'Day 5',
        title: 'Amboseli → Tsavo East',
        morning: 'Sunrise at Amboseli swamp — elephants, hippos, birds. Transfer to Tsavo East.',
        afternoon: 'Afternoon game drive in Tsavo East. Red-dust elephants and big tuskers.',
        overnight: 'Voi Wildlife Lodge',
      },
      {
        day: 'Day 6',
        title: 'Tsavo East → Watamu',
        morning: 'Morning drive: Mudanda Rock and Aruba Dam.',
        afternoon: 'Return to Watamu coast.',
        overnight: 'Return to Watamu',
      },
    ],
    packingTips,
  },
  {
    id: 'sarabi',
    name: '7-Day Ultimate Kenya Safari',
    tagline: 'Seven parks, seven unforgettable nights',
    days: 7,
    nights: 6,
    parks: ['Masai Mara', 'Lake Nakuru', 'Amboseli', 'Tsavo East', 'Tsavo West'],
    lodges: ['Sentrim Mara', 'Milimani Hotel Nakuru', 'AA Lodge Amboseli', 'Kilima Camp', 'Voi Wildlife Lodge'],
    rating: 5.0,
    reviewCount: 38,
    tabs: ['mara', 'tsavo'],
    image: '/images/safaris/safari-sarabi.jpg',
    category: 'long',
    activityLevel: 4, // 1-5 scale, illustrative — review against real trip pace
    comfortLevel: 3, // 1-5 scale, illustrative — review against actual lodges
    highlights: ['Great Wildebeest Migration', 'Mzima Springs snorkelling', 'All Big Five parks', 'Shetani Lava walk', 'Flamingo lake'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Watamu → Lake Nakuru',
        morning: 'Long drive from Watamu to the Rift Valley.',
        afternoon: 'Game drive: flamingos, rhinos, lions in Lake Nakuru.',
        overnight: 'Milimani Hotel Nakuru',
      },
      {
        day: 'Day 2',
        title: 'Lake Nakuru → Masai Mara',
        morning: 'Morning Nakuru drive, then transfer to the Mara.',
        afternoon: 'Arrival game drive on the Mara plains.',
        overnight: 'Sentrim Mara',
      },
      {
        day: 'Day 3',
        title: 'Full day Masai Mara',
        morning: 'All-day game drive: wildebeest crossing, cheetahs, leopards, lions.',
        afternoon: 'Maasai village visit and cultural experience.',
        overnight: 'Sentrim Mara',
      },
      {
        day: 'Day 4',
        title: 'Masai Mara → Amboseli',
        morning: 'Sunrise Mara drive, then transfer south.',
        afternoon: 'Amboseli game drive — Kilimanjaro at sunset.',
        overnight: 'AA Lodge Amboseli',
      },
      {
        day: 'Day 5',
        title: 'Amboseli → Tsavo West',
        morning: 'Dawn elephant watch at Amboseli swamp.',
        afternoon: 'Transfer to Tsavo West. Mzima Springs hippos and crocodiles. Shetani Lava walk.',
        overnight: 'Kilima Camp',
      },
      {
        day: 'Day 6',
        title: 'Tsavo West → Tsavo East',
        morning: 'Morning drive in Tsavo West. Transfer to Tsavo East via Tsavo River.',
        afternoon: 'Afternoon game drive: red elephants, Mudanda Rock.',
        overnight: 'Voi Wildlife Lodge',
      },
      {
        day: 'Day 7',
        title: 'Tsavo East → Watamu',
        morning: 'Sunrise drive: Aruba Dam and Galana River.',
        afternoon: 'Return to Watamu coast.',
        overnight: 'Return to Watamu',
      },
    ],
    packingTips,
  },
  {
    id: 'mufasa',
    name: '8-Day Complete Kenya Safari',
    tagline: 'The ultimate Kenya safari — eight days, no compromises',
    days: 8,
    nights: 7,
    parks: ['Masai Mara', 'Lake Nakuru', 'Amboseli', 'Taita Hills', 'Tsavo West', 'Tsavo East'],
    lodges: ['Sentrim Mara', 'Milimani Hotel Nakuru', 'AA Lodge Amboseli', 'Salt Lick Safari Lodge', 'Kilima Camp', 'Voi Wildlife Lodge'],
    rating: 5.0,
    reviewCount: 27,
    tabs: ['mara', 'taita', 'amboseli', 'tsavo'],
    image: '/images/safaris/safari-mufasa.jpg',
    category: 'long',
    activityLevel: 5, // 1-5 scale, illustrative — review against real trip pace
    comfortLevel: 3, // 1-5 scale, illustrative — review against actual lodges
    highlights: ['All six major parks', 'Full Big Five multiple encounters', 'Salt Lick nocturnal waterhole', 'Mzima Springs', 'Great Migration', 'Kilimanjaro at dawn'],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Watamu → Lake Nakuru',
        morning: 'Long drive from Watamu to the Rift Valley — the spine of Kenya.',
        afternoon: 'Game drive in Lake Nakuru: flamingos, rhinos, buffalos.',
        overnight: 'Milimani Hotel Nakuru',
      },
      {
        day: 'Day 2',
        title: 'Lake Nakuru → Masai Mara',
        morning: 'Morning Nakuru drive, then cross the Mau Escarpment.',
        afternoon: 'Arrival at Masai Mara, first game drive at golden hour.',
        overnight: 'Sentrim Mara',
      },
      {
        day: 'Day 3',
        title: 'Full day Masai Mara',
        morning: 'All-day game drive: the Great Migration, river crossings, Big Five.',
        afternoon: 'Maasai cultural village visit.',
        overnight: 'Sentrim Mara',
      },
      {
        day: 'Day 4',
        title: 'Masai Mara → Amboseli',
        morning: 'Dawn game drive before long transfer south.',
        afternoon: 'Amboseli: elephant families at Enkongo Narok swamp, Kilimanjaro at sunset.',
        overnight: 'AA Lodge Amboseli',
      },
      {
        day: 'Day 5',
        title: 'Amboseli → Taita Hills',
        morning: 'Sunrise elephant and Kilimanjaro session.',
        afternoon: 'Transfer to Taita Hills. Salt Lick Safari Lodge — underground bunker waterhole.',
        overnight: 'Salt Lick Safari Lodge',
      },
      {
        day: 'Day 6',
        title: 'Taita Hills → Tsavo West',
        morning: 'Dawn waterhole watch at Salt Lick, final drive in Taita Hills.',
        afternoon: 'Tsavo West: Mzima Springs (hippos, crocs), Shetani Lava flow.',
        overnight: 'Kilima Camp',
      },
      {
        day: 'Day 7',
        title: 'Tsavo West → Tsavo East',
        morning: 'Drive across to Tsavo East — 13,747 km² of pure wilderness.',
        afternoon: 'Red-dust elephants, Mudanda Rock, Aruba Dam at sunset.',
        overnight: 'Voi Wildlife Lodge',
      },
      {
        day: 'Day 8',
        title: 'Tsavo East → Watamu',
        morning: 'Final sunrise game drive on the Voi Plains.',
        afternoon: 'Return to Watamu coast.',
        overnight: 'Return to Watamu',
      },
    ],
    packingTips,
  },
];

export interface Excursion {
  id: string;
  name: string;
  nameIt: string;
  duration: string;
  image: string;
  description: string;
  descriptionIt: string;
  highlights: string[];
  popular?: boolean;
  // Detail-page fields (all optional so existing card usage is unaffected)
  startingLocation?: string;
  startingLocationIt?: string;
  whatToExpect?: string[];
  whatToExpectIt?: string[];
  included?: string[];
  includedIt?: string[];
  notIncluded?: string[];
  notIncludedIt?: string[];
  goodToKnow?: string[];
  goodToKnowIt?: string[];
  category: 'marine' | 'nature' | 'culture';
}

export const excursions: Excursion[] = [
  {
    id: 'safari-blu-mida',
    name: 'Blue Safari — Mida Creek',
    nameIt: 'Safari Blu a Mida Creek',
    duration: 'Half Day',
    image: '/images/excursions/blue-safari-mida-creek.jpg',
    description: 'Snorkelling safari in the shallow coral gardens of Mida Creek. Glass-bottom boat and snorkel equipment included. Perfect for all ages.',
    descriptionIt: 'Safari di snorkelling nei giardini di corallo poco profondi della Mida Creek. Barca a fondo di vetro e attrezzatura da snorkelling incluse. Perfetto per tutte le età.',
    popular: true,
    highlights: ['Glass-bottom boat', 'Shallow coral gardens', 'Sea turtles possible', 'Suitable for children'],
    category: 'marine',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'A short boat transfer to the shallow coral gardens inside Mida Creek National Marine Park.',
      'Time in the water with mask, snorkel and fins over coral and reef fish.',
      'A local boat crew who know where the water is calmest for beginners and children.',
    ],
    whatToExpectIt: [
      'Un breve trasferimento in barca fino ai giardini di corallo poco profondi del Parco Marino di Mida Creek.',
      'Tempo in acqua con maschera, boccaglio e pinne sopra coralli e pesci di scogliera.',
      "Un equipaggio locale che conosce i punti più calmi per principianti e bambini.",
    ],
    included: ['Boat transfer', 'Snorkelling equipment', 'Marine park entry fee', 'Guide'],
    includedIt: ['Trasferimento in barca', 'Attrezzatura da snorkelling', 'Ingresso al parco marino', 'Guida'],
    notIncluded: ['Lunch and drinks', 'Underwater camera rental', 'Tips'],
    notIncludedIt: ['Pranzo e bevande', 'Noleggio fotocamera subacquea', 'Mance'],
    goodToKnow: [
      'Turtle and sea life sightings are possible but depend on conditions and cannot be guaranteed.',
      'Suitable for non-swimmers with a life jacket; children should be supervised in the water.',
    ],
    goodToKnowIt: [
      "L'avvistamento di tartarughe e fauna marina è possibile ma dipende dalle condizioni e non può essere garantito.",
      'Adatto anche a chi non sa nuotare, con giubbotto salvagente; i bambini vanno sempre supervisionati in acqua.',
    ],
  },
  {
    id: 'safari-blu-sardegna',
    name: 'Blue Safari — Sardegna 2 Island',
    nameIt: 'Safari Blu Sardegna 2',
    duration: 'Half Day',
    image: '/images/excursions/blue-safari-sardegna-island.jpg',
    description: 'Boat excursion to the famous Sardegna 2 sandbar with dolphin watching opportunities. One of the best snorkelling spots on the entire Kenyan coast.',
    descriptionIt: 'Escursione in barca al famoso banco di sabbia Sardegna 2 con possibilità di avvistare i delfini. Uno dei migliori posti per fare snorkelling su tutta la costa keniana.',
    highlights: ['Dolphin watching', 'Famous sandbar', 'Deep coral reefs', 'Vibrant tropical fish'],
    category: 'marine',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'A boat ride out to the Sardegna 2 sandbar, one of the deeper snorkelling spots on this stretch of coast.',
      'Snorkelling over coral reef, with a stop on the exposed sandbar at low tide.',
      'A scenic route out where dolphin sightings sometimes happen, weather and sea conditions permitting.',
    ],
    whatToExpectIt: [
      'Un giro in barca fino al banco di sabbia Sardegna 2, uno dei punti di snorkelling più profondi di questo tratto di costa.',
      'Snorkelling sulla barriera corallina, con una sosta sul banco di sabbia emerso durante la bassa marea.',
      'Un percorso panoramico durante il quale, a seconda delle condizioni del mare, è a volte possibile avvistare i delfini.',
    ],
    included: ['Boat transfer', 'Snorkelling equipment', 'Guide'],
    includedIt: ['Trasferimento in barca', 'Attrezzatura da snorkelling', 'Guida'],
    notIncluded: ['Lunch and drinks', 'Tips'],
    notIncludedIt: ['Pranzo e bevande', 'Mance'],
    goodToKnow: [
      'Dolphin sightings are possible but depend on sea conditions and wildlife movement — never guaranteed.',
      'The sandbar is only exposed around low tide, so timing is set by the tide table, not the clock.',
    ],
    goodToKnowIt: [
      "L'avvistamento dei delfini è possibile ma dipende dalle condizioni del mare e dai loro movimenti — non è mai garantito.",
      "Il banco di sabbia emerge solo intorno alla bassa marea, quindi l'orario dipende dalle tavole di marea, non dall'orologio.",
    ],
  },
  {
    id: 'isola-amore',
    name: "Love Island",
    nameIt: "Isola dell'Amore",
    duration: 'Half Day',
    image: '/images/excursions/love-island.jpg',
    description: 'A short boat ride to a pristine sandbar surrounded by crystal-clear Indian Ocean waters. Perfect for snorkelling, swimming, and relaxing on white sand.',
    descriptionIt: 'Una breve gita in barca verso un banco di sabbia incontaminato circondato dalle acque cristalline dell\'Oceano Indiano. Perfetto per lo snorkelling, il nuoto e il relax sulla sabbia bianca.',
    highlights: ['Snorkelling in coral gardens', 'White sand beach', 'Crystal Indian Ocean water'],
    category: 'marine',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'A short, scenic boat ride to a sandbar with no permanent structures — just sand and ocean.',
      'Free time to swim, snorkel over nearby coral, and relax before the tide turns.',
    ],
    whatToExpectIt: [
      "Una breve e panoramica gita in barca verso un banco di sabbia privo di strutture permanenti — solo sabbia e oceano.",
      'Tempo libero per nuotare, fare snorkelling sui coralli vicini e rilassarsi prima che la marea cambi.',
    ],
    included: ['Boat transfer', 'Snorkelling equipment'],
    includedIt: ['Trasferimento in barca', 'Attrezzatura da snorkelling'],
    notIncluded: ['Lunch and drinks', 'Tips'],
    notIncludedIt: ['Pranzo e bevande', 'Mance'],
    goodToKnow: [
      'Like all sandbar trips, timing follows the tide — your guide will confirm departure time closer to the date.',
    ],
    goodToKnowIt: [
      "Come tutte le gite ai banchi di sabbia, l'orario segue la marea — la guida confermerà l'orario di partenza vicino alla data.",
    ],
  },
  {
    id: 'robinson-golden',
    name: 'Robinson Island & Golden Beach',
    nameIt: 'Isola di Robinson + Spiaggia Dorata',
    duration: 'Full Day',
    image: '/images/excursions/robinson-golden-beach.jpg',
    description: 'A full day escape to two of Watamu\'s most secluded spots. Robinson Island for snorkelling and Golden Beach for a picnic lunch under the palms.',
    descriptionIt: 'Una giornata intera alla scoperta di due tra i luoghi più appartati di Watamu. Isola di Robinson per lo snorkelling e Spiaggia Dorata per un pranzo sull\'erba sotto le palme.',
    highlights: ['Secluded island beach', 'Snorkelling reef', 'Picnic lunch included', 'Dolphins possible'],
    category: 'marine',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'A full day combining two quieter spots: Robinson Island for snorkelling, then Golden Beach for lunch under the palms.',
      'More time in the water and on the sand than a half-day trip, with a relaxed pace built in.',
    ],
    whatToExpectIt: [
      'Una giornata intera che combina due luoghi più tranquilli: Isola di Robinson per lo snorkelling, poi Golden Beach per il pranzo sotto le palme.',
      "Più tempo in acqua e sulla sabbia rispetto a una gita di mezza giornata, con un ritmo rilassato.",
    ],
    included: ['Boat transfer', 'Snorkelling equipment', 'Picnic lunch'],
    includedIt: ['Trasferimento in barca', 'Attrezzatura da snorkelling', 'Pranzo al sacco'],
    notIncluded: ['Drinks beyond lunch', 'Tips'],
    notIncludedIt: ['Bevande oltre al pranzo', 'Mance'],
    goodToKnow: [
      'Dolphin sightings are possible along the route but depend on sea conditions and wildlife movement — never guaranteed.',
    ],
    goodToKnowIt: [
      "L'avvistamento dei delfini lungo il percorso è possibile ma dipende dalle condizioni del mare e dai loro movimenti — non è mai garantito.",
    ],
  },
  {
    id: 'mangrovie-canoa',
    name: 'Mangrove Canoe — Mida Creek',
    nameIt: 'Mangrovie in Canoa – Mida Creek',
    duration: '3 Hours',
    image: '/images/excursions/mangrove-canoe-mida-creek.jpg',
    description: 'Paddle through the otherworldly mangrove forests of Mida Creek at low tide. Spot kingfishers, sea eagles, mudskippers, and crabs in this UNESCO Biosphere Reserve.',
    descriptionIt: 'Pagaiata attraverso le foreste di mangrovie della Mida Creek con la bassa marea. Avvistamento di martin pescatori, aquile di mare e granchi in questa Riserva della Biosfera UNESCO.',
    highlights: ['UNESCO Biosphere Reserve', 'Kingfishers & sea eagles', 'Traditional dugout canoe', 'Mangrove ecosystem'],
    category: 'nature',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'A quiet, low-impact paddle through the mangrove channels of Mida Creek, timed around the low tide.',
      'A local boatman poling or paddling a traditional dugout canoe while you watch for birds and mangrove wildlife.',
    ],
    whatToExpectIt: [
      'Una pagaiata tranquilla e a basso impatto attraverso i canali di mangrovie della Mida Creek, calibrata sulla bassa marea.',
      'Un barcaiolo locale che spinge o pagaia una canoa scavata tradizionale, mentre osservate uccelli e fauna delle mangrovie.',
    ],
    included: ['Canoe and paddler/guide', 'Mida Creek entry'],
    includedIt: ['Canoa e barcaiolo/guida', 'Ingresso a Mida Creek'],
    notIncluded: ['Drinks', 'Tips'],
    notIncludedIt: ['Bevande', 'Mance'],
    goodToKnow: [
      'This trip runs on tide timing rather than a fixed clock time — your guide confirms this closer to the date.',
      'Bird and wildlife sightings vary by season and cannot be guaranteed.',
    ],
    goodToKnowIt: [
      "Questa gita segue l'orario della marea e non un orario fisso — la guida lo conferma vicino alla data.",
      'Gli avvistamenti di uccelli e fauna variano in base alla stagione e non possono essere garantiti.',
    ],
  },
  {
    id: 'gede-ruins',
    name: 'Gede Ruins',
    nameIt: 'Rovine di Gede',
    duration: '3 Hours',
    image: '/images/excursions/gede-ruins.jpg',
    description: 'Explore the mysterious 13th-century Swahili city hidden in the coastal forest. Stone palaces, mosques, and water systems of a once-prosperous civilization.',
    descriptionIt: 'Esplora la misteriosa città Swahili del XIII secolo nascosta nella foresta costiera. Palazzi in pietra, moschee e sistemi idrici di una civiltà un tempo prospera.',
    popular: true,
    highlights: ['13th-century Swahili ruins', 'Giant forest trees', 'Friendly colobus monkeys', 'Local guide stories'],
    category: 'culture',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'A guided walk through the excavated ruins of Gede, a Swahili trading town abandoned in the 17th century.',
      'Time in the surrounding coastal forest, home to Sykes\u2019 and colobus monkeys.',
    ],
    whatToExpectIt: [
      "Una passeggiata guidata tra le rovine scavate di Gede, una città-mercato swahili abbandonata nel XVII secolo.",
      "Tempo nella foresta costiera circostante, casa di scimmie Sykes e colobo.",
    ],
    included: ['Local guide', 'Site entry fee'],
    includedIt: ['Guida locale', 'Ingresso al sito'],
    notIncluded: ['Drinks', 'Tips'],
    notIncludedIt: ['Bevande', 'Mance'],
    goodToKnow: ['Comfortable walking shoes recommended — paths are natural forest ground, occasionally uneven.'],
    goodToKnowIt: ['Si consigliano scarpe comode — i sentieri sono su terreno naturale, a tratti irregolare.'],
  },
  {
    id: 'marafa-kitchen',
    name: "Marafa Hell's Kitchen",
    nameIt: "Marafa Hell's Kitchen",
    duration: 'Half Day',
    image: '/images/excursions/marafa-hells-kitchen.jpg',
    description: "A dramatic gorge of red and white sandstone carved by erosion over millions of years. Locals call it Nyari — 'the place broken by itself'. Sunset here is unforgettable.",
    descriptionIt: "Un drammatico canyon di arenaria rossa e bianca scolpita dall'erosione in milioni di anni. I locali lo chiamano Nyari — 'il luogo spezzato da sé'. Il tramonto qui è indimenticabile.",
    highlights: ['Dramatic sandstone gorge', 'Sunset photography', 'Local legend storytelling', 'Short guided walk'],
    category: 'nature',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'A short guided walk along the rim and floor of the Marafa gorge, with its red-and-white sandstone pillars.',
      'A local guide sharing the Nyari legend attached to the site.',
      'The option to time the visit for sunset, when the colours in the rock are most dramatic.',
    ],
    whatToExpectIt: [
      'Una breve passeggiata guidata lungo il bordo e il fondo del canyon di Marafa, con i suoi pilastri di arenaria rossa e bianca.',
      'Una guida locale che racconta la leggenda di Nyari legata al luogo.',
      'La possibilità di programmare la visita al tramonto, quando i colori della roccia sono più intensi.',
    ],
    included: ['Local guide', 'Site entry fee'],
    includedIt: ['Guida locale', 'Ingresso al sito'],
    notIncluded: ['Drinks', 'Tips'],
    notIncludedIt: ['Bevande', 'Mance'],
    goodToKnow: ['Sturdy shoes recommended; some sections involve short climbs on sandy/rocky ground.'],
    goodToKnowIt: ['Si consigliano scarpe robuste; alcuni tratti prevedono brevi salite su terreno sabbioso/roccioso.'],
  },
  {
    id: 'malindi-tour',
    name: 'Malindi Town Tour',
    nameIt: 'Tour di Malindi',
    duration: 'Half Day',
    image: '/images/excursions/malindi-town-tour.jpg',
    description: 'Discover Malindi — the oldest Portuguese settlement on the East African coast. Visit the Vasco da Gama pillar, the Fish Market, Malindi Marine Park, and the Italian quarter.',
    descriptionIt: 'Scopri Malindi, il più antico insediamento portoghese della costa dell\'Africa orientale. Visita il pilastro di Vasco da Gama, il Mercato del Pesce, il Parco Marino e il quartiere italiano.',
    highlights: ['Vasco da Gama pillar (1498)', 'Malindi Marine Park', 'Italian quarter', 'Fish market colours'],
    category: 'culture',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'A half-day town tour taking in the Vasco da Gama pillar, the fish market, and Malindi\u2019s Italian-influenced quarter.',
      'A local guide giving context on Malindi\u2019s Swahili, Portuguese, and Italian layers of history.',
    ],
    whatToExpectIt: [
      "Un tour cittadino di mezza giornata che tocca il pilastro di Vasco da Gama, il mercato del pesce e il quartiere di Malindi a impronta italiana.",
      "Una guida locale che racconta i diversi strati di storia swahili, portoghese e italiana di Malindi.",
    ],
    included: ['Local guide', 'Transport within Malindi'],
    includedIt: ['Guida locale', 'Trasporto all\u2019interno di Malindi'],
    notIncluded: ['Meals and drinks', 'Souvenirs', 'Tips'],
    notIncludedIt: ['Pasti e bevande', 'Souvenir', 'Mance'],
    goodToKnow: ['A relaxed, mostly on-foot tour — comfortable walking shoes recommended.'],
    goodToKnowIt: ['Un tour rilassato, per lo più a piedi — si consigliano scarpe comode.'],
  },
  {
    id: 'dabaso-village',
    name: 'Real Africa — Dabaso Village Tour',
    nameIt: 'Tour nella vera Africa – Villaggio Dabaso',
    duration: '3 Hours',
    image: '/images/excursions/dabaso-village-tour.jpg',
    description: 'An authentic cultural immersion into everyday life in a local Giriama village. Visit schools, homes, the local market, and learn about traditional medicine and food.',
    descriptionIt: 'Un\'autentica immersione culturale nella vita quotidiana di un villaggio Giriama. Visita scuole, case, mercato locale e scopri la medicina tradizionale e il cibo locale.',
    highlights: ['Giriama cultural experience', 'Local school visit', 'Traditional cooking demo', 'Community support tourism'],
    category: 'culture',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'A walk through Dabaso village with a local guide, visiting a school, homes, and the local market as daily life carries on around you.',
      'A short introduction to Giriama traditional medicine and everyday cooking.',
    ],
    whatToExpectIt: [
      "Una passeggiata nel villaggio di Dabaso con una guida locale, con visita a una scuola, alle case e al mercato locale, mentre la vita quotidiana prosegue intorno a voi.",
      "Una breve introduzione alla medicina tradizionale Giriama e alla cucina di tutti i giorni.",
    ],
    included: ['Local guide', 'Community contribution'],
    includedIt: ['Guida locale', 'Contributo alla comunità'],
    notIncluded: ['Meals and drinks', 'Tips'],
    notIncludedIt: ['Pasti e bevande', 'Mance'],
    goodToKnow: ['This is a real, lived-in village, not a staged show — please ask your guide before photographing people.'],
    goodToKnowIt: ["È un villaggio reale e abitato, non uno spettacolo allestito — chiedete alla guida prima di fotografare le persone."],
  },
  {
    id: 'dolphin-turtle-swim',
    name: 'Dolphin & Turtle Swim',
    nameIt: 'Nuoto con Delfini e Tartarughe',
    duration: 'Half Day',
    image: '/images/excursions/dolphin-turtle-swim.jpg',
    description: 'A guided boat trip into Watamu Marine Park to swim alongside wild bottlenose dolphins and sea turtles in their natural habitat, one of the coast\'s most memorable wildlife encounters.',
    descriptionIt: 'Una gita in barca guidata nel Watamu Marine Park per nuotare accanto a delfini tursiopi selvatici e tartarughe marine nel loro habitat naturale, uno degli incontri con la fauna selvatica più memorabili della costa.',
    highlights: ['Wild bottlenose dolphins', 'Sea turtle encounters', 'Snorkel gear included', 'Marine park guide'],
    category: 'marine',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'A boat trip out into Watamu Marine National Park in search of resident bottlenose dolphins and sea turtles.',
      'Time in the water snorkeling alongside dolphins and turtles when conditions allow, with your guide watching over the group.',
    ],
    whatToExpectIt: [
      'Una gita in barca nel Watamu Marine National Park alla ricerca di delfini tursiopi residenti e tartarughe marine.',
      'Tempo in acqua per fare snorkeling accanto a delfini e tartarughe quando le condizioni lo permettono, con la guida che sorveglia il gruppo.',
    ],
    included: ['Boat & skipper', 'Snorkel gear', 'Marine park fees'],
    includedIt: ['Barca e skipper', 'Attrezzatura da snorkeling', 'Tasse del parco marino'],
    notIncluded: ['Drinks and lunch', 'Tips'],
    notIncludedIt: ['Bevande e pranzo', 'Mance'],
    goodToKnow: ['Dolphin and turtle sightings are wild encounters, not guaranteed — mornings generally offer the calmest water and best visibility.'],
    goodToKnowIt: ['Gli avvistamenti di delfini e tartarughe sono incontri con animali selvatici, non garantiti — la mattina offre generalmente acque più calme e maggiore visibilità.'],
  },
  {
    id: 'deep-sea-fishing',
    name: 'Deep-Sea Fishing',
    nameIt: "Pesca d'Altura",
    duration: 'Full Day',
    image: '/images/excursions/deep-sea-fishing.jpg',
    description: 'Set sail before sunrise for big game fishing off Watamu and Malindi, among the Indian Ocean\'s most productive waters for sailfish, marlin, and tuna.',
    descriptionIt: "Salpate prima dell'alba per la pesca d'altura al largo di Watamu e Malindi, tra le acque più pescose dell'Oceano Indiano per pesce vela, marlin e tonno.",
    highlights: ['Sailfish & marlin grounds', 'Experienced local skipper', 'Full tackle provided', 'Sunrise departure'],
    category: 'marine',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'An early departure aboard a fully equipped fishing boat with an experienced local skipper.',
      'A full day trolling productive grounds for sailfish, marlin, tuna, and other game fish, with all tackle provided.',
    ],
    whatToExpectIt: [
      'Una partenza mattutina a bordo di una barca da pesca completamente attrezzata con uno skipper locale esperto.',
      "Un'intera giornata di traina nelle zone di pesca più produttive per pesce vela, marlin, tonno e altri pesci di grossa taglia, con tutta l'attrezzatura fornita.",
    ],
    included: ['Boat, skipper & crew', 'Fishing tackle & bait'],
    includedIt: ['Barca, skipper ed equipaggio', 'Attrezzatura da pesca ed esca'],
    notIncluded: ['Drinks and lunch', 'Tips', 'Catch preparation at your hotel (ask your guide)'],
    notIncludedIt: ['Bevande e pranzo', 'Mance', "Preparazione del pescato presso il vostro hotel (chiedete alla guida)"],
    goodToKnow: ['Best results are typically in the early morning; bring sun protection and motion-sickness medication if needed.'],
    goodToKnowIt: ["I risultati migliori si ottengono generalmente al mattino presto; portate protezione solare e, se necessario, farmaci contro il mal di mare."],
  },
  {
    id: 'arabuko-sokoke-forest',
    name: 'Arabuko-Sokoke Forest Walk',
    nameIt: 'Passeggiata nella Foresta di Arabuko-Sokoke',
    duration: 'Half Day',
    image: '/images/excursions/arabuko-sokoke-forest.jpg',
    description: 'A guided walk through East Africa\'s largest remaining coastal dry forest, home to rare endemic birds, free-roaming forest elephants, and the golden-rumped elephant shrew — just 30 minutes from the beach.',
    descriptionIt: "Una passeggiata guidata nella più grande foresta costiera secca rimasta in Africa orientale, che ospita rari uccelli endemici, elefanti della foresta allo stato libero e il toporagno elefante dal dorso dorato — a soli 30 minuti dalla spiaggia.",
    highlights: ['Rare endemic birds', 'Free-roaming forest elephants', 'Golden-rumped elephant shrew', 'Guided nature trails'],
    category: 'nature',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'A guided walk along marked trails through Arabuko-Sokoke Forest, Kenya\'s largest remaining coastal dry forest.',
      'A chance to spot rare endemic species including the Sokoke Scops Owl and Clarke\'s Weaver, plus the forest\'s resident elephants at the right time of day.',
    ],
    whatToExpectIt: [
      "Una passeggiata guidata lungo sentieri segnalati nella Foresta di Arabuko-Sokoke, la più grande foresta costiera secca rimasta in Kenya.",
      "La possibilità di avvistare rare specie endemiche, tra cui il gufo di Sokoke e il tessitore di Clarke, oltre agli elefanti residenti nella foresta nel momento giusto della giornata.",
    ],
    included: ['Local guide', 'Forest entry fee'],
    includedIt: ['Guida locale', 'Ingresso alla foresta'],
    notIncluded: ['Drinks', 'Tips', 'Binoculars (available to rent locally)'],
    notIncludedIt: ['Bevande', 'Mance', 'Binocolo (noleggiabile in loco)'],
    goodToKnow: ['Early morning or late afternoon visits give the best chance of wildlife sightings; comfortable closed shoes recommended.'],
    goodToKnowIt: ["Le visite al mattino presto o nel tardo pomeriggio offrono le migliori possibilità di avvistamenti; si consigliano scarpe chiuse comode."],
  },
  {
    id: 'kitesurfing-lesson',
    name: 'Kitesurfing Lesson',
    nameIt: 'Lezione di Kitesurf',
    duration: 'Half Day',
    image: '/images/excursions/kitesurfing-lesson.jpg',
    description: 'Learn to kitesurf on the flat, sheltered lagoon waters of Watamu — one of East Africa\'s premier kitesurfing destinations — with certified instructors and all equipment included.',
    descriptionIt: "Imparate il kitesurf nelle acque piatte e riparate della laguna di Watamu — una delle mete di kitesurf più rinomate dell'Africa orientale — con istruttori certificati e attrezzatura inclusa.",
    highlights: ['Certified instructors', 'Flat-water lagoon', 'All equipment included', 'Beginner to advanced'],
    category: 'marine',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'A lesson tailored to your level, from first-timers to advanced riders, on Watamu\'s sheltered flat-water lagoon.',
      'All kitesurfing equipment provided, with a certified instructor guiding you throughout.',
    ],
    whatToExpectIt: [
      "Una lezione su misura per il vostro livello, dai principianti ai più esperti, nella laguna riparata e dalle acque piatte di Watamu.",
      "Tutta l'attrezzatura da kitesurf fornita, con un istruttore certificato che vi segue per l'intera lezione.",
    ],
    included: ['Certified instructor', 'Full kitesurfing equipment'],
    includedIt: ['Istruttore certificato', 'Attrezzatura completa da kitesurf'],
    notIncluded: ['Drinks', 'Tips'],
    notIncludedIt: ['Bevande', 'Mance'],
    goodToKnow: ['Best wind conditions are typically December–April and June–September; lessons depend on wind and tide.'],
    goodToKnowIt: ['Le migliori condizioni di vento si registrano generalmente da dicembre ad aprile e da giugno a settembre; le lezioni dipendono da vento e marea.'],
  },
  {
    id: 'sunset-dhow-cruise',
    name: 'Sunset Dhow Cruise',
    nameIt: 'Crociera al Tramonto in Dhow',
    duration: 'Half Day',
    image: '/images/excursions/sunset-dhow-cruise.jpg',
    description: 'Sail the Indian Ocean at golden hour aboard a traditional East African dhow, with drinks, snacks, and one of the Kenyan coast\'s best sunsets.',
    descriptionIt: "Navigate sull'Oceano Indiano all'ora d'oro a bordo di un tradizionale dhow dell'Africa orientale, con bevande, snack e uno dei tramonti più belli della costa keniota.",
    highlights: ['Traditional wooden dhow', 'Golden-hour sailing', 'Drinks & snacks included', 'Photography-friendly'],
    category: 'marine',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'A relaxed sail along the Watamu coastline aboard a traditional wooden dhow, timed for sunset.',
      'Drinks and snacks served on board as the sky turns gold over the Indian Ocean.',
    ],
    whatToExpectIt: [
      "Una rilassante navigazione lungo la costa di Watamu a bordo di un tradizionale dhow in legno, programmata per il tramonto.",
      "Bevande e snack serviti a bordo mentre il cielo si tinge d'oro sull'Oceano Indiano.",
    ],
    included: ['Dhow & crew', 'Soft drinks & snacks'],
    includedIt: ['Dhow ed equipaggio', 'Bevande analcoliche e snack'],
    notIncluded: ['Alcoholic drinks', 'Tips'],
    notIncludedIt: ['Bevande alcoliche', 'Mance'],
    goodToKnow: ['Departure time shifts with the season to line up with sunset — your host will confirm exact pick-up time closer to the date.'],
    goodToKnowIt: ["L'orario di partenza varia in base alla stagione per coincidere con il tramonto — il vostro host confermerà l'orario esatto di ritiro più vicino alla data."],
  },
  {
    id: 'falconry-of-kenya',
    name: 'Falconry of Kenya',
    nameIt: 'Falconeria del Kenya',
    duration: '2 Hours',
    image: '/images/excursions/falconry-of-kenya.jpg',
    description: 'Meet Kenya\'s birds of prey up close at this falconry and raptor rescue centre near Watamu, with hands-on flying demonstrations of eagles, owls, and falcons.',
    descriptionIt: "Incontrate da vicino i rapaci del Kenya in questo centro di falconeria e recupero rapaci vicino a Watamu, con dimostrazioni di volo pratiche di aquile, gufi e falchi.",
    highlights: ['Birds of prey demonstrations', 'Rescue & rehabilitation centre', 'Hands-on falconry experience', 'Family-friendly'],
    category: 'nature',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'A visit to a raptor rescue and rehabilitation centre, meeting resident eagles, owls, and falcons.',
      'A hands-on flying demonstration led by experienced handlers, suitable for all ages.',
    ],
    whatToExpectIt: [
      'Una visita a un centro di recupero e riabilitazione di rapaci, con incontro con aquile, gufi e falchi residenti.',
      'Una dimostrazione di volo pratica guidata da addestratori esperti, adatta a tutte le età.',
    ],
    included: ['Guided tour', 'Flying demonstration', 'Entry fee'],
    includedIt: ['Visita guidata', 'Dimostrazione di volo', 'Biglietto d\'ingresso'],
    notIncluded: ['Drinks', 'Tips'],
    notIncludedIt: ['Bevande', 'Mance'],
    goodToKnow: ['A great option for families — most of the visit is outdoors under shade with gentle walking only.'],
    goodToKnowIt: ["Un'ottima opzione per le famiglie — gran parte della visita si svolge all'aperto all'ombra, con una camminata leggera."],
  },
  {
    id: 'mambrui-sand-dunes',
    name: 'Mambrui Sand Dunes',
    nameIt: 'Dune di Sabbia di Mambrui',
    duration: 'Half Day',
    image: '/images/excursions/mambrui-sand-dunes.jpg',
    description: 'Explore the golden sand dunes north of Malindi, a striking desert-like landscape by the ocean, often paired with a visit to nearby Marafa Hell\'s Kitchen.',
    descriptionIt: "Esplorate le dune di sabbia dorata a nord di Malindi, un paesaggio suggestivo simile al deserto affacciato sull'oceano, spesso abbinato a una visita alla vicina Marafa Hell's Kitchen.",
    highlights: ['Golden desert dunes', 'Dramatic coastal scenery', 'Great photography spot', 'Pairs well with Marafa Hell\'s Kitchen'],
    category: 'nature',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'A guided walk across the Mambrui sand dunes, a striking stretch of golden desert landscape just north of Malindi.',
      'Free time for photos, with the option to combine this trip with a visit to Marafa Hell\'s Kitchen the same day.',
    ],
    whatToExpectIt: [
      "Una passeggiata guidata tra le dune di sabbia di Mambrui, un tratto suggestivo di paesaggio desertico dorato a nord di Malindi.",
      "Tempo libero per le foto, con la possibilità di abbinare questa gita a una visita a Marafa Hell's Kitchen nella stessa giornata.",
    ],
    included: ['Local guide', 'Transport'],
    includedIt: ['Guida locale', 'Trasporto'],
    notIncluded: ['Drinks', 'Tips'],
    notIncludedIt: ['Bevande', 'Mance'],
    goodToKnow: ['Midday sun on open sand can be intense — sun protection, a hat, and water are strongly recommended.'],
    goodToKnowIt: ['Il sole di mezzogiorno sulla sabbia aperta può essere intenso — si raccomandano protezione solare, cappello e acqua.'],
  },
  {
    id: 'turtle-conservation',
    name: 'Sea Turtle Conservation Visit',
    nameIt: 'Visita al Centro di Conservazione delle Tartarughe',
    duration: '2 Hours',
    image: '/images/excursions/turtle-conservation.jpg',
    description: 'Visit Watamu\'s sea turtle rescue and rehabilitation centre, learn about local conservation efforts, and — in season — see nesting or hatching turtles firsthand.',
    descriptionIt: "Visitate il centro di recupero e riabilitazione delle tartarughe marine di Watamu, scoprite gli sforzi di conservazione locali e — in stagione — assistete dal vivo alla nidificazione o alla schiusa delle uova.",
    highlights: ['Turtle rescue & rehab centre', 'Conservation education', 'Nesting season May–Aug', 'Hatchling season Jul–Oct'],
    category: 'nature',
    startingLocation: 'Pick-up from your hotel in Watamu',
    startingLocationIt: 'Ritiro dal vostro hotel a Watamu',
    whatToExpect: [
      'A visit to a local sea turtle rescue and rehabilitation centre, learning how injured and entangled turtles are cared for and released.',
      'In season (nesting May–August, hatching July–October), the chance to see turtle activity firsthand, conditions permitting.',
    ],
    whatToExpectIt: [
      'Una visita a un centro locale di recupero e riabilitazione delle tartarughe marine, per scoprire come vengono curate e rilasciate le tartarughe ferite o rimaste impigliate.',
      "In stagione (nidificazione da maggio ad agosto, schiusa da luglio a ottobre), la possibilità di assistere dal vivo all'attività delle tartarughe, condizioni permettendo.",
    ],
    included: ['Guided visit', 'Entry/donation fee'],
    includedIt: ['Visita guidata', 'Biglietto d\'ingresso/donazione'],
    notIncluded: ['Drinks', 'Tips'],
    notIncludedIt: ['Bevande', 'Mance'],
    goodToKnow: ['Turtle nesting/hatching sightings depend on season and are never guaranteed — the centre itself is open and worthwhile year-round.'],
    goodToKnowIt: ["Gli avvistamenti di nidificazione/schiusa delle tartarughe dipendono dalla stagione e non sono mai garantiti — il centro stesso è aperto e vale la pena visitarlo tutto l'anno."],
  },
];
