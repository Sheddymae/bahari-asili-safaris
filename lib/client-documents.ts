import type { SupabaseClient } from '@supabase/supabase-js';

export type ClientDocumentType = 'invoice' | 'voucher' | 'visa_support' | 'receipt' | 'itinerary';

export async function createClientDocument(
  admin: SupabaseClient,
  input: {
    userId?: string | null;
    bookingId?: number | null;
    type: ClientDocumentType;
    title: string;
    pdfPath: string;
    email?: string | null;
  },
) {
  const { data, error } = await admin
    .from('client_documents')
    .insert({
      user_id: input.userId || null,
      booking_id: input.bookingId || null,
      type: input.type,
      title: input.title,
      pdf_url: input.pdfPath,
      email: input.email || null,
      status: 'sent',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createSignedDocumentUrl(
  admin: SupabaseClient,
  pdfPath: string,
  expiresIn = 600,
) {
  const { data, error } = await admin.storage
    .from('documents')
    .createSignedUrl(pdfPath, expiresIn);

  if (error || !data?.signedUrl) {
    throw error || new Error('Could not create document URL.');
  }

  return data.signedUrl;
}
