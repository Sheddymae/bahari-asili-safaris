import type { Locale } from './i18n';
import { normalizeLocale, formatLocaleDate } from './locale-content';
import { registerInvoiceFont } from './invoice-font';
import { BRAND_TEAL, BRAND_ORANGE, BRAND_OFFWHITE, BRAND_TEXT, BRAND_LIGHT, COMPANY, loadBrandLogo, drawBrandLogo } from './pdf-brand';

export interface CustomerInvoicePackage {
  name: string;
  tagline?: string;
  days?: number;
  nights?: number;
  parks?: string[];
  lodges?: string[];
  category?: string;
  rating?: number;
  reviewCount?: number;
  activityLevel?: number;
  comfortLevel?: number;
  highlights?: string[];
  itinerary?: Array<{
    day: number | string;
    title?: string;
    location?: string;
    description?: string;
    morning?: string;
    afternoon?: string;
    overnight?: string;
  }>;
  packingTips?: string[];
  included?: string[];
  excluded?: string[];
}

export interface CustomerInvoiceCostBreakdown {
  accommodation_cost?: number | null;
  park_fees?: number | null;
  guide_cost?: number | null;
  transport_cost?: number | null;
  meals_cost?: number | null;
  other_costs?: number | null;
  discount?: number | null;
  tax?: number | null;
  total_cost?: number | null;
  currency?: string | null;
}

export interface CustomerInvoiceInput {
  booking_ref: string;
  first_name: string;
  last_name: string;
  email: string;
  whatsapp?: string | null;
  nationality?: string | null;
  adults: number;
  children: number;
  kids_ages?: number[] | null;
  arrival_date: string;
  departure_date?: string | null;
  safari_name: string;
  message?: string | null;
  reservation_status?: string | null;
  locale?: Locale | string | null;
  package: CustomerInvoicePackage;
  costs?: CustomerInvoiceCostBreakdown | null;
}

const labels: Record<Locale, Record<string, string>> = {
  en: { title: 'PROVISIONAL INVOICE / BOOKING QUOTE', client: 'TRAVELLER DETAILS', trip: 'TRIP DETAILS', package: 'SELECTED PACKAGE', itinerary: 'FULL DAY-BY-DAY ITINERARY', highlights: 'PACKAGE HIGHLIGHTS', included: 'INCLUDED', excluded: 'NOT INCLUDED', packing: 'PACKING & TRAVEL NOTES', costs: 'COST BREAKDOWN', subtotal: 'Subtotal', discount: 'Discount', tax: 'Tax / VAT', total: 'TOTAL', quoteOnly: 'Pricing to be confirmed', name: 'Name', email: 'Email', whatsapp: 'WhatsApp', nationality: 'Nationality', guests: 'Travellers', childrenAges: 'Children ages', arrival: 'Arrival / Start date', departure: 'Departure / End date', duration: 'Duration', parks: 'Parks / destinations', lodges: 'Accommodation', rating: 'Rating', category: 'Package type', activity: 'Activity level', comfort: 'Comfort level', requests: 'Special requests', status: 'Status', pending: 'Pending confirmation', morning: 'Morning', afternoon: 'Afternoon', overnight: 'Overnight', day: 'Day', notes: 'Notes', footer: 'This provisional invoice is based on the package and traveller information selected online. Final availability, accommodation, routing and pricing are confirmed by Bahari Asili Safaris before payment.' },
  it: { title: 'FATTURA PROVVISORIA / PREVENTIVO DI PRENOTAZIONE', client: 'DATI DEL VIAGGIATORE', trip: 'DETTAGLI DEL VIAGGIO', package: 'PACCHETTO SELEZIONATO', itinerary: 'ITINERARIO COMPLETO GIORNO PER GIORNO', highlights: 'PUNTI SALIENTI', included: 'INCLUSO', excluded: 'NON INCLUSO', packing: 'NOTE DI VIAGGIO E BAGAGLIO', costs: 'DETTAGLIO DEI COSTI', subtotal: 'Subtotale', discount: 'Sconto', tax: 'Imposte / IVA', total: 'TOTALE', quoteOnly: 'Prezzo da confermare', name: 'Nome', email: 'Email', whatsapp: 'WhatsApp', nationality: 'Nazionalità', guests: 'Viaggiatori', childrenAges: 'Età bambini', arrival: 'Data di arrivo / inizio', departure: 'Data di partenza / fine', duration: 'Durata', parks: 'Parchi / destinazioni', lodges: 'Sistemazione', rating: 'Valutazione', category: 'Tipo di pacchetto', activity: 'Livello attività', comfort: 'Livello comfort', requests: 'Richieste speciali', status: 'Stato', pending: 'In attesa di conferma', morning: 'Mattina', afternoon: 'Pomeriggio', overnight: 'Pernottamento', day: 'Giorno', notes: 'Note', footer: 'Questa fattura provvisoria si basa sul pacchetto e sui dati dei viaggiatori selezionati online. Disponibilità, sistemazione, percorso e prezzo finale saranno confermati da Bahari Asili Safaris prima del pagamento.' },
  fr: { title: 'FACTURE PROVISOIRE / DEVIS DE RÉSERVATION', client: 'INFORMATIONS VOYAGEUR', trip: 'DÉTAILS DU VOYAGE', package: 'FORFAIT SÉLECTIONNÉ', itinerary: 'ITINÉRAIRE COMPLET JOUR PAR JOUR', highlights: 'POINTS FORTS', included: 'INCLUS', excluded: 'NON INCLUS', packing: 'BAGAGES ET NOTES DE VOYAGE', costs: 'DÉTAIL DES COÛTS', subtotal: 'Sous-total', discount: 'Remise', tax: 'Taxes / TVA', total: 'TOTAL', quoteOnly: 'Prix à confirmer', name: 'Nom', email: 'Email', whatsapp: 'WhatsApp', nationality: 'Nationalité', guests: 'Voyageurs', childrenAges: 'Âges des enfants', arrival: 'Date d’arrivée / début', departure: 'Date de départ / fin', duration: 'Durée', parks: 'Parcs / destinations', lodges: 'Hébergement', rating: 'Note', category: 'Type de forfait', activity: 'Niveau d’activité', comfort: 'Niveau de confort', requests: 'Demandes spéciales', status: 'Statut', pending: 'En attente de confirmation', morning: 'Matin', afternoon: 'Après-midi', overnight: 'Nuit', day: 'Jour', notes: 'Notes', footer: 'Cette facture provisoire est basée sur le forfait et les informations voyageurs sélectionnés en ligne. La disponibilité, l’hébergement, le trajet et le prix final seront confirmés par Bahari Asili Safaris avant paiement.' },
  es: { title: 'FACTURA PROVISIONAL / PRESUPUESTO DE RESERVA', client: 'DATOS DEL VIAJERO', trip: 'DETALLES DEL VIAJE', package: 'PAQUETE SELECCIONADO', itinerary: 'ITINERARIO COMPLETO DÍA A DÍA', highlights: 'DESTACADOS', included: 'INCLUIDO', excluded: 'NO INCLUIDO', packing: 'EQUIPAJE Y NOTAS DE VIAJE', costs: 'DESGLOSE DE COSTES', subtotal: 'Subtotal', discount: 'Descuento', tax: 'Impuestos / IVA', total: 'TOTAL', quoteOnly: 'Precio por confirmar', name: 'Nombre', email: 'Email', whatsapp: 'WhatsApp', nationality: 'Nacionalidad', guests: 'Viajeros', childrenAges: 'Edades de los niños', arrival: 'Fecha de llegada / inicio', departure: 'Fecha de salida / fin', duration: 'Duración', parks: 'Parques / destinos', lodges: 'Alojamiento', rating: 'Valoración', category: 'Tipo de paquete', activity: 'Nivel de actividad', comfort: 'Nivel de confort', requests: 'Solicitudes especiales', status: 'Estado', pending: 'Pendiente de confirmación', morning: 'Mañana', afternoon: 'Tarde', overnight: 'Alojamiento', day: 'Día', notes: 'Notas', footer: 'Esta factura provisional se basa en el paquete y los datos del viajero seleccionados en línea. Bahari Asili Safaris confirmará la disponibilidad, alojamiento, ruta y precio final antes del pago.' },
  de: { title: 'VORLÄUFIGE RECHNUNG / BUCHUNGSANGEBOT', client: 'REISENDENDETAILS', trip: 'REISEDETAILS', package: 'AUSGEWÄHLTES PAKET', itinerary: 'VOLLSTÄNDIGER TAGESPLAN', highlights: 'HIGHLIGHTS', included: 'INKLUSIVE', excluded: 'NICHT INKLUSIVE', packing: 'GEPÄCK UND REISEHINWEISE', costs: 'KOSTENAUFSCHLÜSSELUNG', subtotal: 'Zwischensumme', discount: 'Rabatt', tax: 'Steuern / MwSt.', total: 'GESAMT', quoteOnly: 'Preis wird bestätigt', name: 'Name', email: 'E-Mail', whatsapp: 'WhatsApp', nationality: 'Nationalität', guests: 'Reisende', childrenAges: 'Kinderalter', arrival: 'Ankunft / Startdatum', departure: 'Abreise / Enddatum', duration: 'Dauer', parks: 'Parks / Reiseziele', lodges: 'Unterkunft', rating: 'Bewertung', category: 'Paketart', activity: 'Aktivitätsniveau', comfort: 'Komfortniveau', requests: 'Besondere Wünsche', status: 'Status', pending: 'Bestätigung ausstehend', morning: 'Morgen', afternoon: 'Nachmittag', overnight: 'Übernachtung', day: 'Tag', notes: 'Hinweise', footer: 'Diese vorläufige Rechnung basiert auf dem online ausgewählten Paket und den Reisedaten. Verfügbarkeit, Unterkunft, Route und endgültiger Preis werden vor der Zahlung von Bahari Asili Safaris bestätigt.' },
  ar: { title: 'فاتورة مبدئية / عرض حجز', client: 'بيانات المسافر', trip: 'تفاصيل الرحلة', package: 'الباقة المختارة', itinerary: 'خط سير الرحلة الكامل يومًا بيوم', highlights: 'أبرز التجربة', included: 'يشمل', excluded: 'لا يشمل', packing: 'الأمتعة وملاحظات السفر', costs: 'تفصيل التكاليف', subtotal: 'المجموع الفرعي', discount: 'الخصم', tax: 'الضريبة', total: 'الإجمالي', quoteOnly: 'السعر قيد التأكيد', name: 'الاسم', email: 'البريد الإلكتروني', whatsapp: 'واتساب', nationality: 'الجنسية', guests: 'المسافرون', childrenAges: 'أعمار الأطفال', arrival: 'تاريخ الوصول / البداية', departure: 'تاريخ المغادرة / النهاية', duration: 'المدة', parks: 'المتنزهات / الوجهات', lodges: 'الإقامة', rating: 'التقييم', category: 'نوع الباقة', activity: 'مستوى النشاط', comfort: 'مستوى الراحة', requests: 'طلبات خاصة', status: 'الحالة', pending: 'بانتظار التأكيد', morning: 'الصباح', afternoon: 'بعد الظهر', overnight: 'المبيت', day: 'اليوم', notes: 'ملاحظات', footer: 'هذه الفاتورة المبدئية مبنية على الباقة وبيانات المسافر المختارة عبر الموقع. سيتم تأكيد التوفر والإقامة والمسار والسعر النهائي من Bahari Asili Safaris قبل الدفع.' },
  zh: { title: '临时发票 / 预订报价', client: '旅客信息', trip: '行程详情', package: '已选套餐', itinerary: '完整逐日行程', highlights: '行程亮点', included: '包含', excluded: '不包含', packing: '行李与旅行提示', costs: '费用明细', subtotal: '小计', discount: '折扣', tax: '税费', total: '总计', quoteOnly: '价格待确认', name: '姓名', email: '邮箱', whatsapp: 'WhatsApp', nationality: '国籍', guests: '旅客', childrenAges: '儿童年龄', arrival: '抵达 / 开始日期', departure: '离开 / 结束日期', duration: '时长', parks: '公园 / 目的地', lodges: '住宿', rating: '评分', category: '套餐类型', activity: '活动等级', comfort: '舒适等级', requests: '特殊要求', status: '状态', pending: '等待确认', morning: '上午', afternoon: '下午', overnight: '住宿', day: '第', notes: '备注', footer: '此临时发票根据您在线选择的套餐和旅客信息生成。付款前，Bahari Asili Safaris 将确认最终可用性、住宿、路线和价格。' },
  sw: { title: 'ANKARA YA MUDA / BEI YA UHIFADHI', client: 'TAARIFA ZA MSAFIRI', trip: 'MAELEZO YA SAFARI', package: 'KIFURUSHI KILICHOCHAGULIWA', itinerary: 'RATIBA KAMILI YA KILA SIKU', highlights: 'MAMBO MUHIMU', included: 'VINAVYOJUMUISHWA', excluded: 'VISIVYOJUMUISHWA', packing: 'VIFAA NA VIDOKEZO VYA SAFARI', costs: 'MGAWANYO WA GHARAMA', subtotal: 'Jumla ndogo', discount: 'Punguzo', tax: 'Kodi / VAT', total: 'JUMLA', quoteOnly: 'Bei itathibitishwa', name: 'Jina', email: 'Barua pepe', whatsapp: 'WhatsApp', nationality: 'Utaifa', guests: 'Wasafiri', childrenAges: 'Umri wa watoto', arrival: 'Tarehe ya kuwasili / kuanza', departure: 'Tarehe ya kuondoka / kumaliza', duration: 'Muda', parks: 'Mbuga / maeneo', lodges: 'Malazi', rating: 'Ukadiriaji', category: 'Aina ya kifurushi', activity: 'Kiwango cha shughuli', comfort: 'Kiwango cha starehe', requests: 'Maombi maalum', status: 'Hali', pending: 'Inasubiri uthibitisho', morning: 'Asubuhi', afternoon: 'Mchana', overnight: 'Malazi', day: 'Siku', notes: 'Maelezo', footer: 'Ankara hii ya muda inategemea kifurushi na taarifa za msafiri zilizochaguliwa mtandaoni. Upatikanaji, malazi, njia na bei ya mwisho vitathibitishwa na Bahari Asili Safaris kabla ya malipo.' },
};

function safe(value: unknown): string {
  return value == null ? '' : String(value).trim();
}

function money(value: number | null | undefined, currency: string): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '';
  const code = currency || 'KES';
  try { return new Intl.NumberFormat('en-KE', { style: 'currency', currency: code, maximumFractionDigits: code === 'KES' ? 0 : 2 }).format(amount); }
  catch { return `${code} ${amount.toLocaleString('en-KE')}`; }
}

export async function generateCustomerInvoicePDF(input: CustomerInvoiceInput): Promise<{ dataUrl: string; base64: string }> {
  const { jsPDF } = await import('jspdf');
  const locale = normalizeLocale(input.locale);
  const L = labels[locale] || labels.en;
  const pkg = input.package;
  const costs = input.costs || {};
  const currency = safe(costs.currency) || 'KES';
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const font = await registerInvoiceFont(doc, locale);
  const logo = await loadBrandLogo();
  const W = 210;
  const M = 14;
  const TEXT: [number, number, number] = BRAND_TEXT;
  const LIGHT: [number, number, number] = BRAND_LIGHT;
  let y = 14;

  const addFooter = () => {
    const pages = doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setDrawColor(...BRAND_TEAL);
      doc.setLineWidth(0.35);
      doc.line(M, 279, W - M, 279);
      doc.setFont(font, 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(...LIGHT);
      doc.text(`${COMPANY.website} · ${COMPANY.email} · ${COMPANY.phone}`, W / 2, 285, { align: 'center' });
      doc.text(`© 2026 ${COMPANY.name}, ${COMPANY.address}`, W / 2, 290, { align: 'center' });
      doc.text(String(p), W - M, 290, { align: 'right' });
    }
  };

  const ensure = (height: number) => {
    if (y + height > 273) { doc.addPage(); y = 18; }
  };
  const section = (title: string) => {
    ensure(12);
    doc.setFillColor(...BRAND_TEAL);
    doc.roundedRect(M, y - 4, W - 2 * M, 8, 1.5, 1.5, 'F');
    doc.setFont(font, 'normal'); doc.setFontSize(8.2); doc.setTextColor(...BRAND_OFFWHITE);
    doc.text(title, M + 3, y + 1.3);
    y += 10;
  };
  const row = (label: string, value: string) => {
    if (!value) return;
    const lines = doc.splitTextToSize(value, W - M - 78);
    ensure(Math.max(6, lines.length * 4.1));
    doc.setFont(font, 'normal'); doc.setFontSize(7.7); doc.setTextColor(...LIGHT);
    doc.text(label, M + 1, y);
    doc.setTextColor(...TEXT);
    doc.text(lines, M + 66, y);
    y += Math.max(5, lines.length * 4.1);
  };
  const bullets = (items: string[]) => {
    for (const raw of items || []) {
      const item = safe(raw); if (!item) continue;
      const lines = doc.splitTextToSize(`• ${item}`, W - 2 * M - 5);
      ensure(lines.length * 3.8 + 2);
      doc.setFont(font, 'normal'); doc.setFontSize(7.6); doc.setTextColor(...TEXT);
      doc.text(lines, M + 2, y); y += lines.length * 3.8 + 1;
    }
    y += 2;
  };

  doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, 38, 'F');
  if (logo) drawBrandLogo(doc, logo, M, 8, 19);
  doc.setFont(font, 'normal'); doc.setFontSize(8.5); doc.setTextColor(...BRAND_TEAL);
  doc.text(`${COMPANY.address} · ${COMPANY.phone}`, W - M, 12, { align: 'right' });
  doc.text(COMPANY.email, W - M, 18, { align: 'right' });
  doc.setFontSize(7); doc.setTextColor(...LIGHT); doc.text(COMPANY.founded, W - M, 24, { align: 'right' });
  doc.setDrawColor(...BRAND_TEAL); doc.setLineWidth(0.45); doc.line(0, 38, W, 38);

  doc.setFillColor(...BRAND_ORANGE); doc.rect(0, 38, W, 19, 'F');
  doc.setFont(font, 'normal'); doc.setFontSize(8.2); doc.setTextColor(255, 255, 255); doc.text(L.title, M, 46);
  doc.setFontSize(15); doc.text(safe(input.booking_ref), M, 53.5);
  doc.setFontSize(7.8); doc.text(`${L.status}: ${input.reservation_status === 'confirmed' ? 'Confirmed' : L.pending}`, W - M, 52, { align: 'right' });
  y = 65;

  section(L.client);
  row(L.name, `${safe(input.first_name)} ${safe(input.last_name)}`);
  row(L.email, safe(input.email));
  row(L.whatsapp, safe(input.whatsapp) || '—');
  row(L.nationality, safe(input.nationality));
  row(L.guests, `${Number(input.adults) || 0} adults${Number(input.children) ? ` + ${Number(input.children)} children` : ''}`);
  if (input.children && input.kids_ages?.length) row(L.childrenAges, input.kids_ages.join(', '));
  y += 3;

  section(L.trip);
  row(L.arrival, formatLocaleDate(input.arrival_date, locale));
  if (input.departure_date) row(L.departure, formatLocaleDate(input.departure_date, locale));
  row(L.duration, `${Number(pkg.days) || 0} days / ${Number(pkg.nights) || 0} nights`);
  row(L.parks, (pkg.parks || []).join(', '));
  row(L.lodges, (pkg.lodges || []).join(', '));
  row(L.status, input.reservation_status === 'confirmed' ? 'Confirmed' : L.pending);
  if (input.message) row(L.requests, safe(input.message));
  y += 3;

  section(L.package);
  doc.setFont(font, 'normal'); doc.setFontSize(13); doc.setTextColor(...BRAND_TEAL); doc.text(safe(pkg.name || input.safari_name), M + 2, y); y += 6;
  if (pkg.tagline) { const lines = doc.splitTextToSize(safe(pkg.tagline), W - 2 * M - 4); ensure(lines.length * 4 + 3); doc.setFontSize(8); doc.setTextColor(...TEXT); doc.text(lines, M + 2, y); y += lines.length * 4 + 2; }
  row(L.category, safe(pkg.category));
  if (pkg.rating) row(L.rating, `${pkg.rating}/5${pkg.reviewCount ? ` (${pkg.reviewCount} reviews)` : ''}`);
  if (pkg.activityLevel) row(L.activity, `${pkg.activityLevel}/5`);
  if (pkg.comfortLevel) row(L.comfort, `${pkg.comfortLevel}/5`);
  y += 2;

  if (pkg.highlights?.length) { section(L.highlights); bullets(pkg.highlights); }

  if (pkg.itinerary?.length) {
    section(L.itinerary);
    for (const d of pkg.itinerary) {
      const heading = `${L.day} ${safe(d.day)}${d.title ? ` — ${safe(d.title)}` : ''}`;
      ensure(12);
      doc.setFont(font, 'normal'); doc.setFontSize(9); doc.setTextColor(...BRAND_ORANGE); doc.text(heading, M + 1, y); y += 5;
      if (d.location) row(L.trip, safe(d.location));
      if (d.description) row(L.notes, safe(d.description));
      if (d.morning) row(L.morning, safe(d.morning));
      if (d.afternoon) row(L.afternoon, safe(d.afternoon));
      if (d.overnight) row(L.overnight, safe(d.overnight));
      y += 2;
    }
  }

  if (pkg.included?.length) { section(L.included); bullets(pkg.included); }
  if (pkg.excluded?.length) { section(L.excluded); bullets(pkg.excluded); }
  if (pkg.packingTips?.length) { section(L.packing); bullets(pkg.packingTips); }

  const vals = [costs.accommodation_cost, costs.park_fees, costs.guide_cost, costs.transport_cost, costs.meals_cost, costs.other_costs].map(v => Number(v || 0));
  const hasAnyCost = vals.some(v => v !== 0) || Number(costs.discount || 0) !== 0 || Number(costs.tax || 0) !== 0 || Number(costs.total_cost || 0) !== 0;
  section(L.costs);
  if (!hasAnyCost) {
    doc.setFont(font, 'normal'); doc.setFontSize(8); doc.setTextColor(...LIGHT); doc.text(L.quoteOnly, M + 2, y); y += 8;
  } else {
    const costRows: Array<[string, number | null | undefined]> = [[ 'Accommodation', costs.accommodation_cost ], ['Park / conservation fees', costs.park_fees], ['Guide & 4x4 vehicle', costs.guide_cost], ['Transport / transfers', costs.transport_cost], ['Meals / full board', costs.meals_cost], ['Other costs', costs.other_costs]];
    let subtotal = 0;
    for (const [label, value] of costRows) {
      const n = Number(value || 0); if (!n) continue; subtotal += n; ensure(6); doc.setFont(font, 'normal'); doc.setFontSize(8); doc.setTextColor(...TEXT); doc.text(label, M + 2, y); doc.text(money(n, currency), W - M - 2, y, { align: 'right' }); y += 5;
    }
    const providedSubtotal = vals.reduce((a, b) => a + b, 0);
    subtotal = providedSubtotal;
    ensure(8); doc.setDrawColor(...BRAND_TEAL); doc.line(M + 2, y, W - M - 2, y); y += 5;
    doc.setFontSize(8); doc.setTextColor(...TEXT); doc.text(L.subtotal, M + 2, y); doc.text(money(subtotal, currency), W - M - 2, y, { align: 'right' }); y += 5;
    const discount = Number(costs.discount || 0);
    if (discount) { doc.setTextColor(...BRAND_TEAL); doc.text(L.discount, M + 2, y); doc.text(`-${money(discount, currency)}`, W - M - 2, y, { align: 'right' }); y += 5; }
    const tax = Number(costs.tax || 0);
    if (tax) { doc.setTextColor(...TEXT); doc.text(L.tax, M + 2, y); doc.text(money(tax, currency), W - M - 2, y, { align: 'right' }); y += 5; }
    const calculated = subtotal - discount + tax;
    const total = Number.isFinite(Number(costs.total_cost)) && Number(costs.total_cost) > 0 ? Number(costs.total_cost) : calculated;
    ensure(11); doc.setFillColor(...BRAND_ORANGE); doc.roundedRect(M, y - 2, W - 2 * M, 9, 1.5, 1.5, 'F'); doc.setFontSize(10.5); doc.setTextColor(255, 255, 255); doc.text(L.total, M + 2, y + 4); doc.text(money(total, currency), W - M - 2, y + 4, { align: 'right' }); y += 14;
  }

  ensure(25); doc.setFont(font, 'normal'); doc.setFontSize(7.2); doc.setTextColor(...LIGHT);
  const note = doc.splitTextToSize(L.footer, W - 2 * M - 4); doc.text(note, M + 2, y); y += note.length * 3.7 + 4;
  if (input.message) { doc.setFontSize(7.2); doc.setTextColor(...TEXT); doc.text(`${L.requests}: ${safe(input.message)}`, M + 2, y); }

  addFooter();
  if (locale === 'ar' && typeof (doc as any).setR2L === 'function') (doc as any).setR2L(true);
  const dataUrl = doc.output('dataurlstring') as string;
  const bytes = new Uint8Array(doc.output('arraybuffer') as ArrayBuffer);
  let binary = ''; for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return { dataUrl, base64: btoa(binary) };
}
