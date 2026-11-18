# AI discoverability and OTA readiness — implementation report

Repository: `Sheddymae/bahari-asili-safaris` · Working branch: `freebuff/7a8ecf11a1ee96b8409380ae`
Date: 18 November 2026

## Verdict

**Ready with owner actions — for English.**

The 45 safari program pages now answer cost, best time, children, older travellers, packing, health and FAQs in server-rendered HTML, with matching JSON-LD, a Markdown twin, `llms.txt`, a four-page guide hub and an OTA kit generated from the same data. Two things stop this from being "ready" without qualification: **no reviewed from-prices, minimum ages or cancellation policy exist**, and **the site still has no URL-based locale routes**, so only the English version is crawlable.

## Phase 1 — findings before editing

### Rendering

- Program pages are `app/safaris/[slug]/page.tsx` → `components/SafariDetailEnhanced.tsx`, a client component that Next still pre-renders on the server. For the default English locale the itinerary, packing and inclusions were already in the raw HTML, but they sat inside tabs and there was **no cost, season, children, older-traveller, health or FAQ content at all**.
- Excursion pages (`components/ExcursionDetailClient.tsx`) render description, what to expect, inclusions and "good to know" server-side, but have no cost, season, family, mobility, packing, health or FAQ section.
- Verified with `curl` (no JavaScript) before and after the change.

### Locale handling

- Locale lives in `contexts/LanguageContext.tsx` and a `bahari-locale` cookie/localStorage. There are **no `/en/...`, `/it/...` URL routes**, so Googlebot, Bingbot and every AI crawler only ever see English. Hreflang and per-locale canonicals are impossible in this architecture.
- Worse for crawlers: on any non-English locale the safari page starts with `safari = null` and renders the "not found" state until a client-side fetch completes. A crawler that set the cookie would see a broken page.
- This is the single largest remaining item. It is a routing change, not a copy change, and was not attempted in this pass. Plan below.

### Domain and indexing

- Canonical host: `https://www.bahariasilisafaris.co.ke`. The application uses `lib/site.ts` as the canonical-origin source of truth.
- **Defect found and fixed:** `middleware.ts` treated *any* host containing `vercel.app` as a preview and sent `x-robots-tag: noindex, nofollow`. Because the production site *is* on a `vercel.app` host, **every production page was being noindexed**. The check now noindexes only non-production deployments (`VERCEL_ENV` preview/development, or a `vercel.app` host that is not the configured production host).
- Canonicals, robots, sitemap and structured data now share the validated `SITE_URL` from `lib/site.ts`, defaulting to the production www domain.

### Crawl access

- `app/robots.ts` allowed all crawlers but named none, and did not disallow `/api/`. It now names Googlebot, Bingbot, DuckDuckBot, Applebot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Claude-SearchBot and Claude-User with the same allow/disallow set.
- **Undecided on purpose:** training-only crawlers (GPTBot, ClaudeBot, Google-Extended) are not mentioned, so the wildcard rule allows them. Allowing or blocking training is a business decision and is listed as an owner action.
- No bot-protection logic exists in the repo. Vercel firewall / attack-challenge settings sit outside the repository and could not be inspected — owner action.

### Sitemap and metadata

- `app/sitemap.ts` existed and was missing `/guides`. Now includes the guide hub and four guides, plus `lastModified` for guides (the only pages with a real reviewed date).
- **No `lastModified` is emitted for program pages** because the catalogue has no per-program review date. A fake build date would be worse than none. `priceLastReviewed` / `reviewed` now exist in the content model and can be wired to the database next.

### Data source of truth

- Safari catalogue: `lib/safari-catalogue.ts` = `lib/tours-data.ts` (28 products) + `lib/safari-catalogue-additions.ts` + `lib/regional-safaris.ts` = **45 programs**.
- CMS overrides: `lib/public-content.ts` reads `safari_programs` and `cms_content` with the **service-role client**. It is server-side only and the page exposes only curated fields, so no secret leaks, but it bypasses RLS and could surface unpublished rows. The `safari_programs` migration has RLS enabled with **no public read policy**, so moving these reads to the anon key needs a `published`-only view or policy first. Documented as a security follow-up, not silently changed.
- Prices are quote-based by design: there is no price field anywhere, only `priceTier`/`comfortLevel`. **No price has been invented**; the guides say prices are quoted per trip and mark the missing from-price as an owner TODO.
- Booking, invoice, voucher and PDF generators were not touched.

### Gap table (before → after)

| Required section | Program pages before | Program pages after | Hub guides |
| --- | --- | --- | --- |
| Answer capsule (40–60 words) | ✗ | ✓ | ✓ |
| Quick facts table | Partial (badges) | ✓ | n/a |
| Cost answer + inclusions/exclusions | ✗ (tier badge only) | ✓ (quote basis; no invented price) | ✓ |
| Best time, 12-month table | Partial (one destination paragraph) | ✓ | ✓ |
| Children / minimum age | ✗ | ✓ (policy marked unpublished) | ✓ |
| Older travellers / mobility | ✗ | ✓ (access marked unpublished) | ✓ |
| Packing, categorised | Partial (tab, flat list) | ✓ | ✓ |
| Health and safety with sources | ✗ | ✓ | ✓ |
| Visible FAQ (5–8) | ✗ | ✓ (8) | n/a |
| JSON-LD matching visible content | TouristTrip only | TouristTrip + FAQPage + BreadcrumbList | Article + BreadcrumbList |
| Markdown twin | ✗ | ✓ `/programs/{slug}.md` | ✗ |
| Day excursions | ✗ (no cost/family/health/FAQ) | unchanged — see remaining work | n/a |

## What was built

### Content model — `lib/program-guide.ts`

One builder, `buildProgramGuide(safari)`, derives everything from existing fields: name, duration, parks, lodges, itinerary endpoints and park changes, activity/comfort level, inclusions and packing tips. It produces:

- 40–60-word answer capsule, quick-facts table, pace label, start/finish points.
- Cost section: quote basis, inclusions/exclusions (falling back to the shared defaults used by the existing UI), price drivers, high/low season note, `priceLastReviewed`.
- 12-month season table with Excellent / Good / Fair / Not ideal ratings and a one-line reason, selected by park region (Tsavo/Taita, Amboseli, Mara, Rift, northern Kenya, Tanzania, coast, Zanzibar, Uganda/Rwanda). Pattern cites the Kenya Meteorological Department's two rainy seasons.
- Children and mobility answers derived from duration, number of park transfers and activity level, with the unpublished minimum-age and accessibility facts stated as unpublished.
- Packing grouped by category, with season and region extras.
- Health and safety with CDC and NaTHNaC guidance and links, plus Kenya eTA and emergency numbers.
- Eight FAQs generated from the same fields.

`assertProgramGuide()` enforces required fields, a 12-month table, at least five FAQs and a 35–80-word capsule. It runs inside `generateStaticParams`, so **a program missing content fails the build**.

### Program page template

`components/ProgramGuideSections.tsx` renders the sections server-side inside the existing layout, in this order: at-a-glance + quick facts, cost, best time, children, older travellers/mobility, packing, health and safety, FAQ, then links to the four hub guides and the matching destination pages. The existing hero, tabs, map itinerary, quote sidebar and booking/WhatsApp CTAs are untouched. The guide block is passed into `SafariDetailEnhanced` as a server-rendered child.

Brand rules held: teal headings/section accents, sand backgrounds, near-black text; orange remains only on the existing booking buttons.

### Structured data — `components/ProgramStructuredData.tsx`

Generated from the same `ProgramGuide` object as the visible page:

- `TouristTrip` with itinerary, provider `TravelAgency` (`#business`), destinations and `dateModified`.
- `BreadcrumbList` Home → Safaris → program.
- `FAQPage` mirroring the visible FAQ.

No `Offer`, `priceSpecification`, `AggregateRating` or `Review` is emitted, because no reviewed price and no first-party reviews are shown. That is deliberate: fabricated price or rating markup is both dishonest and a rich-result violation.

### Hub guides — `/guides` and `/guides/[slug]`

Four guides, each with an answer capsule, question-style headings, tables and links back to the relevant programs and destinations:

- `/guides/kenya-safari-costs`
- `/guides/best-time-for-a-kenya-safari`
- `/guides/kenya-safari-with-kids-and-seniors`
- `/guides/kenya-safari-packing-list`

Internal linking runs programs → guides → programs and guides → destinations, plus breadcrumbs on every guide.

### Machine-readable files

- `/llms.txt` — generated from the catalogue: programs (with Markdown URLs), guides, destinations, excursions, company facts. Marked as a low-risk extra, not a strategy.
- `/programs/{slug}` and `/programs/{slug}.md` — full Markdown twin of each program, `text/markdown`, built from the same data.
- `robots.txt`, `sitemap.xml` — as described above.

### Measurement and OTA outputs

- `docs/geo-query-map.md` — 70+ real traveller questions across seven families, each mapped to the page and section that answers it, plus the questions that cannot yet be answered honestly.
- `docs/ota-listing-kit.md` — generated from the live Markdown pages: canonical title, URL, duration, start/finish, parks, pricing basis, meeting point, 50-word description, inclusions/exclusions, best-time text, packing, health copy and FAQ for all 45 programs, plus per-platform checklists (Viator, GetYourGuide, TripAdvisor, Google Business Profile/Things to Do, SafariBookings) and a review-collection flow.
- `docs/geo-baseline.md` — the 12-prompt baseline to run manually, with a results table and a monthly routine.

## Phase 7 note: OTA alignment

The OTA kit is **generated from the website's own data** with `npm run ota:kit`, so listing copy, the site and the Markdown/llms files cannot drift. Cancellation policy is flagged as a blocking TODO: no policy is published anywhere in the repo, and every OTA requires one.

## Phase 8 — checks actually run

Run from `bahari/` on 18 November 2026:

| Check | Command | Result |
| --- | --- | --- |
| TypeScript | `npx tsc --noEmit` | Pass, 0 errors |
| Lint | `npm run lint` | Pass, 0 errors (pre-existing warnings only: `no-img-element`, `exhaustive-deps`) |
| Production build | `npm run build` | Pass; 45 `/safaris/[slug]` pages, 45 `/programs/[slug]`, 4 guides, `/llms.txt`, `/robots.txt`, `/sitemap.xml` |
| No-JS content proof | `npm run verify:ai` against `next start` | Pass: 55 URLs, 45 program pages, all required section ids, exactly one `<h1>`, FAQPage/TouristTrip/BreadcrumbList present, cost lists non-empty, no price Offer emitted |
| Markdown twin | included in `verify:ai` | Pass: `text/markdown`, all required headings |
| Robots access | included in `verify:ai` | Pass: all ten named bots present, site not blocked |
| Sitemap | included in `verify:ai` | Pass: program and guide URLs present |
| Contrast tokens | `npm run check:contrast` | Pass (unchanged palette; new sections use existing tokens) |
| i18n fallback check | `npm run check:i18n` | Pass |
| Browser click-through | — | **Not run.** The pages were checked as raw HTML only; no browser interaction or visual review was performed. |
| Lighthouse | — | **Not run.** No Chrome/Lighthouse in this environment. |
| Live AI-assistant baseline | — | **Not run.** Requires signed-in ChatGPT, Perplexity, Gemini and Claude accounts; the template is in `docs/geo-baseline.md`. |

## Phase 6 — locale routing: not done

English is complete and verified first, as the plan requires. The other seven locales remain cookie-driven and therefore invisible to crawlers. Doing this properly needs:

1. Move public pages under `app/[locale]/...` with `generateStaticParams` for the eight locales, keeping English at the root or redirecting `/` → `/en` (decide with the owner; root redirects cost a little link equity).
2. Replace `LanguageContext` cookie state with the route param; keep the cookie only as a redirect hint.
3. Emit `alternates.languages` and per-locale canonicals in `generateMetadata`.
4. Translate the new answer content from the data model, not by machine-translating the safety text. Health and safety copy must be reviewed by a human for every language.
5. Keep prices, health rules and policies identical across languages.

Until then, `hreflang` is deliberately absent rather than pointing at non-existent URLs.

## Remaining work

### Owner actions (blocking or high value)

1. **Approve and publish from-prices** per program (currency, per-person sharing basis, date checked). This unlocks the cost answer, OTA listings, `Offer` structured data and most "how much" AI prompts.
2. **Publish a cancellation/refund policy** — required by every OTA, currently absent from the site and repo.
3. **Publish a minimum-age and child-seat policy**, and per-day driving times.
4. **Publish an accessibility statement** per program/lodge: step height, step stool, ground-floor rooms, bathroom type.
5. **Confirm group type and maximum group size** per program.
6. **Create the OTA listings** from `docs/ota-listing-kit.md` and keep the company name, address and phone identical everywhere.
7. **Claim Google Business Profile and set up Google Search Console + Bing Webmaster Tools**, submitting the sitemap. Bing matters for ChatGPT retrieval.
8. **Decide the custom domain** and set `NEXT_PUBLIC_SITE_URL` to it; the `vercel.app` host is a weak long-term entity.
9. **Decide the training-crawler policy** (GPTBot / ClaudeBot / Google-Extended are currently allowed by the wildcard).
10. **Run the AI baseline** in `docs/geo-baseline.md` and record it before further SEO work.
11. **Add review collection**; only then add review markup.

### Engineering follow-ups

- Locale URL routing (above), the largest remaining SEO item.
- Move `lib/public-content.ts` off the service-role client: add a published-only view or RLS policy for `safari_programs` and read it with the anon key.
- Extend the same answer sections to the 12 day excursions (coast seasonality, family suitability, packing, health, FAQ).
- Store `priceFrom`, `priceLastReviewed`, `minAge`, `maxGroupSize` and accessibility fields in `safari_programs` and feed them into `buildProgramGuide`, replacing the current "not published" text automatically.
- Wire program `lastModified` to the database `updated_at` and emit it in the sitemap.
- Consider per-program Open Graph images with a descriptive alt; the current OG image is the logo.

## Files changed

New:

- `lib/program-guide.ts`, `lib/program-markdown.ts`, `lib/guides.ts`
- `components/ProgramGuideSections.tsx`, `components/ProgramStructuredData.tsx`
- `app/guides/page.tsx`, `app/guides/[slug]/page.tsx`
- `app/llms.txt/route.ts`, `app/programs/[slug]/route.ts`
- `scripts/verify-ai-content.mjs`, `scripts/build-ota-kit.mjs`
- `docs/geo-query-map.md`, `docs/ota-listing-kit.md`, `docs/geo-baseline.md`, `docs/AI-DISCOVERABILITY-REPORT.md`

Modified:

- `app/safaris/[slug]/page.tsx` (guide, assertion, JSON-LD, metadata description)
- `components/SafariDetailEnhanced.tsx` (accepts the server-rendered guide block)
- `app/robots.ts`, `app/sitemap.ts`, `middleware.ts` (preview noindex fix)
- `package.json` (`verify:ai`, `ota:kit` scripts)

Not touched: booking flow, auth, RLS, invoices/vouchers/quotes/PDF generators, brand tokens, existing page copy.

## Honest caveats

- No price, rating, review, award or certification has been invented. Where a fact is unpublished, the page says so and the report lists it.
- Health content is general guidance with sources, not medical advice, and says so on the page.
- The AI baseline is empty; no citation outcome is claimed.
- The no-JS check proves content and markup are present, not that any assistant will cite the site.
- Lighthouse and visual/browser testing were not run.
