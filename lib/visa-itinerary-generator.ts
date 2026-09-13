import type { Booking } from './supabase';
import type { Locale } from './i18n';
import { normalizeLocale, formatLocaleDate } from './locale-content';
import { safaris } from './tours-data';
import { resolveItinerary } from './itinerary-resolve';
import { generateQrPngDataUrl } from './qr';
import { BRAND_TEAL, BRAND_OFFWHITE, COMPANY, loadBrandLogo, drawBrandLogo } from './pdf-brand';
import { loadBrandStamp, drawStamp } from './pdf-stamp';

const labels: Record<Locale, Record<string,string>>={
 en:{title:'TRAVEL ITINERARY & VISA SUPPORT DOCUMENT',subtitle:'Prepared for travel / visa application reference',traveler:'TRAVELER DETAILS',name:'Full Name',passport:'Passport Number',nationality:'Nationality',email:'Email',trip:'TRIP DETAILS',program:'Safari / Program',date:'Travel Date',guests:'Travellers',duration:'Duration',itinerary:'DAY-BY-DAY ITINERARY',purpose:'PURPOSE OF TRAVEL',purposeText:'Tourism and leisure travel in Kenya.',note:'This document is a travel itinerary and booking support document issued by Bahari Asili Safaris. It is not a government-issued visa or immigration approval.'},
 it:{title:'ITINERARIO DI VIAGGIO E DOCUMENTO DI SUPPORTO VISTO',subtitle:'Preparato come riferimento per viaggio / richiesta visto',traveler:'DATI DEL VIAGGIATORE',name:'Nome completo',passport:'Numero passaporto',nationality:'Nazionalità',email:'Email',trip:'DETTAGLI DEL VIAGGIO',program:'Safari / Programma',date:'Data del viaggio',guests:'Viaggiatori',duration:'Durata',itinerary:'ITINERARIO GIORNO PER GIORNO',purpose:'SCOPO DEL VIAGGIO',purposeText:'Viaggio turistico e di piacere in Kenya.',note:'Questo documento è un itinerario e documento di supporto alla prenotazione emesso da Bahari Asili Safaris. Non è un visto né un’approvazione governativa.'},
 fr:{title:'ITINÉRAIRE DE VOYAGE ET DOCUMENT D’APPUI AU VISA',subtitle:'Préparé pour référence de voyage / demande de visa',traveler:'INFORMATIONS DU VOYAGEUR',name:'Nom complet',passport:'Numéro de passeport',nationality:'Nationalité',email:'Email',trip:'DÉTAILS DU VOYAGE',program:'Safari / Programme',date:'Date du voyage',guests:'Voyageurs',duration:'Durée',itinerary:'ITINÉRAIRE JOUR PAR JOUR',purpose:'OBJET DU VOYAGE',purposeText:'Voyage touristique et de loisirs au Kenya.',note:'Ce document est un itinéraire et justificatif de réservation émis par Bahari Asili Safaris. Ce n’est ni un visa ni une approbation gouvernementale.'},
 es:{title:'ITINERARIO DE VIAJE Y DOCUMENTO DE APOYO PARA VISADO',subtitle:'Preparado como referencia para viaje / solicitud de visado',traveler:'DATOS DEL VIAJERO',name:'Nombre completo',passport:'Número de pasaporte',nationality:'Nacionalidad',email:'Correo electrónico',trip:'DETALLES DEL VIAJE',program:'Safari / Programa',date:'Fecha del viaje',guests:'Viajeros',duration:'Duración',itinerary:'ITINERARIO DÍA A DÍA',purpose:'MOTIVO DEL VIAJE',purposeText:'Viaje turístico y de ocio en Kenia.',note:'Este documento es un itinerario y justificante de reserva emitido por Bahari Asili Safaris. No es un visado ni una aprobación gubernamental.'},
 de:{title:'REISEITINERAR UND UNTERLAGE FÜR VISUMSANTRAG',subtitle:'Erstellt als Referenz für Reise / Visumantrag',traveler:'REISENDENDATEN',name:'Vollständiger Name',passport:'Passnummer',nationality:'Nationalität',email:'E-Mail',trip:'REISEDETAILS',program:'Safari / Programm',date:'Reisedatum',guests:'Reisende',duration:'Dauer',itinerary:'TAGESABLAUF',purpose:'REISEZWECK',purposeText:'Touristische Reise und Erholung in Kenia.',note:'Dieses Dokument ist ein Reiseplan und Buchungsnachweis von Bahari Asili Safaris. Es ist kein behördliches Visum oder eine staatliche Genehmigung.'},
 ar:{title:'خط سير الرحلة ووثيقة دعم طلب التأشيرة',subtitle:'مُعدة كمرجع للسفر / طلب التأشيرة',traveler:'بيانات المسافر',name:'الاسم الكامل',passport:'رقم جواز السفر',nationality:'الجنسية',email:'البريد الإلكتروني',trip:'تفاصيل الرحلة',program:'السفاري / البرنامج',date:'تاريخ السفر',guests:'المسافرون',duration:'المدة',itinerary:'خط السير اليومي',purpose:'غرض السفر',purposeText:'رحلة سياحية وترفيهية في كينيا.',note:'هذه الوثيقة هي خط سير وإثبات دعم للحجز صادر عن Bahari Asili Safaris وليست تأشيرة أو موافقة حكومية.'},
 zh:{title:'旅行行程及签证支持文件',subtitle:'用于旅行 / 签证申请参考',traveler:'旅客信息',name:'姓名',passport:'护照号码',nationality:'国籍',email:'电子邮箱',trip:'行程详情',program:'Safari / 行程',date:'旅行日期',guests:'旅客人数',duration:'行程时长',itinerary:'每日行程',purpose:'旅行目的',purposeText:'在肯尼亚进行旅游和休闲旅行。',note:'本文件是 Bahari Asili Safaris 出具的旅行行程及预订支持文件，不是政府签发的签证或移民批准。'},
 sw:{title:'RATIBA YA SAFARI NA HATI YA KUSAIDIA VISA',subtitle:'Imeandaliwa kwa kumbukumbu ya safari / maombi ya visa',traveler:'TAARIFA ZA MSAFIRI',name:'Jina kamili',passport:'Nambari ya pasipoti',nationality:'Utaifa',email:'Barua pepe',trip:'TAARIFA ZA SAFARI',program:'Safari / Programu',date:'Tarehe ya safari',guests:'Wasafiri',duration:'Muda',itinerary:'RATIBA YA KILA SIKU',purpose:'MADHUMUNI YA SAFARI',purposeText:'Safari ya utalii na mapumziko nchini Kenya.',note:'Hati hii ni ratiba ya safari na uthibitisho wa booking uliotolewa na Bahari Asili Safaris. Si visa wala idhini ya serikali.'},
};

export async function generateVisaItineraryPDF(booking: Booking, passportNumber?: string, requestedLocale?: Locale, documentUrl?: string){
 const {jsPDF}=await import('jspdf'); const locale=normalizeLocale(requestedLocale||booking.locale); const L=labels[locale]; const safari=safaris.find(s=>s.name===booking.safari_name); const doc=new jsPDF({orientation:'portrait',unit:'mm',format:'a4'}); const logo=await loadBrandLogo(); const stamp=await loadBrandStamp(); const W=210,M=14; let y=14;
 const section=(title:string)=>{if(y>260){doc.addPage();y=16;}doc.setFillColor(...BRAND_TEAL);doc.rect(M,y,W-2*M,9,'F');doc.setTextColor(...BRAND_OFFWHITE);doc.setFont('helvetica','bold');doc.setFontSize(9);doc.text(title,M+3,y+6);y+=15;};
 const row=(a:string,b:string)=>{doc.setTextColor(100,116,139);doc.setFont('helvetica','bold');doc.setFontSize(8);doc.text(a,M,y);doc.setTextColor(31,41,55);doc.setFont('helvetica','normal');doc.text(b||'—',75,y);y+=7;};
 // Header — white band with full-color logo top-left, document title top-right
 doc.setFillColor(255,255,255);doc.rect(0,0,W,34,'F');drawBrandLogo(doc,logo,M,7,18);
 doc.setTextColor(...BRAND_TEAL);doc.setFont('helvetica','bold');doc.setFontSize(10);doc.text(L.title,W-M,13,{align:'right',maxWidth:110});
 doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.setTextColor(100,116,139);doc.text(L.subtitle,W-M,19,{align:'right',maxWidth:110});
 doc.setDrawColor(...BRAND_TEAL);doc.setLineWidth(0.5);doc.line(0,34,W,34);y=46;
 section(L.traveler);row(L.name,`${booking.first_name} ${booking.last_name}`);row(L.passport,passportNumber||'To be provided by traveller');row(L.nationality,booking.nationality||'—');row(L.email,booking.email);
 y+=4;section(L.trip);row(L.program,booking.safari_name);row(L.date,formatLocaleDate(booking.arrival_date,locale));row(L.guests,`${booking.adults} adults${booking.children?` + ${booking.children} children`:''}`);row(L.duration,safari?`${safari.days} days / ${safari.nights} nights`:'As confirmed in booking');
 y+=4;section(L.itinerary);const resolvedDays=resolveItinerary(booking);if(resolvedDays.length){for(const d of resolvedDays){if(y>255){doc.addPage();y=18;section(L.itinerary);}doc.setTextColor(...BRAND_TEAL);doc.setFont('helvetica','bold');doc.setFontSize(9);doc.text(`${d.dayLabel} — ${d.title}`,M,y);y+=6;doc.setTextColor(55,65,81);doc.setFont('helvetica','normal');doc.setFontSize(7.5);for(const part of [...d.bodyLines,d.overnight].filter(Boolean) as string[]){const lines=doc.splitTextToSize(part,W-2*M-8);if(y+lines.length*4>270){doc.addPage();y=18;}doc.text(lines,M+4,y);y+=lines.length*4+2;}y+=2;}}else row(L.program,'Detailed itinerary attached / to be confirmed by operator');
 y+=4;section(L.purpose);doc.setTextColor(31,41,55);doc.setFont('helvetica','normal');doc.setFontSize(9);doc.text(doc.splitTextToSize(L.purposeText,W-2*M),M,y);y+=12;doc.setFillColor(255,247,237);doc.roundedRect(M,y,W-2*M,24,3,3,'F');doc.setTextColor(154,52,18);doc.setFontSize(7.5);doc.text(doc.splitTextToSize(L.note,W-2*M-10),M+5,y+7);y+=32;
 if(y+22>279){doc.addPage();y=18;}
 doc.setDrawColor(...BRAND_TEAL);doc.setLineWidth(0.5);doc.line(M,y,W-M,y);y+=8;doc.setTextColor(100,116,139);doc.setFontSize(8);doc.text('Authorized representative / company stamp: __________________________',M,y);y+=10;doc.text(`Booking reference: ${booking.booking_ref}`,M,y);doc.text(`Issued: ${formatLocaleDate(new Date().toISOString(),locale)}`,W-M,y,{align:'right'});
 // Footer — teal band with off-white contact details, pinned to the bottom of the page
 doc.setFillColor(...BRAND_TEAL);doc.rect(0,283,W,14,'F');doc.setFont('helvetica','normal');doc.setFontSize(7.5);doc.setTextColor(...BRAND_OFFWHITE);
 doc.text(`© 2026 Bahari Asili Safaris, Watamu, Kenya. ${COMPANY.founded}.`,W/2,289,{align:'center'});
 doc.text(`${COMPANY.website}  ·  ${COMPANY.email}  ·  ${COMPANY.phone}`,W/2,294,{align:'center'});
 // QR code linking to this document's own public URL — bottom-left, clear
 // of the official stamp which owns the bottom-right corner of the footer.
 if (documentUrl) {
   const qr = await generateQrPngDataUrl(documentUrl);
   if (qr) {
     const qrSize = 16;
     doc.addImage(qr, 'PNG', M, 283 - qrSize - 2, qrSize, qrSize);
   }
 }
 // Official digital stamp, bottom-right, overlapping the footer band.
 drawStamp(doc, stamp, locale, { pageWidth: W, footerTopY: 283 });
 if(locale==='ar'&&typeof (doc as any).setR2L==='function')(doc as any).setR2L(true); const dataUrl=doc.output('dataurlstring') as string;const bytes=new Uint8Array(doc.output('arraybuffer') as ArrayBuffer);let raw='';for(const b of bytes)raw+=String.fromCharCode(b);return {dataUrl,base64:btoa(raw)};
}
