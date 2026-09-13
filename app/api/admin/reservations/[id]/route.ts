import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin, uploadDocumentPDF, getDocumentPublicUrl } from '@/lib/supabase-admin';
import { generatePremiumInvoicePDF } from '@/lib/invoice-generator';
import { generateVoucherPDF } from '@/lib/voucher-generator';
import { generatePaymentReceiptPDF } from '@/lib/payment-receipt-generator';
import { generateVisaItineraryPDF } from '@/lib/visa-itinerary-generator';
import { generateDetailedItineraryPDF } from '@/lib/itinerary-generator';
import { sendEmail } from '@/lib/email';
import {
  buildConfirmationEmailHtml,
  buildAdminCancellationEmailHtml,
  buildAdminPaymentReceivedEmailHtml,
} from '@/lib/email-templates';
import type { Booking } from '@/lib/supabase';
import { logAdminAction } from '@/lib/audit-log';
import { getClientIp } from '@/lib/rate-limit';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = getSupabaseAdmin();

    const { data, error } = await admin
      .from('bookings')
      .select('*')
      .eq('id', params.id)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          error: 'Reservation not found.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      reservation: data,
    });
  } catch (err) {
    console.error('Get reservation error:', err);

    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong.',
      },
      { status: 500 }
    );
  }
}

// PATCH body:
// {
//   action:
//     'approve'
//     | 'reject'
//     | 'complete'
//     | 'generate_invoice'
//     | 'generate_voucher'
//     | 'record_payment'
//     | 'update',
//   ...fields
// }

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  let admin;

  try {
    admin = getSupabaseAdmin();
  } catch (err) {
    console.error(
      'Patch reservation: Supabase admin client unavailable:',
      err
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Server is missing Supabase configuration.',
      },
      { status: 500 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    const { data: booking, error: fetchError } = await admin
      .from('bookings')
      .select('*')
      .eq('id', params.id)
      .maybeSingle<Booking>();

    if (fetchError || !booking) {
      console.error('Reservation fetch failed:', fetchError);

      return NextResponse.json(
        {
          success: false,
          error: 'Reservation not found.',
        },
        { status: 404 }
      );
    }

    await logAdminAction({
      username: req.headers.get('x-admin-username') || 'unknown',
      role: (req.headers.get('x-admin-role') as 'owner' | 'staff') || null,
      action: 'reservation_status_change',
      targetType: 'booking',
      targetId: params.id,
      ip: getClientIp(req),
      userAgent: req.headers.get('user-agent') || undefined,
      metadata: { action, booking_ref: booking.booking_ref },
    });

    const emailApiKey = process.env.EMAIL_API_KEY;
    const adminEmail = process.env.EMAIL_TO;

    if (!emailApiKey) {
      console.error(
        'EMAIL_API_KEY not set — admin/customer emails will be skipped.'
      );
    }

    if (!adminEmail) {
      console.error(
        'EMAIL_TO not set — internal admin notifications will be skipped.'
      );
    }

    /*
     * ============================================================
     * APPROVE RESERVATION
     * ============================================================
     */
    if (action === 'approve') {
      const updates: Partial<Booking> = {
        reservation_status: 'confirmed',
        confirmed_at: new Date().toISOString(),
      };

      if (typeof body.total_price === 'number') {
        updates.total_price = body.total_price;
      }

      if (typeof body.payment_status === 'string') {
        updates.payment_status = body.payment_status;
      }

      if (
        !booking.invoice_status ||
        ['draft', 'quoted', 'sent'].includes(booking.invoice_status)
      ) {
        updates.invoice_status = 'confirmed';
      }

      if (!booking.invoice_number) {
        updates.invoice_number = `INV-${booking.booking_ref}`;
      }

      const merged: Booking = {
        ...booking,
        ...updates,
      };

      // Compute each document's eventual public URL before generating the PDF
      // (getDocumentPublicUrl just builds the URL string — it doesn't require
      // the file to exist yet) so the QR code embedded in each PDF points at
      // its own real location instead of being silently skipped.
      const invoiceQrUrl = getDocumentPublicUrl(admin, `invoices/${merged.booking_ref}.pdf`) || undefined;
      const voucherQrUrl = getDocumentPublicUrl(admin, `vouchers/${merged.booking_ref}.pdf`) || undefined;

      const [invoice, voucher] = await Promise.all([
        generatePremiumInvoicePDF(merged as any, undefined, invoiceQrUrl),
        generateVoucherPDF(merged, undefined, voucherQrUrl),
      ]);

      const [invoiceUrl, voucherUrl] = await Promise.all([
        uploadDocumentPDF(
          admin,
          `invoices/${merged.booking_ref}.pdf`,
          invoice.base64
        ),
        uploadDocumentPDF(
          admin,
          `vouchers/${merged.booking_ref}.pdf`,
          voucher.base64
        ),
      ]);

      updates.invoice_generated = true;
      updates.voucher_generated = true;

      if (invoiceUrl) {
        updates.invoice_url = invoiceUrl;
      }

      if (voucherUrl) {
        updates.voucher_url = voucherUrl;
      }

      const { data: updated, error: updateError } = await admin
        .from('bookings')
        .update(updates)
        .eq('id', params.id)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error('Approve update error:', updateError);

        return NextResponse.json(
          {
            success: false,
            error: updateError.message || 'Failed to update reservation.',
          },
          { status: 500 }
        );
      }

      const emailSent = emailApiKey
        ? await sendEmail(
            merged.email,
            'Your Bahari Asili Safaris Booking is Confirmed',
            buildConfirmationEmailHtml(merged),
            [
              {
                filename: `Invoice-${merged.booking_ref}.pdf`,
                content: invoice.base64,
              },
              {
                filename: `Voucher-${merged.booking_ref}.pdf`,
                content: voucher.base64,
              },
            ]
          )
        : false;

      return NextResponse.json({
        success: true,
        reservation: updated,
        emailSent,
      });
    }

    /*
     * ============================================================
     * RESEND INVOICE
     * ============================================================
     */
    if (action === 'resend_invoice') {
      if (!emailApiKey) return NextResponse.json({ success:false, error:'Email sending is not configured on the server.' }, {status:503});
      const invoice = await generatePremiumInvoicePDF(booking as any, undefined, booking.invoice_url || undefined);
      const sent = await sendEmail(booking.email, `Invoice ${booking.invoice_number || booking.booking_ref} — Bahari Asili Safaris`, ` <p>Dear ${booking.first_name},</p><p>Please find your invoice attached for booking <strong>${booking.booking_ref}</strong>.</p><p>Bahari Asili Safaris · +254 101 923 355</p>`, [{filename:`Invoice-${booking.booking_ref}.pdf`,content:invoice.base64}]);
      if (!sent) return NextResponse.json({success:false,error:'The invoice email could not be sent.'},{status:502});
      return NextResponse.json({success:true,emailSent:true});
    }

    /*
     * ============================================================
     * REJECT / CANCEL RESERVATION
     * ============================================================
     */
    if (action === 'reject') {
      const updates: Partial<Booking> = {
        reservation_status: 'cancelled',
        admin_notes: body.reason || booking.admin_notes,
      };

      const { data: updated, error: updateError } = await admin
        .from('bookings')
        .update(updates)
        .eq('id', params.id)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error('Reject update error:', updateError);

        return NextResponse.json(
          {
            success: false,
            error: updateError.message || 'Failed to update reservation.',
          },
          { status: 500 }
        );
      }

      if (emailApiKey && adminEmail) {
        try {
          await sendEmail(
            adminEmail,
            `Reservation Cancelled — ${booking.booking_ref}`,
            buildAdminCancellationEmailHtml({
              ...booking,
              ...updates,
            })
          );
        } catch (emailError) {
          console.error(
            'Cancellation notification email failed:',
            emailError
          );
        }
      }

      return NextResponse.json({
        success: true,
        reservation: updated,
      });
    }

    /*
     * ============================================================
     * COMPLETE RESERVATION
     * ============================================================
     */
    if (action === 'complete') {
      const { data: updated, error: updateError } = await admin
        .from('bookings')
        .update({
          reservation_status: 'completed',
        })
        .eq('id', params.id)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error('Complete update error:', updateError);

        return NextResponse.json(
          {
            success: false,
            error: updateError.message || 'Failed to update reservation.',
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        reservation: updated,
      });
    }

    /*
     * ============================================================
     * GENERATE INVOICE / VOUCHER
     * ============================================================
     */
    if (['generate_invoice','generate_voucher','generate_payment_receipt','generate_visa_itinerary','generate_itinerary'].includes(action)) {
      const isInvoice = action === 'generate_invoice';
      const isVoucher = action === 'generate_voucher';
      const isPaymentReceipt = action === 'generate_payment_receipt';
      const isItinerary = action === 'generate_itinerary';
      let paymentHistoryForReceipt: import('@/lib/supabase').Payment[] | undefined;
      let latestPaymentForReceipt: import('@/lib/supabase').Payment | undefined;
      if (isPaymentReceipt) {
        const { data: history } = await admin
          .from('payments')
          .select('*')
          .eq('booking_id', params.id)
          .order('created_at', { ascending: true });
        paymentHistoryForReceipt = (history as import('@/lib/supabase').Payment[]) || undefined;
        latestPaymentForReceipt = paymentHistoryForReceipt?.[paymentHistoryForReceipt.length - 1];
      }

      // Compute the path (and therefore the public URL) BEFORE generating
      // the PDF, not after. getDocumentPublicUrl just builds the URL
      // string — it doesn't require the file to exist — so each generator
      // can embed a QR code pointing at its own eventual public location,
      // all in the same PDF-generation pass. See lib/qr.ts for why this
      // reuses the existing public `documents` bucket URL pattern rather
      // than introducing any new public surface.
      const path = isInvoice
        ? `invoices/${booking.booking_ref}.pdf`
        : isVoucher
          ? `vouchers/${booking.booking_ref}.pdf`
          : isPaymentReceipt
            ? `payment-receipts/${booking.booking_ref}-${Date.now()}.pdf`
            : isItinerary
              ? `itineraries/${booking.booking_ref}.pdf`
              : `visa-itineraries/${booking.booking_ref}.pdf`;
      const qrUrl = getDocumentPublicUrl(admin, path) || undefined;

      const generated = isInvoice
        ? await generatePremiumInvoicePDF(booking as any, undefined, qrUrl)
        : isVoucher
          ? await generateVoucherPDF(booking, undefined, qrUrl)
          : isPaymentReceipt
            ? await generatePaymentReceiptPDF(booking, latestPaymentForReceipt, paymentHistoryForReceipt, undefined, qrUrl)
            : isItinerary
              ? await generateDetailedItineraryPDF(booking, undefined, qrUrl)
              : await generateVisaItineraryPDF(booking, String(body.passportNumber || ''), undefined, qrUrl);
      const base64 = generated.base64;

      const url = await uploadDocumentPDF(
        admin,
        path,
        base64
      );

      const updates: Partial<Booking> = isInvoice
        ? { invoice_generated: true, ...(url ? { invoice_url: url } : {}), ...(!booking.invoice_number ? { invoice_number: `INV-${booking.booking_ref}` } : {}) }
        : isVoucher
          ? { voucher_generated: true, ...(url ? { voucher_url: url } : {}) }
          : isPaymentReceipt
            ? ({ ...(url ? { payment_receipt_url: url } : {}) } as any)
            : isItinerary
              ? ({ ...(url ? { itinerary_url: url } : {}) } as any)
              : ({ ...(url ? { visa_itinerary_url: url } : {}) } as any); 

      const { data: updated, error: updateError } = await admin
        .from('bookings')
        .update(updates)
        .eq('id', params.id)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error(
          'Generate document update error:',
          updateError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              updateError.message ||
              'Failed to save generated document.',
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        reservation: updated,
        url,
        documentType: action.replace('generate_',''),
      });
    }

    /*
     * ============================================================
     * RECORD PAYMENT
     * ============================================================
     */
    if (action === 'record_payment') {
      const amount = Number(body.amount);
      const paymentMethod = String(
        body.payment_method || ''
      ).trim();
      const paymentReference = typeof body.reference === 'string' ? body.reference.trim() : '';
      const paymentNotes = typeof body.notes === 'string' ? body.notes.trim() : '';
      const validPaymentMethods = [
        'Cash',
        'Card',
        'Bank',
        'Link',
        'M-Pesa',
        'PayPal',
      ];

      if (paymentMethod && !validPaymentMethods.includes(paymentMethod)) {
        return NextResponse.json(
          { success: false, error: 'Select a valid payment method: Cash, Card, Bank, Link, M-Pesa, or PayPal.' },
          { status: 400 }
        );
      }

      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json(
          {
            success: false,
            error:
              'A valid payment amount greater than 0 is required.',
          },
          { status: 400 }
        );
      }

      const total = Number(booking.total_price || 0);
      const previousPaid = Number(booking.amount_paid || 0);
      const newAmountPaid = previousPaid + amount;

      /*
       * Do not allow the admin to record more than the
       * invoice total.
       */
      if (total > 0 && newAmountPaid > total) {
        const remaining = Math.max(
          0,
          total - previousPaid
        );

        return NextResponse.json(
          {
            success: false,
            error: `Payment exceeds the total price. Remaining balance is KES ${remaining.toLocaleString()}.`,
          },
          { status: 400 }
        );
      }

      const newBalance =
        total > 0
          ? Math.max(0, total - newAmountPaid)
          : 0;

      let newPaymentStatus: Booking['payment_status'] =
        'partial';

      let newInvoiceStatus: Booking['invoice_status'] =
        'partially_paid';

      if (total > 0 && newAmountPaid >= total) {
        newPaymentStatus = 'paid';
        newInvoiceStatus = 'paid';
      } else if (newAmountPaid <= 0) {
        newPaymentStatus = 'unpaid';
        newInvoiceStatus = 'draft';
      }

      const paymentUpdates: Partial<Booking> = {
        amount_paid: newAmountPaid,
        balance_due: newBalance,
        payment_status: newPaymentStatus,
        invoice_status: newInvoiceStatus,
        payment_method:
          paymentMethod ||
          booking.payment_method ||
          null,
        payment_date: new Date().toISOString(),
      };

      console.log('Recording payment:', {
        bookingId: params.id,
        bookingRef: booking.booking_ref,
        amount,
        total,
        previousPaid,
        newAmountPaid,
        newBalance,
        newPaymentStatus,
        newInvoiceStatus,
      });

      const {
        data: updated,
        error: updateError,
      } = await admin
        .from('bookings')
        .update(paymentUpdates)
        .eq('id', params.id)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error('========================================');
        console.error('RECORD PAYMENT FAILED');
        console.error('Booking ID:', params.id);
        console.error('Updates:', paymentUpdates);
        console.error('Supabase error:', updateError);
        console.error('========================================');

        return NextResponse.json(
          {
            success: false,
            error:
              updateError.message ||
              'Failed to record payment.',
            details: updateError.details || null,
            hint: updateError.hint || null,
            code: updateError.code || null,
          },
          { status: 500 }
        );
      }

      if (!updated) {
        return NextResponse.json(
          {
            success: false,
            error: 'Payment was not saved.',
          },
          { status: 500 }
        );
      }

      /*
       * Insert into the new `payments` table so this specific payment has
       * its own permanent record (date, method, reference, amount) rather
       * than only updating the running totals on `bookings`. Best-effort:
       * never fails the payment itself over this — the authoritative
       * amount_paid/balance_due update above has already succeeded.
       */
      let newPaymentRecord: import('@/lib/supabase').Payment | null = null;
      const effectiveMethod = paymentMethod || booking.payment_method || '';
      if (effectiveMethod && validPaymentMethods.includes(effectiveMethod)) {
        const receiptNumber = `PAY-${booking.booking_ref}-${Date.now().toString().slice(-6)}`;
        const { data: insertedPayment, error: paymentInsertError } = await admin
          .from('payments')
          .insert({
            booking_id: params.id,
            receipt_number: receiptNumber,
            amount,
            currency: booking.currency || 'KES',
            method: effectiveMethod,
            reference: paymentReference || null,
            status: 'received',
            notes: paymentNotes || null,
          })
          .select()
          .maybeSingle();
        if (paymentInsertError) {
          console.error('payments table insert failed (booking totals already saved):', paymentInsertError.message);
        } else {
          newPaymentRecord = insertedPayment as import('@/lib/supabase').Payment;
        }
      } else {
        console.warn('record_payment: no valid payment method available, skipping payments-table history row.');
      }

      const { data: paymentHistory } = await admin
        .from('payments')
        .select('*')
        .eq('booking_id', params.id)
        .order('created_at', { ascending: true });

      /*
       * Notify admin when this payment completes the
       * reservation.
       */
      // Automatically create a payment receipt after every successful payment.
      try {
        const receiptPath = `payment-receipts/${booking.booking_ref}-${Date.now()}.pdf`;
        const receiptQrUrl = getDocumentPublicUrl(admin, receiptPath) || undefined;
        const receipt = await generatePaymentReceiptPDF(updated as Booking, newPaymentRecord || undefined, (paymentHistory as import('@/lib/supabase').Payment[]) || undefined, undefined, receiptQrUrl);
        const receiptUrl = await uploadDocumentPDF(admin, receiptPath, receipt.base64);
        if (receiptUrl) {
          const { data: withReceipt } = await admin.from('bookings').update({ payment_receipt_url: receiptUrl } as any).eq('id', params.id).select().maybeSingle();
          if (withReceipt) (updated as any).payment_receipt_url = receiptUrl;
        }
      } catch (receiptError) {
        console.error('Payment receipt generation failed; payment remains saved:', receiptError);
      }

      if (
        newPaymentStatus === 'paid' &&
        emailApiKey &&
        adminEmail
      ) {
        try {
          await sendEmail(
            adminEmail,
            `Payment Received — ${booking.booking_ref}`,
            buildAdminPaymentReceivedEmailHtml(
              updated as Booking
            )
          );
        } catch (emailError) {
          console.error(
            'Payment notification email failed:',
            emailError
          );
        }
      }

      return NextResponse.json({
        success: true,
        reservation: updated,
        payment: {
          amount,
          total,
          amountPaid: newAmountPaid,
          balanceDue: newBalance,
          paymentStatus: newPaymentStatus,
          invoiceStatus: newInvoiceStatus,
        },
      });
    }

    /*
     * ============================================================
     * GENERIC FIELD UPDATE — SAVE CHANGES
     * ============================================================
     */
    if (action === 'update' || !action) {
      const allowedFields = [
        'admin_notes',
        'payment_status',
        'payment_method',
        'total_price',
        'hotel_name',
        'pickup_location',
        'nationality',
        'booking_type',
        'reservation_status',
        'invoice_status',
        'invoice_number',
        'deposit_amount',
        'due_date',
        // Itemized cost breakdown — editable per spec Part 4. The invoice/
        // quotation generators read these fields directly at PDF-generation
        // time (lib/invoice-generator.ts), so saving an update here and
        // regenerating the invoice automatically recalculates subtotal,
        // discount, tax and grand total. Nothing is hard-coded.
        'accommodation_cost',
        'park_fees',
        'guide_cost',
        'transport_cost',
        'meals_cost',
        'other_costs',
        'discount',
        'tax',
        'currency',
      ];

      const numericFields = new Set([
        'total_price', 'deposit_amount', 'accommodation_cost', 'park_fees',
        'guide_cost', 'transport_cost', 'meals_cost', 'other_costs', 'discount', 'tax',
      ]);

      const fieldUpdates: Record<string, any> = {};

      for (const field of allowedFields) {
        if (
          Object.prototype.hasOwnProperty.call(
            body,
            field
          )
        ) {
          fieldUpdates[field] = body[field];
        }
      }

      // Cost-breakdown fields must be non-negative numbers (or null to
      // clear them) — never silently save an invalid value that would
      // then render wrong on the next invoice/quotation PDF.
      for (const field of Object.keys(fieldUpdates)) {
        if (!numericFields.has(field)) continue;
        const raw = fieldUpdates[field];
        if (raw === null || raw === '' || raw === undefined) {
          fieldUpdates[field] = null;
          continue;
        }
        const n = Number(raw);
        if (!Number.isFinite(n) || n < 0) {
          return NextResponse.json(
            { success: false, error: `Invalid value for ${field}: must be a non-negative number.` },
            { status: 400 }
          );
        }
        fieldUpdates[field] = n;
      }

      if (typeof fieldUpdates.currency === 'string' && fieldUpdates.currency.trim() === '') {
        delete fieldUpdates.currency;
      }

      if (Object.keys(fieldUpdates).length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'No valid fields to update.',
          },
          { status: 400 }
        );
      }

      /*
       * Normalize total price.
       */
      if ('total_price' in fieldUpdates) {
        const total = Number(
          fieldUpdates.total_price
        );

        if (!Number.isFinite(total) || total < 0) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Total price must be a valid number greater than or equal to 0.',
            },
            { status: 400 }
          );
        }

        fieldUpdates.total_price = total;
      }

      /*
       * Normalize deposit.
       */
      if ('deposit_amount' in fieldUpdates) {
        const deposit = Number(
          fieldUpdates.deposit_amount
        );

        if (
          !Number.isFinite(deposit) ||
          deposit < 0
        ) {
          return NextResponse.json(
            {
              success: false,
              error:
                'Deposit amount must be a valid number greater than or equal to 0.',
            },
            { status: 400 }
          );
        }

        fieldUpdates.deposit_amount = deposit;
      }

      /*
       * Validate payment method.
       */
      if ('payment_method' in fieldUpdates) {
        const validPaymentMethods = [
          'Cash',
          'Card',
          'Bank',
          'Link',
          'M-Pesa',
          'PayPal',
        ];

        if (
          fieldUpdates.payment_method !== null &&
          fieldUpdates.payment_method !== '' &&
          !validPaymentMethods.includes(String(fieldUpdates.payment_method))
        ) {
          return NextResponse.json(
            { success: false, error: 'Invalid payment method.' },
            { status: 400 }
          );
        }

        fieldUpdates.payment_method = fieldUpdates.payment_method || null;
      }

      /*
       * Validate payment status.
       */
      if ('payment_status' in fieldUpdates) {
        const validPaymentStatuses = [
          'unpaid',
          'partial',
          'paid',
        ];

        if (
          !validPaymentStatuses.includes(
            fieldUpdates.payment_status
          )
        ) {
          return NextResponse.json(
            {
              success: false,
              error: 'Invalid payment status.',
            },
            { status: 400 }
          );
        }
      }

      /*
       * Validate reservation status.
       */
      if ('reservation_status' in fieldUpdates) {
        const validReservationStatuses = [
          'pending',
          'confirmed',
          'cancelled',
          'completed',
        ];

        if (
          !validReservationStatuses.includes(
            fieldUpdates.reservation_status
          )
        ) {
          return NextResponse.json(
            {
              success: false,
              error: 'Invalid reservation status.',
            },
            { status: 400 }
          );
        }
      }

      const wasUnpaid =
        booking.payment_status !== 'paid';

      const {
        data: updated,
        error: updateError,
      } = await admin
        .from('bookings')
        .update(fieldUpdates)
        .eq('id', params.id)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error('========================================');
        console.error('SAVE CHANGES FAILED');
        console.error('Booking ID:', params.id);
        console.error('Updates:', fieldUpdates);
        console.error('Supabase error:', updateError);
        console.error('========================================');

        return NextResponse.json(
          {
            success: false,
            error:
              updateError.message ||
              'Failed to update reservation.',
            details: updateError.details || null,
            hint: updateError.hint || null,
            code: updateError.code || null,
          },
          { status: 500 }
        );
      }

      if (!updated) {
        return NextResponse.json(
          {
            success: false,
            error: 'Reservation was not updated.',
          },
          { status: 404 }
        );
      }

      /*
       * If Save Changes changes payment status to paid,
       * notify the admin.
       */
      if (
        wasUnpaid &&
        fieldUpdates.payment_status === 'paid' &&
        emailApiKey &&
        adminEmail
      ) {
        try {
          await sendEmail(
            adminEmail,
            `Payment Received — ${booking.booking_ref}`,
            buildAdminPaymentReceivedEmailHtml(
              updated as Booking
            )
          );
        } catch (emailError) {
          console.error(
            'Payment notification email failed:',
            emailError
          );
        }
      }

      return NextResponse.json({
        success: true,
        reservation: updated,
      });
    }

    /*
     * ============================================================
     * UNKNOWN ACTION
     * ============================================================
     */
    return NextResponse.json(
      {
        success: false,
        error: `Unknown reservation action: ${action || 'none'}`,
      },
      { status: 400 }
    );
  } catch (err) {
    console.error('Patch reservation error:', err);

    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong.',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Defense in depth: middleware already requires a valid session for any
    // /api/admin/* route and forwards the caller's role in this header —
    // deletion is restricted to owners even if a staff account's cookie
    // somehow reached this far.
    const role = req.headers.get('x-admin-role');
    if (role !== 'owner') {
      return NextResponse.json({ success: false, error: 'Only owner accounts can delete reservations.' }, { status: 403 });
    }

    const admin = getSupabaseAdmin();

    const { error } = await admin
      .from('bookings')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Delete reservation error:', error);

      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to delete reservation.',
        },
        { status: 500 }
      );
    }

    await logAdminAction({
      username: req.headers.get('x-admin-username') || 'unknown',
      role: 'owner',
      action: 'reservation_delete',
      targetType: 'booking',
      targetId: params.id,
      ip: getClientIp(req),
      userAgent: req.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error('Delete reservation error:', err);

    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong.',
      },
      { status: 500 }
    );
  }
}
