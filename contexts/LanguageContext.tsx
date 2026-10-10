'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { translations, RTL_LOCALES, type Locale, type TranslationKeys } from '@/lib/i18n';
import { extraTranslations } from '@/lib/i18n-extra';
import { homeEnhancementTranslations } from '@/lib/home-enhancements-i18n';
import { safariDetailTranslations } from '@/lib/safari-detail-i18n';
import { hardcodedUiTranslations } from '@/lib/auto-translations';

const STORAGE_KEY = 'bahari-locale';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
  isRTL: boolean;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge<T extends Record<string, unknown>>(base: T, extra: Record<string, unknown>): T {
  const out: Record<string, unknown> = { ...base };
  for (const key of Object.keys(extra)) {
    const baseVal = out[key];
    const extraVal = extra[key];
    if (isPlainObject(baseVal) && isPlainObject(extraVal)) out[key] = deepMerge(baseVal, extraVal);
    else out[key] = extraVal;
  }
  return out as T;
}

const mergedTranslations: Record<Locale, TranslationKeys> = (Object.keys(translations) as Locale[]).reduce((acc, loc) => {
  acc[loc] = deepMerge(
    deepMerge(
      deepMerge(translations[loc] as unknown as Record<string, unknown>, extraTranslations[loc]),
      { homeEnhancements: homeEnhancementTranslations[loc] },
    ),
    { safariDetail: safariDetailTranslations[loc] },
  ) as unknown as TranslationKeys;
  return acc;
}, {} as Record<Locale, TranslationKeys>);

const LanguageContext = createContext<LanguageContextType>({
  locale: 'en',
  setLocale: () => {},
  t: mergedTranslations.en,
  isRTL: false,
});

function isValidLocale(value: string | null): value is Locale {
  return !!value && Object.prototype.hasOwnProperty.call(translations, value);
}

function normalize(value: string) {
  return value
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[—–]/g, ',')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Flatten strings by their stable translation path, including arrays. */
function collectStrings(value: unknown, path = '', out: Map<string, string> = new Map()) {
  if (typeof value === 'string') {
    out.set(path, value);
  } else if (Array.isArray(value)) {
    value.forEach((child, index) => collectStrings(child, `${path}[${index}]`, out));
  } else if (isPlainObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      collectStrings(child, path ? `${path}.${key}` : key, out);
    }
  }
  return out;
}

/**
 * Build aliases by matching the same translation key across catalogues.
 * The previous implementation reverse-mapped every phrase from every language
 * to English by text alone. Duplicate phrases could resolve to another locale
 * (including Arabic), causing Italian pages to unexpectedly display Arabic.
 */
function buildLocaleTextMap(locale: Locale): Record<string, string> {
  const english = collectStrings(mergedTranslations.en as unknown as Record<string, unknown>);
  const target = collectStrings(mergedTranslations[locale] as unknown as Record<string, unknown>);
  const map: Record<string, string> = {};

  // English is the canonical source, paired by key path—not by phrase lookup.
  for (const [path, englishText] of english) {
    const targetText = target.get(path);
    if (targetText && targetText !== englishText) map[normalize(englishText)] = targetText;
    else if (targetText) map[normalize(englishText)] = targetText;
  }

  // Recognize localized text already in the DOM when React replaces a node.
  // Do not overwrite canonical English mappings when phrases collide.
  for (const sourceLocale of Object.keys(mergedTranslations) as Locale[]) {
    const source = collectStrings(mergedTranslations[sourceLocale] as unknown as Record<string, unknown>);
    for (const [path, sourceText] of source) {
      const targetText = target.get(path);
      if (targetText && !Object.prototype.hasOwnProperty.call(map, normalize(sourceText))) {
        map[normalize(sourceText)] = targetText;
      }
    }
  }

  // Also map each hardcoded translation back from every source language.
  // This lets a switch from Italian/French/etc. back to English restore the
  // original phrase instead of leaving a previously translated DOM node behind.
  for (const sourceLocale of Object.keys(hardcodedUiTranslations) as Locale[]) {
    const sourceCatalogue = hardcodedUiTranslations[sourceLocale] || {};
    const targetCatalogue = hardcodedUiTranslations[locale] || {};
    for (const [english, sourceText] of Object.entries(sourceCatalogue)) {
      const targetText = locale === 'en'
        ? english
        : targetCatalogue[english] || map[normalize(english)] || english;
      if (!Object.prototype.hasOwnProperty.call(map, normalize(sourceText))) {
        map[normalize(sourceText)] = targetText;
      }
    }
  }

  // Exact hardcoded UI strings are explicit overrides, not inferred matches.
  for (const [source, translated] of Object.entries(hardcodedUiTranslations[locale] || {})) {
    map[normalize(source)] = translated;
  }
  return map;
}

function installCustomerAutoTranslator(locale: Locale) {
  if (typeof document === 'undefined') return () => {};
  const path = window.location.pathname;
  if (path.startsWith('/auth/dashboard') || path.startsWith('/admin')) return () => {};

  const map = buildLocaleTextMap(locale);
  const textOriginals = new WeakMap<Text, string>();
  const attrOriginals = new WeakMap<Element, Map<string, string>>();
  const attributes = ['placeholder', 'aria-label', 'title', 'alt'];
  const skipTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE']);

  const translateText = (node: Text) => {
    const parent = node.parentElement;
    if (!parent || skipTags.has(parent.tagName) || parent.closest('[data-no-auto-translate="true"]')) return;
    if (!textOriginals.has(node)) textOriginals.set(node, node.nodeValue ?? '');
    const original = textOriginals.get(node) ?? '';
    const translated = map[normalize(original)];
    if (!translated) return;
    const leading = original.match(/^\s*/)?.[0] || '';
    const trailing = original.match(/\s*$/)?.[0] || '';
    const next = `${leading}${translated}${trailing}`;
    if (node.nodeValue !== next) node.nodeValue = next;
  };

  const translateElement = (el: Element) => {
    if (skipTags.has(el.tagName) || el.closest('[data-no-auto-translate="true"]')) return;
    let originals = attrOriginals.get(el);
    if (!originals) {
      originals = new Map();
      attrOriginals.set(el, originals);
    }
    for (const attr of attributes) {
      const current = el.getAttribute(attr);
      if (current == null) continue;
      if (!originals.has(attr)) originals.set(attr, current);
      const original = originals.get(attr) || '';
      const translated = map[normalize(original)];
      if (translated && current !== translated) el.setAttribute(attr, translated);
    }
  };

  const scan = (root: Node) => {
    if (root.nodeType === Node.TEXT_NODE) {
      translateText(root as Text);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    const el = root as Element;
    translateElement(el);
    if ('querySelectorAll' in el) {
      el.querySelectorAll('*').forEach(translateElement);
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) translateText(node as Text);
  };

  scan(document.body);
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') translateText(mutation.target as Text);
      mutation.addedNodes.forEach(scan);
      if (mutation.type === 'attributes' && mutation.target instanceof Element) translateElement(mutation.target);
    }
  });
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: attributes,
  });
  return () => observer.disconnect();
}

export function LanguageProvider({ children, initialLocale = 'en' }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isValidLocale(stored)) setLocaleState(stored);
    } catch {
      // Storage can be disabled; keep the locale supplied by the server.
    }
    setHydrated(true);
  }, []);

  const isRTL = (RTL_LOCALES as readonly string[]).includes(locale);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [locale, isRTL, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    return installCustomerAutoTranslator(locale);
  }, [locale, hydrated]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.cookie = `${STORAGE_KEY}=${encodeURIComponent(next)}; Path=/; Max-Age=31536000; SameSite=Lax`;
    } catch {
      // Locale still changes for this session if persistence is unavailable.
    }
  }, []);

  const t = useMemo(() => mergedTranslations[locale], [locale]);
  return <LanguageContext.Provider value={{ locale, setLocale, t, isRTL }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
