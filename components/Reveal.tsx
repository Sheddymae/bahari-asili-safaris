'use client';

import { ReactNode } from 'react';
import { useScrollReveal, ScrollRevealOptions } from '@/hooks/useScrollReveal';

interface RevealProps extends ScrollRevealOptions {
  children: ReactNode;
  className?: string;
}

/**
 * Small composable for the site's restrained editorial motion system.
 * Prefer one reveal per meaningful content group rather than animating every
 * individual element on a page.
 */
export default function Reveal({ children, className, ...options }: RevealProps) {
  const ref = useScrollReveal<HTMLDivElement>(options);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
