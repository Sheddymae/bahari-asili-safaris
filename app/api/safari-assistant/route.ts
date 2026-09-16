import { NextRequest, NextResponse } from 'next/server';
import { safaris } from '@/lib/tours-data';

type Message = { role: 'user' | 'assistant'; content: string };
const locales = ['en', 'it', 'fr', 'es', 'de', 'ar', 'zh', 'sw'] as const;
type Locale = (typeof locales)[number];

function fallback(message: string, locale: Locale) {
  const q = message.toLowerCase();
  const matches = safaris.filter((s) => [s.name, ...s.parks, ...s.highlights].some((v) => q.includes(v.toLowerCase().split(' ')[0]))).slice(0, 3);
  const names = matches.map((s) => s.name).join(', ');
  const base = matches.length ? `These safari options may fit: ${names}. ` : '';
  const rest: Record<Locale, string> = {
    en: 'Tell me your travel dates, adults, children and what you would like to experience. I can help prepare a tailored quotation request.',
    it: 'Dimmi le date, gli adulti, i bambini e cosa desideri vivere. Posso aiutarti a preparare una richiesta di preventivo personalizzata.',
    fr: 'Indiquez vos dates, adultes, enfants et vos envies. Je peux préparer une demande de devis personnalisée.',
    es: 'Dime tus fechas, adultos, niños y lo que te gustaría vivir. Puedo ayudarte a preparar una solicitud de presupuesto personalizada.',
    de: 'Nenne mir Reisedaten, Erwachsene, Kinder und deine Wünsche. Ich kann eine individuelle Angebotsanfrage vorbereiten.',
    ar: 'أخبرني بالتواريخ وعدد البالغين والأطفال وما ترغب في تجربته. يمكنني مساعدتك في إعداد طلب عرض سعر مخصص.',
    zh: '请告诉我出行日期、成人和儿童人数以及您的旅行需求。我可以帮助您准备定制报价申请。',
    sw: 'Niambie tarehe, watu wazima, watoto na unachotaka kufanya. Naweza kusaidia kuandaa ombi la bei maalum.',
  };
  return base + rest[locale];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale: Locale = locales.includes(body.locale) ? body.locale : 'en';
    const messages: Message[] = Array.isArray(body.messages)
      ? body.messages.filter((m: Message) => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string').slice(-12)
      : [];
    const latest = messages.filter((m) => m.role === 'user').at(-1)?.content?.trim() || '';
    if (!latest) return NextResponse.json({ reply: fallback('', locale), mode: 'guided' });

    const key = process.env.OPENAI_API_KEY;
    if (!key) return NextResponse.json({ reply: fallback(latest, locale), mode: 'guided' });

    const catalog = safaris.map((s) => ({ name: s.name, days: s.days, nights: s.nights, parks: s.parks, tagline: s.tagline, highlights: s.highlights, priceTier: s.priceTier ?? 'quote-based' }));
    const instructions = `You are the Bahari Asili Safaris website assistant. Reply in ${locale}. Help visitors plan Kenya safaris and qualify genuine enquiries. Use only the supplied catalogue for package facts. Never invent prices, availability, hotels, park fees, flights, visa rules or policies. Pricing is quote-based and depends on dates, group size and accommodation. Ask for dates, adults, children and ages, destination interests, duration, budget and accommodation preference when useful. Never request payment card details or passwords. When ready, invite the visitor to request a tailored quotation or contact the safari team. Never claim a booking or live availability has been confirmed.`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
        instructions,
        input: [{ role: 'developer', content: `Safari catalogue: ${JSON.stringify(catalog)}` }, ...messages],
        max_output_tokens: 450,
      }),
    });
    if (!response.ok) return NextResponse.json({ reply: fallback(latest, locale), mode: 'guided' });
    const data = await response.json();
    const reply = typeof data.output_text === 'string' && data.output_text.trim() ? data.output_text.trim() : fallback(latest, locale);
    return NextResponse.json({ reply, mode: 'ai' });
  } catch (error) {
    console.error('Safari assistant error:', error);
    return NextResponse.json({ reply: 'I can help you plan your safari. Please tell me your travel dates, number of travellers and preferred destination.', mode: 'guided' });
  }
}
