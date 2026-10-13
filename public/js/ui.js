/* QRNova UI chrome — theme + glass nav. Runs on every page; engine lives in app.js. */
'use strict';
(() => {
  // theme: remembered choice wins, else OS preference
  const root = document.documentElement, btn = document.getElementById('themeBtn');
  if (localStorage.getItem('qn-theme')) root.dataset.theme = localStorage.getItem('qn-theme');
  else if (matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.theme = 'dark';
  const sync = () => btn && btn.setAttribute('aria-pressed', root.dataset.theme === 'dark');
  sync();
  if (btn) btn.onclick = () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('qn-theme', root.dataset.theme); sync();
  };
  // print-verify checklist: reveal success when all boxes ticked
  // language toggle: multi-language chrome strings
  const LANGS = {
    zh: { generator: '生成器', features: '功能特性', faq: '常见问题', about: '关于我们', freeForever: '✓ 永久免费', noSignup: '✓ 无需注册', noWatermark: '✓ 无水印', heroSub: '链接、WiFi、联系人名片与文本 — 纯浏览器本地生成。无需注册，无水印，永不过期。', reassure: '永久免费。无需注册。数据绝不上载，全程本地生成。', copy: '复制图片', print: '快捷打印', tent: '⛺ 桌牌 A4', recent: '🕘 最近记录（仅保存在当前浏览器）', clearHist: '清除历史记录', nothingYet: '暂无记录。', verifyTitle: '✓ 打印前质量核对', v1: '打印尺寸至少 2 厘米以上，并保留四周留白', v2: '使用苹果 iPhone 和安卓手机相机分别扫码测试', v3: '核对目标网址、WiFi 密码或名片信息是否准确无误', vok: '✓ 验证通过 — 可放心大批量印刷。', tagline: '· 免费、安全、永久。您的数据绝不离开本地浏览器。', privacy: '隐私政策', terms: '服务条款', contact: '联系我们', batch: '批量生成', statTypes: 'QR 类型', statFormats: '导出格式', statPx: '最高像素', statFree: '永久', ctaT: '准备好了吗？', ctaS: '在上方创建您的第一个二维码 — 仅需二十秒。', ctaBtn: '立即创建二维码', dlHint: '请在下方选择导出格式 ↓' },
    es: { generator: 'Generador', features: 'Características', faq: 'Preguntas Frecuentes', about: 'Acerca de', freeForever: '✓ Gratis para siempre', noSignup: '✓ Sin registro', noWatermark: '✓ Sin marca de agua', heroSub: 'Enlaces, WiFi, contactos, texto y más — generado en tu navegador. Sin registro, sin marca de agua, nunca caduca.', reassure: 'Gratis para siempre. Sin registro. Nada sale de tu navegador.', copy: 'Copiar imagen', print: 'Imprimir', tent: '⛺ Carpa de mesa', recent: '🕘 Recientes (solo en este navegador)', clearHist: 'Borrar historial', nothingYet: 'Nada por ahora.', verifyTitle: '✓ Verificar antes de imprimir', v1: 'Imprime a 2 cm o más grande, con margen blanco', v2: 'Escanea con un iPhone y un Android', v3: 'Confirma que el enlace, pago o detalles sean correctos', vok: '✓ Verificado — seguro para impresión masiva.', tagline: '· Gratis, privado, para siempre. Nada sale de tu navegador.', privacy: 'Privacidad', terms: 'Términos', contact: 'Contacto', batch: 'Lote', statTypes: 'Tipos de QR', statFormats: 'Formatos', statPx: 'Píxeles máx', statFree: 'Siempre', ctaT: '¿Listo cuando tú lo estés?', ctaS: 'Crea tu primer código arriba — toma unos veinte segundos.', ctaBtn: 'Crear código QR', dlHint: 'Elige un formato abajo ↓' },
    ja: { generator: '作成ツール', features: '特徴', faq: 'よくある質問', about: '概要', freeForever: '✓ 完全無料', noSignup: '✓ 登録不要', noWatermark: '✓ 透かしなし', heroSub: 'リンク、WiFi、連絡先、テキストなど — すべてブラウザ内で生成。アカウント登録なし、透かしなし、有効期限なし。', reassure: '完全無料・登録不要。データは端末外へ送信されません。', copy: '画像をコピー', print: '印刷', tent: '⛺ 卓上POP A4', recent: '🕘 最近の履歴（このブラウザ内のみ）', clearHist: '履歴を消去', nothingYet: 'まだ履歴はありません。', verifyTitle: '✓ 印刷前チェックリスト', v1: '余白を含めて2cm以上の大きさで印刷', v2: 'iPhoneとAndroidの両方のカメラで読み取りテスト', v3: 'リンク先やWiFi情報が正しいことを確認', vok: '✓ 検証完了 — 大量印刷も安心です。', tagline: '· 無料・プライベート・無期限。ブラウザ外へデータは出ません。', privacy: 'プライバシー', terms: '利用規約', contact: 'お問い合わせ', batch: '一括作成', statTypes: 'QRの種類', statFormats: '保存形式', statPx: '最高解像度', statFree: '永久', ctaT: '今すぐ始めましょう', ctaS: '上のフォームから最初のQRコードを作成 — わずか20秒で完成。', ctaBtn: 'QRコードを作成', dlHint: '下の保存形式を選択 ↓' },
    pt: { generator: 'Gerador', features: 'Recursos', faq: 'Perguntas Frecuentes', about: 'Sobre', freeForever: '✓ Grátis para sempre', noSignup: '✓ Sem cadastro', noWatermark: '✓ Sem marca d’água', heroSub: 'Links, Wi-Fi, contatos, texto e mais — gerado no seu navegador. Sem cadastro, sem marca d’água, nunca expira.', reassure: 'Grátis para sempre. Sem cadastro. Nada sai do seu navegador.', copy: 'Copiar imagem', print: 'Imprimir', tent: '⛺ Display de mesa', recent: '🕘 Recentes (somente neste navegador)', clearHist: 'Limpar histórico', nothingYet: 'Nada por enquanto.', verifyTitle: '✓ Conferir antes de imprimir', v1: 'Imprima em 2 cm ou maior, com margem branca', v2: 'Escaneie com um iPhone e um Android', v3: 'Confirme que o link, pagamento ou dados estão corretos', vok: '✓ Verificado — pronto para impressão em massa.', tagline: '· Grátis, privado, para sempre. Nada sai do seu navegador.', privacy: 'Privacidade', terms: 'Termos', contact: 'Contato', batch: 'Em lote', statTypes: 'Tipos de QR', statFormats: 'Formatos', statPx: 'Pixels máx', statFree: 'Sempre', ctaT: 'Pronto quando você estiver', ctaS: 'Crie seu primeiro código acima — leva cerca de vinte segundos.', ctaBtn: 'Criar código QR', dlHint: 'Escolha o formato abaixo ↓' },
    ko: { generator: '생성기', features: '기능', faq: '자주 묻는 질문', about: '소개', freeForever: '✓ 평생 무료', noSignup: '✓ 가입 없음', noWatermark: '✓ 워터마크 없음', heroSub: '링크, 와이파이, 연락처, 텍스트 등 — 브라우저에서 직접 생성. 가입 불필요, 워터마크 없음, 만료 없음.', reassure: '평생 무료. 가입 불필요. 브라우저 외부로 데이터가 전송되지 않습니다.', copy: '이미지 복사', print: '인쇄', tent: '⛺ 테이블 텐트 A4', recent: '🕘 최근 기록 (이 브라우저에만 저장)', clearHist: '기록 삭제', nothingYet: '아직 기록이 없습니다.', verifyTitle: '✓ 인쇄 전 품질 확인', v1: '여백을 포함하여 최소 2cm 이상 크기로 인쇄', v2: '아이폰 및 안드로이드 카메라로 모두 스캔 테스트', v3: '링크 주소, 와이파이 또는 상세 정보가 올바른지 확인', vok: '✓ 검증 완료 — 대량 인쇄 준비 완료.', tagline: '· 무료, 비공개, 영구적. 데이터가 브라우저를 벗어나지 않습니다.', privacy: '개인정보처리방침', terms: '이용약관', contact: '문의하기', batch: '일괄 생성', statTypes: 'QR 종류', statFormats: '다운로드 형식', statPx: '최대 픽셀', statFree: '영구', ctaT: '준비되셨나요?', ctaS: '위에서 첫 번째 QR 코드를 만드세요 — 20초면 충분합니다.', ctaBtn: 'QR 코드 생성하기', dlHint: '아래에서 저장 형식을 선택하세요 ↓' },
    ru: { generator: 'Генератор', features: 'Возможности', faq: 'Частые вопросы', about: 'О сервисе', freeForever: '✓ Навсегда бесплатно', noSignup: '✓ Без регистрации', noWatermark: '✓ Без водяных знаков', heroSub: 'Ссылки, Wi-Fi, контакты, текст и многое другое — прямо в вашем браузере. Без регистрации, без водяных знаков, без срока действия.', reassure: 'Навсегда бесплатно. Без регистрации. Данные не покидают ваш браузер.', copy: 'Копировать', print: 'Печать', tent: '⛺ Настольная табличка', recent: '🕘 Недавние (только в этом браузере)', clearHist: 'Очистить историю', nothingYet: 'Пока ничего нет.', verifyTitle: '✓ Проверка перед печатью', v1: 'Печатайте размером от 2 см с белыми полями', v2: 'Отсканируйте камерой iPhone и Android', v3: 'Убедитесь, что ссылка, оплата или данные верны', vok: '✓ Проверено — готово к массовой печати.', tagline: '· Бесплатно, конфиденциально, навсегда. Данные остаются на вашем устройстве.', privacy: 'Конфиденциальность', terms: 'Условия использования', contact: 'Контакты', batch: 'Пакетный режим', statTypes: 'Типов QR', statFormats: 'Форматов', statPx: 'Макс. пикселей', statFree: 'Навсегда', ctaT: 'Готовы создать?', ctaS: 'Создайте свой первый код выше — это займет всего 20 секунд.', ctaBtn: 'Создать QR-код', dlHint: 'Выберите формат ниже ↓' },
    ne: { generator: 'जेनेरेटर', features: 'विशेषता', faq: 'सोधिने प्रश्न', about: 'बारेमा', freeForever: '✓ सधैं निःशुल्क', noSignup: '✓ साइन-अप छैन', noWatermark: '✓ वाटरमार्क छैन', heroSub: 'लिङ्क, वाइफाइ, सम्पर्क, पाठ र थप — तपाईंको ब्राउजरमै बन्छ। साइन-अप छैन, वाटरमार्क छैन, म्याद सकिँदैन।', reassure: 'सधैं निःशुल्क। साइन-अप छैन। तपाईंको ब्राउजरबाट केही बाहिर जाँदैन।', copy: 'कपी', print: 'प्रिन्ट', tent: '⛺ टेबल टेन्ट', recent: '🕘 भर्खरका (यही ब्राउजरमा मात्र)', clearHist: 'इतिहास मेट्नुहोस्', nothingYet: 'अहिलेसम्म केही छैन।', verifyTitle: '✓ प्रिन्ट जाँच्नुहोस्', v1: '२ सेमी वा ठूलोमा, मार्जिनसहित प्रिन्ट गर्नुहोस्', v2: 'आइफोन र एन्ड्रोइड दुवैबाट स्क्यान गर्नुहोस्', v3: 'लिङ्क, भुक्तानी वा विवरण सही भएको पुष्टि गर्नुहोस्', vok: '✓ प्रमाणित — अब धेरै प्रिन्ट गर्न सुरक्षित।', tagline: '· निःशुल्क, निजी, सधैं। तपाईंको ब्राउजरबाट केही बाहिर जाँदैन।', privacy: 'गोपनीयता', terms: 'सर्तहरू', contact: 'सम्पर्क', batch: 'ब्याच', statTypes: 'QR प्रकार', statFormats: 'डाउनलोड ढाँचा', statPx: 'अधिकतम पिक्सेल', statFree: 'सधैं', ctaT: 'तयार हुनुहुन्छ?', ctaS: 'माथि आफ्नो पहिलो कोड बनाउनुहोस् — बीस सेकेन्ड मात्र लाग्छ।', ctaBtn: 'QR कोड बनाउनुहोस्', dlHint: 'तल ढाँचा छान्नुहोस् ↓' },
    hi: { generator: 'जनरेटर', features: 'फीचर्स', faq: 'सामान्य प्रश्न', about: 'परिचय', freeForever: '✓ हमेशा मुफ्त', noSignup: '✓ साइन-अप नहीं', noWatermark: '✓ वॉटरमार्क नहीं', heroSub: 'लिंक, वाईफाई, संपर्क, टेक्स्ट और बहुत कुछ — आपके ब्राउजर में बनता है। साइन-अप नहीं, वॉटरमार्क नहीं, एक्सपायरी नहीं।', reassure: 'हमेशा मुफ्त। साइन-अप नहीं। आपके ब्राउजर से कुछ बाहर नहीं जाता।', copy: 'कॉपी', print: 'प्रिंट', tent: '⛺ टेबल टेंट', recent: '🕘 हाल के (सिर्फ इसी ब्राउजर में)', clearHist: 'इतिहास साफ़ करें', nothingYet: 'अभी कुछ नहीं।', verifyTitle: '✓ प्रिंट जांचें', v1: '2 सेमी या बड़े आकार में, मार्जिन के साथ प्रिंट करें', v2: 'आईफोन और एंड्रॉयड दोनों से स्कैन करें', v3: 'लिंक, पेमेंट या विवरण सही है, पुष्टि करें', vok: '✓ सत्यापित — अब बल्क प्रिंट सुरक्षित है।', tagline: '· मुफ्त, निजी, हमेशा। आपके ब्राउजर से कुछ बाहर नहीं जाता।', privacy: 'गोपनीयता', terms: 'शर्तें', contact: 'संपर्क', batch: 'बैच', statTypes: 'QR प्रकार', statFormats: 'डाउनलोड फॉर्मेट', statPx: 'अधिकतम पिक्सेल', statFree: 'हमेशा', ctaT: 'तैयार हैं?', ctaS: 'ऊपर अपना पहला कोड बनाएं — सिर्फ बीस सेकंड लगते हैं।', ctaBtn: 'QR कोड बनाएं', dlHint: 'नीचे फॉर्मेट चुनें ↓' },
    ar: { generator: 'المولّد', features: 'المزايا', faq: 'الأسئلة الشائعة', about: 'حول', freeForever: '✓ مجاني للأبد', noSignup: '✓ بدون تسجيل', noWatermark: '✓ بدون علامة مائية', heroSub: 'روابط وواي فاي وجهات اتصال ونصوص والمزيد — تُنشأ في متصفحك. بدون تسجيل، بدون علامة مائية، بدون انتهاء.', reassure: 'مجاني للأبد. بدون تسجيل. لا شيء يغادر متصفحك.', copy: 'نسخ', print: 'طباعة', tent: '⛺ خيمة طاولة', recent: '🕘 الأخيرة (في هذا المتصفح فقط)', clearHist: 'مسح السجل', nothingYet: 'لا شيء بعد.', verifyTitle: '✓ تحقق من الطباعة', v1: 'اطبع بحجم 2 سم أو أكبر، مع هامش', v2: 'امسح بهاتف آيفون وأندرويد', v3: 'تأكد من صحة الرابط أو الدفع أو التفاصيل', vok: '✓ تم التحقق — الطباعة بكميات آمنة.', tagline: '· مجاني، خاص، للأبد. لا شيء يغادر متصفحك.', privacy: 'الخصوصية', terms: 'الشروط', contact: 'اتصل', batch: 'دفعة', statTypes: 'أنواع QR', statFormats: 'صيغ التنزيل', statPx: 'أقصى دقة', statFree: 'للأبد', ctaT: 'جاهز؟', ctaS: 'أنشئ رمزك الأول أعلاه — يستغرق عشرين ثانية فقط.', ctaBtn: 'أنشئ رمز QR', dlHint: 'اختر الصيغة أدناه ↓' },
  };
  function applyLang() {
    const l = localStorage.getItem('qn-lang') || 'en', d = LANGS[l] || {};
    document.querySelectorAll('[data-i18n]').forEach(el => {
      if (el.dataset.en === undefined) el.dataset.en = el.textContent; // remember English once
      const k = el.dataset.i18n;
      el.textContent = l === 'en' ? el.dataset.en : (d[k] || el.dataset.en);
    });
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'; // RTL-ready
    const names = { en: 'English', zh: '中文 (简体)', es: 'Español', ja: '日本語', pt: 'Português', ko: '한국어', ru: 'Русский', ne: 'नेपाली', hi: 'हिन्दी', ar: 'العربية' };
    const flag = document.getElementById('langFlag'), btn = document.getElementById('langBtn');
    if (flag) flag.className = 'flag fl-' + l;
    if (btn) btn.setAttribute('aria-label', 'Language: ' + (names[l] || l));
    document.querySelectorAll('#langMenu [data-lang]').forEach(b => b.setAttribute('aria-checked', b.dataset.lang === l));
  }
  window.__applyLang = applyLang; // engine calls after rendering dynamic strings
  applyLang();
  document.addEventListener('click', (e) => {
    const lb = e.target.closest('#langMenu [data-lang]');
    const tgl = e.target.closest('#langBtn'), menu = document.getElementById('langMenu');
    if (tgl && menu) {
      const open = menu.hidden;
      menu.hidden = !open; tgl.setAttribute('aria-expanded', open);
      e.stopPropagation(); return;
    }
    if (lb) {
      localStorage.setItem('qn-lang', lb.dataset.lang); applyLang();
      const m = document.getElementById('langMenu'); if (m) m.hidden = true;
      const b = document.getElementById('langBtn'); if (b) b.setAttribute('aria-expanded', 'false');
    }
    if (menu && !menu.hidden && !e.target.closest('.langwrap')) { menu.hidden = true; document.getElementById('langBtn').setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { const menu = document.getElementById('langMenu'); if (menu && !menu.hidden) { menu.hidden = true; document.getElementById('langBtn').setAttribute('aria-expanded', 'false'); } }
  });
  document.addEventListener('change', (e) => {
    if (e.target.classList && e.target.classList.contains('vchk')) {
      const box = e.target.closest('.verify');
      box.querySelector('.vok').hidden = ![...box.querySelectorAll('.vchk')].every(c => c.checked);
    }
  });
  // mobile hamburger → glass dropdown
  const tgl = document.getElementById('navToggle'), links = document.getElementById('navLinks');
  if (tgl && links) {
    const set = (open) => { links.classList.toggle('open', open); tgl.setAttribute('aria-expanded', open); tgl.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); };
    tgl.onclick = (e) => { e.stopPropagation(); set(!links.classList.contains('open')); };
    links.addEventListener('click', (e) => { if (e.target.tagName === 'A') set(false); });
    document.addEventListener('click', (e) => { if (!e.target.closest('.navbar')) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); tgl.blur(); } });
  }
})();
