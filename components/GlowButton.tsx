'use client';

import type { ButtonHTMLAttributes } from 'react';

export default function GlowButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`glow-button ${className}`} />;
}
