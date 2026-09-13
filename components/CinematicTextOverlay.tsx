"use client";

import { useEffect, useState } from "react";

/**
 * CinematicTextOverlay
 *
 * Sits over the hero video. A rotating, slow-crossfading greeting +
 * tagline (synced together, one language at a time) plays above the
 * "BAHARI ASILI SAFARIS" heading.
 *
 * Layout order: greeting -> H1 -> tagline -> subtext
 * Swap CONTENT for your actual site-language list/order/copy.
 */

const CONTENT = [
  {
    greeting: "Hello",
    tagline: "Experience Kenya Beyond the Ordinary.",
    subtext:
      "Discover wild landscapes, remarkable wildlife, and authentic African experiences.",
  },
  {
    greeting: "Ciao",
    tagline: "Vivi il Kenya Oltre l'Ordinario.",
    subtext:
      "Scopri paesaggi selvaggi, fauna straordinaria ed esperienze africane autentiche.",
  },
  {
    greeting: "Bonjour",
    tagline: "Découvrez le Kenya Au-delà de l'Ordinaire.",
    subtext:
      "Explorez des paysages sauvages, une faune remarquable et des expériences africaines authentiques.",
  },
  {
    greeting: "Hallo",
    tagline: "Erleben Sie Kenia Jenseits des Gewöhnlichen.",
    subtext:
      "Entdecken Sie wilde Landschaften, außergewöhnliche Tierwelt und authentische afrikanische Erlebnisse.",
  },
  {
    greeting: "Hola",
    tagline: "Vive Kenia Más Allá de lo Ordinario.",
    subtext:
      "Descubre paisajes salvajes, fauna extraordinaria y experiencias africanas auténticas.",
  },
  {
    greeting: "Olá",
    tagline: "Viva o Quénia Além do Comum.",
    subtext:
      "Descubra paisagens selvagens, vida selvagem notável e experiências africanas autênticas.",
  },
  {
    greeting: "Hallo", // Dutch — same spelling as German, adjust if unwanted
    tagline: "Beleef Kenia Voorbij het Gewone.",
    subtext:
      "Ontdek ongerepte landschappen, opmerkelijke dieren in het wild en authentieke Afrikaanse ervaringen.",
  },
  {
    greeting: "Habari",
    tagline: "Furahia Kenya Zaidi ya Kawaida.",
    subtext:
      "Gundua mandhari ya porini, wanyamapori wa ajabu, na uzoefu halisi wa Kiafrika.",
  },
];

const CROSSFADE_MS = 1500; // slow fade duration
const HOLD_MS = 5000; // how long each language stays fully on screen (5s)

export default function CinematicTextOverlay() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let fadeTimeout: ReturnType<typeof setTimeout>;

    const holdInterval = setInterval(() => {
      // start fade out (greeting + tagline + subtext together)
      setVisible(false);

      // after fade completes, swap language and fade back in
      fadeTimeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % CONTENT.length);
        setVisible(true);
      }, CROSSFADE_MS);
    }, HOLD_MS + CROSSFADE_MS);

    return () => {
      clearInterval(holdInterval);
      clearTimeout(fadeTimeout);
    };
  }, []);

  const current = CONTENT[index];
  const fadeStyle = {
    opacity: visible ? 1 : 0,
    transition: `opacity ${CROSSFADE_MS}ms ease-in-out`,
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pb-28">
      {/* Rotating greeting */}
      <h2
        className="font-bold text-white drop-shadow-lg select-none"
        style={{
          fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
          letterSpacing: "0.02em",
          ...fadeStyle,
        }}
        aria-live="polite"
      >
        {current.greeting}
      </h2>

      {/* Main heading — single line, larger to anchor the hero */}
      <h1
        className="mt-4 font-extrabold text-white leading-tight drop-shadow-xl whitespace-nowrap"
        style={{ fontSize: "clamp(2.75rem, 7.5vw, 6.25rem)" }}
      >
        BAHARI ASILI SAFARIS
      </h1>

      {/* Rotating tagline — synced with greeting */}
      <p
        className="mt-6 font-bold text-white drop-shadow-md max-w-3xl"
        style={{
          fontSize: "clamp(1.35rem, 2.6vw, 1.85rem)",
          ...fadeStyle,
        }}
      >
        {current.tagline}
      </p>

      {/* Rotating subtext — synced with greeting */}
      <p
        className="mt-3 text-white/90 max-w-2xl"
        style={{
          fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
          ...fadeStyle,
        }}
      >
        {current.subtext}
      </p>

      {/* ...rest of your existing hero copy / search bar goes below, untouched */}
    </div>
  );
}