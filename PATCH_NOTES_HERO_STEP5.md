# Hero hydration safety — Step 5

The cinematic Hero keeps the server-resolved locale as the first-render source of truth. Browser-only rotation/accessibility state is activated in effects. No browser APIs are read during render, no English-only mounted gate is introduced, and no `suppressHydrationWarning` is used to mask mismatches.
