# Bahari Asili Safaris — Coast / Bush Editorial Design System

## POV
A Kenyan travel journal where the Indian Ocean meets the savannah — quiet luxury, editorial typography, tactile photography and strong sense of place.

## Typography
- Display Serif: DM Serif Display
- Editorial Grotesk: Manrope
- Technical Mono: IBM Plex Mono
- Micro: 10px
- Caption/meta: 11–12px
- Body small: 14px
- Body: 17px
- Lead: 21px
- Section: 42px
- Display: 72px
- Hero: 96px
- Statement: 120px+
- Mobile display: 54–64px

Avoid Poppins, Inter and Roboto as primary brand typography.

## OKLCH palette
- Ink: oklch(20% 0.025 175)
- Paper: oklch(96% 0.018 82)
- Salt: oklch(99% 0.008 88)
- Ocean: oklch(43% 0.095 190)
- Earth: oklch(46% 0.075 65)
- Sun: oklch(72% 0.155 67)
- Stone: oklch(70% 0.025 75)

No gradients. Photography and material changes provide transitions.

## Grid
Desktop: 12 columns, 24px gutters, 5vw outer margin, 1440px max content width.
Mobile: 4 columns, 16px gutters, 20px outer margin.
Preferred editorial ratios: 5/7, 4/8, 7/5, 3/6/3, 2/7/3.
Use bleed and asymmetry deliberately.

## Radius
Default: 0px.
Photography: 0–4px.
Exceptional interactive object: 8px.
Pills only for functional tags.

## Borders
1px editorial rules. Borders explain structure; they should not turn every element into a card.

## Spacing
4, 8, 12, 20, 28, 40, 56, 72, 96, 128, 160, 200.
Major sections: 120–160px.
Major editorial transitions: 180–240px.

## Texture
Very subtle paper/film grain at approximately 0.025–0.05 opacity. Texture should remain subordinate to typography and photography.

## Photography
Prefer full-bleed, tall editorial, panoramic and deliberately cropped imagery. Prioritize people, guides, roads, coastline, wildlife in context, architecture, food and natural light.

## Motion
GSAP + ScrollTrigger owns scroll choreography: parallax, clipping, pinned storytelling, horizontal sequences and large type movement.
Motion/Framer Motion owns interface interactions: menus, modals, forms, hover states and UI state transitions.
Avoid universal fade-up animations.
Motion should communicate depth, weight, crop, discovery and physical response.

## Signature interaction language
- Hero: field-note reveal
- Safaris: editorial image displacement
- Destinations: geographic storytelling
- Experiences: horizontal journey
- Booking: progressive itinerary builder
- Travel Guide: magazine index

## Accessibility
Respect prefers-reduced-motion. Maintain semantic structure, keyboard focus, contrast, descriptive imagery, touch targets >=44px and content availability without motion.

## Component vocabulary
Prefer editorial concepts such as FieldNote, EditorialImage, DestinationStory, SafariEntry, JourneySequence, TravelJournalEntry, EditorialQuote and RouteMeta over generic Card/FeatureCard/GlassCard abstractions.
