import fs from 'node:fs';
import path from 'node:path';

const roots = ['app', 'components'];
const skip = ['components/ui', 'components/admin', 'app/auth', 'app/account', 'app/admin', 'app/api'];
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

function isCodeFragment(value) {
  return /[={}()=>]|className=|onClick=|onChange=|defaultMode=|style=|set[A-Z]|target=|href=/.test(value);
}

const literal = />\s*([A-Za-z][^<{\n]{2,120})\s*</g;
const fallback = /(?:\|\||\?\?)\s*["'`]([A-Za-z][^"'`\n]{2,160})["'`]/g;
const englishLocaleFallback = /(?:translations\.en|locale\s*===\s*['"](?:it|fr|es|de|ar|zh|sw)['"][^:]+:[^:]+|locale\s*===\s*['"]en['"])/g;
const findings = [];

for (const file of files) {
  const normalized = file.replaceAll('\\', '/');
  if (skip.some(s => normalized.startsWith(s))) continue;

  const text = stripComments(fs.readFileSync(file, 'utf8'));

  for (const m of text.matchAll(literal)) {
    const value = m[1].trim();
    if (isCodeFragment(value)) continue;
    if (/^(Bahari Asili|Bahari Asili Safaris|BAHARI ASILI SAFARIS)$/.test(value)) continue;
    if (/^(M-Pesa|VISA|WhatsApp|English|Italiano|Français|Español|Deutsch|Kiswahili|Currency)$/.test(value)) continue;
    findings.push(`${normalized}: customer-facing literal JSX text: ${value}`);
  }

  for (const m of text.matchAll(fallback)) {
    const value = m[1].trim();
    if (/^https?:\/\//.test(value) || /\.(pdf|png|jpg|jpeg|webp)$/.test(value)) continue;
    findings.push(`${normalized}: English fallback expression: ${value}`);
  }

  if (englishLocaleFallback.test(text)) {
    findings.push(`${normalized}: locale-specific English fallback logic detected`);
  }
  englishLocaleFallback.lastIndex = 0;
}

if (findings.length) {
  console.log('Customer-facing i18n candidates:');
  for (const finding of findings) console.log(` - ${finding}`);
  console.log(`\nFound ${findings.length} candidate(s). Route every customer-facing string through the eight-locale translation system.`);
  process.exitCode = 1;
} else {
  console.log('No customer-facing English fallback candidates found.');
}
