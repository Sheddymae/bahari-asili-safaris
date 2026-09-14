"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations, type Locale } from "@/lib/i18n";

/**
 * CinematicTextOverlay
 *
 * The hero uses the same locale and translated hero copy as the rest of the
 * customer-facing site. The selected locale is shown first, then the hero
 * rotates through the canonical eight supported site locales.
 *
 * IMPORTANT: Do not add a second translated tagline/subtext source here.
 * `lib/i18n.ts` is the source of truth for hero title/subtitle content.
 */

const HERO_LOCALES: Locale[] = ["en", "it", "fr", "es", "de", "ar", "zh", "sw"];

// Greeting labels are intentionally kept small and are derived from the
// canonical locale list. The actual hero title/subtitle always come from i18n.
const GREETINGS: Record<Locale, string> = {
  en: "Hello",
  it: "Ciao",
  fr: "Bonjour",
  es: "Hola",
  de: "Hallo",
  ar: "مرحباً",
  zh: "你好",
  sw: "Habari",
};

const CROSSFADE_MS = 1500;
const HOLD_MS = 5000;

function localeIndex(locale: Locale) {
  const index = HERO_LOCALES.indexOf(locale);
  return index >= 0 ? index : 0;
}

export default function CinematicTextOverlay() {
  const { locale, isRTL } = useLanguage();
  // Keep the selected context locale as the first-render source of truth.
  // Rotation state is activated after mount, avoiding any browser-only
  // initialization during hydration and avoiding an English flash.
  const [rotationIndex, setRotationIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    setRotationIndex(localeIndex(locale));
    setVisible(true);
  }, [locale]);

  useEffect(() => {
    if (rotationIndex === null || reduceMotion) {
      setVisible(true);
      return;
    }

    let swapTimeout: ReturnType<typeof setTimeout> | undefined;

    const holdTimeout = setTimeout(() => {
      setVisible(false);
      swapTimeout = setTimeout(() => {
        setRotationIndex((previous) =>
          previous === null ? localeIndex(locale) : (previous + 1) % HERO_LOCALES.length,
        );
        setVisible(true);
      }, CROSSFADE_MS);
    }, HOLD_MS);

    return () => {
      clearTimeout(holdTimeout);
      if (swapTimeout) clearTimeout(swapTimeout);
    };
  }, [rotationIndex, locale, reduceMotion]);

  // During the first render, use the already-resolved server/client locale.
  // After mount, rotationIndex controls the normal cinematic rotation.
  const activeLocale = rotationIndex === null ? locale : (HERO_LOCALES[rotationIndex] ?? locale);
  const activeTranslation = translations[activeLocale];
  const fallbackTranslation = translations.en;
  const hero = activeTranslation.hero ?? fallbackTranslation.hero;

  const fadeStyle = {
    opacity: visible ? 1 : 0,
    transition: reduceMotion ? "none" : `opacity ${CROSSFADE_MS}ms ease-in-out`,
  };

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 pb-28 text-center font-manrope"
      dir={isRTL && activeLocale === "ar" ? "rtl" : "ltr"}
    >
      <h2
        className="select-none font-bold text-white drop-shadow-lg"
        style={{
          fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
          letterSpacing: activeLocale === "ar" ? "normal" : "0.02em",
          ...fadeStyle,
        }}
      >
        {GREETINGS[activeLocale]}
      </h2>

      <h1
        className="mt-4 max-w-full font-extrabold leading-tight text-white drop-shadow-xl"
        style={{ fontSize: "clamp(2.35rem, 7.5vw, 6.25rem)" }}
      >
        BAHARI ASILI SAFARIS
      </h1>

      <p
        className="mt-6 max-w-3xl font-bold text-white drop-shadow-md"
        style={{
          fontSize: "clamp(1.25rem, 2.6vw, 1.85rem)",
          ...fadeStyle,
        }}
      >
        {hero.title}
      </p>

      <p
        className="mt-3 max-w-2xl text-white/90 drop-shadow-md"
        style={{
          fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
          ...fadeStyle,
        }}
      >
        {hero.subtitle}
      </p>
    </div>
  );
}
