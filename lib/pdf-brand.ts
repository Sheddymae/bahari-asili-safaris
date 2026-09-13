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

const LOGO_PATH = 'images/logo/logo-horizontal.png';
const LOGO_RATIO = 1752 / 798;

export interface BrandLogo {
  dataUrl: string;
  ratio: number;
}

let cachedLogo: BrandLogo | null | undefined;

/**
 * Loads the official logo as a base64 data URL, for use with
 * jsPDF's doc.addImage(). Works both in the browser (fetch) and on the
 * server (fs.readFile), same dual-environment pattern as
 * registerInvoiceFont() in lib/invoice-font.ts. Returns null (never
 * throws) if the logo can't be loaded, so callers can render a
 * text-only fallback header instead of failing the whole document.
 */
export async function loadBrandLogo(): Promise<BrandLogo | null> {
  if (cachedLogo !== undefined) return cachedLogo;
  try {
    let bytes: Uint8Array;
    if (typeof window !== 'undefined') {
      const response = await fetch(`/${LOGO_PATH}`);
      if (!response.ok) throw new Error(`Logo request failed: ${response.status}`);
      bytes = new Uint8Array(await response.arrayBuffer());
    } else {
      const loadFs = Function('return import(\"fs/promises\")') as () => Promise<typeof import('fs/promises')>;
      const fs = await loadFs();
      bytes = new Uint8Array(await fs.readFile(`${process.cwd()}/public/${LOGO_PATH}`));
    }
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunk, bytes.length)));
    }
    cachedLogo = { dataUrl: `data:image/png;base64,${btoa(binary)}`, ratio: LOGO_RATIO };
  } catch (error) {
    console.warn('Could not load Bahari Asili logo for PDF; using text-only header.', error);
    cachedLogo = null;
  }
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
