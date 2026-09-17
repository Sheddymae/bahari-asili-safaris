import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizeLocale } from '@/lib/locale-content';
import { generateVoucherPDF } from '@/lib/voucher-generator';
import type { Booking } from '@/lib/supabase';
import { safaris, excursions } from '@/lib/tours-data';

const RESEND_API = 'https://api.resend.com/emails';

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function inferBookingType(
  safariName: string,
  safariNamesList: string[],
  excursionNamesList: string[],
): string {
  const name = safariName.trim();
  const lower = name.toLowerCase();

  if (
    safariNamesList.some(
      (s) => s.toLowerCase().trim() === lower,
    )
  ) {
    return 'safari';
  }

  if (
    excursionNamesList.some(
      (e) => e.toLowerCase().trim() === lower,
    )
  ) {
    return 'excursion';
  }

  if (
    /transfer|airport|aeroporto|4x4|4×4|driver/.test(lower)
  ) {
    return 'transfer';
  }

  if (/hotel|resort|lodge/.test(lower)) {
    return 'hotel';
  }

  if (
    lower === 'altro / other' ||
    lower === 'other'
  ) {
    return 'custom';
  }

  return 'safari';
}

// --------------------------------------------------
// BOOKING EMAIL
// --------------------------------------------------

function buildBookingEmailHtml(d: {
  bookingRef: string;
  fullName: string;
  email: string;
  whatsapp: string;
  nationality?: string;
  safariName: string;
  arrivalDate: string;
  adults: number;
  childrenDisplay: string;
  message: string;
}): string {
  const bookingRef = escapeHtml(d.bookingRef);
  const fullName = escapeHtml(d.fullName);
  const email = escapeHtml(d.email);
  const whatsapp = escapeHtml(d.whatsapp || '—');
  const nationality = d.nationality
    ? escapeHtml(d.nationality)
    : '';
  const safariName = escapeHtml(d.safariName);
  const arrivalDate = escapeHtml(d.arrivalDate);
  const childrenDisplay = escapeHtml(d.childrenDisplay);
  const message = escapeHtml(d.message);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">

      <div style="background: #0e7490; padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">
          Bahari Asili Safaris
        </h1>
        <p style="color: rgba(255,255,255,0.8); margin: 4px 0 0;">
          Watamu, Kenya · Founded by Shadrack Safari
        </p>
      </div>

      <div style="background: #f5f1e8; padding: 20px;">
        <p style="margin: 0; color: #f97316; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
          Booking Reference
        </p>

        <p style="font-size: 28px; font-weight: 800; color: #0e7490; margin: 4px 0;">
          ${bookingRef}
        </p>
      </div>

      <div style="padding: 24px; background: #ffffff; border: 1px solid #e2e8f0;">

        <h2 style="color: #0e7490; font-size: 18px; margin-top: 0;">
          Booking Details
        </h2>

        <table style="width: 100%; border-collapse: collapse;">

          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">
              Name
            </td>
            <td style="padding: 6px 0; font-weight: 600;">
              ${fullName}
            </td>
          </tr>

          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">
              Email
            </td>
            <td style="padding: 6px 0;">
              ${email}
            </td>
          </tr>

          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">
              WhatsApp
            </td>
            <td style="padding: 6px 0;">
              ${whatsapp}
            </td>
          </tr>

          ${
            nationality
              ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">
              Nationality
            </td>
            <td style="padding: 6px 0;">
              ${nationality}
            </td>
          </tr>
          `
              : ''
          }

          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">
              Safari / Tour
            </td>
            <td style="padding: 6px 0; font-weight: 600; color: #f97316;">
              ${safariName}
            </td>
          </tr>

          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">
              Arrival Date
            </td>
            <td style="padding: 6px 0; font-weight: 600;">
              ${arrivalDate}
            </td>
          </tr>

          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">
              Adults
            </td>
            <td style="padding: 6px 0;">
              ${d.adults}
            </td>
          </tr>

          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px;">
              Bambini / Children
            </td>
            <td style="padding: 6px 0;">
              ${childrenDisplay}
            </td>
          </tr>

          ${
            message
              ? `
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 14px; vertical-align: top;">
              Message
            </td>
            <td style="padding: 6px 0;">
              ${message}
            </td>
          </tr>
          `
              : ''
          }

        </table>

        <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin-top: 20px;">
          <p style="margin: 0; font-size: 14px; color: #0e7490;">
            Your PDF voucher is attached. Please present it on arrival in Watamu.
          </p>
        </div>

      </div>

      <div style="background: #1f2937; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          WhatsApp: +254101923355 · bahariasilisafaris@gmail.com
        </p>

        <p style="color: #64748b; font-size: 11px; margin: 8px 0 0;">
          © 2026 Bahari Asili Safaris, Watamu. Founded by Shadrack Safari.
        </p>
      </div>

    </div>
  `;
}

// --------------------------------------------------
// REVIEW EMAIL
// --------------------------------------------------

function buildReviewEmailHtml(d: {
  fullName: string;
  bookingRef: string;
  safariName: string;
}): string {
  const fullName = escapeHtml(d.fullName);
  const bookingRef = escapeHtml(d.bookingRef);
  const safariName = escapeHtml(d.safariName);

  const reviewLink =
    `https://bahari-asili-safaris.vercel.app/?review=${encodeURIComponent(
      d.bookingRef,
    )}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">

      <div style="background: #0e7490; padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">
          How was your safari, ${fullName}?
        </h1>
      </div>

      <div style="padding: 24px; background: #ffffff; border: 1px solid #e2e8f0;">

        <p style="font-size: 16px; margin: 0 0 16px;">
          Thank you for booking
          <strong style="color: #f97316;">
            ${safariName}
          </strong>
          with Bahari Asili Safaris
          (Ref: ${bookingRef}).
        </p>

        <p style="font-size: 15px; margin: 0 0 20px;">
          We'd love your feedback! Please rate your experience on a scale of 0–10:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">

          <tr>
            <td style="padding: 10px 0; font-weight: 600;">
              Value for Money
            </td>
            <td style="padding: 10px 0; text-align: right;">
              <span style="display: inline-block; padding: 6px 14px; background: #f1f5f9; border-radius: 8px; font-weight: 700; color: #0e7490;">
                ____ / 10
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding: 10px 0; font-weight: 600;">
              Value of Services
            </td>
            <td style="padding: 10px 0; text-align: right;">
              <span style="display: inline-block; padding: 6px 14px; background: #f1f5f9; border-radius: 8px; font-weight: 700; color: #0e7490;">
                ____ / 10
              </span>
            </td>
          </tr>

          <tr>
            <td style="padding: 10px 0; font-weight: 600;">
              Staff
            </td>
            <td style="padding: 10px 0; text-align: right;">
              <span style="display: inline-block; padding: 6px 14px; background: #f1f5f9; border-radius: 8px; font-weight: 700; color: #0e7490;">
                ____ / 10
              </span>
            </td>
          </tr>

        </table>

        <div style="text-align: center; margin: 28px 0;">

          <a
            href="${reviewLink}"
            style="display: inline-block; background: #0e7490; color: white; text-decoration: none; font-weight: 600; padding: 14px 32px; border-radius: 10px; font-size: 15px;"
          >
            Share Your Review
          </a>

        </div>

        <p style="font-size: 13px; color: #64748b; margin: 0;">
          You can also leave a review on our Google Business page or TripAdvisor.
          Your feedback helps us improve and helps other travelers discover the real Kenya.
        </p>

      </div>

      <div style="background: #1f2937; padding: 20px; border-radius: 0 0 12px 12px; text-align: center;">

        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          WhatsApp: +254101923355 · bahariasilisafaris@gmail.com
        </p>

        <p style="color: #64748b; font-size: 11px; margin: 8px 0 0;">
          © 2026 Bahari Asili Safaris, Watamu. Founded by Shadrack Safari.
        </p>

      </div>

    </div>
  `;
}

// --------------------------------------------------
// RESEND EMAIL
// --------------------------------------------------

async function sendEmail(
  apiKey: string,
  sender: string,
  to: string,
  subject: string,
  html: string,
  attachments?: {
    filename: string;
    content: string;
  }[],
): Promise<boolean> {
  try {
    const response = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: [to],
        subject,
        html,
        attachments: attachments || [],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error('Resend email error:', {
        status: response.status,
        response: errorText,
        to,
        subject,
      });

      return false;
    }

    return true;
  } catch (error) {
    console.error('Email request failed:', error);
    return false;
  }
}

// --------------------------------------------------
// POST /api/booking
// --------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ----------------------------------------------
    // READ FORM DATA
    // ----------------------------------------------

    const firstName = String(body.firstName || '').trim();
    const lastName = String(body.lastName || '').trim();
    const email = String(body.email || '').trim();
    const whatsapp = String(body.whatsapp || '').trim();
    const nationality = String(body.nationality || '').trim();
    const safariName = String(body.safariName || '').trim();
    const arrivalDate = String(body.arrivalDate || '').trim();

    const adults = Math.max(
      1,
      parseInt(String(body.adults || '1'), 10) || 1,
    );

    const children = Math.max(
      0,
      parseInt(String(body.children || '0'), 10) || 0,
    );

    const kidsAges: number[] = Array.isArray(body.kidsAges)
      ? body.kidsAges
          .map((age: unknown) => Number(age))
          .filter(
            (age: number) =>
              Number.isFinite(age) &&
              age >= 1 &&
              age <= 16,
          )
      : [];

    const message = String(body.message || '').trim();

    const userId =
      typeof body.userId === 'string' &&
      body.userId.trim()
        ? body.userId.trim()
        : null;

    const locale = normalizeLocale(body.locale);

    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    if (!firstName || !lastName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name is required.',
        },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid email is required.',
        },
        { status: 400 },
      );
    }

    if (!safariName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Safari selection is required.',
        },
        { status: 400 },
      );
    }

    if (!arrivalDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Arrival date is required.',
        },
        { status: 400 },
      );
    }

    const parsedArrivalDate = new Date(`${arrivalDate}T00:00:00`);

    if (Number.isNaN(parsedArrivalDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid arrival date.',
        },
        { status: 400 },
      );
    }

    // ----------------------------------------------
    // SUPABASE CONFIGURATION
    // ----------------------------------------------

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    const anonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      console.error(
        'BOOKING ERROR: NEXT_PUBLIC_SUPABASE_URL is missing.',
      );

      return NextResponse.json(
        {
          success: false,
          error:
            'Booking service is temporarily unavailable. Please try again or WhatsApp us.',
        },
        { status: 500 },
      );
    }

    /*
     * Prefer the service-role key.
     *
     * If it is not configured, fall back to the public
     * anonymous key. This allows guest bookings to work
     * when Supabase has a public INSERT policy on bookings.
     */
    const supabaseKey = serviceRoleKey || anonKey;

    if (!supabaseKey) {
      console.error(
        'BOOKING ERROR: No Supabase key is configured.',
      );

      return NextResponse.json(
        {
          success: false,
          error:
            'Booking service is temporarily unavailable. Please try again or WhatsApp us.',
        },
        { status: 500 },
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // ----------------------------------------------
    // GENERATE UNIQUE BOOKING REFERENCE
    // ----------------------------------------------

    const y = parsedArrivalDate.getFullYear();
    const m = String(
      parsedArrivalDate.getMonth() + 1,
    ).padStart(2, '0');

    const day = String(
      parsedArrivalDate.getDate(),
    ).padStart(2, '0');

    /*
     * Use timestamp/random suffix instead of counting
     * database rows. This prevents two customers
     * submitting at the same time from receiving the
     * same booking reference.
     */
    const uniquePart =
      Date.now().toString(36).slice(-4).toUpperCase();

    let bookingRef =
      `BA-${y}${m}${day}-${uniquePart}`;

    // ----------------------------------------------
    // DETERMINE BOOKING TYPE
    // ----------------------------------------------

    const bookingType = inferBookingType(
      safariName,
      safaris.map((s) => s.name),
      excursions.map((e) => e.nameIt),
    );

    // ----------------------------------------------
    // PREPARE DATABASE ROW
    // ----------------------------------------------

    const bookingRow = {
      booking_ref: bookingRef,
      first_name: firstName,
      last_name: lastName,
      email,
      whatsapp,
      nationality: nationality || null,
      adults,
      children,
      kids_ages:
        children > 0 ? kidsAges : null,
      arrival_date: arrivalDate,
      safari_name: safariName,
      booking_type: bookingType,
      message,
      reservation_status: 'pending',
      payment_status: 'unpaid',
      user_id: userId,
      locale,
    };

    // ----------------------------------------------
    // SAVE BOOKING
    // ----------------------------------------------

    let saveResult =
      await supabase
        .from('bookings')
        .insert(bookingRow);

    /*
     * Compatibility:
     * If the locale column does not exist yet,
     * retry without it.
     */
    if (
      saveResult.error &&
      /locale|column.*does not exist|schema cache/i.test(
        `${saveResult.error.message} ${
          saveResult.error.details || ''
        }`,
      )
    ) {
      console.warn(
        'Booking locale column is unavailable. Retrying without locale.',
      );

      const {
        locale: _locale,
        ...legacyBookingRow
      } = bookingRow;

      saveResult =
        await supabase
          .from('bookings')
          .insert(legacyBookingRow);
    }

    if (saveResult.error) {
      const error = saveResult.error;

      console.error(
        'SUPABASE BOOKING INSERT ERROR:',
        {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          usingServiceRole: Boolean(serviceRoleKey),
        },
      );

      return NextResponse.json(
        {
          success: false,
          error:
            'We could not save your booking. Please try again or contact us on WhatsApp.',
          code: error.code,
          details:
            process.env.NODE_ENV === 'development'
              ? error.message
              : undefined,
        },
        { status: 500 },
      );
    }

    // ----------------------------------------------
    // PREPARE EMAIL DATA
    // ----------------------------------------------

    const fullName =
      `${firstName} ${lastName}`;

    const childrenDisplay =
      children > 0
        ? kidsAges.length > 0
          ? `${children} (Ages: ${kidsAges.join(
              ', ',
            )} yrs)`
          : String(children)
        : '0';

    const bookingHtml =
      buildBookingEmailHtml({
        bookingRef,
        fullName,
        email,
        whatsapp,
        nationality,
        safariName,
        arrivalDate,
        adults,
        childrenDisplay,
        message,
      });

    // ----------------------------------------------
    // GENERATE VOUCHER
    // ----------------------------------------------

    let attachment: {
      filename: string;
      content: string;
    }[] = [];

    try {
      const voucherBooking: Booking = {
        booking_ref: bookingRef,
        first_name: firstName,
        last_name: lastName,
        email,
        whatsapp,
        nationality: nationality || null,
        adults,
        children,
        kids_ages:
          children > 0 ? kidsAges : null,
        arrival_date: arrivalDate,
        safari_name: safariName,
        message,
        reservation_status: 'pending',
        booking_type:
          bookingType as Booking['booking_type'],
        locale,
      };

      const { base64 } =
        await generateVoucherPDF(
          voucherBooking,
        );

      attachment = [
        {
          filename: `${bookingRef}.pdf`,
          content: base64,
        },
      ];
    } catch (pdfError) {
      /*
       * PDF failure must NOT cancel the booking.
       */
      console.error(
        'Voucher PDF generation failed:',
        pdfError,
      );
    }

    // ----------------------------------------------
    // EMAIL CONFIGURATION
    // ----------------------------------------------

    /*
     * Support either variable name.
     *
     * EMAIL_API_KEY is preferred if already used
     * by your project.
     *
     * RESEND_API_KEY is also accepted.
     */
    const emailApiKey =
      process.env.EMAIL_API_KEY ||
      process.env.RESEND_API_KEY;

    const emailSender =
      process.env.EMAIL_SENDER ||
      'Bahari Asili Safaris <bahariasilisafaris@gmail.com>';

    const ownerEmail =
      process.env.EMAIL_TO;

    // bahariasilisafaris@gmail.com is Resend's SANDBOX sender — until a real
    // domain is verified in the Resend dashboard, it can only deliver to
    // the email address the Resend account itself was signed up with.
    // Every other recipient (every real customer, and EMAIL_TO unless it
    // happens to match that exact signup address) gets silently rejected
    // by Resend's API. sendEmail() below already logs the real Resend
    // error, but this makes the single most common root cause of "nobody
    // got any email" impossible to miss in the logs.
    if (emailSender.includes('bahariasilisafaris@gmail.com')) {
      console.warn(
        'EMAIL_SENDER is still Resend\'s sandbox address (bahariasilisafaris@gmail.com). ' +
        'Resend will silently refuse to deliver to anyone except the email your Resend account was signed up with. ' +
        'Verify a domain at https://resend.com/domains, then set EMAIL_SENDER to an address on that domain.',
      );
    }

    let ownerEmailSent = false;
    let customerEmailSent = false;

    // ----------------------------------------------
    // SEND EMAILS
    // ----------------------------------------------

    if (!emailApiKey) {
      /*
       * IMPORTANT:
       * The booking has already been saved successfully.
       *
       * Missing email configuration must NOT cause the
       * customer to receive a booking failure message.
       */
      console.warn(
        'EMAIL_API_KEY / RESEND_API_KEY is not configured. Booking saved without email notification.',
      );
    } else {
      // Owner notification
      if (ownerEmail) {
        ownerEmailSent =
          await sendEmail(
            emailApiKey,
            emailSender,
            ownerEmail,
            `New Booking – ${bookingRef}`,
            bookingHtml,
            attachment,
          );

        if (!ownerEmailSent) {
          console.error(
            `Owner notification FAILED for booking ${bookingRef} — see "Resend email error" above for the exact reason (check EMAIL_TO="${ownerEmail}" and the sandbox-sender warning above).`,
          );
        }
      } else {
        console.warn(
          'EMAIL_TO is not configured. Owner notification skipped.',
        );
      }

      // Client voucher
      customerEmailSent =
        await sendEmail(
          emailApiKey,
          emailSender,
          email,
          `Your Bahari Asili Voucher – ${bookingRef}`,
          bookingHtml,
          attachment,
        );

      if (!customerEmailSent) {
        console.error(
          `Customer voucher email FAILED for booking ${bookingRef}, recipient "${email}" — see "Resend email error" above for the exact reason.`,
        );
      }

      // Review request
      const reviewHtml =
        buildReviewEmailHtml({
          fullName,
          bookingRef,
          safariName,
        });

      await sendEmail(
        emailApiKey,
        emailSender,
        email,
        `How was your safari? Share your review – ${bookingRef}`,
        reviewHtml,
      );
    }

    // ----------------------------------------------
    // SUCCESS
    // ----------------------------------------------

    console.log(
      'BOOKING CREATED SUCCESSFULLY:',
      {
        bookingRef,
        bookingType,
        email,
        customerEmailSent,
        ownerEmailSent,
      },
    );

    return NextResponse.json(
      {
        success: true,
        bookingRef,
        emailSent: customerEmailSent,
        customerEmailSent,
        ownerEmailSent,
        bookingType,
      },
      { status: 200 },
    );
  } catch (err: unknown) {
    console.error(
      'BOOKING API UNEXPECTED ERROR:',
      err,
    );

    const errorMessage =
      err instanceof Error
        ? err.message
        : 'Unknown server error';

    return NextResponse.json(
      {
        success: false,
        error:
          'Something went wrong. Please try again or WhatsApp us.',
        details:
          process.env.NODE_ENV === 'development'
            ? errorMessage
            : undefined,
      },
      { status: 500 },
    );
  }
}
