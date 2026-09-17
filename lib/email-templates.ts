import type { Booking } from './supabase';
import { formatLocaleDate, normalizeLocale } from './locale-content';

/** Customer confirmation email. The booking locale is persisted at submission time. */
export function buildConfirmationEmailHtml(booking: Booking): string {
  const locale = normalizeLocale(booking.locale);
  const copy: Record<string, Record<string,string>> = {
    en:{confirmed:'Booking Confirmed',children:'Children',dear:'Dear',thank:'Thank you — your reservation is confirmed!',reservation:'Reservation Number',package:'Package',travel:'Travel Date',guests:'Guests',amount:'Amount',payment:'Payment Status',attachments:'Your invoice and travel voucher are attached as PDFs to this email. Please bring the voucher (printed or on your phone) on the day of travel.',emergency:'Emergency Contact',terms:'Terms',termsText:'Please review the terms and conditions included in your invoice PDF.'},
    it:{confirmed:'Prenotazione confermata',children:'Bambini',dear:'Gentile',thank:'Grazie — la vostra prenotazione è confermata!',reservation:'Numero di prenotazione',package:'Pacchetto',travel:'Data del viaggio',guests:'Ospiti',amount:'Importo',payment:'Stato del pagamento',attachments:'La fattura e il voucher di viaggio sono allegati in PDF a questa email. Portate il voucher con voi il giorno del viaggio.',emergency:'Contatto di emergenza',terms:'Condizioni',termsText:'Consultate termini e condizioni inclusi nella fattura PDF.'},
    fr:{confirmed:'Réservation confirmée',children:'Enfants',dear:'Bonjour',thank:'Merci — votre réservation est confirmée !',reservation:'Numéro de réservation',package:'Circuit',travel:'Date du voyage',guests:'Voyageurs',amount:'Montant',payment:'Statut du paiement',attachments:'Votre facture et votre voucher de voyage sont joints en PDF à cet email. Veuillez présenter le voucher le jour du voyage.',emergency:"Contact d'urgence",terms:'Conditions',termsText:'Veuillez consulter les conditions générales incluses dans votre facture PDF.'},
    es:{confirmed:'Reserva confirmada',children:'Niños',dear:'Estimado/a',thank:'Gracias — ¡su reserva está confirmada!',reservation:'Número de reserva',package:'Paquete',travel:'Fecha del viaje',guests:'Viajeros',amount:'Importe',payment:'Estado del pago',attachments:'Su factura y bono de viaje están adjuntos en PDF a este correo. Lleve el bono el día del viaje.',emergency:'Contacto de emergencia',terms:'Condiciones',termsText:'Consulte los términos y condiciones incluidos en su factura PDF.'},
    de:{confirmed:'Buchung bestätigt',children:'Kinder',dear:'Guten Tag',thank:'Vielen Dank — Ihre Reservierung ist bestätigt!',reservation:'Buchungsnummer',package:'Paket',travel:'Reisedatum',guests:'Gäste',amount:'Betrag',payment:'Zahlungsstatus',attachments:'Ihre Rechnung und Ihr Reisegutschein sind als PDF angehängt. Bitte bringen Sie den Gutschein am Reisetag mit.',emergency:'Notfallkontakt',terms:'Bedingungen',termsText:'Bitte beachten Sie die in Ihrer PDF-Rechnung enthaltenen Bedingungen.'},
    ar:{confirmed:'تم تأكيد الحجز',children:'الأطفال',dear:'عزيزي/عزيزتي',thank:'شكرًا لكم — تم تأكيد حجزكم!',reservation:'رقم الحجز',package:'الباقة',travel:'تاريخ الرحلة',guests:'الضيوف',amount:'المبلغ',payment:'حالة الدفع',attachments:'الفاتورة وقسيمة السفر مرفقتان بصيغة PDF مع هذه الرسالة. يرجى الاحتفاظ بالقسيمة وإبرازها يوم الرحلة.',emergency:'جهة اتصال للطوارئ',terms:'الشروط',termsText:'يرجى مراجعة الشروط والأحكام المرفقة في فاتورة PDF.'},
    zh:{confirmed:'预订已确认',children:'儿童',dear:'您好',thank:'感谢您——您的预订已确认！',reservation:'预订编号',package:'套餐',travel:'出行日期',guests:'客人',amount:'金额',payment:'付款状态',attachments:'您的发票和旅行凭证已以 PDF 形式附在此邮件中。请在出行当天携带凭证。',emergency:'紧急联系人',terms:'条款',termsText:'请查看 PDF 发票中的条款与条件。'},
    sw:{confirmed:'Booking imethibitishwa',children:'Watoto',dear:'Mpendwa',thank:'Asante — booking yako imethibitishwa!',reservation:'Nambari ya booking',package:'Kifurushi',travel:'Tarehe ya safari',guests:'Wasafiri',amount:'Kiasi',payment:'Hali ya malipo',attachments:'Ankara na voucher yako ya safari zimeambatanishwa kama PDF. Tafadhali beba voucher siku ya safari.',emergency:'Mawasiliano ya dharura',terms:'Masharti',termsText:'Tafadhali soma masharti yaliyo kwenye ankara yako ya PDF.'}
  };
  const c = copy[locale] || copy.en;
  const fullName = `${booking.first_name} ${booking.last_name}`;
  const guests = `${booking.adults} ${c.guests}${booking.children > 0 ? ` + ${booking.children} ${c.children || 'Children'}` : ''}`;
  const travelDate = formatLocaleDate(booking.arrival_date, locale);
  const amount = booking.total_price != null ? `KES ${Number(booking.total_price).toLocaleString('en-KE')}` : '—';
  const paymentStatus = (booking.payment_status || 'unpaid').toUpperCase();
  const rtl = locale === 'ar' ? 'direction:rtl;text-align:right;' : '';
  return `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:620px;margin:0 auto;color:#1f2937;background:#fff;${rtl}">
    <div style="background:#0e7490;padding:32px;border-radius:12px 12px 0 0;text-align:center;direction:${locale==='ar'?'rtl':'ltr'}"><h1 style="color:#fff;margin:0;font-size:24px">BAHARI ASILI SAFARIS</h1><p style="color:#dff7ff;margin:6px 0 0;font-size:13px">Watamu, Kenya · ${c.confirmed}</p></div>
    <div style="background:#f5f1e8;padding:20px 32px;border-left:4px solid #f97316"><p style="margin:0;color:#f97316;font-weight:700;font-size:12px;text-transform:uppercase">✓ ${c.confirmed}</p><p style="margin:4px 0 0;font-size:15px;color:#f97316">${c.dear} ${fullName}, ${c.thank}</p></div>
    <div style="padding:28px 32px;border:1px solid #e2e8f0;border-top:none"><p style="font-size:14px;color:#64748b;margin:0 0 4px;text-transform:uppercase;font-weight:600">${c.reservation}</p><p style="font-size:26px;font-weight:800;color:#0e7490;margin:0 0 20px">${booking.booking_ref}</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px"><tr><td style="padding:10px 0;color:#64748b;font-weight:600;width:40%">${c.package}</td><td style="padding:10px 0;font-weight:600;color:#f97316">${booking.safari_name}</td></tr><tr><td style="padding:10px 0;color:#64748b;font-weight:600">${c.travel}</td><td style="padding:10px 0">${travelDate}</td></tr><tr><td style="padding:10px 0;color:#64748b;font-weight:600">${c.guests}</td><td style="padding:10px 0">${guests}</td></tr>${booking.hotel_name?`<tr><td style="padding:10px 0;color:#64748b;font-weight:600">Hotel</td><td style="padding:10px 0">${booking.hotel_name}</td></tr>`:''}${booking.pickup_location?`<tr><td style="padding:10px 0;color:#64748b;font-weight:600">Pickup</td><td style="padding:10px 0">${booking.pickup_location}</td></tr>`:''}<tr><td style="padding:10px 0;color:#64748b;font-weight:600">${c.amount}</td><td style="padding:10px 0;font-weight:700;color:#0e7490">${amount}</td></tr><tr><td style="padding:10px 0;color:#64748b;font-weight:600">${c.payment}</td><td style="padding:10px 0">${paymentStatus}</td></tr></table>
      <div style="background:#f1f5f9;border-radius:8px;padding:16px;margin-top:24px"><p style="margin:0;font-size:13.5px;color:#0e7490">${c.attachments}</p></div>
      <div style="margin-top:24px;padding-top:20px;border-top:1px dashed #e2e8f0"><p style="font-size:13px;color:#64748b;margin:0 0 4px"><strong style="color:#1f2937">${c.emergency}:</strong> +254 101 923 355 (WhatsApp)</p><p style="font-size:13px;color:#64748b;margin:0"><strong style="color:#1f2937">${c.terms}:</strong> ${c.termsText}</p></div>
    </div><div style="background:#1f2937;padding:24px;border-radius:0 0 12px 12px;text-align:center"><p style="color:#e2e8f0;font-size:13px;margin:0 0 4px;font-weight:600">Bahari Asili Safaris · Watamu, Kenya</p><p style="color:#64748b;font-size:12px;margin:0">bahariasilisafaris@gmail.com · +254 101 923 355</p></div></div>`;
}

/** Internal admin notification, sent for every new submission across all booking types. */
export function buildAdminNotificationEmailHtml(booking: Booking): string {
  const fullName = `${booking.first_name} ${booking.last_name}`;
  const rows: [string, string][] = [
    ['Reservation Number', booking.booking_ref],
    ['Booking Date', booking.created_at ? new Date(booking.created_at).toLocaleString('en-GB') : '—'],
    ['Customer Name', fullName],
    ['Email', booking.email],
    ['Phone / WhatsApp', booking.whatsapp || '—'],
    ['Nationality', booking.nationality || '—'],
    ['Adults', String(booking.adults)],
    ['Children', String(booking.children)],
    ['Travel Date', booking.arrival_date],
    ['Tour Selected', booking.safari_name],
    ['Hotel', booking.hotel_name || '—'],
    ['Pickup Location', booking.pickup_location || '—'],
    ['Special Requests', booking.message || '—'],
    ['Total Price', booking.total_price ? `KES ${Number(booking.total_price).toLocaleString()}` : 'TBD'],
    ['Payment Status', (booking.payment_status || 'unpaid').toUpperCase()],
    ['Booking Status', (booking.reservation_status || 'pending').toUpperCase()],
  ];

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
      <div style="background: #0e7490; padding: 20px 24px; border-radius: 10px 10px 0 0;">
        <h2 style="color: white; margin: 0; font-size: 18px;">🔔 NEW RESERVATION — ${booking.booking_ref}</h2>
      </div>
      <div style="padding: 20px 24px; background: #ffffff; border: 1px solid #e2e8f0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          ${rows
            .map(
              ([label, value]) =>
                `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 6px 0; color: #64748b; width: 42%;">${label}</td><td style="padding: 6px 0; font-weight: 600;">${value}</td></tr>`
            )
            .join('')}
        </table>
        <p style="margin-top: 20px;"><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bahari-asili-safaris.vercel.app'}/admin" style="background: #0e7490; color: white; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px;">Open Admin Dashboard →</a></p>
      </div>
    </div>
  `;
}

/** Sent to the admin inbox whenever a reservation is cancelled. */
export function buildAdminCancellationEmailHtml(booking: Booking): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
      <div style="background: #ef4444; padding: 18px 24px; border-radius: 10px 10px 0 0;">
        <h2 style="color: white; margin: 0; font-size: 17px;">✕ Reservation Cancelled — ${booking.booking_ref}</h2>
      </div>
      <div style="padding: 18px 24px; background: #ffffff; border: 1px solid #e2e8f0;">
        <p style="font-size: 14px; margin: 0 0 6px;"><strong>${booking.first_name} ${booking.last_name}</strong> (${booking.email})</p>
        <p style="font-size: 13px; color: #64748b; margin: 0 0 6px;">Package: ${booking.safari_name}</p>
        <p style="font-size: 13px; color: #64748b; margin: 0;">Travel date: ${booking.arrival_date}</p>
        ${booking.admin_notes ? `<p style="font-size: 13px; color: #64748b; margin: 12px 0 0;"><strong>Note:</strong> ${booking.admin_notes}</p>` : ''}
      </div>
    </div>
  `;
}

/** Sent to the admin inbox whenever a reservation's payment status changes to "paid". */
export function buildAdminPaymentReceivedEmailHtml(booking: Booking): string {
  const amount = booking.total_price ? `KES ${Number(booking.total_price).toLocaleString()}` : 'Amount not set';
  return `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;">
      <div style="background: #0e7490; padding: 18px 24px; border-radius: 10px 10px 0 0;">
        <h2 style="color: white; margin: 0; font-size: 17px;">💰 Payment Received — ${booking.booking_ref}</h2>
      </div>
      <div style="padding: 18px 24px; background: #ffffff; border: 1px solid #e2e8f0;">
        <p style="font-size: 14px; margin: 0 0 6px;"><strong>${booking.first_name} ${booking.last_name}</strong> (${booking.email})</p>
        <p style="font-size: 13px; color: #64748b; margin: 0 0 6px;">Package: ${booking.safari_name}</p>
        <p style="font-size: 15px; font-weight: 700; color: #0e7490; margin: 12px 0 0;">${amount}</p>
      </div>
    </div>
  `;
}

// ---------- Shared branded shell ----------
function emailShell(bodyHtml: string, headerLabel: string, headerColor: string = '#0e7490'): string {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1f2937; background: #ffffff;">
      <div style="background: linear-gradient(135deg, ${headerColor} 0%, #0e7490 100%); padding: 28px 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 0.5px;">BAHARI ASILI SAFARIS</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 6px 0 0; font-size: 12px;">${headerLabel}</p>
      </div>
      <div style="padding: 28px 32px; background: #ffffff; border: 1px solid #e2e8f0; border-top: none;">
        ${bodyHtml}
      </div>
      <div style="background: #1f2937; padding: 24px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="color: #e2e8f0; font-size: 13px; margin: 0 0 4px; font-weight: 600;">Bahari Asili Safaris · Watamu, Kenya</p>
        <p style="color: #64748b; font-size: 12px; margin: 0;">bahariasilisafaris@gmail.com · +254 101 923 355 · bahari-asili-safaris.vercel.app</p>
      </div>
    </div>
  `;
}

function fmtDate(d: string): string {
  try {
    return new Date(d).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return d;
  }
}

function fmtKES(n?: number | null): string {
  return n != null ? `KES ${Number(n).toLocaleString()}` : 'To be confirmed';
}

/** "Quote sent" email — sent before a reservation is confirmed. */
export function buildQuoteEmailHtml(booking: Booking): string {
  const fullName = `${booking.first_name} ${booking.last_name}`;
  const body = `
    <p style="font-size: 15px; margin: 0 0 16px;">Dear ${fullName},</p>
    <p style="font-size: 14px; color: #64748b; margin: 0 0 20px;">Thank you for your interest — here's your quote for <strong style="color: #f97316;">${booking.safari_name}</strong>.</p>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b; font-weight: 600;">Reservation Ref</td><td style="padding: 10px 0; font-weight: 700; color: #0e7490;">${booking.booking_ref}</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b; font-weight: 600;">Travel Date</td><td style="padding: 10px 0;">${fmtDate(booking.arrival_date)}</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b; font-weight: 600;">Guests</td><td style="padding: 10px 0;">${booking.adults} Adults${booking.children > 0 ? ` + ${booking.children} Children` : ''}</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b; font-weight: 600;">Quoted Amount</td><td style="padding: 10px 0; font-weight: 700; color: #0e7490; font-size: 16px;">${fmtKES(booking.total_price)}</td></tr>
      ${booking.deposit_amount ? `<tr><td style="padding: 10px 0; color: #64748b; font-weight: 600;">Deposit to Confirm</td><td style="padding: 10px 0; font-weight: 600;">${fmtKES(booking.deposit_amount)}</td></tr>` : ''}
    </table>
    <div style="background: #f5f1e8; border: 1px solid #f5f1e8; border-radius: 8px; padding: 14px; margin-top: 20px;">
      <p style="margin: 0; font-size: 13px; color: #f97316;">This quote is valid for 7 days. Reply to this email or WhatsApp us on +254 101 923 355 to confirm your booking.</p>
    </div>
  `;
  return emailShell(body, 'Your Safari Quote', '#f97316');
}

/** Payment reminder — sent for reservations with an outstanding balance. */
export function buildPaymentReminderEmailHtml(booking: Booking): string {
  const fullName = `${booking.first_name} ${booking.last_name}`;
  const balance = booking.balance_due ?? (booking.total_price ? Number(booking.total_price) - (booking.amount_paid || 0) : null);
  const body = `
    <p style="font-size: 15px; margin: 0 0 16px;">Dear ${fullName},</p>
    <p style="font-size: 14px; color: #64748b; margin: 0 0 20px;">This is a friendly reminder about the outstanding balance on your upcoming safari.</p>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b; font-weight: 600;">Reservation Ref</td><td style="padding: 10px 0; font-weight: 700; color: #0e7490;">${booking.booking_ref}</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b; font-weight: 600;">Package</td><td style="padding: 10px 0;">${booking.safari_name}</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b; font-weight: 600;">Travel Date</td><td style="padding: 10px 0;">${fmtDate(booking.arrival_date)}</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b; font-weight: 600;">Total Amount</td><td style="padding: 10px 0;">${fmtKES(booking.total_price)}</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b; font-weight: 600;">Paid So Far</td><td style="padding: 10px 0;">${fmtKES(booking.amount_paid)}</td></tr>
      ${booking.due_date ? `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b; font-weight: 600;">Due Date</td><td style="padding: 10px 0; font-weight: 600;">${fmtDate(booking.due_date)}</td></tr>` : ''}
      <tr><td style="padding: 10px 0; color: #64748b; font-weight: 600;">Balance Due</td><td style="padding: 10px 0; font-weight: 800; color: #ef4444; font-size: 17px;">${fmtKES(balance)}</td></tr>
    </table>
    <div style="background: #f5f1e8; border: 1px solid #f5f1e8; border-radius: 8px; padding: 14px; margin-top: 20px;">
      <p style="margin: 0; font-size: 13px; color: #ef4444;">Please settle the balance to secure your reservation. Contact us on WhatsApp (+254 101 923 355) for payment options.</p>
    </div>
  `;
  return emailShell(body, 'Payment Reminder', '#ef4444');
}

/** Pre-departure reminder — sent X days before the travel date. */
export function buildPreDepartureReminderEmailHtml(booking: Booking): string {
  const fullName = `${booking.first_name} ${booking.last_name}`;
  const body = `
    <p style="font-size: 15px; margin: 0 0 16px;">Dear ${fullName},</p>
    <p style="font-size: 14px; color: #64748b; margin: 0 0 20px;">Your safari is coming up soon! Here's a quick reminder of your trip details.</p>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b; font-weight: 600;">Reservation Ref</td><td style="padding: 10px 0; font-weight: 700; color: #0e7490;">${booking.booking_ref}</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b; font-weight: 600;">Package</td><td style="padding: 10px 0;">${booking.safari_name}</td></tr>
      <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b; font-weight: 600;">Travel Date</td><td style="padding: 10px 0; font-weight: 700;">${fmtDate(booking.arrival_date)}</td></tr>
      ${booking.pickup_location ? `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px 0; color: #64748b; font-weight: 600;">Pickup Location</td><td style="padding: 10px 0;">${booking.pickup_location}</td></tr>` : ''}
    </table>
    <div style="background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-top: 20px;">
      <p style="margin: 0; font-size: 13px; color: #0e7490;">Your voucher and invoice were sent when your booking was confirmed — let us know if you need them resent. Emergency contact: +254 101 923 355 (WhatsApp).</p>
    </div>
  `;
  return emailShell(body, 'Your Trip is Coming Up', '#0e7490');
}

/** Review request — sent after trip completion. */
export function buildReviewRequestEmailHtml(booking: Booking): string {
  const fullName = `${booking.first_name} ${booking.last_name}`;
  const body = `
    <p style="font-size: 15px; margin: 0 0 16px;">Dear ${fullName},</p>
    <p style="font-size: 14px; color: #64748b; margin: 0 0 20px;">We hope you had an unforgettable time on your <strong>${booking.safari_name}</strong>! Would you mind sharing a few words about your experience? It helps other travelers — and means a lot to our small team.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="https://wa.me/254101923355?text=${encodeURIComponent(`Hi! Here's my review for my ${booking.safari_name} trip: `)}" style="background: #0e7490; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Share Your Experience →</a>
    </div>
  `;
  return emailShell(body, 'How Was Your Safari?', '#0e7490');
}

/** Wraps an admin's free-form custom message in the branded shell. */
export function buildCustomEmailHtml(booking: Booking, messageHtml: string): string {
  const fullName = `${booking.first_name} ${booking.last_name}`;
  const body = `
    <p style="font-size: 15px; margin: 0 0 16px;">Dear ${fullName},</p>
    <div style="font-size: 14px; color: #1f2937; line-height: 1.7;">${messageHtml}</div>
    <p style="font-size: 13px; color: #64748b; margin-top: 24px;">Reservation Ref: ${booking.booking_ref}</p>
  `;
  return emailShell(body, 'A Message From Bahari Asili Safaris', '#0e7490');
}
