#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

function loadTypeScript(relativePath) {
  const source = readFileSync(resolve(process.cwd(), relativePath), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(output, { module, exports: module.exports }, { filename: relativePath });
  return module.exports;
}

const core = loadTypeScript('lib/tours-data.ts');
const additions = loadTypeScript('lib/safari-catalogue-additions.ts');
const regional = loadTypeScript('lib/regional-safaris.ts');
const { contentComplete } = loadTypeScript('lib/content-completeness.ts');

const safaris = [...core.safaris, ...additions.safariCatalogueAdditions, ...regional.regionalSafaris];
const excursions = core.excursions;
const rows = [
  ...safaris.map((item) => ({ type: 'safari', item, report: contentComplete(item, 'safari') })),
  ...excursions.map((item) => ({ type: 'excursion', item, report: contentComplete(item, 'excursion') })),
];

console.log('Content completeness report (checked-in catalogue only; CMS records require a separate production audit)');
console.table(rows.map(({ type, item, report }) => ({
  type,
  id: item.id,
  title: item.name,
  status: report.complete ? 'COMPLETE' : 'INCOMPLETE',
  missing: report.missing.join(', '),
})));

const complete = rows.filter((row) => row.report.complete).length;
const incomplete = rows.length - complete;
console.log(`\\n${complete}/${rows.length} catalogue items complete; ${incomplete} require owner-verified content.`);
if (process.env.STRICT_CONTENT_COMPLETENESS === '1' && incomplete > 0) process.exit(1);
