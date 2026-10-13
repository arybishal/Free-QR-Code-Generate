# Free QR Code Generator — PRD and Build Prompts

Product Requirements Document plus ready-to-paste AI prompts for building the website

Owner: Bishal | Version 1.0 | October 2026

## 1. Product Overview

**Product name (working):** FreeQR (replace with your final brand/domain)

**One-line pitch:** A fast, free, no-signup website where anyone can create QR codes for links, WiFi, contacts, text and more, choose the quality, and download as PNG, JPG, SVG or PDF.

**Problem:** Most QR sites force sign-up, add watermarks, expire codes, or hide high-resolution and vector downloads behind a paywall.

**Solution:** Generate everything in the browser. No account, no watermark, no expiry, no limits. Static QR codes never depend on our server, so they work forever.

## 2. Goals and Success Metrics

| Goal | Metric | Target (first 6 months) |
| --- | --- | --- |
| Be the simplest free generator | Time from landing to download | under 30 seconds |
| Organic traffic through SEO | Monthly organic visits | 20,000+ |
| Engagement | Landing-to-download conversion | 35%+ |
| Performance | Lighthouse score (mobile) | 95+ |
| Trust | Bounce rate | under 45% |

**Non-goals for v1:** user accounts, dynamic (editable/trackable) QR codes, payments, team features.

## 3. Target Users

- **Small business owners and shop owners:** menu, payment link, WhatsApp, Google review QR.
- **Marketers and designers:** brand-coloured QR with SVG/PDF for print.
- **Students and teachers:** share links, text, WiFi.
- **Event organisers:** contact cards, location, WiFi for guests.
- **Everyday users:** one-off WiFi or contact QR.

## 4. Scope

### MVP (v1)

1. QR types: Website URL, Text, WiFi, Contact (vCard), Email, Phone, SMS, WhatsApp, Location.
2. Quality selection: Standard 512 px, High 1024 px, Ultra 2048 px, Print 4096 px.
3. Error correction level: L, M, Q, H.
4. Customisation: foreground colour, background colour, margin.
5. Download formats: PNG, JPG, SVG (vector), PDF.
6. Live preview that updates as the user types.
7. SEO landing page per QR type (e.g. /wifi-qr-code-generator).
8. Responsive, dark mode, accessible, fast.

### v1.5

- Logo in the centre of the QR.
- Module styles (dots, rounded, classy) and eye (corner) styles.
- Gradient colours.
- More types: Event (iCal), App Store/Play Store link, Social profiles, PayPal/UPI link, Crypto wallet, PDF/Image link, Telegram.
- Copy to clipboard, print button.
- Batch generation from CSV.

### v2 (optional, only if you want to monetise)

- Free accounts to save history.
- Dynamic QR (short link, editable destination, scan analytics).
- Pro features: bulk, API, custom domains.

## 5. Functional Requirements

### 5.1 QR type forms

| Type | Fields | Encoded format |
| --- | --- | --- |
| Website | URL | https://... (auto-prefix if missing) |
| Text | Free text | plain text, UTF-8 |
| WiFi | SSID, password, security (WPA/WEP/none), hidden | WIFI:T:WPA;S:name;P:pass;; |
| Contact | First/last name, phone, email, company, website, address | vCard 3.0 |
| Email | To, subject, body | mailto: |
| Phone | Number | tel: |
| SMS | Number, message | SMSTO:number:message |
| WhatsApp | Number with country code, message | https://wa.me/number?text= |
| Location | Latitude, longitude | geo:lat,lng |

Rules: inputs are validated inline, special characters in WiFi are escaped, UTF-8 (Arabic, Nepali, Hindi, emoji) must scan correctly, and the Generate area shows a friendly message when content is too long for a QR.

### 5.2 Quality and style options

- Quality selector sets the exported pixel size.
- Error correction selector with a short plain-language hint (higher = more damage-resistant but denser).
- Colour pickers for QR and background, with a contrast warning when scan reliability would be poor (QR must be darker than background, minimum contrast ratio about 4:1).
- Margin (quiet zone) slider 0–10 modules.

### 5.3 Downloads

| Format | Details |
| --- | --- |
| PNG | Lossless raster at the chosen quality |
| JPG | Quality 0.95, background colour always filled |
| SVG | True vector, scalable to any print size |
| PDF | A4 page with QR centred, vector or high-res image |

Filename pattern: qr-{type}-{date}.{ext}. All files are generated in the browser. Nothing is uploaded.

### 5.4 Pages

- Home (generator with Website type selected)
- One landing page per QR type (9 at launch)
- How QR codes work / FAQ
- Privacy Policy, Terms, Contact
- 404 page

## 6. Non-Functional Requirements

- **Performance:** LCP under 2 s on 4G mobile, JS under 150 KB gzipped, no render-blocking third-party scripts.
- **Privacy:** all generation client-side. No QR content is stored or sent anywhere. Analytics must be privacy-friendly and cookie-light.
- **Accessibility:** WCAG 2.1 AA, full keyboard use, labelled inputs, visible focus, sufficient contrast.
- **Browser support:** latest two versions of Chrome, Safari, Firefox, Edge; iOS Safari and Android Chrome.
- **Responsive:** 360 px to 1440 px+, mobile-first.
- **i18n-ready:** English first, structure ready for Arabic (RTL), Hindi and Nepali.
- **Reliability:** static hosting plus CDN; no server dependency for core feature.

## 7. Recommended Tech Stack

Two valid paths. Pick one.

**Option A (recommended, fastest): Static site**

- HTML, CSS, vanilla JS (or Astro/Next.js static export for easy multi-page SEO).
- QR engine: qrcode-generator library. PDF: jsPDF. SVG: custom path builder.
- Hosting: Cloudflare Pages, Netlify or Vercel (free tier).

**Option B (fits your WordPress skills): WordPress**

- Custom lightweight theme or a small plugin with a \[free\_qr\_generator type="wifi"\] shortcode.
- Each QR type is a WordPress page using the shortcode, with Rank Math or Yoast for SEO.
- Generator JS is enqueued only on those pages.

Both keep the generator itself 100% client-side.

## 8. UX and Design Direction

- Clean, trust-focused, tool-first: the generator is visible without scrolling.
- Layout: type tabs on top, form on the left, live preview and download buttons on the right (stacked on mobile).
- Visual style: modern, soft shadows, rounded 16 px cards, one accent colour (indigo), light and dark themes.
- Microcopy: friendly and short. Reassurance line under the preview: "Free forever. No sign-up. No watermark."
- Below the fold: how-to steps, use cases, FAQ, related QR types.

## 9. SEO Plan

| Page | Primary keyword |
| --- | --- |
| / | free qr code generator |
| /website-qr-code-generator | url to qr code |
| /wifi-qr-code-generator | wifi qr code generator |
| /contact-qr-code-generator | vcard qr code generator |
| /text-qr-code-generator | text to qr code |
| /email-qr-code-generator | email qr code generator |
| /phone-qr-code-generator | phone number qr code |
| /sms-qr-code-generator | sms qr code generator |
| /whatsapp-qr-code-generator | whatsapp qr code generator |
| /location-qr-code-generator | google maps qr code |

Each page needs: unique title and meta description, one H1, 600–900 words of helpful content, FAQ with FAQPage schema, SoftwareApplication or WebApplication schema, internal links between types, and a fast mobile score. Add sitemap.xml, robots.txt, canonical tags and Open Graph images.

## 10. Monetisation (optional, keep the core free)

- Non-intrusive display ads below the tool (never between form and download).
- Affiliate links to print services or business-card makers.
- Future Pro plan for dynamic QR and analytics.

## 11. Analytics and Events

Track (privacy-friendly): page\_view, type\_selected, qr\_generated, download\_clicked (with format), quality\_selected, color\_changed. Use these to see which types and formats are most popular.

## 12. Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Unscannable QR from low contrast or large logo | Contrast warning, default to error correction M, H when logo added |
| Competing with big QR sites | Win on speed, no sign-up, and long-tail SEO pages |
| Abuse (QR to malicious links) | Terms of use, no redirect/short links in v1 so we host nothing |
| Browser download restrictions | Blob-based downloads with fallback anchor method |

## 13. Roadmap

| Phase | Timeline | Deliverable |
| --- | --- | --- |
| 0 | Week 1 | Branding, domain, wireframes |
| 1 | Weeks 2–3 | MVP generator, 9 types, 4 formats |
| 2 | Week 4 | SEO landing pages, content, schema |
| 3 | Week 5 | QA, performance, launch |
| 4 | Weeks 6–10 | Logo upload, styles, more types |

## 14. Acceptance Criteria (MVP)

- A user can generate any of the 9 QR types without leaving the page.
- All 4 download formats open correctly; SVG scales without blur.
- Generated codes scan on iPhone and Android default cameras.
- UTF-8 text (Arabic, Nepali, emoji) scans correctly.
- Lighthouse mobile: Performance 95+, Accessibility 95+, SEO 100.
- No network request contains QR content.

---

# Build Prompts

Paste these into your AI coding tool (Claude, ChatGPT, Cursor, Lovable, Bolt, v0) in order. Replace the placeholders in \[brackets\].

## Prompt 0 — Master Context (paste first in every new chat)

```
You are a senior front-end engineer and UX designer. We are building "[BRAND NAME]", a free QR code generator website.

Product rules:
- 100% free, no sign-up, no watermark, no limits.
- All QR generation happens in the browser. Never upload user data.
- QR types: Website URL, Text, WiFi, Contact (vCard), Email, Phone, SMS, WhatsApp, Location.
- Quality selector: 512, 1024, 2048, 4096 px. Error correction: L, M, Q, H.
- Customisation: QR colour, background colour, margin.
- Downloads: PNG, JPG, SVG (true vector), PDF.
- Mobile-first, accessible (WCAG AA), dark mode, fast (Lighthouse 95+).

Code rules: clean, commented, no unnecessary dependencies, semantic HTML, CSS variables for theming, no inline styles except dynamic values.
Ask me before making any decision that changes scope.
```

## Prompt 1 — Front-End (main build)

```
Build the complete front end of the free QR code generator as a single responsive page using HTML, CSS and vanilla JavaScript (no framework).

LAYOUT
- Sticky header: logo on the left, nav links (QR Types dropdown, How it works, FAQ), dark/light toggle on the right.
- Hero: H1 "Free QR Code Generator", one-line subtitle, trust badges (Free forever, No sign-up, No watermark).
- Generator card directly under the hero, visible without scrolling on desktop:
  - Horizontally scrollable type tabs: Website, Text, WiFi, Contact, Email, Phone, SMS, WhatsApp, Location.
  - Left column: dynamic form for the selected type, then a "Style & quality" section.
  - Right column: live QR preview, four download buttons (PNG, JPG, SVG, PDF), a status message.
  - On mobile: stack the columns, preview first and sticky download bar at the bottom.
- Below the generator: How it works (3 steps), Use cases grid, Features grid, FAQ accordion, related QR types grid, footer with Privacy, Terms, Contact.

STYLE & QUALITY CONTROLS
- Quality select: Standard 512, High 1024, Ultra 2048, Print 4096 px.
- Error correction select with helper text.
- Colour pickers for QR and background with a live contrast check; show a warning if contrast is too low to scan.
- Margin slider 0-10.

DESIGN
- Modern, clean, trustworthy. Indigo accent, rounded 16px cards, soft shadows, generous spacing, system font stack.
- Smooth but subtle transitions, focus rings, 44px minimum touch targets.
- Define all colours as CSS variables with light and dark themes, respect prefers-color-scheme and remember the manual choice.

BEHAVIOUR
- Preview updates live as the user types (debounced 150 ms).
- Show a helpful empty state before input.
- Disable download buttons until a valid QR exists.
- Friendly inline validation errors.
- Keyboard accessible, ARIA labels, aria-live on the status message.

Create placeholder functions generateQR(), downloadPNG(), downloadJPG(), downloadSVG(), downloadPDF() that I will implement in the next step. Output the full code in separate index.html, styles.css and app.js files.
```

## Prompt 2 — QR Engine and Downloads (JavaScript logic)

```
Implement the QR engine and download logic in app.js for the page we built.

Requirements:
1. Use the qrcode-generator library (load from cdnjs with a pinned version). Enable UTF-8 by setting qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'] and use Byte mode.
2. Build the payload for each type:
   - URL: auto-prefix https:// if missing.
   - WiFi: WIFI:T:{WPA|WEP|nopass};S:{ssid};P:{password};H:{true|};; with backslash escaping of \ ; , : ".
   - Contact: vCard 3.0 (N, FN, ORG, TEL, EMAIL, URL, ADR).
   - Email: mailto: with encoded subject and body.
   - Phone: tel:. SMS: SMSTO:number:message.
   - WhatsApp: https://wa.me/{digits}?text={encoded}.
   - Location: geo:lat,lng with numeric validation.
3. Draw the preview on a canvas. For export, draw on an offscreen canvas at the chosen pixel size using integer module sizes so edges stay crisp.
4. SVG export: build a single <path> from horizontal runs of dark modules, include background rect and viewBox, shape-rendering="crispEdges".
5. PNG and JPG via canvas.toBlob (JPG quality 0.95, background always painted).
6. PDF via jsPDF: A4, QR centred, with the chosen size scaled to fit, plus optional small caption of the QR type.
7. Handle the "data too long" error with a clear message.
8. Trigger downloads with Blob + URL.createObjectURL and an anchor with the download attribute; revoke the URL afterwards.
9. Filename: qr-{type}-{YYYYMMDD}.{ext}.
10. Add unit-style self checks in the console for payload builders.

Keep the code modular with small pure functions. Do not use any server calls.
```

## Prompt 3 — Design System and UI Polish

```
Act as a product designer. Review the generator page and give me a complete design system, then update the CSS:
- Colour tokens (light/dark), spacing scale, radius scale, shadow scale, type scale.
- Components: tabs, inputs, selects, range, colour picker, primary and secondary buttons, cards, accordion, toast.
- States: hover, focus, active, disabled, error.
- Micro-interactions: preview fade/scale on update, button press, copy toast.
- Make the generator feel premium and trustworthy, similar in clarity to Stripe or Linear but friendly.
Also produce a logo concept (text-based SVG) and a favicon. Explain every change briefly.
```

## Prompt 4 — SEO Landing Page Generator (repeat per type)

```
Create a landing page for the QR type "[WiFi]" for the site "[BRAND NAME]".

Include:
- Title tag (under 60 chars) and meta description (under 155 chars) targeting "[wifi qr code generator]".
- One H1, a short intro, then the generator pre-selected to [WiFi].
- Sections: How to create a [WiFi] QR code (numbered steps), Why use it, Real-life use cases (at least 6), Tips for best scanning, FAQ (6 questions).
- 700-900 words of original, helpful, non-spammy content.
- JSON-LD: WebApplication (free price 0) and FAQPage.
- Internal links to 4 related QR type pages and the home page.
- Open Graph and Twitter tags.
Output the HTML for the content area and the JSON-LD separately.
```

## Prompt 5 — WordPress Version (plugin and shortcode)

```
Convert the QR generator into a WordPress plugin called "[BRAND NAME] QR Generator".

- Provide the full plugin file structure and code (main PHP file, assets/app.js, assets/styles.css).
- Register a shortcode [free_qr_generator type="url"] with the type attribute selecting the default tab (url, text, wifi, contact, email, phone, sms, whatsapp, location).
- Enqueue scripts and styles only on pages that contain the shortcode.
- Self-host qrcode-generator and jsPDF inside the plugin (no external CDN) and load them in the footer with defer.
- Scope all CSS with a unique class prefix so it does not clash with the theme.
- Support dark mode through a data attribute.
- Follow WordPress coding standards: escape output, prefix functions, use wp_enqueue_script, include readme.txt.
- Keep everything client-side. No database tables.
Also explain how to create the 9 pages and set SEO titles with Rank Math or Yoast.
```

## Prompt 6 — Content, FAQ and Legal Pages

```
Write the website copy for "[BRAND NAME]":
1. Home page hero, three-step How it works, six features, and eight FAQs (for example: Are QR codes free forever? Do they expire? Which format should I use for print? What size should I choose?).
2. A short About page.
3. A plain-language Privacy Policy stating that QR content is generated in the browser and never stored.
4. Terms of Use covering acceptable use and no warranty.
5. Microcopy for buttons, validation errors, empty state, success messages and 404.
Tone: friendly, clear, confident, no jargon. Keep sentences short.
```

## Prompt 7 — Logo Overlay and Advanced Styles (v1.5)

```
Extend the generator with:
1. Logo upload (PNG/JPG/SVG, max 2 MB) placed in the centre at 15-22% of the QR width with a rounded white padding box. Automatically switch error correction to H and warn the user.
2. Module styles: square, dots, rounded, and eye styles: square, rounded, circle.
3. Gradient fill (two colours, linear or radial).
4. Make sure PNG, JPG, SVG and PDF exports include all styling. For SVG embed the logo as base64.
5. Add a "Test scannability" hint that checks contrast and logo size and shows a green, amber or red indicator.
Keep the code modular and do not break the existing features.
```

## Prompt 8 — QA, Performance and Accessibility Audit

```
Act as a QA lead. Audit this project and return a prioritised checklist (critical, major, minor):
- Functional: all 9 QR types, all 4 download formats, long input, Unicode input, empty input, special characters in WiFi password.
- Scan test plan for iPhone camera, Android camera and Google Lens at each quality level.
- Accessibility: keyboard flow, screen reader labels, contrast, focus order, reduced motion.
- Performance: bundle size, render-blocking resources, image optimisation, Core Web Vitals fixes.
- SEO: titles, meta, headings, schema validity, sitemap, robots, canonicals.
- Security: XSS in form fields, safe handling of the logo upload, CSP header suggestion.
Give exact fixes in code where possible.
```

## Prompt 9 — Deployment and Launch

```
Give me a step-by-step deployment plan for [Cloudflare Pages / Netlify / WordPress hosting]:
- Domain and DNS setup, HTTPS, www redirect.
- Cache headers and a security headers file (CSP, X-Content-Type-Options, Referrer-Policy).
- Generating sitemap.xml and robots.txt.
- Google Search Console and Bing Webmaster setup.
- Privacy-friendly analytics setup with the events: type_selected, qr_generated, download_clicked.
- A launch checklist and a first-30-days SEO and promotion plan (Product Hunt, Reddit, directories, backlinks).
```

## Prompt 10 — Dynamic QR Backend (only for v2)

```
Design and build a backend for dynamic QR codes (editable destination, scan analytics) using [Laravel / Node + PostgreSQL].
- Tables: users, qr_codes (id, user_id, short_code, destination, type, created_at), scans (qr_id, scanned_at, country, device, referrer).
- Redirect endpoint /r/{short_code} with fast caching, 302 redirect and async scan logging.
- Free account signup, dashboard to list/edit QR codes, analytics charts.
- Abuse protection: rate limiting, blocklist of malicious domains, report button.
- API endpoints with validation and tests.
Provide the schema, routes, controllers and a deployment guide.
```

## Suggested Build Order

1. Prompt 0, then Prompt 1 (layout and UI).
2. Prompt 2 (engine and downloads).
3. Prompt 3 (polish).
4. Prompts 4 and 6 (SEO pages and content).
5. Prompt 5 if you choose WordPress.
6. Prompts 8 and 9 (QA and launch).
7. Prompt 7 after launch, and Prompt 10 only if you decide to add paid features.

A working prototype of the generator already exists from our earlier step, so you can use it as the reference for behaviour and attach its code when running Prompts 1 and 2.
