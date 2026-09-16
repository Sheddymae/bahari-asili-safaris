'use client';

import { useState } from 'react';
import { Phone, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const copy = {
  en: { button: 'Request a call back', title: 'We can call you', text: 'Just leave your name and phone number. Our team will call you back.', name: 'Your name', phone: 'Phone number', submit: 'Request call', sending: 'Sending…', done: 'Request received', doneText: 'Thank you. Our team will call you back.', close: 'Close', error: 'We could not send the request. Please call or WhatsApp us.' },
  it: { button: 'Richiedi una chiamata', title: 'Ti richiamiamo noi', text: 'Lascia solo nome e numero. Il nostro team ti richiamerà.', name: 'Nome', phone: 'Numero di telefono', submit: 'Richiedi chiamata', sending: 'Invio…', done: 'Richiesta ricevuta', doneText: 'Grazie. Ti richiameremo presto.', close: 'Chiudi', error: 'Non è stato possibile inviare la richiesta. Chiamaci o scrivici su WhatsApp.' },
  fr: { button: 'Demander un rappel', title: 'Nous pouvons vous appeler', text: 'Indiquez votre nom et votre numéro. Notre équipe vous rappellera.', name: 'Nom', phone: 'Numéro de téléphone', submit: 'Demander un appel', sending: 'Envoi…', done: 'Demande reçue', doneText: 'Merci. Notre équipe vous rappellera.', close: 'Fermer', error: 'Impossible d’envoyer la demande. Appelez-nous ou utilisez WhatsApp.' },
  es: { button: 'Solicitar llamada', title: 'Podemos llamarte', text: 'Déjanos tu nombre y teléfono. Nuestro equipo te llamará.', name: 'Nombre', phone: 'Teléfono', submit: 'Solicitar llamada', sending: 'Enviando…', done: 'Solicitud recibida', doneText: 'Gracias. Te llamaremos pronto.', close: 'Cerrar', error: 'No pudimos enviar la solicitud. Llámanos o usa WhatsApp.' },
  de: { button: 'Rückruf anfordern', title: 'Wir rufen Sie an', text: 'Nur Name und Telefonnummer. Unser Team ruft Sie zurück.', name: 'Name', phone: 'Telefonnummer', submit: 'Rückruf anfordern', sending: 'Senden…', done: 'Anfrage erhalten', doneText: 'Danke. Unser Team ruft Sie zurück.', close: 'Schließen', error: 'Die Anfrage konnte nicht gesendet werden. Rufen Sie uns an oder nutzen Sie WhatsApp.' },
  ar: { button: 'طلب اتصال', title: 'يمكننا الاتصال بك', text: 'اترك اسمك ورقم هاتفك فقط وسنتصل بك.', name: 'الاسم', phone: 'رقم الهاتف', submit: 'طلب الاتصال', sending: 'جارٍ الإرسال…', done: 'تم استلام الطلب', doneText: 'شكرًا لك. سنتصل بك قريبًا.', close: 'إغلاق', error: 'تعذر إرسال الطلب. اتصل بنا أو استخدم واتساب.' },
  zh: { button: '请求回电', title: '我们可以给您回电', text: '只需留下姓名和电话号码，我们会联系您。', name: '姓名', phone: '电话号码', submit: '请求回电', sending: '发送中…', done: '已收到请求', doneText: '谢谢，我们会尽快联系您。', close: '关闭', error: '无法发送请求。请致电或通过 WhatsApp 联系我们。' },
  sw: { button: 'Omba tupige simu', title: 'Tunaweza kukupigia', text: 'Acha jina na nambari yako ya simu. Tutakupigia.', name: 'Jina lako', phone: 'Nambari ya simu', submit: 'Omba simu', sending: 'Inatuma…', done: 'Ombi limepokelewa', doneText: 'Asante. Tutakupigia hivi karibuni.', close: 'Funga', error: 'Hatukuweza kutuma ombi. Tupigie au tutumie WhatsApp.' },
} as const;

interface CallbackRequestProps { inline?: boolean }

export default function CallbackRequest({ inline = false }: CallbackRequestProps) {
  const { locale } = useLanguage();
  const c = copy[locale as keyof typeof copy] || copy.en;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/callback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, locale }) });
      if (!res.ok) throw new Error('callback failed');
      setStatus('done');
    } catch { setStatus('error'); }
  };

  return (
    <>
      <button type="button" onClick={() => { setOpen(true); setStatus('idle'); }} className={inline ? 'font-inter text-sm text-muted-foreground hover:text-safari-400 transition-colors text-left' : 'fixed bottom-20 right-5 z-[9998] rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ocean-800 shadow-lg border border-border hover:shadow-xl transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-ocean-500'} aria-label={c.button}>
        {!inline && <Phone className="w-4 h-4" />}{c.button}
      </button>
      {open && <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        <button aria-label={c.close} className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
        <div role="dialog" aria-modal="true" className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl p-6">
          <button type="button" onClick={() => setOpen(false)} aria-label={c.close} className="absolute right-4 top-4 rounded-full p-2 hover:bg-sand-50"><X className="w-5 h-5" /></button>
          {status === 'done' ? <div className="py-8 text-center"><CheckCircle className="w-14 h-14 text-ocean-700 mx-auto mb-4" /><h2 className="font-poppins font-bold text-xl">{c.done}</h2><p className="text-muted-foreground mt-2">{c.doneText}</p><button type="button" onClick={() => setOpen(false)} className="mt-6 rounded-xl bg-ocean-700 text-white px-6 py-3 font-semibold">{c.close}</button></div> : <>
            <div className="pr-8"><h2 className="font-poppins font-bold text-xl">{c.title}</h2><p className="text-sm text-muted-foreground mt-2">{c.text}</p></div>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div><label className="block text-sm font-medium mb-1.5">{c.name}</label><input required value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:ring-2 focus:ring-ocean-200" /></div>
              <div><label className="block text-sm font-medium mb-1.5">{c.phone}</label><input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-xl border border-border px-4 py-3 outline-none focus:ring-2 focus:ring-ocean-200" /></div>
              {status === 'error' && <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="w-4 h-4 shrink-0" />{c.error}</div>}
              <button disabled={status === 'loading'} className="w-full rounded-xl bg-ocean-700 hover:bg-ocean-800 disabled:opacity-60 text-white py-3 font-semibold flex items-center justify-center gap-2">{status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}{status === 'loading' ? c.sending : c.submit}</button>
            </form>
          </>}
        </div>
      </div>}
    </>
  );
}
