'use client'; 
 
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'; 
import { translations, RTL_LOCALES, type Locale, type TranslationKeys } from '@/lib/i18n'; 
import { extraTranslations } from '@/lib/i18n-extra';
import { homeEnhancementTranslations } from '@/lib/home-enhancements-i18n';
import { safariDetailTranslations } from '@/lib/safari-detail-i18n';
import { hardcodedUiTranslations } from '@/lib/auto-translations'; 
 
const STORAGE_KEY = 'bahari-locale'; 
 
interface LanguageContextType { locale: Locale; setLocale: (locale: Locale) => void; t: TranslationKeys; isRTL: boolean; } 
function isPlainObject(value: unknown): value is Record<string, unknown> { return !!value && typeof value === 'object' && !Array.isArray(value); } 
function deepMerge<T extends Record<string, unknown>>(base: T, extra: Record<string, unknown>): T { const out: Record<string, unknown> = { ...base }; for (const key of Object.keys(extra)) { const baseVal = out[key]; const extraVal = extra[key]; if (isPlainObject(baseVal) && isPlainObject(extraVal)) out[key] = deepMerge(baseVal, extraVal); else out[key] = extraVal; } return out as T; } 
const mergedTranslations: Record<Locale, TranslationKeys> = (Object.keys(translations) as Locale[]).reduce((acc, loc) => { acc[loc] = deepMerge(deepMerge(deepMerge(translations[loc] as unknown as Record<string, unknown>, extraTranslations[loc]), { homeEnhancements: homeEnhancementTranslations[loc] }), { safariDetail: safariDetailTranslations[loc] }) as unknown as TranslationKeys; return acc; }, {} as Record<Locale, TranslationKeys>); 
const LanguageContext = createContext<LanguageContextType>({ locale: 'en', setLocale: () => {}, t: mergedTranslations.en, isRTL: false }); 
function isValidLocale(value: string | null): value is Locale { return !!value && Object.prototype.hasOwnProperty.call(translations, value); } 
function flattenStrings(value: unknown, out: Record<string, string> = {}) { if (!isPlainObject(value)) return out; for (const child of Object.values(value)) { if (typeof child === 'string') out[child] = child; else if (isPlainObject(child)) flattenStrings(child, out); } return out; }
function installCustomerAutoTranslator(locale: Locale) {
  if (typeof document === 'undefined') return () => {};
  const path = window.location.pathname; if (path.startsWith('/auth/dashboard') || path.startsWith('/admin')) return () => {};
  const englishCatalogue = flattenStrings(mergedTranslations.en as unknown as Record<string, unknown>); const targetCatalogue = flattenStrings(mergedTranslations[locale] as unknown as Record<string, unknown>); const manual = hardcodedUiTranslations[locale] || {};
  const normalize = (value: string) => value.replace(/&apos;|&#39;/gi, "'").replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/[—–]/g, ',').replace(/\s+/g, ' ').trim();
  const map: Record<string, string> = {}; const reverseMap: Record<string, string> = {};
  for (const sourceLocale of Object.keys(mergedTranslations) as Locale[]) { const sourceCatalogue = flattenStrings(mergedTranslations[sourceLocale] as unknown as Record<string, unknown>); for (const [english, value] of Object.entries(sourceCatalogue)) { if (value && value !== english && !reverseMap[normalize(value)]) reverseMap[normalize(value)] = english; } for (const [english, value] of Object.entries(hardcodedUiTranslations[sourceLocale] || {})) { if (value && value !== english && !reverseMap[normalize(value)]) reverseMap[normalize(value)] = english; } }
  for (const english of Object.keys(englishCatalogue)) { const target = targetCatalogue[english]; if (target && target !== english) map[normalize(english)] = target; } for (const [source, target] of Object.entries(manual)) map[normalize(source)] = target;
  const textOriginals = new WeakMap<Text, string>(); const attrOriginals = new WeakMap<Element, Map<string, string>>(); const attributes = ['placeholder', 'aria-label', 'title', 'alt']; const skipTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE']);
  const translateText = (node: Text) => { const parent = node.parentElement; if (!parent || skipTags.has(parent.tagName)) return; const current = textOriginals.get(node) ?? node.nodeValue ?? ''; if (!textOriginals.has(node)) textOriginals.set(node, current); const original = textOriginals.get(node) || ''; const canonical = reverseMap[normalize(original)] || normalize(original); if (!canonical) return; const translated = locale === 'en' ? canonical : map[normalize(canonical)]; if (!translated) return; const leading = original.match(/^\s*/)?.[0] || ''; const trailing = original.match(/\s*$/)?.[0] || ''; const next = `${leading}${translated}${trailing}`; if (node.nodeValue !== next) node.nodeValue = next; };
  const translateElement = (el: Element) => { if (skipTags.has(el.tagName)) return; let originals = attrOriginals.get(el); if (!originals) { originals = new Map(); attrOriginals.set(el, originals); } for (const attr of attributes) { const current = el.getAttribute(attr); if (current == null) continue; if (!originals.has(attr)) originals.set(attr, current); const original = originals.get(attr) || ''; const canonical = reverseMap[normalize(original)] || normalize(original); const translated = locale === 'en' ? canonical : map[normalize(canonical)]; if (translated && current !== translated) el.setAttribute(attr, translated); } };
  const scan = (root: Node) => { if (root.nodeType === Node.TEXT_NODE) translateText(root as Text); if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return; const el = root as Element; translateElement(el); el.querySelectorAll('*').forEach(translateElement); const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let node: Node | null; while ((node = walker.nextNode())) translateText(node as Text); };
  scan(document.body); const observer = new MutationObserver((mutations) => { for (const mutation of mutations) { if (mutation.type === 'characterData') translateText(mutation.target as Text); mutation.addedNodes.forEach(scan); if (mutation.type === 'attributes' && mutation.target instanceof Element) translateElement(mutation.target); } }); observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes }); return () => observer.disconnect();
}
export function LanguageProvider({ children, initialLocale = 'en' }: { children: React.ReactNode; initialLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale); const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const stored = window.localStorage.getItem(STORAGE_KEY); if (isValidLocale(stored)) setLocaleState(stored); } catch {} setHydrated(true); }, []);
  const isRTL = (RTL_LOCALES as readonly string[]).includes(locale);
  useEffect(() => { if (!hydrated) return; document.documentElement.lang = locale; document.documentElement.dir = isRTL ? 'rtl' : 'ltr'; }, [locale, isRTL, hydrated]);
  useEffect(() => { if (!hydrated) return; return installCustomerAutoTranslator(locale); }, [locale, hydrated]);
  const setLocale = useCallback((next: Locale) => { setLocaleState(next); try { window.localStorage.setItem(STORAGE_KEY, next); document.cookie = `${STORAGE_KEY}=${encodeURIComponent(next)}; Path=/; Max-Age=31536000; SameSite=Lax`; } catch {} }, []);
  const t = useMemo(() => mergedTranslations[locale], [locale]); return <LanguageContext.Provider value={{ locale, setLocale, t, isRTL }}>{children}</LanguageContext.Provider>; }
export function useLanguage() { return useContext(LanguageContext); }
