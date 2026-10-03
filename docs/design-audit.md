# Bahari Asili Safaris — UI/UX Transformation Audit

## Direction
**COAST / BUSH EDITORIAL**

POV: A Kenyan travel journal where the Indian Ocean meets the savannah — quiet, tactile, editorial and rooted in place.

## Phase 0 baseline audit

### 1. Template typography
The current global system uses Poppins + Inter + Caveat. This creates a familiar marketing-template appearance and gives the brand little editorial identity.

### 2. Repeated card/grid grammar
Homepage content repeatedly resolves into rounded cards and equal grids. The current Popular Safaris uses a four-column card grid and Why uses a three-column feature pattern. This flattens hierarchy.

### 3. UI-first brand color treatment
Ocean, sand and orange are currently used as broad utility colors, with generic shadows/glows and gradient utilities. The new direction treats color as an environment: paper, ink, ocean, earth and a restrained sun accent.

### 4. Generic motion vocabulary
Existing CSS contains fade-up, fade-in, lift, glow and marquee patterns. These are useful utilities but should not become the visual language. Scroll motion needs to establish depth, crop, weight and editorial pacing.

### 5. Hero-to-page discontinuity
The homepage already has strong ingredients — cinematic media, booking, safari content, destinations, experiences and reviews — but the sections do not yet read as one editorial composition. The hero should establish the visual grammar that the rest of the page follows.

## Existing implementation assets to preserve

- Next.js App Router + TypeScript
- Existing booking and safari-builder workflows
- CMS and media functionality
- Authentication
- Multilingual infrastructure and eight locales
- Existing PDF generators
- Existing API routes
- Seasonal calendar
- Existing GSAP and Framer Motion dependencies

## Protected files / logic

Do not alter the established PDF rotation mathematics in `lib/pdf-stamp.ts`.

Do not redesign business logic in:
- `lib/i18n.ts`
- `LanguageFloatingSelector.tsx`
- `app/api/safari-builder/route.ts`
- invoice/payment-receipt/voucher/visa-itinerary generators

## Transformation sequence

0. Baseline + safety
1. Design tokens and foundation
2. Global shell
3. Hero
4. Homepage editorial architecture
5. Destinations
6. Experiences
7. Watamu/coast story
8. Why Bahari Asili
9. Safari builder
10. Travel Guide
11. Reviews
12. Team
13. Final CTA
14. Motion
15. Texture
16. Responsive reconstruction
17. Accessibility/performance
18. Functional regression
19. Visual QA
20. Production hardening
