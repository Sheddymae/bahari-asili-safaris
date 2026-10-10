import fs from 'node:fs';
import path from 'node:path';

const roots = ['app', 'components'];
const skip = ['components/ui', 'components/admin', 'app/auth', 'app/account', 'app/admin', 'app/api'];
const catalogueFiles = [
  'lib/i18n.ts',
  'lib/i18n-extra.ts',
  'lib/home-enhancements-i18n.ts',
  'lib/safari-detail-i18n.ts',
  'lib/destination-translations.ts',
  'lib/expanded-destination-translations.ts',
  'lib/destination-page-i18n.ts',
  'lib/safari-content-i18n.ts',
  'lib/excursion-content-i18n.ts',
  'lib/group-departure-i18n.ts',
  'lib/auto-translations.ts',
];
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(tsx|jsx)$/.test(entry.name)) files.push(p);
  }
}

for (const root of roots) if (fs.existsSync(root)) walk(root);

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
}

function normalize(value) {
  return value
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[—–]/g, ',')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function isCodeFragment(value) {
  return /[={}()=>]|className=|onClick=|onChange=|defaultMode=|style=|set[A-Z]|target=|href=/.test(value);
}

function collectCatalogueStrings() {
  const catalogue = new Set();
  const quoted = /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g;
  for (const file of catalogueFiles) {
    if (!fs.existsSync(file)) continue;
    const text = stripComments(fs.readFileSync(file, 'utf8'));
    for (const match of text.matchAll(quoted)) {
      const value = normalize(match[2]);
      if (value.length >= 3 && /^[A-Za-z]/.test(value)) catalogue.add(value);
    }
  }
  return catalogue;
}


function findObjectEnd(source, openBraceIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = openBraceIndex; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];

    if (lineComment) {
      if (ch === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === '*' && next === '/') { blockComment = false; i++; }
      continue;
    }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (ch === '\\') { escaped = true; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '/' && next === '/') { lineComment = true; i++; continue; }
    if (ch === '/' && next === '*') { blockComment = true; i++; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth++;
    if (ch === '}' && --depth === 0) return i + 1;
  }
  return source.length;
}

const catalogue = collectCatalogueStrings();
const findings = [];

// Catch a common localization regression: a translation key accidentally
// populated with text from another language (for example Arabic in Italian).
for (const file of catalogueFiles) {
  if (!fs.existsSync(file)) continue;
  const source = fs.readFileSync(file, 'utf8');
  const localeBlocks = [...source.matchAll(/^ {2}(en|it|fr|es|de|ar|zh|sw):\s*\{/gm)];
  for (let i = 0; i < localeBlocks.length; i++) {
    const locale = localeBlocks[i][1];
    const start = localeBlocks[i].index ?? 0;
    const openBrace = start + localeBlocks[i][0].lastIndexOf('{');
    const end = findObjectEnd(source, openBrace);
    const block = source.slice(start, end);
    if (locale !== 'ar' && /[\u0600-\u06FF]/u.test(block)) {
      findings.push(`${file}: Arabic-script text found inside the "${locale}" locale block`);
    }
    if (locale !== 'zh' && /[\u3400-\u9FFF]/u.test(block)) {
      findings.push(`${file}: Chinese-script text found inside the "${locale}" locale block`);
    }
  }
}

const rawCatalogueSources = catalogueFiles.map((file) => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '').join('\n');
const literal = />\s*([A-Za-z][^<{\n]{2,160})\s*</g;
const fallback = /(?:\|\||\?\?)\s*["'`]([A-Za-z][^"'`\n]{2,200})["'`]/g;
for (const file of files) {
  const normalizedPath = file.replaceAll('\\', '/');
  if (skip.some(s => normalizedPath.startsWith(s))) continue;

  const text = stripComments(fs.readFileSync(file, 'utf8'));

  for (const m of text.matchAll(literal)) {
    const value = normalize(m[1]);
    if (isCodeFragment(value)) continue;
    if (/^(Bahari Asili|Bahari Asili Safaris|BAHARI ASILI SAFARIS|Africa,)$/.test(value)) continue;
    if (/^(M-Pesa|VISA|WhatsApp|English|Italiano|Français|Español|Deutsch|Kiswahili|Currency)$/.test(value)) continue;
    if (catalogue.has(value) || rawCatalogueSources.includes(value)) continue;
    findings.push(`${normalizedPath}: uncatalogued customer-facing literal: ${value}`);
  }

  for (const m of text.matchAll(fallback)) {
    const value = normalize(m[1]);
    if (/^https?:\/\//.test(value) || /\.(pdf|png|jpg|jpeg|webp)$/.test(value) || /@/.test(value)) continue;
    if (catalogue.has(value) || rawCatalogueSources.includes(value)) continue;
    findings.push(`${normalizedPath}: uncatalogued English fallback expression: ${value}`);
  }
}

if (findings.length) {
  console.log('Customer-facing i18n candidates not present in the translation catalogue:');
  for (const finding of findings) console.log(` - ${finding}`);
  console.log(`\nFound ${findings.length} uncatalogued candidate(s). Add each customer-facing string to the eight-locale translation system.`);
  process.exitCode = 1;
} else {
  console.log('No uncatalogued customer-facing English strings found.');
}
