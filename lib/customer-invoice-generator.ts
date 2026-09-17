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
    evening?: string;
    meals?: string;
    overnight?: string;
  }>;
  packingTips?: string[];
  included?: string[];
  excluded?: string[];
}

/**
 * Kept for API compatibility. The first customer booking document is
 * intentionally non-financial: costs are owned by the admin Quoted Invoice.
 */
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

const baseLabels: Labels = {
  title: 'BOOKING REQUEST / PROVISIONAL INVOICE',
  subtitle: 'Your complete booking and travel reference',
  quick: 'BOOKING SUMMARY',
  document: 'DOCUMENT INFORMATION',
  client: 'TRAVELLER DETAILS',
  trip: 'TRIP OVERVIEW',
  package: 'SELECTED PACKAGE',
  itinerary: 'DAY-BY-DAY ITINERARY',
  highlights: 'TRIP HIGHLIGHTS',
  included: "WHAT'S INCLUDED",
  excluded: "WHAT'S NOT INCLUDED",
  packing: 'PACKING & TRAVEL TIPS',
  requests: 'SPECIAL REQUESTS',
  next: 'WHAT HAPPENS NEXT',
  important: 'IMPORTANT INFORMATION',
  support: 'NEED HELP WITH YOUR BOOKING?',
  name: 'Full name',
  email: 'Email',
  whatsapp: 'WhatsApp / phone',
  nationality: 'Nationality',
  travellers: 'Travellers',
  adults: 'Adults',
  children: 'Children',
  childrenAges: 'Children ages',
  arrival: 'Start date',
  departure: 'End date',
  duration: 'Duration',
  route: 'Route / locations',
  parks: 'Parks / destinations',
  lodges: 'Accommodation',
  status: 'Booking status',
  category: 'Package type',
  activity: 'Activity level',
  comfort: 'Comfort level',
  rating: 'Guest rating',
  reference: 'Booking reference',
  documentType: 'Document',
  generated: 'Generated',
  pricing: 'Pricing status',
  noPricing: 'To be confirmed',
  pending: 'Pending confirmation',
  confirmed: 'Confirmed',
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  meals: 'Meals',
  overnight: 'Overnight',
  location: 'Location',
  details: 'Details',
  bookingReceived: 'Booking request received',
  availability: 'Availability review',
  quotation: 'Official quoted invoice',
  payment: 'Payment',
  voucher: 'Confirmation and voucher',
  requestReceivedText: 'Your booking request has been received by Bahari Asili Safaris.',
  availabilityText: 'Our team reviews availability, accommodation, transport, activities and other requested arrangements.',
  quotationText: 'An official Quoted Invoice is issued after the requested arrangements and applicable costs are reviewed.',
  paymentText: 'Payment instructions are provided with the official quotation when payment is due.',
  voucherText: 'After confirmation, Bahari Asili Safaris issues the final booking confirmation and travel voucher.',
  pricingNote: 'This first booking document does not contain pricing. Final availability, accommodation, routing and costs will be reviewed and confirmed by Bahari Asili Safaris before payment.',
  importantNote: 'This document records the booking request submitted online. It does not by itself confirm that accommodation, transport, park entry, activities or other travel arrangements have been secured. Please keep the booking reference available whenever contacting Bahari Asili Safaris.',
  supportNote: 'For questions, amendments or booking assistance, contact us using the details below and quote your booking reference.',
  notProvided: 'Not provided',
  toConfirm: 'To be confirmed',
  day: 'Day',
  page: 'Page',
};

const translations: Partial<Record<Locale, Labels>> = {
  it: {
    title: 'RICHIESTA DI PRENOTAZIONE / FATTURA PROVVISORIA', subtitle: 'Riferimento completo per la prenotazione e il viaggio', quick: 'RIEPILOGO PRENOTAZIONE', document: 'INFORMAZIONI DEL DOCUMENTO', client: 'DATI DEL VIAGGIATORE', trip: 'PANORAMICA DEL VIAGGIO', package: 'PACCHETTO SELEZIONATO', itinerary: 'ITINERARIO GIORNO PER GIORNO', highlights: 'PUNTI SALIENTI', included: 'COSA È INCLUSO', excluded: 'COSA NON È INCLUSO', packing: 'BAGAGLIO E CONSIGLI DI VIAGGIO', requests: 'RICHIESTE SPECIALI', next: 'COSA SUCCEDE DOPO', important: 'INFORMAZIONI IMPORTANTI', support: 'HAI BISOGNO DI AIUTO?', name: 'Nome completo', email: 'Email', whatsapp: 'WhatsApp / telefono', nationality: 'Nazionalità', travellers: 'Viaggiatori', adults: 'Adulti', children: 'Bambini', childrenAges: 'Età bambini', arrival: 'Data di inizio', departure: 'Data di fine', duration: 'Durata', route: 'Percorso / località', parks: 'Parchi / destinazioni', lodges: 'Sistemazione', status: 'Stato della prenotazione', category: 'Tipo di pacchetto', activity: 'Livello attività', comfort: 'Livello comfort', rating: 'Valutazione ospiti', reference: 'Riferimento prenotazione', documentType: 'Documento', generated: 'Generato', pricing: 'Stato del prezzo', noPricing: 'Da confermare', pending: 'In attesa di conferma', confirmed: 'Confermato', morning: 'Mattina', afternoon: 'Pomeriggio', evening: 'Sera', meals: 'Pasti', overnight: 'Pernottamento', location: 'Località', details: 'Dettagli', bookingReceived: 'Richiesta ricevuta', availability: 'Verifica disponibilità', quotation: 'Preventivo ufficiale', payment: 'Pagamento', voucher: 'Conferma e voucher', requestReceivedText: 'La richiesta di prenotazione è stata ricevuta da Bahari Asili Safaris.', availabilityText: 'Il nostro team verifica disponibilità, sistemazione, trasporto, attività e altri servizi richiesti.', quotationText: 'Il preventivo ufficiale viene emesso dopo la verifica dei servizi richiesti e dei relativi costi.', paymentText: 'Le istruzioni per il pagamento vengono fornite con il preventivo ufficiale quando il pagamento è dovuto.', voucherText: 'Dopo la conferma, Bahari Asili Safaris emette la conferma finale e il voucher di viaggio.', pricingNote: 'Questo primo documento di prenotazione non contiene prezzi. Disponibilità, sistemazione, percorso e costi finali saranno verificati e confermati da Bahari Asili Safaris prima del pagamento.', importantNote: 'Questo documento registra la richiesta di prenotazione inviata online. Non conferma di per sé alloggio, trasporto, ingressi ai parchi, attività o altri servizi. Conservare il riferimento della prenotazione per ogni contatto con Bahari Asili Safaris.', supportNote: 'Per domande, modifiche o assistenza, contattaci utilizzando i recapiti qui sotto e indica il riferimento della prenotazione.', notProvided: 'Non fornito', toConfirm: 'Da confermare', day: 'Giorno', page: 'Pagina',
  },
  fr: {
    title: 'DEMANDE DE RÉSERVATION / FACTURE PROVISOIRE', subtitle: 'Référence complète de votre réservation et de votre voyage', quick: 'RÉCAPITULATIF DE LA RÉSERVATION', document: 'INFORMATIONS DU DOCUMENT', client: 'INFORMATIONS VOYAGEUR', trip: 'APERÇU DU VOYAGE', package: 'FORFAIT SÉLECTIONNÉ', itinerary: 'ITINÉRAIRE JOUR PAR JOUR', highlights: 'POINTS FORTS', included: 'CE QUI EST INCLUS', excluded: 'CE QUI N’EST PAS INCLUS', packing: 'BAGAGES ET CONSEILS DE VOYAGE', requests: 'DEMANDES PARTICULIÈRES', next: 'QUE SE PASSE-T-IL ENSUITE ?', important: 'INFORMATIONS IMPORTANTES', support: 'BESOIN D’AIDE ?', name: 'Nom complet', email: 'Email', whatsapp: 'WhatsApp / téléphone', nationality: 'Nationalité', travellers: 'Voyageurs', adults: 'Adultes', children: 'Enfants', childrenAges: 'Âges des enfants', arrival: 'Date de début', departure: 'Date de fin', duration: 'Durée', route: 'Itinéraire / lieux', parks: 'Parcs / destinations', lodges: 'Hébergement', status: 'Statut de réservation', category: 'Type de forfait', activity: 'Niveau d’activité', comfort: 'Niveau de confort', rating: 'Note des voyageurs', reference: 'Référence de réservation', documentType: 'Document', generated: 'Généré', pricing: 'État du prix', noPricing: 'À confirmer', pending: 'En attente de confirmation', confirmed: 'Confirmé', morning: 'Matin', afternoon: 'Après-midi', evening: 'Soir', meals: 'Repas', overnight: 'Nuit', location: 'Lieu', details: 'Détails', bookingReceived: 'Demande reçue', availability: 'Vérification de disponibilité', quotation: 'Devis officiel', payment: 'Paiement', voucher: 'Confirmation et voucher', requestReceivedText: 'Votre demande de réservation a été reçue par Bahari Asili Safaris.', availabilityText: 'Notre équipe vérifie la disponibilité, l’hébergement, le transport, les activités et les autres services demandés.', quotationText: 'Un devis officiel est émis après vérification des services demandés et des coûts applicables.', paymentText: 'Les instructions de paiement sont fournies avec le devis officiel lorsque le paiement est requis.', voucherText: 'Après confirmation, Bahari Asili Safaris émet la confirmation finale et le voucher de voyage.', pricingNote: 'Ce premier document de réservation ne contient aucun prix. La disponibilité, l’hébergement, l’itinéraire et les coûts finaux seront vérifiés et confirmés par Bahari Asili Safaris avant paiement.', importantNote: 'Ce document enregistre la demande de réservation envoyée en ligne. Il ne confirme pas à lui seul l’hébergement, le transport, les entrées de parc, les activités ou les autres services. Conservez la référence de réservation pour tout contact avec Bahari Asili Safaris.', supportNote: 'Pour toute question, modification ou assistance, contactez-nous avec les coordonnées ci-dessous et indiquez votre référence de réservation.', notProvided: 'Non fourni', toConfirm: 'À confirmer', day: 'Jour', page: 'Page',
  },
  es: {
    title: 'SOLICITUD DE RESERVA / FACTURA PROVISIONAL', subtitle: 'Referencia completa de su reserva y viaje', quick: 'RESUMEN DE LA RESERVA', document: 'INFORMACIÓN DEL DOCUMENTO', client: 'DATOS DEL VIAJERO', trip: 'RESUMEN DEL VIAJE', package: 'PAQUETE SELECCIONADO', itinerary: 'ITINERARIO DÍA A DÍA', highlights: 'DESTACADOS', included: 'QUÉ ESTÁ INCLUIDO', excluded: 'QUÉ NO ESTÁ INCLUIDO', packing: 'EQUIPAJE Y CONSEJOS DE VIAJE', requests: 'SOLICITUDES ESPECIALES', next: 'QUÉ SUCEDE A CONTINUACIÓN', important: 'INFORMACIÓN IMPORTANTE', support: '¿NECESITA AYUDA?', name: 'Nombre completo', email: 'Correo electrónico', whatsapp: 'WhatsApp / teléfono', nationality: 'Nacionalidad', travellers: 'Viajeros', adults: 'Adultos', children: 'Niños', childrenAges: 'Edades de los niños', arrival: 'Fecha de inicio', departure: 'Fecha de fin', duration: 'Duración', route: 'Ruta / lugares', parks: 'Parques / destinos', lodges: 'Alojamiento', status: 'Estado de la reserva', category: 'Tipo de paquete', activity: 'Nivel de actividad', comfort: 'Nivel de confort', rating: 'Valoración', reference: 'Referencia de reserva', documentType: 'Documento', generated: 'Generado', pricing: 'Estado del precio', noPricing: 'Por confirmar', pending: 'Pendiente de confirmación', confirmed: 'Confirmado', morning: 'Mañana', afternoon: 'Tarde', evening: 'Noche', meals: 'Comidas', overnight: 'Alojamiento', location: 'Lugar', details: 'Detalles', bookingReceived: 'Solicitud recibida', availability: 'Revisión de disponibilidad', quotation: 'Presupuesto oficial', payment: 'Pago', voucher: 'Confirmación y voucher', requestReceivedText: 'Bahari Asili Safaris ha recibido su solicitud de reserva.', availabilityText: 'Nuestro equipo revisará disponibilidad, alojamiento, transporte, actividades y otros servicios solicitados.', quotationText: 'Se emitirá un presupuesto oficial después de revisar los servicios solicitados y los costes aplicables.', paymentText: 'Las instrucciones de pago se proporcionan con el presupuesto oficial cuando corresponda.', voucherText: 'Después de la confirmación, Bahari Asili Safaris emitirá la confirmación final y el voucher de viaje.', pricingNote: 'Este primer documento de reserva no contiene precios. La disponibilidad, el alojamiento, la ruta y los costes finales serán revisados y confirmados por Bahari Asili Safaris antes del pago.', importantNote: 'Este documento registra la solicitud de reserva enviada en línea. Por sí solo no confirma alojamiento, transporte, entradas a parques, actividades ni otros servicios. Conserve la referencia de reserva para cualquier contacto con Bahari Asili Safaris.', supportNote: 'Para preguntas, cambios o asistencia, contacte con nosotros usando los datos siguientes e indique su referencia de reserva.', notProvided: 'No proporcionado', toConfirm: 'Por confirmar', day: 'Día', page: 'Página',
  },
  de: {
    title: 'BUCHUNGSANFRAGE / VORLÄUFIGE RECHNUNG', subtitle: 'Vollständige Referenz für Ihre Buchung und Reise', quick: 'BUCHUNGSÜBERSICHT', document: 'DOKUMENTINFORMATIONEN', client: 'REISENDENDETAILS', trip: 'REISEÜBERSICHT', package: 'AUSGEWÄHLTES PAKET', itinerary: 'TAGESPLAN', highlights: 'HIGHLIGHTS', included: 'INKLUSIVE', excluded: 'NICHT INKLUSIVE', packing: 'GEPÄCK UND REISEHINWEISE', requests: 'BESONDERE WÜNSCHE', next: 'WIE GEHT ES WEITER?', important: 'WICHTIGE INFORMATIONEN', support: 'BRAUCHEN SIE HILFE?', name: 'Vollständiger Name', email: 'E-Mail', whatsapp: 'WhatsApp / Telefon', nationality: 'Nationalität', travellers: 'Reisende', adults: 'Erwachsene', children: 'Kinder', childrenAges: 'Kinderalter', arrival: 'Startdatum', departure: 'Enddatum', duration: 'Dauer', route: 'Route / Orte', parks: 'Parks / Reiseziele', lodges: 'Unterkunft', status: 'Buchungsstatus', category: 'Paketart', activity: 'Aktivitätsniveau', comfort: 'Komfortniveau', rating: 'Gästebewertung', reference: 'Buchungsreferenz', documentType: 'Dokument', generated: 'Erstellt', pricing: 'Preisstatus', noPricing: 'Wird bestätigt', pending: 'Bestätigung ausstehend', confirmed: 'Bestätigt', morning: 'Morgen', afternoon: 'Nachmittag', evening: 'Abend', meals: 'Mahlzeiten', overnight: 'Übernachtung', location: 'Ort', details: 'Details', bookingReceived: 'Buchungsanfrage erhalten', availability: 'Verfügbarkeitsprüfung', quotation: 'Offizielles Angebot', payment: 'Zahlung', voucher: 'Bestätigung und Voucher', requestReceivedText: 'Ihre Buchungsanfrage wurde von Bahari Asili Safaris erhalten.', availabilityText: 'Unser Team prüft Verfügbarkeit, Unterkunft, Transport, Aktivitäten und weitere gewünschte Leistungen.', quotationText: 'Nach Prüfung der gewünschten Leistungen und der anwendbaren Kosten wird ein offizielles Angebot erstellt.', paymentText: 'Zahlungsanweisungen werden mit dem offiziellen Angebot bereitgestellt, sobald eine Zahlung fällig ist.', voucherText: 'Nach der Bestätigung stellt Bahari Asili Safaris die endgültige Buchungsbestätigung und den Reise-Voucher aus.', pricingNote: 'Dieses erste Buchungsdokument enthält keine Preise. Verfügbarkeit, Unterkunft, Route und endgültige Kosten werden vor der Zahlung von Bahari Asili Safaris geprüft und bestätigt.', importantNote: 'Dieses Dokument hält die online eingereichte Buchungsanfrage fest. Es bestätigt nicht automatisch Unterkunft, Transport, Parkeintritte, Aktivitäten oder andere Reiseleistungen. Bitte bewahren Sie die Buchungsreferenz für jeden Kontakt mit Bahari Asili Safaris auf.', supportNote: 'Bei Fragen, Änderungen oder Buchungshilfe kontaktieren Sie uns über die folgenden Angaben und nennen Sie Ihre Buchungsreferenz.', notProvided: 'Nicht angegeben', toConfirm: 'Wird bestätigt', day: 'Tag', page: 'Seite',
  },
  ar: {
    title: 'طلب حجز / فاتورة مبدئية', subtitle: 'مرجع كامل للحجز والرحلة', quick: 'ملخص الحجز', document: 'معلومات المستند', client: 'بيانات المسافر', trip: 'ملخص الرحلة', package: 'الباقة المختارة', itinerary: 'خط سير الرحلة يومًا بيوم', highlights: 'أبرز معالم الرحلة', included: 'ما يشمله الحجز', excluded: 'ما لا يشمله الحجز', packing: 'الأمتعة ونصائح السفر', requests: 'طلبات خاصة', next: 'ماذا يحدث بعد ذلك؟', important: 'معلومات مهمة', support: 'هل تحتاج إلى مساعدة؟', name: 'الاسم الكامل', email: 'البريد الإلكتروني', whatsapp: 'واتساب / الهاتف', nationality: 'الجنسية', travellers: 'المسافرون', adults: 'البالغون', children: 'الأطفال', childrenAges: 'أعمار الأطفال', arrival: 'تاريخ البداية', departure: 'تاريخ النهاية', duration: 'المدة', route: 'المسار / المواقع', parks: 'المتنزهات / الوجهات', lodges: 'الإقامة', status: 'حالة الحجز', category: 'نوع الباقة', activity: 'مستوى النشاط', comfort: 'مستوى الراحة', rating: 'تقييم الضيوف', reference: 'مرجع الحجز', documentType: 'المستند', generated: 'تاريخ الإصدار', pricing: 'حالة السعر', noPricing: 'قيد التأكيد', pending: 'بانتظار التأكيد', confirmed: 'مؤكد', morning: 'الصباح', afternoon: 'بعد الظهر', evening: 'المساء', meals: 'الوجبات', overnight: 'المبيت', location: 'الموقع', details: 'التفاصيل', bookingReceived: 'تم استلام طلب الحجز', availability: 'مراجعة التوفر', quotation: 'عرض السعر الرسمي', payment: 'الدفع', voucher: 'التأكيد والقسيمة', requestReceivedText: 'تم استلام طلب الحجز الخاص بك من Bahari Asili Safaris.', availabilityText: 'يقوم فريقنا بمراجعة التوفر والإقامة والنقل والأنشطة وغيرها من الترتيبات المطلوبة.', quotationText: 'يتم إصدار عرض السعر الرسمي بعد مراجعة الترتيبات المطلوبة والتكاليف المطبقة.', paymentText: 'يتم تقديم تعليمات الدفع مع عرض السعر الرسمي عند استحقاق الدفع.', voucherText: 'بعد التأكيد، تصدر Bahari Asili Safaris تأكيد الحجز النهائي وقسيمة السفر.', pricingNote: 'لا يحتوي مستند الحجز الأول هذا على أسعار. سيتم مراجعة التوفر والإقامة والمسار والتكاليف النهائية وتأكيدها من قبل Bahari Asili Safaris قبل الدفع.', importantNote: 'يسجل هذا المستند طلب الحجز المرسل عبر الموقع. ولا يؤكد بمفرده حجز الإقامة أو النقل أو دخول المتنزهات أو الأنشطة أو الخدمات الأخرى. يرجى الاحتفاظ بمرجع الحجز عند التواصل مع Bahari Asili Safaris.', supportNote: 'للأسئلة أو التعديلات أو المساعدة في الحجز، تواصل معنا باستخدام البيانات أدناه واذكر مرجع الحجز.', notProvided: 'غير متوفر', toConfirm: 'قيد التأكيد', day: 'اليوم', page: 'صفحة',
  },
  zh: {
    title: '预订申请 / 临时发票', subtitle: '您的完整预订与旅行参考文件', quick: '预订摘要', document: '文件信息', client: '旅客信息', trip: '行程概览', package: '已选套餐', itinerary: '逐日行程', highlights: '行程亮点', included: '包含项目', excluded: '不包含项目', packing: '行李与旅行提示', requests: '特殊要求', next: '接下来会发生什么', important: '重要信息', support: '需要帮助吗？', name: '姓名', email: '电子邮箱', whatsapp: 'WhatsApp / 电话', nationality: '国籍', travellers: '旅客', adults: '成人', children: '儿童', childrenAges: '儿童年龄', arrival: '开始日期', departure: '结束日期', duration: '时长', route: '路线 / 地点', parks: '公园 / 目的地', lodges: '住宿', status: '预订状态', category: '套餐类型', activity: '活动等级', comfort: '舒适等级', rating: '客人评分', reference: '预订编号', documentType: '文件', generated: '生成日期', pricing: '价格状态', noPricing: '待确认', pending: '等待确认', confirmed: '已确认', morning: '上午', afternoon: '下午', evening: '晚上', meals: '餐饮', overnight: '住宿', location: '地点', details: '详情', bookingReceived: '已收到预订申请', availability: '确认可用性', quotation: '正式报价单', payment: '付款', voucher: '确认与凭证', requestReceivedText: 'Bahari Asili Safaris 已收到您的预订申请。', availabilityText: '我们的团队将审核住宿、交通、活动、可用性及其他所需安排。', quotationText: '在审核所需安排和适用费用后，将出具正式报价单。', paymentText: '需要付款时，付款说明将随正式报价单提供。', voucherText: '确认后，Bahari Asili Safaris 将出具最终预订确认和旅行凭证。', pricingNote: '本预订文件不包含价格。付款前，Bahari Asili Safaris 将审核并确认最终可用性、住宿、路线和费用。', importantNote: '本文件记录您在线提交的预订申请。它本身不代表住宿、交通、公园门票、活动或其他旅行服务已经确认。联系 Bahari Asili Safaris 时请保留预订编号。', supportNote: '如有问题、修改或预订帮助，请使用以下联系方式并提供您的预订编号。', notProvided: '未提供', toConfirm: '待确认', day: '第', page: '页',
  },
  sw: {
    title: 'OMBI LA UHIFADHI / ANKARA YA MUDA', subtitle: 'Kumbukumbu kamili ya booking na safari yako', quick: 'MUHTASARI WA BOOKING', document: 'TAARIFA ZA HATI', client: 'TAARIFA ZA MSAFIRI', trip: 'MUHTASARI WA SAFARI', package: 'KIFURUSHI KILICHOCHAGULIWA', itinerary: 'RATIBA YA KILA SIKU', highlights: 'MAMBO MUHIMU YA SAFARI', included: 'VINAVYOJUMUISHWA', excluded: 'VISIVYOJUMUISHWA', packing: 'VIFAA NA VIDOKEZO VYA SAFARI', requests: 'MAOMBI MAALUM', next: 'NINI KINAFUATA?', important: 'TAARIFA MUHIMU', support: 'UNAHITAJI MSAADA?', name: 'Jina kamili', email: 'Barua pepe', whatsapp: 'WhatsApp / simu', nationality: 'Utaifa', travellers: 'Wasafiri', adults: 'Watu wazima', children: 'Watoto', childrenAges: 'Umri wa watoto', arrival: 'Tarehe ya kuanza', departure: 'Tarehe ya kumaliza', duration: 'Muda', route: 'Njia / maeneo', parks: 'Mbuga / maeneo', lodges: 'Malazi', status: 'Hali ya booking', category: 'Aina ya kifurushi', activity: 'Kiwango cha shughuli', comfort: 'Kiwango cha starehe', rating: 'Ukadiriaji wa wageni', reference: 'Nambari ya booking', documentType: 'Hati', generated: 'Imetengenezwa', pricing: 'Hali ya bei', noPricing: 'Itathibitishwa', pending: 'Inasubiri uthibitisho', confirmed: 'Imethibitishwa', morning: 'Asubuhi', afternoon: 'Mchana', evening: 'Jioni', meals: 'Milo', overnight: 'Malazi', location: 'Mahali', details: 'Maelezo', bookingReceived: 'Ombi la booking limepokelewa', availability: 'Ukaguzi wa upatikanaji', quotation: 'Nukuu rasmi', payment: 'Malipo', voucher: 'Uthibitisho na voucher', requestReceivedText: 'Ombi lako la booking limepokelewa na Bahari Asili Safaris.', availabilityText: 'Timu yetu itakagua upatikanaji, malazi, usafiri, shughuli na mipango mingine uliyoomba.', quotationText: 'Nukuu rasmi itatolewa baada ya kukagua mipango na gharama zinazohusika.', paymentText: 'Maelekezo ya malipo yatatolewa pamoja na nukuu rasmi wakati malipo yanapohitajika.', voucherText: 'Baada ya uthibitisho, Bahari Asili Safaris itatoa uthibitisho wa mwisho na voucher ya safari.', pricingNote: 'Hati hii ya kwanza ya booking haina bei. Upatikanaji, malazi, njia na gharama za mwisho zitakaguliwa na kuthibitishwa na Bahari Asili Safaris kabla ya malipo.', importantNote: 'Hati hii inaweka kumbukumbu ya ombi la booking lililotumwa mtandaoni. Haithibitishi yenyewe malazi, usafiri, kuingia mbugani, shughuli au huduma nyingine. Tafadhali hifadhi nambari ya booking unapowasiliana na Bahari Asili Safaris.', supportNote: 'Kwa maswali, mabadiliko au msaada wa booking, wasiliana nasi kupitia maelezo hapa chini na taja nambari yako ya booking.', notProvided: 'Haijatolewa', toConfirm: 'Itathibitishwa', day: 'Siku', page: 'Ukurasa',
  },
};

function getLabels(locale: Locale): Labels {
  return { ...baseLabels, ...(translations[locale] || {}) };
}

function safe(value: unknown): string {
  return value == null ? '' : String(value).trim();
}

/** Normalize common PDF/JSON mojibake without damaging normal punctuation. */
function cleanText(value: unknown): string {
  return safe(value)
    .replace(/\u00a0/g, ' ')
    .replace(/Ã¢â‚¬â„¢|â€™/g, '’')
    .replace(/Ã¢â‚¬â€œ|â€“/g, '–')
    .replace(/Ã¢â‚¬â€|â€”/g, '—')
    .replace(/Ã¢â‚¬Â¦|â€¦/g, '…')
    .replace(/Ã¢â‚¬Â¢|â€¢/g, '•')
    .replace(/Ã¢â€ â€™|â†’/g, '→')
    .replace(/[!]\s*[’']/g, ' → ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function displayStatus(value: string | null | undefined, L: Labels): string {
  const normalized = cleanText(value).toLowerCase();
  if (normalized === 'confirmed' || normalized === 'approved' || normalized === 'complete') return L.confirmed;
  return L.pending;
}

function plural(count: number, singular: string, pluralWord: string): string {
  return `${count} ${count === 1 ? singular : pluralWord}`;
}

function formatDuration(days: number, nights: number, locale: Locale): string {
  if (locale === 'it') return `${days} ${days === 1 ? 'giorno' : 'giorni'} · ${nights} ${nights === 1 ? 'notte' : 'notti'}`;
  if (locale === 'fr') return `${days} ${days === 1 ? 'jour' : 'jours'} · ${nights} ${nights === 1 ? 'nuit' : 'nuits'}`;
  if (locale === 'es') return `${days} ${days === 1 ? 'día' : 'días'} · ${nights} ${nights === 1 ? 'noche' : 'noches'}`;
  if (locale === 'de') return `${days} ${days === 1 ? 'Tag' : 'Tage'} · ${nights} ${nights === 1 ? 'Nacht' : 'Nächte'}`;
  if (locale === 'sw') return `${days} ${days === 1 ? 'siku' : 'siku'} · ${nights} ${nights === 1 ? 'usiku' : 'usiku'}`;
  if (locale === 'ar') return `${days} يوم · ${nights} ليلة`;
  if (locale === 'zh') return `${days} 天 · ${nights} 晚`;
  return `${days} ${days === 1 ? 'day' : 'days'} · ${nights} ${nights === 1 ? 'night' : 'nights'}`;
}

function listValue(items: unknown, fallback: string): string {
  if (!Array.isArray(items)) return fallback;
  const values = items.map(cleanText).filter(Boolean);
  return values.length ? values.join(', ') : fallback;
}

function toDayNumber(value: number | string): string {
  const raw = cleanText(value);
  const match = raw.match(/\d+/);
  return match ? match[0] : raw;
}

function estimateLines(doc: jsPDF, text: string, width: number, fontSize: number): number {
  doc.setFontSize(fontSize);
  return Math.max(1, (doc.splitTextToSize(cleanText(text), width) as string[]).length);
}

export async function generateCustomerInvoicePDF(input: CustomerInvoiceInput): Promise<{ base64: string }> {
  const locale = normalizeLocale(input.locale);
  const L = getLabels(locale);
  const pkg = input.package || { name: input.safari_name };
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  const fontName = await registerInvoiceFont(doc, locale);
  const logo = await loadBrandLogo();

  const W = 210;
  const H = 297;
  const M = 15;
  const contentW = W - M * 2;
  const footerY = 284;
  const bottomY = 276;
  let y = 0;
  let pageNumber = 1;

  const setFont = (size: number, color = BRAND_TEXT, style: 'normal' | 'bold' = 'normal') => {
    doc.setFont(fontName, style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  const wrap = (text: string, width: number, size = 8.2): string[] => {
    setFont(size);
    return doc.splitTextToSize(cleanText(text), width) as string[];
  };

  const footer = () => {
    doc.setDrawColor(...BRAND_TEAL);
    doc.setLineWidth(0.3);
    doc.line(M, footerY - 3, W - M, footerY - 3);
    setFont(6.8, BRAND_LIGHT);
    doc.text(`${COMPANY.website} · ${COMPANY.email} · ${COMPANY.phone}`, W / 2, footerY + 2, { align: 'center' });
    doc.text(`${COMPANY.name} · ${COMPANY.address}`, W / 2, footerY + 6.5, { align: 'center' });
    doc.text(`${L.page} ${pageNumber}`, W - M, footerY + 6.5, { align: 'right' });
  };

  const header = (firstPage = false) => {
    if (firstPage) {
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, 43, 'F');
      if (logo) drawBrandLogo(doc, logo, M, 8, 22);

      setFont(8.1, BRAND_TEAL, 'bold');
      doc.text(COMPANY.address, W - M, 12, { align: 'right' });
      setFont(7.7, BRAND_TEXT);
      doc.text(COMPANY.phone, W - M, 17, { align: 'right' });
      doc.text(COMPANY.email, W - M, 22, { align: 'right' });
      setFont(6.9, BRAND_LIGHT);
      doc.text(COMPANY.founded, W - M, 27, { align: 'right' });

      doc.setDrawColor(...BRAND_TEAL);
      doc.setLineWidth(0.45);
      doc.line(0, 43, W, 43);

      doc.setFillColor(...BRAND_TEAL);
      doc.roundedRect(M, 49, contentW, 27, 2, 2, 'F');
      setFont(8.2, BRAND_OFFWHITE, 'bold');
      doc.text(L.title, M + 5, 57);
      setFont(17, [255, 255, 255], 'bold');
      doc.text(cleanText(input.booking_ref), M + 5, 68);
      setFont(7.4, [230, 248, 250]);
      doc.text(`${L.status}: ${displayStatus(input.reservation_status, L)}`, W - M - 5, 58, { align: 'right' });
      doc.text(L.subtitle, W - M - 5, 64, { align: 'right' });
      setFont(7.2, [255, 255, 255]);
      doc.text(`${L.pricing}: ${L.noPricing}`, W - M - 5, 70.5, { align: 'right' });
      y = 84;
    } else {
      doc.setFillColor(...BRAND_TEAL);
      doc.rect(0, 0, W, 16, 'F');
      setFont(7.3, BRAND_OFFWHITE, 'bold');
      doc.text(COMPANY.name, M, 10);
      doc.text(`${L.reference}: ${cleanText(input.booking_ref)}`, W - M, 10, { align: 'right' });
      y = 23;
    }
  };

  const newPage = () => {
    footer();
    doc.addPage();
    pageNumber += 1;
    header(false);
  };

  const ensure = (height: number, keepTogether = false) => {
    if (y + height > bottomY) {
      newPage();
      if (keepTogether) y += 1;
    }
  };

  const section = (title: string) => {
    ensure(13, true);
    doc.setFillColor(...BRAND_TEAL);
    doc.roundedRect(M, y, contentW, 8.5, 1.4, 1.4, 'F');
    setFont(8.1, BRAND_OFFWHITE, 'bold');
    doc.text(cleanText(title), M + 3.5, y + 5.7);
    y += 12;
  };

  const paragraph = (text: string, size = 8.1, width = contentW) => {
    const value = cleanText(text);
    if (!value) return;
    const lines = wrap(value, width, size);
    const h = lines.length * (size * 0.52) + 2;
    ensure(h);
    setFont(size, BRAND_TEXT);
    doc.text(lines, M, y);
    y += h + 1;
  };

  const labeledValue = (label: string, value: string, x: number, valueX: number, valueW: number) => {
    const cleanValue = cleanText(value);
    if (!cleanValue) return 0;
    const lines = wrap(cleanValue, valueW, 7.9);
    setFont(7.1, BRAND_LIGHT, 'bold');
    doc.text(cleanText(label).toUpperCase(), x, y);
    setFont(8, BRAND_TEXT);
    doc.text(lines, valueX, y);
    return Math.max(6, lines.length * 4.1);
  };

  const twoColumn = (rows: Array<[string, string]>, rowsRight: Array<[string, string]>) => {
    const gap = 8;
    const colW = (contentW - gap) / 2;
    const leftX = M;
    const rightX = M + colW + gap;
    const draw = (items: Array<[string, string]>, x: number) => {
      let cy = y;
      for (const [label, valueRaw] of items) {
        const value = cleanText(valueRaw);
        if (!value) continue;
        const lines = wrap(value, colW, 8);
        setFont(7, BRAND_LIGHT, 'bold');
        doc.text(cleanText(label).toUpperCase(), x, cy);
        setFont(8, BRAND_TEXT);
        doc.text(lines, x, cy + 4.1);
        cy += Math.max(10.5, lines.length * 4 + 5.5);
      }
      return cy;
    };
    const leftEnd = draw(rows, leftX);
    const rightEnd = draw(rowsRight, rightX);
    y = Math.max(leftEnd, rightEnd) + 2;
  };

  const bullets = (items: string[], columns = 1) => {
    const usable = items.map(cleanText).filter(Boolean);
    if (!usable.length) return;
    const gap = 7;
    const colW = columns === 2 ? (contentW - gap) / 2 : contentW;
    const split = columns === 2 ? Math.ceil(usable.length / 2) : usable.length;
    const groups = columns === 2 ? [usable.slice(0, split), usable.slice(split)] : [usable];
    const starts: number[] = [];
    const ends: number[] = [];

    groups.forEach((group, index) => {
      const x = M + index * (colW + gap);
      let cy = y;
      starts[index] = cy;
      for (const item of group) {
        const lines = wrap(`• ${item}`, colW - 1, 7.8);
        const h = lines.length * 4.05 + 1.5;
        if (cy + h > bottomY) {
          if (index === 0) {
            y = cy;
            newPage();
            cy = y;
          } else {
            break;
          }
        }
        setFont(7.8, BRAND_TEXT);
        doc.text(lines, x + 1, cy);
        cy += h;
      }
      ends[index] = cy;
    });
    y = Math.max(...ends, ...starts) + 2;
  };

  const callout = (title: string, text: string, fill: [number, number, number] = BRAND_OFFWHITE) => {
    const lines = wrap(text, contentW - 12, 7.8);
    const h = 13 + lines.length * 4.05;
    ensure(h, true);
    doc.setFillColor(...fill);
    doc.roundedRect(M, y, contentW, h, 2, 2, 'F');
    setFont(7.5, BRAND_TEAL, 'bold');
    doc.text(cleanText(title).toUpperCase(), M + 5, y + 6);
    setFont(7.8, BRAND_TEXT);
    doc.text(lines, M + 5, y + 11);
    y += h + 4;
  };

  const quickSummary = () => {
    const cells: Array<[string, string]> = [
      [L.reference, cleanText(input.booking_ref)],
      [L.status, displayStatus(input.reservation_status, L)],
      [L.arrival, formatLocaleDate(input.arrival_date, locale)],
      [L.departure, input.departure_date ? formatLocaleDate(input.departure_date, locale) : L.toConfirm],
      [L.travellers, `${plural(Math.max(0, Number(input.adults) || 0), 'adult', 'adults')}${Number(input.children) ? ` · ${plural(Number(input.children), 'child', 'children')}` : ''}`],
      [L.pricing, L.noPricing],
    ];
    const gap = 4;
    const cellW = (contentW - gap) / 2;
    const cellH = 19;
    ensure(cellH * 3 + gap * 2 + 2, true);
    cells.forEach(([label, value], i) => {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const x = M + col * (cellW + gap);
      const top = y + row * (cellH + gap);
      doc.setFillColor(248, 250, 251);
      doc.setDrawColor(225, 232, 236);
      doc.setLineWidth(0.25);
      doc.roundedRect(x, top, cellW, cellH, 1.5, 1.5, 'FD');
      setFont(6.6, BRAND_LIGHT, 'bold');
      doc.text(cleanText(label).toUpperCase(), x + 4, top + 6);
      setFont(8.4, BRAND_TEXT, 'bold');
      const lines = wrap(value, cellW - 8, 8.4);
      doc.text(lines.slice(0, 2), x + 4, top + 12);
    });
    y += cellH * 3 + gap * 2 + 4;
  };

  const itineraryDay = (day: NonNullable<CustomerInvoicePackage['itinerary']>[number]) => {
    const dayNo = toDayNumber(day.day);
    const title = cleanText(day.title || '');
    const location = cleanText(day.location || '');
    const heading = title ? `${L.day} ${dayNo} — ${title}` : `${L.day} ${dayNo}`;

    const fields: Array<[string, string]> = [];
    if (location) fields.push([L.location, location]);
    if (day.description) fields.push([L.details, cleanText(day.description)]);
    if (day.morning) fields.push([L.morning, cleanText(day.morning)]);
    if (day.afternoon) fields.push([L.afternoon, cleanText(day.afternoon)]);
    if (day.evening) fields.push([L.evening, cleanText(day.evening)]);
    if (day.meals) fields.push([L.meals, cleanText(day.meals)]);
    if (day.overnight) fields.push([L.overnight, cleanText(day.overnight)]);

    ensure(17, true);
    doc.setFillColor(255, 249, 244);
    doc.roundedRect(M, y, contentW, 10, 1.5, 1.5, 'F');
    setFont(9.4, BRAND_ORANGE, 'bold');
    doc.text(cleanText(heading), M + 4, y + 6.7);
    y += 14;

    if (!fields.length) {
      paragraph(L.toConfirm, 7.9);
      return;
    }

    for (const [label, value] of fields) {
      const lines = wrap(value, contentW - 38, 7.9);
      const h = Math.max(6, lines.length * 4.05 + 1.5);
      ensure(h);
      setFont(7, BRAND_LIGHT, 'bold');
      doc.text(cleanText(label).toUpperCase(), M + 2, y);
      setFont(7.9, BRAND_TEXT);
      doc.text(lines, M + 36, y);
      y += h + 1.6;
    }
    doc.setDrawColor(220, 226, 230);
    doc.setLineWidth(0.25);
    doc.line(M + 2, y, W - M - 2, y);
    y += 4;
  };

  header(true);

  // PAGE 1 — identity and quick-reference information.
  section(L.quick);
  quickSummary();

  section(L.client);
  const adults = Math.max(0, Number(input.adults) || 0);
  const children = Math.max(0, Number(input.children) || 0);
  twoColumn(
    [
      [L.name, `${safe(input.first_name)} ${safe(input.last_name)}`],
      [L.email, safe(input.email)],
      [L.whatsapp, safe(input.whatsapp) || L.notProvided],
      [L.nationality, safe(input.nationality) || L.notProvided],
    ],
    [
      [L.adults, String(adults)],
      [L.children, String(children)],
      ...(children && input.kids_ages?.length ? [[L.childrenAges, input.kids_ages.join(', ')]] as Array<[string, string]> : []),
    ],
  );

  section(L.trip);
  const itineraryLocations = (pkg.itinerary || []).map((d) => cleanText(d.location)).filter(Boolean);
  const uniqueLocations = Array.from(new Set(itineraryLocations));
  twoColumn(
    [
      [L.arrival, formatLocaleDate(input.arrival_date, locale)],
      [L.departure, input.departure_date ? formatLocaleDate(input.departure_date, locale) : L.toConfirm],
      [L.duration, formatDuration(Math.max(1, Number(pkg.days) || 1), Math.max(0, Number(pkg.nights) || 0), locale)],
      [L.route, uniqueLocations.length ? uniqueLocations.join(' → ') : L.toConfirm],
    ],
    [
      [L.parks, listValue(pkg.parks, L.toConfirm)],
      [L.lodges, listValue(pkg.lodges, L.toConfirm)],
      [L.status, displayStatus(input.reservation_status, L)],
      [L.category, cleanText(pkg.category) || L.toConfirm],
    ],
  );

  if (pkg.activityLevel != null || pkg.comfortLevel != null || pkg.rating != null) {
    const optional: Array<[string, string]> = [];
    if (pkg.activityLevel != null) optional.push([L.activity, String(pkg.activityLevel)]);
    if (pkg.comfortLevel != null) optional.push([L.comfort, String(pkg.comfortLevel)]);
    if (pkg.rating != null) optional.push([L.rating, `${pkg.rating}${pkg.reviewCount ? ` (${pkg.reviewCount})` : ''}`]);
    if (optional.length) {
      twoColumn(optional.slice(0, 2), optional.slice(2));
    }
  }

  section(L.package);
  setFont(14, BRAND_TEAL, 'bold');
  const packageNameLines = wrap(pkg.name || input.safari_name, contentW - 4, 14);
  doc.text(packageNameLines, M + 2, y);
  y += packageNameLines.length * 6 + 1;
  if (pkg.tagline) {
    paragraph(pkg.tagline, 8.6);
  }
  if (pkg.description) {
    paragraph(pkg.description, 8.1);
  } else {
    paragraph('The selected service will be arranged according to your booking request and confirmed by Bahari Asili Safaris.', 8.1);
  }

  if (pkg.highlights?.length) {
    section(L.highlights);
    bullets(pkg.highlights, 2);
  }

  if (pkg.included?.length) {
    section(L.included);
    bullets(pkg.included, 2);
  }

  if (pkg.excluded?.length) {
    section(L.excluded);
    bullets(pkg.excluded, 2);
  }

  if (pkg.itinerary?.length) {
    section(L.itinerary);
    for (const day of pkg.itinerary) itineraryDay(day);
  }

  if (pkg.packingTips?.length) {
    section(L.packing);
    bullets(pkg.packingTips, 2);
  }

  if (cleanText(input.message)) {
    section(L.requests);
    callout(L.requests, cleanText(input.message), [255, 249, 244]);
  } else {
    section(L.requests);
    paragraph(L.notProvided, 8);
  }

  section(L.next);
  const steps: Array<[string, string, string]> = [
    ['01', L.bookingReceived, L.requestReceivedText],
    ['02', L.availability, L.availabilityText],
    ['03', L.quotation, L.quotationText],
    ['04', L.payment, L.paymentText],
    ['05', L.voucher, L.voucherText],
  ];
  for (const [number, title, text] of steps) {
    const lines = wrap(text, contentW - 31, 7.8);
    const h = Math.max(15, lines.length * 4 + 8);
    ensure(h, true);
    doc.setFillColor(...BRAND_OFFWHITE);
    doc.circle(M + 6, y + 5.5, 5, 'F');
    setFont(7.3, BRAND_TEAL, 'bold');
    doc.text(number, M + 6, y + 7.2, { align: 'center' });
    setFont(8, BRAND_TEXT, 'bold');
    doc.text(cleanText(title), M + 15, y + 5);
    setFont(7.7, BRAND_TEXT);
    doc.text(lines, M + 15, y + 10);
    y += h + 2;
  }

  callout(L.pricing, L.pricingNote, [247, 250, 251]);
  callout(L.important, L.importantNote, [255, 249, 244]);

  section(L.document);
  const generated = formatLocaleDate(new Date().toISOString().slice(0, 10), locale);
  twoColumn(
    [
      [L.documentType, L.title],
      [L.reference, cleanText(input.booking_ref)],
      [L.generated, generated],
    ],
    [
      [L.status, displayStatus(input.reservation_status, L)],
      [L.pricing, L.noPricing],
      [COMPANY.name, `${COMPANY.address} · ${COMPANY.website}`],
    ],
  );

  section(L.support);
  callout(L.support, `${L.supportNote}\n\n${COMPANY.name}\n${COMPANY.address}\nWhatsApp: ${COMPANY.phone}\nEmail: ${COMPANY.email}\nWebsite: ${COMPANY.website}`, [247, 250, 251]);

  footer();
  const arrayBuffer = doc.output('arraybuffer');
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunk, bytes.length)));
  }
  return { base64: btoa(binary) };
}
