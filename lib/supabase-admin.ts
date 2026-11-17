import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Server-only client using the service-role key — bypasses RLS entirely.
// NEVER import this from a Client Component or expose the key to the browser.
let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

const DOCUMENTS_BUCKET = process.env.SUPABASE_DOCUMENTS_BUCKET || 'documents';

/**
 * Reduces either a storage object path (`invoices/BAS-2026-0001.pdf`), a full
 * public URL or a signed URL to the object path inside the bucket.
 *
 * Rows written before the `documents` bucket was made private stored the full
 * public URL; rows written afterwards store the path. Both must keep working.
 */
export function normaliseDocumentPath(value: string | null | undefined): string | null {
  if (!value) return null;
  const raw = value.trim();
  if (!raw) return null;

  try {
    if (/^https?:\/\//i.test(raw)) {
      const url = new URL(raw);
      const match = url.pathname.match(/\/storage\/v1\/object\/(?:public|sign|authenticated)\/[^/]+\/(.+)$/);
      if (!match) return null;
      return decodeURIComponent(match[1]);
    }
  } catch {
    return null;
  }

  return raw.replace(/^\/+/, '');
}

/**
 * Upload a base64-encoded PDF to the private `documents` bucket and return a
 * short-lived signed URL the admin can open immediately.
 *
 * The bucket is private (see 20261007_booking_invoice_client_docs.sql), so
 * public URLs are intentionally never produced. Persist the object *path* on
 * the row, not this URL — signed URLs expire.
 */
export async function uploadDocumentPDF(
  admin: SupabaseClient,
  path: string,
  base64: string
): Promise<string | null> {
  try {
    const bytes = Buffer.from(base64, 'base64');
    const { error } = await admin.storage.from(DOCUMENTS_BUCKET).upload(path, bytes, {
      contentType: 'application/pdf',
      upsert: true,
    });
    if (error) {
      console.error('Document upload error:', error.message);
      return null;
    }
    return await getDocumentSignedUrl(admin, path, 60 * 60);
  } catch (err) {
    console.error('Document upload exception:', err);
    return null;
  }
}

/** Creates a time-limited signed URL for a private document object. */
export async function getDocumentSignedUrl(
  admin: SupabaseClient,
  value: string | null | undefined,
  expiresIn = 900
): Promise<string | null> {
  const path = normaliseDocumentPath(value);
  if (!path) return null;

  try {
    const { data, error } = await admin.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrl(path, expiresIn);

    if (error || !data?.signedUrl) {
      console.error('Document signed URL error:', error?.message || 'no signed URL returned');
      return null;
    }
    return data.signedUrl;
  } catch (err) {
    console.error('Document signed URL exception:', err);
    return null;
  }
}

/**
 * Long-lived (but still signed) URL embedded in the QR code printed on a PDF,
 * so a customer/agent can always retrieve the current copy without the link
 * being world-readable. 90 days matches the retention window of the documents
 * themselves; regenerating the PDF issues a fresh link.
 */
export async function getDocumentQrUrl(
  admin: SupabaseClient,
  path: string | null | undefined
): Promise<string | null> {
  return getDocumentSignedUrl(admin, path, 60 * 60 * 24 * 90);
}
