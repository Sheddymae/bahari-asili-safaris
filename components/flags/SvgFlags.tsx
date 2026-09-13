/**
 * Crisp, hand-built vector flags for the language selector.
 * Each flag is drawn on a 3:2 canvas and clipped to a circle by its
 * wrapper, so proportions stay correct with no distortion.
 */
import type { SVGProps } from 'react';
import type { Locale } from '@/lib/i18n';

type FlagProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: '0 0 30 20',
  preserveAspectRatio: 'xMidYMid slice',
  xmlns: 'http://www.w3.org/2000/svg',
} as const;

export function FlagGB(props: FlagProps) {
  return (
    <svg {...base} {...props}>
      <rect width="30" height="20" fill="#00247d" />
      <path d="M0 0L30 20M30 0L0 20" stroke="#fff" strokeWidth="4" />
      <path d="M0 0L30 20M30 0L0 20" stroke="#cf142b" strokeWidth="1.6" />
      <path d="M15 0V20M0 10H30" stroke="#fff" strokeWidth="6.6" />
      <path d="M15 0V20M0 10H30" stroke="#cf142b" strokeWidth="4" />
    </svg>
  );
}

export function FlagIT(props: FlagProps) {
  return (
    <svg {...base} {...props}>
      <rect width="10" height="20" fill="#009246" />
      <rect x="10" width="10" height="20" fill="#fff" />
      <rect x="20" width="10" height="20" fill="#ce2b37" />
    </svg>
  );
}

export function FlagFR(props: FlagProps) {
  return (
    <svg {...base} {...props}>
      <rect width="10" height="20" fill="#0055a4" />
      <rect x="10" width="10" height="20" fill="#fff" />
      <rect x="20" width="10" height="20" fill="#ef4135" />
    </svg>
  );
}

export function FlagES(props: FlagProps) {
  return (
    <svg {...base} {...props}>
      <rect width="30" height="20" fill="#aa151b" />
      <rect y="5" width="30" height="10" fill="#f1bf00" />
    </svg>
  );
}

export function FlagDE(props: FlagProps) {
  return (
    <svg {...base} {...props}>
      <rect width="30" height="6.67" fill="#000" />
      <rect y="6.67" width="30" height="6.67" fill="#dd0000" />
      <rect y="13.33" width="30" height="6.67" fill="#ffce00" />
    </svg>
  );
}

export function FlagSA(props: FlagProps) {
  return (
    <svg {...base} {...props}>
      <rect width="30" height="20" fill="#006c35" />
      <rect x="6" y="9" width="18" height="2" rx="1" fill="#fff" />
      <rect x="6" y="9" width="12" height="2" rx="1" fill="#fff" opacity="0.001" />
      <path d="M8 13.5c3-1 11-1 14 0" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function FlagCN(props: FlagProps) {
  const star = (cx: number, cy: number, r: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return pts.join(' ');
  };
  return (
    <svg {...base} {...props}>
      <rect width="30" height="20" fill="#de2910" />
      <polygon points={star(6, 5, 2.4)} fill="#ffde00" />
      <polygon points={star(11.5, 2.2, 0.8)} fill="#ffde00" />
      <polygon points={star(13, 5.3, 0.8)} fill="#ffde00" />
      <polygon points={star(12.6, 8.4, 0.8)} fill="#ffde00" />
      <polygon points={star(10.3, 10.6, 0.8)} fill="#ffde00" />
    </svg>
  );
}

export function FlagKE(props: FlagProps) {
  return (
    <svg {...base} {...props}>
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="6" fill="#000" />
      <rect y="7" width="30" height="6" fill="#bb0000" />
      <rect y="14" width="30" height="6" fill="#006600" />
      <rect y="6" width="30" height="1" fill="#fff" />
      <rect y="13" width="30" height="1" fill="#fff" />
      <polygon points="15,7 19,10 17.3,15 12.7,15 11,10" fill="#bb0000" stroke="#fff" strokeWidth="0.4" />
      <polygon points="15,8.3 17.6,10.2 16.6,13.6 13.4,13.6 12.4,10.2" fill="#000" />
    </svg>
  );
}

export const FLAG_COMPONENTS: Record<Locale, (props: FlagProps) => JSX.Element> = {
  en: FlagGB,
  it: FlagIT,
  fr: FlagFR,
  es: FlagES,
  de: FlagDE,
  ar: FlagSA,
  zh: FlagCN,
  sw: FlagKE,
};
