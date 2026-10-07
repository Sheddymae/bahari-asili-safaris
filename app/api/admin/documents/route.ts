import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { createClientDocument, createSignedDocumentUrl } from '@/lib/client-documents';
import { generatePremiumInvoicePDF } from '@/lib/invoice-generator';
import { generateVoucherPDF } from '@/lib/voucher-generator';
import { generatePaymentReceiptPDF } from '@/lib/payment-receipt-generator';
import { generateVisaItineraryPDF } from '@/lib/visa-itinerary-generator';
import { generateDetailedItineraryPDF } from '@/lib/itinerary-generator';

type Action = 'invoice'|'voucher'|'visa_support'|'receipt'|'itinerary'|'confirm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bookingId = Number(body.bookingId);
    const action = String(body.action) as Action;
    if (!Number.isInteger(bookingId) || !['invoice','voucher','visa_support','receipt','itinerary','confirm'].includes(action)) {
      return NextResponse.json({ success:false, error:'Invalid document request.' }, { status:400 });
    }

    const admin = getSupabaseAdmin();
    const { data: booking, error: bookingError } = await admin.from('bookings').select('*').eq('id', bookingId).maybeSingle();
    if (bookingError || !booking) return NextResponse.json({ success:false, error:'Booking not found.' }, { status:404 });

    let current = booking as any;
    if (action === 'confirm') {
      const updates = { reservation_status:'confirmed', status:'confirmed', confirmed_at:new Date().toISOString() };
      const { data: updated, error } = await admin.from('bookings').update(updates).eq('id', bookingId).select().single();
      if (error) throw error;
      current = updated;
      const existing = await admin.from('client_documents').select('id').eq('booking_id', bookingId).eq('type','voucher').maybeSingle();
      if (!existing.data) body.action = 'voucher';
      else return NextResponse.json({ success:true, reservation:current, document:null });
    }

    const effectiveAction = (body.action || action) as Exclude<Action,'confirm'>;
    const locale = current.locale || 'en';
    let invoiceNumber = current.invoice_number as string | null;
    if (effectiveAction === 'invoice' && !invoiceNumber) {
      const { data, error } = await admin.rpc('next_bahari_invoice_number');
      if (error || !data) throw error || new Error('Invoice number could not be generated.');
      invoiceNumber = String(data);
    }

    const path = effectiveAction === 'invoice'
      ? 'invoices/' + invoiceNumber + '.pdf'
      : effectiveAction === 'voucher'
        ? 'vouchers/' + bookingId + '-' + Date.now() + '.pdf'
        : effectiveAction === 'receipt'
          ? 'receipts/' + bookingId + '-' + Date.now() + '.pdf'
          : effectiveAction === 'itinerary'
            ? 'itineraries/' + bookingId + '-' + Date.now() + '.pdf'
            : 'visa-support/' + bookingId + '-' + Date.now() + '.pdf';

    let generated:{base64:string};
    if (effectiveAction === 'invoice') generated = await generatePremiumInvoicePDF({ ...current, booking_ref: invoiceNumber }, locale as any);
    else if (effectiveAction === 'voucher') generated = await generateVoucherPDF(current, locale as any);
    else if (effectiveAction === 'receipt') {
      const { data: history } = await admin.from('payments').select('*').eq('booking_id', bookingId).order('created_at',{ascending:true});
      const payments = (history || []) as any[];
      generated = await generatePaymentReceiptPDF(current, payments[payments.length-1], payments, locale as any);
    } else if (effectiveAction === 'itinerary') generated = await generateDetailedItineraryPDF(current, locale as any);
    else generated = await generateVisaItineraryPDF(current, String(body.passportNumber || ''), locale as any);

    const upload = await admin.storage.from(process.env.SUPABASE_DOCUMENTS_BUCKET || 'documents').upload(path, Buffer.from(generated.base64,'base64'), { contentType:'application/pdf', upsert:true });
    if (upload.error) throw upload.error;

    if (effectiveAction === 'invoice') {
      await admin.from('bookings').update({ invoice_generated:true, invoice_number:invoiceNumber, invoice_url:path, invoice_status: current.invoice_status === 'paid' ? 'paid' : 'confirmed' }).eq('id',bookingId);
      await admin.from('invoices').upsert({
        booking_id:bookingId, user_id:current.user_id, invoice_number:invoiceNumber, amount:Number(current.total_amount ?? current.total_price ?? 0),
        currency:current.currency || 'USD', status:current.payment_status === 'paid' ? 'paid' : 'pending',
        itinerary:current.itinerary_snapshot || current.itinerary || null, pdf_url:path
      },{onConflict:'invoice_number'});
    } else if (effectiveAction === 'voucher') {
      await admin.from('bookings').update({ voucher_generated:true, voucher_url:path }).eq('id',bookingId);
    } else if (effectiveAction === 'receipt') {
      await admin.from('bookings').update({ payment_receipt_url:path }).eq('id',bookingId);
    } else if (effectiveAction === 'itinerary') {
      await admin.from('bookings').update({ itinerary_url:path }).eq('id',bookingId);
    } else if (effectiveAction === 'visa_support') {
      await admin.from('bookings').update({ visa_itinerary_url:path }).eq('id',bookingId);
    }

    let document = null;
    if (current.user_id || current.email) {
      const type = effectiveAction === 'visa_support' ? 'visa_support' : effectiveAction;
      const title = effectiveAction === 'invoice' ? 'Invoice ' + invoiceNumber : effectiveAction === 'voucher' ? 'Travel Voucher – ' + current.safari_name : effectiveAction === 'receipt' ? 'Payment Receipt – ' + current.booking_ref : effectiveAction === 'itinerary' ? 'Detailed Itinerary – ' + current.safari_name : 'Visa Supporting Document – ' + current.safari_name;
      document = await createClientDocument(admin,{ userId:current.user_id, bookingId, type:type as any, title, pdfPath:path, email:current.email });
    }

    const signedUrl = await createSignedDocumentUrl(admin, path, 900);
    return NextResponse.json({ success:true, reservation:current, url:signedUrl, path, document });
  } catch (error) {
    console.error('Admin client document action failed:', error);
    return NextResponse.json({ success:false, error:error instanceof Error ? error.message : 'Document generation failed.' }, { status:500 });
  }
}
