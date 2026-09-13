# Bahari Asili Safaris

A Next.js / TypeScript web platform for a safari tour company, covering the full customer journey — safari discovery and booking, multilingual browsing, and automated generation of official travel documents (invoices, receipts, vouchers, and visa/itinerary letters) — plus an admin-facing side for managing bookings.

---

## Tech Stack

- **Framework:** Next.js (App Router) with TypeScript
- **Styling:** Tailwind CSS, with responsive behavior driven by CSS custom properties in `globals.css`
- **PDF generation:** jsPDF
- **Internationalization:** custom i18n layer (`lib/i18n.ts`) supporting 8 languages
- **Data:** Postgres (accessed via API routes under `app/api/`)

---

## Core Features

### 1. Build Your Safari
A multi-step safari builder flow (6 step components) that lets a customer configure and save a custom safari itinerary.

- API route: `app/api/safari-builder/route.ts`
- Save flow is self-healing: if the database's `locale` column isn't live yet, the insert retries without it rather than failing outright, and logs the real Postgres error instead of a generic one.
- The parallel "bookings" mirror-insert also carries `locale` through, fixing an earlier gap where it was silently dropped.

### 2. Multi-locale support (8 languages)
The entire site — navigation, modals, footer, account pages, and the safari builder — is translated and locale-aware.

- Central translation types and lookup logic live in `lib/i18n.ts`.
- Components wired to translation namespaces: `AuthModal`, `BookingModal`, `Navbar`, `Footer`, `account/page`, all 6 safari-builder step components, and others (~25 components in total).
- **Language selector:** `components/LanguageFloatingSelector.tsx` — a corner-anchored "quarter-arc fan" UI showing all 8 language flags across two 90° arcs. Built without `framer-motion`; responsiveness is handled entirely through CSS custom properties.

### 3. Official document generation
Four document types are generated as branded PDFs:

| Generator | File |
|---|---|
| Invoice | `lib/invoice-generator.ts` |
| Payment receipt | `lib/payment-receipt-generator.ts` |
| Voucher | `lib/voucher-generator.ts` |
| Visa / itinerary letter | `lib/visa-itinerary-generator.ts` |

All four:
- Are fully translated across all 8 supported languages, following one shared pattern.
- Carry the company logo.
- Carry an **official digital stamp** (see below).
- Render a locale-aware current date, with a font-safety fallback: locales needing a script-capable font (e.g. Arabic, Chinese) get a proper native-script date when that font is loaded; otherwise the generator falls back to a plain ASCII date to avoid corrupted glyphs.

**Digital stamp system** — `lib/pdf-stamp.ts`
- Adds a rotated, semi-transparent (85% opacity) stamp to the bottom-right of every generated document, overlapping the footer.
- Stamp artwork (`public/images/bahari-asili-stamp.png`) was processed from the original upload: background removed, tightly cropped.
- Positioning required reverse-engineering two undocumented jsPDF behaviors, confirmed empirically (render → rasterize → measure pixel offsets) rather than by trusting the docs:
  - Image rotation pivots around the image's **bottom-left corner**, not its center — placement uses an inverted formula to compensate.
  - `align:'center'` combined with a rotation `angle` drifts for text; the fix uses `align:'left'` with a manually computed anchor point instead.

### 4. Branding / logo system
A full logo asset set generated from the company's source artwork:
`logo.png`, `logo-horizontal.png`, `logo-white.png`, `logo-icon.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `favicon.ico`.

- `Navbar.tsx` — logo swaps color based on scroll state.
- `Footer.tsx` — footer logo placement.
- `app/layout.tsx` — icons and metadata wired for favicon/touch-icon/PWA icons.

---

## Project Structure (key paths)

```
app/
  api/
    safari-builder/route.ts      # safari builder save endpoint (self-healing insert)
  auth/
    dashboard/                   # pre-existing, out-of-scope TS errors live here
  layout.tsx                     # logo/icon metadata wiring
  account/page                   # translated account page

components/
  Navbar.tsx
  Footer.tsx
  AuthModal.tsx
  BookingModal.tsx
  LanguageFloatingSelector.tsx   # 8-language quarter-arc fan selector
  (6 safari-builder step components)

lib/
  i18n.ts                        # translation types + lookup (TranslationKeys)
  invoice-generator.ts
  payment-receipt-generator.ts
  voucher-generator.ts
  visa-itinerary-generator.ts
  pdf-stamp.ts                   # shared stamp logic used by all 4 generators
  locale-content.ts               # pre-existing, out-of-scope TS errors live here

public/
  images/
    bahari-asili-stamp.png
  logo.png, logo-horizontal.png, logo-white.png, logo-icon.png
  apple-touch-icon.png, icon-192.png, icon-512.png, favicon.ico
```

---

## Known Issues (pre-existing, out of scope)

TypeScript errors exist in the following locations independent of the features above — they predate this work and have been deliberately left untouched:

- `app/auth/dashboard/*`
- `lib/locale-content.ts`

Any future work should confirm these are unchanged rather than attempting to "fix" them as part of an unrelated feature pass.

---

## Verification / QA notes

The document-generation and stamp work was validated empirically rather than by static code review:

- Generated sample PDFs (invoice, receipt, voucher, visa/itinerary) for both a Latin-script locale and a non-Latin-script locale, rasterized them, and visually confirmed stamp position, rotation, opacity, and date rendering.
- Ran a full typecheck pass to confirm zero new errors beyond the two known pre-existing files.
- Confirmed the language selector and translated Navbar/Footer render correctly together across locales.

---

## Notes for future contributors

- Do not change the stamp/rotation math in `pdf-stamp.ts` based on jsPDF's documented behavior — the current approach was arrived at by empirical testing to work around real bugs in the library.
- When adding a new document type or translation namespace, follow the existing pattern in the 4 generators / `lib/i18n.ts` rather than introducing a new one.
- Keep the 8-language coverage in sync: any new UI copy or document field needs a translation key added for all 8 locales, not just the default.
