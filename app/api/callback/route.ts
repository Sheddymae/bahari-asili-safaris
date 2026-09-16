import { NextRequest, NextResponse } from 'next/server';

const RESEND_API = 'https://api.resend.com/emails';
const OWNER_EMAIL = process.env.OWNER_NOTIFICATION_EMAIL || 'sheddymae02@gmail.com';
const SENDER = process.env.RESEND_FROM_EMAIL || 'Bahari Asili Safaris <onboarding@resend.dev>';

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const phone = String(body.phone || '').trim();
    const locale = String(body.locale || 'en').trim();
    if (name.length < 2 || phone.length < 5 || name.length > 100 || phone.length > 40) {
      return NextResponse.json({ success: false, error: 'Invalid callback details.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return NextResponse.json({ success: false, error: 'Callback service is not configured.' }, { status: 503 });

    const response = await fetch(RESEND_API, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: SENDER,
        to: [OWNER_EMAIL],
        subject: `Callback request from ${name}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px"><h2>Callback request</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Phone:</strong> ${escapeHtml(phone)}</p><p><strong>Language:</strong> ${escapeHtml(locale)}</p><p>Requested from the Bahari Asili Safaris website.</p></div>`,
      }),
    });

    if (!response.ok) {
      console.error('Callback Resend error:', await response.text());
      return NextResponse.json({ success: false, error: 'Could not send callback request.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Callback request error:', error);
    return NextResponse.json({ success: false, error: 'Could not send callback request.' }, { status: 500 });
  }
}
