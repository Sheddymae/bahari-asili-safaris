// Compatibility typing for the destination catalogue.
//
// Safari.tabs is intentionally restricted to SafariTab values, while the
// expanded destination catalogue now contains additional East African slugs.
// Runtime matching is still a normal string comparison; this overload keeps
// TypeScript from rejecting that comparison without weakening SafariTab itself.
declare global {
  interface Array<T> {
    includes(
      searchElement: T | (T extends string ? string : never),
      fromIndex?: number,
    ): boolean;
  }

  interface ReadonlyArray<T> {
    includes(
      searchElement: T | (T extends string ? string : never),
      fromIndex?: number,
    ): boolean;
  }
}

export {};