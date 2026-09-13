import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, uploadDocumentPDF, getDocumentPublicUrl } from '@/lib/supabase-admin';
import { generateQuotationPDF } from '@/lib/quotation-generator';
import { sendQuotationEmail } from '@/lib/quotation-email';
import type { Quotation } from '@/lib/supabase';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.from('safari_trip_requests').select('*').eq('id', params.id).maybeSingle();
  if (error || !data) return NextResponse.json({ success: false, error: 'Quotation not found.' }, { status: 404 });
  return NextResponse.json({ success: true, quotation: data });
}

// PATCH body: { action: 'generate_pdf' | 'resend_email' | 'update_status', status?: Quotation['status'] }
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = getSupabaseAdmin();
  try {
    const body = await req.json();
    const action = String(body.action || '');

    const { data: quotation, error: fetchError } = await admin
      .from('safari_trip_requests')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();
    if (fetchError || !quotation) {
      return NextResponse.json({ success: false, error: 'Quotation not found.' }, { status: 404 });
    }

    if (action === 'update_status') {
      const status = String(body.status || '');
      if (!['draft', 'sent', 'accepted', 'rejected'].includes(status)) {
        return NextResponse.json({ success: false, error: 'Invalid status.' }, { status: 400 });
      }
      const { data: updated, error: updateError } = await admin
        .from('safari_trip_requests')
        .update({ status })
        .eq('id', params.id)
        .select()
        .maybeSingle();
      if (updateError) return NextResponse.json({ success: false, error: 'Failed to update status.' }, { status: 500 });
      return NextResponse.json({ success: true, quotation: updated });
    }

    if (action === 'generate_pdf' || action === 'resend_email') {
      const path = `quotations/${quotation.quotation_ref}.pdf`;
      const qrUrl = getDocumentPublicUrl(admin, path) || undefined;
      const generated = await generateQuotationPDF(quotation as Quotation, undefined, qrUrl);
      let url: string | null = null;
      try {
        url = await uploadDocumentPDF(admin, path, generated.base64);
      } catch (uploadErr) {
        console.error('Quotation PDF upload failed (PDF still generated):', uploadErr);
      }

      let emailSent: boolean | undefined;
      if (action === 'resend_email') {
        emailSent = await sendQuotationEmail(quotation as Quotation, quotation.created_at || new Date().toISOString(), generated.base64);
      }

      return NextResponse.json({
        success: true,
        url,
        dataUrl: url ? undefined : generated.dataUrl, // fall back to inline data URL if storage upload isn't configured
        emailSent,
        emailConfigured: !!process.env.EMAIL_API_KEY,
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action.' }, { status: 400 });
  } catch (err) {
    console.error('Admin quotation action error:', err);
    return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 });
  }
}
