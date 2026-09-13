import type { Booking } from './supabase';
import type { Locale } from './i18n';
import { normalizeLocale, formatLocaleDate } from './locale-content';
import { safaris } from './tours-data';
import { resolveItinerary } from './itinerary-resolve';
import { generateQrPngDataUrl } from './qr';
import { loadBrandLogo, drawBrandLogo } from './pdf-brand';
import { loadBrandStamp, drawStamp } from './pdf-stamp';

const labels: Record<Locale, Record<string,string>> = {
  en:{title:'DETAILED SAFARI ITINERARY',guest:'Guest',booking:'Booking Reference',safari:'Safari',destinations:'Destinations',dates:'Travel Dates',duration:'Duration',notConfirmed:'Detailed itinerary to be confirmed.',notes:'Notes',overnight:'Overnight'},
  it:{title:'ITINERARIO SAFARI DETTAGLIATO',guest:'Ospite',booking:'Riferimento prenotazione',safari:'Safari',destinations:'Destinazioni',dates:'Date del viaggio',duration:'Durata',notConfirmed:'Itinerario dettagliato da confermare.',notes:'Note',overnight:'Pernottamento'},
  fr:{title:'ITINÉRAIRE DÉTAILLÉ DU SAFARI',guest:'Client',booking:'Référence de réservation',safari:'Safari',destinations:'Destinations',dates:'Dates de voyage',duration:'Durée',notConfirmed:'Itinéraire détaillé à confirmer.',notes:'Remarques',overnight:'Nuit à'},
  es:{title:'ITINERARIO DETALLADO DEL SAFARI',guest:'Huésped',booking:'Referencia de reserva',safari:'Safari',destinations:'Destinos',dates:'Fechas de viaje',duration:'Duración',notConfirmed:'Itinerario detallado por confirmar.',notes:'Notas',overnight:'Pernoctación'},
  de:{title:'DETAILLIERTES SAFARI-ITINERAR',guest:'Gast',booking:'Buchungsreferenz',safari:'Safari',destinations:'Reiseziele',dates:'Reisedaten',duration:'Dauer',notConfirmed:'Detailliertes Itinerar wird noch bestätigt.',notes:'Hinweise',overnight:'Übernachtung'},
  ar:{title:'خط سير السفاري التفصيلي',guest:'الضيف',booking:'مرجع الحجز',safari:'السفاري',destinations:'الوجهات',dates:'تواريخ السفر',duration:'المدة',notConfirmed:'سيتم تأكيد خط السير التفصيلي لاحقًا.',notes:'ملاحظات',overnight:'المبيت'},
  zh:{title:'详细safari行程',guest:'客人',booking:'预订编号',safari:'Safari 名称',destinations:'目的地',dates:'旅行日期',duration:'行程时长',notConfirmed:'详细行程待确认。',notes:'备注',overnight:'住宿地点'},
  sw:{title:'RATIBA KAMILI YA SAFARI',guest:'Mgeni',booking:'Nambari ya booking',safari:'Safari',destinations:'Maeneo',dates:'Tarehe za safari',duration:'Muda',notConfirmed:'Ratiba kamili itathibitishwa baadaye.',notes:'Maelezo',overnight:'Kulala'},
};

/**
 * A dedicated, printable day-by-day itinerary — distinct from the voucher
 * (which is the guest's operational travel doc with packing lists etc.)
 * and from the visa/travel-support letter (which frames the same days as
 * visa/immigration reference material). This one is meant for guest
 * planning reference and, where useful, attaching to visa paperwork
 * without the "not a visa" legal framing getting in the way.
 */
export async function generateDetailedItineraryPDF(booking: Booking, requestedLocale?: Locale, documentUrl?: string) {
  const { jsPDF } = await import('jspdf');
  const locale = normalizeLocale(requestedLocale || booking.locale);
  const L = labels[locale];
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const logo = await loadBrandLogo();
  const stamp = await loadBrandStamp();
  const W = 210, M = 14, BOTTOM = 275; let y = 14;
  const safari = safaris.find((s) => s.name === booking.safari_name);
  const days = resolveItinerary(booking);

  const ensure = (needed: number) => { if (y + needed > BOTTOM) { doc.addPage(); y = 18; } };
  const row = (a: string, b: string) => {
    doc.setTextColor(100, 116, 139); doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.text(a, M, y);
    doc.setTextColor(31, 41, 55); doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(b || '—', W - M - 62);
    doc.text(lines, 62, y); y += Math.max(6, lines.length * 4.2);
  };

  // Header — white band with full-color logo top-left, document title top-right
  // (same pattern as the voucher/invoice/visa-support letter).
  doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, 34, 'F');
  drawBrandLogo(doc, logo, M, 7, 18);
  doc.setTextColor(14, 116, 144); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
  doc.text(L.title, W - M, 13, { align: 'right', maxWidth: 110 });
  doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(100, 116, 139);
  doc.text('Watamu, Kenya · +254 101 923 355 · sheddymae02@gmail.com', W - M, 19, { align: 'right', maxWidth: 110 });
  doc.setDrawColor(14, 116, 144); doc.setLineWidth(0.5); doc.line(0, 34, W, 34);
  y = 44;

  row(L.guest, `${booking.first_name} ${booking.last_name}`);
  row(L.booking, booking.booking_ref);
  row(L.safari, booking.safari_name);
  row(L.dates, formatLocaleDate(booking.arrival_date, locale));
  row(L.duration, safari ? `${safari.days} days / ${safari.nights} nights` : days.length ? `${days.length} days` : '—');
  y += 6;

  if (days.length === 0) {
    ensure(12);
    doc.setFillColor(255, 247, 237); doc.roundedRect(M, y, W - 2 * M, 14, 3, 3, 'F');
    doc.setTextColor(154, 52, 18); doc.setFontSize(9); doc.text(L.notConfirmed, M + 5, y + 8);
    y += 22;
  } else {
    for (const d of days) {
      ensure(18);
      doc.setFillColor(249, 115, 22); doc.circle(M + 3, y, 2.6, 'F');
      doc.setTextColor(14, 116, 144); doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
      doc.text(`${d.dayLabel}${d.title ? ` — ${d.title}` : ''}`, M + 9, y + 1.5);
      y += 7;
      doc.setDrawColor(226, 232, 240); doc.setLineDashPattern([1, 1], 0); doc.line(M + 3, y - 4, M + 3, y + 2); doc.setLineDashPattern([], 0);
      doc.setTextColor(55, 65, 81); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
      for (const part of d.bodyLines) {
        const lines = doc.splitTextToSize(part, W - 2 * M - 14);
        ensure(lines.length * 4.4);
        doc.text(lines, M + 9, y); y += lines.length * 4.4 + 1;
      }
      if (d.overnight) {
        ensure(5);
        doc.setFont('helvetica', 'italic'); doc.setFontSize(7.5); doc.setTextColor(100, 116, 139);
        doc.text(`${L.overnight}: ${d.overnight}`, M + 9, y); y += 6;
      }
      y += 4;
    }
  }

  ensure(20);
  doc.setDrawColor(148, 163, 184); doc.line(M, y, W - M, y); y += 8;
  doc.setFontSize(8); doc.setTextColor(100, 116, 139);
  doc.text(`${L.booking}: ${booking.booking_ref}`, M, y);
  doc.text(`${formatLocaleDate(new Date().toISOString(), locale)}`, W - M, y, { align: 'right' });

  if (documentUrl) {
    const qr = await generateQrPngDataUrl(documentUrl);
    if (qr) { const qrSize = 18; ensure(qrSize + 6); doc.addImage(qr, 'PNG', W - M - qrSize, y + 4, qrSize, qrSize); doc.setFontSize(6); doc.text('Scan to view PDF', W - M - qrSize, y + 4 + qrSize + 3, { align: 'left' }); }
  }

  // Official digital stamp, bottom-right, near the last printed line — this
  // document has no fixed teal footer band, so anchor it just below content.
  drawStamp(doc, stamp, locale, { pageWidth: W, footerTopY: Math.min(y + 26, 283) });

  if (locale === 'ar' && typeof (doc as any).setR2L === 'function') (doc as any).setR2L(true);
  const dataUrl = doc.output('dataurlstring') as string;
  const bytes = new Uint8Array(doc.output('arraybuffer') as ArrayBuffer);
  let raw = ''; for (const b of bytes) raw += String.fromCharCode(b);
  return { dataUrl, base64: btoa(raw) };
}
