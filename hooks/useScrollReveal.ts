'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Avoids the SSR warning for useLayoutEffect while still running before paint
// in the browser, which keeps elements from flashing visible-then-hidden.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface ScrollRevealOptions {
  /** Pixels the element travels upward while fading in. Default 32. */
  y?: number;
  /** Animation duration in seconds. Default 0.8. */
  duration?: number;
  /** Delay before the animation starts, in seconds. Default 0. */
  delay?: number;
  /** Gap between each child's animation when revealing a group. Default 0.12. */
  stagger?: number;
  /** ScrollTrigger "start" position. Default 'top 80%' (fires shortly before the element enters the viewport). */
  start?: string;
  /**
   * CSS selector for child elements to stagger-reveal individually, scoped to
   * the ref'd container (e.g. '[data-reveal-item]' or '.card'). Omit to
   * animate the container itself as a single element.
   */
  itemSelector?: string;
  /** Re-plays the animation every time the element re-enters the viewport. Default false (plays once). */
  repeat?: boolean;
}

/**
 * Attach the returned ref to a container. On scroll into view it fades and
 * slides the container in — or, if `itemSelector` is given, staggers each
 * matching child individually. Respects prefers-reduced-motion by skipping
 * the animation and leaving content at its natural, fully-visible state.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const {
      y = 32,
      duration = 0.8,
      delay = 0,
      stagger = 0.12,
      start = 'top 80%',
      itemSelector,
      repeat = false,
    } = optionsRef.current;

    const ctx = gsap.context(() => {
      const targets = itemSelector ? el.querySelectorAll(itemSelector) : el;

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: repeat ? 'play none none none' : 'play none none reverse',
            once: !repeat,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}