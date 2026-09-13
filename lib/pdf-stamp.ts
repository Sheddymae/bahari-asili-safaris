/**
 * Official digital stamp for all Bahari Asili customer-facing PDFs
 * (invoice, payment receipt, visa/itinerary support letter, voucher).
 *
 * The stamp asset (public/images/bahari-asili-stamp.png) is a teal
 * (#107390) oval — BAHARI ASILI / anchor / SAFARIS / stars — with its
 * white background removed and its distressed texture left untouched.
 * It has two horizontal lines with an empty gap between them; the
 * generation date is rendered into that gap at PDF-creation time.
 *
 * Same dual-environment loading pattern as loadBrandLogo() in
 * lib/pdf-brand.ts (works in the browser via fetch and on the server
 * via fs.readFile).
 *
 * --- Why the placement math looks the way it does ---
 * jsPDF's doc.addImage(..., rotation) does NOT rotate around the
 * image's center — it rotates around the image's bottom-left corner.
 * placeRotatedImage() below inverts that so callers can specify the
 * desired final CENTER point instead.
 *
 * Likewise, doc.text(..., { align: 'center', angle }) does not rotate
 * around the given anchor correctly (verified empirically — the
 * center-aligned text drifts off the intended pivot as the angle
 * grows). So date text is placed with { align: 'left' } at a manually
 * computed anchor: the target center, walked back by half the text
 * width along the rotated baseline direction. This has been verified
 * by rendering to PDF and rasterizing to confirm the date lands
 * exactly centered in the stamp's gap, at any rotation angle.
 */

import type { Locale } from './i18n';

const STAMP_PATH = 'images/bahari-asili-stamp.png';

// Native asset dimensions (public/images/bahari-asili-stamp.png is 216x168 px).
const STAMP_NATIVE_WIDTH = 216;
const STAMP_NATIVE_HEIGHT = 168;
const STAMP_RATIO = STAMP_NATIVE_WIDTH / STAMP_NATIVE_HEIGHT;

// The two horizontal lines inside the stamp sit at pixel rows 78-79 and
// 102-103 (of 168px tall), both spanning columns ~4-212 (of 216px wide,
// i.e. horizontally centered). The date is rendered at the midpoint of
// the gap between them: row 90.5, centered horizontally.
const STAMP_GAP_FRAC_X = 0.5;
const STAMP_GAP_FRAC_Y = 90.5 / STAMP_NATIVE_HEIGHT;

export interface BrandStamp {
  dataUrl: string;
  ratio: number;
}

let cachedStamp: BrandStamp | null | undefined;

/**
 * Loads the official stamp asset as a base64 data URL for jsPDF's
 * doc.addImage(). Never throws — returns null on failure so callers can
 * skip the stamp rather than fail the whole document.
 */
export async function loadBrandStamp(): Promise<BrandStamp | null> {
  if (cachedStamp !== undefined) return cachedStamp;
  try {
    let bytes: Uint8Array;
    if (typeof window !== 'undefined') {
      const response = await fetch(`/${STAMP_PATH}`);
      if (!response.ok) throw new Error(`Stamp request failed: ${response.status}`);
      bytes = new Uint8Array(await response.arrayBuffer());
    } else {
      const loadFs = Function('return import("fs/promises")') as () => Promise<typeof import('fs/promises')>;
      const fs = await loadFs();
      bytes = new Uint8Array(await fs.readFile(`${process.cwd()}/public/${STAMP_PATH}`));
    }
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunk, bytes.length)));
    }
    cachedStamp = { dataUrl: `data:image/png;base64,${btoa(binary)}`, ratio: STAMP_RATIO };
  } catch (error) {
    console.warn('Could not load Bahari Asili stamp for PDF; document will render without it.', error);
    cachedStamp = null;
  }
  return cachedStamp;
}

/**
 * Formats "today" (the PDF generation date) for display inside the
 * stamp, locale-aware and never hardcoded to English month names.
 * Format: "DD MMM YYYY" (e.g. "09 Sep 2026") for en/it/fr/es/de/sw;
 * locale-appropriate short/2-digit rendering for ar and zh.
 *
 * NOTE: for ar/zh this returns native-script text (Arabic or Chinese
 * characters), which needs a font that covers that script — see
 * `dateFont` on StampOptions / getSafeStampDate() below. Never call
 * this directly for the stamp without checking font coverage first;
 * use resolveStampDate() instead.
 */
export function getStampDate(locale: Locale, date: Date = new Date()): string {
  const intlLocale =
    locale === 'zh' ? 'zh-CN' :
    locale === 'ar' ? 'ar' :
    locale === 'sw' ? 'sw-KE' :
    locale === 'de' ? 'de-DE' :
    locale === 'fr' ? 'fr-FR' :
    locale === 'it' ? 'it-IT' :
    locale === 'es' ? 'es-ES' :
    'en-GB';
  try {
    return new Intl.DateTimeFormat(intlLocale, { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  } catch {
    // Fallback: should never trigger (all locales above are valid Intl tags), but
    // never hardcode an English month if it somehow does — use numeric month instead.
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  }
}

// Locales whose native-script month name (ar: Arabic script, zh: Han
// characters) is NOT covered by the standard Helvetica base-14 font.
const NON_LATIN_SCRIPT_LOCALES: ReadonlySet<Locale> = new Set(['ar', 'zh']);

const ASCII_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Guaranteed ASCII "DD MMM YYYY" — a safe fallback when no script-capable font is loaded. */
function getLatinFallbackStampDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mmm = ASCII_MONTHS[date.getMonth()];
  return `${dd} ${mmm} ${date.getFullYear()}`;
}

/**
 * Resolves the actual date string + font to draw inside the stamp.
 * If the locale needs a non-Latin script (ar/zh) and no script-capable
 * `dateFont` was supplied, falls back to a plain ASCII date instead of
 * emitting characters the loaded font can't render (which would show
 * as missing-glyph boxes/garbage on a real stamp).
 */
function resolveStampDate(locale: Locale, dateFont: string | undefined, date: Date): { text: string; font: string } {
  if (NON_LATIN_SCRIPT_LOCALES.has(locale) && !dateFont) {
    return { text: getLatinFallbackStampDate(date), font: 'helvetica' };
  }
  return { text: getStampDate(locale, date), font: dateFont || 'helvetica' };
}

/** Where an image drawn by doc.addImage(x, y, w, h, ..., rotation) will actually end up centered. */
function placeRotatedImage(targetCx: number, targetCy: number, width: number, height: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const lx = width / 2;
  const ly = height / 2;
  const xPrime = c * lx - s * ly;
  const yPrime = s * lx + c * ly;
  return { x: targetCx - xPrime, y: targetCy + yPrime - height };
}

/** Where a given fractional point (0-1, top-left origin) of a rotated image lands on the page. */
function rotatedImagePoint(
  x: number, y: number, width: number, height: number, angleDeg: number,
  fracX: number, fracY: number
) {
  const rad = (angleDeg * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const lx = fracX * width;
  const ly = (1 - fracY) * height;
  const xPrime = c * lx - s * ly;
  const yPrime = s * lx + c * ly;
  return { x: x + xPrime, y: y + height - yPrime };
}

export interface StampOptions {
  /** Page width in mm (usually 210 for A4 portrait). */
  pageWidth: number;
  /** Y position (mm) of the top of the footer band on the page the stamp is drawn on. */
  footerTopY: number;
  /** Right margin in mm; the stamp is inset from the page's right edge by this much. Default 14. */
  marginRight?: number;
  /** Stamp bounding box width in mm (height is derived from the image's native ratio). Default 42. */
  boxWidthMM?: number;
  /** Stamp bounding box height in mm — the image is contained within box W x H, ratio preserved. Default 28. */
  boxHeightMM?: number;
  /** Rotation in degrees, negative = tilted like a hand stamp. Default -12. */
  rotationDeg?: number;
  /** Ink opacity. Default 0.85. */
  opacity?: number;
  /** Teal used for the date text, to match the stamp ink. Default #107390. */
  color?: [number, number, number];
  /** Date text font size in pt. Default 7.5. */
  fontSize?: number;
  /**
   * Name of an already-registered jsPDF font that covers the locale's
   * script (e.g. the font name returned by registerInvoiceFont() for
   * 'ar' or 'zh'). Pass this whenever the calling generator has loaded
   * one. If omitted for 'ar'/'zh', the stamp renders a plain ASCII date
   * instead of native-script text, since the base Helvetica font can't
   * render Arabic or Han characters.
   */
  dateFont?: string;
}

/**
 * Draws the official stamp — rotated, semi-transparent, bottom-right,
 * overlapping the footer band slightly — with the locale-formatted
 * generation date rendered inside the gap between its two lines.
 *
 * Call this LAST, right before doc.output(), on the current (final)
 * page of the document, after the footer for that page has been drawn.
 */
export function drawStamp(doc: any, stamp: BrandStamp | null, locale: Locale, options: StampOptions): void {
  if (!stamp) return;

  const {
    pageWidth,
    footerTopY,
    marginRight = 14,
    boxWidthMM = 42,
    boxHeightMM = 28,
    rotationDeg = -12,
    opacity = 0.85,
    color = [16, 115, 144],
    fontSize = 7.5,
  } = options;

  // Fit the stamp's native ratio inside the box (contain, not stretch).
  let drawW = boxWidthMM;
  let drawH = drawW / stamp.ratio;
  if (drawH > boxHeightMM) {
    drawH = boxHeightMM;
    drawW = drawH * stamp.ratio;
  }

  // Bottom-right, overlapping the footer band slightly like a real ink stamp.
  const cx = pageWidth - marginRight - drawW / 2 - 4;
  const cy = footerTopY - 6;

  doc.saveGraphicsState();
  if (typeof doc.setGState === 'function' && doc.GState) {
    doc.setGState(new doc.GState({ opacity }));
  }

  const { x, y } = placeRotatedImage(cx, cy, drawW, drawH, rotationDeg);
  doc.addImage(stamp.dataUrl, 'PNG', x, y, drawW, drawH, undefined, 'FAST', rotationDeg);

  const { text: dateText, font: dateFontName } = resolveStampDate(locale, options.dateFont, new Date());
  const gap = rotatedImagePoint(x, y, drawW, drawH, rotationDeg, STAMP_GAP_FRAC_X, STAMP_GAP_FRAC_Y);

  doc.setFont(dateFontName, 'normal');
  doc.setFontSize(fontSize);
  doc.setTextColor(color[0], color[1], color[2]);
  const textWidth = doc.getTextWidth(dateText);
  const rad = (rotationDeg * Math.PI) / 180;
  const leftX = gap.x - (textWidth / 2) * Math.cos(rad);
  const leftY = gap.y + (textWidth / 2) * Math.sin(rad);
  // NOTE: align:'left' + manual anchor, not align:'center' — see module docblock.
  doc.text(dateText, leftX, leftY, { align: 'left', baseline: 'middle', angle: rotationDeg });

  doc.restoreGraphicsState();
}
