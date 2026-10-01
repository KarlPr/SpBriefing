// Bundles src/officekit.js and inlines it into src/briefing-tool.html at the /*! OFFICEKIT */ marker.
import { buildSync } from 'esbuild';
import { readFileSync, writeFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync('node_modules/@office-kit/pptx/package.json', 'utf8'));
const lib = buildSync({
  entryPoints: ['src/officekit.js'], bundle: true, write: false, minify: true,
  format: 'iife', globalName: 'OfficeKitPptx', platform: 'browser', legalComments: 'none',
}).outputFiles[0].text.trim();

const html = readFileSync('src/briefing-tool.html', 'utf8');
if (!html.includes('/*! OFFICEKIT */')) throw new Error('marker missing in src/briefing-tool.html');
writeFileSync('briefing-tool.html', html.replace('/*! OFFICEKIT */', `/* @office-kit/pptx ${version} (MIT) - built by build.mjs, do not edit; edit src/ */\n${lib}`));
console.log('briefing-tool.html written (' + Math.round(lib.length / 1024) + ' KB bundle)');
