import type { Quotation } from './supabase';
import type { Locale } from './i18n';
import { invoiceLabels, normalizeLocale, formatLocaleDate } from './locale-content';
import { registerInvoiceFont } from './invoice-font';
import { generateQrPngDataUrl } from './qr';
import { COMPANY, loadBrandLogo, drawBrandLogo } from './pdf-brand';
import { loadBrandStamp, drawStamp } from './pdf-stamp';

// Quotation-specific labels that don't already exist in invoiceLabels.
// Everything else (client/travel details, cost-breakdown line items,
// contact footer) is reused from invoiceLabels so this stays a small,
// low-risk addition rather than a second full translation table.
const quotationExtra: Record<Locale, {
  title: string; ref: string; validUntil: string; estimateNotice: string;
  status: Record<Quotation['status'], string>;
}> = {
  en: { title: 'SAFARI QUOTATION', ref: 'Quotation Number', validUntil: 'Valid Until', estimateNotice: 'This is an estimated quotation for planning purposes. Final pricing is confirmed once lodge availability is checked for your dates.', status: { draft: 'DRAFT', sent: 'QUOTATION SENT', accepted: 'ACCEPTED', rejected: 'DECLINED' } },
  it: { title: 'PREVENTIVO SAFARI', ref: 'Numero preventivo', validUntil: 'Valido fino al', estimateNotice: 'Questo è un preventivo stimato a scopo di pianificazione. Il prezzo definitivo sarà confermato dopo aver verificato la disponibilità per le vostre date.', status: { draft: 'BOZZA', sent: 'PREVENTIVO INVIATO', accepted: 'ACCETTATO', rejected: 'RIFIUTATO' } },
  fr: { title: 'DEVIS SAFARI', ref: 'Numéro de devis', validUntil: 'Valable jusqu’au', estimateNotice: 'Ceci est un devis estimatif à titre indicatif. Le prix final sera confirmé après vérification de la disponibilité pour vos dates.', status: { draft: 'BROUILLON', sent: 'DEVIS ENVOYÉ', accepted: 'ACCEPTÉ', rejected: 'REFUSÉ' } },
  es: { title: 'PRESUPUESTO DE SAFARI', ref: 'Número de presupuesto', validUntil: 'Válido hasta', estimateNotice: 'Este es un presupuesto estimado con fines de planificación. El precio final se confirmará tras comprobar la disponibilidad para sus fechas.', status: { draft: 'BORRADOR', sent: 'PRESUPUESTO ENVIADO', accepted: 'ACEPTADO', rejected: 'RECHAZADO' } },
  de: { title: 'SAFARI-ANGEBOT', ref: 'Angebotsnummer', validUntil: 'Gültig bis', estimateNotice: 'Dies ist ein unverbindliches Angebot zur Planung. Der endgültige Preis wird nach Prüfung der Verfügbarkeit für Ihre Reisedaten bestätigt.', status: { draft: 'ENTWURF', sent: 'ANGEBOT VERSENDET', accepted: 'ANGENOMMEN', rejected: 'ABGELEHNT' } },
  ar: { title: 'عرض سعر سفاري', ref: 'رقم عرض السعر', validUntil: 'صالح حتى', estimateNotice: 'هذا عرض سعر تقديري لأغراض التخطيط. سيتم تأكيد السعر النهائي بعد التحقق من التوافر في التواريخ المطلوبة.', status: { draft: 'مسودة', sent: 'تم إرسال العرض', accepted: 'مقبول', rejected: 'مرفوض' } },
  zh: { title: 'SAFARI 报价单', ref: '报价单编号', validUntil: '有效期至', estimateNotice: '此为规划用途的估算报价。最终价格将在确认您所选日期的房源情况后确定。', status: { draft: '草稿', sent: '报价已发送', accepted: '已接受', rejected: '已拒绝' } },
  sw: { title: 'NUKUU YA SAFARI', ref: 'Nambari ya nukuu', validUntil: 'Inatumika hadi', estimateNotice: 'Hii ni nukuu ya makadirio kwa madhumuni ya kupanga. Bei ya mwisho itathibitishwa baada ya kuangalia upatikanaji wa malazi kwa tarehe zako.', status: { draft: 'RASIMU', sent: 'NUKUU IMETUMWA', accepted: 'IMEKUBALIWA', rejected: 'IMEKATALIWA' } },
};

export async function generateQuotationPDF(quotation: Quotation, requestedLocale?: Locale, documentUrl?: string): Promise<{ dataUrl: string; base64: string }> {
  const { jsPDF } = await import('jspdf');
  const locale = normalizeLocale(requestedLocale || quotation.locale);
  const L = invoiceLabels[locale];
  const Q = quotationExtra[locale];
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const font = await registerInvoiceFont(doc, locale);
  const logo = await loadBrandLogo();
  const stamp = await loadBrandStamp();
  const W = 210;
  const MARGIN = 14;
  const PRIMARY = [14, 116, 144];
  const ACCENT = [249, 115, 22];
  const TEXT = [31, 41, 55];
  const LIGHT = [100, 116, 139];
  const isArabic = locale === 'ar';
  const currency = quotation.currency || 'KES';
  let y = 14;

  const text = (value: string, x: number, yy: number, opts?: any) => doc.text(value || '—', x, yy, opts);
  const money = (n: number | null | undefined) => `${currency} ${Number(n || 0).toLocaleString('en-KE')}`;
  const section = (label: string) => {
    if (y > 255) { doc.addPage(); y = 18; }
    doc.setFillColor(248, 250, 252); doc.rect(MARGIN, y - 3, W - 2 * MARGIN, 8, 'F');
    doc.setFont(font, 'normal'); doc.setFontSize(9); doc.setTextColor(...(PRIMARY as [number, number, number]));
    text(label, MARGIN + 2, y + 2);
    y += 10;
  };
  const row = (label: string, value: string) => {
    doc.setFont(font, 'normal'); doc.setFontSize(8); doc.setTextColor(...(LIGHT as [number, number, number]));
    const lines = doc.splitTextToSize(value || '—', W - MARGIN - 78);
    if (y + Math.max(5, lines.length * 4) > 275) { doc.addPage(); y = 18; }
    text(label, MARGIN, y);
    doc.setTextColor(...(TEXT as [number, number, number]));
    text(lines, 80, y);
    y += Math.max(5, lines.length * 4);
  };

  // Header — white band with full-color logo top-left, contact info top-right
  // (same pattern as the invoice, so the quotation matches the rest of the
  // customer-facing document set instead of falling back to a text-only banner).
  doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, 40, 'F');
  drawBrandLogo(doc, logo, MARGIN, 9, 20);
  doc.setFont(font, 'normal'); doc.setFontSize(9); doc.setTextColor(...(PRIMARY as [number, number, number]));
  text(COMPANY.address + '  ·  ' + COMPANY.phone, W - MARGIN, 14, { align: 'right' });
  text(COMPANY.email, W - MARGIN, 20, { align: 'right' });
  doc.setFontSize(7.5); doc.setTextColor(...(LIGHT as [number, number, number])); text(L.founded, W - MARGIN, 26, { align: 'right' });
  doc.setDrawColor(...(PRIMARY as [number, number, number])); doc.setLineWidth(0.5); doc.line(0, 40, W, 40);

  // Quotation banner (orange, matching invoice style) with ref + status + valid-until
  doc.setFillColor(...(ACCENT as [number, number, number])); doc.rect(0, 40, W, 24, 'F');
  doc.setTextColor(255, 255, 255); doc.setFont(font, 'normal'); doc.setFontSize(8); text(Q.title, MARGIN, 47);
  doc.setFontSize(8); text(Q.ref, MARGIN, 53);
  doc.setFontSize(16); text(quotation.quotation_ref || '', MARGIN, 60);
  doc.setFontSize(8);
  text(`${L.status}: ${Q.status[quotation.status] || Q.status.sent}`, W - MARGIN, 53, { align: 'right' });
  const validUntilDate = quotation.expires_at
    || (quotation.created_at ? new Date(new Date(quotation.created_at).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString() : undefined);
  if (validUntilDate) text(`${Q.validUntil}: ${formatLocaleDate(validUntilDate, locale)}`, W - MARGIN, 59, { align: 'right' });
  y = 74;

  section(L.clientDetails);
  row(L.fullName, `${quotation.first_name} ${quotation.last_name}`);
  row(L.email, quotation.email);
  row(L.whatsapp, quotation.whatsapp || '—');
  if (quotation.nationality) row(L.nationality, quotation.nationality);
  row(L.guests, `${quotation.adults} ${L.adults}${quotation.children > 0 ? ` + ${quotation.children} ${L.children}` : ''}`);
  if (quotation.children > 0 && quotation.kids_ages?.length) row(L.childrenAges, quotation.kids_ages.join(', '));
  y += 5;

  section(L.travelDetails);
  row(L.safariTour, quotation.destination);
  row(L.arrivalDate, formatLocaleDate(quotation.arrival_date, locale));
  if (quotation.departure_date) row(L.departureDate, formatLocaleDate(quotation.departure_date, locale));
  if (quotation.duration_nights) row(L.parks, `${quotation.duration_nights} nights`);
  if (quotation.activities?.length) row(L.specialRequests, quotation.activities.join(', '));
  y += 5;

  section(L.costBreakdown);
  const costs = [
    [L.accommodation, quotation.accommodation_cost],
    [L.parkFees, quotation.park_fees],
    [L.guide, quotation.guide_cost],
    [L.transport, quotation.transport_cost],
    [L.meals, quotation.meals_cost],
    [L.other, quotation.other_costs],
  ] as [string, number | undefined][];
  let subtotal = 0;
  for (const [label, value] of costs) if (Number(value || 0) > 0) {
    subtotal += Number(value); doc.setFont(font, 'normal'); doc.setFontSize(8); doc.setTextColor(...(TEXT as [number, number, number])); text(label, MARGIN + 2, y); text(money(value), W - MARGIN - 2, y, { align: 'right' }); y += 5;
  }
  if (subtotal === 0) subtotal = Number(quotation.total_cost || 0) - Number(quotation.tax || 0) + Number(quotation.discount || 0);
  doc.setDrawColor(...(PRIMARY as [number, number, number])); doc.line(MARGIN + 2, y, W - MARGIN - 2, y); y += 5;
  doc.setFontSize(9); doc.setTextColor(...(PRIMARY as [number, number, number])); text(L.subtotal, MARGIN + 2, y); text(money(subtotal), W - MARGIN - 2, y, { align: 'right' }); y += 6;
  if (quotation.discount) { doc.setTextColor(34, 197, 94); doc.setFontSize(8); text(L.discount, MARGIN + 2, y); text(`-${currency} ${Number(quotation.discount).toLocaleString('en-KE')}`, W - MARGIN - 2, y, { align: 'right' }); y += 5; }
  if (quotation.tax) { doc.setTextColor(...(TEXT as [number, number, number])); doc.setFontSize(8); text(L.tax, MARGIN + 2, y); text(money(quotation.tax), W - MARGIN - 2, y, { align: 'right' }); y += 5; }
  doc.setFillColor(...(ACCENT as [number, number, number])); doc.rect(MARGIN, y - 2, W - 2 * MARGIN, 9, 'F'); doc.setTextColor(255, 255, 255); doc.setFontSize(11);
  text(Q.title === 'SAFARI QUOTATION' ? 'ESTIMATED TOTAL' : Q.title, MARGIN + 2, y + 4);
  text(money(quotation.total_cost), W - MARGIN - 2, y + 4, { align: 'right' });
  y += 14;

  // Estimate disclaimer — never presented as a confirmed price
  if (y > 255) { doc.addPage(); y = 18; }
  doc.setFillColor(255, 247, 237); doc.roundedRect(MARGIN, y, W - 2 * MARGIN, 16, 3, 3, 'F');
  doc.setTextColor(154, 52, 18); doc.setFont(font, 'normal'); doc.setFontSize(7.5);
  text(doc.splitTextToSize(Q.estimateNotice, W - 2 * MARGIN - 10), MARGIN + 5, y + 6);
  y += 24;

  section(L.important);
  doc.setFont(font, 'normal'); doc.setFontSize(7.5); doc.setTextColor(...(LIGHT as [number, number, number]));
  for (const term of L.terms as unknown as string[]) {
    const lines = doc.splitTextToSize(`• ${term}`, W - 2 * MARGIN - 4);
    if (y + lines.length * 4 > 270) { doc.addPage(); y = 18; }
    text(lines, MARGIN + 2, y); y += lines.length * 4;
  }
  y += 5;
  doc.setDrawColor(...(LIGHT as [number, number, number])); doc.line(MARGIN, y, W - MARGIN, y); y += 6;
  doc.setFontSize(8); text(L.confirm, MARGIN, y); y += 5; text(L.questions, MARGIN, y); y += 8;
  doc.setFontSize(7); text(`© 2026 Bahari Asili Safaris, Watamu, Kenya. ${L.founded}.`, W / 2, y, { align: 'center' });

  if (documentUrl) {
    const qr = await generateQrPngDataUrl(documentUrl);
    if (qr) {
      const qrSize = 20;
      if (y + qrSize > 285) { doc.addPage(); y = 18; }
      doc.addImage(qr, 'PNG', W - MARGIN - qrSize, y + 2, qrSize, qrSize);
      doc.setFontSize(6); doc.setTextColor(...(LIGHT as [number, number, number]));
      text('Scan to view PDF', W - MARGIN - qrSize, y + 2 + qrSize + 3, { align: 'left' });
    }
  }

  // Official digital stamp — same bottom-right treatment as the invoice.
  // Placed near the current y (the quotation has no fixed teal footer band),
  // so it sits just below the last printed line rather than overlapping text.
  drawStamp(doc, stamp, locale, { pageWidth: W, footerTopY: Math.min(y + 30, 283), dateFont: font !== 'helvetica' ? font : undefined });

  if (isArabic && typeof (doc as any).setR2L === 'function') (doc as any).setR2L(true);

  const dataUrl = doc.output('dataurlstring') as string;
  const binary = new Uint8Array(doc.output('arraybuffer') as ArrayBuffer);
  let raw = ''; for (let i = 0; i < binary.length; i++) raw += String.fromCharCode(binary[i]);
  return { dataUrl, base64: btoa(raw) };
}
