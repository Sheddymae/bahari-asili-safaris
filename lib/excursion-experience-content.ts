export type ExcursionExperience = {
  story: string;
  whatToExpect: string[];
  goodToKnow: string[];
};

/**
 * Rich editorial content for excursion detail pages.
 * This complements the operational catalogue data without changing prices,
 * durations, inclusions, or other booking-critical fields.
 */
export const excursionExperienceContent: Record<string, ExcursionExperience> = {
  'safari-blu-mida': {
    story: 'Safari Blu on Mida Creek is a journey into one of the most distinctive coastal landscapes around Watamu. Mida Creek is a tidal creek system of mangroves, channels, mudflats and shallow marine habitats connected to the Indian Ocean. The experience is about slowing down and seeing the coast from the water: traditional coastal boats, changing tides, birdlife, mangrove scenery and the wide Indian Ocean horizon. For many guests, the memorable part is not a single activity but the rhythm of the day, moving between open water, sheltered creek scenery and quiet places to stop and enjoy the coast.',
    whatToExpect: [
      'Meet your local crew and receive a short briefing before setting out from the Watamu area.',
      'Travel across the coastal waters and into the Mida Creek landscape, with time to appreciate the changing scenery and tidal channels.',
      'Look for coastal and marine wildlife while your guide explains the environment and local way of life around the creek.',
      'Depending on sea, tide and weather conditions, enjoy time for swimming, a sandbank stop or another planned coastal activity.',
      'Return at a relaxed pace, with opportunities for photographs and questions about the places you have visited.'
    ],
    goodToKnow: [
      'Mida Creek is strongly influenced by tides, weather and sea conditions, so the exact route and timing can vary.',
      'Wildlife sightings are natural encounters and cannot be guaranteed.',
      'Bring sun protection, swimwear, a hat, sunglasses and a waterproof bag for valuables.',
      'Guests who prefer a slower day can tell the guide in advance so the pace can be adapted where practical.'
    ]
  },
  'safari-blu-sardegna': {
    story: 'This Safari Blu experience takes the day offshore toward Sardegna 2, combining the freedom of the Indian Ocean with the relaxed atmosphere of a coastal island outing. The sea journey is part of the adventure: changing water colours, sea breeze, coastal views and time away from the mainland create a completely different perspective of Kenya’s coast.',
    whatToExpect: [
      'Meet the crew, receive a safety briefing and begin the boat journey from the coast.',
      'Enjoy the changing seascape as you travel toward the island area, with time for photography and observation.',
      'Explore the shoreline and surrounding waters at a pace suited to the day’s sea conditions.',
      'Enjoy time to swim or relax where conditions and the planned excursion allow.',
      'Return to the mainland with time to enjoy the ocean journey rather than rushing between activities.'
    ],
    goodToKnow: [
      'Island and offshore routes depend on tides, weather and sea conditions.',
      'Bring swimwear, sunscreen, a hat and a waterproof pouch for phones and cameras.',
      'Boat travel can be affected by sea conditions, so guests should be comfortable spending time on the water.'
    ]
  },
  'isola-amore': {
    story: 'Isola dell’Amore, the Island of Love, is designed around the simple pleasure of escaping to a quieter coastal setting. The appeal is the contrast between the movement of the ocean and the stillness of an island stop, making it a natural choice for couples, families and travellers looking for photographs and unhurried time by the sea.',
    whatToExpect: [
      'Travel by boat toward the island with coastal views along the way.',
      'Spend time exploring the shoreline and enjoying the surrounding seascape.',
      'Relax, swim or take photographs according to the conditions and the agreed programme.',
      'Enjoy time away from busy resort areas before beginning the return journey.',
      'Ask your guide about local coastal landmarks and the marine environment around the island.'
    ],
    goodToKnow: [
      'The character of the island stop changes with tides and sea conditions.',
      'Wear comfortable footwear suitable for sand and bring sun protection.',
      'The experience is particularly suited to guests who enjoy scenic, relaxed coastal days.'
    ]
  },
  'robinson-golden': {
    story: 'Robinson Island and Golden Beach combine the romance of an island escape with the open coastal scenery of Kenya’s Indian Ocean shoreline. It is a day for sand, sea, photographs and time to simply enjoy the coast without filling every moment with scheduled activities.',
    whatToExpect: [
      'Set out with your local crew and enjoy the boat journey along the coast.',
      'Arrive at the island and explore the beach and surrounding coastal landscape.',
      'Enjoy time for swimming, relaxing and photography where conditions permit.',
      'Listen to local stories and observations about the coastline and marine environment.',
      'Return after a relaxed island stay and enjoy the coastal scenery on the way back.'
    ],
    goodToKnow: [
      'Beach conditions and access can change with tides.',
      'Bring swimwear, sunscreen, a hat and water-resistant protection for valuables.',
      'This is a relaxed coastal experience rather than a high-intensity excursion.'
    ]
  },
  'mangrovie-canoa': {
    story: 'A canoe journey through the mangroves of Mida Creek reveals a quieter side of the Kenyan coast. Mangroves form an important coastal ecosystem, providing shelter and nursery habitat for marine life while protecting shorelines. Moving quietly through narrow waterways gives guests a chance to notice details that can be missed from a larger boat: roots rising from the water, birds moving through the canopy and the changing colours of the tidal creek.',
    whatToExpect: [
      'Meet your local guide and receive instructions for moving safely through the mangrove channels.',
      'Paddle into quieter waterways where the scenery changes with the tide and light.',
      'Look for birds, crabs, fish and other signs of life around the mangrove roots.',
      'Learn how mangroves support coastal ecosystems and local livelihoods.',
      'Return through the creek while enjoying the calm pace and natural surroundings.'
    ],
    goodToKnow: [
      'Tide level and weather affect the route and paddling conditions.',
      'Wear clothes and footwear that can get wet or muddy.',
      'The experience is conservation-oriented and should be enjoyed without disturbing wildlife or vegetation.'
    ]
  },
  'gede-ruins': {
    story: 'Gede is one of the most important archaeological sites on the Kenyan coast, preserving the remains of a Swahili settlement that flourished centuries ago. Walking among its walls, mosques, houses and forested ruins gives the visit a distinctive atmosphere: history is not presented behind glass but encountered directly among coral-stone structures and mature coastal vegetation. A local guide helps connect the visible ruins with the wider story of Swahili trade and coastal life.',
    whatToExpect: [
      'Travel to the Gede archaeological site and meet your guide.',
      'Walk through the ruins and see surviving coral-stone structures, walls and architectural remains.',
      'Hear about the settlement, Swahili coastal society and the role of Indian Ocean trade.',
      'Take time to photograph the distinctive combination of archaeology and coastal forest.',
      'Leave with a clearer understanding of how historic communities shaped the Kenyan coast.'
    ],
    goodToKnow: [
      'Expect walking on uneven ground and under warm conditions.',
      'Comfortable shoes, water, a hat and sun protection are recommended.',
      'Respect the archaeological site by staying on appropriate paths and following guide instructions.'
    ]
  },
  'marafa-kitchen': {
    story: 'Marafa’s dramatic sandstone landscape is known locally as Hell’s Kitchen, a place where erosion has carved deep channels, cliffs and unusual rock formations into the terrain. The colours and shapes change with the position of the sun, creating one of the coast’s most striking inland landscapes. The visit is as much about geology and local stories as it is about scenery.',
    whatToExpect: [
      'Travel inland from the coast toward the Marafa landscape.',
      'Walk to viewpoints overlooking the deeply eroded sandstone formations.',
      'Hear local stories and explanations about the landscape and its formation.',
      'Photograph the cliffs, colours and changing shadows across the formations.',
      'Take time to appreciate the contrast between the coastal environment and this dry, sculpted interior landscape.'
    ],
    goodToKnow: [
      'The terrain can be hot and uneven, especially around exposed viewpoints.',
      'Closed, comfortable shoes, water, a hat and sunscreen are recommended.',
      'The strongest colours and shadows can vary with weather and time of day.'
    ]
  },
  'malindi-town': {
    story: 'Malindi is a coastal town shaped by centuries of interaction across the Indian Ocean. Swahili culture, Arab and Portuguese influences, fishing traditions and modern Kenyan coastal life meet within the town and its surrounding landmarks. A guided visit gives guests more than a collection of sights: it provides context for understanding why Malindi became such an important coastal centre.',
    whatToExpect: [
      'Explore selected landmarks and neighbourhoods with a local guide.',
      'Learn about Malindi’s Swahili and Indian Ocean history.',
      'See the everyday rhythm of the town, including coastal commerce and local life.',
      'Have opportunities for photographs and questions about the places visited.',
      'Depending on the programme, combine cultural sightseeing with time near the coast or local markets.'
    ],
    goodToKnow: [
      'Dress respectfully when visiting religious or culturally important places.',
      'Comfortable walking shoes are recommended.',
      'Your guide can help explain local customs and advise where photography is appropriate.'
    ]
  },
  'dabaso-village': {
    story: 'A visit to Dabaso offers a closer look at everyday life on Kenya’s coast away from the resort environment. The village is closely connected to the surrounding creek and mangrove landscape, and a guided visit can introduce guests to local traditions, community life and the relationship between people and the coastal environment.',
    whatToExpect: [
      'Meet local hosts and your guide before exploring the village.',
      'Learn about daily life, local traditions and livelihoods connected to the coast.',
      'Discover how the community interacts with the surrounding mangrove and creek environment.',
      'Ask questions and take photographs respectfully where permission is given.',
      'Leave with a more personal understanding of the people and places behind Kenya’s coastal tourism.'
    ],
    goodToKnow: [
      'This is a community experience, so respectful behaviour and appropriate clothing are important.',
      'Photography should always follow local guidance and permission.',
      'The experience may vary according to community activities and the day of the visit.'
    ]
  },
  'dolphin-turtle-swim': {
    story: 'The Indian Ocean around Watamu is home to a rich marine environment, making the water itself part of the attraction. This experience focuses on being in that environment rather than simply viewing it from shore, with opportunities for swimming and observing marine life when conditions are suitable.',
    whatToExpect: [
      'Meet the crew and receive a safety briefing before entering the water.',
      'Travel to suitable marine areas according to sea conditions and the day’s programme.',
      'Look for marine life while keeping a respectful distance from wild animals.',
      'Enjoy swimming or snorkelling where conditions are considered safe.',
      'Return with time to discuss sightings and the importance of protecting the marine environment.'
    ],
    goodToKnow: [
      'Dolphin and turtle sightings are wild encounters and cannot be guaranteed.',
      'Sea conditions determine whether swimming or snorkelling is suitable on the day.',
      'Do not touch, chase or feed marine wildlife.',
      'Guests should be comfortable in the water and follow all crew safety instructions.'
    ]
  },
  'deep-sea-fishing': {
    story: 'Deep-sea fishing takes you beyond the sheltered coastal waters into the open Indian Ocean, where the experience becomes as much about the sea as the catch. Early starts, changing weather, offshore scenery and the anticipation of a strike create a very different rhythm from a conventional sightseeing excursion.',
    whatToExpect: [
      'Meet the crew and prepare the equipment before heading offshore.',
      'Travel into deeper water while the crew explains the fishing setup and safety procedures.',
      'Spend time fishing with guidance from the experienced crew.',
      'Enjoy the open-ocean scenery and the atmosphere of a day at sea.',
      'Return according to the agreed programme and prevailing sea conditions.'
    ],
    goodToKnow: [
      'Fishing results depend on season, weather, sea conditions and natural fish movement.',
      'Bring sun protection and consider appropriate medication if you are prone to seasickness.',
      'The boat crew’s instructions should always be followed while offshore.'
    ]
  },
  'arabuko-sokoke-forest': {
    story: 'Arabuko-Sokoke is one of the most important remaining coastal forests in East Africa and is especially valued for its biodiversity. A guided walk changes the way you experience the forest: instead of simply passing through trees, you learn to notice bird calls, tracks, insects, plants and the subtle movement of wildlife around you.',
    whatToExpect: [
      'Meet your forest guide and receive a briefing before entering the forest.',
      'Walk along suitable trails while learning about the forest ecosystem.',
      'Listen for birds and look for wildlife, insects and distinctive coastal forest plants.',
      'Learn why the forest is important for biodiversity and conservation.',
      'Finish the walk with time for questions and photographs where appropriate.'
    ],
    goodToKnow: [
      'Wildlife sightings are never guaranteed and patience is part of the experience.',
      'Wear closed, comfortable shoes, long lightweight clothing and insect repellent.',
      'Avoid loud noise and do not remove plants, insects or other natural material from the forest.'
    ]
  },
  'kitesurfing-lesson': {
    story: 'Kenya’s coast offers warm water, open beaches and seasonal winds that make it a natural setting for learning kitesurfing. A first lesson is not about immediately mastering the sport. It is about understanding the wind, equipment and safety before gradually learning how to control the kite and move confidently on the water.',
    whatToExpect: [
      'Meet your instructor and learn the basic principles of wind direction and kite safety.',
      'Become familiar with the equipment and how it is prepared and controlled.',
      'Practise kite handling under instructor supervision.',
      'Progress to water-based exercises according to your ability and the conditions.',
      'Finish with practical advice for continuing to develop your skills safely.'
    ],
    goodToKnow: [
      'Lessons depend on suitable wind, weather and water conditions.',
      'Follow the instructor’s safety instructions at all times.',
      'The pace of progression differs between beginners and experienced water-sports guests.'
    ]
  },
  'sunset-dhow-cruise': {
    story: 'A dhow cruise captures one of the most timeless images of the Swahili coast: a traditional sailing vessel moving across warm evening water as the sun drops toward the horizon. The experience is deliberately unhurried, allowing guests to watch the coastline change colour and enjoy the sea at the quietest part of the day.',
    whatToExpect: [
      'Board the dhow and settle in before the cruise begins.',
      'Sail along the coast while enjoying views of beaches, islands and open water.',
      'Watch the changing colours of the sky and sea as sunset approaches.',
      'Enjoy time for conversation, photographs and a relaxed coastal atmosphere.',
      'Return after sunset according to the agreed route and sea conditions.'
    ],
    goodToKnow: [
      'Sunset timing and visibility depend on weather conditions.',
      'Bring a light layer for the breeze and protect cameras and phones from splashes.',
      'The cruise is designed as a relaxed experience rather than a fast sightseeing trip.'
    ]
  },
  'falconry-of-kenya': {
    story: 'Falconry offers a close look at the relationship between people and trained birds of prey. Rather than simply watching a display, guests can learn about the birds, their behaviour, training and the traditions surrounding the practice. It is an opportunity to see these powerful birds at close range while learning why responsible handling matters.',
    whatToExpect: [
      'Meet the handlers and learn about the birds featured in the experience.',
      'Hear how the birds are cared for, trained and handled.',
      'Observe demonstrations of natural behaviour and controlled flight where conditions permit.',
      'Learn about the differences between the birds and their hunting adaptations.',
      'Have time for questions and photography according to the handler’s guidance.'
    ],
    goodToKnow: [
      'The welfare and safety of the birds take priority throughout the experience.',
      'Follow the handler’s instructions before approaching or photographing the birds.',
      'Behaviour and demonstrations can vary according to weather and the birds’ condition.'
    ]
  },
  'mambrui-sand-dunes': {
    story: 'The Mambrui sand dunes reveal a different side of the Kenyan coast, where wind and sand create a constantly changing landscape. The dunes rise above the surrounding coastal terrain and provide dramatic views, especially when the low sun creates long shadows across the ridges.',
    whatToExpect: [
      'Travel toward Mambrui and walk into the dune landscape with your guide.',
      'Climb selected dunes at a comfortable pace and enjoy wide coastal views.',
      'Learn about the relationship between wind, sand and the surrounding environment.',
      'Take photographs from different viewpoints as the light changes.',
      'Return after enjoying time in the dunes and surrounding coastal scenery.'
    ],
    goodToKnow: [
      'Walking on soft sand can be physically demanding, especially in midday heat.',
      'Bring water, sunscreen, a hat and comfortable footwear.',
      'The route and access can change with weather and local conditions.'
    ]
  },
  'turtle-conservation': {
    story: 'Sea turtle conservation turns a beach visit into an opportunity to understand one of the coast’s most important marine conservation stories. Turtles depend on healthy beaches and oceans, while conservation teams and communities work to reduce threats and protect nesting and marine habitats. The experience connects the visitor directly with that work and the challenges of protecting wildlife on a busy coastline.',
    whatToExpect: [
      'Meet the conservation team or local guide and learn about the programme.',
      'Discover the life cycle of sea turtles and the challenges they face.',
      'Learn how local conservation work supports nesting beaches and marine habitats.',
      'See conservation activities that are operating on the day of your visit.',
      'Ask questions about responsible tourism and how visitors can support marine conservation.'
    ],
    goodToKnow: [
      'Conservation activities depend on the season and what is happening at the centre on the day.',
      'Wild turtles and nests must never be touched or disturbed.',
      'Photography should follow the conservation team’s instructions, especially around nesting turtles or hatchlings.'
    ]
  }
};
