import type { Locale } from './i18n';

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunk, bytes.length)));
  }
  return btoa(binary);
}

export async function registerInvoiceFont(doc: any, locale: Locale): Promise<string> {
  const fontName = locale === 'ar' ? 'NotoArabic' : locale === 'zh' ? 'NotoCJK' : 'NotoSans';
  const file = locale === 'ar' ? 'NotoSansArabic-Regular.ttf' : locale === 'zh' ? 'NotoSansCJK-sc.ttf' : 'NotoSans-Regular.ttf';
  const vfsName = `${fontName}-Regular.ttf`;
  try {
    let bytes: Uint8Array;
    if (typeof window !== 'undefined') {
      const response = await fetch(`/fonts/${file}`);
      if (!response.ok) throw new Error(`Font request failed: ${response.status}`);
      bytes = new Uint8Array(await response.arrayBuffer());
    } else {
      const loadFs = Function('return import(\"fs/promises\")') as () => Promise<typeof import('fs/promises')>;
      const fs = await loadFs();
      bytes = new Uint8Array(await fs.readFile(`${process.cwd()}/public/fonts/${file}`));
    }
    // jsPDF's font embedder only supports TrueType (glyf-outline) fonts. The
    // bundled NotoSansCJK-sc.ttf is actually OpenType/CFF (outline data in a
    // 'CFF ' table, sfnt tag 'OTTO') despite its .ttf extension — Google
    // distributes Noto Sans CJK in CFF-flavored OpenType only. Registering
    // it doesn't throw here, but jsPDF crashes later, mid-`doc.output()`,
    // while subsetting glyphs — after the rest of the document has already
    // been drawn. Detect that up front and fall back before we're committed,
    // instead of producing a half-built, corrupt PDF.
    const sfntTag = bytes.length >= 4 ? new TextDecoder('ascii').decode(bytes.subarray(0, 4)) : '';
    if (sfntTag === 'OTTO') {
      throw new Error(`${file} is CFF-flavored OpenType ('OTTO'), which jsPDF's font embedder cannot subset — needs a true glyf-outline TTF.`);
    }
    doc.addFileToVFS(vfsName, toBase64(bytes));
    doc.addFont(vfsName, fontName, 'normal');
    doc.setFont(fontName, 'normal');
    if (locale === 'ar' && typeof doc.setR2L === 'function') doc.setR2L(true);
    return fontName;
  } catch (error) {
    console.warn(`Could not load ${locale} invoice font; using Helvetica fallback.`, error);
    if (typeof doc.setR2L === 'function') doc.setR2L(locale === 'ar');
    doc.setFont('helvetica', 'normal');
    return 'helvetica';
  }
}
