/* Bahari Asili Safaris — Content CMS
   Generic content records let the admin manage excursions, Safari Blu,
   blog posts and articles without editing source code. Safari programs keep
   using the existing safari_programs table/editor.
*/

CREATE TABLE IF NOT EXISTS cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL CHECK (content_type IN ('excursion','safari_blu','blog','article','news')),
  slug TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  image TEXT,
  category TEXT,
  duration TEXT,
  location TEXT,
  price NUMERIC,
  currency TEXT DEFAULT 'KES',
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  included JSONB NOT NULL DEFAULT '[]'::jsonb,
  excluded JSONB NOT NULL DEFAULT '[]'::jsonb,
  extra JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  featured BOOLEAN NOT NULL DEFAULT false,
  author TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(content_type, slug, locale)
);

CREATE INDEX IF NOT EXISTS idx_cms_content_type_status ON cms_content(content_type, status);
CREATE INDEX IF NOT EXISTS idx_cms_content_locale ON cms_content(locale);
CREATE INDEX IF NOT EXISTS idx_cms_content_published_at ON cms_content(published_at DESC);

ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_content_public_read" ON cms_content;
CREATE POLICY "cms_content_public_read" ON cms_content
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

-- Admin API routes use the service-role key after verifying the existing
-- Bahari Asili admin session, so no public write policy is required.

CREATE OR REPLACE FUNCTION cms_content_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.status = 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cms_content_updated_at ON cms_content;
CREATE TRIGGER trg_cms_content_updated_at
BEFORE UPDATE ON cms_content
FOR EACH ROW EXECUTE FUNCTION cms_content_touch_updated_at();
