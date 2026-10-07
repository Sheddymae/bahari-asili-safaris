'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { heroVideoConfig, getVideoSourceForViewport, prefersReducedMotion } from '@/lib/video-config';

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

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    onReady?.();
  };

  const handleVideoError = () => {
    console.error('[hero] Video failed to load; keeping poster fallback.');
  };

  if (hasReducedMotion) {
    return (
      <section id="home" ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-slate-900">
        <Image src={heroVideoConfig.poster} alt="Bahari Asili Safaris — Kenya safari and coastal experiences" fill priority fetchPriority="high" quality={75} sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        {children}
      </section>
    );
  }

  return (
    <section id="home" ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-slate-900">
      <div className="absolute inset-0 h-full w-full">
        <video
          ref={videoRef}
          src={videoSrc}
          poster={heroVideoConfig.poster}
          onCanPlay={handleVideoLoad}
          onError={handleVideoError}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full select-none object-cover object-center"
          aria-label="Bahari Asili Safaris Kenya"
        />
      </div>
      <div className="absolute inset-0 bg-black/40" />
      {!videoLoaded && (
        <Image
          src={heroVideoConfig.poster}
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={75}
          sizes="100vw"
          className="absolute inset-0 object-cover object-center"
        />
      )}
      {children}
    </section>
  );
}