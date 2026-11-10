/* IELTS Yol Koçu — app logic (no build step, no dependencies). */
(() => {
  'use strict';
  const C = window.CONTENT;
  const L = window.LEARN || { models: {}, bank: [], examples: {} };
  const G = window.GLOSSARY || {};
  const GF = window.GLOSSARY_FORMS || {};
  const main = document.getElementById('main');
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s).toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, ' ').replace(/[.,!?;:]+$/, '').trim();
  const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const rnd = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rnd(a.length)];

  // ---------- icons (inline SVG, stroke = currentColor) ----------
  const ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    cards: '<rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 3h11a2 2 0 0 1 2 2v12"/>',
    chart: '<path d="M4 20V11M10 20V5M16 20v-6M2 20h20"/>',
    headphones: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z"/>',
    pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    lines: '<path d="M4 5h16M4 10h16M4 15h16M4 20h9"/>',
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/>',
    quote: '<path d="M6 8h4v4c0 3-1.5 4.5-4 5.5M14 8h4v4c0 3-1.5 4.5-4 5.5"/>',
    hash: '<path d="M5 9h14M5 15h14M10 3 8 21M16 3l-2 18"/>',
    volume: '<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>',
    play: '<path d="M7 4.5v15l12.5-7.5z"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="1.5"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    check: '<path d="M4 12.5l5 5L20 6.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    chev: '<path d="M9 5l7 7-7 7"/>',
    flame: '<path d="M12 22c4 0 7-3 7-7.5 0-4.5-4.5-6.5-5-11.5-3 2-5.5 5-5.5 8.5-1-.8-1.8-2-2-3.5C4.8 9.8 5 12 5 14.5 5 19 8 22 12 22z"/>',
    bulb: '<path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/>',
    pointer: '<path d="M9 11V5a2 2 0 0 1 4 0v5M13 10a2 2 0 0 1 4 0v2M17 11.5a2 2 0 0 1 4 0V15a7 7 0 0 1-7 7h-1.5a7 7 0 0 1-5.6-2.8L3.6 15a2 2 0 0 1 3-2.6L9 15"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>',
    upload: '<path d="M12 21V9M7 14l5-5 5 5M4 3h16"/>'
  };
  const ic = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;

  // Wrap every English word in a tappable span (escape each piece separately so entities are never split).
  const tw = (s) => String(s).split(/([A-Za-z][A-Za-z'’-]*[A-Za-z]|[A-Za-z])/).map((p, i) => (i % 2 ? `<span class="w">${esc(p)}</span>` : esc(p))).join('');

  // ---------- dates ----------
  const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const today = () => iso(new Date());
  const addDays = (k, n) => { const d = new Date(k + 'T00:00:00'); d.setDate(d.getDate() + n); return iso(d); };
  const dayDiff = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);

  // ---------- state ----------
  const KEY = 'ielts-koc-v1';
  const fresh = () => ({
    start: today(), examDate: '', log: {}, grammar: {}, mistakes: [], vocab: {}, reading: {},
    listening: { dict: { right: 0, total: 0 }, scripts: {} },
    writing: { drafts: {}, history: [] },
    myWords: {}, lookups: {},
    settings: { rate: 0.9, blurTr: false }
  });
  const hydrate = (saved) => {
    const f = fresh();
    const s = Object.assign(f, saved);
    s.listening = Object.assign(fresh().listening, saved.listening || {});
    s.writing = Object.assign(fresh().writing, saved.writing || {});
    s.settings = Object.assign(fresh().settings, saved.settings || {});
    s.myWords = saved.myWords || {};
    s.lookups = saved.lookups || {};
    return s;
  };
  let S = fresh();
  try { const saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved) S = hydrate(saved); } catch (e) { /* storage unavailable: run in memory */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };
  save();

  const DAILY = { listening: 10, reading: 1, vocab: 20, grammar: 1, writing: 1 };
  const logAct = (kind, n = 1) => {
    const k = today();
    S.log[k] = S.log[k] || {};
    S.log[k][kind] = (S.log[k][kind] || 0) + n;
    save(); renderStreak();
  };
  const todayLog = () => S.log[today()] || {};
  const isDone = (kind) => (todayLog()[kind] || 0) >= DAILY[kind];
  const activeDay = (k) => { const l = S.log[k]; return l && Object.values(l).some((v) => v > 0); };
  const streak = () => {
    let k = today(), n = 0;
    if (!activeDay(k)) k = addDays(k, -1);
    while (activeDay(k)) { n++; k = addDays(k, -1); }
    return n;
  };
  const renderStreak = () => { const n = streak(); $('#streak').innerHTML = n ? ic('flame') + n + ' gün' : ''; };

  const dayNo = () => Math.max(1, dayDiff(S.start, today()) + 1);
  const weekNo = () => Math.ceil(dayNo() / 7);
  const phase = () => (weekNo() <= 4 ? 1 : weekNo() <= 8 ? 2 : 3);
  const PHASES = { 1: 'Faz 1 · Temel', 2: 'Faz 2 · Beceri', 3: 'Faz 3 · Deneme sınavı' };

  // ---------- ui helpers ----------
  let cleanups = [];
  const onCleanup = (fn) => cleanups.push(fn);
  const toast = (msg) => {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2200);
  };
  const setHeader = (title, backTo) => {
    $('#title').textContent = title;
    const b = $('#backBtn');
    b.hidden = !backTo;
    b.innerHTML = ic('back');
    b.onclick = () => { location.hash = backTo; };
  };
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const item = (href, icon, title, sub, opts = {}) =>
    `<a class="item ${opts.done ? 'done' : ''}" href="${href}">${opts.num ? `<span class="num">${opts.num}</span>` : `<span class="ico ${opts.gold ? 'gold' : ''}">${ic(opts.done ? 'check' : icon)}</span>`}<span class="grow"><span class="t">${title}</span>${sub ? `<span class="s">${sub}</span>` : ''}</span>${opts.badge || `<span class="chev">${ic('chev')}</span>`}</a>`;
  const sayBtn = (text) => `<button class="btn icon ghost" data-say="${esc(text)}" aria-label="Dinle">${ic('volume')}</button>`;
  const bindSay = (root = main) => $$('[data-say]', root).forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); tts.speak(b.dataset.say); }));
  const pairHtml = ([en, tr]) => `<div class="pair"><div class="grow"><div class="en">${tw(en)}</div><div class="tr ${S.settings.blurTr ? 'blur' : ''}">${esc(tr)}</div></div>${sayBtn(en)}</div>`;
  const bindPairs = (root = main) => $$('.tr.blur', root).forEach((t) => t.addEventListener('click', () => t.classList.remove('blur')));
  const blurToggle = () => `<button class="btn small ghost" id="blurT">${ic('eye')} ${S.settings.blurTr ? 'Türkçeyi göster' : 'Türkçeyi gizle'}</button>`;
  const bindBlurToggle = (rerender) => { const b = $('#blurT'); if (b) b.onclick = () => { S.settings.blurTr = !S.settings.blurTr; save(); rerender(); }; };

  // ---------- speech ----------
  const tts = {
    ok: 'speechSynthesis' in window,
    voices: [],
    load() {
      if (!this.ok) return;
      const en = speechSynthesis.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
      this.voices = en.filter((v) => /GB/i.test(v.lang)).concat(en.filter((v) => !/GB/i.test(v.lang)));
    },
    speak(parts, onEnd) {
      if (!this.ok) { toast('Bu tarayıcı sesli okumayı desteklemiyor.'); return; }
      speechSynthesis.cancel();
      this.load();
      const list = Array.isArray(parts) ? parts : [{ text: parts, v: 0 }];
      list.forEach((p, i) => {
        const u = new SpeechSynthesisUtterance(p.text);
        u.lang = 'en-GB';
        const v = this.voices[p.v && this.voices.length > 1 ? 1 : 0];
        if (v) u.voice = v;
        if (p.v && this.voices.length < 2) u.pitch = 0.75;
        u.rate = S.settings.rate || 0.9;
        if (i === list.length - 1 && onEnd) u.onend = onEnd;
        speechSynthesis.speak(u);
      });
    },
    stop() { if (this.ok) speechSynthesis.cancel(); }
  };
  if (tts.ok) { tts.load(); speechSynthesis.onvoiceschanged = () => tts.load(); }
  const voiceWarning = () => (tts.ok && tts.voices.length === 0
    ? '<div class="note">İngilizce ses bulunamadı. Android\'de: <b>Ayarlar → Metin okuma çıktısı → Google → Ses verilerini yükle → English (UK)</b>. Offline kullanım için indir.</div>'
    : (!tts.ok ? '<div class="note">Bu tarayıcı sesli okumayı desteklemiyor. Chrome kullan.</div>' : ''));

  // ---------- dictionary (tap a word) ----------
  const POS = { 'i.': 'isim', 'f.': 'fiil', 's.': 'sıfat', 'z.': 'zarf', 'bağ.': 'bağlaç', 'ed.': 'edat' };
  function lemmas(raw) {
    const w = raw.toLowerCase().replace(/[’]/g, "'").replace(/'s$|'$/, '');
    const out = [w];
    const add = (x) => { if (x && x.length > 1) out.push(x); };
    if (GF[w]) add(GF[w]);
    if (w.endsWith('ies')) add(w.slice(0, -3) + 'y');
    if (w.endsWith('es')) add(w.slice(0, -2));
    if (w.endsWith('s')) add(w.slice(0, -1));
    if (w.endsWith('ied')) add(w.slice(0, -3) + 'y');
    if (w.endsWith('ed')) { add(w.slice(0, -2)); add(w.slice(0, -1)); if (/(.)\1ed$/.test(w)) add(w.slice(0, -3)); }
    if (w.endsWith('ing')) { add(w.slice(0, -3)); add(w.slice(0, -3) + 'e'); if (/(.)\1ing$/.test(w)) add(w.slice(0, -4)); }
    if (w.endsWith('ily')) add(w.slice(0, -3) + 'y');
    if (w.endsWith('ly')) add(w.slice(0, -2));
    if (w.endsWith('ier')) add(w.slice(0, -3) + 'y');
    if (w.endsWith('er')) { add(w.slice(0, -2)); add(w.slice(0, -1)); }
    if (w.endsWith('est')) { add(w.slice(0, -3)); add(w.slice(0, -2)); }
    return [...new Set(out)];
  }
  function parseGloss(s) {
    const parts = s.split(' · ');
    const pos = POS[parts[0]] ? POS[parts[0]] : '';
    return { pos, tr: (pos ? parts.slice(1) : parts).join(' · ') };
  }
  function lookupLocal(raw) {
    for (const k of lemmas(raw)) {
      if (S.myWords[k]) return { key: k, tr: S.myWords[k].tr, pos: S.myWords[k].pos || '', src: 'mine' };
      const v = C.vocab.find((x) => x.w.toLowerCase() === k);
      if (v) return { key: k, tr: v.tr, col: v.col, ex: v.ex, src: 'vocab' };
      if (G[k]) return Object.assign({ key: k, src: 'gloss' }, parseGloss(G[k]));
      if (S.lookups[k]) return Object.assign({ key: k, src: 'web' }, S.lookups[k]);
    }
    return null;
  }
  async function lookupOnline(word) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 7000);
    const q = encodeURIComponent(word);
    const [tr, dict] = await Promise.allSettled([
      fetch('https://api.mymemory.translated.net/get?q=' + q + '&langpair=en|tr', { signal: ctrl.signal }).then((r) => r.json()),
      fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + q, { signal: ctrl.signal }).then((r) => (r.ok ? r.json() : null))
    ]);
    clearTimeout(t);
    const res = {};
    if (tr.status === 'fulfilled' && tr.value && tr.value.responseData) {
      const x = String(tr.value.responseData.translatedText || '').trim();
      if (x && x.toLowerCase() !== word.toLowerCase() && !/MYMEMORY|QUERY LENGTH/i.test(x)) res.tr = x.toLowerCase();
    }
    if (dict.status === 'fulfilled' && Array.isArray(dict.value) && dict.value[0]) {
      const e = dict.value[0];
      if (e.word && e.word.length <= word.length) res.word = e.word.toLowerCase();
      res.ph =e.phonetic || (e.phonetics || []).map((p) => p.text).find(Boolean) || '';
      const m = (e.meanings || [])[0];
      if (m) { res.posEn = m.partOfSpeech; res.def = ((m.definitions || [])[0] || {}).definition || ''; }
    }
    return res.tr || res.def ? res : null;
  }
  const allCards = () => C.vocab.concat(Object.entries(S.myWords).map(([w, v]) => ({ w, tr: v.tr, col: v.pos || '', ex: v.ex || '', mine: true })));
  const hasCard = (k) => !!S.myWords[k] || C.vocab.some((x) => x.w.toLowerCase() === k);

  const sheet = $('#sheet'), sheetBack = $('#sheetBack');
  let hlEl = null;
  function closeSheet() {
    sheet.classList.remove('open'); sheetBack.classList.remove('open');
    if (hlEl) { hlEl.classList.remove('hl'); hlEl = null; }
  }
  sheetBack.addEventListener('click', closeSheet);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

  function contextOf(el, raw) {
    const host = el.closest('.en, .passage p, .q-text, .exs, .model, .para p, li, .ctx-src') || el.parentElement;
    const text = (host ? host.textContent : '').replace(/\s+/g, ' ').trim();
    const sentences = text.split(/(?<=[.!?])\s+/);
    const s = sentences.find((x) => x.toLowerCase().includes(raw.toLowerCase())) || '';
    return s.length > 240 ? s.slice(0, 237) + '…' : s;
  }

  function renderSheet(raw, info, ctx, loading) {
    const key = info ? info.key : raw.toLowerCase();
    const inflected = info && info.key !== raw.toLowerCase() ? `<span class="ph">(${esc(raw)})</span>` : '';
    const ph = info && info.ph ? `<span class="ph">${esc(info.ph)}</span>` : '';
    let body;
    if (loading) body = '<div class="mean muted">Sözlükte aranıyor…</div>';
    else if (!info) body = `<div class="mean muted">${navigator.onLine ? 'Bu kelime için anlam bulunamadı.' : 'Bu kelime offline sözlükte yok. İnternet gelince tekrar dokun.'}</div>`;
    else {
      body = `<div class="mean">${info.pos ? `<span class="pos">${esc(info.pos)}</span>` : info.posEn ? `<span class="pos">${esc(info.posEn)}</span>` : ''}${esc(info.tr || '')}</div>
        ${info.col ? `<div class="def">Kalıp: <b>${esc(info.col)}</b></div>` : ''}
        ${info.def && !info.tr ? `<div class="def">EN: ${esc(info.def)}</div>` : ''}
        ${info.src === 'web' ? '<div class="def" style="font-size:.78rem">Kaynak: çevrimiçi sözlük</div>' : ''}`;
    }
    const exLine = ctx || (info && info.ex);
    const canAdd = info && info.tr && !hasCard(key);
    sheet.innerHTML = `<div class="grab"></div>
      <div class="row"><div class="grow"><span class="word">${esc(key)}</span>${inflected}${ph}</div>
        <button class="btn icon" id="wSay" aria-label="Dinle">${ic('volume')}</button>
        <button class="btn icon" id="wClose" aria-label="Kapat">${ic('x')}</button></div>
      ${body}
      ${exLine ? `<div class="ctx">${esc(exLine)}</div>` : ''}
      ${info && info.tr ? (canAdd ? `<button class="btn primary block" id="wAdd">${ic('plus')} Kelime kartlarıma ekle</button>` : `<div class="badge ok" style="margin-top:6px">${ic('check')} Kelime kartlarında var</div>`) : ''}`;
    $('#wSay').onclick = () => tts.speak(key);
    $('#wClose').onclick = closeSheet;
    const add = $('#wAdd');
    if (add) add.onclick = () => {
      S.myWords[key] = { tr: info.tr, pos: info.pos || info.posEn || '', ex: exLine || '', added: today() };
      save(); toast('Kartlarına eklendi'); renderSheet(raw, info, ctx, false);
    };
  }

  async function openWord(el) {
    const raw = el.textContent.replace(/^[-']+|[-']+$/g, '');
    if (hlEl) hlEl.classList.remove('hl');
    hlEl = el; el.classList.add('hl');
    const ctx = contextOf(el, raw);
    const info = lookupLocal(raw);
    renderSheet(raw, info, ctx, !info && navigator.onLine);
    sheet.classList.add('open'); sheetBack.classList.add('open');
    if (info || !navigator.onLine) return;
    const q = lemmas(raw)[0];
    let res = null;
    try { res = await lookupOnline(q); } catch (e) { res = null; }
    const base = (res && res.word) || q;
    if (res) { S.lookups[base] = res; if (base !== q) S.lookups[q] = res; save(); }
    if (hlEl === el) renderSheet(raw, res ? Object.assign({ key: base, src: 'web' }, res) : null, ctx, false);
  }
  document.addEventListener('click', (e) => {
    const w = e.target.closest('.w');
    if (w && !w.closest('button, a, .opt')) openWord(w);
  });

  // ---------- today ----------
  const TIPS = [
    'Task 2 puanın 2/3\'ü demek. Writing\'de önceliği essay\'e ver.',
    'Task 1\'de overview (genel eğilim) yazmazsan Task Achievement Band 5–6\'yı geçmez.',
    'Reading\'de NOT GIVEN = metin bu konuda hiçbir şey söylemiyor. FALSE = metin tersini söylüyor.',
    'Listening\'de yazım hatası = yanlış cevap. Çoğul -s\'yi kontrol et.',
    'Speaking puanın %25\'i. Evde haftada 2–3 kez 10 dakika sesli Part 2 pratiği yap.',
    'Bağlacı her cümleye koyma. Band 7 "doğal" cohesion ister, mekanik değil.',
    'Kelime öğrenirken tek kelime değil collocation öğren: "have an impact ON".',
    'Sınav bilgisayarda. Yazma pratiğini klavyede/telefonda yapman avantaj.',
    'Present Perfect + belirli geçmiş tarih (in 2019) birlikte kullanılmaz.',
    'Task 1\'de kendi yorumunu ya da sebep tahmini yazma. Sadece veriyi raporla.',
    'Model essay okurken bilmediğin kelimeye dokun ve kartlarına ekle. Kelime bağlamla daha kalıcı öğrenilir.'
  ];

  function nextGrammarUnit() { return C.grammar.find((u) => !(S.grammar[u.id] && S.grammar[u.id].done)) || null; }
  function nextReading() {
    const unseen = C.reading.find((r) => !S.reading[r.id]);
    if (unseen) return unseen;
    return C.reading.slice().sort((a, b) => (S.reading[a.id].best / S.reading[a.id].total) - (S.reading[b.id].best / S.reading[b.id].total))[0];
  }
  function writingSuggestion() {
    const t1 = C.writing.filter((w) => w.task === 1), t2 = C.writing.filter((w) => w.task === 2);
    const d = dayNo(), ph = phase();
    if (ph === 1) {
      const modes = [['intro', t2], ['body', t2], ['overview', t1]];
      const [mode, pool] = modes[d % 3];
      const w = pool[Math.floor(d / 3) % pool.length];
      return { w, mode, label: mode === 'intro' ? 'Task 2 giriş paragrafı' : mode === 'body' ? 'Task 2 tek body paragrafı' : 'Task 1 giriş + overview' };
    }
    const pool = d % 2 ? t1 : t2;
    const w = pool[Math.floor(d / 2) % pool.length];
    return { w, mode: 'full', label: (w.task === 1 ? 'Task 1 tam yazı' : 'Task 2 tam essay') + (ph === 3 ? ' · süreli' : '') };
  }
  function ring(done, total) {
    const r = 32, c = 2 * Math.PI * r, f = c * (done / total);
    return `<div class="ring"><svg viewBox="0 0 76 76"><circle cx="38" cy="38" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="6"/>${done ? `<circle cx="38" cy="38" r="${r}" fill="none" stroke="var(--gold)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${f} ${c}"/>` : ''}</svg><div class="lbl"><div>${done}/${total}<small>BUGÜN</small></div></div></div>`;
  }

  function viewToday() {
    setHeader('IELTS Yol Koçu');
    const d = dayNo(), ph = phase(), L0 = todayLog();
    const exam = S.examDate ? dayDiff(today(), S.examDate) : null;
    const g = nextGrammarUnit(), r = nextReading(), ws = writingSuggestion();
    const listenHref = ph >= 2 && d % 2 === 0 ? '#/listening/' + C.listening[Math.floor(d / 2) % C.listening.length].id : '#/listening/dict';
    const listenSub = listenHref === '#/listening/dict' ? `Sayı, tarih, harfleme dikte · ${Math.min(L0.listening || 0, 10)}/10` : 'Part 1/2 kaydı + form doldurma';
    const morning = `<div class="section-label">Sabah · dinle & oku</div>
      ${item(listenHref, 'headphones', 'Listening', listenSub, { done: isDone('listening') })}
      ${item('#/reading/' + r.id, 'file', 'Reading', esc(r.title) + ' · 20 dk', { done: isDone('reading') })}
      ${item('#/vocab', 'cards', 'Kelime kartları', `Aralıklı tekrar · ${Math.min(L0.vocab || 0, 20)}/20`, { done: isDone('vocab') })}`;
    const evening = `<div class="section-label">Akşam · yaz & üret</div>
      ${g ? item('#/grammar/' + g.id, 'pen', 'Gramer: ' + esc(g.title), 'Kural, örnekler, 8 alıştırma', { done: isDone('grammar') })
          : item('#/mistakes', 'refresh', 'Gramer: Hata defteri', `${S.mistakes.length} kayıtlı hata`, { done: isDone('grammar') })}
      ${item('#/writing/' + ws.w.id + '/' + ws.mode, 'lines', 'Writing: ' + esc(ws.label), esc(ws.w.title), { done: isDone('writing') })}`;
    const doneCount = Object.keys(DAILY).filter(isDone).length;
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar';
    const dateStr = new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
    const allBank = L.bank.flatMap((b) => b.items);
    const sod = allBank.length ? allBank[(d * 7) % allBank.length] : null;
    main.innerHTML = `
      <div class="card hero">
        <div class="grow">
          <div class="greet">${greet}</div>
          <div class="date">${esc(dateStr)}</div>
          <div style="margin-top:10px;font-size:.9rem"><b>Gün ${d}</b> / 84 · ${PHASES[ph]}</div>
          <div class="phase">${[1, 2, 3].map((p) => `<span class="${p <= ph ? 'on' : ''}"></span>`).join('')}</div>
          <div class="date" style="margin-top:8px">${exam !== null ? (exam >= 0 ? `Sınava <b style="color:var(--text)">${exam}</b> gün` : 'Sınav tarihi geçti') : '<a href="#/progress">Sınav tarihini ekle</a>'}</div>
        </div>
        ${ring(doneCount, 5)}
      </div>
      ${hour >= 14 ? evening + morning : morning + evening}
      ${sod ? `<div class="section-label">Günün cümlesi</div><div class="card">${pairHtml(sod)}<div class="hint" style="margin:8px 0 0">${ic('pointer')} Bilmediğin kelimeye dokun</div></div>` : ''}
      <div class="card"><div class="row" style="align-items:flex-start"><span class="ico gold">${ic('bulb')}</span><div class="grow"><b>Günün ipucu</b><p style="margin:2px 0 0">${TIPS[d % TIPS.length]}</p></div></div></div>`;
    bindSay(); bindPairs();
  }

  // ---------- learn hub ----------
  function viewLearn() {
    setHeader('Öğren');
    const gDone = C.grammar.filter((u) => S.grammar[u.id] && S.grammar[u.id].done).length;
    const bankN = L.bank.reduce((n, b) => n + b.items.length, 0);
    main.innerHTML = `
      <div class="note">${ic('pointer')} İngilizce metinlerin hepsinde <b>bilmediğin kelimeye dokun</b>: Türkçe anlamı, telaffuzu ve cümledeki kullanımı açılır. İstersen tek dokunuşla kelime kartlarına eklersin.</div>
      ${item('#/grammar', 'pen', 'Gramer & cümle kurma', `${C.grammar.length} ünite · ${gDone} tamamlandı`)}
      ${item('#/bank', 'quote', 'Cümle bankası', `${bankN} kalıp cümle, Türkçesiyle · işlevine göre`, { gold: true })}
      ${item('#/models', 'award', 'Model yazılar (Band 7+)', `${Object.keys(L.models).length} örnek Task 1 & Task 2 cevabı, açıklamalı`, { gold: true })}
      ${item('#/mistakes', 'refresh', 'Hata defteri', S.mistakes.length ? `Yanlış yaptığın ${S.mistakes.length} soru` : 'Şu an boş')}`;
  }

  function viewBankList() {
    setHeader('Cümle bankası', '#/learn');
    const group = (task) => L.bank.filter((b) => b.task === task).map((b) => item('#/bank/' + b.id, 'quote', esc(b.title), b.items.length + ' cümle')).join('');
    main.innerHTML = `<p class="muted">Sınavda doğrudan kullanabileceğin kalıplar. Sesli dinle, Türkçeyi gizleyip kendini test et, bilmediğin kelimeye dokun.</p>
      <div class="section-label">Task 1 · grafik & süreç</div>${group('Task 1')}
      <div class="section-label">Task 2 · essay</div>${group('Task 2')}`;
  }

  function viewBank(id) {
    const b = L.bank.find((x) => x.id === id);
    if (!b) return go('#/bank');
    setHeader(b.title, '#/bank');
    const render = () => {
      main.innerHTML = `<div class="row" style="justify-content:space-between"><span class="badge gold">${esc(b.task)}</span>${blurToggle()}</div>
        <div class="card">${b.items.map(pairHtml).join('')}</div>
        <div class="btns"><button class="btn" id="playAll">${ic('play')} Hepsini dinle</button></div>`;
      bindSay(); bindPairs(); bindBlurToggle(render);
      $('#playAll').onclick = () => tts.speak(b.items.map(([en]) => ({ text: en, v: 0 })));
    };
    render();
    onCleanup(() => tts.stop());
  }

  function viewModelList() {
    setHeader('Model yazılar', '#/learn');
    const row = (w) => item('#/models/' + w.id, w.task === 1 ? 'chart' : 'lines', esc(w.title), 'Band ' + L.models[w.id].band, { gold: true });
    const ws = C.writing.filter((w) => L.models[w.id]);
    main.innerHTML = `<p class="muted">Önce soruyu kendin yazmayı dene, sonra modeli oku. Her modelin altında "neden Band 7+?" açıklaması var.</p>
      <div class="section-label">Task 1</div>${ws.filter((w) => w.task === 1).map(row).join('')}
      <div class="section-label">Task 2</div>${ws.filter((w) => w.task === 2).map(row).join('')}`;
  }

  function viewModel(id) {
    const w = C.writing.find((x) => x.id === id), m = L.models[id];
    if (!w || !m) return go('#/models');
    setHeader('Model · Task ' + w.task, '#/models');
    const full = m.paragraphs.map((p) => p[1]).join(' ');
    const words = (full.match(/[A-Za-z0-9'’-]+/g) || []).length;
    main.innerHTML = `
      <div class="card"><h3>${esc(w.title)}</h3><p class="en" style="font-size:.98rem">${tw(w.prompt)}</p>${w.chart ? chartHtml(w.chart) : ''}</div>
      <div class="card">
        <div class="row" style="justify-content:space-between"><span class="badge gold">${ic('award')} Band ${esc(m.band)}</span><span class="badge">${words} kelime</span></div>
        ${m.paragraphs.map(([lab, t]) => `<div class="para"><div class="lab"><span>${esc(lab)}</span>${sayBtn(t)}</div><p class="en">${tw(t)}</p></div>`).join('')}
        <div class="btns" style="margin-bottom:0"><button class="btn" id="playAll">${ic('play')} Tamamını dinle</button></div>
      </div>
      <div class="card"><h3>Neden Band 7+?</h3><ul class="checks">${m.notes.map((n) => `<li>${ic('check')}<span>${esc(n)}</span></li>`).join('')}</ul></div>
      <a class="btn primary block" href="#/writing/${w.id}">${ic('pen')} Bu soruyu kendin yaz</a>`;
    bindSay();
    $('#playAll').onclick = () => tts.speak(m.paragraphs.map(([, t]) => ({ text: t, v: 0 })));
    onCleanup(() => tts.stop());
  }

  // ---------- grammar ----------
  function viewGrammarList() {
    setHeader('Gramer & cümle kurma', '#/learn');
    const rows = C.grammar.map((u, i) => {
      const st = S.grammar[u.id];
      const badge = st ? `<span class="badge ${st.done ? 'ok' : 'warn'}">${st.best}/${u.exercises.length}</span>` : '<span class="badge">yeni</span>';
      return item('#/grammar/' + u.id, 'pen', esc(u.title), st && st.done ? 'Tamamlandı' : '', { num: String(i + 1).padStart(2, '0'), badge });
    }).join('');
    main.innerHTML = `<p class="muted">Her ünite: Türkçe kural → IELTS bağlantısı → çevirili örnekler → 8 alıştırma. %75 ve üstü = tamamlandı.</p>
      ${S.mistakes.length ? item('#/mistakes', 'refresh', 'Hata defteri', `Yanlış yaptığın ${S.mistakes.length} soruyu tekrar çöz`, { gold: true }) : ''}
      ${rows}`;
  }

  function viewLesson(id) {
    const u = C.grammar.find((x) => x.id === id);
    if (!u) return go('#/grammar');
    setHeader(u.title, '#/grammar');
    const st = S.grammar[u.id];
    const exs = L.examples[u.id] || u.examples.map((e) => [e, '']);
    const render = () => {
      main.innerHTML = `
        <div class="note"><b>IELTS bağlantısı:</b> ${u.ielts}</div>
        <div class="card explain"><h3>Kural</h3><ul>${u.explain.map((e) => `<li>${e}</li>`).join('')}</ul></div>
        <div class="card"><div class="row" style="justify-content:space-between"><h3 style="margin:0">Örnek cümleler</h3>${blurToggle()}</div>
          <div class="hint">${ic('pointer')} Bilmediğin kelimeye dokun</div>${exs.map(pairHtml).join('')}</div>
        ${st ? `<p class="muted">En iyi skorun: ${st.best}/${u.exercises.length}</p>` : ''}
        <a class="btn primary block" href="#/grammar/${u.id}/practice">Alıştırmaya başla · ${u.exercises.length} soru</a>`;
      bindSay(); bindPairs(); bindBlurToggle(render);
    };
    render();
  }

  function viewGrammarPractice(id) {
    const u = C.grammar.find((x) => x.id === id);
    if (!u) return go('#/grammar');
    setHeader(u.title, '#/grammar/' + u.id);
    runExercises(u.exercises.map((ex, i) => ({ ex, u: u.id, i })), {
      onFinish(score, total) {
        const prev = S.grammar[u.id] || { best: 0, attempts: 0 };
        S.grammar[u.id] = { best: Math.max(prev.best, score), last: score, attempts: prev.attempts + 1, done: prev.done || score / total >= 0.75 };
        save(); logAct('grammar');
        const nxt = nextGrammarUnit();
        return `<a class="btn" href="#/grammar/${u.id}/practice">Tekrar çöz</a>${nxt && nxt.id !== u.id ? `<a class="btn primary" href="#/grammar/${nxt.id}">Sonraki ünite</a>` : '<a class="btn primary" href="#/today">Bugün</a>'}`;
      }
    });
  }

  function viewMistakes() {
    setHeader('Hata defteri', '#/learn');
    const list = S.mistakes.map((m) => {
      const u = C.grammar.find((x) => x.id === m.u);
      return u && u.exercises[m.i] ? { ex: u.exercises[m.i], u: m.u, i: m.i } : null;
    }).filter(Boolean);
    if (!list.length) {
      main.innerHTML = `<div class="card empty">${ic('check')}<p><b>Hata defterin boş.</b><br><span class="muted">Yanlış yaptığın sorular buraya otomatik eklenir.</span></p></div><a class="btn block" href="#/grammar">Gramer ünitelerine dön</a>`;
      return;
    }
    runExercises(shuffle(list), { review: true, onFinish() { logAct('grammar'); return '<a class="btn primary" href="#/learn">Öğren</a>'; } });
  }

  function addMistake(u, i) { if (!S.mistakes.some((m) => m.u === u && m.i === i)) { S.mistakes.push({ u, i }); save(); } }
  function removeMistake(u, i) { S.mistakes = S.mistakes.filter((m) => !(m.u === u && m.i === i)); save(); }

  const TYPE_LABEL = { mcq: 'Seçmeli', gap: 'Boşluk doldur', build: 'Cümle kur', write: 'Serbest yaz' };

  function runExercises(list, opts) {
    let idx = 0, score = 0;
    const render = () => {
      if (idx >= list.length) {
        const extra = opts.onFinish(score, list.length);
        const good = score / list.length >= 0.75;
        main.innerHTML = `<div class="card empty">${ic(good ? 'award' : 'target')}<h2 style="margin:6px 0 2px">${score} / ${list.length}</h2>
          <p class="muted">${good ? 'Harika, bu ünite tamam.' : 'Yanlışların hata defterine eklendi. Tekrar et.'}</p></div><div class="btns">${extra}</div>`;
        return;
      }
      const { ex, u, i } = list[idx];
      const head = `<div class="q-head"><span class="q-type">${TYPE_LABEL[ex.type]}</span><span>${idx + 1} / ${list.length}</span></div>
        <div class="bar" style="margin:8px 0 4px"><span style="width:${pct(idx, list.length)}%"></span></div>`;
      const finish = (ok, fbHtml) => {
        if (ok) { score++; if (opts.review) removeMistake(u, i); } else addMistake(u, i);
        const fb = document.createElement('div');
        fb.className = 'feedback ' + (ok ? 'ok' : 'bad');
        fb.innerHTML = `<div class="head">${ic(ok ? 'check' : 'x')}${ok ? 'Doğru' : 'Yanlış'}</div>${fbHtml}`;
        const next = document.createElement('button');
        next.className = 'btn primary block'; next.textContent = idx + 1 < list.length ? 'Sonraki' : 'Sonucu gör';
        next.onclick = () => { idx++; render(); window.scrollTo(0, 0); };
        const box = $('#exbox'); box.appendChild(fb); box.appendChild(next);
        bindSay(box);
        next.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };
      const why = ex.why ? `<div>${esc(ex.why)}</div>` : '';

      if (ex.type === 'mcq') {
        main.innerHTML = `<div class="card" id="exbox">${head}<div class="q-text">${tw(ex.q)}</div>
          <div class="opts">${ex.options.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join('')}</div></div>`;
        $$('.opt', main).forEach((b) => b.addEventListener('click', () => {
          const k = +b.dataset.k, ok = k === ex.answer;
          $$('.opt', main).forEach((x) => { x.disabled = true; if (+x.dataset.k === ex.answer) x.classList.add('correct'); });
          if (!ok) b.classList.add('incorrect');
          finish(ok, why);
        }));
      } else if (ex.type === 'gap') {
        main.innerHTML = `<div class="card" id="exbox">${head}<div class="q-text">${tw(ex.q)}</div>
          <input type="text" id="gapIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Cevabını yaz">
          <div class="btns"><button class="btn primary" id="chk">Kontrol et</button></div></div>`;
        const inp = $('#gapIn'), chk = $('#chk');
        const check = () => {
          if (!inp.value.trim()) return;
          const ok = ex.answers.map(norm).includes(norm(inp.value));
          inp.disabled = true; chk.parentElement.remove();
          finish(ok, `<div class="model">Cevap: <b>${esc(ex.answers.join(' / '))}</b></div>${why}`);
        };
        chk.onclick = check;
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
        inp.focus();
      } else if (ex.type === 'build') {
        let pool = shuffle(ex.words.map((w, k) => ({ w, k })));
        if (pool.map((p) => p.w).join(' ') === ex.answer && pool.length > 2) pool = pool.slice(1).concat(pool[0]);
        const chosen = [];
        main.innerHTML = `<div class="card" id="exbox">${head}<div class="q-text" style="font-family:var(--font);font-size:1.02rem">${esc(ex.tr)}</div>
          <div class="slot" id="slot"></div><div class="pool" id="pool"></div>
          <div class="btns"><button class="btn" id="rst">Sıfırla</button><button class="btn primary" id="chk" disabled>Kontrol et</button></div></div>`;
        const draw = () => {
          $('#slot').innerHTML = chosen.map((p, n) => `<button class="tok" data-n="${n}">${esc(p.w)}</button>`).join('') || '<span class="muted" style="padding:8px">Kelimelere sırayla dokun…</span>';
          $('#pool').innerHTML = pool.map((p, n) => `<button class="tok" data-n="${n}">${esc(p.w)}</button>`).join('');
          $('#chk').disabled = pool.length > 0;
          $$('#slot .tok').forEach((b) => b.onclick = () => { pool.push(chosen.splice(+b.dataset.n, 1)[0]); draw(); });
          $$('#pool .tok').forEach((b) => b.onclick = () => { chosen.push(pool.splice(+b.dataset.n, 1)[0]); draw(); });
        };
        draw();
        $('#rst').onclick = () => { pool = pool.concat(chosen.splice(0)); draw(); };
        $('#chk').onclick = () => {
          const said = norm(chosen.map((p) => p.w).join(' '));
          const ok = [ex.answer].concat(ex.alts || []).map(norm).includes(said);
          $$('.tok', main).forEach((t) => t.disabled = true);
          $('#chk').parentElement.remove();
          finish(ok, `<div class="row"><div class="model grow">${tw(ex.answer)}.</div>${sayBtn(ex.answer)}</div>${why}`);
        };
      } else if (ex.type === 'write') {
        main.innerHTML = `<div class="card" id="exbox">${head}<div class="q-text" style="font-family:var(--font);font-size:1.02rem">${esc(ex.prompt)}</div>
          <textarea id="wIn" style="min-height:110px" placeholder="İngilizce yaz…" spellcheck="false"></textarea>
          <div class="btns"><button class="btn primary" id="show">Model cevabı göster</button></div></div>`;
        $('#show').onclick = () => {
          const mine = $('#wIn').value.trim();
          $('#show').parentElement.remove();
          $('#wIn').disabled = true;
          const auto = mine && ex.models.map(norm).includes(norm(mine));
          const box = document.createElement('div');
          box.className = 'feedback neutral';
          box.innerHTML = `<b>Model cevap${ex.models.length > 1 ? 'lar' : ''}</b>${ex.models.map((m) => `<div class="model">${tw(m)}</div>`).join('')}<div><b>Odak:</b> ${esc(ex.focus)}</div>
            ${auto ? '' : '<p style="margin:10px 0 4px"><b>Kendini değerlendir.</b> Anlam ve gramer olarak modelle aynı mı?</p><div class="btns"><button class="btn" id="selfBad">Hatam var</button><button class="btn primary" id="selfOk">Doğru / çok yakın</button></div>'}`;
          $('#exbox').appendChild(box);
          if (auto) { finish(true, ''); return; }
          $('#selfOk').onclick = () => { box.querySelector('.btns').remove(); finish(true, ''); };
          $('#selfBad').onclick = () => { box.querySelector('.btns').remove(); finish(false, '<div>Bu soru hata defterine eklendi. Model cümleyi bir kez kendin yaz.</div>'); };
        };
      }
    };
    render();
  }

  // ---------- practice hub ----------
  const countReadingQs = (r) => r.questions.reduce((n, q) => n + q.items.length, 0);
  const scoreBadge = (st) => (st ? `<span class="badge ${st.best / st.total >= 0.75 ? 'ok' : 'warn'}">${st.best}/${st.total}</span>` : '<span class="badge">yeni</span>');
  function viewPractice() {
    setHeader('Pratik');
    const d = S.listening.dict;
    main.innerHTML = `
      <div class="section-label">Listening</div>
      ${item('#/listening/dict', 'hash', 'Dikte: sayı, tarih, harfleme', `Sınırsız · doğruluk %${pct(d.right, d.total)} (${d.total})`)}
      ${C.listening.map((l) => item('#/listening/' + l.id, 'headphones', esc(l.title), l.questions.length + ' soru', { badge: scoreBadge(S.listening.scripts[l.id]) })).join('')}
      <div class="section-label">Reading · Academic</div>
      ${C.reading.map((r) => item('#/reading/' + r.id, 'file', esc(r.title), `${r.minutes} dk · ${countReadingQs(r)} soru`, { badge: scoreBadge(S.reading[r.id]) })).join('')}
      <div class="section-label">Writing</div>
      ${item('#/writing', 'lines', 'Writing atölyesi', `Task 1 & Task 2 · ${S.writing.history.length} yazı kaydedildi`)}
      ${item('#/models', 'award', 'Model yazılar', 'Band 7+ örnek cevaplar', { gold: true })}`;
  }

  // ---------- reading ----------
  function startTimer(el, seconds, countdown = true) {
    let left = seconds, running = false, h = null;
    const fmt = (s) => { const a = Math.abs(s); return (s < 0 ? '-' : '') + String(Math.floor(a / 60)).padStart(2, '0') + ':' + String(a % 60).padStart(2, '0'); };
    const paint = () => { el.textContent = fmt(left); el.style.color = countdown && left < 0 ? 'var(--bad)' : ''; };
    paint();
    const api = {
      toggle() { running ? api.pause() : api.start(); return running; },
      start() { if (running) return; running = true; h = setInterval(() => { left += countdown ? -1 : 1; paint(); }, 1000); },
      pause() { running = false; clearInterval(h); },
      elapsed() { return countdown ? seconds - left : left; },
      get running() { return running; }
    };
    onCleanup(() => clearInterval(h));
    return api;
  }
  const timerBtn = (running) => (running ? ic('pause') + ' Duraklat' : ic('play') + ' Başlat');

  function viewReading(id) {
    const r = C.reading.find((x) => x.id === id);
    if (!r) return go('#/practice');
    setHeader('Reading', '#/practice');
    let n = 0;
    const qs = r.questions.map((block, bi) => {
      if (block.kind === 'tfng') {
        return `<div class="card"><h3>Questions ${n + 1}–${n + block.items.length}</h3><p class="muted">TRUE / FALSE / NOT GIVEN</p>` +
          block.items.map((it, k) => { n++; return `<div class="qblock" data-b="${bi}" data-k="${k}"><span class="en"><b>${n}.</b> ${tw(it.s)}</span><div class="tfng">${['T', 'F', 'NG'].map((v) => `<button class="opt" data-v="${v}">${v === 'T' ? 'TRUE' : v === 'F' ? 'FALSE' : 'NOT GIVEN'}</button>`).join('')}</div><div class="ans-note"></div></div>`; }).join('') + '</div>';
      }
      if (block.kind === 'headings') {
        return `<div class="card"><h3>Questions ${n + 1}–${n + block.items.length}</h3><p class="muted">Her paragraf için doğru başlığı seç.</p><ul class="list en" style="font-size:.95rem;margin-bottom:8px">${block.options.map((o) => `<li>${tw(o)}</li>`).join('')}</ul>` +
          block.items.map((it, k) => { n++; return `<div class="qblock" data-b="${bi}" data-k="${k}"><label>${n}. Paragraph ${it.p}</label><select><option value="">seç…</option>${block.options.map((o, oi) => `<option value="${oi}">${esc(o.split('.')[0])}</option>`).join('')}</select><div class="ans-note"></div></div>`; }).join('') + '</div>';
      }
      return `<div class="card"><h3>Questions ${n + 1}–${n + block.items.length}</h3><p class="muted">${esc(block.note)}</p>` +
        block.items.map((it, k) => { n++; return `<div class="qblock" data-b="${bi}" data-k="${k}"><span class="en"><b>${n}.</b> ${tw(it.s)}</span><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" style="margin-top:6px"><div class="ans-note"></div></div>`; }).join('') + '</div>';
    }).join('');
    main.innerHTML = `
      <div class="sticky-tools"><span class="row" style="gap:6px">${ic('clock')}<span class="timer" id="tmr"></span></span><button class="btn small" id="tbtn">${timerBtn(false)}</button></div>
      <div class="hint">${ic('pointer')} Bilmediğin kelimeye dokun, anlamı açılır</div>
      <div class="card passage"><h2 style="margin-top:0">${esc(r.title)}</h2>${r.paragraphs.map(([l, t]) => `<p><span class="pl">${l}</span>${tw(t)}</p>`).join('')}</div>
      ${qs}
      <button class="btn primary block" id="check">Cevapları kontrol et</button>
      <div id="result"></div>`;
    const timer = startTimer($('#tmr'), r.minutes * 60);
    $('#tbtn').onclick = () => { $('#tbtn').innerHTML = timerBtn(timer.toggle()); };
    $$('.tfng', main).forEach((g) => $$('.opt', g).forEach((b) => b.onclick = () => { $$('.opt', g).forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); }));
    $('#check').onclick = () => {
      timer.pause();
      let right = 0, total = 0;
      $$('.qblock', main).forEach((q) => {
        const block = r.questions[+q.dataset.b], it = block.items[+q.dataset.k];
        let ok = false, ans = '';
        if (block.kind === 'tfng') {
          const sel = $('.opt.sel', q);
          ok = !!sel && sel.dataset.v === it.a;
          ans = (it.a === 'T' ? 'TRUE' : it.a === 'F' ? 'FALSE' : 'NOT GIVEN') + ' · ' + it.why;
          $$('.opt', q).forEach((b) => { b.disabled = true; if (b.dataset.v === it.a) b.classList.add('correct'); else if (b.classList.contains('sel')) b.classList.add('incorrect'); });
        } else if (block.kind === 'headings') {
          const v = $('select', q).value;
          ok = v !== '' && +v === it.a;
          ans = block.options[it.a];
          $('select', q).disabled = true;
        } else {
          const inp = $('input', q);
          ok = it.a.map(norm).includes(norm(inp.value));
          ans = it.a.join(' / ');
          inp.disabled = true;
        }
        total++; if (ok) right++;
        $('.ans-note', q).innerHTML = ok ? `<span class="right">Doğru</span>` : `<span style="color:var(--bad)">Yanlış.</span> Doğru cevap: <b>${esc(ans)}</b>`;
      });
      $('#check').remove();
      const prev = S.reading[r.id];
      S.reading[r.id] = { best: Math.max(prev ? prev.best : 0, right), last: right, total, attempts: (prev ? prev.attempts : 0) + 1 };
      save(); logAct('reading');
      const ratio = right / total;
      const band = ratio >= 0.85 ? '7+' : ratio >= 0.7 ? '6–6.5' : ratio >= 0.5 ? '5–5.5' : '5 altı';
      $('#result').innerHTML = `<div class="card empty"><h2 style="margin:0">${right} / ${total}</h2><p class="muted">Süre: ${Math.round(timer.elapsed() / 60)} dk · Kaba band tahmini: <b>${band}</b></p>
        <p class="muted" style="font-size:.86rem;margin-bottom:0">Yanlışlarda metne dönüp kanıt cümlesini bul. Reading'de en hızlı gelişme yolu budur.</p></div>
        <div class="btns"><a class="btn" href="#/reading/${r.id}" id="again">Tekrar çöz</a><a class="btn primary" href="#/practice">Pratik</a></div>`;
      $('#again').onclick = (e) => { e.preventDefault(); route(true); };
      $('#result').scrollIntoView({ behavior: 'smooth' });
    };
  }

  // ---------- listening: dictation ----------
  const NAMES = ['MACKENZIE', 'HARTLEY', 'FITZGERALD', 'WOODWARD', 'CALLAGHAN', 'PEMBERTON', 'ROSSITER', 'BLACKWELL', 'THOMPSON', 'GALLAGHER', 'PHILLIPS', 'HOLLOWAY', 'ASHWORTH', 'KEMPTON', 'JEFFERSON', 'WHITTAKER', 'HUTCHINSON', 'BRADSHAW', 'ELLWOOD', 'QUENTIN'];
  const STREETS = ['Bridge', 'Station', 'Harbour', 'Mill', 'Church', 'Kingsley', 'Abbott', 'Greenhill'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const ORD = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
  const digitWord = (d) => (d === '0' ? 'oh' : d);
  function spellOut(word) {
    const out = []; const w = word.toUpperCase();
    for (let i = 0; i < w.length; i++) { if (w[i] === w[i + 1]) { out.push('double ' + w[i]); i++; } else out.push(w[i]); }
    return out.join(', ');
  }
  function makeDict() {
    const kind = pick(['phone', 'spell', 'spell', 'price', 'date', 'flight', 'year', 'address']);
    if (kind === 'phone') {
      const num = '07' + Array.from({ length: 9 }, () => rnd(10)).join('');
      const g = [num.slice(0, 5), num.slice(5, 8), num.slice(8)];
      return { label: 'Telefon numarası', say: g.map((x) => x.split('').map(digitWord).join(' ')).join(', '), check: (v) => v.replace(/\D/g, '') === num, show: num };
    }
    if (kind === 'spell') {
      const n = pick(NAMES), nice = n.charAt(0) + n.slice(1).toLowerCase();
      return { label: 'Soyadı (harf harf okunacak)', say: 'The surname is ' + nice + '. ' + spellOut(n) + '.', check: (v) => norm(v) === n.toLowerCase(), show: nice };
    }
    if (kind === 'price') {
      const val = 2 + rnd(198) + pick([0, 25, 50, 75, 99, 45, 20]) / 100;
      return { label: 'Fiyat (£)', say: 'It costs £' + val.toFixed(2).replace('.00', '') + '.', check: (v) => Math.abs(parseFloat(v.replace(/[£\s,]/g, '')) - val) < 0.001, show: '£' + val.toFixed(2) };
    }
    if (kind === 'date') {
      const d = 1 + rnd(28), m = rnd(12);
      return { label: 'Tarih (gün + ay)', say: 'The course starts on the ' + ORD(d) + ' of ' + MONTHS[m] + '.', check: (v) => {
        const num = (v.match(/\d+/) || [])[0];
        const mon = MONTHS.findIndex((x) => norm(v).includes(x.slice(0, 3).toLowerCase()));
        const slash = v.match(/(\d{1,2})\s*[\/.\-]\s*(\d{1,2})/);
        return (+num === d && mon === m) || (!!slash && +slash[1] === d && +slash[2] === m + 1);
      }, show: d + ' ' + MONTHS[m] };
    }
    if (kind === 'flight') {
      const code = pick(['BA', 'TK', 'LH', 'EK', 'QR', 'AF']) + (100 + rnd(9900));
      return { label: 'Uçuş kodu', say: 'Your flight number is ' + code.slice(0, 2).split('').join(' ') + ', ' + code.slice(2).split('').join(' ') + '.', check: (v) => v.replace(/\s/g, '').toUpperCase() === code, show: code };
    }
    if (kind === 'year') {
      const y = 1900 + rnd(130);
      return { label: 'Yıl', say: 'The building was completed in ' + y + '.', check: (v) => v.replace(/\D/g, '') === String(y), show: String(y) };
    }
    const no = 2 + rnd(240), st = pick(STREETS);
    return { label: 'Adres (numara + sokak)', say: 'The address is ' + no + ' ' + st + ' Road.', check: (v) => { const s = norm(v); return s.includes(String(no)) && s.includes(st.toLowerCase()); }, show: no + ' ' + st + ' Road' };
  }

  const rateCard = () => `<div class="card"><label for="rate" style="margin-top:0">Konuşma hızı: <span id="rv">${S.settings.rate}</span></label><input type="range" id="rate" min="0.6" max="1.2" step="0.05" value="${S.settings.rate}" style="width:100%"></div>`;
  const bindRate = () => { const r = $('#rate'); if (r) r.oninput = (e) => { S.settings.rate = +e.target.value; $('#rv').textContent = S.settings.rate; save(); }; };

  function viewDictation() {
    setHeader('Listening: Dikte', '#/practice');
    let it = null; const session = { right: 0, total: 0 };
    const draw = () => {
      it = makeDict();
      main.innerHTML = `${voiceWarning()}
        <div class="card"><div class="q-head"><span class="q-type">${esc(it.label)}</span><span>Bu oturum: ${session.right}/${session.total}</span></div>
        <p class="muted" style="margin-top:8px;font-size:.9rem">Sınavda isim harfleme, telefon ve tarih soruları en kolay puanlardır ama yazım hatası = yanlış.</p>
        <div class="btns"><button class="btn primary" id="play">${ic('volume')} Dinle</button><button class="btn" id="slow">Yavaş dinle</button></div>
        <input type="text" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Duyduğunu yaz">
        <div class="btns"><button class="btn primary" id="chk">Kontrol et</button></div><div id="fb"></div></div>
        ${rateCard()}`;
      $('#play').onclick = () => tts.speak(it.say);
      $('#slow').onclick = () => { const r = S.settings.rate; S.settings.rate = 0.65; tts.speak(it.say); S.settings.rate = r; };
      bindRate();
      const check = () => {
        const v = $('#ans').value.trim(); if (!v) return;
        const ok = it.check(v);
        session.total++; S.listening.dict.total++;
        if (ok) { session.right++; S.listening.dict.right++; }
        save(); logAct('listening');
        $('#ans').disabled = true; $('#chk').parentElement.remove();
        $('#fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}"><div class="head">${ic(ok ? 'check' : 'x')}${ok ? 'Doğru' : 'Yanlış'}</div>Cevap: <b>${esc(it.show)}</b></div><button class="btn primary block" id="nx">Sonraki</button>`;
        $('#nx').onclick = () => { draw(); setTimeout(() => tts.speak(it.say), 150); };
      };
      $('#chk').onclick = check;
      $('#ans').addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
    };
    draw();
    onCleanup(() => tts.stop());
  }

  // ---------- listening: scripts ----------
  function viewListening(id) {
    const l = C.listening.find((x) => x.id === id);
    if (!l) return go('#/practice');
    setHeader('Listening', '#/practice');
    const speakers = [...new Set(l.lines.map((x) => x[0]))];
    let plays = 0;
    main.innerHTML = `${voiceWarning()}
      <div class="card"><h3>${esc(l.title)}</h3><p class="muted">${esc(l.note)}</p>
        <p class="muted" style="font-size:.88rem">Önce soruları oku, sonra dinle. Gerçek sınavda kayıt <b>tek sefer</b> çalınır.</p>
        <div class="btns"><button class="btn primary" id="play">${ic('play')} Dinle</button><button class="btn" id="stop">${ic('stop')} Durdur</button></div>
        <small id="pc">Dinleme: 0</small></div>
      <div class="card">${l.questions.map((q, k) => `<div class="qblock" data-k="${k}"><b>${k + 1}.</b> ${esc(q.s)}<input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" style="margin-top:6px"><div class="ans-note"></div></div>`).join('')}</div>
      <button class="btn primary block" id="check">Kontrol et</button>
      <div id="result"></div>`;
    $('#play').onclick = () => {
      plays++; $('#pc').textContent = 'Dinleme: ' + plays + (plays > 1 ? ' (sınavda tek sefer!)' : '');
      tts.speak(l.lines.map(([sp, text]) => ({ text, v: speakers.indexOf(sp) % 2 })));
    };
    $('#stop').onclick = () => tts.stop();
    onCleanup(() => tts.stop());
    $('#check').onclick = () => {
      let right = 0;
      $$('.qblock', main).forEach((q) => {
        const it = l.questions[+q.dataset.k], inp = $('input', q);
        const ok = it.digits ? inp.value.replace(/\D/g, '') === it.a[0] : it.a.map(norm).includes(norm(inp.value));
        if (ok) right++;
        inp.disabled = true;
        $('.ans-note', q).innerHTML = ok ? '<span class="right">Doğru</span>' : `<span style="color:var(--bad)">Yanlış.</span> Doğru cevap: <b>${esc(it.a[0])}</b>`;
      });
      $('#check').remove();
      const prev = S.listening.scripts[l.id];
      S.listening.scripts[l.id] = { best: Math.max(prev ? prev.best : 0, right), total: l.questions.length };
      save(); logAct('listening', 10);
      $('#result').innerHTML = `<div class="card empty"><h2 style="margin:0">${right} / ${l.questions.length}</h2></div>
        <details class="card"><summary>${ic('file')} Metni göster (transcript)</summary><div class="inner passage">${l.lines.map(([sp, t]) => `<p><span class="pl">${esc(sp)}</span>${tw(t)}</p>`).join('')}</div></details>
        <p class="muted">Yanlış yaptığın yerin metnini oku, sonra kaydı metne bakarak bir kez daha dinle.</p>
        <a class="btn primary block" href="#/practice">Pratik</a>`;
    };
  }

  // ---------- writing ----------
  const MODES = {
    1: { full: { label: 'Tam yazı', words: 150, min: 20 }, overview: { label: 'Giriş + overview', words: 40, min: 6 } },
    2: { full: { label: 'Tam essay', words: 250, min: 40 }, intro: { label: 'Giriş', words: 50, min: 8 }, body: { label: 'Tek body', words: 100, min: 15 } }
  };

  function viewWritingList() {
    setHeader('Writing atölyesi', '#/practice');
    const row = (w) => {
      const n = S.writing.history.filter((h) => h.id === w.id).length;
      return item('#/writing/' + w.id, w.task === 1 ? 'chart' : 'lines', esc(w.title), L.models[w.id] ? 'Model cevaplı' : '', { badge: n ? `<span class="badge ok">${n}×</span>` : '' });
    };
    const hist = S.writing.history.slice(-5).reverse();
    main.innerHTML = `
      <div class="note">Task 2, Writing puanının <b>2/3</b>'ü. Yolda paragraf paragraf çalış; tam essay'i sınav koşulunda (40 dk) yaz.</div>
      <div class="section-label">Task 1 · 20 dk · 150+ kelime</div>${C.writing.filter((w) => w.task === 1).map(row).join('')}
      <div class="section-label">Task 2 · 40 dk · 250+ kelime</div>${C.writing.filter((w) => w.task === 2).map(row).join('')}
      ${hist.length ? `<div class="section-label">Son yazıların</div>${hist.map((h) => `<details class="card"><summary>${esc(h.date)} · ${h.words} kelime</summary><div class="inner"><p class="muted" style="margin-top:0">${esc((C.writing.find((w) => w.id === h.id) || {}).title || h.id)}</p><p class="en" style="white-space:pre-wrap">${esc(h.text)}</p></div></details>`).join('')}` : ''}`;
  }

  function chartHtml(ch) {
    if (ch.type === 'process') {
      return `<div class="flow">${ch.steps.map((s, i) => `${i ? '<div class="arr">↓</div>' : ''}<div>${i + 1}. ${tw(s)}</div>`).join('')}</div>`;
    }
    const W = 340, H = 226, Lp = 34, R = 10, T = 22, B = 28;
    const cols = ['var(--c1)', 'var(--c2)', 'var(--c3)'];
    const max = Math.max(...ch.series.flatMap((s) => s.data));
    const step = max > 40 ? 10 : 5;
    const top = Math.ceil(max / step) * step;
    const y = (v) => T + (H - T - B) * (1 - v / top);
    let g = '';
    for (let v = 0; v <= top; v += step) g += `<line x1="${Lp}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="currentColor" stroke-opacity=".18"/><text x="${Lp - 6}" y="${y(v) + 4}" text-anchor="end" font-size="10" fill="currentColor">${v}</text>`;
    const n = ch.labels.length, span = (W - Lp - R) / n;
    ch.labels.forEach((lb, i) => { g += `<text x="${Lp + span * (i + 0.5)}" y="${H - 9}" text-anchor="middle" font-size="10" fill="currentColor">${esc(lb)}</text>`; });
    if (ch.type === 'line') {
      ch.series.forEach((s, si) => {
        const pts = s.data.map((v, i) => [Lp + span * (i + 0.5), y(v)]);
        g += `<polyline points="${pts.map((p) => p.join(',')).join(' ')}" style="fill:none;stroke:${cols[si]};stroke-width:2.2"/>` + pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="3.2" style="fill:var(--surface);stroke:${cols[si]};stroke-width:2"/>`).join('');
      });
    } else {
      const bw = (span * 0.66) / ch.series.length;
      ch.series.forEach((s, si) => s.data.forEach((v, i) => {
        const x = Lp + span * i + span * 0.17 + bw * si;
        g += `<rect x="${x}" y="${y(v)}" width="${bw - 2}" height="${y(0) - y(v)}" rx="2" style="fill:${cols[si]}"/>`;
      }));
    }
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik">${g}<text x="4" y="10" font-size="9" fill="currentColor">${esc(ch.unit)}</text></svg>
      <div class="legend">${ch.series.map((s, si) => `<span><i style="background:${cols[si]}"></i>${esc(s.name)}</span>`).join('')}</div></div>`;
  }

  const countWords = (t) => (t.trim().match(/[A-Za-z0-9'’-]+/g) || []).length;

  function claudePrompt(w, mode, text) {
    const m = MODES[w.task][mode];
    const chartData = w.chart ? (w.chart.type === 'process' ? '\nSüreç adımları: ' + w.chart.steps.join(' → ') : '\nVeri: ' + w.chart.series.map((s) => s.name + ': ' + s.data.map((v, i) => w.chart.labels[i] + '=' + v).join(', ')).join(' | ') + ' (' + w.chart.unit + ')') : '';
    return `Sen deneyimli bir IELTS Writing examiner'ısın. Benim seviyem B2, hedefim Band 7. Aşağıdaki IELTS Academic Writing Task ${w.task} cevabımı (${m.label}) resmi band descriptor'lara göre değerlendir.

1) ${w.task === 1 ? 'Task Achievement' : 'Task Response'}, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy için ayrı band tahmini + 1 cümle gerekçe.${mode !== 'full' ? ' (Bu sadece bir bölüm; bölüm için yorumla.)' : ''}
2) Gramer ve kelime hatalarımı tablo yap: hatalı ifade → doğru ifade → kural (Türkçe kısa açıklama).
3) Her cümlem için gerekirse Band 7+ yeniden yazım öner (yapıyı koru, doğallaştır).
4) Bir sonraki yazımda odaklanmam gereken en önemli 2 madde.
Açıklamalar Türkçe, örnekler İngilizce olsun.

SORU: ${w.prompt}${chartData}

CEVABIM (${countWords(text)} kelime):
${text}`;
  }

  async function copyText(text, host) {
    try { await navigator.clipboard.writeText(text); toast('Kopyalandı. Claude\'a yapıştır.'); return; } catch (e) { /* fall back */ }
    host.innerHTML = `<p class="muted">Otomatik kopyalanamadı. Metni seçip kopyala:</p><textarea class="copybox" readonly></textarea>`;
    const ta = $('textarea', host); ta.value = text; ta.focus(); ta.select();
  }

  function viewWriting(id, mode) {
    const w = C.writing.find((x) => x.id === id);
    if (!w) return go('#/writing');
    const modes = MODES[w.task];
    if (!modes[mode]) mode = 'full';
    const m = modes[mode];
    const guide = C.writingGuides[w.task];
    setHeader('Writing · Task ' + w.task, '#/writing');
    const dkey = w.id + ':' + mode;
    main.innerHTML = `
      <div class="card"><h3>${esc(w.title)}</h3><p class="en" style="font-size:.98rem">${tw(w.prompt)}</p>${w.chart ? chartHtml(w.chart) : ''}</div>
      <div class="seg">${Object.entries(modes).map(([k, v]) => `<a class="${k === mode ? 'on' : ''}" href="#/writing/${w.id}/${k}">${v.label}</a>`).join('')}</div>
      <details class="card"><summary>${ic('layers')} Paragraf planı</summary><div class="inner"><ul style="padding-left:1.1rem;margin:0">${guide.plan.map((p) => `<li style="margin:.4rem 0">${p}</li>`).join('')}</ul></div></details>
      <details class="card"><summary>${ic('quote')} Kalıp cümleler</summary><div class="inner"><ul class="en" style="padding-left:1.1rem;margin:0">${guide.phrases.map((p) => `<li style="margin:.3rem 0">${tw(p)}</li>`).join('')}</ul><p style="margin:10px 0 0"><a href="#/bank">Cümle bankasının tamamı</a></p></div></details>
      <div class="sticky-tools"><span class="row" style="gap:6px">${ic('clock')}<span class="timer" id="tmr"></span><small class="muted">/ ${m.min} dk</small></span><span id="wc" class="badge">0 / ${m.words}</span><button class="btn small" id="tbtn">${timerBtn(false)}</button></div>
      <textarea id="txt" placeholder="${mode === 'full' ? 'Yazmaya başla…' : esc(m.label) + ' yaz…'}" spellcheck="false" autocapitalize="sentences"></textarea>
      <div class="btns"><button class="btn primary" id="done">${ic('check')} Bitirdim, kaydet</button><button class="btn" id="ai">${ic('copy')} Claude'a değerlendirt</button></div>
      <div id="copyHost"></div>
      ${L.models[w.id] ? item('#/models/' + w.id, 'award', 'Model cevabı gör (Band ' + esc(L.models[w.id].band) + ')', 'Önce kendin yaz, sonra karşılaştır', { gold: true }) : ''}
      <details class="card"><summary>${ic('check')} Teslimden önce öz-kontrol</summary><div class="inner"><ul class="checks">
        <li>${ic('check')}<span><b>${w.task === 1 ? 'TA' : 'TR'}:</b> ${w.task === 1 ? 'Overview var mı? Önemli veriler ve karşılaştırmalar var mı? Yorum eklemedin mi?' : 'Sorunun TÜM kısımlarına cevap verdin mi? Pozisyonun baştan sona net mi?'}</span></li>
        <li>${ic('check')}<span><b>CC:</b> Her paragrafın tek bir ana fikri var mı? Bağlaçlar doğal mı, aşırı mı?</span></li>
        <li>${ic('check')}<span><b>LR:</b> Aynı kelimeyi tekrarladın mı? En az 2 collocation kullandın mı?</span></li>
        <li>${ic('check')}<span><b>GRA:</b> En az 1 relative clause, 1 conditional/passive var mı? Artikel ve çoğul -s kontrolü.</span></li></ul></div></details>`;
    const ta = $('#txt');
    ta.value = S.writing.drafts[dkey] || '';
    const timer = startTimer($('#tmr'), 0, false);
    const paintWc = () => { const n = countWords(ta.value); const b = $('#wc'); b.textContent = n + ' / ' + m.words; b.className = 'badge ' + (n >= m.words ? 'ok' : ''); };
    paintWc();
    let saveT;
    ta.addEventListener('input', () => {
      paintWc();
      if (!timer.running && ta.value.length === 1) { timer.start(); $('#tbtn').innerHTML = timerBtn(true); }
      clearTimeout(saveT); saveT = setTimeout(() => { S.writing.drafts[dkey] = ta.value; save(); }, 400);
    });
    onCleanup(() => { clearTimeout(saveT); S.writing.drafts[dkey] = ta.value; save(); });
    $('#tbtn').onclick = () => { $('#tbtn').innerHTML = timerBtn(timer.toggle()); };
    $('#done').onclick = () => {
      const text = ta.value.trim();
      if (countWords(text) < 15) { toast('Önce biraz yaz'); return; }
      timer.pause();
      S.writing.history.push({ id: w.id, mode, text, words: countWords(text), minutes: Math.round(timer.elapsed() / 60), date: today() });
      S.writing.drafts[dkey] = '';
      save(); logAct('writing');
      toast('Kaydedildi');
      $('#copyHost').innerHTML = `<div class="card"><b>Kaydedildi.</b> ${countWords(text)} kelime, ${Math.round(timer.elapsed() / 60)} dk.<p class="muted" style="margin-bottom:0">Şimdi "Claude'a değerlendirt" ile band tahmini ve hata tablosu al, sonra model cevapla karşılaştır.</p></div>`;
      ta.dataset.saved = text;
      ta.value = '';
      paintWc();
    };
    $('#ai').onclick = () => {
      const text = ta.value.trim() || ta.dataset.saved || '';
      if (countWords(text) < 15) { toast('Değerlendirme için önce yaz.'); return; }
      copyText(claudePrompt(w, mode, text), $('#copyHost')).then(() => {
        if (!$('#openClaude')) $('#copyHost').insertAdjacentHTML('beforeend', '<a class="btn block" id="openClaude" href="https://claude.ai/new" target="_blank" rel="noopener">Claude\'u aç</a>');
      });
    };
  }

  // ---------- vocab (Leitner SRS) ----------
  const INTERVAL = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 };
  function vocabQueue() {
    const t = today(), cards = allCards();
    const due = cards.filter((v) => S.vocab[v.w] && S.vocab[v.w].due <= t);
    const freshMine = cards.filter((v) => v.mine && !S.vocab[v.w]);
    const freshStd = cards.filter((v) => !v.mine && !S.vocab[v.w]).slice(0, 10);
    return shuffle(due).concat(freshMine, freshStd).slice(0, 30);
  }
  const vocabSeg = (on) => `<div class="seg"><a class="${on === 'study' ? 'on' : ''}" href="#/vocab">Çalış</a><a class="${on === 'mine' ? 'on' : ''}" href="#/vocab/mine">Defterim (${Object.keys(S.myWords).length})</a></div>`;

  function viewVocab() {
    setHeader('Kelime');
    const queue = vocabQueue();
    const stats = () => {
      const vals = allCards().map((v) => S.vocab[v.w]);
      return { learned: vals.filter((s) => s && s.box >= 3).length, learning: vals.filter((s) => s && s.box < 3).length, fresh: vals.filter((s) => !s).length };
    };
    const draw = () => {
      const st = stats();
      const head = vocabSeg('study') + `<div class="stat-grid" style="grid-template-columns:repeat(3,1fr)"><div class="stat"><div class="n">${st.learned}</div><div class="l">öğrenildi</div></div><div class="stat"><div class="n">${st.learning}</div><div class="l">tekrarda</div></div><div class="stat"><div class="n">${st.fresh}</div><div class="l">yeni</div></div></div>`;
      if (!queue.length) {
        main.innerHTML = head + `<div class="card empty">${ic('check')}<p><b>Bugünlük kart kalmadı.</b><br><span class="muted">Kartlar unutmak üzere olduğun gün geri gelir. Metinlerde kelimelere dokunarak yeni kart ekleyebilirsin.</span></p></div>`;
        return;
      }
      const v = queue[0];
      const box = S.vocab[v.w] ? S.vocab[v.w].box : 0;
      main.innerHTML = head + `
        <div class="card flash"><span class="badge ${v.mine ? 'gold' : ''}">${v.mine ? 'Defterim · ' : ''}${box ? 'Kutu ' + box : 'Yeni'} · kalan ${queue.length}</span>
          <div class="w-big">${esc(v.w)}</div>${sayBtn(v.w + (v.ex ? '. ' + v.ex : ''))}
          <div id="back" class="hidden"><div class="tr">${esc(v.tr)}</div>${v.col && !v.mine ? `<div class="col">${esc(v.col)}</div>` : ''}${v.ex ? `<div class="exs">${tw(v.ex)}</div>` : ''}</div>
        </div>
        <div id="ctrl"><button class="btn primary block" id="reveal">Anlamını göster</button><p class="muted" style="text-align:center;font-size:.85rem">Önce anlamını ve bir örnek cümleyi içinden söylemeye çalış.</p></div>`;
      bindSay();
      $('#reveal').onclick = () => {
        $('#back').classList.remove('hidden');
        $('#ctrl').innerHTML = `<div class="btns"><button class="btn" data-g="0">Bilmiyordum</button><button class="btn" data-g="1">Zor</button><button class="btn primary" data-g="2">Biliyorum</button></div>`;
        $$('[data-g]', main).forEach((b) => b.onclick = () => grade(v, +b.dataset.g));
      };
    };
    const grade = (v, g) => {
      const cur = S.vocab[v.w] || { box: 0 };
      const box = g === 0 ? 1 : g === 1 ? Math.max(1, cur.box) : Math.min(5, cur.box + 1);
      S.vocab[v.w] = { box, due: g === 0 ? today() : addDays(today(), INTERVAL[box]) };
      queue.shift();
      if (g === 0 && !queue.slice(-3).includes(v)) queue.push(v);
      save(); logAct('vocab');
      draw();
    };
    draw();
    onCleanup(() => tts.stop());
  }

  function viewMyWords() {
    setHeader('Kelime');
    const render = () => {
      const entries = Object.entries(S.myWords).sort((a, b) => (b[1].added || '').localeCompare(a[1].added || ''));
      main.innerHTML = vocabSeg('mine') + (entries.length
        ? `<p class="muted">Metinlerde dokunup eklediğin kelimeler. Bunlar kart çalışmasında öncelikli gelir.</p><div class="card">${entries.map(([w, v]) => `<div class="pair"><div class="grow"><div class="en"><b>${esc(w)}</b> <span class="muted" style="font-family:var(--font);font-size:.85rem">${esc(v.tr)}</span></div>${v.ex ? `<div class="tr">${tw(v.ex)}</div>` : ''}</div>${sayBtn(w)}<button class="btn icon ghost" data-del="${esc(w)}" aria-label="Sil">${ic('trash')}</button></div>`).join('')}</div>`
        : `<div class="card empty">${ic('pointer')}<p><b>Defterin boş.</b><br><span class="muted">Reading metinlerinde, örnek cümlelerde ya da model yazılarda bilmediğin bir kelimeye dokun ve "Kelime kartlarıma ekle" de.</span></p></div><a class="btn block" href="#/models">Model yazıları aç</a>`);
      bindSay();
      $$('[data-del]', main).forEach((b) => b.onclick = () => { delete S.myWords[b.dataset.del]; delete S.vocab[b.dataset.del]; save(); render(); });
    };
    render();
  }

  // ---------- progress & settings ----------
  function viewProgress() {
    setHeader('İlerleme');
    const gDone = C.grammar.filter((u) => S.grammar[u.id] && S.grammar[u.id].done).length;
    const rs = Object.values(S.reading);
    const rAvg = rs.length ? pct(rs.reduce((a, r) => a + r.best, 0), rs.reduce((a, r) => a + r.total, 0)) : 0;
    const d = S.listening.dict;
    const cards = allCards();
    const learned = cards.filter((v) => S.vocab[v.w] && S.vocab[v.w].box >= 3).length;
    const days = Array.from({ length: 21 }, (_, i) => addDays(today(), i - 20));
    const heat = days.map((k) => {
      const l = S.log[k] || {}; const n = Object.keys(DAILY).filter((x) => (l[x] || 0) >= DAILY[x]).length;
      const op = n === 0 ? (activeDay(k) ? 0.25 : 0.08) : 0.25 + n * 0.15;
      return `<span title="${k}: ${n}/5" style="display:inline-block;width:calc((100% - 40px)/21);aspect-ratio:1;margin-right:2px;border-radius:4px;background:var(--gold);opacity:${op}"></span>`;
    }).join('');
    main.innerHTML = `
      <div class="card"><div class="row"><div class="grow"><b class="serif" style="font-size:1.1rem">Gün ${dayNo()} / 84</b><div class="muted" style="font-size:.88rem">${PHASES[phase()]}</div></div><span class="streak">${ic('flame')}${streak()} gün</span></div>
        <div class="bar" style="margin-top:10px"><span style="width:${Math.min(100, pct(dayNo(), 84))}%"></span></div></div>
      <div class="stat-grid">
        <div class="stat"><div class="n">${gDone}/${C.grammar.length}</div><div class="l">gramer ünitesi</div></div>
        <div class="stat"><div class="n">%${rAvg}</div><div class="l">reading doğruluk</div></div>
        <div class="stat"><div class="n">%${pct(d.right, d.total)}</div><div class="l">dikte doğruluk (${d.total})</div></div>
        <div class="stat"><div class="n">${S.writing.history.length}</div><div class="l">yazı kaydedildi</div></div>
        <div class="stat"><div class="n">${learned}/${cards.length}</div><div class="l">kelime öğrenildi</div></div>
        <div class="stat"><div class="n">${Object.keys(S.myWords).length}</div><div class="l">deftere eklenen kelime</div></div>
      </div>
      <div class="card"><b>Son 21 gün</b><div style="margin-top:10px;line-height:0">${heat}</div><small class="muted">Koyu = günün görevlerinden fazlası tamam</small></div>
      <div class="card"><h3>Ayarlar</h3>
        <label for="exam">Sınav tarihi</label><input type="date" id="exam" value="${esc(S.examDate)}">
        <label for="start">Plan başlangıç tarihi (Gün 1)</label><input type="date" id="start" value="${esc(S.start)}">
        <label for="rate">Konuşma hızı: <span id="rv">${S.settings.rate}</span></label><input type="range" id="rate" min="0.6" max="1.2" step="0.05" value="${S.settings.rate}" style="width:100%">
      </div>
      <div class="card"><h3>Yedek</h3><p class="muted">İlerleme sadece bu telefonda saklanır. Tarayıcı verisini silersen kaybolur, ara sıra yedek al.</p>
        <div class="btns"><button class="btn" id="exp">${ic('download')} Yedeği indir</button><label class="btn" style="margin:0">${ic('upload')} Yedek yükle<input type="file" id="imp" accept="application/json" hidden></label></div>
        <button class="btn block ghost" id="reset" style="color:var(--bad)">Tüm ilerlemeyi sıfırla</button></div>
      <p class="muted" style="text-align:center;font-size:.8rem">IELTS Yol Koçu · offline çalışır</p>`;
    $('#exam').onchange = (e) => { S.examDate = e.target.value; save(); toast('Sınav tarihi kaydedildi'); };
    $('#start').onchange = (e) => { if (e.target.value) { S.start = e.target.value; save(); toast('Başlangıç güncellendi'); } };
    bindRate();
    $('#exp').onclick = () => {
      const blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'ielts-koc-yedek-' + today() + '.json';
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    $('#imp').onchange = (e) => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then((t) => {
        const data = JSON.parse(t);
        if (!data || !data.start || !data.log) throw new Error('bad');
        S = hydrate(data); save(); toast('Yedek yüklendi'); route(true);
      }).catch(() => toast('Geçersiz yedek dosyası'));
    };
    $('#reset').onclick = () => { if (confirm('Tüm ilerleme silinsin mi? Bu geri alınamaz.')) { S = fresh(); save(); route(true); toast('Sıfırlandı'); } };
  }

  // ---------- router ----------
  const TABS = [['today', 'sun', 'Bugün'], ['learn', 'book', 'Öğren'], ['practice', 'layers', 'Pratik'], ['vocab', 'cards', 'Kelime'], ['progress', 'chart', 'İlerleme']];
  $('#tabs').innerHTML = TABS.map(([id, icon, label]) => `<a href="#/${id}" data-tab="${id}">${ic(icon)}${label}</a>`).join('');

  const ROUTES = [
    [/^#\/today$/, viewToday, 'today'],
    [/^#\/learn$/, viewLearn, 'learn'],
    [/^#\/bank$/, viewBankList, 'learn'],
    [/^#\/bank\/([\w-]+)$/, viewBank, 'learn'],
    [/^#\/models$/, viewModelList, 'learn'],
    [/^#\/models\/([\w-]+)$/, viewModel, 'learn'],
    [/^#\/grammar$/, viewGrammarList, 'learn'],
    [/^#\/grammar\/([\w-]+)$/, viewLesson, 'learn'],
    [/^#\/grammar\/([\w-]+)\/practice$/, viewGrammarPractice, 'learn'],
    [/^#\/mistakes$/, viewMistakes, 'learn'],
    [/^#\/practice$/, viewPractice, 'practice'],
    [/^#\/reading\/([\w-]+)$/, viewReading, 'practice'],
    [/^#\/listening\/dict$/, viewDictation, 'practice'],
    [/^#\/listening\/([\w-]+)$/, viewListening, 'practice'],
    [/^#\/writing$/, viewWritingList, 'practice'],
    [/^#\/writing\/([\w-]+)(?:\/(\w+))?$/, viewWriting, 'practice'],
    [/^#\/vocab$/, viewVocab, 'vocab'],
    [/^#\/vocab\/mine$/, viewMyWords, 'vocab'],
    [/^#\/progress$/, viewProgress, 'progress']
  ];
  function go(h) { location.hash = h; }
  function runCleanups() { cleanups.forEach((f) => { try { f(); } catch (e) { /* ignore */ } }); cleanups = []; }
  function route(keepScroll) {
    runCleanups(); closeSheet();
    const h = location.hash || '#/today';
    for (const [re, fn, tab] of ROUTES) {
      const m = h.match(re);
      if (m) {
        $$('.tabs a').forEach((a) => a.classList.toggle('active', a.dataset.tab === tab));
        fn(...m.slice(1));
        if (keepScroll !== true) window.scrollTo(0, 0);
        renderStreak();
        return;
      }
    }
    go('#/today');
  }
  window.addEventListener('hashchange', route);
  window.addEventListener('pagehide', runCleanups);
  route();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline cache optional */ });
  }
})();
