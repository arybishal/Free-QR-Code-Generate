/* Generates public/icon-192.png + icon-512.png (PWA install needs raster icons). No deps. */
'use strict';
const fs = require('fs'), path = require('path'), zlib = require('zlib');
const crcTable = (() => { const t = new Int32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c; } return t; })();
const crc = (b) => { let c = -1; for (const x of b) c = crcTable[(c ^ x) & 255] ^ (c >>> 8); return Buffer.from([(c ^ -1) >>> 24 & 255, (c ^ -1) >>> 16 & 255, (c ^ -1) >>> 8 & 255, (c ^ -1) & 255]); };
const chunk = (type, data) => { const t = Buffer.from(type), len = Buffer.alloc(4); len.writeUInt32BE(data.length); return Buffer.concat([len, t, data, crc(Buffer.concat([t, data]))]); };
const hex = (h) => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16));

function icon(S) {
  const px = Buffer.alloc(S * S * 4), [br, bg2, bb] = hex('#4f46e5');
  const set = (x, y, r, g, b) => { if (x < 0 || y < 0 || x >= S || y >= S) return; const o = (y * S + x) * 4; px[o] = r; px[o + 1] = g; px[o + 2] = b; px[o + 3] = 255; };
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) set(x, y, br, bg2, bb);
  // rounded corners: clear outside radius
  const R = S * 0.22;
  for (const [cx, cy] of [[R, R], [S - R, R], [R, S - R], [S - R, S - R]])
    for (let y = 0; y < R; y++) for (let x = 0; x < R; x++)
      if ((x - R) ** 2 + (y - R) ** 2 > R * R) { const o = ((cy - R + y) * S + (cx - R + x)) * 4; px[o + 3] = 0; }
  // white QR mark: 3 finders + modules
  const cell = S / 32, W = 255;
  const finder = (fx, fy) => {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      const edge = r === 0 || r === 6 || c === 0 || c === 6, core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      if (!edge && !core) continue;
      for (let y = 0; y < cell; y++) for (let x = 0; x < cell; x++) set(Math.round((fx + c) * cell + x), Math.round((fy + r) * cell + y), W, W, W);
    }
  };
  finder(5, 5); finder(20, 5); finder(5, 20);
  for (const [c, r] of [[20, 20], [22, 22], [24, 20], [20, 24], [24, 24], [12, 12], [14, 18]])
    for (let y = 0; y < cell; y++) for (let x = 0; x < cell; x++) set(Math.round((c) * cell + x), Math.round((r) * cell + y), W, W, W);
  const raw = Buffer.alloc((S * 4 + 1) * S);
  for (let y = 0; y < S; y++) { raw[y * (S * 4 + 1)] = 0; px.copy(raw, y * (S * 4 + 1) + 1, y * S * 4, (y + 1) * S * 4); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(S, 0); ihdr.writeUInt32BE(S, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
const out = path.join(__dirname, '..', 'public');
for (const s of [192, 512]) { fs.writeFileSync(path.join(out, `icon-${s}.png`), icon(s)); console.log('icon', s); }
