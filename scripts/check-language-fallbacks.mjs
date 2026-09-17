import fs from 'node:fs';
import path from 'node:path';

const roots = ['app', 'components'];
const skip = ['components/ui', 'components/admin', 'app/auth', 'app/account', 'app/admin', 'app/api'];
const catalogueFiles = [
  'lib/i18n.ts',
  'lib/i18n-extra.ts',
  'lib/home-enhancements-i18n.ts',
  'lib/safari-detail-i18n.ts',
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

const catalogue = collectCatalogueStrings();
const literal = />\s*([A-Za-z][^<{\n]{2,160})\s*</g;
const fallback = /(?:\|\||\?\?)\s*["'`]([A-Za-z][^"'`\n]{2,200})["'`]/g;
const findings = [];

for (const file of files) {
  const normalizedPath = file.replaceAll('\\', '/');
  if (skip.some(s => normalizedPath.startsWith(s))) continue;

  const text = stripComments(fs.readFileSync(file, 'utf8'));

  for (const m of text.matchAll(literal)) {
    const value = normalize(m[1]);
    if (isCodeFragment(value)) continue;
    if (/^(Bahari Asili|Bahari Asili Safaris|BAHARI ASILI SAFARIS)$/.test(value)) continue;
    if (/^(M-Pesa|VISA|WhatsApp|English|Italiano|Français|Español|Deutsch|Kiswahili|Currency)$/.test(value)) continue;
    if (catalogue.has(value)) continue;
    findings.push(`${normalizedPath}: uncatalogued customer-facing literal: ${value}`);
  }

  for (const m of text.matchAll(fallback)) {
    const value = normalize(m[1]);
    if (/^https?:\/\//.test(value) || /\.(pdf|png|jpg|jpeg|webp)$/.test(value)) continue;
    if (catalogue.has(value)) continue;
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
