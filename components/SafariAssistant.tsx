'use client';

import { useEffect, useState } from 'react';
import { Bot, MessageCircle, Send, X, CalendarDays, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = { onRequestQuote?: () => void };
type Message = { role: 'user' | 'assistant'; content: string };

const copy = {
  en: { title: 'Safari Assistant', welcome: 'Hello! I can help you plan a Kenya safari. Tell me where you would like to go, when you are travelling and how many people are joining.', placeholder: 'Ask about safaris, destinations or your trip...', quote: 'Request a tailored quotation', close: 'Close assistant', open: 'Open safari assistant', thinking: 'Thinking...' },
  it: { title: 'Assistente Safari', welcome: 'Ciao! Posso aiutarti a pianificare un safari in Kenya. Dimmi dove vuoi andare, quando viaggi e quante persone siete.', placeholder: 'Chiedi di safari, destinazioni o del tuo viaggio...', quote: 'Richiedi un preventivo personalizzato', close: 'Chiudi assistente', open: 'Apri assistente safari', thinking: 'Sto pensando...' },
  fr: { title: 'Assistant Safari', welcome: 'Bonjour ! Je peux vous aider à planifier un safari au Kenya. Dites-moi où vous souhaitez aller, quand vous voyagez et combien vous êtes.', placeholder: 'Posez une question sur les safaris ou votre voyage...', quote: 'Demander un devis personnalisé', close: "Fermer l'assistant", open: "Ouvrir l'assistant safari", thinking: 'Réflexion...' },
  es: { title: 'Asistente de Safari', welcome: '¡Hola! Puedo ayudarte a planificar un safari en Kenia. Dime dónde quieres ir, cuándo viajas y cuántas personas sois.', placeholder: 'Pregunta sobre safaris, destinos o tu viaje...', quote: 'Solicitar un presupuesto personalizado', close: 'Cerrar asistente', open: 'Abrir asistente de safari', thinking: 'Pensando...' },
  de: { title: 'Safari-Assistent', welcome: 'Hallo! Ich kann dir bei der Planung einer Kenia-Safari helfen. Sag mir, wohin du reisen möchtest, wann und mit wie vielen Personen.', placeholder: 'Frage zu Safaris, Reisezielen oder deiner Reise...', quote: 'Individuelles Angebot anfragen', close: 'Assistent schließen', open: 'Safari-Assistent öffnen', thinking: 'Denke nach...' },
  ar: { title: 'مساعد السفاري', welcome: 'مرحباً! يمكنني مساعدتك في التخطيط لرحلة سفاري في كينيا. أخبرني بالوجهة والتاريخ وعدد المسافرين.', placeholder: 'اسأل عن رحلات السفاري أو وجهتك...', quote: 'طلب عرض سعر مخصص', close: 'إغلاق المساعد', open: 'فتح مساعد السفاري', thinking: 'جارٍ التفكير...' },
  zh: { title: '野生动物之旅助手', welcome: '您好！我可以帮助您规划肯尼亚野生动物之旅。请告诉我目的地、出行日期和人数。', placeholder: '询问野生动物之旅、目的地或行程...', quote: '申请定制报价', close: '关闭助手', open: '打开旅行助手', thinking: '思考中...' },
  sw: { title: 'Msaidizi wa Safari', welcome: 'Habari! Naweza kukusaidia kupanga safari ya Kenya. Niambie unataka kwenda wapi, unasafiri lini na mtakuwa watu wangapi.', placeholder: 'Uliza kuhusu safari, maeneo au mipango yako...', quote: 'Omba bei maalum ya safari', close: 'Funga msaidizi', open: 'Fungua msaidizi wa safari', thinking: 'Nafikiria...' },
} as const;

export default function SafariAssistant({ onRequestQuote }: Props) {
  const { locale } = useLanguage();
  const active = (copy as Record<string, typeof copy.en>)[locale] || copy.en;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (open && messages.length === 0) setMessages([{ role: 'assistant', content: active.welcome }]);
  }, [open, messages.length, active.welcome]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next); setInput(''); setLoading(true);
    try {
      const res = await fetch('/api/safari-assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale, messages: next }) });
      const data = await res.json();
      setMessages((current) => [...current, { role: 'assistant', content: data.reply || active.welcome }]);
    } catch {
      setMessages((current) => [...current, { role: 'assistant', content: active.welcome }]);
    } finally { setLoading(false); }
  }

  return (
    <>
      {!open && <button type="button" onClick={() => setOpen(true)} aria-label={active.open} className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-ocean-700 px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:scale-[1.02] hover:bg-ocean-800 focus:outline-none focus:ring-2 focus:ring-ocean-300"><MessageCircle className="h-5 w-5" /> <span className="hidden sm:inline">{active.title}</span></button>}
      {open && <div className="fixed bottom-4 right-4 z-[60] flex w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-sand-200 bg-white shadow-2xl" role="dialog" aria-label={active.title}>
        <div className="flex items-center justify-between bg-ocean-800 px-4 py-3 text-white"><div className="flex items-center gap-2"><Bot className="h-5 w-5" /><span className="font-semibold">{active.title}</span></div><button onClick={() => setOpen(false)} aria-label={active.close} className="rounded-full p-1 hover:bg-white/10"><X className="h-5 w-5" /></button></div>
        <div className="max-h-[52vh] min-h-[260px] space-y-3 overflow-y-auto bg-sand-50 p-3" aria-live="polite">
          {messages.map((m, i) => <div key={i} className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${m.role === 'user' ? 'ml-auto bg-ocean-700 text-white' : 'bg-white text-foreground shadow-sm'}`}>{m.content}</div>)}
          {loading && <div className="w-fit rounded-2xl bg-white px-3 py-2 text-sm text-muted-foreground shadow-sm">{active.thinking}</div>}
        </div>
        <div className="border-t border-sand-200 bg-white p-3">
          <button type="button" onClick={onRequestQuote} className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-ocean-200 bg-ocean-50 px-3 py-2 text-xs font-semibold text-ocean-800 hover:bg-ocean-100"><FileText className="h-4 w-4" />{active.quote}</button>
          <div className="flex gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void send(); }} placeholder={active.placeholder} aria-label={active.placeholder} className="min-w-0 flex-1 rounded-xl border border-sand-300 px-3 py-2 text-sm outline-none focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500" /><button type="button" onClick={() => void send()} disabled={!input.trim() || loading} aria-label="Send" className="rounded-xl bg-ocean-700 px-3 text-white disabled:opacity-40"><Send className="h-4 w-4" /></button></div>
          <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground"><CalendarDays className="h-3 w-3" /> {locale === 'en' ? 'Prices and availability are confirmed by the safari team.' : 'Trip details and availability are confirmed by the safari team.'}</div>
        </div>
      </div>}
    </>
  );
}
