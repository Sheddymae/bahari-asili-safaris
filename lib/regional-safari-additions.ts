import type { Safari } from '@/lib/tours-data';

const packingTips = ['High-SPF sunscreen', 'Wide-brim hat', 'Light layers', 'Comfortable walking shoes', 'Binoculars', 'Reusable water bottle', 'Camera with spare battery', 'Travel documents'];
const included = ['Professional driver-guide or local activity guide', 'Transport for the stated itinerary', 'Park/reserve entry where stated', 'Accommodation as listed', 'Drinking water during scheduled drives'];
const excluded = ['International and domestic flights unless stated', 'Visa fees', 'Travel and medical insurance', 'Tips and gratuities', 'Personal expenses', 'Optional activities'];
const day = (n: number, title: string, morning: string, afternoon: string, overnight: string) => ({ day: `Day ${n}`, title, morning, afternoon, overnight });

function regional(p: Omit<Safari, 'rating' | 'reviewCount' | 'packingTips' | 'included' | 'excluded' | 'tabs'> & { destinationSlugs: string[] }): Safari {
  return { ...p, tabs: [], rating: 0, reviewCount: 0, packingTips, included, excluded };
}

export const regionalSafariAdditions: Safari[] = [
  regional({
    id: '3-day-samburu', name: '3-Day Samburu Safari', tagline: 'Northern Kenya, rare species and the Ewaso Ng’iro River', days: 3, nights: 2,
    parks: ['Samburu National Reserve'], lodges: ['Selected Samburu lodge/camp'], destinationSlugs: ['samburu'], image: '/images/safaris/safari-zazu.jpg', category: 'short', activityLevel: 3, comfortLevel: 4,
    highlights: ['Samburu Special Five', 'Ewaso Ng’iro River', 'Elephants and big cats', 'Northern Kenya landscapes'],
    itinerary: [day(1, 'Watamu → Samburu', 'Travel inland toward northern Kenya and arrive at Samburu for lunch.', 'Afternoon game drive along the river and open plains.', 'Selected Samburu lodge/camp'), day(2, 'Full Day Samburu', 'Sunrise game drive for Grevy’s zebra, reticulated giraffe and oryx.', 'Continue wildlife tracking and enjoy a relaxed evening at camp.', 'Selected Samburu lodge/camp'), day(3, 'Samburu → Watamu', 'Final morning drive and breakfast.', 'Return journey to the coast.', 'Return to Watamu')],
  }),
  regional({
    id: '3-day-mount-kenya', name: '3-Day Mount Kenya Nature Escape', tagline: 'Forest, highland scenery and wildlife beneath Africa’s second-highest peak', days: 3, nights: 2,
    parks: ['Mount Kenya National Park'], lodges: ['Selected Mount Kenya lodge'], destinationSlugs: ['mount-kenya'], image: '/images/safaris/safari-inside-tsavo-amboseli.jpg', category: 'short', activityLevel: 3, comfortLevel: 4,
    highlights: ['Montane forest', 'Alpine landscapes', 'Forest wildlife', 'Guided nature walks'],
    itinerary: [day(1, 'Watamu → Mount Kenya', 'Travel inland toward the Mount Kenya foothills.', 'Settle in and take a guided forest nature walk.', 'Selected Mount Kenya lodge'), day(2, 'Mount Kenya Nature Day', 'Explore forest and moorland habitats with a local guide.', 'Scenic highland experience and birdwatching.', 'Selected Mount Kenya lodge'), day(3, 'Mount Kenya → Watamu', 'Final morning walk and breakfast.', 'Return to the coast.', 'Return to Watamu')],
  }),
  regional({
    id: '4-day-serengeti', name: '4-Day Serengeti Safari', tagline: 'Endless plains, predators and the Great Migration ecosystem', days: 4, nights: 3,
    parks: ['Serengeti National Park'], lodges: ['Selected Serengeti lodge/camp'], destinationSlugs: ['serengeti'], image: '/images/destinations/masai-mara.jpg', category: 'medium', activityLevel: 3, comfortLevel: 4,
    highlights: ['Great Migration ecosystem', 'Lion, cheetah and leopard', 'Endless plains', 'River and kopje landscapes'],
    itinerary: [day(1, 'Arusha → Serengeti', 'Travel or fly toward the Serengeti and enter the park.', 'Afternoon game drive across the plains.', 'Selected Serengeti lodge/camp'), day(2, 'Full Day Serengeti', 'Early game drive following predator and herbivore activity.', 'Extended wildlife drive through a different sector.', 'Selected Serengeti lodge/camp'), day(3, 'Full Day Serengeti', 'Dawn wildlife viewing and migration tracking where seasonal conditions allow.', 'Continue through plains, river corridors or kopjes.', 'Selected Serengeti lodge/camp'), day(4, 'Serengeti → Arusha', 'Final sunrise drive.', 'Transfer onward to Arusha.', 'End of safari')],
  }),
  regional({
    id: '3-day-ngorongoro', name: '3-Day Ngorongoro Crater Safari', tagline: 'A volcanic caldera with exceptional wildlife concentration', days: 3, nights: 2,
    parks: ['Ngorongoro Conservation Area'], lodges: ['Selected Ngorongoro lodge'], destinationSlugs: ['ngorongoro'], image: '/images/safaris/safari-experience-tsavo.jpg', category: 'short', activityLevel: 3, comfortLevel: 4,
    highlights: ['Crater game drive', 'Rhino habitat', 'Lions and hyenas', 'Volcanic highlands'],
    itinerary: [day(1, 'Arusha → Ngorongoro', 'Travel through the northern Tanzania highlands.', 'Arrive on the crater rim and enjoy the landscape.', 'Selected Ngorongoro lodge'), day(2, 'Ngorongoro Crater', 'Descend for a full crater game drive among grassland, woodland and wetlands.', 'Continue wildlife viewing before returning to the rim.', 'Selected Ngorongoro lodge'), day(3, 'Ngorongoro → Arusha', 'Short morning nature experience.', 'Return to Arusha.', 'End of safari')],
  }),
  regional({
    id: '3-day-tarangire', name: '3-Day Tarangire Safari', tagline: 'Baobabs, elephants and a wildlife-rich dry-season river', days: 3, nights: 2,
    parks: ['Tarangire National Park'], lodges: ['Selected Tarangire lodge/camp'], destinationSlugs: ['tarangire'], image: '/images/safaris/safari-twiga.jpg', category: 'short', activityLevel: 3, comfortLevel: 4,
    highlights: ['Large elephant herds', 'Ancient baobabs', 'Tarangire River', 'Bird-rich landscapes'],
    itinerary: [day(1, 'Arusha → Tarangire', 'Drive from Arusha and enter Tarangire.', 'Afternoon game drive among baobabs and elephant country.', 'Selected Tarangire lodge/camp'), day(2, 'Full Day Tarangire', 'Sunrise wildlife drive near water sources.', 'Explore different habitats and follow seasonal wildlife movements.', 'Selected Tarangire lodge/camp'), day(3, 'Tarangire → Arusha', 'Final morning game drive.', 'Return to Arusha.', 'End of safari')],
  }),
  regional({
    id: '4-day-zanzibar', name: '4-Day Zanzibar Island Experience', tagline: 'Swahili heritage, spice culture and turquoise Indian Ocean', days: 4, nights: 3,
    parks: ['Zanzibar Island'], lodges: ['Selected Zanzibar hotel'], destinationSlugs: ['zanzibar'], image: '/images/excursions/love-island.jpg', category: 'medium', activityLevel: 2, comfortLevel: 4,
    highlights: ['Stone Town heritage', 'Spice farm visit', 'Indian Ocean beaches', 'Dhow sailing and reef time'],
    itinerary: [day(1, 'Arrival → Zanzibar', 'Arrive and transfer to your hotel.', 'Relax by the coast or explore Stone Town.', 'Selected Zanzibar hotel'), day(2, 'Stone Town & Spice Heritage', 'Guided Stone Town walking tour.', 'Spice-farm and Swahili food experience.', 'Selected Zanzibar hotel'), day(3, 'Indian Ocean Day', 'Boat or reef excursion according to sea conditions.', 'Beach time, swimming or snorkelling.', 'Selected Zanzibar hotel'), day(4, 'Zanzibar → Departure', 'Final beach morning.', 'Transfer to the airport or onward connection.', 'End of experience')],
  }),
  regional({
    id: '4-day-queen-elizabeth', name: '4-Day Queen Elizabeth Safari', tagline: 'Savanna, crater lakes and the wildlife-rich Kazinga Channel', days: 4, nights: 3,
    parks: ['Queen Elizabeth National Park'], lodges: ['Selected Queen Elizabeth lodge'], destinationSlugs: ['queen-elizabeth'], image: '/images/safaris/safari-simba-timon.jpg', category: 'medium', activityLevel: 3, comfortLevel: 4,
    highlights: ['Kazinga Channel boat safari', 'Elephants and buffalo', 'Tree-climbing lions in Ishasha', 'Albertine Rift birdlife'],
    itinerary: [day(1, 'Arrival → Queen Elizabeth', 'Travel into western Uganda and settle near the park.', 'Afternoon game drive.', 'Selected Queen Elizabeth lodge'), day(2, 'Queen Elizabeth Wildlife', 'Morning game drive across savanna and crater-lake country.', 'Kazinga Channel boat safari for hippos, crocodiles and waterbirds.', 'Selected Queen Elizabeth lodge'), day(3, 'Ishasha Sector', 'Travel toward Ishasha and search for tree-climbing lions.', 'Wildlife drive and return toward the main park sector.', 'Selected Queen Elizabeth lodge'), day(4, 'Queen Elizabeth → Departure', 'Final game drive.', 'Continue onward to your next Uganda destination.', 'End of safari')],
  }),
  regional({
    id: '3-day-bwindi', name: '3-Day Bwindi Gorilla Trekking Experience', tagline: 'Ancient rainforest and a closely managed mountain-gorilla encounter', days: 3, nights: 2,
    parks: ['Bwindi Impenetrable National Park'], lodges: ['Selected Bwindi lodge'], destinationSlugs: ['bwindi'], image: '/images/safaris/safari-tumbili.jpg', category: 'short', activityLevel: 5, comfortLevel: 4,
    highlights: ['Mountain gorilla trekking', 'Ancient rainforest', 'Albertine Rift birds', 'Community conservation'],
    itinerary: [day(1, 'Arrival → Bwindi', 'Travel into southwestern Uganda and reach the forest region.', 'Rest and trek briefing.', 'Selected Bwindi lodge'), day(2, 'Gorilla Trekking', 'Early departure for the gorilla trek with an authorised guide and trackers.', 'Return to the lodge after the trek and rest.', 'Selected Bwindi lodge'), day(3, 'Bwindi → Departure', 'Optional short nature/community activity.', 'Transfer onward.', 'End of experience')],
  }),
  regional({
    id: '4-day-murchison-falls', name: '4-Day Murchison Falls Safari', tagline: 'The Nile, powerful falls and broad northern Uganda savanna', days: 4, nights: 3,
    parks: ['Murchison Falls National Park'], lodges: ['Selected Murchison Falls lodge'], destinationSlugs: ['murchison-falls'], image: '/images/safaris/safari-nala-taita.jpg', category: 'medium', activityLevel: 3, comfortLevel: 4,
    highlights: ['Nile boat safari', 'Murchison Falls viewpoint', 'Elephants and giraffe', 'Hippos and crocodiles'],
    itinerary: [day(1, 'Arrival → Murchison Falls', 'Travel toward the park and cross into the protected area.', 'Afternoon game drive.', 'Selected Murchison Falls lodge'), day(2, 'Nile & Wildlife', 'Morning game drive across the savanna.', 'Boat safari on the Nile toward the falls.', 'Selected Murchison Falls lodge'), day(3, 'Full Day Murchison', 'Sunrise wildlife drive.', 'Explore another sector and visit the falls viewpoint.', 'Selected Murchison Falls lodge'), day(4, 'Murchison → Departure', 'Final morning drive.', 'Transfer onward.', 'End of safari')],
  }),
  regional({
    id: '3-day-akagera', name: '3-Day Akagera Safari', tagline: 'Rwanda’s lakes, wetlands and recovering Big Five landscape', days: 3, nights: 2,
    parks: ['Akagera National Park'], lodges: ['Selected Akagera lodge'], destinationSlugs: ['akagera'], image: '/images/safaris/safari-nala-taita.jpg', category: 'short', activityLevel: 3, comfortLevel: 4,
    highlights: ['Big Five restoration landscape', 'Lake Ihema boat safari', 'Giraffe, zebra and elephant', 'Papyrus wetlands'],
    itinerary: [day(1, 'Kigali → Akagera', 'Travel east from Kigali to Akagera.', 'Afternoon game drive across plains and wetlands.', 'Selected Akagera lodge'), day(2, 'Full Day Akagera', 'Morning game drive for elephant, buffalo, giraffe and predators.', 'Lake Ihema boat safari and birdwatching.', 'Selected Akagera lodge'), day(3, 'Akagera → Kigali', 'Final sunrise game drive.', 'Return to Kigali.', 'End of safari')],
  }),
];
