'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface AnimateOnScrollProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;      // milliseconds
  duration?: number;   // milliseconds
  className?: string;
  once?: boolean;      // if true, animates only the first time it enters view
}

const directionOffset: Record<Direction, string> = {
  up: 'translate-y-8',
  down: '-translate-y-8',
  left: 'translate-x-8',
  right: '-translate-x-8',
  none: '',
};

export default function AnimateOnScroll({
  children,
  direction = 'up',
  delay = 0,
  duration = 700,
  className = '',
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${
        isVisible
          ? 'opacity-100 translate-x-0 translate-y-0'
          : `opacity-0 ${directionOffset[direction]}`
      } ${className}`}
      style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
