/* Build: vendor + icons + minify (safe, no deps) + JS budget check. */
'use strict';
const { execSync } = require('child_process'), fs = require('fs'), path = require('path'), zlib = require('zlib');
execSync('node scripts/vendor.js', { stdio: 'inherit' });
execSync('node scripts/icons.js', { stdio: 'inherit' });

const root = path.join(__dirname, '..', 'public');
const stripBlock = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');
function minCSS(src) {
  return stripBlock(src).replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').trim();
}
function minJS(src) { // line-join only: keeps // comments and string URLs intact
  return stripBlock(src).split('\n').map(l => l.trim()).filter(l => l.length).join('\n');
}
for (const f of ['css/styles.css', 'js/qr-payloads.js', 'js/app.js', 'js/batch.js', 'js/ui.js']) {
  const src = fs.readFileSync(path.join(root, f), 'utf8');
  const out = f.endsWith('.css') ? minCSS(src) : minJS(src);
  const dest = f.replace(/\.([^.]+)$/, '.min.$1');
  fs.writeFileSync(path.join(root, dest), out);
  console.log(`${dest}: ${(out.length / 1024).toFixed(1)}KB`);
}

const P = path.join(root, 'js');
let core = 0;
for (const f of ['qr-payloads.js', 'app.js', 'ui.js']) {
  const src = fs.readFileSync(path.join(P, f));
  const gz = zlib.gzipSync(src).length;
  core += gz; console.log(`${f}: ${(src.length / 1024).toFixed(1)}KB → gzip ${(gz / 1024).toFixed(1)}KB`);
}
console.log(`core JS gzip: ${(core / 1024).toFixed(1)}KB (budget 150KB) ${core < 150 * 1024 ? '✓' : '✗ OVER'}`);
if (core >= 150 * 1024) process.exit(1);
