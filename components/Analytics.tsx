'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function Analytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () => setEnabled(window.localStorage.getItem('bahari-cookie-consent') === 'analytics');
    check();
    window.addEventListener('bahari:cookie-consent', check);
    return () => window.removeEventListener('bahari:cookie-consent', check);
  }, []);

  if (!measurementId || !enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="bahari-google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${measurementId}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}

export function trackConversion(event: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function' && window.localStorage.getItem('bahari-cookie-consent') === 'analytics') {
    gtag('event', event, params);
  }
}
