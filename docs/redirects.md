# Safari slug redirect map

The old IDs below are legacy public route segments. The catalogue IDs remain stable for existing bookings and admin records; descriptive route slugs are resolved separately.

| Old path | Proposed descriptive path | Catalogue ID retained for booking records |
| --- | --- | --- |
| `/safaris/experience` | `/safaris/2-day-tsavo-east-safari` | `experience` |
| `/safaris/inside` | `/safaris/3-day-tsavo-east-amboseli-safari` | `inside` |
| `/safaris/nala` | `/safaris/3-day-tsavo-east-taita-hills-safari` | `nala` |
| `/safaris/simba-timon` | `/safaris/4-day-tsavo-amboseli-safari` | `simba-timon` |
| `/safaris/zazu` | `/safaris/3-day-masai-mara-safari` | `zazu` |
| `/safaris/twiga` | `/safaris/4-day-tsavo-taita-hills-amboseli-safari` | `twiga` |
| `/safaris/rafiki` | `/safaris/5-day-tsavo-taita-hills-amboseli-safari` | `rafiki` |
| `/safaris/tumbili` | `/safaris/4-day-masai-mara-lake-nakuru-safari` | `tumbili` |
| `/safaris/tembo` | `/safaris/6-day-grand-kenya-safari` | `tembo` |
| `/safaris/sarabi` | `/safaris/7-day-ultimate-kenya-safari` | `sarabi` |
| `/safaris/mufasa` | `/safaris/8-day-complete-kenya-safari` | `mufasa` |

## Implementation status

**Implemented in source on `main`; live verification is pending.** `lib/safari-slugs.ts` maps the legacy catalogue IDs to descriptive route slugs without changing the IDs used by booking and API records. Middleware issues one direct 301 for both unprefixed and locale-prefixed legacy safari URLs. The Markdown route also redirects legacy `.md` URLs. Internal links, sitemap entries, canonical URLs, JSON-LD, `llms.txt` and the OTA kit use the descriptive slugs.

After an approved deployment, verify every old URL returns one direct 301 to a 200 destination with no chain or loop. Canonical host and HTTPS redirects remain owned by Vercel Domains; do not add a second host redirect in middleware.
