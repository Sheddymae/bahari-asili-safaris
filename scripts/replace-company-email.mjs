import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const OFFICIAL = 'bahariasilisafaris@gmail.com';
const replacements = new Map([
  ['info@bahariasili.com', OFFICIAL],
  ['sheddymae02@gmail.com', OFFICIAL],
  ['onboarding@resend.dev', OFFICIAL],
]);

const binaryExtensions = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.pdf', '.zip', '.woff', '.woff2', '.ttf', '.otf', '.mp4', '.webm', '.mov', '.mp3', '.wav', '.avif', '.svg'
]);

const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split(/\r?\n/)
  .map((file) => file.trim())
  .filter(Boolean)
  .filter((file) => !binaryExtensions.has(path.extname(file).toLowerCase()));

let changed = 0;
for (const file of files) {
  const absolute = path.resolve(file);
  if (!fs.existsSync(absolute)) continue;
  let text;
  try {
    text = fs.readFileSync(absolute, 'utf8');
  } catch {
    continue;
  }

  let next = text;
  for (const [oldEmail, newEmail] of replacements) next = next.split(oldEmail).join(newEmail);
  if (next !== text) {
    fs.writeFileSync(absolute, next, 'utf8');
    changed += 1;
    console.log(`Updated ${file}`);
  }
}

console.log(`Updated ${changed} tracked text file(s). Official company email: ${OFFICIAL}`);
