# Safari slug redirect map

The old IDs below are the current public route segments and must remain valid as permanent redirects after the descriptive route implementation is completed. The catalogue IDs must remain stable for existing bookings and admin records; route slugs should be a separate field.

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

**Documentation only — redirects are not yet active.** Before enabling these 301s, add a route-slug field and lookup that preserves the catalogue ID for booking/API operations; update every internal link, sitemap URL, canonical, JSON-LD, Markdown endpoint, WhatsApp message, PDF and related-safari card; then test that each old URL returns one 301 directly to a 200 new URL with no chain or loop.

Do not simply rename the existing `id` values: historical booking records and admin references may depend on them.
