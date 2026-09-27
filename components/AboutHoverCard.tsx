'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

type AboutHoverCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  details?: string;
  bullets?: string[];
  href?: string;
};

export default function AboutHoverCard({
  icon: Icon,
  title,
  description,
  details,
  bullets = [],
  href = '#',
}: AboutHoverCardProps) {
  const [active, setActive] = useState(false);
  const reducedMotion = useReducedMotion();
  const hasDetails = Boolean(details || bullets.length || href !== '#');

  return (
    <motion.article
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {\n        if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) setActive(false);\n      }}
      onClick={() => setActive((current) => !current)}
      animate={
        reducedMotion
          ? undefined
          : { y: active ? -10 : 0, scale: active ? 1.02 : 1 }
      }
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative z-0 cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-[border-color,box-shadow,transform] duration-300 hover:z-10 hover:border-orange-200 hover:shadow-[0_25px_60px_-12px_rgba(0,0,0,0.15)]"
    >
      <AnimatePresence>
        {active && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, scaleX: 0 }}
            transition={{ duration: 0.22 }}
            className="absolute inset-x-0 top-0 h-1 origin-left rounded-t-3xl bg-[#FF7A18]"
          />
        )}
      </AnimatePresence>

      <div
        className={[
          'mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF7ED] text-[#FF7A18]',
          'transition-colors duration-300 group-hover:bg-[#0E5F6B] group-hover:text-white',
          active ? 'bg-[#0E5F6B] text-white' : '',
        ].join(' ')}
      >
        <Icon className="h-6 w-6" strokeWidth={1.8} />
      </div>

      <h3 className="font-poppins text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 line-clamp-3 font-inter text-sm leading-6 text-slate-600">{description}</p>

      <AnimatePresence initial={false}>
        {active && hasDetails && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, height: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.28 }}
            className="overflow-hidden"
          >
            {details && (
              <p className="mt-4 border-t border-orange-100 pt-4 font-inter text-sm leading-6 text-slate-600">
                {details}
              </p>
            )}
            {bullets.length > 0 && (
              <ul className="mt-4 space-y-2 text-left">
                {bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 font-inter text-xs leading-5 text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF7A18]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
            {href !== '#' && (
              <Link
                href={href}
                onClick={(event) => event.stopPropagation()}
                className="mt-5 inline-flex items-center gap-2 font-inter text-sm font-bold text-[#0E5F6B] hover:text-[#0E5F6B]"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!active && hasDetails && (
        <span className="mt-4 inline-flex items-center gap-1 font-inter text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Hover to explore
        </span>
      )}
    </motion.article>
  );
}
