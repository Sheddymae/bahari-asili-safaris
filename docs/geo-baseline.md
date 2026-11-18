# AI visibility baseline — Bahari Asili Safaris

**Status of this baseline: NOT RUN.** The four assistants below require signed-in accounts and a browser session that this build environment does not have. No result has been invented here. Run the prompts once, by hand, and fill in the table — that becomes the baseline against which later months are compared.

## What to record

For each prompt and each assistant, record:

1. Whether Bahari Asili Safaris is mentioned at all.
2. If cited, the URL cited (site page, OTA listing, review site, directory).
3. Which other companies are named.
4. The date and country/IP used, because answers vary by location.

Do not record the assistant's full prose; record only evidence of citation. Screenshots with a timestamp are ideal.

## Prompt set

Run these 12 prompts in ChatGPT (with search), Perplexity, Gemini and Claude. Use a fresh conversation for each, and the same account and location every month.

1. Best safari from Watamu, Kenya for a couple
2. How much does a 3-day Tsavo safari cost from Mombasa?
3. Is a 2-day safari in Tsavo East worth it?
4. Best time of year for a Kenya safari and beach holiday
5. Kenya safari with young children — which park?
6. Is a Kenya safari suitable for a 75-year-old?
7. What should I pack for a Kenya safari in July?
8. Do I need malaria tablets for Tsavo National Park?
9. Amboseli vs Tsavo for elephants
10. Masai Mara migration: when and where to stay
11. Safari operator in Watamu with Italian-speaking guides
12. Day trips from Watamu besides the beach

## Baseline table (fill on first run)

| Prompt | ChatGPT | Perplexity | Gemini | Claude | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |
| 6 | | | | | | |
| 7 | | | | | | |
| 8 | | | | | | |
| 9 | | | | | | |
| 10 | | | | | | |
| 11 | | | | | | |
| 12 | | | | | | |

Legend: **Y** = cited with a link · **M** = mentioned without a link · **N** = not mentioned.

## Monthly re-test routine

1. Run the 12 prompts on the first working day of the month, same account, same location.
2. Add one new prompt per month taken from `docs/geo-query-map.md`, rotating through families A–G.
3. Record the cited URLs. A page that is cited repeatedly is the one to improve and link to more.
4. Add one row per month to the table above rather than overwriting, so the trend is visible.
5. Check Google Search Console and Bing Webmaster Tools for impressions on the same questions; queries appearing there are the ones already being surfaced.

## Owner setup required before measurement is meaningful

- [ ] Verify the domain in Google Search Console and submit `https://www.bahariasilisafaris.co.ke/sitemap.xml`.
- [ ] Add the site to Bing Webmaster Tools and submit the same sitemap. ChatGPT's search index leans on Bing, so this matters even if Google is the bigger traffic source.
- [ ] Claim the Google Business Profile (Pinguili, Watamu) and keep name, address, phone and website identical to the site.
- [ ] Decide on a custom domain. A `vercel.app` subdomain works but is weaker as a brand entity and cannot be used as the canonical host once you move.
- [ ] Decide the training-crawler policy: `robots.txt` currently says nothing about GPTBot, ClaudeBot or Google-Extended, which means they are allowed. Blocking them reduces training use but may reduce retrieval in some assistants. This is a business decision, not a technical one.
- [ ] Log AI-crawler user agents. Vercel's log drain or analytics can filter `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Perplexity-User`, `Claude-SearchBot`, `Claude-User` and `Applebot` so you can see when assistants actually fetch the site.

## What not to expect

Structured data and `llms.txt` are cheap extras, not a ranking strategy. Google has said neither is required for AI Overviews or AI Mode. The levers that matter are: server-rendered specific content, crawl access, consistent facts across the site and the OTAs, and real reviews. Measure citations; do not promise them.
