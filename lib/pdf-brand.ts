/**
 * Shared brand assets for all customer-facing PDF documents (invoice,
 * payment receipt, visa/itinerary support letter, voucher).
 *
 * Official brand colors:
 *   Teal      #107390  (16, 115, 144)  — headers, footers, primary text
 *   Orange    #F97216  (249, 114, 22)  — accents, totals, highlights
 *   Off-white #F5F1E8  (245, 241, 232) — text/backing on teal
 *
 * The logo (public/images/logo/logo-horizontal.png) is always embedded
 * unaltered and in full color — never recolored, never cropped. It ships
 * as a fixed 1752x798 PNG, so LOGO_RATIO (width / height) is a constant.
 */

import { LOGO_HORIZONTAL_BASE64 } from './pdf-assets/logo-base64';

export const BRAND_TEAL: [number, number, number] = [16, 115, 144];
export const BRAND_ORANGE: [number, number, number] = [249, 114, 22];
export const BRAND_OFFWHITE: [number, number, number] = [245, 241, 232];
export const BRAND_TEXT: [number, number, number] = [31, 41, 55];
export const BRAND_LIGHT: [number, number, number] = [100, 116, 139];

export const COMPANY = {
  name: 'BAHARI ASILI SAFARIS',
  address: 'Watamu, Kenya',
  phone: '+254 101 923 355',
  email: 'sheddymae02@gmail.com',
  website: 'bahariasili.com',
  founded: 'Founded by Shadrack Safari',
};

const LOGO_RATIO = 1752 / 798;

export interface BrandLogo {
  dataUrl: string;
  ratio: number;
}

let cachedLogo: BrandLogo | null | undefined;

/**
 * Returns the official logo as a base64 data URL, for use with jsPDF's
 * doc.addImage(). The PNG bytes are embedded at build time in
 * lib/pdf-assets/logo-base64.ts (generated from
 * public/images/logo/logo-horizontal.png) instead of being read from
 * disk/network at request time — fs.readFile()/fetch() of a public/
 * asset is not reliably bundled into a Next.js App Router serverless
 * function (outputFileTracingIncludes does not cover app/ routes on
 * this Next.js version), which was silently dropping the logo in
 * production while working fine in `next dev`. Embedding the bytes in
 * the module graph means the logo travels with the code, in every
 * runtime, guaranteed. Kept async + cached so call sites don't change.
 * Never throws — returns null only if the embedded constant is somehow
 * empty, so callers can render a text-only fallback header instead of
 * failing the whole document.
 */
export async function loadBrandLogo(): Promise<BrandLogo | null> {
  if (cachedLogo !== undefined) return cachedLogo;
  if (!LOGO_HORIZONTAL_BASE64) {
    console.warn('Bahari Asili logo base64 constant is empty; using text-only header.');
    cachedLogo = null;
    return cachedLogo;
  }
  cachedLogo = { dataUrl: `data:image/png;base64,${LOGO_HORIZONTAL_BASE64}`, ratio: LOGO_RATIO };
  return cachedLogo;
}

/**
 * Draws the logo at full aspect ratio, height-constrained. Returns the
 * rendered width in mm (0 if no logo) so callers can lay out text next
 * to it. The logo is always drawn as-is — full color, undistorted; the
 * small globe icon above the 'i' in "Bahari" is part of the source PNG
 * and is preserved as long as the whole image is drawn (never crop it).
 */
export function drawBrandLogo(doc: any, logo: BrandLogo | null, x: number, y: number, heightMM: number): number {
  if (!logo) return 0;
  const width = heightMM * logo.ratio;
  doc.addImage(logo.dataUrl, 'PNG', x, y, width, heightMM, undefined, 'FAST');
  return width;
}
