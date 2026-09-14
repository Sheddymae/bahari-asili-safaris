/* Bahari Asili Safaris — Admin Media Library
   Metadata for files uploaded to Supabase Storage by authorized admins.
*/

CREATE TABLE IF NOT EXISTS cms_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  public_url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('safaris','excursions','safari_blu','blog','gallery','general')),
  alt_text TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cms_media_category ON cms_media(category);
CREATE INDEX IF NOT EXISTS idx_cms_media_created_at ON cms_media(created_at DESC);

ALTER TABLE cms_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_media_public_read" ON cms_media;
CREATE POLICY "cms_media_public_read" ON cms_media
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE OR REPLACE FUNCTION cms_media_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cms_media_updated_at ON cms_media;
CREATE TRIGGER trg_cms_media_updated_at
BEFORE UPDATE ON cms_media
FOR EACH ROW EXECUTE FUNCTION cms_media_touch_updated_at();
