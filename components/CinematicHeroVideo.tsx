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

  // Keep the source and motion preference in sync when a device rotates,
  // the viewport crosses the mobile breakpoint, or accessibility settings change.
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreferences = () => {
      setHasReducedMotion(motionQuery.matches || prefersReducedMotion());
      setVideoSrc(getVideoSourceForViewport(window.innerWidth));
    };

    updatePreferences();
    window.addEventListener('resize', updatePreferences, { passive: true });
    motionQuery.addEventListener?.('change', updatePreferences);

    return () => {
      window.removeEventListener('resize', updatePreferences);
      motionQuery.removeEventListener?.('change', updatePreferences);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hasReducedMotion || !videoSrc) {
      video.pause();
      return;
    }

    // Autoplay is intentionally muted and inline; browsers may still reject it.
    // The poster remains visible in that case, so the hero never renders blank.
    const playRequest = video.play();
    playRequest?.catch(() => setVideoLoaded(false));
  }, [videoSrc, hasReducedMotion]);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    onReady?.();
  };

  const handleVideoError = () => {
    setVideoLoaded(false);
    console.warn('[hero] Video unavailable; showing the static hero poster.');
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen w-full isolate overflow-hidden bg-slate-950"
    >
      <Image
        src={heroVideoConfig.poster}
        alt="Bahari Asili Safaris — Kenya safari and coastal experiences"
        fill
        priority
        fetchPriority="high"
        quality={80}
        sizes="100vw"
        className={'absolute inset-0 z-0 object-cover object-center transition-opacity duration-700 ' + (videoLoaded && !hasReducedMotion ? 'opacity-0' : 'opacity-100')}
      />

      {!hasReducedMotion && videoSrc && (
        <video
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
          poster={heroVideoConfig.poster}
          onLoadedData={handleVideoLoad}
          onCanPlay={handleVideoLoad}
          onError={handleVideoError}
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 z-0 h-full w-full select-none object-cover object-center"
        />
      )}

      {/* Layered overlays preserve legible copy across bright skies and wildlife footage. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/65 via-black/35 to-black/70" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.34)_100%)]" />

      <div className="relative z-20 min-h-screen">
        {children}
      </div>
    </section>
  );
}
