/* Pure QR payload builders — shared by browser (window.QRPayloads) and Jest (module.exports). No DOM. */
'use strict';
const escWifi = (s) => String(s ?? '').replace(/([\\;, :"])/g, '\\$1');
const fixUrl = (u) => { u = String(u ?? '').trim(); return u && !/^[a-z][a-z0-9+.-]*:/i.test(u) ? 'https://' + u : u; };
const need = (cond, msg) => { if (!cond) throw new Error(msg); };

const B = {
  url: (v) => fixUrl(v.url),
  text: (v) => String(v.text ?? ''),
  wifi: (v) => {
    need(String(v.ssid ?? '').trim(), 'Enter the WiFi network name.');
    const t = v.security === 'none' ? 'nopass' : (v.security || 'WPA');
    return `WIFI:T:${t};S:${escWifi(v.ssid)};${t === 'nopass' ? '' : `P:${escWifi(v.password ?? '')};`}${v.hidden ? 'H:true;' : ''};`;
  },
  contact: (v) => {
    need(v.first || v.last || v.phone || v.email, 'Enter at least a name, phone or email.');
    return ['BEGIN:VCARD', 'VERSION:3.0', `N:${v.last || ''};${v.first || ''};;;`,
      `FN:${[v.first, v.last].filter(Boolean).join(' ')}`,
      v.org && `ORG:${v.org}`, v.phone && `TEL;TYPE=VOICE:${v.phone}`, v.email && `EMAIL:${v.email}`,
      v.site && `URL:${fixUrl(v.site)}`, v.addr && `ADR:;;${v.addr};;;;`,
      v.linkedin && `X-SOCIALPROFILE;TYPE=LinkedIn:${fixUrl(v.linkedin)}`,
      v.instagram && `X-SOCIALPROFILE;TYPE=Instagram:${fixUrl(v.instagram)}`,
      v.note && `NOTE:${String(v.note).replace(/[\r\n]+/g, ' ')}`, 'END:VCARD'].filter(Boolean).join('\n');
  },
  email: (v) => {
    need(/.+@.+\..+/.test(v.to || ''), 'Enter a valid email address.');
    return `mailto:${v.to}?subject=${encodeURIComponent(v.subject || '')}&body=${encodeURIComponent(v.body || '')}`;
  },
  phone: (v) => { need(String(v.phone ?? '').trim(), 'Enter a phone number.'); return `tel:${String(v.phone).trim()}`; },
  sms: (v) => { need(String(v.phone ?? '').trim(), 'Enter a phone number.'); return `SMSTO:${String(v.phone).trim()}:${v.msg || ''}`; },
  whatsapp: (v) => {
    const d = String(v.phone ?? '').replace(/\D/g, '');
    need(d, 'Enter number with country code.');
    return `https://wa.me/${d}${v.msg ? `?text=${encodeURIComponent(v.msg)}` : ''}`;
  },
  location: (v) => {
    const la = parseFloat(v.lat), ln = parseFloat(v.lng);
    need(!isNaN(la) && la >= -90 && la <= 90, 'Latitude must be -90…90.');
    need(!isNaN(ln) && ln >= -180 && ln <= 180, 'Longitude must be -180…180.');
    return `geo:${la},${ln}`;
  },
  event: (v) => {
    need((v.title || '').trim(), 'Enter an event title.');
    need(/^\d{8}T\d{6}$/.test(v.start || ''), 'Start must be YYYYMMDDTHHMMSS.');
    need(/^\d{8}T\d{6}$/.test(v.end || ''), 'End must be YYYYMMDDTHHMMSS.');
    return ['BEGIN:VEVENT', `SUMMARY:${v.title}`, `DTSTART:${v.start}`, `DTEND:${v.end}`,
      v.venue && `LOCATION:${v.venue}`, v.desc && `DESCRIPTION:${v.desc}`, 'END:VEVENT'].filter(Boolean).join('\n');
  },
  app: (v) => { need(String(v.url ?? '').trim(), 'Paste the store link.'); return fixUrl(v.url); },
  social: (v) => { need(String(v.url ?? '').trim(), 'Paste the profile link.'); return fixUrl(v.url); },
  pay: (v) => { need(String(v.url ?? '').trim(), 'Paste the payment link.'); return String(v.url).trim(); },
  crypto: (v) => { need(String(v.addr ?? '').trim(), 'Paste the wallet address.'); return String(v.addr).trim(); },
};

if (typeof module !== 'undefined' && module.exports) module.exports = B;
if (typeof window !== 'undefined') window.QRPayloads = B;
