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
