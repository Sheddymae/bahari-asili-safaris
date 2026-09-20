'use client';

import { useEffect, useRef } from 'react';
import { Clock3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function InactivityWarningModal({ onStaySignedIn }: { onStaySignedIn: () => void }) {
  const { t } = useLanguage();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();
    const previous = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(document.querySelectorAll<HTMLElement>('[role="alertdialog"] button, [role="alertdialog"] a, [role="alertdialog"] input, [role="alertdialog"] [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus?.();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="alertdialog" aria-modal="true" aria-labelledby="inactivity-title" aria-describedby="inactivity-description" aria-live="assertive">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
          <Clock3 className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 id="inactivity-title" className="text-center text-xl font-bold text-slate-900">{t.authSession.inactivityTitle}</h2>
        <p id="inactivity-description" className="mt-2 text-center text-sm leading-6 text-slate-600">{t.authSession.inactivityWarning}</p>
        <button ref={buttonRef} type="button" onClick={onStaySignedIn} className="mt-6 w-full rounded-xl bg-ocean-700 px-5 py-3 font-semibold text-white hover:bg-ocean-800 focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2">
          {t.authSession.staySignedIn}
        </button>
      </div>
    </div>
  );
}
