import type { Booking, Payment } from './supabase';
import type { Locale } from './i18n';
import { normalizeLocale, formatLocaleDate } from './locale-content';
import { BRAND_TEAL, BRAND_ORANGE, BRAND_OFFWHITE, COMPANY, loadBrandLogo, drawBrandLogo } from './pdf-brand';
import { loadBrandStamp, drawStamp } from './pdf-stamp';
import { generateQrPngDataUrl } from './qr';

const labels: Record<Locale, Record<string,string>> = {
  en:{title:'PAYMENT RECEIPT',ref:'Receipt Number',booking:'Booking Reference',customer:'Customer',email:'Email',date:'Payment Date',method:'Payment Method',reference:'Transaction Reference',amount:'Amount Received',total:'Invoice Total',paid:'Total Paid',balance:'Balance Due',status:'Payment Status',note:'This receipt confirms payment received by Bahari Asili Safaris.',history:'PAYMENT HISTORY',col_date:'Date',col_receipt:'Receipt #',col_method:'Method',col_ref:'Reference',col_amount:'Amount',col_status:'Status'},
  it:{title:'RICEVUTA DI PAGAMENTO',ref:'Numero ricevuta',booking:'Riferimento prenotazione',customer:'Cliente',email:'Email',date:'Data pagamento',method:'Metodo di pagamento',reference:'Riferimento transazione',amount:'Importo ricevuto',total:'Totale fattura',paid:'Totale pagato',balance:'Saldo dovuto',status:'Stato pagamento',note:'Questa ricevuta conferma il pagamento ricevuto da Bahari Asili Safaris.',history:'STORICO PAGAMENTI',col_date:'Data',col_receipt:'N. ricevuta',col_method:'Metodo',col_ref:'Riferimento',col_amount:'Importo',col_status:'Stato'},
  fr:{title:'REÇU DE PAIEMENT',ref:'Numéro du reçu',booking:'Référence de réservation',customer:'Client',email:'Email',date:'Date du paiement',method:'Mode de paiement',reference:'Référence de transaction',amount:'Montant reçu',total:'Total de la facture',paid:'Total payé',balance:'Solde dû',status:'Statut du paiement',note:'Ce reçu confirme le paiement reçu par Bahari Asili Safaris.',history:'HISTORIQUE DES PAIEMENTS',col_date:'Date',col_receipt:'N° reçu',col_method:'Mode',col_ref:'Référence',col_amount:'Montant',col_status:'Statut'},
  es:{title:'RECIBO DE PAGO',ref:'Número de recibo',booking:'Referencia de reserva',customer:'Cliente',email:'Correo electrónico',date:'Fecha de pago',method:'Método de pago',reference:'Referencia de transacción',amount:'Importe recibido',total:'Total de la factura',paid:'Total pagado',balance:'Saldo pendiente',status:'Estado del pago',note:'Este recibo confirma el pago recibido por Bahari Asili Safaris.',history:'HISTORIAL DE PAGOS',col_date:'Fecha',col_receipt:'N.º recibo',col_method:'Método',col_ref:'Referencia',col_amount:'Importe',col_status:'Estado'},
  de:{title:'ZAHLUNGSBELEG',ref:'Belegnummer',booking:'Buchungsreferenz',customer:'Kunde',email:'E-Mail',date:'Zahlungsdatum',method:'Zahlungsmethode',reference:'Transaktionsreferenz',amount:'Erhaltener Betrag',total:'Rechnungssumme',paid:'Gesamt bezahlt',balance:'Offener Betrag',status:'Zahlungsstatus',note:'Dieser Beleg bestätigt den Zahlungseingang bei Bahari Asili Safaris.',history:'ZAHLUNGSVERLAUF',col_date:'Datum',col_receipt:'Beleg-Nr.',col_method:'Methode',col_ref:'Referenz',col_amount:'Betrag',col_status:'Status'},
  ar:{title:'إيصال الدفع',ref:'رقم الإيصال',booking:'مرجع الحجز',customer:'العميل',email:'البريد الإلكتروني',date:'تاريخ الدفع',method:'طريقة الدفع',reference:'مرجع المعاملة',amount:'المبلغ المستلم',total:'إجمالي الفاتورة',paid:'إجمالي المدفوع',balance:'الرصيد المستحق',status:'حالة الدفع',note:'يؤكد هذا الإيصال استلام الدفع من Bahari Asili Safaris.',history:'سجل المدفوعات',col_date:'التاريخ',col_receipt:'رقم الإيصال',col_method:'الطريقة',col_ref:'المرجع',col_amount:'المبلغ',col_status:'الحالة'},
  zh:{title:'付款收据',ref:'收据编号',booking:'预订编号',customer:'客户',email:'电子邮箱',date:'付款日期',method:'付款方式',reference:'交易编号',amount:'已收金额',total:'发票总额',paid:'已支付总额',balance:'待付余额',status:'付款状态',note:'此收据确认 Bahari Asili Safaris 已收到款项。',history:'付款历史',col_date:'日期',col_receipt:'收据编号',col_method:'方式',col_ref:'交易编号',col_amount:'金额',col_status:'状态'},
  sw:{title:'RISITI YA MALIPO',ref:'Nambari ya risiti',booking:'Nambari ya booking',customer:'Mteja',email:'Barua pepe',date:'Tarehe ya malipo',method:'Njia ya malipo',reference:'Kumbukumbu ya muamala',amount:'Kiasi kilichopokelewa',total:'Jumla ya ankara',paid:'Jumla iliyolipwa',balance:'Salio linalodaiwa',status:'Hali ya malipo',note:'Risiti hii inathibitisha malipo yaliyopokelewa na Bahari Asili Safaris.',history:'HISTORIA YA MALIPO',col_date:'Tarehe',col_receipt:'Nambari ya risiti',col_method:'Njia',col_ref:'Kumbukumbu',col_amount:'Kiasi',col_status:'Hali'},
};

/**
 * Generate a receipt for one specific payment, plus (if provided) the full
 * payment history for the booking. Passing the actual `Payment` row (from
 * the `payments` table) avoids re-deriving date/method/amount from
 * `booking`'s just-the-latest-payment fields, which would silently show
 * the wrong values once a booking has had more than one payment.
 * `paymentHistory` adds the itemized table (date, receipt #, method,
 * reference, amount, status). Brand header/footer, logo and official
 * stamp match the invoice/voucher/visa-itinerary documents.
 */
export async function generatePaymentReceiptPDF(
  booking: Booking,
  currentPayment?: Payment,
  paymentHistory?: Payment[],
  requestedLocale?: Locale,
  documentUrl?: string,
) {
  const { jsPDF } = await import('jspdf');
  const locale = normalizeLocale(requestedLocale || booking.locale);
  const L = labels[locale];
  const doc = new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
  const logo = await loadBrandLogo();
  const stamp = await loadBrandStamp();
  const W=210,M=16,PAGE_BOTTOM=280; let y=16;
  const currency = currentPayment?.currency || booking.currency || 'KES';
  const money=(n:number)=>`${currency} ${n.toLocaleString('en-KE',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
  const ensureSpace=(needed:number)=>{ if (y+needed>PAGE_BOTTOM){ doc.addPage(); y=18; } };

  // Header — white band with full-color logo top-left, contact info top-right
  doc.setFillColor(255,255,255); doc.rect(0,0,W,38,'F');
  drawBrandLogo(doc, logo, M, 9, 20);
  doc.setTextColor(...BRAND_TEAL); doc.setFont('helvetica','normal'); doc.setFontSize(9);
  doc.text(`${COMPANY.address}  ·  ${COMPANY.phone}`, W-M, 14, {align:'right'});
  doc.text(COMPANY.email, W-M, 20, {align:'right'});
  doc.setDrawColor(...BRAND_TEAL); doc.setLineWidth(0.5); doc.line(0,38,W,38);

  doc.setFillColor(...BRAND_ORANGE); doc.rect(0,38,W,14,'F');
  doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.text(L.title,M,47);

  y=64; doc.setTextColor(31,41,55); doc.setFont('helvetica','bold'); doc.setFontSize(15); doc.text(L.title,M,y); y+=12;

  const receipt = currentPayment?.receipt_number || `PAY-${booking.booking_ref}-${new Date().getTime().toString().slice(-6)}`;
  const paymentDate = currentPayment?.created_at || booking.payment_date || new Date().toISOString();
  const method = currentPayment?.method || booking.payment_method || '—';

  const rows: [string, string][] = [
    [L.ref, receipt],
    [L.booking, booking.booking_ref],
    [L.customer, `${booking.first_name} ${booking.last_name}`],
    [L.email, booking.email],
    [L.date, formatLocaleDate(paymentDate, locale)],
    [L.method, method],
  ];
  if (currentPayment?.reference) rows.push([L.reference, currentPayment.reference]);
  for(const [a,b] of rows){doc.setFillColor(248,250,252);doc.roundedRect(M,y-5,W-2*M,11,2,2,'F');doc.setFont('helvetica','bold');doc.setFontSize(8);doc.setTextColor(100,116,139);doc.text(a,M+4,y+1);doc.setFont('helvetica','normal');doc.setTextColor(31,41,55);doc.text(b,M+72,y+1);y+=15;}

  y+=8;
  const received=Number(currentPayment?.amount ?? booking.amount_paid ?? 0);
  const total=Number(booking.total_price||0);
  const paid=Number(booking.amount_paid ?? received);
  const balance=Math.max(0,total-paid);
  const blocks:[string,string,boolean][]=[[L.amount,money(received),true],[L.total,money(total),false],[L.paid,money(paid),false],[L.balance,money(balance),true]];
  for(const [a,b,emphasize] of blocks){doc.setFont('helvetica','bold');doc.setFontSize(10);doc.setTextColor(31,41,55);doc.text(a,M,y);doc.setTextColor(...(emphasize?BRAND_ORANGE:[31,41,55] as [number,number,number]));doc.text(b,W-M,y,{align:'right'});y+=10;}

  const receiptStatus = currentPayment?.status || 'received';
  doc.setFillColor(240,253,244);doc.roundedRect(M,y, W-2*M,18,3,3,'F');doc.setTextColor(21,128,61);doc.setFontSize(10);doc.text(`${L.status}: ${receiptStatus.toUpperCase()}`,M+5,y+7);doc.setFont('helvetica','normal');doc.setFontSize(8);doc.setTextColor(31,41,55);doc.text(L.note,M+5,y+13);y+=30;

  // ===== PAYMENT HISTORY =====
  if (paymentHistory && paymentHistory.length > 0) {
    ensureSpace(16);
    doc.setFillColor(...BRAND_TEAL); doc.rect(M,y-3,W-2*M,8,'F');
    doc.setFont('helvetica','bold'); doc.setFontSize(9); doc.setTextColor(...BRAND_OFFWHITE);
    doc.text(L.history, M+2, y+2); y+=10;

    const cols = [
      { label: L.col_date, w: 26 },
      { label: L.col_receipt, w: 34 },
      { label: L.col_method, w: 22 },
      { label: L.col_ref, w: 34 },
      { label: L.col_amount, w: 26 },
      { label: L.col_status, w: 20 },
    ];
    const tableW = W - 2*M;
    let x = M;
    ensureSpace(8);
    doc.setFont('helvetica','bold'); doc.setFontSize(7); doc.setTextColor(100,116,139);
    for (const c of cols) { doc.text(c.label, x+1, y); x += c.w; }
    y += 5;
    doc.setDrawColor(226,232,240); doc.line(M,y-2,M+tableW,y-2);

    doc.setFont('helvetica','normal'); doc.setFontSize(7.5);
    const sorted = [...paymentHistory].sort((a,b) => new Date(a.created_at||0).getTime() - new Date(b.created_at||0).getTime());
    for (const p of sorted) {
      ensureSpace(7);
      x = M;
      doc.setTextColor(31,41,55);
      const cells = [
        formatLocaleDate(p.created_at, locale),
        p.receipt_number,
        p.method,
        p.reference || '—',
        `${p.currency||currency} ${Number(p.amount).toLocaleString('en-KE')}`,
        (p.status || 'received'),
      ];
      cells.forEach((val, i) => {
        const lines = doc.splitTextToSize(val, cols[i].w - 2);
        doc.text(lines[0] || '—', x+1, y);
        x += cols[i].w;
      });
      y += 6;
    }
    y += 6;
  }

  ensureSpace(20);
  doc.setDrawColor(...BRAND_TEAL);doc.setLineWidth(0.5);doc.line(M,y,W-M,y);y+=8;doc.setFontSize(8);doc.setTextColor(100,116,139);doc.text('Authorized signature / company stamp: ______________________________',M,y);y+=12;

  // QR code linking to this document's own public URL — bottom-left, clear
  // of the official stamp which owns the bottom-right corner of the footer.
  if (documentUrl) {
    const qr = await generateQrPngDataUrl(documentUrl);
    if (qr) {
      const qrSize = 16;
      ensureSpace(qrSize + 4);
      doc.addImage(qr, 'PNG', M, 283 - qrSize - 2, qrSize, qrSize);
    }
  }

  // Footer — teal band with off-white contact details, pinned to the bottom of the page
  doc.setFillColor(...BRAND_TEAL); doc.rect(0,283,W,14,'F');
  doc.setFont('helvetica','normal'); doc.setFontSize(7.5); doc.setTextColor(...BRAND_OFFWHITE);
  doc.text(`© 2026 Bahari Asili Safaris, Watamu, Kenya. ${COMPANY.founded}.`, W/2, 289, {align:'center'});
  doc.text(`${COMPANY.website}  ·  ${COMPANY.email}  ·  ${COMPANY.phone}`, W/2, 294, {align:'center'});

  // Official digital stamp, bottom-right, overlapping the footer band. Drawn
  // BEFORE setR2L(true) below — the stamp's date text is Latin/numeric and
  // must not be reversed by the document's RTL mode.
  drawStamp(doc, stamp, locale, { pageWidth: W, footerTopY: 283 });

  if(locale==='ar' && typeof (doc as any).setR2L==='function') (doc as any).setR2L(true);

  const dataUrl=doc.output('dataurlstring') as string; const bytes=new Uint8Array(doc.output('arraybuffer') as ArrayBuffer); let raw=''; for(const b of bytes) raw+=String.fromCharCode(b);
  return {dataUrl,base64:btoa(raw),receiptNumber:receipt};
}
