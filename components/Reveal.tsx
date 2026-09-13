'use client';

import { ReactNode } from 'react';
import { useScrollReveal, ScrollRevealOptions } from '@/hooks/useScrollReveal';

interface RevealProps extends ScrollRevealOptions {
  children: ReactNode;
  className?: string;
}

/**
 * Fades and slides its children in as they scroll into view.
 * For a single element or block — for staggering a grid of cards, use
 * `useScrollReveal` directly with `itemSelector` on the grid container instead.
 *
 * Usage:
 *   <Reveal><h2>Heading</h2></Reveal>
 *   <Reveal delay={0.1} y={16}><p>Subtext</p></Reveal>
 */
export default function Reveal({ children, className, ...options }: RevealProps) {
  const ref = useScrollReveal<HTMLDivElement>(options);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}