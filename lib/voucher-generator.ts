import type { Booking } from './supabase';
import { safaris } from './tours-data';
import type { Locale } from './i18n';
import { normalizeLocale, formatLocaleDate } from './locale-content';
import { BRAND_TEAL, BRAND_ORANGE, BRAND_OFFWHITE, COMPANY, loadBrandLogo, drawBrandLogo } from './pdf-brand';
import { loadBrandStamp, drawStamp } from './pdf-stamp';
import { generateQrPngDataUrl } from './qr';

const BOOKING_TYPE_LABELS: Record<string, string> = {
  safari: 'Safari',
  excursion: 'Excursion',
  transfer: 'Transfer',
  hotel: 'Hotel Booking',
  custom: 'Custom Trip',
  contact: 'Enquiry',
};

// Voucher copy, following the same per-locale pattern used by
// payment-receipt-generator.ts and visa-itinerary-generator.ts. Booking
// references, names, emails, and phone numbers are never translated.
const labels: Record<Locale, Record<string, string>> = {
  en: { travelVoucher: 'TRAVEL VOUCHER · RESERVATION', status: 'STATUS', issued: 'Issued', travelerDetails: 'TRAVELER DETAILS', fullName: 'Full Name', email: 'Email', whatsapp: 'WhatsApp / Phone', nationality: 'Nationality', guests: 'Guests', adults: 'Adults', children: 'Children', childrenAges: 'Children Ages', years: 'years', tourPickupDetails: 'TOUR & PICKUP DETAILS', tourSafari: 'Tour / Safari', travelDate: 'Travel Date', duration: 'Duration', day: 'day', days: 'days', dayExcursion: 'Day excursion', parksIncluded: 'Parks Included', hotel: 'Hotel', pickupLocation: 'Pickup Location', specialRequests: 'Special Requests', paymentSnapshot: 'PAYMENT SNAPSHOT', totalPrice: 'Total Price', amountPaid: 'Amount Paid', balanceDue: 'Balance Due', paid: 'PAID IN FULL', partial: 'DEPOSIT / PARTIAL PAYMENT RECEIVED', unpaid: 'PAYMENT PENDING', receiptNote: 'This is a quick reference only — see your official invoice for the full cost breakdown.', whatToBring: 'WHAT TO BRING', checklist: 'Passport / ID and this voucher (printed or on your phone)|Sun protection: hat, sunglasses, sunscreen|Comfortable, closed-toe shoes and light layers|Reusable water bottle and a light rain jacket (seasonal)|Cash (KES or USD) for tips, drinks, and personal extras', emergencyContact: 'EMERGENCY CONTACT (BAHARI ASILI SAFARIS)', noteLine1: 'Please present this voucher (printed or on your phone) to your guide on arrival.', noteLine2: 'Pickup time will be confirmed via WhatsApp the evening before travel.', termsTitle: 'TERMS · CANCELLATION & CHANGES', policy: 'Free rescheduling up to 48 hours before the travel date, subject to availability.|Cancellations within 48 hours or no-shows may not be refundable — contact us as early as possible.|Itinerary, timings, and route may be adjusted for weather, safety, or wildlife conditions.', nonTransferable: 'Voucher is non-transferable · Subject to availability.', stamp: 'Company Stamp / Authorized Signature: ______________________', footer: '© 2026 Bahari Asili Safaris, Watamu, Kenya. Founded by Shadrack Safari. Thank you for choosing us for your Kenyan adventure.', page: 'Page', of: 'of' },
  it: { travelVoucher: 'VOUCHER DI VIAGGIO · PRENOTAZIONE', status: 'STATO', issued: 'Emesso il', travelerDetails: 'DATI DEL VIAGGIATORE', fullName: 'Nome completo', email: 'Email', whatsapp: 'WhatsApp / Telefono', nationality: 'Nazionalità', guests: 'Ospiti', adults: 'Adulti', children: 'Bambini', childrenAges: 'Età dei bambini', years: 'anni', tourPickupDetails: 'DETTAGLI TOUR E RITIRO', tourSafari: 'Tour / Safari', travelDate: 'Data del viaggio', duration: 'Durata', day: 'giorno', days: 'giorni', dayExcursion: 'Escursione giornaliera', parksIncluded: 'Parchi inclusi', hotel: 'Hotel', pickupLocation: 'Luogo di ritiro', specialRequests: 'Richieste speciali', paymentSnapshot: 'RIEPILOGO PAGAMENTO', totalPrice: 'Prezzo totale', amountPaid: 'Importo pagato', balanceDue: 'Saldo dovuto', paid: 'PAGATO PER INTERO', partial: 'ACCONTO / PAGAMENTO PARZIALE RICEVUTO', unpaid: 'PAGAMENTO IN SOSPESO', receiptNote: 'Questo è solo un riferimento rapido — consultate la vostra fattura ufficiale per il dettaglio completo dei costi.', whatToBring: 'COSA PORTARE', checklist: 'Passaporto / documento e questo voucher (stampato o sul telefono)|Protezione solare: cappello, occhiali da sole, crema solare|Scarpe comode e chiuse e abbigliamento leggero a strati|Borraccia riutilizzabile e una giacca antipioggia leggera (stagionale)|Contanti (KES o USD) per mance, bevande ed extra personali', emergencyContact: 'CONTATTO DI EMERGENZA (BAHARI ASILI SAFARIS)', noteLine1: 'Presentate questo voucher (stampato o sul telefono) alla vostra guida all’arrivo.', noteLine2: 'L’orario di ritiro sarà confermato via WhatsApp la sera prima della partenza.', termsTitle: 'TERMINI · CANCELLAZIONI E MODIFICHE', policy: 'Riprogrammazione gratuita fino a 48 ore prima della data di viaggio, soggetta a disponibilità.|Cancellazioni entro 48 ore o mancata presentazione potrebbero non essere rimborsabili — contattateci il prima possibile.|L’itinerario, gli orari e il percorso possono essere modificati per meteo, sicurezza o condizioni della fauna.', nonTransferable: 'Il voucher non è trasferibile · Soggetto a disponibilità.', stamp: 'Timbro aziendale / Firma autorizzata: ______________________', footer: '© 2026 Bahari Asili Safaris, Watamu, Kenya. Fondata da Shadrack Safari. Grazie per averci scelto per la vostra avventura in Kenya.', page: 'Pagina', of: 'di' },
  fr: { travelVoucher: 'BON DE VOYAGE · RÉSERVATION', status: 'STATUT', issued: 'Émis le', travelerDetails: 'INFORMATIONS DU VOYAGEUR', fullName: 'Nom complet', email: 'Email', whatsapp: 'WhatsApp / Téléphone', nationality: 'Nationalité', guests: 'Voyageurs', adults: 'Adultes', children: 'Enfants', childrenAges: 'Âges des enfants', years: 'ans', tourPickupDetails: 'DÉTAILS DU CIRCUIT ET DE LA PRISE EN CHARGE', tourSafari: 'Circuit / Safari', travelDate: 'Date du voyage', duration: 'Durée', day: 'jour', days: 'jours', dayExcursion: 'Excursion à la journée', parksIncluded: 'Parcs inclus', hotel: 'Hôtel', pickupLocation: 'Lieu de prise en charge', specialRequests: 'Demandes particulières', paymentSnapshot: 'RÉCAPITULATIF DU PAIEMENT', totalPrice: 'Prix total', amountPaid: 'Montant payé', balanceDue: 'Solde dû', paid: 'PAYÉ INTÉGRALEMENT', partial: 'ACOMPTE / PAIEMENT PARTIEL REÇU', unpaid: 'PAIEMENT EN ATTENTE', receiptNote: 'Ceci est une référence rapide uniquement — consultez votre facture officielle pour le détail complet des coûts.', whatToBring: 'À APPORTER', checklist: 'Passeport / pièce d’identité et ce bon (imprimé ou sur téléphone)|Protection solaire : chapeau, lunettes de soleil, crème solaire|Chaussures fermées confortables et vêtements légers superposables|Gourde réutilisable et une veste de pluie légère (selon saison)|Espèces (KES ou USD) pour pourboires, boissons et extras personnels', emergencyContact: 'CONTACT D’URGENCE (BAHARI ASILI SAFARIS)', noteLine1: 'Merci de présenter ce bon (imprimé ou sur téléphone) à votre guide à l’arrivée.', noteLine2: 'L’heure de prise en charge sera confirmée par WhatsApp la veille du départ.', termsTitle: 'CONDITIONS · ANNULATIONS ET MODIFICATIONS', policy: 'Report gratuit jusqu’à 48 heures avant la date de voyage, sous réserve de disponibilité.|Les annulations dans les 48 heures ou les no-shows peuvent ne pas être remboursables — contactez-nous dès que possible.|L’itinéraire, les horaires et le trajet peuvent être ajustés pour des raisons météo, de sécurité ou de faune.', nonTransferable: 'Le bon est non transférable · Sous réserve de disponibilité.', stamp: 'Cachet de la société / Signature autorisée : ______________________', footer: '© 2026 Bahari Asili Safaris, Watamu, Kenya. Fondée par Shadrack Safari. Merci d’avoir choisi votre aventure au Kenya avec nous.', page: 'Page', of: 'sur' },
  es: { travelVoucher: 'BONO DE VIAJE · RESERVA', status: 'ESTADO', issued: 'Emitido', travelerDetails: 'DATOS DEL VIAJERO', fullName: 'Nombre completo', email: 'Correo electrónico', whatsapp: 'WhatsApp / Teléfono', nationality: 'Nacionalidad', guests: 'Viajeros', adults: 'Adultos', children: 'Niños', childrenAges: 'Edades de los niños', years: 'años', tourPickupDetails: 'DETALLES DEL TOUR Y RECOGIDA', tourSafari: 'Tour / Safari', travelDate: 'Fecha del viaje', duration: 'Duración', day: 'día', days: 'días', dayExcursion: 'Excursión de un día', parksIncluded: 'Parques incluidos', hotel: 'Hotel', pickupLocation: 'Lugar de recogida', specialRequests: 'Solicitudes especiales', paymentSnapshot: 'RESUMEN DE PAGO', totalPrice: 'Precio total', amountPaid: 'Importe pagado', balanceDue: 'Saldo pendiente', paid: 'PAGADO POR COMPLETO', partial: 'DEPÓSITO / PAGO PARCIAL RECIBIDO', unpaid: 'PAGO PENDIENTE', receiptNote: 'Esto es solo una referencia rápida — consulte su factura oficial para el desglose completo de costes.', whatToBring: 'QUÉ LLEVAR', checklist: 'Pasaporte / documento de identidad y este bono (impreso o en el teléfono)|Protección solar: sombrero, gafas de sol, crema solar|Calzado cerrado cómodo y ropa ligera por capas|Botella de agua reutilizable y una chaqueta de lluvia ligera (según temporada)|Efectivo (KES o USD) para propinas, bebidas y extras personales', emergencyContact: 'CONTACTO DE EMERGENCIA (BAHARI ASILI SAFARIS)', noteLine1: 'Presente este bono (impreso o en el teléfono) a su guía a la llegada.', noteLine2: 'La hora de recogida se confirmará por WhatsApp la noche anterior al viaje.', termsTitle: 'CONDICIONES · CANCELACIONES Y CAMBIOS', policy: 'Reprogramación gratuita hasta 48 horas antes de la fecha de viaje, sujeta a disponibilidad.|Las cancelaciones dentro de las 48 horas o la no presentación pueden no ser reembolsables — contáctenos lo antes posible.|El itinerario, los horarios y la ruta pueden ajustarse por clima, seguridad o condiciones de la fauna.', nonTransferable: 'El bono no es transferible · Sujeto a disponibilidad.', stamp: 'Sello de la empresa / Firma autorizada: ______________________', footer: '© 2026 Bahari Asili Safaris, Watamu, Kenia. Fundada por Shadrack Safari. Gracias por elegirnos para su aventura en Kenia.', page: 'Página', of: 'de' },
  de: { travelVoucher: 'REISEGUTSCHEIN · BUCHUNG', status: 'STATUS', issued: 'Ausgestellt am', travelerDetails: 'REISENDENDATEN', fullName: 'Vollständiger Name', email: 'E-Mail', whatsapp: 'WhatsApp / Telefon', nationality: 'Nationalität', guests: 'Gäste', adults: 'Erwachsene', children: 'Kinder', childrenAges: 'Alter der Kinder', years: 'Jahre', tourPickupDetails: 'TOUR- & ABHOLDETAILS', tourSafari: 'Tour / Safari', travelDate: 'Reisedatum', duration: 'Dauer', day: 'Tag', days: 'Tage', dayExcursion: 'Tagesausflug', parksIncluded: 'Enthaltene Parks', hotel: 'Hotel', pickupLocation: 'Abholort', specialRequests: 'Besondere Wünsche', paymentSnapshot: 'ZAHLUNGSÜBERSICHT', totalPrice: 'Gesamtpreis', amountPaid: 'Bezahlter Betrag', balanceDue: 'Offener Betrag', paid: 'VOLLSTÄNDIG BEZAHLT', partial: 'ANZAHLUNG / TEILZAHLUNG ERHALTEN', unpaid: 'ZAHLUNG AUSSTEHEND', receiptNote: 'Dies ist nur eine kurze Übersicht — die vollständige Kostenaufstellung finden Sie in Ihrer offiziellen Rechnung.', whatToBring: 'WAS MITZUBRINGEN IST', checklist: 'Reisepass / Ausweis und dieser Gutschein (ausgedruckt oder auf dem Handy)|Sonnenschutz: Hut, Sonnenbrille, Sonnencreme|Bequeme, geschlossene Schuhe und leichte Kleidungsschichten|Wiederverwendbare Wasserflasche und eine leichte Regenjacke (saisonal)|Bargeld (KES oder USD) für Trinkgelder, Getränke und persönliche Extras', emergencyContact: 'NOTFALLKONTAKT (BAHARI ASILI SAFARIS)', noteLine1: 'Bitte zeigen Sie diesen Gutschein (ausgedruckt oder auf dem Handy) Ihrem Guide bei Ankunft.', noteLine2: 'Die Abholzeit wird am Vorabend der Reise per WhatsApp bestätigt.', termsTitle: 'BEDINGUNGEN · STORNIERUNG & ÄNDERUNGEN', policy: 'Kostenlose Umbuchung bis 48 Stunden vor dem Reisedatum, vorbehaltlich Verfügbarkeit.|Stornierungen innerhalb von 48 Stunden oder Nichterscheinen sind möglicherweise nicht erstattungsfähig — kontaktieren Sie uns so früh wie möglich.|Reiseplan, Zeiten und Route können aus Wetter-, Sicherheits- oder Tierbeobachtungsgründen angepasst werden.', nonTransferable: 'Der Gutschein ist nicht übertragbar · Vorbehaltlich Verfügbarkeit.', stamp: 'Firmenstempel / Unterschrift: ______________________', footer: '© 2026 Bahari Asili Safaris, Watamu, Kenia. Gegründet von Shadrack Safari. Danke, dass Sie uns für Ihr Kenia-Abenteuer gewählt haben.', page: 'Seite', of: 'von' },
  ar: { travelVoucher: 'قسيمة السفر · الحجز', status: 'الحالة', issued: 'تاريخ الإصدار', travelerDetails: 'بيانات المسافر', fullName: 'الاسم الكامل', email: 'البريد الإلكتروني', whatsapp: 'واتساب / الهاتف', nationality: 'الجنسية', guests: 'الضيوف', adults: 'البالغون', children: 'الأطفال', childrenAges: 'أعمار الأطفال', years: 'سنوات', tourPickupDetails: 'تفاصيل الجولة والاستلام', tourSafari: 'الجولة / السفاري', travelDate: 'تاريخ السفر', duration: 'المدة', day: 'يوم', days: 'أيام', dayExcursion: 'رحلة نهارية', parksIncluded: 'المتنزهات المشمولة', hotel: 'الفندق', pickupLocation: 'مكان الاستلام', specialRequests: 'طلبات خاصة', paymentSnapshot: 'ملخص الدفع', totalPrice: 'السعر الإجمالي', amountPaid: 'المبلغ المدفوع', balanceDue: 'الرصيد المستحق', paid: 'مدفوع بالكامل', partial: 'تم استلام عربون / دفعة جزئية', unpaid: 'الدفع معلق', receiptNote: 'هذا مرجع سريع فقط — راجع فاتورتك الرسمية للاطلاع على تفصيل التكاليف كاملاً.', whatToBring: 'ما يجب إحضاره', checklist: 'جواز السفر / الهوية وهذه القسيمة (مطبوعة أو على الهاتف)|واقي الشمس: قبعة، نظارة شمسية، كريم واقٍ|أحذية مريحة مغلقة وطبقات خفيفة من الملابس|زجاجة مياه قابلة لإعادة الاستخدام وسترة مطر خفيفة (حسب الموسم)|نقود (كينية أو دولار) للإكراميات والمشروبات والمصاريف الشخصية', emergencyContact: 'جهة اتصال الطوارئ (Bahari Asili Safaris)', noteLine1: 'يرجى تقديم هذه القسيمة (مطبوعة أو على الهاتف) لمرشدكم عند الوصول.', noteLine2: 'سيتم تأكيد موعد الاستلام عبر واتساب مساء اليوم السابق للسفر.', termsTitle: 'الشروط · الإلغاء والتغييرات', policy: 'إعادة الجدولة مجانًا حتى 48 ساعة قبل تاريخ السفر، حسب التوافر.|قد لا تكون الإلغاءات خلال 48 ساعة أو عدم الحضور قابلة للاسترداد — يرجى الاتصال بنا في أقرب وقت ممكن.|قد يتم تعديل خط السير والأوقات والمسار حسب الطقس أو السلامة أو أحوال الحياة البرية.', nonTransferable: 'القسيمة غير قابلة للتحويل · حسب التوافر.', stamp: 'ختم الشركة / التوقيع المعتمد: ______________________', footer: '© 2026 Bahari Asili Safaris، واتامو، كينيا. أسسها شدرَاك سفاري. شكرًا لاختياركم مغامرتكم الكينية معنا.', page: 'صفحة', of: 'من' },
  zh: { travelVoucher: '旅行凭证 · 预订', status: '状态', issued: '签发日期', travelerDetails: '旅客信息', fullName: '姓名', email: '电子邮箱', whatsapp: 'WhatsApp / 电话', nationality: '国籍', guests: '客人', adults: '成人', children: '儿童', childrenAges: '儿童年龄', years: '岁', tourPickupDetails: '行程与接送详情', tourSafari: '行程 / Safari', travelDate: '旅行日期', duration: '行程时长', day: '天', days: '天', dayExcursion: '一日游', parksIncluded: '含公园', hotel: '酒店', pickupLocation: '接送地点', specialRequests: '特殊要求', paymentSnapshot: '付款概览', totalPrice: '总价', amountPaid: '已付金额', balanceDue: '待付余额', paid: '已全额付款', partial: '已收订金/部分付款', unpaid: '付款待处理', receiptNote: '此仅作快速参考 — 完整费用明细请查看正式发票。', whatToBring: '需携带物品', checklist: '护照/证件及本凭证（打印件或手机存档）|防晒用品：帽子、太阳镜、防晒霜|舒适的包头鞋及轻便分层衣物|可重复使用的水瓶及轻便雨衣（视季节而定）|现金（肯尼亚先令或美元）用于小费、饮品及个人开销', emergencyContact: '紧急联系方式（BAHARI ASILI SAFARIS）', noteLine1: '请在抵达时向您的向导出示本凭证（打印件或手机存档）。', noteLine2: '接送时间将于出发前一晚通过WhatsApp确认。', termsTitle: '条款 · 取消与变更', policy: '出发日期前48小时可免费改期，视名额而定。|48小时内取消或未出现可能不予退款 — 请尽早与我们联系。|行程、时间及路线可能因天气、安全或野生动物情况而调整。', nonTransferable: '本凭证不可转让 · 视名额而定。', stamp: '公司印章/授权签字：______________________', footer: '© 2026 Bahari Asili Safaris，瓦塔穆，肯尼亚。由 Shadrack Safari 创立。感谢您选择我们，开启您的肯尼亚之旅。', page: '第', of: '页，共' },
  sw: { travelVoucher: 'HATI YA SAFARI · BOOKING', status: 'HALI', issued: 'Ilitolewa', travelerDetails: 'TAARIFA ZA MSAFIRI', fullName: 'Jina kamili', email: 'Barua pepe', whatsapp: 'WhatsApp / Simu', nationality: 'Utaifa', guests: 'Wasafiri', adults: 'Watu wazima', children: 'Watoto', childrenAges: 'Umri wa watoto', years: 'miaka', tourPickupDetails: 'TAARIFA ZA ZIARA NA KUCHUKULIWA', tourSafari: 'Ziara / Safari', travelDate: 'Tarehe ya safari', duration: 'Muda', day: 'siku', days: 'siku', dayExcursion: 'Ziara ya siku moja', parksIncluded: 'Hifadhi zilizojumuishwa', hotel: 'Hoteli', pickupLocation: 'Mahali pa kuchukuliwa', specialRequests: 'Maombi maalum', paymentSnapshot: 'MUHTASARI WA MALIPO', totalPrice: 'Bei jumla', amountPaid: 'Kiasi kilicholipwa', balanceDue: 'Salio linalodaiwa', paid: 'IMELIPWA KAMILI', partial: 'AMANA / MALIPO YA SEHEMU YAMEPOKELEWA', unpaid: 'MALIPO YANASUBIRIWA', receiptNote: 'Hii ni kumbukumbu ya haraka tu — angalia ankara yako rasmi kwa maelezo kamili ya gharama.', whatToBring: 'VITU VYA KUBEBA', checklist: 'Pasipoti / kitambulisho na hati hii (iliyochapishwa au kwenye simu)|Kinga ya jua: kofia, miwani ya jua, mafuta ya jua|Viatu vizuri vilivyofungwa na mavazi mepesi ya tabaka|Chupa ya maji inayoweza kutumika tena na koti jepesi la mvua (kulingana na msimu)|Fedha taslimu (KES au USD) kwa ada za huduma, vinywaji, na matumizi binafsi', emergencyContact: 'MAWASILIANO YA DHARURA (BAHARI ASILI SAFARIS)', noteLine1: 'Tafadhali onyesha hati hii (iliyochapishwa au kwenye simu) kwa kiongozi wako mnapowasili.', noteLine2: 'Muda wa kuchukuliwa utathibitishwa kupitia WhatsApp jioni kabla ya safari.', termsTitle: 'MASHARTI · UGHAIRISHAJI NA MABADILIKO', policy: 'Kubadilisha tarehe bila malipo hadi saa 48 kabla ya tarehe ya safari, kulingana na upatikanaji.|Ughairishaji ndani ya saa 48 au kutokuwepo huenda usirudishiwe fedha — wasiliana nasi mapema iwezekanavyo.|Ratiba, nyakati, na njia zinaweza kubadilishwa kwa sababu za hali ya hewa, usalama, au wanyamapori.', nonTransferable: 'Hati hii haihamishiki · Inategemea upatikanaji.', stamp: 'Muhuri wa Kampuni / Sahihi Iliyoidhinishwa: ______________________', footer: '© 2026 Bahari Asili Safaris, Watamu, Kenya. Ilianzishwa na Shadrack Safari. Asante kwa kutuchagua kwa safari yako ya Kenya.', page: 'Ukurasa', of: 'kati ya' },
};

function formatMoney(amount: number | null | undefined, currency?: string | null): string {
  if (amount === null || amount === undefined) return '—';
  // Every price anywhere in the app is computed in KES — there is no USD
  // amount anywhere in the pipeline. This previously hardcoded "USD", which
  // mislabeled real KES totals. `currency` (from booking.currency) lets a
  // real multi-currency booking override this later without reintroducing
  // that mislabeling bug.
  return `${currency || 'KES'} ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

/**
 * Generate a travel voucher PDF using jsPDF. Works both server-side (API
 * routes, Node runtime) and client-side — jsPDF and its output() methods
 * (dataurlstring / arraybuffer) work in both environments.
 *
 * This is the single shared voucher template — used for the customer's
 * immediate on-screen download, the emailed confirmation copy, and every
 * admin-triggered resend — so all three are always identical. `requestedLocale`
 * follows the same optional-override pattern as the other document
 * generators: falls back to the booking's stored locale, then to English.
 */
export async function generateVoucherPDF(booking: Booking, requestedLocale?: Locale, documentUrl?: string): Promise<{ dataUrl: string; base64: string }> {
  const locale = normalizeLocale(requestedLocale || booking.locale);
  const L = labels[locale];
  const formatDate = (value: string | null | undefined) => formatLocaleDate(value, locale);
  const { jsPDF } = await import('jspdf');
  const logo = await loadBrandLogo();
  const stamp = await loadBrandStamp();
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const PAGE_BOTTOM = 284;
  const MARGIN = 14;
  const COLOR_PRIMARY = BRAND_TEAL; // #107390
  const COLOR_ACCENT = BRAND_ORANGE; // #f97216
  const COLOR_OFFWHITE = BRAND_OFFWHITE; // #f5f1e8
  const COLOR_TEXT = [31, 41, 55];
  const COLOR_LIGHT = [100, 116, 139];

  let y = 14;

  const drawContinuationHeader = () => {
    doc.setFillColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.rect(0, 0, W, 16, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`BAHARI ASILI SAFARIS · VOUCHER ${booking.booking_ref || ''} (cont.)`, MARGIN, 10);
    y = 24;
  };

  // Adds a new page (with a slim continuation header) if the next block of
  // `neededMM` wouldn't fit on the current page.
  const ensureSpace = (neededMM: number) => {
    if (y + neededMM > PAGE_BOTTOM) {
      doc.addPage();
      drawContinuationHeader();
    }
  };

  // ===== HEADER — white band with full-color logo top-left, contact info top-right =====
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, 40, 'F');
  drawBrandLogo(doc, logo, MARGIN, 9, 20);
  doc.setTextColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`${COMPANY.address}  ·  ${COMPANY.phone}`, W - MARGIN, 14, { align: 'right' });
  doc.text(COMPANY.email, W - MARGIN, 20, { align: 'right' });
  doc.setFontSize(7.5);
  doc.setTextColor(COLOR_LIGHT[0], COLOR_LIGHT[1], COLOR_LIGHT[2]);
  doc.text(COMPANY.founded, W - MARGIN, 26, { align: 'right' });

  // Booking-type badge, top right of header
  const typeLabel = (BOOKING_TYPE_LABELS[booking.booking_type || 'safari'] || 'Booking').toUpperCase();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  const typeLabelW = doc.getTextWidth(typeLabel) + 8;
  doc.setFillColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.roundedRect(W - MARGIN - typeLabelW, 30, typeLabelW, 7, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text(typeLabel, W - MARGIN - typeLabelW / 2, 34.7, { align: 'center' });

  doc.setDrawColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.setLineWidth(0.5);
  doc.line(0, 40, W, 40);

  // ===== TRAVEL VOUCHER BANNER =====
  doc.setFillColor(COLOR_ACCENT[0], COLOR_ACCENT[1], COLOR_ACCENT[2]);
  doc.rect(0, 42, W, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(L.travelVoucher, MARGIN, 50);
  doc.setFontSize(17);
  doc.text(booking.booking_ref || '', MARGIN, 58);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const statusLabel = (booking.reservation_status || 'pending').toUpperCase();
  doc.text(`${L.status}: ${statusLabel}`, W - MARGIN, 54, { align: 'right' });
  doc.setFontSize(7.5);
  const issuedLabel = booking.created_at ? formatDate(booking.created_at) : formatDate(new Date().toISOString());
  doc.text(`${L.issued}: ${issuedLabel}`, W - MARGIN, 60, { align: 'right' });

  y = 72;

  const sectionHeader = (label: string) => {
    ensureSpace(14);
    doc.setFillColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
    doc.rect(MARGIN, y - 3, W - 2 * MARGIN, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(COLOR_OFFWHITE[0], COLOR_OFFWHITE[1], COLOR_OFFWHITE[2]);
    doc.text(label, MARGIN + 2, y + 2);
    y += 10;
  };

  const row = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const maxWidth = W - MARGIN - 70;
    const lines = doc.splitTextToSize(value || '—', maxWidth);
    ensureSpace(Math.max(5, lines.length * 4) + 2);
    doc.setTextColor(COLOR_LIGHT[0], COLOR_LIGHT[1], COLOR_LIGHT[2]);
    doc.text(label, MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
    doc.text(lines, 80, y);
    y += Math.max(5, lines.length * 4);
  };

  // ===== TRAVELER DETAILS =====
  sectionHeader(L.travelerDetails);
  row(L.fullName, `${booking.first_name} ${booking.last_name}`);
  row(L.email, booking.email);
  row(L.whatsapp, booking.whatsapp || '—');
  if (booking.nationality) row(L.nationality, booking.nationality);
  row(L.guests, `${booking.adults} ${L.adults}${booking.children > 0 ? ` + ${booking.children} ${L.children}` : ''}`);
  if (booking.children > 0 && booking.kids_ages?.length) {
    row(L.childrenAges, `${booking.kids_ages.join(', ')} ${L.years}`);
  }

  y += 4;

  // ===== TOUR / PICKUP DETAILS =====
  sectionHeader(L.tourPickupDetails);
  row(L.tourSafari, booking.safari_name);
  row(L.travelDate, formatDate(booking.arrival_date));

  const matchedSafari = safaris.find(s => s.name === booking.safari_name);
  if (matchedSafari) {
    row(L.duration, matchedSafari.days > 0 ? `${matchedSafari.days} ${matchedSafari.days > 1 ? L.days : L.day}` : L.dayExcursion);
    if (matchedSafari.parks?.length) row(L.parksIncluded, matchedSafari.parks.join(' · '));
  }
  if (booking.hotel_name) row(L.hotel, booking.hotel_name);
  if (booking.pickup_location) row(L.pickupLocation, booking.pickup_location);
  if (booking.message) row(L.specialRequests, booking.message);

  y += 4;

  const rowTotal = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const maxWidth = W - MARGIN - 70;
    const lines = doc.splitTextToSize(value || '—', maxWidth);
    ensureSpace(Math.max(5, lines.length * 4) + 2);
    doc.setTextColor(COLOR_LIGHT[0], COLOR_LIGHT[1], COLOR_LIGHT[2]);
    doc.text(label, MARGIN, y);
    doc.setTextColor(COLOR_ACCENT[0], COLOR_ACCENT[1], COLOR_ACCENT[2]);
    doc.text(lines, 80, y);
    y += Math.max(5, lines.length * 4);
  };

  // ===== PAYMENT SNAPSHOT (only once pricing/payment has actually been set) =====
  if (booking.total_price !== null && booking.total_price !== undefined) {
    sectionHeader(L.paymentSnapshot);
    rowTotal(L.totalPrice, formatMoney(booking.total_price, booking.currency));
    row(L.amountPaid, formatMoney(booking.amount_paid ?? 0, booking.currency));
    rowTotal(L.balanceDue, formatMoney(booking.balance_due ?? (booking.total_price - (booking.amount_paid ?? 0)), booking.currency));
    const payLabel = L[(booking.payment_status || 'unpaid') as 'paid' | 'partial' | 'unpaid'] || L.unpaid;
    const payColor = booking.payment_status === 'paid' ? [21, 128, 61] : booking.payment_status === 'partial' ? [180, 83, 9] : [185, 28, 28];
    ensureSpace(6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(payColor[0], payColor[1], payColor[2]);
    doc.text(payLabel, MARGIN, y);
    y += 6;
    ensureSpace(5);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(COLOR_LIGHT[0], COLOR_LIGHT[1], COLOR_LIGHT[2]);
    doc.text(L.receiptNote, MARGIN, y);
    y += 6;
  }

  y += 4;

  // ===== WHAT TO BRING =====
  sectionHeader(L.whatToBring);
  const checklist = L.checklist.split('|');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(COLOR_TEXT[0], COLOR_TEXT[1], COLOR_TEXT[2]);
  for (const item of checklist) {
    const lines = doc.splitTextToSize(item, W - 2 * MARGIN - 5);
    ensureSpace(Math.max(5, lines.length * 4));
    doc.text('•', MARGIN, y);
    doc.text(lines, MARGIN + 4, y);
    y += Math.max(5, lines.length * 4);
  }

  y += 3;

  // ===== EMERGENCY CONTACT =====
  sectionHeader(L.emergencyContact);
  row(L.whatsapp, COMPANY.phone);
  row(L.email, COMPANY.email);

  y += 3;

  // ===== NOTE BOX =====
  ensureSpace(18);
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(MARGIN, y, W - 2 * MARGIN, 16, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(21, 128, 61);
  doc.text(L.noteLine1, MARGIN + 4, y + 6);
  doc.text(L.noteLine2, MARGIN + 4, y + 11);

  y += 20;

  // ===== CANCELLATION & CHANGES POLICY =====
  const policyLines = L.policy.split('|');
  const policyHeight = 8 + policyLines.length * 5;
  ensureSpace(policyHeight + 4);
  doc.setDrawColor(COLOR_ACCENT[0], COLOR_ACCENT[1], COLOR_ACCENT[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN, y, W - 2 * MARGIN, policyHeight, 2, 2, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(COLOR_ACCENT[0], COLOR_ACCENT[1], COLOR_ACCENT[2]);
  doc.text(L.termsTitle, MARGIN + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(55, 65, 81);
  policyLines.forEach((line, i) => {
    doc.text(`• ${line}`, MARGIN + 4, y + 12 + i * 5);
  });
  y += policyHeight + 6;
  ensureSpace(5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(COLOR_LIGHT[0], COLOR_LIGHT[1], COLOR_LIGHT[2]);
  doc.text(L.nonTransferable, MARGIN, y);

  y += 7;

  // ===== FOOTER =====
  doc.setFontSize(7);
  const footerLines = doc.splitTextToSize(L.footer, W - 2 * MARGIN - 8);
  const contactLine = `${COMPANY.website}  ·  ${COMPANY.email}  ·  ${COMPANY.phone}`;
  const footerBandHeight = 6 + footerLines.length * 3.2 + 5;
  ensureSpace(14 + footerBandHeight);
  doc.setDrawColor(COLOR_LIGHT[0], COLOR_LIGHT[1], COLOR_LIGHT[2]);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, W - MARGIN, y);
  y += 6;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(COLOR_LIGHT[0], COLOR_LIGHT[1], COLOR_LIGHT[2]);
  doc.text(L.stamp, MARGIN, y);
  y += 8;

  // Teal band with off-white text, matching invoice/receipt/visa footers
  doc.setFillColor(COLOR_PRIMARY[0], COLOR_PRIMARY[1], COLOR_PRIMARY[2]);
  doc.roundedRect(MARGIN, y, W - 2 * MARGIN, footerBandHeight, 2, 2, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(COLOR_OFFWHITE[0], COLOR_OFFWHITE[1], COLOR_OFFWHITE[2]);
  doc.text(footerLines, W / 2, y + 5, { align: 'center' });
  doc.text(contactLine, W / 2, y + 5 + footerLines.length * 3.2 + 3, { align: 'center' });

  // QR code linking to this document's own public URL — bottom-left of the
  // footer band, clear of the official stamp which owns the bottom-right.
  if (documentUrl) {
    const qr = await generateQrPngDataUrl(documentUrl);
    if (qr) {
      const qrSize = 14;
      doc.addImage(qr, 'PNG', MARGIN + 2, y + (footerBandHeight - qrSize) / 2, qrSize, qrSize);
    }
  }

  // Official digital stamp, bottom-right, overlapping the footer band (last page only).
  drawStamp(doc, stamp, locale, { pageWidth: W, footerTopY: y });

  // Page numbers, once we know the final page count
  const totalPages = (doc as unknown as { getNumberOfPages: () => number }).getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.text(`${L.page} ${p} ${L.of} ${totalPages}`, W - MARGIN, 292, { align: 'right' });
  }

  if (locale === 'ar' && typeof (doc as unknown as { setR2L?: (v: boolean) => void }).setR2L === 'function') {
    (doc as unknown as { setR2L: (v: boolean) => void }).setR2L(true);
  }

  const dataUrl = doc.output('dataurlstring') as string;
  const pdf = doc.output('arraybuffer');
  const binary = new Uint8Array(pdf);
  let bin = '';
  for (let i = 0; i < binary.length; i++) bin += String.fromCharCode(binary[i]);
  const base64String = btoa(bin);

  return { dataUrl, base64: base64String };
}
