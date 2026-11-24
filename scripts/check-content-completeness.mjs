#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

function loadTypeScript(relativePath, dependencies = {}) {
  const source = readFileSync(resolve(process.cwd(), relativePath), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(output, { module, exports: module.exports, require: (name) => {
    if (Object.prototype.hasOwnProperty.call(dependencies, name)) return dependencies[name];
    throw new Error(`Unexpected runtime import ${name} in ${relativePath}`);
  } }, { filename: relativePath });
  return module.exports;
}

const core = loadTypeScript('lib/tours-data.ts');
const additions = loadTypeScript('lib/safari-catalogue-additions.ts');
const regional = loadTypeScript('lib/regional-safaris.ts');
const format = loadTypeScript('lib/format.ts');
const { buildProgramGuide } = loadTypeScript('lib/program-guide.ts', { './tours-data': core, './format': format });
const { contentComplete } = loadTypeScript('lib/content-completeness.ts');

const safaris = [...core.safaris, ...additions.safariCatalogueAdditions, ...regional.regionalSafaris];
const excursions = core.excursions;
const rows = [
  ...safaris.map((item) => {
    const guide = buildProgramGuide(item);
    const candidate = { ...item, faqs: guide.faqs, packingTips: guide.packing.groups.flatMap((group) => group.items) };
    return { type: 'safari', item, report: contentComplete(candidate, 'safari') };
  }),
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
console.log(`\n${complete}/${rows.length} catalogue items complete; ${incomplete} require owner-verified content.`);
if (process.env.STRICT_CONTENT_COMPLETENESS === '1' && incomplete > 0) process.exit(1);
