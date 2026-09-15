import { safaris, type SafariTab } from './tours-data';

export interface Destination {
  slug: string;
  name: string;
  tagline: string;
  heroImage: string;
  intro: string;
  history?: string;
  country?: string;
  region?: string;
  wildlifeHighlights: string[];
  bestSeason: string;
  faqs: { q: string; a: string }[];
}

export const destinations: Destination[] = [
  {
    slug: 'tsavo', name: 'Tsavo', tagline: "Kenya's largest wilderness — red-dusted elephants and endless horizons", heroImage: '/images/safaris/safari-experience-tsavo.jpg', country: 'Kenya', region: 'Coast & Southern Kenya',
    intro: "Tsavo East and West together form one of the world's largest protected wildlife areas. It's famous for its red-earth elephants — the dust here stains their hides the colour of the soil — plus the Yatta Plateau, Mzima Springs, and rolling savannah that stretches to the horizon. It's also the closest major safari destination to the coast, making it easy to combine with a Watamu beach stay.",
    history: 'Tsavo became a protected area in the late 1940s and became globally famous during the construction of the Kenya–Uganda Railway, when two maneless lions killed railway workers in 1898. Today the park protects a huge connected wilderness and is one of the strongest conservation landscapes in Kenya.',
    wildlifeHighlights: ["Large elephant herds (Tsavo's signature red elephants)", 'Lions, including the historically maneless Tsavo lions', 'Rhino sanctuary within Tsavo West', 'Mzima Springs hippos and crocodiles, viewable from an underwater tank', "Yatta Plateau — the world's longest lava flow"],
    bestSeason: 'June–October (dry season) offers the best game viewing as animals gather near rivers and waterholes. November–May is greener and quieter, with fewer vehicles on the tracks.',
    faqs: [{ q: 'How far is Tsavo from Watamu/Mombasa?', a: 'Roughly 3–4 hours by road from the coast, which is why many Tsavo safaris depart from and return to Watamu or Mombasa.' }, { q: 'Is Tsavo good for a short safari?', a: "Yes — Tsavo East in particular works well for 2–3 day safaris since it's the closest major park to the coast, without the long transfer times Masai Mara requires." }, { q: 'Will we definitely see elephants?', a: "Tsavo has one of Kenya's largest elephant populations, so sightings are very likely, especially near water sources in the dry season — though wildlife viewing is never 100% guaranteed." }],
  },
  {
    slug: 'amboseli', name: 'Amboseli', tagline: 'Big-tusker elephants beneath the shadow of Kilimanjaro', heroImage: '/images/safaris/safari-inside-tsavo-amboseli.jpg', country: 'Kenya', region: 'Southern Kenya',
    intro: "Amboseli National Park is best known for one unbeatable combination: large elephant herds walking across open plains with Mount Kilimanjaro rising in the background — Africa's classic postcard image. The park's swamps and marshes, fed by underground water from Kilimanjaro's snowmelt, keep it green even in the dry season, drawing wildlife and photographers from across the region.",
    history: 'Amboseli was established as a national park in 1974 after a long history of wildlife protection and Maasai pastoral use. The park remains one of East Africa’s most important landscapes for elephant research and conservation.',
    wildlifeHighlights: ['Free-ranging elephant herds with Kilimanjaro as a backdrop', 'Swamp-fed grasslands supporting year-round wildlife', 'Maasai giraffe, buffalo, zebra and wildebeest', "Excellent birdlife around Amboseli's marshes"],
    bestSeason: 'June–October and January–February are best for clear Kilimanjaro views and concentrated wildlife near the swamps. Clouds more often obscure the mountain during the March–May rains.',
    faqs: [{ q: 'Can we combine Amboseli with Tsavo?', a: 'Yes — several itineraries combine the two on a practical southern Kenya route, giving you Kilimanjaro views and Tsavo elephants in one trip.' }, { q: 'Is Kilimanjaro visible year-round?', a: 'The mountain is often cloud-covered, especially during the rains. Early morning is generally the clearest time to photograph it.' }],
  },
  {
    slug: 'mara', name: 'Masai Mara', tagline: "Kenya's most famous reserve — home to the Great Migration", heroImage: '/images/destinations/masai-mara.jpg', country: 'Kenya', region: 'Western Kenya',
    intro: 'The Masai Mara National Reserve is Kenya’s flagship safari destination — an extension of Tanzania’s Serengeti ecosystem, and the stage for the annual wildebeest migration. Beyond the migration, the Mara holds year-round resident populations of lion, leopard, cheetah, and elephant across open grassland that makes for exceptional game viewing at any time of year.',
    history: 'The Masai Mara was gazetted as a wildlife sanctuary in 1961 and later became a national reserve. It forms the northern continuation of the Serengeti–Mara ecosystem, a landscape shaped by seasonal movements of millions of grazing animals and centuries of Maasai pastoral culture.',
    wildlifeHighlights: ['The Great Migration — river crossings of wildebeest and zebra (seasonal)', 'High density of big cats: lion, leopard, cheetah', 'Large resident elephant and buffalo herds', 'Maasai cultural visits to local villages'],
    bestSeason: 'July–October for the migration and river crossings. The Mara has good game viewing year-round, but the dry season (Jun–Oct) concentrates wildlife most predictably.',
    faqs: [{ q: 'How far is the Masai Mara from Watamu?', a: 'It’s a significant journey — typically a flight via Nairobi is more practical than driving from the coast. Longer multi-park itineraries can be built around it.' }, { q: 'Is the migration guaranteed?', a: 'No sighting in nature is ever guaranteed, but July–October gives the strongest odds of witnessing river crossings, based on typical migration patterns.' }],
  },
  {
    slug: 'taita', name: 'Taita Hills', tagline: 'A private, less-crowded sanctuary between Tsavo East and West', heroImage: '/images/safaris/safari-nala-taita.jpg', country: 'Kenya', region: 'Southern Kenya',
    intro: 'The Taita Hills Wildlife Sanctuary sits between Tsavo East and Tsavo West, offering a quieter, more exclusive game-viewing experience with fewer vehicles than the main parks. Its varied terrain — hills, forest patches, and open plains — supports a good diversity of wildlife in a relatively compact, easy-to-explore area.',
    history: 'The Taita Hills are part of an ancient mountain landscape with deep cultural and ecological importance. The wildlife sanctuary was established in the 1970s and has become known for combining wildlife conservation with lodge-based tourism and waterhole viewing.',
    wildlifeHighlights: ['Elephant, buffalo, and giraffe in a quieter, less-trafficked setting', 'Varied terrain — hills, plains and forest patches', 'Often combined with Tsavo East/West for a fuller circuit'],
    bestSeason: 'June–October (dry season) for the best game concentration, similar to neighbouring Tsavo.',
    faqs: [{ q: 'Is Taita Hills a standalone destination?', a: 'It is usually combined with Tsavo East and/or West as part of a multi-park itinerary rather than visited alone, since it sits right between them.' }],
  },
  {
    slug: 'samburu', name: 'Samburu', tagline: 'Dry-country beauty, rare northern species and the Ewaso Ng’iro River', heroImage: '/images/safaris/safari-zazu.jpg', country: 'Kenya', region: 'Northern Kenya',
    intro: 'Samburu National Reserve is a striking contrast to Kenya’s wetter southern parks: rocky hills, doum palms and golden plains gather around the Ewaso Ng’iro River. The reserve is famous for the “Samburu Special Five” — Grevy’s zebra, reticulated giraffe, gerenuk, Somali ostrich and beisa oryx — alongside lion, leopard, elephant and wild dog.',
    history: 'Samburu became a protected reserve in 1985. The landscape has long been home to Samburu pastoral communities, whose knowledge of seasonal water, grazing and wildlife remains closely connected to the ecosystem.',
    wildlifeHighlights: ['Samburu Special Five', 'Elephants along the Ewaso Ng’iro River', 'Leopard, lion and African wild dog', 'Reticulated giraffe and Grevy’s zebra'],
    bestSeason: 'June–October and January–February are popular dry-season periods when animals concentrate around the Ewaso Ng’iro River. The green seasons bring dramatic landscapes and migratory birds.',
    faqs: [{ q: 'What makes Samburu different from the Mara?', a: 'Samburu offers a drier northern landscape and several species rarely seen in southern Kenya, making it an excellent second safari region rather than a replacement for the Mara.' }, { q: 'Can Samburu be combined with other parks?', a: 'Yes. Samburu works especially well with Ol Pejeta, Mount Kenya or Lake Nakuru on a longer Kenya circuit.' }],
  },
  {
    slug: 'lake-nakuru', name: 'Lake Nakuru', tagline: 'Rift Valley cliffs, rhinos and a lake famous for flamingos', heroImage: '/images/safaris/safari-tembo.jpg', country: 'Kenya', region: 'Rift Valley',
    intro: 'Lake Nakuru National Park sits around a shallow alkaline lake in the Great Rift Valley. Its combination of open grassland, rocky escarpments, acacia woodland and wetland makes it a compact but rewarding wildlife stop, particularly for black and white rhinoceros, Rothschild’s giraffe and large concentrations of waterbirds.',
    history: 'The area around Lake Nakuru became a national park in 1968. The lake first became internationally famous for enormous flamingo gatherings, while later conservation work turned the park into an important sanctuary for rhino and other threatened species.',
    wildlifeHighlights: ['Black and white rhinoceros', 'Rothschild’s giraffe', 'Flamingos and pelicans when conditions favour them', 'Lion, leopard, buffalo and waterbuck'],
    bestSeason: 'June–October and January–February are reliable dry periods for wildlife viewing. Flamingo numbers change with lake conditions, water levels and food availability, so they should never be promised as guaranteed.',
    faqs: [{ q: 'Are flamingos always at Lake Nakuru?', a: 'No. Their numbers move with water conditions and food supply. The park remains worthwhile for rhino, giraffe and other wildlife even when flamingo numbers are lower.' }, { q: 'How long should we spend here?', a: 'One full day or a single overnight stop works well when combining Lake Nakuru with the Masai Mara or other Rift Valley destinations.' }],
  },
  {
    slug: 'naivasha-hells-gate', name: 'Lake Naivasha & Hell’s Gate', tagline: 'Freshwater, volcanic cliffs and one of Kenya’s best active-adventure stops', heroImage: '/images/excursions/love-island.jpg', country: 'Kenya', region: 'Rift Valley',
    intro: 'Lake Naivasha is a freshwater Rift Valley lake surrounded by acacia woodland, flower farms and volcanic landscapes. Nearby Hell’s Gate National Park is unusual for Kenya because visitors can explore parts of the park on foot or by bicycle, passing towering cliffs, geothermal features and herds of zebra, giraffe and buffalo.',
    history: 'Naivasha has long been part of the Rift Valley’s pastoral and agricultural landscape. Hell’s Gate was gazetted as a national park in 1984 and takes its name from a narrow break in the cliffs. The dramatic scenery also helped inspire landscapes associated with early adventure and film production in Kenya.',
    wildlifeHighlights: ['Zebra, giraffe and buffalo', 'Hippos in Lake Naivasha', 'Bird-rich freshwater shoreline', 'Cycling and walking among volcanic cliffs'],
    bestSeason: 'January–February and June–October are popular for drier trails and clearer views. The green seasons can be spectacular for scenery and birdlife.',
    faqs: [{ q: 'Can we walk in Hell’s Gate?', a: 'Yes, in designated areas and with the appropriate local guidance. It is one of Kenya’s most accessible parks for active exploration.' }, { q: 'Is Naivasha good for families?', a: 'Yes. The lake, gentle walks, boat rides and Hell’s Gate cycling options can add variety to a family safari.' }],
  },
  {
    slug: 'mount-kenya', name: 'Mount Kenya', tagline: 'High-altitude forests, alpine valleys and Africa’s second-highest summit', heroImage: '/images/safaris/safari-inside-tsavo-amboseli.jpg', country: 'Kenya', region: 'Central Kenya',
    intro: 'Mount Kenya National Park rises through dense montane forest, bamboo and moorland toward dramatic volcanic peaks. The lower slopes are rich in elephant and buffalo habitat, while higher routes reveal alpine vegetation, rock walls and glacial remnants — a powerful complement to a classic lowland safari.',
    history: 'Mount Kenya is an ancient extinct volcano and a sacred mountain in Kikuyu tradition. The national park and surrounding forest reserve were established to protect its exceptional ecosystems, and the mountain was recognised as a UNESCO World Heritage Site in 1997.',
    wildlifeHighlights: ['Elephant and buffalo in the forest zone', 'Colobus and other forest primates', 'Alpine plants and high-altitude landscapes', 'Diverse montane birdlife'],
    bestSeason: 'January–February and June–September are generally favoured for trekking because conditions are often drier. Mountain weather can change quickly at any time of year.',
    faqs: [{ q: 'Is Mount Kenya only for serious climbers?', a: 'No. Lower forest and moorland experiences can be designed for travellers who want scenery and nature without attempting the highest summit.' }, { q: 'Can it be combined with a safari?', a: 'Yes. Mount Kenya combines naturally with Samburu, Ol Pejeta, Lake Nakuru and the Masai Mara on longer circuits.' }],
  },
  {
    slug: 'serengeti', name: 'Serengeti', tagline: 'Endless plains, predator country and the southern half of the Great Migration', heroImage: '/images/destinations/masai-mara.jpg', country: 'Tanzania', region: 'Northern Tanzania',
    intro: 'Serengeti National Park is one of Africa’s defining wildlife landscapes: immense grass plains broken by kopjes, river corridors and woodland. It is famous for the scale of its resident predators and for the annual movement of wildebeest, zebra and gazelle through the wider Serengeti–Mara ecosystem.',
    history: 'The Serengeti was established as a national park in 1951 and later became part of a wider conservation system with the Ngorongoro Conservation Area. The name comes from a Maasai expression commonly translated as “endless plains.”',
    wildlifeHighlights: ['Great Migration herds', 'Lion, cheetah and leopard', 'Large elephant and buffalo populations', 'Crocodiles and hippos in river systems'],
    bestSeason: 'June–October is popular for dry-season game viewing and northern migration activity. January–March can be excellent in the southern Serengeti for calving, while exact migration timing changes each year.',
    faqs: [{ q: 'Is the Serengeti the same as the Masai Mara?', a: 'No. They are different protected areas in Tanzania and Kenya, but they protect one connected ecological system and share the annual migration.' }, { q: 'When is the migration in the Serengeti?', a: 'It moves continuously through the ecosystem. Southern calving is commonly associated with January–March, while river-crossing activity is more associated with the northern sector later in the year.' }],
  },
  {
    slug: 'ngorongoro', name: 'Ngorongoro Crater', tagline: 'A volcanic caldera holding one of Africa’s most concentrated wildlife scenes', heroImage: '/images/safaris/safari-experience-tsavo.jpg', country: 'Tanzania', region: 'Northern Tanzania',
    intro: 'The Ngorongoro Crater is a vast volcanic caldera whose enclosed grasslands, woodland, lake and marshes support an extraordinary density of wildlife. Descending into the crater feels like entering a natural amphitheatre: lions and hyenas patrol the plains while elephants, buffalo and other herbivores move between water and grazing areas.',
    history: 'The crater formed after a huge volcanic mountain collapsed roughly two to three million years ago. The wider Ngorongoro Conservation Area was established in 1959 and is distinctive because wildlife conservation, pastoral communities and cultural heritage are managed together.',
    wildlifeHighlights: ['High-density lion and hyena populations', 'Elephants and large buffalo herds', 'Hippos in crater wetlands', 'One of the stronger northern Tanzania destinations for rhino sightings'],
    bestSeason: 'June–October is a popular dry-season window for clear conditions and concentrated wildlife. January–March brings green landscapes and calving activity in the wider ecosystem.',
    faqs: [{ q: 'Can you stay inside the crater?', a: 'Most accommodation is on the crater rim or in the surrounding conservation area rather than on the crater floor. Game drives descend into the crater during permitted hours.' }, { q: 'How long do we need?', a: 'A crater game drive can fit into one day, especially when combined with Serengeti or Tarangire.' }],
  },
  {
    slug: 'tarangire', name: 'Tarangire', tagline: 'Baobabs, giant elephant herds and a river that becomes a dry-season lifeline', heroImage: '/images/safaris/safari-twiga.jpg', country: 'Tanzania', region: 'Northern Tanzania',
    intro: 'Tarangire National Park is known for enormous baobabs, seasonal wetlands and a river that draws wildlife during the dry months. Elephant herds are a signature sight, but the park also rewards patient travellers with giraffe, zebra, wildebeest, big cats and exceptional birdlife.',
    history: 'Tarangire became a national park in 1970 after years as a protected game reserve. The Tarangire River and surrounding migration routes remain central to the park’s ecological importance, particularly during Tanzania’s dry season.',
    wildlifeHighlights: ['Large elephant herds', 'Ancient baobab landscapes', 'Lion, leopard and cheetah', 'Rich birdlife and seasonal migratory species'],
    bestSeason: 'June–October is especially productive because wildlife gathers around the Tarangire River and remaining water sources. November–May brings greener scenery and many birds.',
    faqs: [{ q: 'Why choose Tarangire if we are already visiting Serengeti?', a: 'Tarangire has a distinct landscape, huge baobabs and strong elephant viewing, making it a worthwhile contrast on a northern Tanzania circuit.' }, { q: 'Is Tarangire suitable for a short safari?', a: 'Yes. It can work very well as a one- or two-day park visit from the Arusha area.' }],
  },
  {
    slug: 'zanzibar', name: 'Zanzibar', tagline: 'Swahili history, spice islands and turquoise Indian Ocean beaches', heroImage: '/images/excursions/love-island.jpg', country: 'Tanzania', region: 'Indian Ocean Coast',
    intro: 'Zanzibar is the natural beach extension to a northern Tanzania safari: coral reefs, white-sand beaches, spice plantations and Stone Town’s narrow lanes create a very different rhythm after days in the bush. It works especially well for travellers who want wildlife and Indian Ocean relaxation in one journey.',
    history: 'Zanzibar was a major Indian Ocean trading centre shaped by African, Arab, Persian, Indian and European influences. Stone Town preserves much of this layered Swahili history and is recognised as a UNESCO World Heritage Site.',
    wildlifeHighlights: ['Dolphins and reef life', 'Red colobus monkeys on Unguja', 'Coral gardens and Indian Ocean beaches', 'Stone Town and spice-route heritage'],
    bestSeason: 'June–October is a popular dry period. December–February is also warm and generally favourable. April–May brings the long rains and fewer visitors.',
    faqs: [{ q: 'Can Zanzibar be combined with a safari?', a: 'Yes. Zanzibar is one of the easiest beach extensions after Serengeti, Ngorongoro or Tarangire, with regular flights linking the safari circuit and island.' }, { q: 'Is Zanzibar only for beaches?', a: 'No. Stone Town, spice farms, dhow sailing, reefs and local cultural experiences make it a destination in its own right.' }],
  },
  {
    slug: 'queen-elizabeth', name: 'Queen Elizabeth National Park', tagline: 'Kazinga Channel waters, crater lakes and Uganda’s classic savanna safari', heroImage: '/images/safaris/safari-simba-timon.jpg', country: 'Uganda', region: 'Western Uganda',
    intro: 'Queen Elizabeth National Park stretches between Lake Edward and Lake George, combining open savanna with crater lakes, woodland and the wildlife-rich Kazinga Channel. Boat cruises reveal hippos, crocodiles and huge numbers of waterbirds, while game drives search for elephants, lions, buffalo, kob and other species.',
    history: 'The park was created in 1954 and named after Queen Elizabeth II. It sits within the Albertine Rift, one of Africa’s most biologically diverse regions, and forms an important link between Uganda’s savanna and forest ecosystems.',
    wildlifeHighlights: ['Tree-climbing lions in the Ishasha sector', 'Kazinga Channel hippos and crocodiles', 'Elephants, buffalo and Uganda kob', 'Exceptional bird diversity'],
    bestSeason: 'June–September and December–February are popular for drier conditions and game viewing. The wetter months can be excellent for scenery and birding.',
    faqs: [{ q: 'Why visit Queen Elizabeth instead of Kenya?', a: 'It offers a different Albertine Rift landscape, excellent boat viewing and access to Uganda’s forest and primate destinations.' }, { q: 'Can it be combined with gorilla trekking?', a: 'Yes. Queen Elizabeth is a common component of longer western Uganda itineraries that continue toward Bwindi.' }],
  },
  {
    slug: 'bwindi', name: 'Bwindi Impenetrable Forest', tagline: 'Ancient rainforest and one of the world’s most extraordinary gorilla encounters', heroImage: '/images/safaris/safari-tumbili.jpg', country: 'Uganda', region: 'Southwestern Uganda',
    intro: 'Bwindi is a steep, ancient rainforest famous for mountain gorilla trekking. Dense vegetation, misty ridges and extraordinary biodiversity make the forest feel completely different from the open savanna parks. Gorilla tracking is demanding but deeply rewarding and is conducted under strict conservation rules.',
    history: 'Bwindi was gazetted as a national park in 1991 and became a UNESCO World Heritage Site in 1994. Conservation tourism has become a major source of support for gorilla protection and neighbouring communities.',
    wildlifeHighlights: ['Mountain gorillas', 'Golden monkeys and other primates nearby', 'Albertine Rift endemic birds', 'Ancient montane rainforest'],
    bestSeason: 'June–August and December–February are often favoured for trekking because trails can be less wet, but gorilla trekking operates year-round and rain is always possible in the forest.',
    faqs: [{ q: 'Is gorilla trekking physically difficult?', a: 'It can be. Trek duration and terrain vary by gorilla family and conditions. Travellers should be prepared for steep, muddy forest trails.' }, { q: 'How far in advance should gorilla permits be planned?', a: 'Permits are limited and highly sought after, so they should be secured well ahead of travel dates through the appropriate Uganda authorities or a reputable operator.' }],
  },
  {
    slug: 'murchison-falls', name: 'Murchison Falls', tagline: 'The Nile squeezed through a canyon before exploding into Uganda’s savanna', heroImage: '/images/safaris/safari-nala-taita.jpg', country: 'Uganda', region: 'Northern Uganda',
    intro: 'Murchison Falls National Park is Uganda’s largest protected area and is defined by the Nile River forcing through a narrow gorge before dropping into the powerful falls. Boat trips, riverbank wildlife and broad savanna plains combine into one of East Africa’s most distinctive safari landscapes.',
    history: 'The park was gazetted in 1952 and is part of a wider protected landscape along the Victoria Nile. The falls and river corridor have been central landmarks in northern Uganda for generations and remain the park’s defining natural spectacle.',
    wildlifeHighlights: ['Hippos and Nile crocodiles', 'Elephants, giraffe and buffalo', 'Lion and other savanna predators', 'Nile boat safari and Murchison Falls viewpoint'],
    bestSeason: 'June–September and December–February are popular dry periods. Water levels and vegetation change through the year, so the falls and river scenery can look different across seasons.',
    faqs: [{ q: 'Is Murchison Falls only about the waterfall?', a: 'No. The game drives and Nile boat safari are major attractions, with strong opportunities for elephants, giraffe, buffalo, hippos and crocodiles.' }, { q: 'How does it fit into a Uganda trip?', a: 'It can be paired with chimpanzee or gorilla experiences for a broad Uganda itinerary combining savanna, river and rainforest.' }],
  },
  {
    slug: 'akagera', name: 'Akagera', tagline: 'Lakes, papyrus wetlands and a recovering Big Five ecosystem in Rwanda', heroImage: '/images/safaris/safari-nala-taita.jpg', country: 'Rwanda', region: 'Eastern Rwanda',
    intro: 'Akagera National Park is Rwanda’s savanna counterpoint to its mountain forests. Rolling plains, lakes, papyrus wetlands and woodland support elephants, buffalo, giraffe, zebra, antelope and a growing predator population. A boat safari on Lake Ihema adds a different perspective to the game drives.',
    history: 'Akagera was established in 1934 and later suffered severe wildlife losses during periods of conflict and displacement. Restoration and reintroduction programmes have helped rebuild the ecosystem, including the return of lions and black rhinos.',
    wildlifeHighlights: ['Big Five restoration landscape', 'Lake Ihema hippos and crocodiles', 'Giraffe, zebra, elephant and buffalo', 'Papyrus wetlands and rich birdlife'],
    bestSeason: 'June–September is generally drier and good for game viewing. March–May is wetter and greener, while October–February can be productive for birding and lush scenery.',
    faqs: [{ q: 'Can Akagera be combined with gorilla trekking?', a: 'Yes. A Rwanda itinerary can combine Akagera savanna with Volcanoes National Park gorilla or golden monkey experiences.' }, { q: 'Is Akagera good for a short safari?', a: 'Yes. Its compact road network and strong lake-and-savanna combination make it practical for two or three days.' }],
  },
];

export function getSafarisForDestination(slug: string) {
  return safaris.filter((s) => s.tabs.some((tab: SafariTab) => tab === slug));
}

export function getDestinationBySlug(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}
