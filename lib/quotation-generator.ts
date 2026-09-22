import type { Quotation } from './supabase';
import type { Locale } from './i18n';
import { invoiceLabels, normalizeLocale, formatLocaleDate } from './locale-content';
import { registerInvoiceFont } from './invoice-font';
import { generateQrPngDataUrl } from './qr';
import { COMPANY, loadBrandLogo, drawBrandLogo } from './pdf-brand';
import { loadBrandStamp, drawStamp } from './pdf-stamp';

const quotationExtra: Record<Locale, {
  title: string; ref: string; validUntil: string; issueDate: string; estimateNotice: string;
  status: Record<Quotation['status'], string>; billTo: string; tripSummary: string;
  packageDescription: string; itinerary: string; inclusions: string; payment: string;
  terms: string; total: string; grandTotal: string; quantity: string; unitPrice: string; amount: string;
  nights: string; guests: string; bookingReference: string; activities: string; location: string;
}> = {
  en: { title: 'QUOTED INVOICE', ref: 'Quotation No.', validUntil: 'Valid Until', issueDate: 'Issue Date', estimateNotice: 'This quotation is prepared from the costs approved by Bahari Asili Safaris. Accommodation, park and supplier availability remains subject to confirmation.', status: { draft: 'DRAFT', sent: 'SENT', accepted: 'ACCEPTED', rejected: 'DECLINED' }, billTo: 'BILL TO', tripSummary: 'TRIP DETAILS', packageDescription: 'PACKAGE DESCRIPTION', itinerary: 'DAY-BY-DAY ITINERARY', inclusions: 'INCLUSIONS & EXCLUSIONS', payment: 'PAYMENT INFORMATION', terms: 'TERMS & CONDITIONS', total: 'GRAND TOTAL', grandTotal: 'GRAND TOTAL', quantity: 'QTY', unitPrice: 'UNIT PRICE', amount: 'AMOUNT', nights: 'nights', guests: 'Guests', bookingReference: 'Booking Reference', activities: 'Activities', location: 'Location' },
  it: { title: 'FATTURA PREVENTIVA', ref: 'N. preventivo', validUntil: 'Valido fino al', issueDate: 'Data emissione', estimateNotice: 'Preventivo preparato sulla base dei costi approvati da Bahari Asili Safaris. La disponibilità di alloggi, parchi e fornitori resta soggetta a conferma.', status: { draft: 'BOZZA', sent: 'INVIATO', accepted: 'ACCETTATO', rejected: 'RIFIUTATO' }, billTo: 'CLIENTE', tripSummary: 'DETTAGLI DEL VIAGGIO', packageDescription: 'DESCRIZIONE DEL PACCHETTO', itinerary: 'ITINERARIO GIORNO PER GIORNO', inclusions: 'INCLUSO ED ESCLUSO', payment: 'INFORMAZIONI DI PAGAMENTO', terms: 'TERMINI E CONDIZIONI', total: 'TOTALE PREVENTIVATO', grandTotal: 'TOTALE GENERALE', quantity: 'QTÀ', unitPrice: 'PREZZO UNITARIO', amount: 'IMPORTO', nights: 'notti', guests: 'Ospiti', bookingReference: 'Riferimento prenotazione', activities: 'Attività', location: 'Località' },
  fr: { title: 'FACTURE DEVIS', ref: 'N° du devis', validUntil: 'Valable jusqu’au', issueDate: 'Date d’émission', estimateNotice: 'Devis préparé à partir des coûts approuvés par Bahari Asili Safaris. La disponibilité des hébergements, parcs et fournisseurs reste soumise à confirmation.', status: { draft: 'BROUILLON', sent: 'ENVOYÉ', accepted: 'ACCEPTÉ', rejected: 'REFUSÉ' }, billTo: 'FACTURÉ À', tripSummary: 'DÉTAILS DU VOYAGE', packageDescription: 'DESCRIPTION DU FORFAIT', itinerary: 'ITINÉRAIRE JOUR PAR JOUR', inclusions: 'INCLUSIONS ET EXCLUSIONS', payment: 'INFORMATIONS DE PAIEMENT', terms: 'TERMES ET CONDITIONS', total: 'TOTAL DU DEVIS', grandTotal: 'TOTAL GÉNÉRAL', quantity: 'QTÉ', unitPrice: 'PRIX UNITAIRE', amount: 'MONTANT', nights: 'nuits', guests: 'Voyageurs', bookingReference: 'Référence de réservation', activities: 'Activités', location: 'Lieu' },
  es: { title: 'FACTURA PRESUPUESTADA', ref: 'N.º de presupuesto', validUntil: 'Válido hasta', issueDate: 'Fecha de emisión', estimateNotice: 'Presupuesto preparado con los costes aprobados por Bahari Asili Safaris. La disponibilidad de alojamientos, parques y proveedores queda sujeta a confirmación.', status: { draft: 'BORRADOR', sent: 'ENVIADO', accepted: 'ACEPTADO', rejected: 'RECHAZADO' }, billTo: 'FACTURAR A', tripSummary: 'DETALLES DEL VIAJE', packageDescription: 'DESCRIPCIÓN DEL PAQUETE', itinerary: 'ITINERARIO DÍA A DÍA', inclusions: 'INCLUSIONES Y EXCLUSIONES', payment: 'INFORMACIÓN DE PAGO', terms: 'TÉRMINOS Y CONDICIONES', total: 'TOTAL PRESUPUESTADO', grandTotal: 'TOTAL GENERAL', quantity: 'CANT.', unitPrice: 'PRECIO UNITARIO', amount: 'IMPORTE', nights: 'noches', guests: 'Viajeros', bookingReference: 'Referencia de reserva', activities: 'Actividades', location: 'Ubicación' },
  de: { title: 'KOSTENVORANSCHLAG', ref: 'Angebotsnr.', validUntil: 'Gültig bis', issueDate: 'Ausstellungsdatum', estimateNotice: 'Angebot auf Grundlage der von Bahari Asili Safaris genehmigten Kosten. Die Verfügbarkeit von Unterkünften, Parks und Anbietern muss noch bestätigt werden.', status: { draft: 'ENTWURF', sent: 'GESENDET', accepted: 'ANGENOMMEN', rejected: 'ABGELEHNT' }, billTo: 'RECHNUNGSADRESSE', tripSummary: 'REISEDATEN', packageDescription: 'PAKETBESCHREIBUNG', itinerary: 'TAGESPROGRAMM', inclusions: 'INKLUSIVE & EXKLUSIVE LEISTUNGEN', payment: 'ZAHLUNGSINFORMATIONEN', terms: 'GESCHÄFTSBEDINGUNGEN', total: 'GESAMTANGEBOT', grandTotal: 'GESAMT', quantity: 'MENGE', unitPrice: 'EINZELPREIS', amount: 'BETRAG', nights: 'Nächte', guests: 'Gäste', bookingReference: 'Buchungsreferenz', activities: 'Aktivitäten', location: 'Ort' },
  ar: { title: 'فاتورة عرض سعر', ref: 'رقم العرض', validUntil: 'صالح حتى', issueDate: 'تاريخ الإصدار', estimateNotice: 'تم إعداد عرض السعر بناءً على التكاليف المعتمدة من Bahari Asili Safaris. توافر أماكن الإقامة والمتنزهات والموردين خاضع للتأكيد.', status: { draft: 'مسودة', sent: 'مرسل', accepted: 'مقبول', rejected: 'مرفوض' }, billTo: 'الفاتورة إلى', tripSummary: 'تفاصيل الرحلة', packageDescription: 'وصف الباقة', itinerary: 'برنامج الرحلة اليومي', inclusions: 'المشمول وغير المشمول', payment: 'معلومات الدفع', terms: 'الشروط والأحكام', total: 'إجمالي العرض', grandTotal: 'الإجمالي النهائي', quantity: 'الكمية', unitPrice: 'سعر الوحدة', amount: 'المبلغ', nights: 'ليالٍ', guests: 'المسافرون', bookingReference: 'مرجع الحجز', activities: 'الأنشطة', location: 'الموقع' },
  zh: { title: '报价发票', ref: '报价编号', validUntil: '有效期至', issueDate: '签发日期', estimateNotice: '本报价依据 Bahari Asili Safaris 批准的费用编制。住宿、公园和供应商服务的可用性仍需确认。', status: { draft: '草稿', sent: '已发送', accepted: '已接受', rejected: '已拒绝' }, billTo: '账单信息', tripSummary: '行程详情', packageDescription: '套餐说明', itinerary: '每日行程', inclusions: '包含与不包含', payment: '付款信息', terms: '条款与条件', total: '报价总额', grandTotal: '总计', quantity: '数量', unitPrice: '单价', amount: '金额', nights: '晚', guests: '客人', bookingReference: '预订参考号', activities: '活动', location: '地点' },
  sw: { title: 'ANKARA YA BEI', ref: 'Nambari ya nukuu', validUntil: 'Inatumika hadi', issueDate: 'Tarehe ya kutolewa', estimateNotice: 'Nukuu hii imeandaliwa kwa kutumia gharama zilizoidhinishwa na Bahari Asili Safaris. Upatikanaji wa malazi, mbuga na huduma za wasambazaji bado unahitaji uthibitisho.', status: { draft: 'RASIMU', sent: 'IMETUMWA', accepted: 'IMEKUBALIWA', rejected: 'IMEKATALIWA' }, billTo: 'MTEJA', tripSummary: 'MAELEZO YA SAFARI', packageDescription: 'MAELEZO YA KIFURUSHI', itinerary: 'RATIBA YA KILA SIKU', inclusions: 'VINAVYOJUMUISHWA NA VISIVYOJUMUISHWA', payment: 'TAARIFA ZA MALIPO', terms: 'MASHARTI NA VIGEZO', total: 'JUMLA YA NUKUU', grandTotal: 'JUMLA KUU', quantity: 'IDADI', unitPrice: 'BEI YA KIMOJA', amount: 'KIASI', nights: 'usiku', guests: 'Wasafiri', bookingReference: 'Kumbukumbu ya nafasi', activities: 'Shughuli', location: 'Mahali' },
};

type ItineraryDay = { day: number | string; title: string; location?: string; description?: string; morning?: string; afternoon?: string; overnight?: string };

export async function generateQuotationPDF(quotation: Quotation, requestedLocale?: Locale, documentUrl?: string): Promise<{ dataUrl: string; base64: string }> {
  const { jsPDF } = await import('jspdf');
  const locale = normalizeLocale(requestedLocale || quotation.locale);
  const L = invoiceLabels[locale];
  const Q = quotationExtra[locale];
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const font = await registerInvoiceFont(doc, locale);
  const logo = await loadBrandLogo();
  const stamp = await loadBrandStamp();
  const W = 210, H = 297, M = 14;
  const PRIMARY = [14, 116, 144] as [number, number, number];
  const ACCENT = [249, 115, 22] as [number, number, number];
  const TEXT = [31, 41, 55] as [number, number, number];
  const MUTED = [100, 116, 139] as [number, number, number];
  const BORDER = [226, 232, 240] as [number, number, number];
  const SOFT = [248, 250, 252] as [number, number, number];
  const WHITE = [255, 255, 255] as [number, number, number];
  const currency = quotation.currency || 'KES';
  let y = 14;

  const safe = (v: unknown) => String(v ?? '').trim() || '—';
  const money = (n: number | null | undefined) => `${currency} ${Number(n || 0).toLocaleString('en-KE')}`;
  const setFont = (style: 'normal' | 'bold', size: number, color: [number, number, number] = TEXT) => { doc.setFont(font, style); doc.setFontSize(size); doc.setTextColor(...color); };
  const drawPageChrome = () => { doc.setDrawColor(...BORDER); doc.setLineWidth(0.25); doc.line(M, H - 14, W - M, H - 14); setFont('normal', 7, MUTED); doc.text('Bahari Asili Safaris  ·  Watamu, Kenya', M, H - 8); doc.text(`Page ${doc.getNumberOfPages()}`, W - M, H - 8, { align: 'right' }); };
  const newPage = () => { doc.addPage(); y = 18; };
  const ensure = (height: number) => { if (y + height > 276) newPage(); };
  const section = (label: string) => { ensure(13); doc.setFillColor(...SOFT); doc.roundedRect(M, y, W - 2 * M, 8, 1.5, 1.5, 'F'); setFont('bold', 8.5, PRIMARY); doc.text(label.toUpperCase(), M + 3, y + 5.2); y += 12; };
  const paragraph = (value: string, size = 8.2, color = TEXT, lineHeight = 4.1) => { const lines = doc.splitTextToSize(safe(value), W - 2 * M); setFont('normal', size, color); for (const line of lines) { ensure(lineHeight + 1); doc.text(line, M, y); y += lineHeight; } };

  // Header: the official full-colour logo is the single brand mark.
  // The logo already contains the complete BAHARI ASILI SAFARIS wordmark,
  // so no second text copy is drawn beside it.
  const logoHeight = 25;
  const logoWidth = drawBrandLogo(doc, logo, M, 8, logoHeight);
  const contactX = M + logoWidth + 5;
  setFont('normal', 7.5, MUTED); doc.text(safe(COMPANY.address), contactX, 14); doc.text(safe(COMPANY.phone), contactX, 19); doc.text(safe(COMPANY.email), contactX, 24);
  setFont('bold', 21, TEXT); doc.text(Q.title, W - M, 15, { align: 'right' });
  setFont('bold', 8, PRIMARY); doc.text(`${Q.ref}  ${safe(quotation.quotation_ref)}`, W - M, 22, { align: 'right' });
  setFont('normal', 7.5, MUTED); doc.text(`${Q.issueDate}: ${formatLocaleDate(quotation.created_at || new Date().toISOString(), locale)}`, W - M, 27, { align: 'right' });
  const validUntil = quotation.expires_at || (quotation.created_at ? new Date(new Date(quotation.created_at).getTime() + 30 * 86400000).toISOString() : undefined);
  if (validUntil) doc.text(`${Q.validUntil}: ${formatLocaleDate(validUntil, locale)}`, W - M, 32, { align: 'right' });
  doc.setDrawColor(...PRIMARY); doc.setLineWidth(0.6); doc.line(M, 38, W - M, 38); y = 45;

  // Status and booking reference strip.
  doc.setFillColor(...ACCENT); doc.roundedRect(M, y - 3, W - 2 * M, 11, 2, 2, 'F'); setFont('bold', 8, WHITE); doc.text(Q.status[quotation.status] || Q.status.sent, M + 4, y + 4); setFont('normal', 7.5, WHITE); doc.text(`${Q.bookingReference}: ${safe(quotation.booking_ref)}`, W - M - 4, y + 4, { align: 'right' }); y += 17;

  section(Q.billTo);
  const billY = y;
  doc.setDrawColor(...BORDER); doc.roundedRect(M, billY - 3, 88, 35, 2, 2, 'S'); doc.roundedRect(M + 94, billY - 3, W - M - (M + 94), 35, 2, 2, 'S');
  setFont('bold', 11, TEXT); doc.text(safe(`${quotation.first_name} ${quotation.last_name}`), M + 5, billY + 5);
  setFont('normal', 8, MUTED); doc.text(safe(quotation.email), M + 5, billY + 11); doc.text(safe(quotation.whatsapp), M + 5, billY + 16); if (quotation.nationality) doc.text(safe(quotation.nationality), M + 5, billY + 21);
  setFont('bold', 7.2, MUTED); doc.text(Q.guests.toUpperCase(), M + 99, billY + 5); setFont('normal', 8.5, TEXT); doc.text(`${quotation.adults} adults${quotation.children ? `  ·  ${quotation.children} children` : ''}`, M + 99, billY + 11);
  if (quotation.children && quotation.kids_ages?.length) { setFont('normal', 7.5, MUTED); doc.text(`Ages: ${quotation.kids_ages.join(', ')}`, M + 99, billY + 17); }
  setFont('bold', 7.2, MUTED); doc.text(Q.bookingReference.toUpperCase(), M + 99, billY + 23); setFont('bold', 9, PRIMARY); doc.text(safe(quotation.booking_ref), M + 99, billY + 29); y = billY + 40;

  section(Q.tripSummary);
  const tripRows: [string, string][] = [
    [L.safariTour || 'Safari / Tour', safe(quotation.destination)],
    [L.arrivalDate || 'Arrival', formatLocaleDate(quotation.arrival_date, locale)],
    [L.departureDate || 'Departure', formatLocaleDate(quotation.departure_date, locale)],
    [L.parks || 'Duration', `${quotation.duration_nights} ${Q.nights}`],
    [Q.activities, safe(quotation.activities?.join(', '))],
    [L.accommodation || 'Accommodation', safe(quotation.accommodation_type)],
  ];
  for (let i = 0; i < tripRows.length; i += 2) {
    ensure(12); const a = tripRows[i], b = tripRows[i + 1]; setFont('bold', 7, MUTED); doc.text(a[0].toUpperCase(), M, y); doc.text(b[0].toUpperCase(), 108, y); setFont('normal', 8.2, TEXT); doc.text(doc.splitTextToSize(a[1], 82), M, y + 4); doc.text(doc.splitTextToSize(b[1], 82), 108, y + 4); y += 11;
  }
  y += 2;

  if (quotation.package_description) { section(Q.packageDescription); paragraph(quotation.package_description); y += 3; }

  // Accounting-grade itemised cost table. Amounts are supplied by the admin quotation; no public/package pricing is inferred here.
  section(L.costBreakdown || 'Cost Breakdown');
  const costRows = [
    [L.accommodation || 'Accommodation', quotation.accommodation_cost],
    [L.parkFees || 'Park / conservation fees', quotation.park_fees],
    [L.guide || 'Professional guide', quotation.guide_cost],
    [L.transport || 'Safari transport', quotation.transport_cost],
    [L.meals || 'Meals', quotation.meals_cost],
    [L.other || 'Other services', quotation.other_costs],
  ] as [string, number | undefined][];
  const xQty = 126, xUnit = 157, xAmt = W - M - 2;
  doc.setFillColor(...PRIMARY); doc.rect(M, y - 2, W - 2 * M, 9, 'F'); setFont('bold', 7.5, WHITE); doc.text('DESCRIPTION', M + 3, y + 4); doc.text(Q.quantity, xQty, y + 4, { align: 'center' }); doc.text(Q.unitPrice, xUnit + 5, y + 4, { align: 'right' }); doc.text(Q.amount, xAmt, y + 4, { align: 'right' }); y += 10;
  let subtotal = 0;
  for (const [label, value] of costRows) {
    if (Number(value || 0) <= 0) continue;
    subtotal += Number(value); ensure(8); doc.setDrawColor(...BORDER); doc.line(M, y + 4, W - M, y + 4); setFont('normal', 8.2, TEXT); doc.text(label, M + 3, y); setFont('normal', 7.8, MUTED); doc.text('1', xQty, y, { align: 'center' }); setFont('normal', 8.2, TEXT); doc.text(money(value), xUnit + 5, y, { align: 'right' }); doc.text(money(value), xAmt, y, { align: 'right' }); y += 8;
  }
  if (subtotal === 0) subtotal = Number(quotation.total_cost || 0) - Number(quotation.tax || 0) + Number(quotation.discount || 0);
  ensure(31); const summaryX = 122; doc.setDrawColor(...BORDER); doc.line(summaryX, y, W - M, y); y += 6;
  const summaryRow = (label: string, value: string) => { setFont('normal', 8.3, MUTED); doc.text(label, summaryX, y); setFont('normal', 8.3, TEXT); doc.text(value, W - M, y, { align: 'right' }); y += 6; };
  summaryRow(L.subtotal || 'Subtotal', money(subtotal));
  if (quotation.discount) summaryRow(L.discount || 'Discount', `- ${money(quotation.discount)}`);
  if (quotation.tax) summaryRow(L.tax || 'Tax / VAT', money(quotation.tax));
  doc.setFillColor(...ACCENT); doc.roundedRect(summaryX - 3, y - 3, W - M - summaryX + 3, 12, 2, 2, 'F'); setFont('bold', 9.5, WHITE); doc.text(Q.grandTotal || Q.total, summaryX, y + 4.2); setFont('bold', 11.5, WHITE); doc.text(money(quotation.total_cost), W - M - 3, y + 4.2, { align: 'right' }); y += 18;

  const itinerary = (quotation.itinerary || []) as ItineraryDay[];
  if (itinerary.length) {
    section(Q.itinerary);
    for (const day of itinerary) {
      ensure(30); doc.setFillColor(...PRIMARY); doc.roundedRect(M, y - 2, 25, 7, 1.5, 1.5, 'F'); setFont('bold', 7.5, WHITE); doc.text(`DAY ${safe(day.day)}`, M + 12.5, y + 2.7, { align: 'center' }); setFont('bold', 9.5, TEXT); doc.text(safe(day.title), M + 30, y + 3); y += 8;
      if (day.location) { setFont('bold', 7, MUTED); doc.text(Q.location.toUpperCase(), M + 30, y); setFont('normal', 8, TEXT); doc.text(safe(day.location), M + 50, y); y += 5; }
      const blocks: [string, string | undefined][] = [['', day.description], ['Morning', day.morning], ['Afternoon', day.afternoon], ['Overnight', day.overnight]];
      for (const [label, value] of blocks) {
        if (!value) continue; const lines = doc.splitTextToSize(safe(value), W - 2 * M - 30); ensure(lines.length * 3.8 + 3); if (label) { setFont('bold', 7, MUTED); doc.text(label.toUpperCase(), M + 30, y); y += 3.5; } setFont('normal', 7.8, TEXT); doc.text(lines, M + 30, y); y += lines.length * 3.8 + 3;
      }
      y += 2;
    }
  }

  if (quotation.inclusions?.length || quotation.exclusions?.length) {
    section(Q.inclusions); const left = quotation.inclusions || [], right = quotation.exclusions || [], max = Math.max(left.length, right.length);
    for (let i = 0; i < max; i++) { ensure(7); setFont('normal', 7.8, TEXT); if (left[i]) doc.text(`✓ ${safe(left[i])}`, M + 2, y); if (right[i]) doc.text(`— ${safe(right[i])}`, 108, y); y += 5; } y += 3;
  }

  section(Q.payment);
  paragraph(quotation.payment_instructions || 'Payment instructions and accepted payment methods will be provided by Bahari Asili Safaris. Please quote the booking reference when making payment.', 8);
  y += 3;
  section(Q.terms);
  paragraph(quotation.terms || 'This quotation is subject to availability. Prices are based on the services, group size and travel dates stated above. Changes to dates, accommodation, group size or requested services may change the quoted amount. Cancellation and payment conditions apply as communicated by Bahari Asili Safaris.', 7.8, MUTED, 3.8);

  ensure(34); doc.setFillColor(...SOFT); doc.roundedRect(M, y, W - 2 * M, 24, 2, 2, 'F'); setFont('bold', 8.5, PRIMARY); doc.text('IMPORTANT', M + 4, y + 6); setFont('normal', 7.4, MUTED); const noticeLines = doc.splitTextToSize(Q.estimateNotice, W - 2 * M - 8); doc.text(noticeLines, M + 4, y + 11); y += 30;

  if (documentUrl) { const qr = await generateQrPngDataUrl(documentUrl); if (qr) { ensure(30); doc.addImage(qr, 'PNG', M, y, 22, 22); setFont('normal', 6.5, MUTED); doc.text('Scan to view this document online', M, y + 26); y += 30; } }

  // Digital stamp is retained, but never allowed to overlap the financial table or terms.
  drawStamp(doc, stamp, locale, { pageWidth: W, footerTopY: Math.min(y + 3, H - 34), dateFont: font !== 'helvetica' ? font : undefined });
  for (let p = 1; p <= doc.getNumberOfPages(); p++) { doc.setPage(p); drawPageChrome(); }

  const dataUrl = doc.output('dataurlstring') as string;
  const binary = new Uint8Array(doc.output('arraybuffer') as ArrayBuffer);
  let raw = ''; const chunk = 0x8000;
  for (let i = 0; i < binary.length; i += chunk) raw += String.fromCharCode(...binary.subarray(i, Math.min(i + chunk, binary.length)));
  return { dataUrl, base64: btoa(raw) };
}
