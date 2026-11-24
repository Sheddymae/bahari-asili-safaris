export interface GuideTable {
  caption: string;
  head: string[];
  rows: string[][];
}

export interface GuideSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: GuideTable;
}

export interface HubGuide {
  slug: string;
  title: string;
  h1: string;
  description: string;
  answerCapsule: string;
  lastReviewedAt?: string;
  lastReviewedBy?: string;
  intro: string[];
  sections: GuideSection[];
  /** Destination slugs used to surface relevant programs on the guide page. */
  destinationSlugs: string[];
}


export const hubGuides: HubGuide[] = [
  {
    slug: 'kenya-safari-costs',
    title: 'What a Kenya Safari Costs',
    h1: 'What does a Kenya safari cost?',
    description:
      'How Kenya safari prices are built, what changes the number, what is normally included and how to compare quotes from Watamu, Tsavo, Amboseli and the Masai Mara.',
    answerCapsule:
      'A Kenya safari is priced per trip, not per seat. The number depends on the number of days and park fees, the lodge tier, how many travellers share the vehicle and guide, the season and children’s ages. Bahari Asili quotes each itinerary individually and sends a written breakdown before you commit.',
    intro: [
      'Kenya safari pricing looks opaque because almost every operator quotes privately. Two travellers can compare the same four-day Tsavo itinerary and see very different totals, not because one is a bargain, but because the two quotes contain different lodges, different park-fee assumptions and different vehicle arrangements.',
      'This page explains how the price is put together, so you can read a quote properly and compare like with like. It deliberately does not publish a from-price: Bahari Asili has not reviewed a fixed price list for publication, and an invented number would be worse than no number.',
    ],
    sections: [
      {
        heading: 'Why is there no fixed from-price on this site?',
        paragraphs: [
          'Park fees are set by the Kenya Wildlife Service and change by park and by season. Lodge and camp rates also move between high and green season, and a private safari shares one vehicle and guide across the group. A single headline figure would be wrong for most travellers.',
          'What you can ask for, and should expect, is a dated quote with a line-by-line breakdown: accommodation, park fees, guide and vehicle, meals as listed, and any optional extras. That is the document to compare against another operator.',
        ],
      },
      {
        heading: 'What drives the price of a Kenya safari?',
        bullets: [
          'Length: every extra night adds accommodation, meals, park fees and a guide/vehicle day.',
          'Park fees: Tsavo, Amboseli, the Masai Mara and the Rift Valley parks each have their own fee, and conservancies can add a bed-night levy.',
          'Accommodation tier: a simple tented camp and a luxury lodge in the same park can differ by several times per night.',
          'Group size: a private 4x4 with guide and fuel costs roughly the same whether two or six people travel, so the per-person share falls as the group grows.',
          'Season: July–October and the Christmas period are the most expensive; April–May and November are normally the cheapest because of the long and short rains.',
          'Children: child rates and park-fee concessions depend on age and on each lodge’s policy, so ages need to be in the request.',
          'Extras: hot-air balloon flights, domestic flights (the Mara is usually reached by air from the coast), extra park days and single-room supplements.',
        ],
      },
      {
        heading: 'What is normally included, and what is not?',
        paragraphs: [
          'Bahari Asili’s standard safaris include KWS park entry fees, a 4x4 vehicle with pop-up roof, an English- and Italian-speaking driver-guide, full board, drinking water on game drives, accommodation as per the itinerary, and hotel or airport pickup and drop-off.',
          'They normally exclude international and domestic flights, visa and eTA fees, travel and medical insurance, tips, alcoholic and premium drinks, personal expenses and optional activities. Each program page repeats its own inclusion list so there is no ambiguity.',
        ],
      },
      {
        heading: 'When is a Kenya safari cheapest?',
        table: {
          caption: 'How the season usually affects price',
          head: ['Period', 'Demand', 'What it means for value'],
          rows: [
            ['July–October', 'Peak', 'Best dry-season viewing and the migration; highest lodge rates.'],
            ['Christmas and New Year', 'Peak', 'Coast and parks are busy; book early.'],
            ['January–February', 'High', 'Dry, clear and excellent for Amboseli and Tsavo; strong demand.'],
            ['March', 'Shoulder', 'Often good value until the long rains settle in.'],
            ['April–May', 'Low', 'Long rains; many camps close, tracks are muddy, rates are lowest.'],
            ['June', 'Shoulder', 'Rains ease and the dry season begins; good value.'],
            ['November', 'Low', 'Short rains; green, quiet and cheaper, with afternoon storms.'],
          ],
        },
      },
      {
        heading: 'How do I compare two safari quotes?',
        bullets: [
          'Check the lodge names, not just the lodge category: the same “mid-range” label can mean very different rooms.',
          'Check whether park fees are included and at which rate; this is a large line item and a common omission.',
          'Check the vehicle and guide arrangement: private vehicle, shared vehicle, or a driver-guide who also acts as spotter.',
          'Check meals: full board, half board or bed and breakfast changes the real cost of the trip.',
          'Check what happens if a lodge is unavailable — is there a named substitute at the same tier?',
          'Ask what the single supplement is if you are travelling alone, and what the child policy is if you are travelling with family.',
        ],
      },
      {
        heading: 'How to get an accurate safari quote',
        paragraphs: [
          'Bahari Asili quotes each itinerary individually, based on travel dates, route, accommodation and group size. Ask for a dated written quote with an itemised breakdown before you commit. The current website price basis is quoted per trip; no fixed from-price is published.',
        ],
      },
    ],
    destinationSlugs: ['tsavo', 'amboseli', 'mara', 'taita'],
  },
  {
    slug: 'best-time-for-a-kenya-safari',
    title: 'Best Time for a Kenya Safari or Coast Holiday',
    h1: 'When is the best time for a Kenya safari or coast holiday?',
    description:
      'Kenya’s two rainy seasons and two dry seasons, month by month, and how they affect safari viewing in Tsavo, Amboseli and the Mara plus beach time in Watamu.',
    answerCapsule:
      'Kenya has two dry seasons and two rainy seasons. June–October and January–February are the most reliable for safari, when animals gather near water. The long rains fall around March–May and the short rains around October–December, heaviest in November. The coast is best from December to March.',
    intro: [
      'Kenya sits on the equator, so the year turns on rain rather than temperature. The Kenya Meteorological Department describes a long-rains season around March–May and a short-rains season around October–December, with dry spells from June to October and January to February.',
      'That national pattern is a starting point, not a guarantee. The coast, the highlands and the Mara each behave differently, and the rains start and stop on different dates each year.',
    ],
    sections: [
      {
        heading: 'Month by month in Kenya',
        table: {
          caption: 'General season pattern for safari and coast',
          head: ['Month', 'Safari (Tsavo, Amboseli, Mara)', 'Kenya coast (Watamu)'],
          rows: [
            ['January', 'Hot and dry; strong viewing, clear Kilimanjaro mornings.', 'Hot, dry and calm; clearest water of the year.'],
            ['February', 'Dry and clear; excellent elephant viewing in Amboseli.', 'Peak beach month; calm sea and good visibility.'],
            ['March', 'Dry early, then the long rains may begin.', 'Hot and humid; sea calm until the rains arrive.'],
            ['April', 'Long rains; muddy tracks and some camps closed.', 'Long rains, wind and reduced underwater visibility.'],
            ['May', 'Rains ease late in the month; green and quiet.', 'Wettest month; boat trips weather-dependent.'],
            ['June', 'Dry season begins; cool mornings and good sightings.', 'Drying out; calmer sea and improving visibility.'],
            ['July', 'Peak dry season; migration normally in the Mara.', 'Cool, dry and calm; excellent marine conditions.'],
            ['August', 'Prime viewing; river crossings most likely.', 'Dry and calm with good reef visibility.'],
            ['September', 'Dry and reliable; strong predator viewing.', 'Dry and calm; excellent for boat trips.'],
            ['October', 'Dry until the short rains arrive late in the month.', 'Calm and dry for most of the month.'],
            ['November', 'Short rains; green, quiet and lower rates.', 'Short rains; heavy showers and choppier sea.'],
            ['December', 'Drying out; good viewing and holiday demand.', 'Hot, dry and calm; excellent beach conditions.'],
          ],
        },
        paragraphs: [
          'Sources: the Kenya Meteorological Department’s two rainy seasons, and KWS’s low season around the long rains. Dates shift from year to year, and one national calendar never fits every park.',
        ],
      },
      {
        heading: 'What is the best time for a first safari from Watamu?',
        paragraphs: [
          'For a short safari from the coast, January–February and June–October are the most reliable. Tsavo and Amboseli are close enough to reach by road, and the dry months concentrate wildlife around waterholes and swamps.',
          'June to October is cooler and dustier, with short grass that makes animals easier to see. January and February are hotter, but Kilimanjaro is often clear early in the morning and the light is excellent for photography.',
        ],
      },
      {
        heading: 'When is the Great Migration in the Masai Mara?',
        paragraphs: [
          'The wildebeest migration is normally in the Masai Mara from around July to October, with river crossings most likely in August and September. The exact arrival depends on rainfall, and no crossing can be promised on a given date.',
          'The Mara has resident lion, leopard, cheetah, elephant and buffalo all year. If the migration is the main reason for the trip, book July–October and allow several nights in the reserve.',
        ],
      },
      {
        heading: 'What is the best time for a Kenya coast holiday?',
        paragraphs: [
          'The coast is at its best from December to March: hot, dry, calm and clear. June to October is cooler and also good, with calm sea and comfortable evenings. April and May bring the long rains, wind and reduced underwater visibility, and November brings the short rains.',
          'Marine excursions are tide- and weather-dependent at any time of year. Morning departures generally offer the calmest water.',
        ],
      },
      {
        heading: 'Does the green season make sense?',
        paragraphs: [
          'Yes, for some travellers. April–May and November are quieter, greener and cheaper. Wildlife is more dispersed and some tracks are difficult, but the light is beautiful, birdlife is at its best and you will share viewpoints with far fewer vehicles.',
          'If your dates are fixed in the rains, choose parks with good all-weather access and build in flexibility rather than promising a fixed itinerary.',
        ],
      },
    ],
    destinationSlugs: ['tsavo', 'amboseli', 'mara', 'taita'],
  },
  {
    slug: 'kenya-safari-with-kids-and-seniors',
    title: 'Kenya Safari with Children or Older Travellers',
    h1: 'Is a Kenya safari suitable for children, older travellers or guests with limited mobility?',
    description:
      'What to check before booking a Kenya safari with young children, teenagers, older parents or a guest with limited mobility, including driving days, vehicle access, malaria and lodge layout.',
    answerCapsule:
      'Most children over about six and most older travellers in reasonable health manage a short Kenya safari well, because game viewing happens seated in the vehicle. The real constraints are long driving days, the height of the 4x4 step, malaria precautions and lodge layout. Ask for those four things to be checked before booking.',
    intro: [
      'A safari is more accessible than it looks: you spend most of the day seated in a vehicle, and lodges are used to hosting families and older guests. The difficulties are practical, not adventurous — a long transfer, a high step into a 4x4, a room a five-minute walk from the restaurant, or a child who is bored by day three.',
      'This page sets out what actually matters, and what Bahari Asili can and cannot yet confirm. Where a policy has not been published, it says so instead of guessing.',
    ],
    sections: [
      {
        heading: 'Is a safari suitable for young children?',
        paragraphs: [
          'Short safaris — two to four days in Tsavo, Amboseli or Taita Hills — generally work better for families than a seven- or eight-day circuit. Fewer park transfers mean fewer long days in the vehicle, and a lodge with a pool gives children something to do in the middle of the day.',
          'Game drives are mostly seated, and children usually enjoy spotting animals with a guide. The honest constraints are early starts, heat, long transfers between parks and the requirement to stay in the vehicle around wildlife.',
        ],
        bullets: [
          'Ask for the minimum-age policy in writing: it is not published for individual programs on this site.',
          'Request a child or booster seat before booking; it is not standard equipment.',
          'Ask for realistic driving times for each day, not just distances.',
          'Choose a lodge with a pool and family or connecting rooms where possible.',
        ],
      },
      {
        heading: 'Is a safari suitable for older travellers?',
        paragraphs: [
          'Many guests in their seventies do these safaris comfortably. The most important questions are how far they can walk unaided, whether they can manage a high vehicle step, and whether they need a ground-floor room.',
          'A private safari is easier than a group departure because the pace can be adjusted: leave later, stop more often, skip an afternoon drive. Tell the team at quote stage so the itinerary and vehicle are planned around it.',
        ],
        bullets: [
          'Vehicle step height varies; ask for a step stool to be confirmed for your dates.',
          'Some lodges have rooms a short walk from the main area, and not all advertise step-free access.',
          'Long transfer days are the main source of fatigue; splitting a long route with an extra night usually helps more than any other change.',
          'Carry medication in hand luggage and tell the guide where it is.',
        ],
      },
      {
        heading: 'What about malaria and health for children and older guests?',
        paragraphs: [
          'The CDC advises malaria prophylaxis for travellers to Kenya below 2,500 m, including the game parks. Children and older travellers should discuss the choice of medicine with a doctor, because dosing and suitability differ.',
          'Yellow-fever vaccination is recommended from nine months of age for Tsavo, the Mara and Nakuru. Kenya can require proof of vaccination if you arrive from a country with yellow-fever risk. Confirm both with a travel clinic and the official Kenya eTA portal.',
        ],
      },
      {
        heading: 'What should we check before paying a deposit?',
        table: {
          caption: 'Pre-booking checklist for families and older guests',
          head: ['Check', 'Why it matters'],
          rows: [
            ['Minimum age for the program', 'Not published per program; needs written confirmation.'],
            ['Child seat or booster', 'Not standard equipment; must be requested.'],
            ['Driving time per day', 'The main limit for young children and older guests.'],
            ['Vehicle step height and step stool', 'Determines whether boarding is manageable.'],
            ['Room location and bathroom', 'Ground floor, walk-in shower, distance from main area.'],
            ['Malaria and vaccination plan', 'Needs a doctor’s advice well before departure.'],
            ['Insurance cover', 'Must cover medical treatment and evacuation in remote areas.'],
          ],
        },
      },
      {
        heading: 'What should be confirmed before booking?',
        paragraphs: [
          'Before booking, ask the team to confirm the minimum age, child-seat availability, approximate driving time for each day, vehicle step height and the room access details at your selected lodge. These details are not yet published for each individual program, so they should be confirmed in writing for your dates.',
        ],
      },
    ],
    destinationSlugs: ['tsavo', 'amboseli', 'taita'],
  },
  {
    slug: 'kenya-safari-packing-list',
    title: 'Kenya Safari Packing List',
    h1: 'What should I pack for a Kenya safari?',
    description:
      'A practical Kenya safari packing list by category: clothing colours and layers, footwear, sun and insect protection, documents, medication, camera gear, power adapters and what not to bring.',
    answerCapsule:
      'Pack light neutral-coloured layers for hot days and cool early mornings, closed-toe shoes, high-factor sunscreen, a DEET-based repellent, a hat, your medication, binoculars, a camera with spare batteries and an English Type G adapter. Use a soft bag rather than a hard case, and leave drones at home.',
    intro: [
      'Safari packing is simpler than most lists suggest. You need fewer clothes than you think, because lodges offer same-day laundry, and more sun and insect protection than you think, because game drives happen at the hottest and buggiest hours.',
      'This list is written for a Kenya safari from Watamu, including Tsavo, Amboseli, Taita Hills, the Rift Valley and the Masai Mara. Each program page repeats the same list, adapted to its parks and season.',
    ],
    sections: [
      {
        heading: 'Clothing: colours, layers and quantities',
        bullets: [
          'Neutral colours — khaki, olive, sand, grey. Bright white and dark blue attract tsetse flies in some areas, and neon stands out on a game drive.',
          'Light long-sleeved shirts and trousers for sun and evening insects.',
          'A warm fleece or light down layer: mornings at 6am are cold, especially in the highlands and the Mara.',
          'A wide-brimmed hat and sunglasses.',
          'Swimwear and flip-flops if your lodge has a pool.',
          'Three or four days of clothes is enough; laundry is usually available.',
          'Avoid camouflage-pattern clothing, which is restricted in some countries and unnecessary here.',
        ],
      },
      {
        heading: 'Footwear',
        bullets: [
          'Comfortable closed-toe shoes or trainers for game drives and short walks.',
          'Sandals or flip-flops for the lodge and pool.',
          'Sturdy shoes if your itinerary includes a forest walk, gorge or ruin visit.',
        ],
      },
      {
        heading: 'Sun and insect protection',
        bullets: [
          'High-factor sunscreen (SPF 50+), reapplied through the day.',
          'Insect repellent containing 20% or more DEET.',
          'Long sleeves and trousers after dusk, when mosquitoes are most active.',
          'Lip balm with sun protection.',
          'A mosquito net is normally provided by the lodge; check if you are sensitive.',
        ],
      },
      {
        heading: 'Documents and money',
        bullets: [
          'Passport with at least six months’ validity, and your Kenya eTA approval.',
          'Yellow-fever certificate if vaccinated, especially if you arrive from a risk country.',
          'Travel insurance policy number and emergency contact, printed and saved offline.',
          'Copies of your itinerary, booking confirmation and passport photo page.',
          'Some Kenyan shillings for tips and small purchases; US dollars are widely accepted for park fees and larger items.',
          'A card for lodge extras, with a backup.',
        ],
      },
      {
        heading: 'Health and medication',
        bullets: [
          'Malaria tablets prescribed by your doctor, with the full course.',
          'Personal medication in original packaging, in hand luggage.',
          'A small first-aid kit: plasters, rehydration sachets, painkillers, antiseptic.',
          'Hand sanitiser and wet wipes.',
          'Glasses or contact lenses plus a spare pair.',
        ],
      },
      {
        heading: 'Camera, optics and power',
        bullets: [
          'Binoculars — 7x50 or 10x42 are a good compromise.',
          'Camera with a longer lens if you have one, plus spare batteries and memory cards.',
          'A dust-proof bag or cloth; the dry season is dusty.',
          'A small torch or headlamp.',
          'English three-pin (Type G) plug adapter; Kenya uses 240V.',
          'A power bank for long game drives.',
        ],
      },
      {
        heading: 'What not to bring',
        bullets: [
          'Drones — prohibited in Kenya’s national parks and reserves.',
          'Hard suitcases — soft bags fit the vehicle much better.',
          'Heavy formal clothing, which you will not use.',
          'Plastic bags — Kenya restricts single-use plastic carrier bags.',
          'Anything you would be upset to lose; leave valuables at home.',
        ],
      },
    ],
    destinationSlugs: ['tsavo', 'amboseli', 'mara', 'taita'],
  },
];

export function getHubGuide(slug: string): HubGuide | undefined {
  return hubGuides.find((guide) => guide.slug === slug);
}
