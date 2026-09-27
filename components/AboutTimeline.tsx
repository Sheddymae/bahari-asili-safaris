'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CalendarDays, HeartHandshake, PhoneCall } from 'lucide-react';

const STEPS = [
  {
    year: '2018',
    title: 'Started in the family compound',
    body: 'Bahari Asili began in Watamu with two vehicles, a local network and a simple promise: look after every traveller personally.',
    icon: CalendarDays,
  },
  {
    year: '2020',
    title: 'First 100 happy guests',
    body: 'Word of mouth grew the operation while the team kept its focus on small-group service, local knowledge and honest advice.',
    icon: HeartHandshake,
  },
  {
    year: 'Today',
    title: 'Still answer our own phones',
    body: 'The operation remains hands-on: we brief every guide, stay close to each itinerary and remain available when plans change.',
    icon: PhoneCall,
  },
];

export default function AboutTimeline() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="absolute left-7 top-7 hidden h-[calc(100%-3.5rem)] w-px bg-[#0E5F6B]/30 md:block" aria-hidden="true" />
      <div className="space-y-6">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.article
              key={step.year}
              initial={reducedMotion ? false : { opacity: 0, x: -18 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative grid gap-5 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm md:grid-cols-[56px_110px_1fr] md:items-center"
            >
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF7ED] text-[#FF7A18] ring-8 ring-white">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <span className="font-poppins text-2xl font-black text-[#0E5F6B]">{step.year}</span>
              </div>
              <div>
                <h3 className="font-poppins text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 font-inter text-sm leading-6 text-slate-600">{step.body}</p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
