import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, getDocumentQrUrl } from '@/lib/supabase-admin';
import { getAdminSession, unauthorizedAdminResponse } from '@/lib/admin-api';
import { generatePremiumInvoicePDF } from '@/lib/invoice-generator';
import { generateVoucherPDF } from '@/lib/voucher-generator';
import { sendEmail } from '@/lib/email';
import { buildConfirmationEmailHtml } from '@/lib/email-templates';
import type { Booking } from '@/lib/supabase';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { logAdminAction } from '@/lib/audit-log';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const session = await getAdminSession(req);
  if (!session) return unauthorizedAdminResponse();
  const ip = getClientIp(req);
  const limit = checkRateLimit(`admin-resend:${ip}`, 20, 10 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json({ success: false, error: 'Too many resend requests, slow down.' }, { status: 429 });
  }

  try {
    const admin = getSupabaseAdmin();
    const { data: booking, error } = await admin
      .from('bookings')
      .select('*')
      .eq('id', id)
      .maybeSingle<Booking>();

    if (error || !booking) {
      return NextResponse.json({ success: false, error: 'Reservation not found.' }, { status: 404 });
    }

    const [invoiceQrUrl, voucherQrUrl] = await Promise.all([
      getDocumentQrUrl(admin, booking.invoice_url),
      getDocumentQrUrl(admin, booking.voucher_url),
    ]);

    const [invoice, voucher] = await Promise.all([
      generatePremiumInvoicePDF(booking as any, undefined, invoiceQrUrl || undefined),
      generateVoucherPDF(booking, undefined, voucherQrUrl || undefined),
    ]);

    const emailSent = await sendEmail(
      booking.email,
      'Your Bahari Asili Safaris Booking is Confirmed',
      buildConfirmationEmailHtml(booking),
      [
        { filename: `Invoice-${booking.booking_ref}.pdf`, content: invoice.base64 },
        { filename: `Voucher-${booking.booking_ref}.pdf`, content: voucher.base64 },
      ]
    );

    await logAdminAction({
      username: req.headers.get('x-admin-username') || 'unknown',
      role: (req.headers.get('x-admin-role') as 'owner' | 'staff') || null,
      action: 'resend_email',
      targetType: 'booking',
      targetId: id,
      ip,
      userAgent: req.headers.get('user-agent') || undefined,
      metadata: { booking_ref: booking.booking_ref, emailSent },
    });

    return NextResponse.json({ success: true, emailSent });
  } catch (err) {
    console.error('Resend confirmation error:', err);
    return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 });
  }
}
