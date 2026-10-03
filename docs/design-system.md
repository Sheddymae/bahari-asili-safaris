# Bahari Asili Safaris — Phase 1 Design System

## Direction
**Coast / Bush Editorial** — Indian Ocean meets savannah. Quiet, tactile, photographic, editorial.

## Typography
- **Display:** DM Serif Display — headlines, section statements, destination names.
- **Grotesk:** Manrope — body, navigation, controls, forms and utility UI.
- **Technical:** IBM Plex Mono — metadata, labels, dates, coordinates, editorial captions.
- Existing `font-poppins`, `font-inter`, and `font-caveat` utility aliases remain as compatibility shims so Phase 1 does not break untouched components.

## Colour tokens
Primary tokens use OKLCH for predictable perceptual relationships:
- Ink: `oklch(22% 0.025 185)`
- Soft ink: `oklch(38% 0.025 185)`
- Ocean: `oklch(42% 0.085 190)`
- Deep ocean: `oklch(28% 0.055 195)`
- Sand: `oklch(95% 0.028 82)`
- Paper: `oklch(98.5% 0.012 82)`
- Safari orange: `oklch(67% 0.17 48)`
- Rule: `oklch(84% 0.018 82)`

No gradients are introduced by Phase 1.

## Layout
- Desktop foundation: 12-column editorial grid.
- Mobile foundation: 4-column grid.
- Existing section/container utilities remain available.
- Phase 1 does not restructure individual homepage sections.

## Shape
- Default radius: 2px.
- Small UI radius: 0px where appropriate.
- Larger media/card radii are capped rather than pill-shaped.
- Pills remain reserved for compact controls/status where already required.

## Elevation
Use restrained shadows for separation rather than floating/glass effects.
No global glow animation is introduced.

## Texture
Phase 1 defines the visual tokens only. Texture, grain and physicality are implemented in Phase 15.

## Motion
Phase 1 does not introduce a new motion system. Motion consolidation belongs to Phase 14.

## Compatibility
The following remain intentionally available:
- existing ocean/sand/safari Tailwind scales
- semantic HSL variables used by Radix/shadcn-style utilities
- legacy font utility names

## Phase 1 boundary
This phase changes the global design foundation only. It does **not** redesign the navbar, hero, homepage sections, destinations, experiences, builder, travel guide, reviews, team, CTA, CMS or booking flows.
