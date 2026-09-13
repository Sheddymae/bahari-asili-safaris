'use client';

import type { CSSProperties } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface SocialLink {
  key: string;
  label: string;
  href: string;
  brand: string; // hex used for the hover-fill background
  icon: JSX.Element;
}

const ICON_PROPS = { viewBox: '0 0 24 24', fill: 'currentColor', className: 'w-[18px] h-[18px] shrink-0' };

const SOCIALS: SocialLink[] = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/254101923355',
    brand: '#25D366',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.553 4.113 1.523 5.845L0 24l6.335-1.652A11.937 11.937 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.868 0-3.706-.502-5.312-1.454l-.381-.226-3.94 1.027 1.05-3.844-.248-.396A9.72 9.72 0 012.25 12C2.25 6.624 6.624 2.25 12 2.25S21.75 6.624 21.75 12 17.376 21.75 12 21.75z" />
      </svg>
    ),
  },
  {
    key: 'instagram',
    label: 'Instagram',
    href: 'https://instagram.com/bahariasilisafaris',
    brand: '#E1306C',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 01-1.38-.9 3.72 3.72 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56-.79.31-1.46.72-2.13 1.38A5.88 5.88 0 00.63 4.14c-.3.76-.5 1.63-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.88 5.88 0 002.13-1.38 5.88 5.88 0 001.38-2.13c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.88 5.88 0 00-1.38-2.13A5.88 5.88 0 0019.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0z" />
        <path d="M12 5.84A6.16 6.16 0 1012 18.16 6.16 6.16 0 0012 5.84zM12 16a4 4 0 110-8 4 4 0 010 8z" />
        <circle cx="18.41" cy="5.6" r="1.44" />
      </svg>
    ),
  },
  {
    key: 'facebook',
    label: 'Facebook',
    href: 'https://facebook.com/bahariasilisafaris',
    brand: '#1877F2',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M9.1 23.69v-7.98H6.63v-3.67H9.1V10.4c0-4.08 1.85-5.97 5.86-5.97.4 0 .95.04 1.47.1.4.05.75.11 1.14.19v3.33a8.24 8.24 0 00-.65-.04 26 26 0 00-.73-.01c-.71 0-1.26.1-1.68.31-.28.15-.5.36-.68.62-.26.42-.37.99-.37 1.75v1.3h3.92l-.39 2.1-.29 1.56H14.3v8.25a12 12 0 005.7-21.5A12 12 0 002 5.86 12 12 0 009.1 23.69z" />
      </svg>
    ),
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    href: 'https://tiktok.com/@bahariasilisafaris',
    brand: '#000000',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M16.6 5.82a4.28 4.28 0 01-3.14-2.1 4.85 4.85 0 01-.61-1.72h-3.26v13.66c0 1.36-1.1 2.46-2.46 2.46a2.46 2.46 0 01-1.24-4.59 2.46 2.46 0 011.7-.24V9.94a5.8 5.8 0 00-5.2 5.77 5.8 5.8 0 0011.6 0V9.05a7.5 7.5 0 004.11 1.22V6.9a4.85 4.85 0 01-1.5-.24z" />
      </svg>
    ),
  },
  {
    key: 'youtube',
    label: 'YouTube',
    href: 'https://youtube.com/@bahariasilisafaris',
    brand: '#FF0000',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 00.5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 002.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 002.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
      </svg>
    ),
  },
];

interface SocialButtonsProps {
  /** 'dark' for use on the dark footer background (default), 'light' for use on white/cream sections. */
  variant?: 'dark' | 'light';
  className?: string;
}

export default function SocialButtons({ variant = 'dark', className = '' }: SocialButtonsProps) {
  const ref = useScrollReveal<HTMLDivElement>({ itemSelector: '[data-reveal-item]', y: 12, stagger: 0.08 });

  const base =
    variant === 'dark'
      ? 'bg-white/10 text-white'
      : 'bg-muted text-foreground';

  return (
    <div ref={ref} className={`flex items-center gap-3 ${className}`}>
      {SOCIALS.map((s) => (
        <a
          key={s.key}
          data-reveal-item
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          style={{ '--brand': s.brand } as CSSProperties}
          className={`group relative flex h-11 items-center overflow-hidden rounded-full pl-[11px] pr-[11px] transition-all duration-300 ease-out hover:pr-5 hover:text-white hover:shadow-md hover:scale-105 active:scale-95 ${base}`}
        >
          <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background-color:var(--brand)]" />
          <span className="relative z-10 flex items-center">
            {s.icon}
            <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap font-inter text-sm font-semibold opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:max-w-[120px] group-hover:opacity-100">
              {s.label}
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}