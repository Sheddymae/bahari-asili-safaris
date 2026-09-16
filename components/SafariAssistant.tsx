'use client';

import { useEffect, useState } from 'react';
import { Bot, MessageCircle, Send, X, CalendarDays, FileText, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = { onRequestQuote?: () => void };
type Source = { title: string; url: string };
type Message = { role: 'user' | 'assistant'; content: string; sources?: Source[] };
type AssistantCopy = { title: string; welcome: string; placeholder: string; quote: string; whatsapp: string; close: string; open: string; thinking: string; send: string; note: string; suggestions: string[]; sources: string };
type SupportedLocale = 'en' | 'it' | 'fr' | 'es' | 'de' | 'ar' | 'zh' | 'sw';

const WHATSAPP_NUMBER = '254101923355';

const copy: Record<SupportedLocale, AssistantCopy> = {
  en: { title: 'Safari Assistant', welcome: 'Hello! I can help with Kenya and Africa travel, Bahari Asili safaris, destinations, wildlife, beaches, travel planning and current travel information. Ask me anything.', placeholder: 'Ask about safaris, destinations, travel or your trip...', quote: 'Request a tailored quotation', whatsapp: 'Need more information? Chat on WhatsApp', close: 'Close assistant', open: 'Open safari assistant', thinking: 'Checking and preparing an answer...', send: 'Send', note: 'I can research current information online when needed.', suggestions: ['Best time for Kenya safari', 'Kenya safari for a family', 'Masai Mara or Amboseli?', 'What can I do in Watamu?'], sources: 'Sources checked' },
  it: { title: 'Assistente Safari', welcome: 'Ciao! Posso aiutarti con viaggi in Kenya e Africa, safari Bahari Asili, destinazioni, fauna, spiagge, pianificazione e informazioni aggiornate. Chiedimi qualsiasi cosa.', placeholder: 'Chiedi di safari, destinazioni, viaggi o del tuo itinerario...', quote: 'Richiedi un preventivo personalizzato', whatsapp: 'Hai bisogno di altre informazioni? Scrivici su WhatsApp', close: "Chiudi l'assistente", open: 'Apri assistente safari', thinking: 'Sto controllando le informazioni...', send: 'Invia', note: 'Posso cercare online informazioni aggiornate quando necessario.', suggestions: ['Periodo migliore per un safari in Kenya', 'Safari in Kenya per una famiglia', 'Masai Mara o Amboseli?', 'Cosa posso fare a Watamu?'], sources: 'Fonti consultate' },
  fr: { title: 'Assistant Safari', welcome: 'Bonjour ! Je peux vous aider pour les voyages au Kenya et en Afrique, les safaris Bahari Asili, les destinations, la faune, les plages, la planification et les informations actuelles. Posez-moi vos questions.', placeholder: 'Posez une question sur les safaris, destinations ou voyages...', quote: 'Demander un devis personnalisé', whatsapp: "Besoin de plus d'informations ? Contactez-nous sur WhatsApp", close: "Fermer l'assistant", open: "Ouvrir l'assistant safari", thinking: 'Je vérifie les informations...', send: 'Envoyer', note: 'Je peux rechercher en ligne les informations actuelles si nécessaire.', suggestions: ['Meilleure période pour un safari au Kenya', 'Safari au Kenya en famille', 'Masai Mara ou Amboseli ?', 'Que faire à Watamu ?'], sources: 'Sources consultées' },
  es: { title: 'Asistente de Safari', welcome: '¡Hola! Puedo ayudarte con viajes por Kenia y África, safaris de Bahari Asili, destinos, fauna, playas, planificación e información actualizada. Pregúntame lo que quieras.', placeholder: 'Pregunta sobre safaris, destinos, viajes o tu itinerario...', quote: 'Solicitar un presupuesto personalizado', whatsapp: '¿Necesitas más información? Escríbenos por WhatsApp', close: 'Cerrar asistente', open: 'Abrir asistente de safari', thinking: 'Estoy comprobando la información...', send: 'Enviar', note: 'Puedo buscar información actualizada en línea cuando sea necesario.', suggestions: ['Mejor época para un safari en Kenia', 'Safari en Kenia para una familia', '¿Masai Mara o Amboseli?', '¿Qué puedo hacer en Watamu?'], sources: 'Fuentes consultadas' },
  de: { title: 'Safari-Assistent', welcome: 'Hallo! Ich helfe dir bei Reisen in Kenia und Afrika, Bahari Asili Safaris, Reisezielen, Wildtieren, Stränden, Reiseplanung und aktuellen Informationen. Frag mich alles.', placeholder: 'Frage zu Safaris, Reisezielen, Reisen oder deiner Reise...', quote: 'Individuelles Angebot anfragen', whatsapp: 'Weitere Informationen? Über WhatsApp chatten', close: 'Assistent schließen', open: 'Safari-Assistent öffnen', thinking: 'Ich prüfe die Informationen...', send: 'Senden', note: 'Bei Bedarf kann ich aktuelle Informationen online recherchieren.', suggestions: ['Beste Reisezeit für eine Kenia-Safari', 'Kenia-Safari für eine Familie', 'Masai Mara oder Amboseli?', 'Was kann ich in Watamu machen?'], sources: 'Quellen geprüft' },
  ar: { title: 'مساعد السفاري', welcome: 'مرحباً! يمكنني مساعدتك في السفر إلى كينيا وأفريقيا، رحلات السفاري من Bahari Asili، الوجهات والحياة البرية والشواطئ والتخطيط ومعلومات السفر الحالية. اسألني ما تريد.', placeholder: 'اسأل عن السفاري أو الوجهات أو السفر أو رحلتك...', quote: 'طلب عرض سعر مخصص', whatsapp: 'تحتاج إلى مزيد من المعلومات؟ تواصل معنا عبر واتساب', close: 'إغلاق المساعد', open: 'فتح مساعد السفاري', thinking: 'أتحقق من المعلومات وأعد الإجابة...', send: 'إرسال', note: 'يمكنني البحث عبر الإنترنت عن المعلومات الحالية عند الحاجة.', suggestions: ['أفضل وقت لرحلة سفاري في كينيا', 'سفاري في كينيا للعائلة', 'ماساي مارا أم أمبوسيلي؟', 'ماذا يمكنني أن أفعل في واتامو؟'], sources: 'المصادر التي تم التحقق منها' },
  zh: { title: '野生动物之旅助手', welcome: '您好！我可以帮助您了解肯尼亚和非洲旅行、Bahari Asili 野生动物之旅、目的地、野生动物、海滩、行程规划和最新旅行信息。您可以问我任何问题。', placeholder: '询问野生动物之旅、目的地、旅行或行程...', quote: '申请定制报价', whatsapp: '需要更多信息？通过 WhatsApp 联系我们', close: '关闭助手', open: '打开旅行助手', thinking: '正在检查信息并准备答案...', send: '发送', note: '需要时我可以在线搜索最新信息。', suggestions: ['肯尼亚野生动物之旅最佳时间', '适合家庭的肯尼亚Safari', '马赛马拉还是安博塞利？', '瓦塔穆有哪些活动？'], sources: '已查询来源' },
  sw: { title: 'Msaidizi wa Safari', welcome: 'Habari! Naweza kukusaidia kuhusu safari za Kenya na Afrika, safari za Bahari Asili, maeneo, wanyamapori, fukwe, mipango ya safari na taarifa za sasa. Uliza chochote.', placeholder: 'Uliza kuhusu safari, maeneo, usafiri au mipango yako...', quote: 'Omba bei maalum ya safari', whatsapp: 'Unahitaji maelezo zaidi? Zungumza nasi WhatsApp', close: 'Funga msaidizi', open: 'Fungua msaidizi wa safari', thinking: 'Ninakagua taarifa na kuandaa jibu...', send: 'Tuma', note: 'Naweza kutafuta taarifa za sasa mtandaoni inapohitajika.', suggestions: ['Wakati bora wa safari Kenya', 'Safari Kenya kwa familia', 'Masai Mara au Amboseli?', 'Ninaweza kufanya nini Watamu?'], sources: 'Vyanzo vilivyoangaliwa' },
};

const localeSet = new Set<SupportedLocale>(Object.keys(copy) as SupportedLocale[]);

export default function SafariAssistant({ onRequestQuote }: Props) {
  const { locale } = useLanguage();
  const activeLocale: SupportedLocale = localeSet.has(locale as SupportedLocale) ? (locale as SupportedLocale) : 'en';
  const active = copy[activeLocale];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (open && messages.length === 0) setMessages([{ role: 'assistant', content: active.welcome }]);
  }, [open, messages.length, active.welcome]);

  async function sendText(text: string) {
    const value = text.trim();
    if (!value || loading) return;
    const next = [...messages, { role: 'user' as const, content: value }];
    setMessages(next); setInput(''); setLoading(true);
    try {
      const res = await fetch('/api/safari-assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale: activeLocale, messages: next }) });
      const data = await res.json();
      setMessages((current) => [...current, { role: 'assistant', content: data.reply || active.welcome, sources: Array.isArray(data.sources) ? data.sources : [] }]);
    } catch {
      setMessages((current) => [...current, { role: 'assistant', content: active.welcome }]);
    } finally { setLoading(false); }
  }

  function send() { void sendText(input); }

  const whatsappMessage = encodeURIComponent('Hello Bahari Asili, I need more information about a safari.');
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  return (
    <>
      {!open && (
        <div className="fixed bottom-5 right-5 z-[9999] flex items-end justify-end pointer-events-none">
          <button type="button" onClick={() => setOpen(true)} aria-label={active.open} title={active.title} className="group pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full bg-ocean-700 text-white shadow-2xl ring-2 ring-white transition-all duration-200 hover:scale-110 hover:bg-ocean-800 hover:shadow-ocean-900/40 focus:outline-none focus:ring-4 focus:ring-ocean-300 sm:h-16 sm:w-16">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/10 sm:h-10 sm:w-10"><Bot className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" /><span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-ocean-700" aria-hidden="true" /></span>
            <span className="pointer-events-none absolute right-[calc(100%+0.75rem)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-xl opacity-0 translate-x-2 transition-all duration-200 group-hover:block group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:block group-focus-visible:translate-x-0 group-focus-visible:opacity-100">{active.title}</span>
          </button>
        </div>
      )}
      {open && (
        <div className="fixed bottom-5 right-5 z-[9999] flex w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-2xl" role="dialog" aria-label={active.title}>
          <div className="flex items-center justify-between bg-ocean-800 px-4 py-3 text-white"><div className="flex items-center gap-2"><Bot className="h-5 w-5" /><span className="font-semibold">{active.title}</span></div><button type="button" onClick={() => setOpen(false)} aria-label={active.close} className="rounded-full p-1 hover:bg-white/10"><X className="h-5 w-5" /></button></div>
          <div className="max-h-[55vh] min-h-[300px] space-y-3 overflow-y-auto bg-sand-50 p-3" aria-live="polite">
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pb-1">
                {active.suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => void sendText(suggestion)} className="rounded-full border border-ocean-200 bg-white px-3 py-1.5 text-xs font-medium text-ocean-800 shadow-sm transition hover:bg-ocean-50 focus:outline-none focus:ring-2 focus:ring-ocean-300">{suggestion}</button>)}
              </div>
            )}
            {messages.map((m, i) => <div key={i} className={`${m.role === 'user' ? 'ml-auto' : ''} max-w-[92%]`}><div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed ${m.role === 'user' ? 'bg-ocean-700 text-white' : 'bg-white text-foreground shadow-sm'}`}>{m.content}</div>{m.role === 'assistant' && m.sources && m.sources.length > 0 && <div className="mt-1 flex flex-wrap gap-1.5"><span className="w-full text-[10px] font-semibold text-muted-foreground">{active.sources}</span>{m.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-1 rounded-full border border-sand-200 bg-white px-2 py-1 text-[10px] text-ocean-800 hover:bg-ocean-50"><ExternalLink className="h-3 w-3 shrink-0" /><span className="truncate max-w-[240px]">{source.title}</span></a>)}</div>}</div>)}
            {loading && <div className="w-fit rounded-2xl bg-white px-3 py-2 text-sm text-muted-foreground shadow-sm">{active.thinking}</div>}
          </div>
          <div className="border-t border-sand-200 bg-white p-3">
            <button type="button" onClick={onRequestQuote} className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-ocean-200 bg-ocean-50 px-3 py-2 text-xs font-semibold text-ocean-800 hover:bg-ocean-100"><FileText className="h-4 w-4" />{active.quote}</button>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2">{active.whatsapp}</a>
            <div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder={active.placeholder} aria-label={active.placeholder} className="min-w-0 flex-1 rounded-xl border border-sand-300 px-3 py-2 text-sm outline-none focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500" /><button type="button" onClick={send} disabled={!input.trim() || loading} aria-label={active.send} className="rounded-xl bg-ocean-700 px-3 text-white disabled:opacity-40"><Send className="h-4 w-4" /></button></div>
            <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground"><CalendarDays className="h-3 w-3" /> {active.note}</div>
          </div>
        </div>
      )}
    </>
  );
}
