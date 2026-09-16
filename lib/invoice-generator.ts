import type { Booking } from './supabase';
import type { Locale } from './i18n';
import { invoiceLabels, normalizeLocale, formatLocaleDate } from './locale-content';
import { registerInvoiceFont } from './invoice-font';
import { BRAND_TEAL, BRAND_ORANGE, BRAND_OFFWHITE, COMPANY, loadBrandLogo, drawBrandLogo } from './pdf-brand';
import { loadBrandStamp, drawStamp } from './pdf-stamp';
import { generateQrPngDataUrl } from './qr';
import { safaris, excursions, DEFAULT_INCLUDED, DEFAULT_EXCLUDED } from './tours-data';
import { getLocalizedExcursion } from './excursion-content-i18n';

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

type TourDocumentDetails = {
  description?: string;
  duration?: string;
  location?: string;
  highlights: string[];
  itinerary: string[];
  included: string[];
  excluded: string[];
};

const documentLabels: Record<Locale, {
  invoiceTitle: string;
  tourDescription: string;
  itinerary: string;
  inclusions: string;
  exclusions: string;
  highlights: string;
  pickup: string;
  duration: string;
  provisionalNote: string;
}> = {
  en: { invoiceTitle: 'PROVISIONAL INVOICE / BOOKING QUOTE', tourDescription: 'TOUR DESCRIPTION', itinerary: 'SELECTED ITINERARY', inclusions: 'INCLUDED', exclusions: 'NOT INCLUDED', highlights: 'HIGHLIGHTS', pickup: 'STARTING / PICKUP LOCATION', duration: 'DURATION', provisionalNote: 'This provisional invoice is generated from the selected tour and traveller information. Final pricing, availability, accommodation and pickup details are confirmed by Bahari Asili Safaris before payment.' },
  it: { invoiceTitle: 'FATTURA PROVVISORIA / PREVENTIVO DI PRENOTAZIONE', tourDescription: 'DESCRIZIONE DEL TOUR', itinerary: 'ITINERARIO SELEZIONATO', inclusions: 'INCLUSO', exclusions: 'NON INCLUSO', highlights: 'PUNTI SALIENTI', pickup: 'LUOGO DI PARTENZA / RITIRO', duration: 'DURATA', provisionalNote: 'Questa fattura provvisoria è generata dai dettagli del tour e dai dati dei viaggiatori selezionati. Prezzo finale, disponibilità, sistemazione e ritiro saranno confermati da Bahari Asili Safaris prima del pagamento.' },
  fr: { invoiceTitle: 'FACTURE PROVISOIRE / DEVIS DE RÉSERVATION', tourDescription: 'DESCRIPTION DU CIRCUIT', itinerary: 'ITINÉRAIRE SÉLECTIONNÉ', inclusions: 'INCLUS', exclusions: 'NON INCLUS', highlights: 'POINTS FORTS', pickup: 'LIEU DE DÉPART / PRISE EN CHARGE', duration: 'DURÉE', provisionalNote: 'Cette facture provisoire est générée à partir du circuit et des informations voyageurs sélectionnés. Le prix final, la disponibilité, l’hébergement et la prise en charge seront confirmés par Bahari Asili Safaris avant paiement.' },
  es: { invoiceTitle: 'FACTURA PROVISIONAL / PRESUPUESTO DE RESERVA', tourDescription: 'DESCRIPCIÓN DEL TOUR', itinerary: 'ITINERARIO SELECCIONADO', inclusions: 'INCLUIDO', exclusions: 'NO INCLUIDO', highlights: 'DESTACADOS', pickup: 'LUGAR DE SALIDA / RECOGIDA', duration: 'DURACIÓN', provisionalNote: 'Esta factura provisional se genera a partir del tour y los datos de viajeros seleccionados. Bahari Asili Safaris confirmará el precio final, la disponibilidad, el alojamiento y la recogida antes del pago.' },
  de: { invoiceTitle: 'VORLÄUFIGE RECHNUNG / BUCHUNGSANGEBOT', tourDescription: 'TOURBESCHREIBUNG', itinerary: 'AUSGEWÄHLTE REISEROUTE', inclusions: 'INKLUSIVE', exclusions: 'NICHT INKLUSIVE', highlights: 'HIGHLIGHTS', pickup: 'START / ABHOLORT', duration: 'DAUER', provisionalNote: 'Diese vorläufige Rechnung wird anhand der ausgewählten Reise und Reisedaten erstellt. Der endgültige Preis, die Verfügbarkeit, Unterkunft und Abholung werden vor der Zahlung von Bahari Asili Safaris bestätigt.' },
  ar: { invoiceTitle: 'فاتورة مبدئية / عرض حجز', tourDescription: 'وصف الرحلة', itinerary: 'خط سير الرحلة المختار', inclusions: 'يشمل', exclusions: 'لا يشمل', highlights: 'أبرز التجربة', pickup: 'مكان الانطلاق / الاستلام', duration: 'المدة', provisionalNote: 'تم إنشاء هذه الفاتورة المبدئية من الرحلة وبيانات المسافرين المختارة. سيتم تأكيد السعر النهائي والتوفر والإقامة ومكان الاستلام من Bahari Asili Safaris قبل الدفع.' },
  zh: { invoiceTitle: '临时发票 / 预订报价', tourDescription: '行程描述', itinerary: '已选行程', inclusions: '包含', exclusions: '不包含', highlights: '行程亮点', pickup: '出发 / 接送地点', duration: '时长', provisionalNote: '此临时发票根据所选行程和旅客信息生成。最终价格、可用性、住宿和接送安排将在付款前由 Bahari Asili Safaris 确认。' },
  sw: { invoiceTitle: 'ANKARA YA MUDA / BEI YA UHIFADHI', tourDescription: 'MAELEZO YA SAFARI', itinerary: 'RATIBA ILIYOCHAGULIWA', inclusions: 'VINAVYOJUMUISHWA', exclusions: 'VISIVYOJUMUISHWA', highlights: 'MAMBO MUHIMU', pickup: 'MAHALI PA KUANZIA / KUCHUKULIA', duration: 'MUDA', provisionalNote: 'Ankara hii ya muda imetengenezwa kutokana na safari na taarifa za wasafiri zilizochaguliwa. Bei ya mwisho, upatikanaji, malazi na mahali pa kuchukuliwa vitathibitishwa na Bahari Asili Safaris kabla ya malipo.' },
};

function findTourDetails(name: string, locale: Locale): TourDocumentDetails {
  const normalized = name.trim().toLowerCase();
  const safari = safaris.find((s) => s.name.trim().toLowerCase() === normalized);
  if (safari) {
    return {
      description: safari.tagline,
      duration: `${safari.days} days / ${safari.nights} nights`,
      location: 'Watamu, Kenya',
      highlights: safari.highlights || [],
      itinerary: (safari.itinerary || []).map((d) => `${d.day}: ${d.title}\nMorning: ${d.morning}\nAfternoon: ${d.afternoon}\nOvernight: ${d.overnight}`),
      included: safari.included?.length ? safari.included : DEFAULT_INCLUDED,
      excluded: safari.excluded?.length ? safari.excluded : DEFAULT_EXCLUDED,
    };
  }

  const excursion = excursions.find((e: any) => {
    const candidates = [e.id, e.name, e.nameIt, e.nameEn, e.nameFr, e.nameDe, e.nameEs, e.nameAr, e.nameZh, e.nameSw].filter(Boolean).map((v: string) => v.trim().toLowerCase());
    if (candidates.includes(normalized)) return true;
    try { return getLocalizedExcursion(e, locale).name.trim().toLowerCase() === normalized; } catch { return false; }
  }) as any;

  if (excursion) {
    const content = getLocalizedExcursion(excursion, locale);
    return {
      description: content.description,
      duration: content.duration,
      location: content.startingLocation,
      highlights: content.highlights || [],
      itinerary: content.whatToExpect || [],
      included: content.included || [],
      excluded: content.notIncluded || [],
    };
  }

  return {
    description: 'The selected service will be arranged according to your request and confirmed by Bahari Asili Safaris.',
    highlights: [],
    itinerary: ['Your requested service details, timing and route will be confirmed with you before payment.'],
    included: [],
    excluded: [],
  };
}

export async function generatePremiumInvoicePDF(invoice: InvoiceData, requestedLocale?: Locale, documentUrl?: string): Promise<{ dataUrl: string; base64: string }> {
  const { jsPDF } = await import('jspdf');
  const locale = normalizeLocale(requestedLocale || invoice.locale);
  const L = invoiceLabels[locale];
  const D = documentLabels[locale];
  const tour = findTourDetails(invoice.safari_name, locale);
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
    doc.setFillColor(...PRIMARY); doc.rect(MARGIN, y - 3, W - 2 * MARGIN, 8, 'F');
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
  const bulletSection = (label: string, items: string[]) => {
    if (!items.length) return;
    section(label);
    doc.setFont(font, 'normal'); doc.setFontSize(7.7); doc.setTextColor(...TEXT);
    for (const item of items) {
      const lines = doc.splitTextToSize(`• ${item}`, W - 2 * MARGIN - 4);
      if (y + lines.length * 4 > 274) { doc.addPage(); y = 18; }
      text(lines, MARGIN + 2, y);
      y += lines.length * 4 + 1;
    }
    y += 3;
  };

  doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, 40, 'F');
  drawBrandLogo(doc, logo, MARGIN, 9, 20);
  doc.setFont(font, 'normal'); doc.setFontSize(9); doc.setTextColor(...PRIMARY);
  text(COMPANY.address + '  ·  ' + COMPANY.phone, W - MARGIN, 14, { align: 'right' });
  text(COMPANY.email, W - MARGIN, 20, { align: 'right' });
  doc.setFontSize(7.5); doc.setTextColor(...LIGHT); text(L.founded, W - MARGIN, 26, { align: 'right' });
  doc.setDrawColor(...PRIMARY); doc.setLineWidth(0.5); doc.line(0, 40, W, 40);

  doc.setFillColor(...ACCENT); doc.rect(0, 40, W, 18, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(8); text(D.invoiceTitle, MARGIN, 47);
  doc.setFontSize(16); text(invoice.booking_ref || '', MARGIN, 54);
  doc.setFontSize(8); text(`${L.status}: ${invoice.reservation_status === 'confirmed' ? L.confirmed : L.pending}`, W - MARGIN, 53, { align: 'right' });
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
  if (tour.duration) row(D.duration, tour.duration);
  if (tour.location) row(D.pickup, tour.location);
  if (invoice.message) row(L.specialRequests, invoice.message);
  y += 5;

  if (tour.description) {
    section(D.tourDescription);
    doc.setFont(font, 'normal'); doc.setFontSize(8); doc.setTextColor(...TEXT);
    const lines = doc.splitTextToSize(tour.description, W - 2 * MARGIN - 4);
    text(lines, MARGIN + 2, y); y += lines.length * 4 + 5;
  }

  bulletSection(D.highlights, tour.highlights);
  bulletSection(D.itinerary, tour.itinerary);
  bulletSection(D.inclusions, tour.included);
  bulletSection(D.exclusions, tour.excluded);

  const costs = [
    [L.accommodation, invoice.accommodation_cost],
    [L.parkFees, invoice.park_fees],
    [L.guide, invoice.guide_cost],
    [L.transport, invoice.transport_cost],
    [L.meals, invoice.meals_cost],
    [L.other, invoice.other_costs],
  ] as [string, number | undefined][];
  const hasBreakdown = costs.some(([, v]) => Number(v || 0) > 0) || Number(invoice.discount || 0) > 0 || Number(invoice.tax || 0) > 0;
  if (hasBreakdown) {
    section(L.costBreakdown);
    let subtotal = 0;
    for (const [label, value] of costs) if (Number(value || 0) > 0) {
      subtotal += Number(value);
      doc.setFont(font, 'normal'); doc.setFontSize(8); doc.setTextColor(...TEXT); text(label, MARGIN + 2, y); text(money(value), W - MARGIN - 2, y, { align: 'right' }); y += 5;
    }
    doc.setDrawColor(...PRIMARY); doc.line(MARGIN + 2, y, W - MARGIN - 2, y); y += 5;
    doc.setFontSize(9); doc.setTextColor(...PRIMARY); text(L.subtotal, MARGIN + 2, y); text(money(subtotal), W - MARGIN - 2, y, { align: 'right' }); y += 6;
    if (invoice.discount) { doc.setTextColor(34, 197, 94); doc.setFontSize(8); text(L.discount, MARGIN + 2, y); text(`-KES ${Number(invoice.discount).toLocaleString('en-KE')}`, W - MARGIN - 2, y, { align: 'right' }); y += 5; }
    if (invoice.tax) { doc.setTextColor(...TEXT); doc.setFontSize(8); text(L.tax, MARGIN + 2, y); text(money(invoice.tax), W - MARGIN - 2, y, { align: 'right' }); y += 5; }
    const total = subtotal - Number(invoice.discount || 0) + Number(invoice.tax || 0);
    doc.setFillColor(...ACCENT); doc.rect(MARGIN, y - 2, W - 2 * MARGIN, 9, 'F'); doc.setTextColor(255, 255, 255); doc.setFontSize(11); text(L.total, MARGIN + 2, y + 4); text(money(total), W - MARGIN - 2, y + 4, { align: 'right' }); y += 14;
  } else if (invoice.total_price != null) {
    section(L.costBreakdown);
    doc.setFont(font, 'normal'); doc.setFontSize(11); doc.setTextColor(...PRIMARY); text(L.total, MARGIN + 2, y); text(money(invoice.total_price), W - MARGIN - 2, y, { align: 'right' }); y += 10;
  }

  section(L.important);
  doc.setFont(font, 'normal'); doc.setFontSize(7.5); doc.setTextColor(...LIGHT);
  for (const term of L.terms) {
    const lines = doc.splitTextToSize(`• ${term}`, W - 2 * MARGIN - 4);
    if (y + lines.length * 4 > 270) { doc.addPage(); y = 18; }
    text(lines, MARGIN + 2, y); y += lines.length * 4;
  }
  y += 3;
  if (y + 30 > 279) { doc.addPage(); y = 18; }
  doc.setFont(font, 'normal'); doc.setFontSize(7.5); doc.setTextColor(...LIGHT);
  const noteLines = doc.splitTextToSize(D.provisionalNote, W - 2 * MARGIN - 4);
  text(noteLines, MARGIN + 2, y); y += noteLines.length * 4 + 6;
  doc.setDrawColor(...LIGHT); doc.line(MARGIN, y, W - MARGIN, y); y += 6;
  doc.setFontSize(8); doc.setTextColor(...TEXT); text(L.confirm, MARGIN, y); y += 5; text(L.questions, MARGIN, y);

  doc.setFillColor(...PRIMARY); doc.rect(0, 283, W, 14, 'F');
  doc.setFont(font, 'normal'); doc.setFontSize(7.5); doc.setTextColor(...OFFWHITE);
  text(`© 2026 Bahari Asili Safaris, Watamu, Kenya. ${L.founded}.`, W / 2, 289, { align: 'center' });
  text(`${COMPANY.website}  ·  ${COMPANY.email}  ·  ${COMPANY.phone}`, W / 2, 294, { align: 'center' });

  if (documentUrl) {
    const qr = await generateQrPngDataUrl(documentUrl);
    if (qr) {
      const qrSize = 16;
      doc.addImage(qr, 'PNG', MARGIN, 283 - qrSize - 2, qrSize, qrSize);
    }
  }

  drawStamp(doc, stamp, locale, { pageWidth: W, footerTopY: 283, dateFont: font !== 'helvetica' ? font : undefined });
  if (isArabic && typeof (doc as any).setR2L === 'function') (doc as any).setR2L(true);

  const dataUrl = doc.output('dataurlstring') as string;
  const binary = new Uint8Array(doc.output('arraybuffer') as ArrayBuffer);
  let raw = ''; for (let i = 0; i < binary.length; i++) raw += String.fromCharCode(binary[i]);
  return { dataUrl, base64: btoa(raw) };
}
