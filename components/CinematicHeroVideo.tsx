'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { prefersReducedMotion } from '@/lib/video-config';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CinematicHeroVideoProps {
  onReady?: () => void;
  children?: React.ReactNode;
}

export default function CinematicHeroVideo({ onReady, children }: CinematicHeroVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasReducedMotion, setHasReducedMotion] = useState(false);


  useEffect(() => {
    const reduced = prefersReducedMotion();
    setHasReducedMotion(reduced);

  }, []);

  useEffect(() => {
    if (hasReducedMotion || !containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { yPercent: 0 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [hasReducedMotion]);

  return (
    <section id="home" ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-[var(--brand-text)]">
      <div className="absolute inset-0 h-full w-full">
        <Image
          src="/images/safaris/safari-4day-masai-mara.jpg"
          alt="Savannah landscape in the Maasai Mara, Kenya"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="h-full w-full select-none object-cover object-center"
          onLoad={() => onReady?.()}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(16,34,43,.12)] via-[rgba(16,34,43,.38)] to-[rgba(16,34,43,.82)]" />
      {children}
    </section>
  );
}
