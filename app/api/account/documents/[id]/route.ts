import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { createSignedDocumentUrl } from '@/lib/client-documents';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 });

  const { data: document, error } = await supabase
    .from('client_documents')
    .select('id,user_id,pdf_url,status,title')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !document) return NextResponse.json({ success: false, error: 'Document not found.' }, { status: 404 });

  const admin = getSupabaseAdmin();
  const url = await createSignedDocumentUrl(admin, document.pdf_url, 900);

  if (req.nextUrl.searchParams.get('view') === '1' && document.status !== 'viewed') {
    await supabase.from('client_documents').update({ status: 'viewed' }).eq('id', id).eq('user_id', user.id);
  }

  return NextResponse.json({ success: true, url, status: req.nextUrl.searchParams.get('view') === '1' ? 'viewed' : document.status });
}
