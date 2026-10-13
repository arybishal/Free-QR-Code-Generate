/* Generates public/cover.png and public/og-cover.png using Edge Headless. */
'use strict';
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgeCandidates = [
  'C:\\Program Files (x86)\\Microsoft\\EdgeCore\\154.0.4258.62\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\EdgeCore\\154.0.4258.53\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

let edgePath = edgeCandidates.find(p => fs.existsSync(p));
if (!edgePath) {
  console.error('Edge executable not found in standard paths');
  process.exit(1);
}

const templatePath = path.join(__dirname, 'cover-template.html').replace(/\\/g, '/');
const publicDir = path.join(__dirname, '..', 'public');
const assetsDir = path.join(__dirname, '..', 'assets');
fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });

const outCover = path.join(publicDir, 'cover.png');
const outOg = path.join(publicDir, 'og-cover.png');
const outAsset = path.join(assetsDir, 'cover.png');

console.log('Rendering graphic cover banner using Edge headless...');
const cmd = `"${edgePath}" --headless --disable-gpu --window-size=1200,630 --hide-scrollbars --screenshot="${outCover}" "file:///${templatePath}"`;
execSync(cmd, { stdio: 'inherit' });

if (fs.existsSync(outCover)) {
  fs.copyFileSync(outCover, outOg);
  fs.copyFileSync(outCover, outAsset);
  const size = fs.statSync(outCover).size;
  console.log(`✓ Generated cover.png (${(size / 1024).toFixed(1)} KB)`);
  console.log(`✓ Copied to og-cover.png and assets/cover.png`);
} else {
  console.error('Failed to generate cover.png');
  process.exit(1);
}
