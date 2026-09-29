/* Bahari Asili Safaris — Media Library production repair
   Recreates the CMS media metadata table when the original migration was
   committed but not applied to the production database.
*/

CREATE TABLE IF NOT EXISTS public.cms_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  public_url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'general'
    CHECK (category IN ('safaris','excursions','safari_blu','blog','gallery','general')),
  alt_text TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cms_media_category
  ON public.cms_media(category);

CREATE INDEX IF NOT EXISTS idx_cms_media_created_at
  ON public.cms_media(created_at DESC);

ALTER TABLE public.cms_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cms_media_public_read" ON public.cms_media;
CREATE POLICY "cms_media_public_read"
  ON public.cms_media
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.cms_media_touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cms_media_updated_at ON public.cms_media;
CREATE TRIGGER trg_cms_media_updated_at
BEFORE UPDATE ON public.cms_media
FOR EACH ROW
EXECUTE FUNCTION public.cms_media_touch_updated_at();

GRANT SELECT ON public.cms_media TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_media TO service_role;
