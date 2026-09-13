import fs from 'node:fs';
import path from 'node:path';

const roots = ['app', 'components'];
const skip = ['components/ui', 'components/admin', 'app/auth/dashboard', 'app/admin', 'app/api'];
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(tsx|jsx)$/.test(entry.name)) files.push(p);
  }
}
for (const root of roots) if (fs.existsSync(root)) walk(root);
const literal = />\s*([A-Za-z][^<{\n]{2,120})\s*</g;
const findings = [];
for (const file of files) {
  if (skip.some(s => file.replaceAll('\\','/').startsWith(s))) continue;
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(literal)) {
    const value = m[1].trim();
    if (/^(className|style|svg|path|div|span|button|input|option|label|main|section|article|p|h[1-6])$/.test(value)) continue;
    findings.push(`${file}: ${value}`);
  }
}
if (findings.length) {
  console.log('Customer-facing literal text candidates:');
  for (const f of findings) console.log(` - ${f}`);
  console.log(`\nFound ${findings.length} candidate(s). Review each and add a translation key or an intentional non-translated proper name.`);
  process.exitCode = 1;
} else {
  console.log('No customer-facing literal JSX text candidates found.');
}
