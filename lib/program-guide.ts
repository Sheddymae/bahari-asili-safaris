import { DEFAULT_INCLUDED, DEFAULT_EXCLUDED, type Safari } from './tours-data';

/**
 * Single source of truth for the answer-first program content shown on every
 * safari page, in JSON-LD and in the Markdown/OTA outputs.
 *
 * Everything here is derived from fields the business already maintains
 * (duration, parks, lodges, itinerary, activity/comfort level, inclusions and
 * packing tips) plus the general Kenya climate and health guidance verified
 * against CDC / NaTHNaC / Kenya Meteorological Department sources in
 * November 2026. Nothing is invented: where the business has not published a
 * value (fixed from-price, minimum age, maximum group size, step-free access)
 * the guide says so and the owner TODO is listed in the report.
 */

export type SeasonRating = 'Excellent' | 'Good' | 'Fair' | 'Not ideal';

export interface MonthRating {
  month: string;
  rating: SeasonRating;
  note: string;
}

export interface GuideFaq {
  q: string;
  a: string;
}

export interface PackingGroup {
  title: string;
  items: string[];
}

export interface ProgramGuide {
  slug: string;
  name: string;
  days: number;
  nights: number;
  parks: string[];
  startPoint: string;
  endPoint: string;
  groupType: string;
  maxGroupSize: string;
  pace: string;
  activityLevel: number;
  comfortLevel: number;
  priceBasis: string;
  priceFrom: number | null;
  currency: string;
  answerCapsule: string;
  quickFacts: { label: string; value: string }[];
  cost: {
    capsule: string;
    includes: string[];
    excludes: string[];
    drivers: string[];
    highSeasonNote: string;
    todo: string;
  };
  bestTime: {
    capsule: string;
    headline: string;
    months: MonthRating[];
    sourceNote: string;
  };
  children: { capsule: string; points: string[]; todo: string };
  mobility: { capsule: string; points: string[]; todo: string };
  packing: { capsule: string; groups: PackingGroup[]; supplied: string[] };
  health: {
    capsule: string;
    points: string[];
    sources: { label: string; url: string }[];
  };
  faqs: GuideFaq[];
}

type Region =
  | 'inland'
  | 'mara'
  | 'amboseli'
  | 'northern'
  | 'rift'
  | 'tanzania'
  | 'coast'
  | 'zanzibar'
  | 'uganda-rwanda';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const INLAND_NOTES = [
  'Hot and dry: animals gather at the remaining water and tracks are firm.',
  'Dry and clear, with good general game viewing before the rains.',
  'Dry until late March, when the long rains usually begin.',
  'Long rains: muddy tracks, some camps close and animals spread out.',
  'Rains ease late in the month; green landscapes and very few vehicles.',
  'Dry season starts: cool mornings, shortening grass and stronger sightings.',
  'Peak dry season: wildlife concentrates around waterholes and rivers.',
  'Dusty and clear, with the most reliable game viewing of the year.',
  'Still dry and comfortable, with good visibility for photography.',
  'Reliable dry viewing until the short rains arrive late in the month.',
  'Short rains: lush and quiet, with heavy but usually brief afternoon storms.',
  'Drying out again, with good viewing and busy holiday demand.',
];

const MIGRATION_NOTE = 'Peak dry season, and the Great Migration is normally in the Mara.';

function model(region: Region): { ratings: SeasonRating[]; notes: string[] } {
  switch (region) {
    case 'mara':
      return {
        ratings: ['Good', 'Good', 'Good', 'Not ideal', 'Fair', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 'Fair', 'Good'],
        notes: [
          'Hot and dry with good resident predator viewing.',
          'Dry and clear; big cats are easier to track in short grass.',
          'Dry until the long rains begin, usually late in the month.',
          'Long rains: some camps close and tracks become difficult.',
          'Rains tail off; green, quiet and good value for the Mara.',
          'Dry season begins; resident wildlife is easy to find.',
          MIGRATION_NOTE,
          'Migration season, with river crossings most likely this month and next.',
          'Still migration season; grass is short and predators follow the herds.',
          'Migration usually still present early in the month, then herds drift south.',
          'Short rains: green and quiet, with fewer vehicles and lower rates.',
          'Drying out, with good resident game and holiday demand.',
        ],
      };
    case 'amboseli':
      return {
        ratings: ['Excellent', 'Excellent', 'Good', 'Not ideal', 'Fair', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 'Fair', 'Good'],
        notes: [
          'Hot and dry; Kilimanjaro is often clear early in the morning.',
          'One of the best months for elephants below a clear Kilimanjaro.',
          'Dry until late March, then the long rains arrive.',
          'Long rains: the mountain is usually cloud-covered and tracks are muddy.',
          'Rain eases late in the month; the swamps stay green and wildlife remains.',
          'Dry season starts and Kilimanjaro views improve.',
          'Classic Amboseli: elephant herds on the swamps with the mountain behind.',
          'Clear mornings and strong elephant viewing around the marshes.',
          'Dry and reliable, with good light for photography.',
          'Dry for most of the month, before the short rains begin.',
          'Short rains: greener and quieter, with more cloud on the mountain.',
          'Drying out, with good viewing and holiday demand.',
        ],
      };
    case 'northern':
      return {
        ratings: ['Good', 'Good', 'Good', 'Fair', 'Fair', 'Good', 'Good', 'Good', 'Good', 'Good', 'Fair', 'Good'],
        notes: [
          'Hot and dry: wildlife gathers along the Ewaso Ng’iro and other rivers.',
          'Dry and clear, a strong month for the Samburu Special Five.',
          'Dry and hot until the rains arrive late in the month.',
          'Long rains reach northern Kenya; some tracks become difficult.',
          'Rain continues but is lighter, with green country and few visitors.',
          'Drying out; game returns to the rivers.',
          'Dry season with good riverine wildlife and cooler highland air.',
          'Reliable dry viewing; Mount Kenya is often clear in the morning.',
          'Dry and comfortable, with good birdlife in the highlands.',
          'Dry, before the short rains arrive late in the month.',
          'Short rains can be heavy in northern Kenya; expect some mud.',
          'Drying out with good viewing and holiday demand.',
        ],
      };
    case 'rift':
      return {
        ratings: ['Good', 'Good', 'Good', 'Not ideal', 'Fair', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 'Fair', 'Good'],
        notes: [
          'Dry and clear; good rhino and bird viewing at the Rift Valley lakes.',
          'Dry and hot, with excellent visibility over the lakes.',
          'Dry until late March, when the long rains begin.',
          'Long rains: muddy tracks and reduced visibility around the lakes.',
          'Rains ease; the lakes are full and the countryside is green.',
          'Dry season starts; rhino and predator viewing improves.',
          'Peak dry season around the lakes and rhino sanctuaries.',
          'Clear and dry, with strong wildlife viewing and birdlife.',
          'Good dry-season viewing around the lake shore and forest.',
          'Dry for most of the month; the short rains start late on.',
          'Short rains: green, quiet and good value, with afternoon storms.',
          'Drying out; good viewing and busy holiday demand.',
        ],
      };
    case 'tanzania':
      return {
        ratings: ['Good', 'Good', 'Fair', 'Not ideal', 'Fair', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 'Fair', 'Good'],
        notes: [
          'Short dry season: good predator viewing on the southern plains.',
          'Dry and clear, with strong game viewing in the crater highlands.',
          'Hot and dry early, then the long rains begin.',
          'Long rains: many camps close and some roads become impassable.',
          'Rains ease slowly; green and quiet, with lower rates.',
          'Dry season starts; the Serengeti herds move north and west.',
          'Peak season: dry plains, big cats and the northern migration.',
          'Prime dry-season viewing, with cool mornings.',
          'Dry and reliable, with strong predator sightings.',
          'Dry until the short rains arrive late in the month.',
          'Short rains: green, quiet and good value.',
          'Drying out, with good viewing across the northern circuit.',
        ],
      };
    case 'coast':
      return {
        ratings: ['Excellent', 'Excellent', 'Good', 'Not ideal', 'Fair', 'Good', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 'Fair', 'Excellent'],
        notes: [
          'Hot, dry and calm, with the clearest water of the year for snorkelling.',
          'Peak coast month: calm sea, clear water and excellent reef visibility.',
          'Hot and humid; the sea stays calm until the rains arrive.',
          'Long rains: wind, rain and reduced underwater visibility.',
          'Wettest month on the coast; many boat trips are weather-dependent.',
          'Drying out; calmer sea and improving visibility.',
          'Cool, dry and calm: one of the best months for marine excursions.',
          'Dry and calm, with good reef visibility and comfortable evenings.',
          'Dry and calm, with excellent conditions for boat trips.',
          'Calm and dry for most of the month, before the short rains.',
          'Short rains: heavy showers and choppier sea on some days.',
          'Hot, dry and calm, with excellent beach and reef conditions.',
        ],
      };
    case 'zanzibar':
      return {
        ratings: ['Excellent', 'Excellent', 'Good', 'Not ideal', 'Fair', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 'Fair', 'Excellent'],
        notes: [
          'Hot and dry with calm, clear water.',
          'Peak beach month: dry, hot and clear.',
          'Hot and humid until the long rains arrive.',
          'Long rains: frequent rain and choppy sea.',
          'Rains ease late in the month; good value and quiet beaches.',
          'Dry season begins, with calm sea and good visibility.',
          'Cool, dry and calm: excellent for diving and beach time.',
          'Dry and calm, with strong marine conditions.',
          'Dry and comfortable, with quiet beaches.',
          'Dry for most of the month, before the short rains.',
          'Short rains: brief heavy showers and some wind.',
          'Hot, dry and festive, with calm sea.',
        ],
      };
    case 'uganda-rwanda':
      return {
        ratings: ['Good', 'Good', 'Fair', 'Not ideal', 'Fair', 'Good', 'Good', 'Good', 'Good', 'Fair', 'Fair', 'Good'],
        notes: [
          'Short dry season: good forest and savannah conditions.',
          'Dry and clear, with good tracks for forest walks.',
          'Drying ends as the long rains approach.',
          'Long rains: muddy forest trails and heavier cloud.',
          'Rains ease; green forest and fewer visitors.',
          'Dry season starts, with good conditions for primate tracking.',
          'Dry and cool, with excellent forest visibility.',
          'Reliable dry season; good for both savannah and forest.',
          'Still dry, with good wildlife and birding.',
          'Short rains begin; expect afternoon and overnight rain.',
          'Wettest of the short-rain months; some trails become difficult.',
          'Drying out, with good conditions returning.',
        ],
      };
    case 'inland':
    default:
      return {
        ratings: ['Good', 'Good', 'Good', 'Not ideal', 'Fair', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 'Excellent', 'Fair', 'Good'],
        notes: INLAND_NOTES,
      };
  }
}

function regionFor(parks: string[]): Region {
  const text = parks.join(' ').toLowerCase();
  if (/zanzibar/.test(text)) return 'zanzibar';
  if (/serengeti|ngorongoro|tarangire/.test(text)) return 'tanzania';
  if (/samburu|ol pejeta|mount kenya/.test(text)) return 'northern';
  if (/bwindi|queen elizabeth|murchison|akagera/.test(text)) return 'uganda-rwanda';
  if (/nakuru|naivasha|hell/.test(text)) return 'rift';
  if (/masai mara|mara/.test(text)) return 'mara';
  if (/amboseli/.test(text) && !/tsavo/.test(text)) return 'amboseli';
  return 'inland';
}

function regionLabel(region: Region): string {
  switch (region) {
    case 'mara':
      return 'the Masai Mara';
    case 'amboseli':
      return 'Amboseli';
    case 'northern':
      return 'northern Kenya';
    case 'rift':
      return 'the Rift Valley lakes';
    case 'tanzania':
      return 'northern Tanzania';
    case 'coast':
      return 'the Kenyan coast';
    case 'zanzibar':
      return 'Zanzibar';
    case 'uganda-rwanda':
      return 'the East African forest parks';
    default:
      return 'Tsavo and southern Kenya';
  }
}

function listMonths(months: MonthRating[], rating: SeasonRating): string {
  const picked = months.filter((m) => m.rating === rating).map((m) => m.month);
  if (picked.length === 0) return '';
  if (picked.length === 1) return picked[0];
  if (picked.length === 2) return `${picked[0]} and ${picked[1]}`;
  return `${picked.slice(0, -1).join(', ')} and ${picked[picked.length - 1]}`;
}

function paceLabel(level: number): string {
  if (level <= 2) return 'Easy — mostly seated game drives';
  if (level === 3) return 'Moderate — several transfers and early starts';
  if (level === 4) return 'Active — long driving days between parks';
  return 'Demanding — long days, many park transfers and early starts';
}

function endpoints(safari: Safari): { start: string; end: string } {
  const first = safari.itinerary[0]?.title ?? '';
  const start = first.split('→')[0].trim() || 'Watamu';
  const last = safari.itinerary[safari.itinerary.length - 1];
  const overnight = (last?.overnight ?? '').trim();
  let end = '';
  if (/^return to\s+/i.test(overnight)) end = overnight.replace(/^return to\s+/i, '');
  else if (/^end of/i.test(overnight)) end = last?.title.split('→').pop()?.trim() || overnight;
  else if (overnight) end = overnight;
  if (!end) end = last?.title.split('→').pop()?.trim() || start;
  return { start, end };
}

function transfers(safari: Safari): number {
  return safari.itinerary.filter((day) => day.title.includes('→')).length;
}

function maxNightsInOnePlace(safari: Safari): number {
  const counts = new Map<string, number>();
  safari.itinerary.forEach((day) => {
    const place = (day.overnight || '').trim();
    if (!place || /^return to|^end of/i.test(place)) return;
    counts.set(place, (counts.get(place) ?? 0) + 1);
  });
  return Math.max(0, ...Array.from(counts.values()));
}

const PACKING_RULES: { title: string; test: RegExp }[] = [
  { title: 'Clothing (neutral colours, layers)', test: /shirt|trouser|clothing|jacket|fleece|swimwear|colours|colors|layer|scarf|hat/i },
  { title: 'Sun and insect protection', test: /sunscreen|sun protection|repellent|insect|lip|hat/i },
  { title: 'Footwear', test: /shoe|boot|sandal|flip-flop|sock/i },
  { title: 'Camera, optics and wildlife watching', test: /binocul|camera|battery|lens|memory|torch|headlamp/i },
  { title: 'Documents and money', test: /passport|visa|insurance|document|cash|money|copies|ticket/i },
  { title: 'Health and medication', test: /medicine|medication|malaria|first aid|tablet|pharmacy/i },
  { title: 'Power and connectivity', test: /adapter|plug|charger|power|sim/i },
  { title: 'Park rules', test: /drone/i },
];

function cleanPackingItems(tips: string[]): string[] {
  const cleaned: string[] = [];
  const seen = new Set<string>();
  let hasWarmLayer = false;
  for (const raw of tips) {
    const item = raw.trim().replace(/\\s+/g, ' ');
    const key = item.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (!item || key === 'lightweight' || key === 'comfortable clothing' || key.split(' ').length < 2) continue;
    const isWarmLayer = /\\b(fleece|warm layer|down jacket|warm jacket)\\b/i.test(item);
    if (isWarmLayer && hasWarmLayer) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    if (isWarmLayer) hasWarmLayer = true;
    cleaned.push(item.charAt(0).toUpperCase() + item.slice(1));
  }
  return cleaned;
}

function categorisePacking(tips: string[]): PackingGroup[] {
  const groups: PackingGroup[] = [];
  const push = (title: string, item: string) => {
    const group = groups.find((g) => g.title === title);
    if (group) {
      if (!group.items.includes(item)) group.items.push(item);
    } else {
      groups.push({ title, items: [item] });
    }
  };
  tips.forEach((tip) => {
    const rule = PACKING_RULES.find((r) => r.test.test(tip));
    push(rule ? rule.title : 'Other essentials', tip);
  });
  return groups;
}

function seasonExtras(region: Region): string[] {
  const extras: string[] = [];
  if (region === 'coast' || region === 'zanzibar') {
    extras.push('Reef-safe sunscreen and a rash vest for snorkelling');
    extras.push('Dry bag for phone and camera on boat days');
  }
  if (region === 'mara' || region === 'rift' || region === 'northern' || region === 'inland') {
    extras.push('Warm fleece or light down layer for early-morning game drives');
  }
  if (region === 'uganda-rwanda' || region === 'northern') {
    extras.push('Waterproof jacket and quick-dry trousers for forest and highland walks');
  }
  return extras;
}

function answerCapsule(safari: Safari, region: Region, best: string): string {
  const highlights = safari.highlights.slice(0, 2).join(' and ');
  const who = (safari.activityLevel ?? 3) >= 4 ? 'travellers who are happy with long driving days' : 'couples, families and small groups';
  return `The ${safari.name} is a ${safari.days}-day, ${safari.nights}-night private safari from ${endpoints(safari).start} visiting ${safari.parks.join(', ')}. It suits ${who}, with ${highlights} among the highlights. Prices are quoted per trip. The most reliable months are ${best}, when ${regionLabel(region)} is usually dry.`;
}

function bestTime(safari: Safari, region: Region): ProgramGuide['bestTime'] {
  const m = model(region);
  const months = MONTHS.map((month, i) => ({ month, rating: m.ratings[i], note: m.notes[i] }));
  const excellent = listMonths(months, 'Excellent');
  const good = listMonths(months, 'Good');
  const avoid = listMonths(months, 'Not ideal');
  const best = [excellent, good].filter(Boolean).join(', then ');
  const headline = excellent
    ? `Best months: ${excellent}. Good: ${good}. Least reliable: ${avoid || 'none in a normal year'}.`
    : `Best months: ${good}. Least reliable: ${avoid || 'none in a normal year'}.`;
  const capsule = `For the ${safari.name}, the strongest months are ${best || 'the dry months'}, when ${regionLabel(region)} is normally dry and wildlife concentrates near water. ${avoid ? `${avoid} is the least reliable because of the long or short rains.` : ''} Wildlife sightings are never guaranteed, and rain dates shift from year to year.`;
  return {
    capsule,
    headline,
    months,
    sourceNote:
      'Season pattern follows the Kenya Meteorological Department’s two rainy seasons (long rains March–May, short rains October–December) and the dry seasons June–October and January–February. Dates vary by year and by park.',
  };
}

function costSection(safari: Safari): ProgramGuide['cost'] {
  const includes = safari.included?.length ? safari.included : DEFAULT_INCLUDED;
  const excludes = safari.excluded?.length ? safari.excluded : DEFAULT_EXCLUDED;
  const capsule = `Bahari Asili quotes the ${safari.name} per trip rather than per seat. The figure depends on your dates, lodge or camp tier, the number of travellers and children’s ages, so no fixed from-price is published. Ask for a dated quote and you receive a written breakdown of accommodation, park fees, vehicle and guide before you commit.`;
  return {
    capsule,
    includes,
    excludes,
    drivers: [
      'Travel dates: park fees and lodge rates change between high and green season.',
      'Accommodation tier: the lodges and camps in this itinerary can often be swapped for a different comfort level.',
      'Group size: the vehicle, guide and fuel are shared across the travellers on the trip.',
      'Children’s ages: child rates and park-fee concessions depend on age and on each lodge’s policy.',
      'Optional extras such as a hot-air balloon, extra park days or domestic flights.',
    ],
    highSeasonNote:
      'High season in Kenya is roughly July–October and the Christmas/New Year period; April–May and November are normally the lowest-priced months. These are market patterns, not a published price list — confirm current rates with the team.',
    todo:
      'TODO(owner): publish a reviewed “from” price per programme, currency, per-person/sharing basis and the date the price was last checked. Until then the site correctly says prices are quoted per trip.',
  };
}

function childrenSection(safari: Safari, region: Region): ProgramGuide['children'] {
  const changes = transfers(safari);
  const level = safari.activityLevel ?? 3;
  const long = safari.days >= 5 || changes >= 4;
  let capsule: string;
  if (long) {
    capsule = `This is a long safari — ${safari.days} days with ${changes} park transfer${changes === 1 ? '' : 's'} — so it suits older children and teenagers better than toddlers. Families with younger children usually find a 2–4 day Tsavo or Amboseli safari easier. Minimum age is not published for this programme: confirm it with our team before booking.`;
  } else if (level <= 2) {
    capsule = `This is a shorter itinerary by duration (${safari.days} days), with ${changes} park transfer${changes === 1 ? '' : 's'}. Most wildlife viewing is vehicle-based, but daily driving hours have not yet been verified, so we cannot describe it as an easy family safari. Minimum age is not published for this programme; ask our team before booking.`;
  } else {
    capsule = `This safari is manageable for most families with school-age children: ${safari.days} days, ${changes} park transfer${changes === 1 ? '' : 's'} and a moderate pace. Younger children may find the driving days long. Minimum age is not published for this programme, so confirm it with our team before booking.`;
  }
  const points = [
    `Daily rhythm: ${safari.days} day${safari.days === 1 ? '' : 's'}, with ${changes} park transfer${changes === 1 ? '' : 's'} and early starts for game drives.`,
    'Most of the wildlife viewing is done seated in the vehicle, which suits children who are comfortable with longer drives.',
    'Child seats and booster seats are not listed as standard equipment — ask before booking if you need one.',
    region === 'coast' || region === 'zanzibar'
      ? 'Boat and water activities require supervision; life jackets should be confirmed with the skipper.'
      : 'Malaria precautions, sun protection and long trousers for evening drives matter more for children than adults.',
    'Family rooms and connecting rooms depend on the lodge; tell us the ages at the quote stage so the right room type is held.',
  ];
  return {
    capsule,
    points,
    todo:
      'TODO(owner): publish the minimum-age policy, child-seat/vehicle policy and the per-day driving time for each programme. The guide states that the minimum age is not published rather than guessing it.',
  };
}

function mobilitySection(safari: Safari): ProgramGuide['mobility'] {
  const level = safari.activityLevel ?? 3;
  const changes = transfers(safari);
  let capsule: string;
  if (level >= 4 || changes >= 4) {
    capsule = `Older travellers in reasonable health do this safari, but it is not a gentle itinerary: ${safari.days} days, ${changes} park transfers and long days in a 4x4. Guests with limited mobility should ask us to check each lodge for step-free access and bathroom adaptations before booking.`;
  } else {
    capsule = `This is a vehicle-based safari with relatively little walking, which suits many older travellers. The main practical questions are the height of the 4x4 step, the distance from the vehicle to the room and whether the lodge has ground-floor rooms. We check those per lodge before confirming.`;
  }
  return {
    capsule,
    points: [
      'Most viewing is seated in a 4x4 vehicle with a pop-up roof; walking is limited to lodge grounds, viewpoints and short stops.',
      `The itinerary involves ${changes} park transfer${changes === 1 ? '' : 's'}, so there are long driving days between destinations.`,
      'Vehicle step height and the availability of a step stool vary by vehicle — ask us to confirm for your dates.',
      'Lodge layouts differ: some rooms are a short walk from the main area, and not every camp advertises step-free access.',
      'Tell us about walking aids, oxygen, dietary needs or medication at the quote stage so lodges and the guide can plan around them.',
    ],
    todo:
      'TODO(owner): confirm step height, step-stool availability and step-free room options for each vehicle and each listed lodge; publish an accessibility statement per programme.',
  };
}

function packingSection(safari: Safari, region: Region): ProgramGuide['packing'] {
  const base = safari.packingTips.length
    ? safari.packingTips
    : [
        'High SPF sunscreen',
        'Wide-brim hat',
        'Insect repellent',
        'Light long-sleeved clothing in neutral colours',
        'Comfortable closed-toe shoes',
        'Binoculars',
        'Camera with spare battery',
        'English 3-pin plug adapter (Type G)',
      ];
  const extras = seasonExtras(region);
  const groups = categorisePacking(cleanPackingItems([...base, ...extras]));
  return {
    capsule: `Pack light, neutral-coloured layers for warm days and cool early mornings, closed-toe shoes, sun and insect protection, and your camera and binoculars. A soft bag is easier to load into a 4x4 than a hard case. Anything you forget can usually be bought in Watamu or Malindi before departure.`,
    groups,
    supplied: [
      'Drinking water during game drives is included in this programme.',
      'Binoculars are not listed as supplied — bring your own if wildlife watching matters to you.',
      'Drones are prohibited in Kenya’s national parks and reserves.',
    ],
  };
}

const HEALTH_SOURCES = [
  { label: 'CDC — Kenya traveler view', url: 'https://wwwnc.cdc.gov/travel/destinations/traveler/none/kenya' },
  {
    label: 'CDC Yellow Book — African safaris and climbing expeditions',
    url: 'https://www.cdc.gov/yellow-book/hcp/africa-middle-east/african-safaris-and-climbing-expeditions.html',
  },
  { label: 'NaTHNaC — Kenya', url: 'https://travelhealthpro.org.uk/countries/kenya' },
  { label: 'Kenya eTA (official entry portal)', url: 'https://www.etakenya.go.ke/' },
];

function healthSection(safari: Safari, region: Region): ProgramGuide['health'] {
  const highland = region === 'northern' || region === 'uganda-rwanda';
  const points = [
    'Malaria: the CDC advises travellers to Kenya to take prescription malaria prophylaxis for all areas below 2,500 m, including the game parks. Start and finish dates depend on the medicine your doctor chooses.',
    'Yellow fever: NaTHNaC recommends yellow fever vaccination from 9 months of age for travellers to Tsavo East, Tsavo West, the Masai Mara and Lake Nakuru. Kenya can require proof of vaccination if you arrive from a country with yellow-fever risk, so carry your certificate.',
    'Routine vaccinations: be up to date with MMR, diphtheria-tetanus-polio and hepatitis A; hepatitis B, typhoid and rabies are worth discussing with a travel clinic for longer trips.',
    'Food and water: drink sealed or filtered water, avoid ice from unknown sources, and eat fruit you have peeled yourself.',
    'Insect protection: repellent containing 20% or more DEET, long sleeves and trousers after dusk, and a mosquito net where the lodge provides one.',
    highland
      ? 'Altitude and cold: some of this itinerary is above 1,500 m, where nights are cold and mornings can be misty. Bring a warm layer and take the first day gently.'
      : 'Heat and sun: daytime temperatures can pass 30°C. Carry water, use high-factor sunscreen and a hat, and take the midday break seriously.',
    'Travel insurance: choose a policy that covers medical treatment and evacuation in remote areas, and declare any pre-existing conditions.',
    'Wildlife safety: stay in the vehicle unless your guide says it is safe to get out, never walk between vehicles after dark, follow lodge escort rules at night, and never feed or approach animals.',
    'Emergency contacts: Bahari Asili Safaris +254 101 923 355 (call or WhatsApp). Kenya’s national emergency numbers are 999 and 112.',
  ];
  const capsule = `Kenya’s game parks carry malaria risk, so the CDC advises prescription prophylaxis for this trip, and yellow-fever vaccination is recommended for Tsavo, the Mara and Nakuru. Travel insurance with medical evacuation is strongly advised. This is general guidance, not medical advice — confirm vaccinations, medication and entry rules with a travel doctor and the official Kenya eTA portal before you travel.`;
  return { capsule, points, sources: HEALTH_SOURCES };
}

function faqsFor(safari: Safari, guide: Omit<ProgramGuide, 'faqs'>): GuideFaq[] {
  return [
    {
      q: `How much does the ${safari.name} cost?`,
      a: `The safari is quoted per trip, not per seat. The quote depends on travel dates, accommodation choice, group size and children’s ages. Ask for a written quote and itemised breakdown before confirming.`,
    },
    {
      q: `Where does the ${safari.name} start and finish?`,
      a: `The listed itinerary starts in ${guide.startPoint} and finishes in ${guide.endPoint}. Confirm your exact hotel or meeting-point pickup with the team before booking.`,
    },
    {
      q: `Which parks are included in the ${safari.name}?`,
      a: `The listed route visits ${safari.parks.join(', ')} over ${safari.days} days and ${safari.nights} nights.`,
    },
    {
      q: `Which accommodation is listed for this safari?`,
      a: safari.lodges.length ? `The itinerary lists ${safari.lodges.join(', ')}. Confirm the final lodge, room category and availability in your written quote.` : 'Accommodation is confirmed in the written quote before booking.',
    },
    {
      q: `Will I definitely see the Big Five on the ${safari.name}?`,
      a: `No wildlife sighting can be guaranteed. Your guide will look for wildlife in the parks on the route, but sightings depend on animal movement, season and conditions.`,
    },
    {
      q: `Is the ${safari.name} private or a group departure?`,
      a: guide.groupType,
    },
  ];
}

export function buildProgramGuide(safari: Safari): ProgramGuide {
  const region = regionFor(safari.parks);
  const { start, end } = endpoints(safari);
  const time = bestTime(safari, region);
  const excellent = time.months.filter((m) => m.rating === 'Excellent').map((m) => m.month);
  const bestMonths = excellent.length ? excellent.slice(0, 3).join(', ') : 'January to February and June to October';
  const cost = costSection(safari);
  const children = childrenSection(safari, region);
  const mobility = mobilitySection(safari);
  const packing = packingSection(safari, region);
  const health = healthSection(safari, region);

  const base = {
    slug: safari.id,
    name: safari.name,
    days: safari.days,
    nights: safari.nights,
    parks: safari.parks,
    startPoint: start,
    endPoint: end,
    groupType: safari.private ? 'Private departure' : 'Private or small-group departure — confirm at booking',
    maxGroupSize: 'Not published — ask at quote',
    pace: paceLabel(safari.activityLevel ?? 3),
    activityLevel: safari.activityLevel ?? 3,
    comfortLevel: safari.comfortLevel ?? 3,
    priceBasis: 'Quoted per trip — not per seat; no published from-price',
    priceFrom: null,
    currency: 'USD',
    answerCapsule: answerCapsule(safari, region, bestMonths),
    quickFacts: [
      { label: 'Duration', value: `${safari.days} day${safari.days === 1 ? '' : 's'} / ${safari.nights} night${safari.nights === 1 ? '' : 's'}` },
      { label: 'Start / finish', value: `${start} → ${end}` },
      { label: 'Parks and reserves', value: safari.parks.join(', ') },
      { label: 'Price', value: 'Quoted per trip — no fixed from-price published' },
      { label: 'Group type', value: safari.private ? 'Private departure' : 'Private or small group — confirm at booking' },
      { label: 'Pace', value: paceLabel(safari.activityLevel ?? 3) },
      { label: 'Best months', value: time.headline.replace(/^Best months: /, '').replace(/\.$/, '') },
      { label: 'Minimum age', value: 'Not published — confirm with our team' },
    ],
    cost,
    bestTime: time,
    children,
    mobility,
    packing,
    health,
  };

  return { ...base, faqs: faqsFor(safari, base) };
}

export function assertProgramGuide(guide: ProgramGuide): void {
  const required: (keyof ProgramGuide)[] = [
    'answerCapsule', 'quickFacts', 'cost', 'bestTime', 'children', 'mobility', 'packing', 'health', 'faqs',
  ];
  const missing = required.filter((key) => {
    const value = guide[key];
    return value == null || (Array.isArray(value) && value.length === 0);
  });
  if (missing.length) {
    throw new Error(`Program guide for "${guide.slug}" is missing: ${missing.join(', ')}`);
  }
  if (guide.bestTime.months.length !== 12) {
    throw new Error(`Program guide for "${guide.slug}" must have a 12-month season table.`);
  }
  if (guide.faqs.length < 5) {
    throw new Error(`Program guide for "${guide.slug}" needs at least 5 FAQs.`);
  }
  const words = guide.answerCapsule.trim().split(/\s+/).length;
  if (words < 35 || words > 80) {
    throw new Error(`Program guide for "${guide.slug}" answer capsule is ${words} words (expected 35–80).`);
  }
}
