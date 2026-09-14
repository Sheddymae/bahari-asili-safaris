# Hero hydration safety — Step 5

Audit focus: `CinematicTextOverlay` and `LanguageContext`.

- Server and first client render must use the same locale supplied by `LanguageProvider`.
- Do not read `localStorage`, `window`, or `document` during render.
- Browser-only preference handling remains inside effects.
- Do not use `suppressHydrationWarning` to mask real mismatches.
- Do not introduce an English-only mounted gate that causes a language flash.
