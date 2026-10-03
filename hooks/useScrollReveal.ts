'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface ScrollRevealOptions {
  /** Pixels the element travels upward while fading in. Default 24. */
  y?: number;
  /** Animation duration in seconds. Default 0.72. */
  duration?: number;
  /** Delay before the animation starts, in seconds. Default 0. */
  delay?: number;
  /** Gap between each child's animation when revealing a group. Default 0.1. */
  stagger?: number;
  /** ScrollTrigger "start" position. Default 'top 84%'. */
  start?: string;
  /** CSS selector for children to stagger individually. */
  itemSelector?: string;
  /** Replays when the element re-enters the viewport. Default false. */
  repeat?: boolean;
}

/**
 * A restrained editorial reveal: opacity + short vertical movement.
 * It intentionally plays once by default so the page does not feel animated
 * on every scroll. Reduced-motion users receive the natural static layout.
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
      y = 24,
      duration = 0.72,
      delay = 0,
      stagger = 0.1,
      start = 'top 84%',
      itemSelector,
      repeat = false,
    } = optionsRef.current;

    const ctx = gsap.context(() => {
      const targets = itemSelector
        ? Array.from(el.querySelectorAll<HTMLElement>(itemSelector))
        : [el];

      if (!targets.length) return;

      gsap.set(targets, { opacity: 0, y });

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        stagger,
        ease: 'power2.out',
        overwrite: 'auto',
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: repeat ? 'play none none reset' : 'play none none none',
          once: !repeat,
          invalidateOnRefresh: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
