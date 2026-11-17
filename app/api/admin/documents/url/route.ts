import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getDocumentSignedUrl } from '@/lib/supabase-admin';
import { getAdminSession, unauthorizedAdminResponse } from '@/lib/admin-api';

/**
 * Exchanges a stored document path (or a legacy public URL) for a short-lived
 * signed URL. The `documents` bucket is private, so admin screens must never
 * open `invoice_url`/`voucher_url` directly.
 */
export async function GET(req: NextRequest) {
  const session = await getAdminSession(req);
  if (!session) return unauthorizedAdminResponse();

  const path = req.nextUrl.searchParams.get('path');
  if (!path) {
    return NextResponse.json({ success: false, error: 'A document path is required.' }, { status: 400 });
  }

  try {
    const admin = getSupabaseAdmin();
    const url = await getDocumentSignedUrl(admin, path, 900);
    if (!url) {
      return NextResponse.json({ success: false, error: 'Document not found.' }, { status: 404 });
    }
    return NextResponse.json(
      { success: true, url },
      { headers: { 'Cache-Control': 'private, no-store' } }
    );
  } catch (error) {
    console.error('Admin document URL error:', error);
    return NextResponse.json({ success: false, error: 'Could not open the document.' }, { status: 500 });
  }
}
