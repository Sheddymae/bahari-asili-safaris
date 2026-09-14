# Hero Step 3 — Reduced Motion

- Added `prefers-reduced-motion: reduce` handling to `components/CinematicTextOverlay.tsx`.
- When reduced motion is enabled, the cinematic language rotation is disabled and the selected locale remains visible.
- Crossfade transitions are disabled in reduced-motion mode.
- The media query is read inside `useEffect`, so browser-only APIs are not evaluated during server rendering/hydration.
- Normal hero timing remains unchanged: 5 seconds hold + 1.5 seconds crossfade.
