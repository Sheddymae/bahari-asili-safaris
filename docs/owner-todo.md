# Bahari Asili Safaris — SEO owner actions

These steps require access to production hosting and search-engine accounts. Repository changes do not deploy the site or change external firewall settings.

## Before the next production deployment

- [ ] In Vercel Project → Settings → Environment Variables, set `NEXT_PUBLIC_SITE_URL` for Production to `https://www.bahariasilisafaris.co.ke`.
- [ ] Confirm both `bahariasilisafaris.co.ke` and `www.bahariasilisafaris.co.ke` are attached to the production project. Configure apex-to-www redirect in Vercel as a platform-level backup; middleware also redirects production aliases.
- [ ] Confirm the production deployment is marked as production (`VERCEL_ENV=production`). Preview and development deployments intentionally disallow all crawling and send `X-Robots-Tag: noindex, nofollow`.
- [ ] Review Vercel Firewall, bot protection, rate limits, geo restrictions, and external WAF/CDN rules. Do not challenge or block ordinary public-page requests from Googlebot, Bingbot, Applebot, OAI-SearchBot, ChatGPT-User, Perplexity, or Claude search/user agents. Verify with real requests after deployment; repository code cannot inspect dashboard rules.

## After deployment

- [ ] Verify `https://www.bahariasilisafaris.co.ke/robots.txt` allows public crawling and points to `https://www.bahariasilisafaris.co.ke/sitemap.xml`.
- [ ] Verify `https://www.bahariasilisafaris.co.ke/sitemap.xml` contains public safari programs, destinations, excursions and published blog articles, with no preview or private URLs.
- [ ] Verify apex, HTTP, and production Vercel aliases redirect to the canonical www HTTPS host while preserving path and query string.
- [ ] Add and verify the canonical property in Google Search Console (DNS verification recommended), submit the sitemap, inspect key pages, and request indexing where appropriate.
- [ ] Add the site to Bing Webmaster Tools and submit the same sitemap.
- [ ] Re-test public pages with browser and crawler user agents; confirm ordinary 200 HTML responses and matching canonical tags.

## Owner policy decision

- [ ] Decide whether to block AI training-only crawlers (for example GPTBot, ClaudeBot and Google-Extended). They are intentionally not listed in the current robots policy; retrieval/search crawlers are not the same as training crawlers.

## Security reminder

Robots rules are crawl guidance, not access control. Keep authentication and authorization enforced server-side for admin, customer account, dashboard, and private API routes. Existing middleware and API checks must remain in place.


## Content and commercial facts required before flagship publication

- [ ] Approve or reorder the proposed safari and coastal-excursion priorities in `docs/flagship-pages.md`. No booking-count ranking was available in this code review.
- [ ] Confirm approximate driving hours for every itinerary day. Until verified, pages must not label a safari “easy” or publish guessed drive times.
- [ ] Confirm minimum ages, child-seat policy, vehicle capacity, maximum group size, and actual pickup areas / meeting points.
- [ ] Confirm the exact inclusions and exclusions for each product; shared defaults must be checked against actual supplier arrangements.
- [ ] Confirm cancellation and deposit terms for each product and reconcile them with public terms before publishing OTA listings.
- [ ] Confirm that the current public price basis is “quoted per trip”. If a different basis or a starting price is approved, provide the amount, currency, season dates, sharing basis and human review date.
- [ ] Supply a genuine `lastReviewedAt` date (and reviewer if desired) for each safari, excursion and guide. No review date is currently shown on program pages because the former shared date was not verified.
- [ ] Supply the TRA licence number if the company holds a licence. Do not display a number until supplied.
- [ ] Confirm whether the public phone and WhatsApp number currently in the repository are correct. They differ from the WhatsApp number previously supplied in project correspondence; no number was changed in this pass.
- [ ] Approve the proposed descriptive URL map in `docs/redirects.md`. Redirects are documented but not active; preserve existing catalogue IDs for booking records during implementation.
- [ ] Decide whether incomplete programme pages should remain indexable. No noindex rules were added without approval.

## Email and deliverability

- [ ] Confirm the three working mailboxes remain active: `info@bahariasilisafaris.co.ke` (general), `booking@bahariasilisafaris.co.ke` (quotes and bookings), and `help@bahariasilisafaris.co.ke` (support and callbacks).
- [ ] Configure and verify SPF, DKIM and DMARC for the domain and the actual sending provider. Repository defaults do not prove mailbox delivery.

## OTA readiness

- [ ] Publish and approve the cancellation policy and meeting-point / pickup-area details before creating Viator, GetYourGuide, TripAdvisor or SafariBookings listings.
- [ ] Approve real product photos and photo rights for each flagship listing. Do not use generic images that imply a lodge or activity not included.
- [ ] Confirm the listing price model with each OTA; the website currently states “quoted per trip”, so do not publish per-person tiers without approval.
- [ ] Collect real post-trip reviews and approve their display before adding any rating or AggregateRating markup.


## Post-deployment verification (not yet run)

- [ ] Once a production deployment is approved and available, run `BASE_URL=https://www.bahariasilisafaris.co.ke npm run check:sitemap`. This checks canonical and localized sitemap URLs, page status codes, robots blocking and internal public links.
- [ ] Inspect source HTML for `/it/`, `/fr/`, `/es/`, `/de/`, `/ar/`, `/zh/` and `/sw/` pages. Each must have a self-language canonical plus reciprocal hreflang alternates and an `x-default` English URL.
- [ ] Verify each old safari slug returns one direct 301 to its descriptive URL and that the destination returns 200; repeat for locale-prefixed old URLs.
- [ ] After those checks pass, resubmit `https://www.bahariasilisafaris.co.ke/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- [ ] Confirm the host/WAF does not challenge Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, or other approved search crawlers. The repository cannot verify dashboard bot-protection settings.

- [ ] Confirm the public phone and WhatsApp number. A previous business brief and the current structured-data number differ; keep the existing live contact values until the owner confirms the correct public number.
