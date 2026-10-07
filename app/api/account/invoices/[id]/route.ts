import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { createSignedDocumentUrl } from '@/lib/client-documents';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: 'Authentication required.' }, { status: 401 });

  const { data: invoice } = await supabase
    .from('invoices')
    .select('id,user_id,pdf_url')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!invoice) return NextResponse.json({ success: false, error: 'Invoice not found.' }, { status: 404 });

  const admin = getSupabaseAdmin();
  return NextResponse.json({ success: true, url: await createSignedDocumentUrl(admin, invoice.pdf_url, 900) });
}
