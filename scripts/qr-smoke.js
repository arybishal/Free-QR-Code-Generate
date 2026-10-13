/* Engine smoke test — real vendored qrcode-generator + payload builders, all 9 core types. */
'use strict';
const qrcode = require('qrcode-generator');
const B = require('../public/js/qr-payloads');

qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
let fail = 0;
const ok = (name, cond, extra = '') => { console.log((cond ? 'PASS' : 'FAIL') + ' ' + name, extra); if (!cond) fail++; };

ok('utf8-multibyte', qrcode.stringToBytes('Ā').length === 2 && qrcode.stringToBytes('😀').length === 4);
ok('wifi-escape', B.wifi({ ssid: 'A;B', password: 'p:x', security: 'WPA' }).includes('A\\;B'));

const samples = {
  url: { url: 'example.com' }, text: { text: 'Hello Ā 😀' },
  wifi: { ssid: 'Café;Net', password: 's3cret', security: 'WPA' },
  contact: { first: 'Ada', last: 'L', phone: '+977-98', email: 'a@b.com' },
  email: { to: 'a@b.com', subject: 'Hi', body: 'Test' }, phone: { phone: '+977980000000' },
  sms: { phone: '123', msg: 'hi' }, whatsapp: { phone: '97798', msg: 'Hi!' },
  location: { lat: '27.7172', lng: '85.3240' },
};
for (const [id, v] of Object.entries(samples)) {
  try {
    const payload = B[id](v);
    const q = qrcode(0, 'M'); q.addData(payload, 'Byte'); q.make();
    const n = q.getModuleCount();
    // finder squares must be dark at corners of each 7x7 eye
    const eye = q.isDark(0, 0) && q.isDark(0, 6) && q.isDark(6, 0) && q.isDark(0, n - 1) && q.isDark(n - 1, 0);
    ok(id, n >= 21 && n <= 177 && eye, `v${n} len=${payload.length}`);
  } catch (e) { ok(id, false, e.message); }
}
// too-long content must throw ( surfaces as friendly "too long" message in UI)
try { const q = qrcode(0, 'L'); q.addData('x'.repeat(5000), 'Byte'); q.make(); ok('too-long-throws', false); }
catch { ok('too-long-throws', true); }
process.exit(fail ? 1 : 0);
