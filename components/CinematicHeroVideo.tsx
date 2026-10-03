'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { heroVideoConfig, getVideoSourceForViewport, prefersReducedMotion } from '@/lib/video-config';

interface CinematicHeroVideoProps {
  onReady?: () => void;
  children?: React.ReactNode;
}

export default function CinematicHeroVideo({ onReady, children }: CinematicHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasReducedMotion, setHasReducedMotion] = useState(false);
  const [videoSrc, setVideoSrc] = useState('');

  useEffect(() => {
    const reduced = prefersReducedMotion();
    setHasReducedMotion(reduced);
    setVideoSrc(getVideoSourceForViewport(window.innerWidth));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || hasReducedMotion || !videoSrc) return;

    video.load();
    const play = async () => {
      try {
        await video.play();
      } catch {
        // Autoplay can be blocked by the browser; the poster remains visible.
      }
    };
    void play();
  }, [videoSrc, hasReducedMotion]);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
    onReady?.();
  };

  const handleVideoError = () => {
    console.error('[hero] Video failed to load; keeping poster fallback.');
  };

  const mediaOverlay = (
    <>
      <div className="absolute inset-0 bg-ocean-deep/20" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,25,29,.58)_0%,rgba(4,25,29,.12)_34%,rgba(4,25,29,.18)_62%,rgba(4,25,29,.78)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,transparent_0%,rgba(4,25,29,.08)_46%,rgba(4,25,29,.42)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ocean-deep/70 to-transparent" />
    </>
  );

  if (hasReducedMotion) {
    return (
      <section id="home" className="relative min-h-[100svh] w-full overflow-hidden bg-ocean-deep">
        <Image src={heroVideoConfig.poster} alt="Bahari Asili Safaris — Kenya safari and coastal experiences" fill priority fetchPriority="high" quality={80} sizes="100vw" className="object-cover object-center" />
        {mediaOverlay}
        {children}
      </section>
    );
  }

  return (
    <section id="home" className="relative min-h-[100svh] w-full overflow-hidden bg-ocean-deep">
      <div className="absolute inset-0 h-full w-full">
        {!videoLoaded && (
          <Image src={heroVideoConfig.poster} alt="" fill priority fetchPriority="high" quality={80} sizes="100vw" className="object-cover object-center" />
        )}
        <video
          ref={videoRef}
          src={videoSrc}
          poster={heroVideoConfig.poster}
          onCanPlay={handleVideoLoad}
          onError={handleVideoError}
          autoPlay
          muted
          playsInline
          preload="auto"
          className="h-full w-full select-none object-cover object-center"
          aria-label="Bahari Asili Safaris Kenya"
        />
      </div>
      {mediaOverlay}
      {children}
    </section>
  );
}
