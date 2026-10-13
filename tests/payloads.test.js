'use strict';
const B = require('../public/js/qr-payloads');

test('WiFi escaping', () => {
  expect(B.wifi({ ssid: 'A;B:C,D" E\\F', password: 'p:x', security: 'WPA', hidden: '' }))
    .toBe('WIFI:T:WPA;S:A\\;B\\:C\\,D\\"\\ E\\\\F;P:p\\:x;;');
  expect(B.wifi({ ssid: 'Cafe', password: '', security: 'none' })).toBe('WIFI:T:nopass;S:Cafe;;');
  expect(() => B.wifi({ ssid: '  ' })).toThrow();
});

test('vCard 3.0', () => {
  const v = B.contact({ first: 'Bishal', last: 'A', phone: '+977-98', email: 'a@b.com', org: '', site: 'example.com', addr: '' });
  expect(v).toContain('BEGIN:VCARD\nVERSION:3.0\nN:A;Bishal');
  expect(v).toContain('TEL;TYPE=VOICE:+977-98');
  expect(v).toContain('URL:https://example.com');
  expect(v).toContain('END:VCARD');
  const v2 = B.contact({ first: 'A', linkedin: 'linkedin.com/in/a', instagram: '', note: 'Met\nin KTM' });
  expect(v2).toContain('X-SOCIALPROFILE;TYPE=LinkedIn:https://linkedin.com/in/a');
  expect(v2).toContain('NOTE:Met in KTM');
  expect(() => B.contact({})).toThrow();
});

test('WhatsApp wa.me', () => {
  expect(B.whatsapp({ phone: '+977 984-1234567', msg: 'Hi!' })).toBe('https://wa.me/9779841234567?text=Hi!');
  expect(B.whatsapp({ phone: '97798', msg: '' })).toBe('https://wa.me/97798');
  expect(() => B.whatsapp({ phone: 'abc' })).toThrow();
});

test('geo + url prefix', () => {
  expect(B.location({ lat: '27.7172', lng: '85.3240' })).toBe('geo:27.7172,85.324');
  expect(() => B.location({ lat: '99', lng: '0' })).toThrow();
  expect(B.url({ url: 'example.com' })).toBe('https://example.com');
  expect(B.url({ url: 'upi://pay?pa=x' })).toBe('upi://pay?pa=x');
});

test('event + sms + email guards', () => {
  expect(B.event({ title: 'Gig', start: '20261120T180000', end: '20261120T210000', venue: 'KTM' })).toContain('BEGIN:VEVENT');
  expect(() => B.event({ title: 'x', start: 'nope', end: '20261120T210000' })).toThrow();
  expect(B.sms({ phone: '123', msg: 'hi' })).toBe('SMSTO:123:hi');
  expect(() => B.email({ to: 'not-an-email' })).toThrow();
});
