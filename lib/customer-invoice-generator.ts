import { jsPDF } from 'jspdf';
import type { Locale } from './i18n';
import { normalizeLocale, formatLocaleDate } from './locale-content';
import { registerInvoiceFont } from './invoice-font';
import {
  BRAND_TEAL,
  BRAND_ORANGE,
  BRAND_OFFWHITE,
  BRAND_TEXT,
  BRAND_LIGHT,
  COMPANY,
  loadBrandLogo,
  drawBrandLogo,
} from './pdf-brand';

export interface CustomerInvoicePackage {
  name: string;
  tagline?: string;
  description?: string;
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

type Labels = Record<string, string>;

const labels: Record<string, Labels> = {
  en: {
    title: 'BOOKING REQUEST / PROVISIONAL INVOICE',
    subtitle: 'Your selected safari details',
    client: 'TRAVELLER DETAILS',
    trip: 'TRIP DETAILS',
    package: 'SELECTED PACKAGE',
    itinerary: 'DAY-BY-DAY ITINERARY',
    highlights: 'PACKAGE HIGHLIGHTS',
    included: 'WHAT IS INCLUDED',
    excluded: 'WHAT IS NOT INCLUDED',
    packing: 'PACKING & TRAVEL NOTES',
    costs: 'PRICING STATUS',
    name: 'Full name', email: 'Email', whatsapp: 'WhatsApp', nationality: 'Nationality',
    guests: 'Travellers', childrenAges: 'Children ages', arrival: 'Arrival / start', departure: 'Departure / end',
    duration: 'Duration', parks: 'Parks / destinations', lodges: 'Accommodation', status: 'Booking status',
    rating: 'Rating', category: 'Package type', activity: 'Activity level', comfort: 'Comfort level', requests: 'Special requests',
    morning: 'Morning', afternoon: 'Afternoon', overnight: 'Overnight', location: 'Location',
    pending: 'Pending confirmation', confirmed: 'Confirmed', quoteOnly: 'Pricing to be confirmed',
    quoteNote: 'This document confirms the safari package and traveller information submitted online. Final availability, accommodation, routing and pricing will be reviewed and confirmed by Bahari Asili Safaris before payment.',
    reference: 'Booking reference',
  },
  it: {
    title: 'RICHIESTA DI PRENOTAZIONE / FATTURA PROVVISORIA', subtitle: 'Dettagli del safari selezionato', client: 'DATI DEL VIAGGIATORE', trip: 'DETTAGLI DEL VIAGGIO', package: 'PACCHETTO SELEZIONATO', itinerary: 'ITINERARIO GIORNO PER GIORNO', highlights: 'PUNTI SALIENTI', included: 'COSA È INCLUSO', excluded: 'COSA NON È INCLUSO', packing: 'BAGAGLIO E NOTE DI VIAGGIO', costs: 'STATO DEL PREZZO', name: 'Nome completo', email: 'Email', whatsapp: 'WhatsApp', nationality: 'Nazionalità', guests: 'Viaggiatori', childrenAges: 'Età bambini', arrival: 'Arrivo / inizio', departure: 'Partenza / fine', duration: 'Durata', parks: 'Parchi / destinazioni', lodges: 'Sistemazione', status: 'Stato prenotazione', rating: 'Valutazione', category: 'Tipo di pacchetto', activity: 'Livello attività', comfort: 'Livello comfort', requests: 'Richieste speciali', morning: 'Mattina', afternoon: 'Pomeriggio', overnight: 'Pernottamento', location: 'Località', pending: 'In attesa di conferma', confirmed: 'Confermato', quoteOnly: 'Prezzo da confermare', quoteNote: 'Questo documento conferma il pacchetto safari e i dati dei viaggiatori inviati online. Disponibilità, sistemazione, percorso e prezzo finale saranno verificati e confermati da Bahari Asili Safaris prima del pagamento.', reference: 'Riferimento prenotazione',
  },
  fr: {
    title: 'DEMANDE DE RÉSERVATION / FACTURE PROVISOIRE', subtitle: 'Détails du safari sélectionné', client: 'INFORMATIONS VOYAGEUR', trip: 'DÉTAILS DU VOYAGE', package: 'FORFAIT SÉLECTIONNÉ', itinerary: 'ITINÉRAIRE JOUR PAR JOUR', highlights: 'POINTS FORTS', included: 'CE QUI EST INCLUS', excluded: 'CE QUI N’EST PAS INCLUS', packing: 'BAGAGES ET NOTES DE VOYAGE', costs: 'ÉTAT DU PRIX', name: 'Nom complet', email: 'Email', whatsapp: 'WhatsApp', nationality: 'Nationalité', guests: 'Voyageurs', childrenAges: 'Âges des enfants', arrival: 'Arrivée / début', departure: 'Départ / fin', duration: 'Durée', parks: 'Parcs / destinations', lodges: 'Hébergement', status: 'Statut de réservation', rating: 'Note', category: 'Type de forfait', activity: 'Niveau d’activité', comfort: 'Niveau de confort', requests: 'Demandes spéciales', morning: 'Matin', afternoon: 'Après-midi', overnight: 'Nuit', location: 'Lieu', pending: 'En attente de confirmation', confirmed: 'Confirmé', quoteOnly: 'Prix à confirmer', quoteNote: 'Ce document confirme le forfait safari et les informations voyageurs soumis en ligne. La disponibilité, l’hébergement, le trajet et le prix final seront vérifiés et confirmés par Bahari Asili Safaris avant paiement.', reference: 'Référence de réservation',
  },
  es: {
    title: 'SOLICITUD DE RESERVA / FACTURA PROVISIONAL', subtitle: 'Detalles del safari seleccionado', client: 'DATOS DEL VIAJERO', trip: 'DETALLES DEL VIAJE', package: 'PAQUETE SELECCIONADO', itinerary: 'ITINERARIO DÍA A DÍA', highlights: 'DESTACADOS', included: 'QUÉ ESTÁ INCLUIDO', excluded: 'QUÉ NO ESTÁ INCLUIDO', packing: 'EQUIPAJE Y NOTAS DE VIAJE', costs: 'ESTADO DEL PRECIO', name: 'Nombre completo', email: 'Email', whatsapp: 'WhatsApp', nationality: 'Nacionalidad', guests: 'Viajeros', childrenAges: 'Edades de los niños', arrival: 'Llegada / inicio', departure: 'Salida / fin', duration: 'Duración', parks: 'Parques / destinos', lodges: 'Alojamiento', status: 'Estado de la reserva', rating: 'Valoración', category: 'Tipo de paquete', activity: 'Nivel de actividad', comfort: 'Nivel de confort', requests: 'Solicitudes especiales', morning: 'Mañana', afternoon: 'Tarde', overnight: 'Alojamiento', location: 'Lugar', pending: 'Pendiente de confirmación', confirmed: 'Confirmado', quoteOnly: 'Precio por confirmar', quoteNote: 'Este documento confirma el paquete safari y los datos del viajero enviados en línea. Bahari Asili Safaris revisará y confirmará la disponibilidad, alojamiento, ruta y precio final antes del pago.', reference: 'Referencia de reserva',
  },
  de: {
    title: 'BUCHUNGSANFRAGE / VORLÄUFIGE RECHNUNG', subtitle: 'Details des ausgewählten Safaris', client: 'REISENDENDETAILS', trip: 'REISEDETAILS', package: 'AUSGEWÄHLTES PAKET', itinerary: 'TAGESPLAN', highlights: 'HIGHLIGHTS', included: 'INKLUSIVE', excluded: 'NICHT INKLUSIVE', packing: 'GEPÄCK UND REISEHINWEISE', costs: 'PREISSTATUS', name: 'Vollständiger Name', email: 'E-Mail', whatsapp: 'WhatsApp', nationality: 'Nationalität', guests: 'Reisende', childrenAges: 'Kinderalter', arrival: 'Ankunft / Beginn', departure: 'Abreise / Ende', duration: 'Dauer', parks: 'Parks / Reiseziele', lodges: 'Unterkunft', status: 'Buchungsstatus', rating: 'Bewertung', category: 'Paketart', activity: 'Aktivitätsniveau', comfort: 'Komfortniveau', requests: 'Besondere Wünsche', morning: 'Morgen', afternoon: 'Nachmittag', overnight: 'Übernachtung', location: 'Ort', pending: 'Bestätigung ausstehend', confirmed: 'Bestätigt', quoteOnly: 'Preis wird bestätigt', quoteNote: 'Dieses Dokument bestätigt das ausgewählte Safari-Paket und die online übermittelten Reisedaten. Verfügbarkeit, Unterkunft, Route und Endpreis werden vor der Zahlung von Bahari Asili Safaris geprüft und bestätigt.', reference: 'Buchungsreferenz',
  },
  ar: {
    title: 'طلب حجز / فاتورة مبدئية', subtitle: 'تفاصيل رحلة السفاري المختارة', client: 'بيانات المسافر', trip: 'تفاصيل الرحلة', package: 'الباقة المختارة', itinerary: 'خط سير الرحلة يومًا بيوم', highlights: 'أبرز التجربة', included: 'ما يشمله الحجز', excluded: 'ما لا يشمله الحجز', packing: 'الأمتعة وملاحظات السفر', costs: 'حالة السعر', name: 'الاسم الكامل', email: 'البريد الإلكتروني', whatsapp: 'واتساب', nationality: 'الجنسية', guests: 'المسافرون', childrenAges: 'أعمار الأطفال', arrival: 'الوصول / البداية', departure: 'المغادرة / النهاية', duration: 'المدة', parks: 'المتنزهات / الوجهات', lodges: 'الإقامة', status: 'حالة الحجز', rating: 'التقييم', category: 'نوع الباقة', activity: 'مستوى النشاط', comfort: 'مستوى الراحة', requests: 'طلبات خاصة', morning: 'الصباح', afternoon: 'بعد الظهر', overnight: 'المبيت', location: 'الموقع', pending: 'بانتظار التأكيد', confirmed: 'مؤكد', quoteOnly: 'السعر قيد التأكيد', quoteNote: 'يؤكد هذا المستند باقة السفاري وبيانات المسافر التي تم إرسالها عبر الموقع. ستقوم Bahari Asili Safaris بمراجعة وتأكيد التوفر والإقامة والمسار والسعر النهائي قبل الدفع.', reference: 'مرجع الحجز',
  },
  zh: {
    title: '预订申请 / 临时发票', subtitle: '已选Safari行程详情', client: '旅客信息', trip: '行程详情', package: '已选套餐', itinerary: '逐日行程', highlights: '行程亮点', included: '包含项目', excluded: '不包含项目', packing: '行李与旅行提示', costs: '价格状态', name: '姓名', email: '邮箱', whatsapp: 'WhatsApp', nationality: '国籍', guests: '旅客', childrenAges: '儿童年龄', arrival: '抵达 / 开始', departure: '离开 / 结束', duration: '时长', parks: '公园 / 目的地', lodges: '住宿', status: '预订状态', rating: '评分', category: '套餐类型', activity: '活动等级', comfort: '舒适等级', requests: '特殊要求', morning: '上午', afternoon: '下午', overnight: '住宿', location: '地点', pending: '等待确认', confirmed: '已确认', quoteOnly: '价格待确认', quoteNote: '此文件确认您在线提交的Safari套餐和旅客信息。付款前，Bahari Asili Safaris将审核并确认最终可用性、住宿、路线和价格。', reference: '预订编号',
  },
  sw: {
    title: 'OMBI LA UHIFADHI / ANKARA YA MUDA', subtitle: 'Maelezo ya safari iliyochaguliwa', client: 'TAARIFA ZA MSAFIRI', trip: 'MAELEZO YA SAFARI', package: 'KIFURUSHI KILICHOCHAGULIWA', itinerary: 'RATIBA YA KILA SIKU', highlights: 'MAMBO MUHIMU', included: 'VINAVYOJUMUISHWA', excluded: 'VISIVYOJUMUISHWA', packing: 'VIFAA NA VIDOKEZO VYA SAFARI', costs: 'HALI YA BEI', name: 'Jina kamili', email: 'Barua pepe', whatsapp: 'WhatsApp', nationality: 'Utaifa', guests: 'Wasafiri', childrenAges: 'Umri wa watoto', arrival: 'Kuwasili / kuanza', departure: 'Kuondoka / kumaliza', duration: 'Muda', parks: 'Mbuga / maeneo', lodges: 'Malazi', status: 'Hali ya uhifadhi', rating: 'Ukadiriaji', category: 'Aina ya kifurushi', activity: 'Kiwango cha shughuli', comfort: 'Kiwango cha starehe', requests: 'Maombi maalum', morning: 'Asubuhi', afternoon: 'Mchana', overnight: 'Malazi', location: 'Mahali', pending: 'Inasubiri uthibitisho', confirmed: 'Imethibitishwa', quoteOnly: 'Bei itathibitishwa', quoteNote: 'Hati hii inathibitisha kifurushi cha safari na taarifa za msafiri zilizowasilishwa mtandaoni. Upatikanaji, malazi, njia na bei ya mwisho vitakaguliwa na kuthibitishwa na Bahari Asili Safaris kabla ya malipo.', reference: 'Nambari ya uhifadhi',
  },
};

function safe(value: unknown): string {
  return value == null ? '' : String(value).trim();
}

function cleanText(value: unknown): string {
  return safe(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s*[!！][’'`´]\s*/g, ' → ')
    .replace(/\s*[!！]\s*['’`´]\s*/g, ' → ')
    .replace(/\s*→\s*/g, ' → ')
    .trim();
}

function displayStatus(status: string | null | undefined, L: Labels): string {
  return safe(status).toLowerCase() === 'confirmed' ? L.confirmed : L.pending;
}

function money(value: number | null | undefined, currency: string): string {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '';
  const code = currency || 'KES';
  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency', currency: code,
      maximumFractionDigits: code === 'KES' ? 0 : 2,
    }).format(amount);
  } catch {
    return `${code} ${amount.toLocaleString('en-KE')}`;
  }
}

export async function generateCustomerInvoicePDF(input: CustomerInvoiceInput) {
  const locale = normalizeLocale(input.locale);
  const L = labels[locale] || labels.en;
  const pkg = input.package || { name: input.safari_name };
  const costs = input.costs || {};
  const currency = safe(costs.currency) || 'KES';

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  const font = await registerInvoiceFont(doc, locale);
  const logo = await loadBrandLogo();

  const W = 210;
  const H = 297;
  const M = 15;
  const contentW = W - M * 2;
  const footerY = 281;
  const bottomY = 270;
  let y = 15;
  let pageNumber = 1;

  const setFont = (size: number, color: [number, number, number] = BRAND_TEXT, style: 'normal' | 'bold' = 'normal') => {
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  const wrap = (text: string, width: number, size = 8.2) => {
    setFont(size);
    return doc.splitTextToSize(cleanText(text), width) as string[];
  };

  const footer = () => {
    doc.setDrawColor(...BRAND_TEAL);
    doc.setLineWidth(0.35);
    doc.line(M, footerY, W - M, footerY);
    setFont(6.8, BRAND_LIGHT);
    doc.text(`${COMPANY.website} · ${COMPANY.email} · ${COMPANY.phone}`, W / 2, 286, { align: 'center' });
    doc.text(`© ${new Date().getFullYear()} ${COMPANY.name} · ${COMPANY.address}`, W / 2, 291, { align: 'center' });
    doc.text(String(pageNumber), W - M, 291, { align: 'right' });
  };

  const header = (firstPage = false) => {
    if (firstPage) {
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, 42, 'F');
      if (logo) drawBrandLogo(doc, logo, M, 8, 22);
      setFont(8.2, BRAND_TEAL);
      doc.text(`${COMPANY.address} · ${COMPANY.phone}`, W - M, 13, { align: 'right' });
      doc.text(COMPANY.email, W - M, 19, { align: 'right' });
      setFont(7, BRAND_LIGHT);
      doc.text(COMPANY.founded, W - M, 25, { align: 'right' });
      doc.setDrawColor(...BRAND_TEAL);
      doc.setLineWidth(0.45);
      doc.line(0, 42, W, 42);

      doc.setFillColor(...BRAND_ORANGE);
      doc.rect(0, 42, W, 24, 'F');
      setFont(8.2, [255, 255, 255], 'bold');
      doc.text(L.title, M, 51);
      setFont(16, [255, 255, 255], 'bold');
      doc.text(cleanText(input.booking_ref), M, 60.5);
      setFont(7.6, [255, 255, 255]);
      doc.text(`${L.status}: ${displayStatus(input.reservation_status, L)}`, W - M, 58.5, { align: 'right' });
      y = 76;
    } else {
      doc.setFillColor(...BRAND_TEAL);
      doc.rect(0, 0, W, 15, 'F');
      setFont(7.5, BRAND_OFFWHITE, 'bold');
      doc.text(COMPANY.name, M, 9.5);
      doc.text(`${L.reference}: ${cleanText(input.booking_ref)}`, W - M, 9.5, { align: 'right' });
      y = 23;
    }
  };

  const newPage = () => {
    footer();
    doc.addPage();
    pageNumber += 1;
    header(false);
  };

  const ensure = (height: number, keepWithNext = false) => {
    if (y + height > bottomY) {
      newPage();
      if (keepWithNext) y += 1;
    }
  };

  const section = (title: string) => {
    ensure(12, true);
    doc.setFillColor(...BRAND_TEAL);
    doc.roundedRect(M, y, contentW, 8.5, 1.5, 1.5, 'F');
    setFont(8.2, BRAND_OFFWHITE, 'bold');
    doc.text(cleanText(title), M + 3.5, y + 5.7);
    y += 12;
  };

  const infoRows = (rows: Array<[string, string]>) => {
    const labelW = 38;
    const valueX = M + labelW + 4;
    const valueW = contentW - labelW - 4;
    for (const [label, rawValue] of rows) {
      const value = cleanText(rawValue);
      if (!value) continue;
      setFont(7.7, BRAND_LIGHT, 'bold');
      const lines = wrap(value, valueW, 7.8);
      const h = Math.max(6, lines.length * 4.1);
      ensure(h);
      setFont(7.7, BRAND_LIGHT, 'bold');
      doc.text(cleanText(label), M, y);
      setFont(8, BRAND_TEXT);
      doc.text(lines, valueX, y);
      y += h + 0.7;
    }
  };

  const twoColumnInfo = (left: Array<[string, string]>, right: Array<[string, string]>) => {
    const gap = 7;
    const colW = (contentW - gap) / 2;
    const startY = y;
    const drawCol = (rows: Array<[string, string]>, x: number) => {
      let cy = startY;
      for (const [label, rawValue] of rows) {
        const value = cleanText(rawValue);
        if (!value) continue;
        setFont(7.2, BRAND_LIGHT, 'bold');
        doc.text(cleanText(label).toUpperCase(), x, cy);
        const lines = wrap(value, colW, 8);
        setFont(8, BRAND_TEXT);
        doc.text(lines, x, cy + 4);
        cy += Math.max(10, lines.length * 4 + 5);
      }
      return cy;
    };
    const leftY = drawCol(left, M);
    const rightY = drawCol(right, M + colW + gap);
    y = Math.max(leftY, rightY) + 2;
  };

  const bullets = (items: string[], columns = 1) => {
    const usable = items.map(cleanText).filter(Boolean);
    if (!usable.length) return;
    const gap = 7;
    const colW = columns === 2 ? (contentW - gap) / 2 : contentW;
    let col = 0;
    let colY = y;
    const columnYs = [y, y];
    for (const item of usable) {
      const x = M + col * (colW + gap);
      const lines = wrap(`• ${item}`, colW - 2, 7.8);
      const h = lines.length * 4 + 1.5;
      if (col === 0) ensure(h);
      if (col === 1 && colY + h > bottomY) {
        y = columnYs[0];
        newPage();
        col = 0;
        colY = y;
      }
      setFont(7.8, BRAND_TEXT);
      doc.text(lines, x + 1, colY);
      colY += h;
      columnYs[col] = colY;
      if (columns === 2 && col === 0 && usable.indexOf(item) === Math.ceil(usable.length / 2) - 1) {
        col = 1;
        colY = y;
      }
    }
    y = Math.max(...columnYs) + 2;
  };

  const itineraryDay = (d: NonNullable<CustomerInvoicePackage['itinerary']>[number]) => {
    const title = cleanText(d.title || d.location || '');
    const dayLabel = `${L.day || 'Day'} ${cleanText(d.day)}`;
    const heading = title ? `${dayLabel} — ${title}` : dayLabel;
    const blocks: Array<[string, string]> = [];
    if (d.location && title !== cleanText(d.location)) blocks.push([L.location, cleanText(d.location)]);
    if (d.description) blocks.push([L.notes || 'Details', cleanText(d.description)]);
    if (d.morning) blocks.push([L.morning, cleanText(d.morning)]);
    if (d.afternoon) blocks.push([L.afternoon, cleanText(d.afternoon)]);
    if (d.overnight) blocks.push([L.overnight, cleanText(d.overnight)]);

    const estimated = 13 + blocks.reduce((sum, [, value]) => sum + Math.max(5, wrap(value, contentW - 32, 7.9).length * 4.1 + 2), 0);
    ensure(Math.min(estimated, 38), true);

    const cardTop = y;
    setFont(9.4, BRAND_ORANGE, 'bold');
    doc.text(heading, M + 2, y + 4.5);
    y += 9;

    for (const [label, value] of blocks) {
      const textLines = wrap(value, contentW - 34, 7.9);
      const h = Math.max(5.5, textLines.length * 4.05 + 1);
      ensure(h);
      setFont(7.4, BRAND_LIGHT, 'bold');
      doc.text(cleanText(label).toUpperCase(), M + 2, y);
      setFont(7.9, BRAND_TEXT);
      doc.text(textLines, M + 32, y);
      y += h + 1.2;
    }

    doc.setDrawColor(220, 226, 230);
    doc.setLineWidth(0.25);
    doc.line(M + 2, y + 1, W - M - 2, y + 1);
    y += 5;
    void cardTop;
  };

  header(true);

  // PAGE 1 — booking identity and package overview
  section(L.client);
  infoRows([
    [L.name, `${safe(input.first_name)} ${safe(input.last_name)}`],
    [L.email, input.email],
    [L.whatsapp, safe(input.whatsapp) || '—'],
    [L.nationality, safe(input.nationality)],
    [L.guests, `${Math.max(0, Number(input.adults) || 0)} adult${Number(input.adults) === 1 ? '' : 's'}${Number(input.children) ? ` · ${Number(input.children)} child${Number(input.children) === 1 ? '' : 'ren'}` : ''}`],
    ...(input.children && input.kids_ages?.length ? [[L.childrenAges, input.kids_ages.join(', ')]] as Array<[string, string]> : []),
  ]);
  y += 3;

  section(L.trip);
  twoColumnInfo(
    [
      [L.arrival, formatLocaleDate(input.arrival_date, locale)],
      [L.departure, input.departure_date ? formatLocaleDate(input.departure_date, locale) : '—'],
      [L.duration, `${Number(pkg.days) || 1} days · ${Number(pkg.nights) || 0} nights`],
    ],
    [
      [L.parks, (pkg.parks || []).join(', ')],
      [L.lodges, (pkg.lodges || []).join(', ')],
      [L.status, displayStatus(input.reservation_status, L)],
    ],
  );

  section(L.package);
  setFont(14, BRAND_TEAL, 'bold');
  const packageNameLines = wrap(pkg.name || input.safari_name, contentW - 4, 14);
  doc.text(packageNameLines, M + 2, y);
  y += packageNameLines.length * 6 + 1;
  if (pkg.tagline) {
    const taglineLines = wrap(pkg.tagline, contentW - 4, 8.5);
    setFont(8.5, BRAND_TEXT);
    doc.text(taglineLines, M + 2, y);
    y += taglineLines.length * 4.3 + 2;
  }
  if (pkg.description) {
    const descriptionLines = wrap(pkg.description, contentW - 4, 8);
    setFont(8, BRAND_TEXT);
    doc.text(descriptionLines, M + 2, y);
    y += descriptionLines.length * 4.1 + 2;
  }
  twoColumnInfo(
    [
      ...(pkg.category ? [[L.category, pkg.category] as [string, string]] : []),
      ...(pkg.rating ? [[L.rating, `${pkg.rating}/5${pkg.reviewCount ? ` · ${pkg.reviewCount} reviews` : ''}`] as [string, string]] : []),
    ],
    [
      ...(pkg.activityLevel ? [[L.activity, `${pkg.activityLevel}/5`] as [string, string]] : []),
      ...(pkg.comfortLevel ? [[L.comfort, `${pkg.comfortLevel}/5`] as [string, string]] : []),
    ],
  );

  if (pkg.highlights?.length) {
    section(L.highlights);
    bullets(pkg.highlights, 2);
  }

  if (input.message) {
    section(L.requests);
    const requestLines = wrap(input.message, contentW - 8, 8.2);
    setFont(8.2, BRAND_TEXT);
    doc.text(requestLines, M + 4, y);
    y += requestLines.length * 4.2 + 3;
  }

  // PAGE 2+ — itinerary. A dedicated page keeps the itinerary readable instead of
  // forcing headings and paragraphs into the bottom of the previous page.
  if (pkg.itinerary?.length) {
    newPage();
    section(L.itinerary);
    for (const day of pkg.itinerary) itineraryDay(day);
  }

  // Supporting information gets its own clean section after the itinerary.
  if (pkg.included?.length || pkg.excluded?.length || pkg.packingTips?.length) {
    newPage();
    if (pkg.included?.length) {
      section(L.included);
      bullets(pkg.included, 2);
    }
    if (pkg.excluded?.length) {
      section(L.excluded);
      bullets(pkg.excluded, 2);
    }
    if (pkg.packingTips?.length) {
      section(L.packing);
      bullets(pkg.packingTips, 2);
    }
  }

  // Pricing is deliberately not inferred on a customer booking request. If costs
  // are present, they can be rendered as a controlled quote; otherwise show a clear
  // pricing-status panel rather than an empty "cost breakdown" table.
  const values = [
    costs.accommodation_cost, costs.park_fees, costs.guide_cost,
    costs.transport_cost, costs.meals_cost, costs.other_costs,
  ].map((v) => Number(v || 0));
  const hasAnyCost = values.some((v) => v !== 0) || Number(costs.discount || 0) !== 0 || Number(costs.tax || 0) !== 0 || Number(costs.total_cost || 0) !== 0;

  if (hasAnyCost || !pkg.itinerary?.length) newPage();
  section(L.costs);

  if (!hasAnyCost) {
    doc.setFillColor(...BRAND_OFFWHITE);
    doc.roundedRect(M, y, contentW, 28, 2, 2, 'F');
    setFont(10, BRAND_TEAL, 'bold');
    doc.text(L.quoteOnly, M + 6, y + 9);
    setFont(7.9, BRAND_TEXT);
    const noteLines = wrap(L.quoteNote, contentW - 12, 7.9);
    doc.text(noteLines, M + 6, y + 16);
    y += 34;
  } else {
    const rows: Array<[string, number | null | undefined]> = [
      ['Accommodation', costs.accommodation_cost],
      ['Park / conservation fees', costs.park_fees],
      ['Guide & 4x4 vehicle', costs.guide_cost],
      ['Transport / transfers', costs.transport_cost],
      ['Meals / full board', costs.meals_cost],
      ['Other costs', costs.other_costs],
    ];
    setFont(7.4, BRAND_LIGHT, 'bold');
    doc.text('DESCRIPTION', M + 4, y);
    doc.text('AMOUNT', W - M - 4, y, { align: 'right' });
    y += 5;
    let subtotal = 0;
    for (const [label, value] of rows) {
      const n = Number(value || 0);
      if (!n) continue;
      subtotal += n;
      ensure(6);
      setFont(8, BRAND_TEXT);
      doc.text(label, M + 4, y);
      doc.text(money(n, currency), W - M - 4, y, { align: 'right' });
      y += 5.5;
    }
    subtotal = values.reduce((a, b) => a + b, 0);
    doc.setDrawColor(...BRAND_TEAL);
    doc.line(M + 4, y, W - M - 4, y);
    y += 5;
    setFont(8, BRAND_TEXT);
    doc.text('Subtotal', M + 4, y);
    doc.text(money(subtotal, currency), W - M - 4, y, { align: 'right' });
    y += 5.5;
    const discount = Number(costs.discount || 0);
    const tax = Number(costs.tax || 0);
    if (discount) {
      doc.text('Discount', M + 4, y);
      doc.text(`-${money(discount, currency)}`, W - M - 4, y, { align: 'right' });
      y += 5.5;
    }
    if (tax) {
      doc.text('Tax / VAT', M + 4, y);
      doc.text(money(tax, currency), W - M - 4, y, { align: 'right' });
      y += 5.5;
    }
    const calculated = subtotal - discount + tax;
    const total = Number(costs.total_cost) > 0 ? Number(costs.total_cost) : calculated;
    ensure(14);
    doc.setFillColor(...BRAND_ORANGE);
    doc.roundedRect(M, y - 1, contentW, 11, 1.5, 1.5, 'F');
    setFont(10.5, [255, 255, 255], 'bold');
    doc.text('TOTAL', M + 4, y + 6.2);
    doc.text(money(total, currency), W - M - 4, y + 6.2, { align: 'right' });
    y += 17;
  }

  if (hasAnyCost) {
    ensure(24);
    setFont(7.8, BRAND_LIGHT);
    const noteLines = wrap(L.quoteNote, contentW - 8, 7.8);
    doc.text(noteLines, M + 4, y);
    y += noteLines.length * 4 + 3;
  }

  footer();
  if (locale === 'ar' && typeof (doc as any).setR2L === 'function') (doc as any).setR2L(true);

  const dataUrl = doc.output('dataurlstring') as string;
  const bytes = new Uint8Array(doc.output('arraybuffer') as ArrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return { dataUrl, base64: btoa(binary) };
}
