/* Copies npm-hosted libs into public/vendor (self-hosted, no CDN at runtime). */
'use strict';
const fs = require('fs'), path = require('path');
const V = path.join(__dirname, '..', 'public', 'vendor');
fs.mkdirSync(V, { recursive: true });
const copy = (src, dest) => {
  const s = path.join(__dirname, '..', ...src);
  if (!fs.existsSync(s)) { console.warn('missing (skipped):', src.join('/')); return; }
  fs.copyFileSync(s, path.join(V, dest)); console.log('vendored:', dest);
};
copy(['node_modules', 'qrcode-generator', 'qrcode.js'], 'qrcode.min.js');
copy(['node_modules', 'jspdf', 'dist', 'jspdf.umd.min.js'], 'jspdf.umd.min.js');
copy(['node_modules', 'jszip', 'dist', 'jszip.min.js'], 'jszip.min.js');
fs.writeFileSync(path.join(V, '.gitkeep'), '');
