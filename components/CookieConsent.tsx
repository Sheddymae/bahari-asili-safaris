'use client';

import { useEffect, useState } from 'react';

const COPY = {
  en: { title: 'Privacy & cookies', text: 'We use essential storage to remember your language and optional analytics to understand site usage. You can change your choice at any time.', accept: 'Accept analytics', reject: 'Essential only', privacy: 'Privacy policy' },
  it: { title: 'Privacy e cookie', text: 'Usiamo archiviazione essenziale per ricordare la lingua e analisi opzionali per capire l’uso del sito. Puoi cambiare scelta in qualsiasi momento.', accept: 'Accetta analisi', reject: 'Solo essenziali', privacy: 'Privacy' },
  fr: { title: 'Confidentialité et cookies', text: 'Nous utilisons le stockage essentiel pour mémoriser la langue et des analyses facultatives pour comprendre l’utilisation du site. Vous pouvez modifier votre choix à tout moment.', accept: 'Accepter les analyses', reject: 'Essentiels uniquement', privacy: 'Confidentialité' },
  es: { title: 'Privacidad y cookies', text: 'Usamos almacenamiento esencial para recordar tu idioma y análisis opcionales para comprender el uso del sitio. Puedes cambiar tu elección en cualquier momento.', accept: 'Aceptar analítica', reject: 'Solo esenciales', privacy: 'Privacidad' },
  de: { title: 'Datenschutz und Cookies', text: 'Wir verwenden notwendige Speicherung für Ihre Sprache und optionale Analysen zur Nutzung der Website. Sie können Ihre Auswahl jederzeit ändern.', accept: 'Analysen akzeptieren', reject: 'Nur notwendige', privacy: 'Datenschutz' },
  ar: { title: 'الخصوصية وملفات تعريف الارتباط', text: 'نستخدم التخزين الأساسي لتذكر لغتك وتحليلات اختيارية لفهم استخدام الموقع. يمكنك تغيير اختيارك في أي وقت.', accept: 'قبول التحليلات', reject: 'الأساسي فقط', privacy: 'الخصوصية' },
  zh: { title: '隐私与 Cookie', text: '我们使用必要存储来记住您的语言，并可选择使用分析来了解网站使用情况。您可以随时更改选择。', accept: '接受分析', reject: '仅必要存储', privacy: '隐私政策' },
  sw: { title: 'Faragha na vidakuzi', text: 'Tunatumia hifadhi muhimu kukumbuka lugha yako na uchanganuzi wa hiari kuelewa matumizi ya tovuti. Unaweza kubadilisha chaguo lako wakati wowote.', accept: 'Kubali uchanganuzi', reject: 'Muhimu pekee', privacy: 'Sera ya faragha' },
} as const;

type Locale = keyof typeof COPY;

export default function CookieConsent({ locale = 'en' }: { locale?: string }) {
  const [visible, setVisible] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');

  useEffect(() => {
    const saved = window.localStorage.getItem('bahari-cookie-consent');
    if (!saved) setVisible(true);
    const candidate = locale as Locale;
    if (candidate in COPY) setCurrentLocale(candidate);
  }, [locale]);

  if (!visible) return null;
  const copy = COPY[currentLocale];

  const choose = (analytics: boolean) => {
    window.localStorage.setItem('bahari-cookie-consent', analytics ? 'analytics' : 'essential');
    window.dispatchEvent(new CustomEvent('bahari:cookie-consent', { detail: { analytics } }));
    setVisible(false);
  };

  return (
    <div role="dialog" aria-modal="false" aria-labelledby="cookie-title" className="fixed inset-x-0 bottom-0 z-[200] p-3 sm:p-5">
      <div className="mx-auto max-w-5xl rounded-2xl border border-border bg-white/95 p-4 shadow-2xl backdrop-blur-md sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <h2 id="cookie-title" className="font-poppins font-bold text-base text-foreground">{copy.title}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{copy.text} <a href="/privacy" className="font-semibold underline underline-offset-2">{copy.privacy}</a></p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <button type="button" onClick={() => choose(false)} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600">{copy.reject}</button>
            <button type="button" onClick={() => choose(true)} className="rounded-xl bg-ocean-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ocean-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-600">{copy.accept}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
