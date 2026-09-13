import type { Booking } from './supabase';
import type { Locale } from './i18n';
import { invoiceLabels, normalizeLocale, formatLocaleDate } from './locale-content';
import { registerInvoiceFont } from './invoice-font';
import { BRAND_TEAL, BRAND_ORANGE, BRAND_OFFWHITE, COMPANY, loadBrandLogo, drawBrandLogo } from './pdf-brand';
import { loadBrandStamp, drawStamp } from './pdf-stamp';
import { generateQrPngDataUrl } from './qr';

export interface InvoiceData extends Booking {
  accommodation_cost?: number;
  park_fees?: number;
  guide_cost?: number;
  transport_cost?: number;
  meals_cost?: number;
  other_costs?: number;
  discount?: number;
  tax?: number;
  parks?: string[];
  locale?: Locale;
}

export async function generatePremiumInvoicePDF(invoice: InvoiceData, requestedLocale?: Locale, documentUrl?: string): Promise<{ dataUrl: string; base64: string }> {
  const { jsPDF } = await import('jspdf');
  const locale = normalizeLocale(requestedLocale || invoice.locale);
  const L = invoiceLabels[locale];
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const font = await registerInvoiceFont(doc, locale);
  const logo = await loadBrandLogo();
  const stamp = await loadBrandStamp();
  const W = 210;
  const MARGIN = 14;
  const PRIMARY = BRAND_TEAL;
  const ACCENT = BRAND_ORANGE;
  const OFFWHITE = BRAND_OFFWHITE;
  const TEXT: [number, number, number] = [31, 41, 55];
  const LIGHT: [number, number, number] = [100, 116, 139];
  const isArabic = locale === 'ar';
  let y = 14;

  const text = (value: string, x: number, yy: number, opts?: any) => doc.text(value || '—', x, yy, opts);
  const money = (n: number | null | undefined) => `KES ${Number(n || 0).toLocaleString('en-KE')}`;
  const section = (label: string) => {
    if (y > 255) { doc.addPage(); y = 18; }
    doc.setFillColor(...PRIMARY); doc.rect(MARGIN, y - 3, W - 2*MARGIN, 8, 'F');
    doc.setFont(font, 'normal'); doc.setFontSize(9); doc.setTextColor(...OFFWHITE);
    text(label, MARGIN + 2, y + 2);
    y += 10;
  };
  const row = (label: string, value: string) => {
    doc.setFont(font, 'normal'); doc.setFontSize(8); doc.setTextColor(...LIGHT);
    const lines = doc.splitTextToSize(value || '—', W - MARGIN - 78);
    if (y + Math.max(5, lines.length * 4) > 275) { doc.addPage(); y = 18; }
    text(label, MARGIN, y);
    doc.setTextColor(...TEXT);
    text(lines, 80, y);
    y += Math.max(5, lines.length * 4);
  };

  // Header — white band with full-color logo top-left, contact info top-right
  doc.setFillColor(255,255,255); doc.rect(0,0,W,40,'F');
  drawBrandLogo(doc, logo, MARGIN, 9, 20);
  doc.setFont(font,'normal'); doc.setFontSize(9); doc.setTextColor(...PRIMARY);
  text(COMPANY.address + '  ·  ' + COMPANY.phone, W-MARGIN, 14, { align:'right' });
  text(COMPANY.email, W-MARGIN, 20, { align:'right' });
  doc.setFontSize(7.5); doc.setTextColor(...LIGHT); text(L.founded, W-MARGIN, 26, { align:'right' });
  doc.setDrawColor(...PRIMARY); doc.setLineWidth(0.5); doc.line(0,40,W,40);

  doc.setFillColor(...ACCENT); doc.rect(0,40,W,18,'F');
  doc.setTextColor(255,255,255); doc.setFontSize(8); text(L.bookingReference, MARGIN, 47);
  doc.setFontSize(16); text(invoice.booking_ref || '', MARGIN, 54);
  doc.setFontSize(8); text(`${L.status}: ${invoice.reservation_status === 'confirmed' ? L.confirmed : L.pending}`, W-MARGIN, 53, { align:'right' });
  y = 66;

  section(L.clientDetails);
  row(L.fullName, `${invoice.first_name} ${invoice.last_name}`);
  row(L.email, invoice.email);
  row(L.whatsapp, invoice.whatsapp || '—');
  if (invoice.nationality) row(L.nationality, invoice.nationality);
  row(L.guests, `${invoice.adults} ${L.adults}${invoice.children > 0 ? ` + ${invoice.children} ${L.children}` : ''}`);
  if (invoice.children > 0 && invoice.kids_ages?.length) row(L.childrenAges, invoice.kids_ages.join(', '));
  y += 5;

  section(L.travelDetails);
  row(L.safariTour, invoice.safari_name);
  row(L.arrivalDate, formatLocaleDate(invoice.arrival_date, locale));
  if ((invoice as any).departure_date) row(L.departureDate, formatLocaleDate((invoice as any).departure_date, locale));
  if (invoice.parks?.length) row(L.parks, invoice.parks.join(', '));
  if (invoice.message) row(L.specialRequests, invoice.message);
  y += 5;

  const costs = [
    [L.accommodation, invoice.accommodation_cost],
    [L.parkFees, invoice.park_fees],
    [L.guide, invoice.guide_cost],
    [L.transport, invoice.transport_cost],
    [L.meals, invoice.meals_cost],
    [L.other, invoice.other_costs],
  ] as [string, number | undefined][];
  const hasBreakdown = costs.some(([,v]) => Number(v || 0) > 0) || Number(invoice.discount || 0) > 0 || Number(invoice.tax || 0) > 0;
  if (hasBreakdown) {
    section(L.costBreakdown);
    let subtotal = 0;
    for (const [label, value] of costs) if (Number(value || 0) > 0) {
      subtotal += Number(value); doc.setFont(font,'normal'); doc.setFontSize(8); doc.setTextColor(...TEXT); text(label, MARGIN+2, y); text(money(value), W-MARGIN-2, y, {align:'right'}); y += 5;
    }
    doc.setDrawColor(...PRIMARY); doc.line(MARGIN+2,y,W-MARGIN-2,y); y += 5;
    doc.setFontSize(9); doc.setTextColor(...PRIMARY); text(L.subtotal,MARGIN+2,y); text(money(subtotal),W-MARGIN-2,y,{align:'right'}); y += 6;
    if (invoice.discount) { doc.setTextColor(34,197,94); doc.setFontSize(8); text(L.discount,MARGIN+2,y); text(`-KES ${Number(invoice.discount).toLocaleString('en-KE')}`,W-MARGIN-2,y,{align:'right'}); y += 5; }
    if (invoice.tax) { doc.setTextColor(...TEXT); doc.setFontSize(8); text(L.tax,MARGIN+2,y); text(money(invoice.tax),W-MARGIN-2,y,{align:'right'}); y += 5; }
    const total = subtotal - Number(invoice.discount || 0) + Number(invoice.tax || 0);
    doc.setFillColor(...ACCENT); doc.rect(MARGIN,y-2,W-2*MARGIN,9,'F'); doc.setTextColor(255,255,255); doc.setFontSize(11); text(L.total,MARGIN+2,y+4); text(money(total),W-MARGIN-2,y+4,{align:'right'}); y += 14;
  } else if (invoice.total_price != null) {
    section(L.costBreakdown);
    doc.setFont(font,'normal'); doc.setFontSize(11); doc.setTextColor(...PRIMARY); text(L.total,MARGIN+2,y); text(money(invoice.total_price),W-MARGIN-2,y,{align:'right'}); y += 10;
  }

  section(L.important);
  doc.setFont(font,'normal'); doc.setFontSize(7.5); doc.setTextColor(...LIGHT);
  for (const term of L.terms) {
    const lines = doc.splitTextToSize(`• ${term}`, W-2*MARGIN-4);
    if (y + lines.length*4 > 270) { doc.addPage(); y=18; }
    text(lines,MARGIN+2,y); y += lines.length*4;
  }
  y += 5;
  if (y + 17 > 279) { doc.addPage(); y = 18; }
  doc.setDrawColor(...LIGHT); doc.line(MARGIN,y,W-MARGIN,y); y += 6;
  doc.setFontSize(8); doc.setTextColor(...TEXT); text(L.confirm,MARGIN,y); y += 5; text(L.questions,MARGIN,y);

  // Footer — teal band with off-white contact details, pinned to the bottom of the page
  doc.setFillColor(...PRIMARY); doc.rect(0,283,W,14,'F');
  doc.setFont(font,'normal'); doc.setFontSize(7.5); doc.setTextColor(...OFFWHITE);
  text(`© 2026 Bahari Asili Safaris, Watamu, Kenya. ${L.founded}.`, W/2, 289, { align:'center' });
  text(`${COMPANY.website}  ·  ${COMPANY.email}  ·  ${COMPANY.phone}`, W/2, 294, { align:'center' });

  // QR code linking to this document's own public URL — bottom-left, clear of
  // the official stamp which owns the bottom-right corner of the footer.
  if (documentUrl) {
    const qr = await generateQrPngDataUrl(documentUrl);
    if (qr) {
      const qrSize = 16;
      doc.addImage(qr, 'PNG', MARGIN, 283 - qrSize - 2, qrSize, qrSize);
    }
  }

  // Official digital stamp, bottom-right, overlapping the footer band.
  // Only pass dateFont when a real script-capable font was registered —
  // registerInvoiceFont() falling back to 'helvetica' means the script font
  // failed to load (e.g. the CJK font is CFF-flavored and unusable by
  // jsPDF's embedder), and helvetica can't render non-Latin glyphs either,
  // so the stamp should use its own ASCII-date fallback in that case.
  drawStamp(doc, stamp, locale, { pageWidth: W, footerTopY: 283, dateFont: font !== 'helvetica' ? font : undefined });

  // jsPDF's R2L mode handles alignment direction; keep the layout usable for Arabic.
  if (isArabic && typeof (doc as any).setR2L === 'function') (doc as any).setR2L(true);

  const dataUrl = doc.output('dataurlstring') as string;
  const binary = new Uint8Array(doc.output('arraybuffer') as ArrayBuffer);
  let raw = ''; for (let i=0;i<binary.length;i++) raw += String.fromCharCode(binary[i]);
  return { dataUrl, base64: btoa(raw) };
}
