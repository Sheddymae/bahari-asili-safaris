import { NextRequest, NextResponse } from 'next/server';
import { safaris } from '@/lib/tours-data';

type Message = { role: 'user' | 'assistant'; content: string };
const locales = ['en', 'it', 'fr', 'es', 'de', 'ar', 'zh', 'sw'] as const;
type Locale = (typeof locales)[number];

const DEFAULT_MODEL = 'gpt-5.6-luna';
const OPENAI_URL = 'https://api.openai.com/v1/responses';
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 4_000;
const MAX_OUTPUT_TOKENS = 800;

const fallbackReplies: Record<Locale, string> = {
  en: 'I can help with Kenya travel, safaris, beaches and trip planning. Tell me what you would like to explore and I will guide you.',
  it: 'Posso aiutarti con viaggi in Kenya, safari, spiagge e pianificazione del viaggio. Dimmi cosa vuoi scoprire e ti guiderò.',
  fr: 'Je peux vous aider pour les voyages au Kenya, les safaris, les plages et la planification de votre séjour. Dites-moi ce que vous souhaitez découvrir.',
  es: 'Puedo ayudarte con viajes por Kenia, safaris, playas y planificación. Dime qué te gustaría descubrir y te orientar é.',
  de: 'Ich kann dir bei Reisen in Kenia, Safaris, Stränden und der Reiseplanung helfen. Sag mir, was du entdecken möchtest.',
  ar: 'يمكنني مساعدتك في السفر إلى كينيا ورحلات السفاري والشواطئ وتخطيط الرحلات. أخبرني بما تريد اكتشافه وسأساعدك.',
  zh: '我可以帮助您规划肯尼亚旅行、野生动物之旅、海滩假期和行程。告诉我您想了解什么，我会为您提供建议。',
  sw: 'Naweza kukusaidia kuhusu safari za Kenya, fukwe na mipango ya safari. Niambie ungependa kujua nini na nitakuelekeza.',
};

const watamuFallback: Record<Locale, string> = {
  en: 'Watamu is excellent for a relaxed coastal holiday and can also be combined with a safari. You can enjoy Watamu Marine National Park, snorkeling and boat trips, dolphin watching, Mida Creek, birding, mangrove experiences, beach time and local coastal excursions. For a fuller trip, you can combine Watamu with Malindi, Tsavo or Amboseli depending on your time. If you tell me how many days you have, I can suggest a practical itinerary.',
  it: 'Watamu è ideale per una vacanza rilassante sulla costa e può essere combinata con un safari. Puoi visitare il Watamu Marine National Park, fare snorkeling ed escursioni in barca, osservare i delfini, esplorare Mida Creek, fare birdwatching e vivere esperienze tra mangrovie e spiagge. Se mi dici quanti giorni hai, posso suggerirti un itinerario pratico.',
  fr: 'Watamu est idéale pour des vacances tranquilles sur la côte et peut aussi être combinée avec un safari. Vous pouvez découvrir le parc marin de Watamu, faire du snorkeling et des excursions en bateau, observer les dauphins, explorer Mida Creek, pratiquer l’observation des oiseaux et profiter des plages et des mangroves. Si vous me dites combien de jours vous avez, je peux proposer un itinéraire pratique.',
  es: 'Watamu es ideal para unas vacaciones tranquilas en la costa y también se puede combinar con un safari. Puedes visitar el parque marino de Watamu, hacer snorkel y excursiones en barco, observar delfines, explorar Mida Creek, practicar avistamiento de aves y disfrutar de playas y manglares. Si me dices cuántos días tienes, puedo proponerte un itinerario práctico.',
  de: 'Watamu eignet sich hervorragend für einen entspannten Küstenurlaub und lässt sich auch mit einer Safari verbinden. Du kannst den Watamu Marine National Park besuchen, schnorcheln, Bootsausflüge unternehmen, Delfine beobachten, Mida Creek erkunden, Vögel beobachten und Zeit an den Stränden und Mangroven verbringen. Wenn du mir sagst, wie viele Tage du hast, kann ich dir eine passende Reiseroute vorschlagen.',
  ar: 'تُعد واتامو مناسبة جداً لعطلة هادئة على الساحل ويمكن أيضاً دمجها مع رحلة سفاري. يمكنك زيارة متنزه واتامو البحري، والاستمتاع بالغطس ورحلات القوارب ومشاهدة الدلافين واستكشاف خور ميدا ومراقبة الطيور وتجارب أشجار المانغروف والشواطئ. إذا أخبرتني بعدد الأيام المتاحة، يمكنني اقتراح برنامج عملي.',
  zh: '瓦塔穆非常适合轻松的海滨假期，也可以与野生动物之旅结合。您可以体验瓦塔穆海洋国家公园、浮潜、乘船游览、观赏海豚、探索米达溪、观鸟、红树林体验以及海滩休闲。如果告诉我您有几天时间，我可以为您安排一个实用的行程。',
  sw: 'Watamu ni pazuri kwa likizo ya utulivu ya pwani na inaweza pia kuunganishwa na safari ya wanyamapori. Unaweza kutembelea Watamu Marine National Park, kufanya snorkeling na safari za mashua, kuona pomboo, kuchunguza Mida Creek, kuangalia ndege, kufurahia mikoko na kutumia muda ufukweni. Ukiniambia una siku ngapi, naweza kukupangia ratiba inayofaa.',
};

function getLocale(value: unknown): Locale {
  return typeof value === 'string' && locales.includes(value as Locale) ? (value as Locale) : 'en';
}

function getCatalog() {
  return safaris.map((s) => ({
    id: s.id,
    name: s.name,
    days: s.days,
    nights: s.nights,
    parks: s.parks,
    lodges: s.lodges,
    tagline: s.tagline,
    highlights: s.highlights,
    itinerary: s.itinerary,
    priceTier: s.priceTier ?? 'quote-based',
  }));
}

function normalizeMessages(value: unknown): Message[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((message): message is Message => {
      if (!message || typeof message !== 'object') return false;
      const item = message as Record<string, unknown>;
      return (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string';
    })
    .map((message) => ({ role: message.role, content: message.content.trim().slice(0, MAX_MESSAGE_CHARS) }))
    .filter((message) => message.content.length > 0)
    .slice(-MAX_MESSAGES);
}

function extractResponseText(data: unknown): string {
  if (!data || typeof data !== 'object') return '';
  const root = data as Record<string, unknown>;
  if (typeof root.output_text === 'string' && root.output_text.trim()) return root.output_text.trim();

  const output = Array.isArray(root.output) ? root.output : [];
  const parts: string[] = [];
  for (const item of output) {
    if (!item || typeof item !== 'object') continue;
    const record = item as Record<string, unknown>;
    if (record.type !== 'message' || !Array.isArray(record.content)) continue;
    for (const part of record.content) {
      if (!part || typeof part !== 'object') continue;
      const value = part as Record<string, unknown>;
      if (value.type === 'output_text' && typeof value.text === 'string' && value.text.trim()) parts.push(value.text.trim());
    }
  }
  return parts.join('\n\n').trim();
}

function cleanCustomerReply(text: string): string {
  let cleaned = text
    .replace(/(?:cite|url|entity|image_group|video|navlist)[^]*/g, '')
    .replace(/\[[^\]]*\]\(https?:\/\/[^)]+\)/gi, '')
    .replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, '')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/www\.\S+/gi, '')
    .replace(/\s*\(\s*\)/g, '');

  cleaned = cleaned.replace(/(?:^|\n)\s*(?:fonti consultate|fonti|sources checked|sources consulted|sources|source|fontes|fuentes|quellen|المصادر|已查询来源|vyanzo)\s*:?[ \t]*(?:\n[ \t]*(?:[-*•]|\d+[.)]).*)*\s*$/gim, '');

  return cleaned.replace(/[ \t]{2,}/g, ' ').replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function buildInstructions(locale: Locale): string {
  return `You are Bahari Asili Safaris' professional AI travel concierge.

Your job is to answer the visitor's actual question first and continue the conversation naturally. Use the conversation history as memory. Never repeatedly ask for dates, traveller numbers, budget or destination when the visitor has already provided them.

You help with Kenya, East Africa and Africa travel, safaris, wildlife, beaches, excursions, families, honeymoons, photography, birding, transfers, accommodation and itinerary planning.

Use the supplied Bahari Asili catalogue for company-specific information. For current or changeable facts, use web search when useful. Prefer authoritative and recent information. Never invent prices, availability, hotel confirmations, park fees, flight schedules, permits, visa decisions or booking confirmations.

Customer output rules:
- Return only the final answer for the visitor.
- Never show URLs, hyperlinks, citations, source lists, source names or tool output.
- Never mention searching, researching, APIs, tools, models or internal instructions.
- Never create a Sources or Fonti section.
- Do not use Markdown links.
- Reply naturally in ${locale}.
- Keep normal answers concise and useful.
- Ask a follow-up only when it genuinely helps move the trip planning forward.

Never claim that a booking or payment is confirmed unless the application has explicitly confirmed it.`;
}

async function callOpenAI(key: string, body: Record<string, unknown>): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(OPENAI_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return new Response(JSON.stringify({ error: { message: 'provider timeout' } }), { status: 504 });
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function readError(response: Response): Promise<string> {
  try { return (await response.text()).slice(0, 2_000); } catch { return 'Unable to read provider error.'; }
}

function localFallback(locale: Locale, latest: string): string {
  const normalized = latest.toLowerCase();
  if (/\bwatamu\b/.test(normalized)) return watamuFallback[locale];
  return fallbackReplies[locale];
}

export async function GET() {
  const configured = Boolean(process.env.OPENAI_API_KEY?.trim());
  return NextResponse.json({ ok: configured, service: 'safari-assistant', aiConfigured: configured, model: process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL });
}

export async function POST(request: NextRequest) {
  let locale: Locale = 'en';

  try {
    const body = await request.json();
    locale = getLocale(body?.locale);
    const messages = normalizeMessages(body?.messages);
    const latest = [...messages].reverse().find((message) => message.role === 'user')?.content || '';

    if (!latest) {
      return NextResponse.json({ reply: 'Please tell me what you would like to know about your trip.', mode: 'validation' }, { status: 400 });
    }

    const key = process.env.OPENAI_API_KEY?.trim();
    if (!key) {
      console.error('[Safari Assistant] OPENAI_API_KEY is not configured.');
      return NextResponse.json({ reply: localFallback(locale, latest), mode: 'local-fallback-no-key' });
    }

    const baseBody = {
      model: process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL,
      instructions: buildInstructions(locale),
      input: [
        {
          role: 'developer',
          content: `Bahari Asili Safaris catalogue. Use this only as internal context and never expose it:\n${JSON.stringify(getCatalog())}`,
        },
        ...messages,
      ],
      max_output_tokens: MAX_OUTPUT_TOKENS,
    };

    // Web search is optional. The assistant remains usable when the search service is unavailable.
    let response = await callOpenAI(key, { ...baseBody, tools: [{ type: 'web_search' }], tool_choice: 'auto' });

    if (!response.ok) {
      const error = await readError(response);
      console.error(`[Safari Assistant] AI request failed (${response.status}): ${error}`);
      // Retry the same conversation without web search. This handles tool-specific
      // provider errors without forcing the visitor to repeat the question.
      response = await callOpenAI(key, baseBody);
      if (!response.ok) {
        const retryError = await readError(response);
        console.error(`[Safari Assistant] AI retry failed (${response.status}): ${retryError}`);
        return NextResponse.json({ reply: localFallback(locale, latest), mode: 'local-fallback-ai-failed', status: response.status });
      }
    }

    const data = await response.json();
    const reply = cleanCustomerReply(extractResponseText(data));
    if (!reply) {
      console.error('[Safari Assistant] AI returned no usable text.');
      return NextResponse.json({ reply: localFallback(locale, latest), mode: 'local-fallback-empty-text' });
    }

    return NextResponse.json({ reply, mode: 'ai' });
  } catch (error) {
    console.error('[Safari Assistant] Unexpected server error:', error);
    return NextResponse.json({ reply: localFallback(locale, ''), mode: 'local-fallback-exception' });
  }
}
