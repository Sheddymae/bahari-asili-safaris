/*
# Phase 2 — Group Joining safaris + DB-backed gallery captions

## Summary
Adds the two tables the Phase 2 pages/components need:

- group_tours     Backs the "Group Joining" tab on /tours — scheduled group
                   departures travelers can request to join (e.g. "Join 2
                   Italians on Feb 14 to Tsavo — 2 seats left").
- gallery_images   Backs GallerySection + its lightbox. Replaces the
                   hard-coded image list in components/GallerySection.tsx
                   with real rows so each photo can carry a human caption
                   ("Tsavo East — Mudanda Rock — 6:30am by guide Joseph")
                   instead of "Image 14", and so admins can edit captions
                   without a deploy.

## Public read / service-role write
Both tables are readable by anon (the public site needs to list them) but
only writable via the service-role key from admin API routes — same
pattern as the rest of the schema (see 20260819100000_admin_security_phase1).
*/

CREATE TABLE IF NOT EXISTS group_tours (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  safari_id     TEXT NOT NULL,             -- references lib/tours-data.ts Safari.id, e.g. 'experience'
  safari_name   TEXT NOT NULL,             -- denormalized display name, e.g. 'Safari EXPERIENCE — Tsavo'
  departure_date DATE NOT NULL,
  total_seats   INTEGER NOT NULL DEFAULT 6,
  seats_left    INTEGER NOT NULL DEFAULT 6,
  joined_names  TEXT[] NOT NULL DEFAULT '{}',   -- e.g. {'Marco & Giulia'} shown as "Join 2 Italians..."
  joined_nationality TEXT,                 -- e.g. 'Italians', 'French travelers' — used in the card copy
  status        TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'departed', 'cancelled')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_group_tours_departure_date ON group_tours (departure_date);

ALTER TABLE group_tours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "group_tours_public_read" ON group_tours
  FOR SELECT
  TO anon, authenticated
  USING (status = 'open' AND departure_date >= CURRENT_DATE);

-- Seed a few upcoming departures so the Group Joining tab isn't empty on
-- first deploy — replace/remove via the admin dashboard once real trips
-- are scheduled.
INSERT INTO group_tours (safari_id, safari_name, departure_date, total_seats, seats_left, joined_names, joined_nationality, status)
VALUES
  ('experience', 'Safari EXPERIENCE — Tsavo', CURRENT_DATE + INTERVAL '14 days', 6, 2, ARRAY['Marco & Giulia'], 'Italians', 'open'),
  ('inside', 'Safari INSIDE — Tsavo & Amboseli', CURRENT_DATE + INTERVAL '21 days', 6, 4, ARRAY['Sophie & Léa'], 'French travelers', 'open'),
  ('nala', 'Safari NALA — Taita Hills', CURRENT_DATE + INTERVAL '30 days', 6, 6, ARRAY[]::TEXT[], NULL, 'open')
ON CONFLICT DO NOTHING;


CREATE TABLE IF NOT EXISTS gallery_images (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  src           TEXT NOT NULL,
  alt           TEXT NOT NULL,             -- accessibility text, kept generic
  caption       TEXT,                      -- human caption shown in the lightbox, e.g.
                                            -- 'Tsavo East — Mudanda Rock — 6:30am by guide Joseph'
  category      TEXT NOT NULL DEFAULT 'safari' CHECK (category IN ('safari', 'coast', 'culture', 'marine', 'sunsets')),
  sort_order    INTEGER NOT NULL DEFAULT 0,
  active        BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_images_sort ON gallery_images (sort_order);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gallery_images_public_read" ON gallery_images
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

-- Seed with the images already shipped in public/images so the gallery has
-- real captions on first deploy instead of falling back to alt text.
INSERT INTO gallery_images (src, alt, caption, category, sort_order) VALUES
  ('/images/gallery/safari-lions.png', 'African lions pride resting in golden grassland', 'Tsavo East — a pride resting off the Voi road, 7am', 'safari', 10),
  ('/images/gallery/safari-elephants.png', 'Herd of African elephants in savanna landscape', 'Tsavo East — red-dust elephants near Aruba Dam', 'safari', 20),
  ('/images/gallery/safari-giraffe.png', 'Tall giraffe standing in Kenyan savanna', 'Taita Hills — Maasai giraffe at sundown', 'safari', 30),
  ('/images/gallery/safari-zebra.png', 'Wild zebra herd grazing in African savanna', 'Amboseli — zebra herd with Kilimanjaro behind', 'safari', 40),
  ('/images/gallery/safari-leopard.png', 'Spotted leopard resting on acacia tree branch', 'Tsavo West — leopard spotted by guide Joseph', 'safari', 50),
  ('/images/gallery/safari-rhino.png', 'African rhino in natural savanna habitat', 'Tsavo West — black rhino sanctuary, early morning', 'safari', 60),
  ('/images/gallery/safari-buffalo.png', 'African cape buffalo herd in grassland', 'Tsavo East — buffalo herd crossing the Galana River', 'safari', 70),
  ('/images/gallery/safari-wildebeest.png', 'Wildebeest herd during migration in dust cloud', 'Masai Mara — migration dust at first light', 'safari', 80),
  ('/images/gallery/safari-birds.png', 'Colorful African birds in natural habitat', 'Mida Creek — mangrove birdlife at low tide', 'safari', 90),
  ('/images/gallery/safari-gamedrive.png', 'Safari game drive with tourists observing wildlife', 'Tsavo East — a Bahari Asili game drive in session', 'safari', 100),
  ('/images/gallery/safari-sunset.png', 'Golden sunset over African savanna', 'Tsavo — sunset over the Yatta Plateau', 'sunsets', 110),
  ('/images/gallery/coast-beach.png', 'Tropical Kenyan beach paradise with white sand', 'Watamu — the beach in front of our office', 'coast', 120),
  ('/images/hero/hero-diani.jpg', 'Diani Beach, Kenya coastline', 'Diani Beach at low tide', 'coast', 130),
  ('/images/gallery/marine-coral.png', 'Colorful coral reef and tropical marine life', 'Watamu Marine Park — coral gardens snorkel stop', 'marine', 140),
  ('/images/gallery/lodge-luxury.png', 'Luxury safari lodge exterior with thatched roof', 'Voi Wildlife Lodge — main lodge at golden hour', 'safari', 150),
  ('/images/gallery/lodge-dining.png', 'Luxury safari lodge outdoor dining experience', 'Voi Wildlife Lodge — dinner under the stars', 'safari', 160),
  ('/images/safaris/safari-experience-tsavo.jpg', 'Game drive in Tsavo National Park', 'Tsavo East — Safari EXPERIENCE group on a morning drive', 'safari', 170),
  ('/images/safaris/safari-inside-tsavo-amboseli.jpg', 'Safari vehicle in Amboseli with Mount Kilimanjaro', 'Amboseli — Safari INSIDE, Kilimanjaro backdrop', 'safari', 180),
  ('/images/safaris/safari-nala-taita.jpg', 'Wildlife encounter in the Taita Hills', 'Taita Hills — Safari NALA wildlife encounter', 'safari', 190)
ON CONFLICT DO NOTHING;
