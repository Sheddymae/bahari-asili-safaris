'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { heroVideoConfig, getVideoSourceForViewport, prefersReducedMotion } from '@/lib/video-config';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CinematicHeroVideoProps {
  onReady?: () => void;
  children?: React.ReactNode;
}

export default function CinematicHeroVideo({ onReady, children }: CinematicHeroVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasReducedMotion, setHasReducedMotion] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    const reduced = prefersReducedMotion();
    setHasReducedMotion(reduced);
    setVideoSrc(getVideoSourceForViewport(typeof window !== 'undefined' ? window.innerWidth : 1024));
  }, []);

  useEffect(() => {
    if (!videoRef.current || hasReducedMotion || !videoSrc) return;
    const promise = videoRef.current.play();
    promise?.catch(() => {});
  }, [videoSrc, hasReducedMotion]);

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

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    onReady?.();
  };

  const handleVideoError = () => {
    console.error('[hero] Video failed to load; keeping poster fallback.');
  };

  if (hasReducedMotion) {
    return (
      <section id="home" ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-[var(--brand-text)]">
        <Image src={heroVideoConfig.poster} alt="Bahari Asili Safaris — Kenya safari and coastal experiences" fill priority fetchPriority="high" quality={75} sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(31,41,55,.18)] via-[rgba(31,41,55,.42)] to-[rgba(31,41,55,.76)]" />
        {children}
      </section>
    );
  }

  return (
    <section id="home" ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-[var(--brand-text)]">
      <div className="absolute inset-0 h-full w-full">
        <video ref={videoRef} src={videoSrc} poster={heroVideoConfig.poster} onCanPlay={handleVideoLoad} onError={handleVideoError} autoPlay muted playsInline preload="metadata" className="h-full w-full select-none object-cover object-center" aria-label="Bahari Asili Safaris Kenya" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(31,41,55,.18)] via-[rgba(31,41,55,.42)] to-[rgba(31,41,55,.76)]" />
      {!videoLoaded && <Image src={heroVideoConfig.poster} alt="" fill priority fetchPriority="high" quality={75} sizes="100vw" className="absolute inset-0 object-cover object-center" />}
      {children}
    </section>
  );
}
