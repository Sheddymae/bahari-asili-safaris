import QRCode from 'qrcode';

/**
 * Generate a QR code as a PNG data URL, sized for embedding in a jsPDF
 * document via doc.addImage(). Returns null (never throws) so a QR
 * failure never blocks the PDF it would have decorated — every generator
 * that calls this treats the QR as optional decoration, not required
 * content.
 *
 * IMPORTANT (see spec Part 7 / security): only ever call this with a URL
 * that is already the document's own intended public location (same
 * bucket/path pattern already used for every invoice_url/voucher_url/etc
 * in this app — see lib/supabase-admin.ts getDocumentPublicUrl). Never
 * point a QR at a new, different "booking view" URL — that would be a
 * new public surface this app doesn't otherwise have.
 */
export async function generateQrPngDataUrl(url: string): Promise<string | null> {
  try {
    return await QRCode.toDataURL(url, {
      margin: 1,
      width: 160,
      color: { dark: '#0e7490', light: '#ffffff' },
    });
  } catch (err) {
    console.error('QR code generation failed:', err);
    return null;
  }
}
