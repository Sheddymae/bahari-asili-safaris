# Bahari Asili Safaris — Phase 0 Design & Engineering Baseline

**Direction:** Coast / Bush Editorial  
**Baseline branch:** `main`  
**Phase branch:** `feat/coast-bush-editorial-phase-0`  
**Scope:** Audit only. No customer-facing redesign or feature refactor belongs in Phase 0.

## 1. Objective

Establish a safe, reviewable baseline before implementing the Coast / Bush Editorial transformation. Phase 0 records the current architecture, visual system, interaction risks, protected functionality, and acceptance gates.

The implementation principle for Phases 1–20 is:

> Preserve business functionality; change presentation and structure deliberately, one phase at a time.

## 2. Current application baseline

The repository is a Next.js App Router application using TypeScript and Tailwind CSS. The package manifest also confirms Framer Motion and GSAP are already installed, alongside Supabase, jsPDF, Lucide, React Hook Form, date-fns and related UI/runtime dependencies.

Primary homepage composition in `app/page.tsx`:

1. Structured data
2. Global navigation
3. Hero / booking entry
4. Intro
5. Popular safaris
6. From Watamu
7. Coast
8. Why Bahari Asili
9. Safari Builder promotion
10. How to book
11. Reviews
12. Team
13. Final CTA
14. Footer
15. Booking modal
16. Hero booking modal

The homepage also has dynamic imports for several sections and retains query-driven booking behavior.

## 3. Existing visual-system findings

### Typography
The baseline stylesheet uses Poppins for headings, Inter for body/UI, and Caveat as an additional display face. This is functional but does not yet establish the intended editorial hierarchy.

**Phase 1 change:** introduce the approved editorial type system without breaking existing compatibility classes.

### Colour
The current system is built around ocean blue, sand, orange, dark neutral, white, muted/border values and HSL semantic variables.

**Phase 1 change:** formalize the Coast / Bush Editorial palette as tokens and map existing utilities safely.

### Layout
The homepage currently relies heavily on conventional max-width containers, centered headings, card sections and regular grids.

**Editorial target:** stronger asymmetry, 12-column desktop composition, intentional whitespace, image-led hierarchy and 4-column mobile logic where appropriate.

### Components
Reusable homepage components are already separated by responsibility. This is an asset and should be retained.

**Rule:** do not replace the component architecture merely to achieve a visual redesign.

## 4. Motion baseline

The repository contains both Framer Motion and GSAP dependencies. The homepage also contains an `AnimateOnScroll` wrapper and existing CSS animations.

Risk identified: animation should not be allowed to control content visibility or cause sections to remain hidden if JavaScript/observer behavior fails.

**Phase 14** will establish the motion system. Until then, visual phases should prefer CSS/layout changes and preserve functional visibility.

## 5. Functional surfaces that must not regress

The following are protected during the visual transformation:

- Safari Builder pricing and submission flow
- Booking modal and Hero Booking modal
- Customer authentication
- CMS/media functionality
- Multilingual routing/content
- Existing API routes
- Quotation/invoice/payment-receipt/voucher/visa-itinerary PDF generation
- PDF stamp rotation math
- Admin workflows
- Email/notification behavior
- Existing destination/tour data
- Seasonal calendar
- Existing production navigation destinations
- Accessibility focus behavior

### Explicit protected files

Unless a later phase explicitly requires a narrowly scoped change, do not modify:

- `lib/pdf-stamp.ts`
- `lib/i18n.ts`
- `components/LanguageFloatingSelector.tsx`
- `app/api/safari-builder/route.ts`

PDF generation changes are out of scope for the visual redesign.

## 6. Known regression history

Previous work on this project has exposed several failure modes that Phase 0 must guard against:

- global CSS changes affecting unrelated pages
- editor content disappearing after entering edit mode
- rich-text formatting not matching public rendering
- editor toolbar positioning becoming detached from the editing context
- mobile animation leaving important content invisible
- homepage section overlap, including calendar/notice areas
- responsive spacing gaps
- navigation JSX/build failures
- CMS media records existing while selected media renders incorrectly

These are regression constraints, not reasons to rebuild the application.

## 7. Editorial direction lock

The selected direction is:

### Coast / Bush Editorial

A Kenyan travel journal where the Indian Ocean meets the savannah: quiet, tactile, editorial and rooted in place.

Design language:

- editorial rather than SaaS
- photographic rather than icon-led
- asymmetric rather than uniformly centered
- tactile rather than overly glossy
- restrained colour rather than decorative gradients
- strong serif display typography paired with a practical sans/mono system
- thin rules, captions, labels and provenance details
- generous but controlled negative space

Anti-patterns:

- no generic purple/blue gradients
- no Inter/Poppins/Roboto as the primary editorial identity
- no repetitive equal three-column feature grids as the default section pattern
- no generic “Trusted by” logo strip
- no excessive floating glass cards
- no centered-everything composition
- no decorative UI that competes with photography or booking intent

## 8. Phase 0 acceptance gates

Phase 0 is complete when:

- [x] Repository baseline is documented.
- [x] Homepage component inventory is documented.
- [x] Visual-system risks are documented.
- [x] Motion risks are documented.
- [x] Protected functionality/files are documented.
- [x] Editorial direction and anti-patterns are locked.
- [x] A separate phase branch exists from `main`.
- [ ] No Phase 1+ visual implementation is mixed into this phase branch.
- [ ] Build/typecheck remains a required gate before advancing.

## 9. Phase boundaries

Each phase must be implemented as a separately reviewable unit.

**Phase 0:** audit/baseline only  
**Phase 1:** tokens + typography + layout foundation  
**Phase 2:** global navigation/shell  
**Phase 3:** hero  
**Phase 4:** homepage editorial architecture  
**Phase 5:** destinations  
**Phase 6:** experiences  
**Phase 7:** From Watamu / coast story  
**Phase 8:** Why Bahari Asili  
**Phase 9:** Safari Builder / Plan My Safari  
**Phase 10:** Travel Guide  
**Phase 11:** reviews  
**Phase 12:** team/provenance  
**Phase 13:** final CTA  
**Phase 14:** motion system  
**Phase 15:** texture/physicality  
**Phase 16:** responsive reconstruction  
**Phase 17:** accessibility/performance  
**Phase 18:** functional regression  
**Phase 19:** visual QA  
**Phase 20:** production hardening

No later phase should be silently bundled into an earlier phase.

## 10. Phase 0 exit condition

The next implementation phase may begin only after this baseline is reviewed and accepted. Phase 1 must be limited to the design-system foundation and must not redesign homepage sections, navigation, hero, booking flows or CMS surfaces.
