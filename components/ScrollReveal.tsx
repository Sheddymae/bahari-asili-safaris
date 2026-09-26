'use client';

import { Children, isValidElement, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  stagger?: number;
  className?: string;
  once?: boolean;
  distance?: number;
}

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  left: { x: -32, y: 0 },
  right: { x: 32, y: 0 },
};

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  stagger = 0,
  className = '',
  once = true,
  distance = 32,
}: ScrollRevealProps) {
  const reducedMotion = useReducedMotion();
  const offset = offsets[direction];
  const x = direction === 'left' ? -distance : direction === 'right' ? distance : 0;
  const y = direction === 'up' ? distance : direction === 'down' ? -distance : 0;
  const items = Children.toArray(children);
  const shouldStagger = !reducedMotion && stagger > 0 && items.length > 1;

  const transition = {
    duration: 0.65,
    ease: [0.22, 1, 0.36, 1] as const,
    delay,
  };

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  if (shouldStagger) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: '-100px' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
        {items.map((child, index) => (
          <motion.div
            key={isValidElement(child) && child.key != null ? String(child.key) : index}
            variants={{
              hidden: { opacity: 0, x, y },
              visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-100px' }}
      transition={transition}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
