/* IELTS Yol Koçu — app logic (no build step, no dependencies). */
(() => {
  'use strict';
  const C = window.CONTENT;
  const main = document.getElementById('main');
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s).toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, ' ').replace(/[.,!?;:]+$/, '').trim();
  const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const rnd = (n) => Math.floor(Math.random() * n);
  const pick = (a) => a[rnd(a.length)];

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
    settings: { rate: 0.9 }
  });
  let S = fresh();
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved) {
      const f = fresh();
      S = Object.assign(f, saved);
      S.listening = Object.assign(f.listening, saved.listening || {});
      S.writing = Object.assign(f.writing, saved.writing || {});
      S.settings = Object.assign(f.settings, saved.settings || {});
    }
  } catch (e) { /* storage unavailable: run in memory */ }
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
  const renderStreak = () => { const n = streak(); $('#streak').textContent = n ? '🔥 ' + n + ' gün' : ''; };

  const dayNo = () => Math.max(1, dayDiff(S.start, today()) + 1);
  const weekNo = () => Math.ceil(dayNo() / 7);
  const phase = () => (weekNo() <= 4 ? 1 : weekNo() <= 8 ? 2 : 3);
  const PHASES = { 1: 'Faz 1 · Temel (1–4. hafta)', 2: 'Faz 2 · Beceri (5–8. hafta)', 3: 'Faz 3 · Deneme sınavı (9–12. hafta)' };

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
    b.onclick = () => { location.hash = backTo; };
  };
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

  // ---------- speech ----------
  const tts = {
    ok: 'speechSynthesis' in window,
    voices: [],
    load() {
      if (!this.ok) return;
      const all = speechSynthesis.getVoices();
      const en = all.filter((v) => /^en[-_]/i.test(v.lang));
      const gb = en.filter((v) => /GB/i.test(v.lang));
      this.voices = gb.concat(en.filter((v) => !/GB/i.test(v.lang)));
    },
    speak(parts, onEnd) {
      // parts: [{text, v: 0|1}]
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
    ? '<div class="ielts-note">İngilizce ses bulunamadı. Android\'de: <b>Ayarlar → Metin okuma çıktısı → Google → Ses verilerini yükle → English (UK)</b>. Offline kullanım için indir.</div>'
    : (!tts.ok ? '<div class="ielts-note">Bu tarayıcı sesli okumayı desteklemiyor. Chrome kullan.</div>' : ''));

  // ---------- views ----------
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
    'Task 1\'de kendi yorumunu ya da sebep tahmini yazma. Sadece veriyi raporla.'
  ];

  function nextGrammarUnit() {
    return C.grammar.find((u) => !(S.grammar[u.id] && S.grammar[u.id].done)) || null;
  }
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
      return { w, mode, label: mode === 'intro' ? 'Task 2 giriş paragrafı (~8 dk)' : mode === 'body' ? 'Task 2 tek body paragrafı (~15 dk)' : 'Task 1 giriş + overview (~6 dk)' };
    }
    const pool = d % 2 ? t1 : t2;
    const w = pool[Math.floor(d / 2) % pool.length];
    return { w, mode: 'full', label: (w.task === 1 ? 'Task 1 tam yazı' : 'Task 2 tam essay') + (ph === 3 ? ' · süreli (sınav koşulu)' : ' · süresiz') };
  }

  function taskItem(href, emoji, title, sub, done) {
    return `<a class="item ${done ? 'done' : ''}" href="${href}"><span class="emoji">${emoji}</span><span class="grow"><span class="t">${title}</span><br><span class="s">${sub}</span></span><span class="chev">›</span></a>`;
  }

  function viewToday() {
    setHeader('IELTS Yol Koçu');
    const d = dayNo(), ph = phase();
    const exam = S.examDate ? dayDiff(today(), S.examDate) : null;
    const g = nextGrammarUnit();
    const r = nextReading();
    const ws = writingSuggestion();
    const L = todayLog();
    const listenHref = ph >= 2 && d % 2 === 0 ? '#/listening/' + C.listening[Math.floor(d / 2) % C.listening.length].id : '#/listening/dict';
    const listenSub = listenHref === '#/listening/dict' ? `Sayı, tarih, isim harfleme dikte · ${Math.min(L.listening || 0, 10)}/10` : 'Part 1/2 kaydı + form doldurma';
    const morning = `<div class="section-label">Sabah · yolda dinle & oku (~1,5 saat)</div>
      ${taskItem(listenHref, '🎧', 'Listening', listenSub, isDone('listening'))}
      ${taskItem('#/reading/' + r.id, '📖', 'Reading: ' + esc(r.title), 'TFNG + başlık eşleştirme + boşluk · 20 dk', isDone('reading'))}
      ${taskItem('#/vocab', '🃏', 'Kelime kartları', `Aralıklı tekrar · ${Math.min(L.vocab || 0, 20)}/20 kart`, isDone('vocab'))}`;
    const evening = `<div class="section-label">Akşam · yolda üret (~1,5 saat)</div>
      ${g ? taskItem('#/grammar/' + g.id, g.emoji, 'Gramer: ' + esc(g.title), 'Kısa ders + 8 alıştırma', isDone('grammar'))
          : taskItem('#/mistakes', '🔁', 'Gramer: Hata defteri tekrarı', `${S.mistakes.length} kayıtlı hata`, isDone('grammar'))}
      ${taskItem('#/writing/' + ws.w.id + '/' + ws.mode, '✍️', 'Writing: ' + esc(ws.label), esc(ws.w.title), isDone('writing'))}`;
    const doneCount = Object.keys(DAILY).filter(isDone).length;
    const evening1st = new Date().getHours() >= 14;
    main.innerHTML = `
      <div class="card hero">
        <div class="row"><div class="grow"><b>Gün ${d} / 84</b> · ${PHASES[ph]}</div><span class="badge ${doneCount === 5 ? 'ok' : ''}">${doneCount}/5</span></div>
        <div class="bar" style="margin-top:8px"><span style="width:${Math.min(100, pct(d, 84))}%"></span></div>
        <p class="muted" style="margin:8px 0 0">${exam !== null ? (exam >= 0 ? `Sınava <b>${exam}</b> gün kaldı.` : 'Sınav tarihi geçti. İlerleme sayfasından güncelle.') : '<a href="#/progress">Sınav tarihini ekle</a>, geri sayım başlasın.'}</p>
      </div>
      ${evening1st ? evening + morning : morning + evening}
      <div class="card" style="margin-top:18px"><b>💡 Günün ipucu</b><p style="margin-bottom:0">${TIPS[d % TIPS.length]}</p></div>`;
  }

  // ----- grammar -----
  function viewGrammarList() {
    setHeader('Gramer & Cümle Kurma');
    const items = C.grammar.map((u, i) => {
      const st = S.grammar[u.id];
      const badge = st ? `<span class="badge ${st.done ? 'ok' : 'warn'}">${st.best}/${u.exercises.length}</span>` : '<span class="badge">yeni</span>';
      return `<a class="item ${st && st.done ? 'done' : ''}" href="#/grammar/${u.id}"><span class="emoji">${u.emoji}</span><span class="grow"><span class="t">${i + 1}. ${esc(u.title)}</span></span>${badge}</a>`;
    }).join('');
    main.innerHTML = `
      <p class="muted">Her ünite: Türkçe kısa açıklama → IELTS bağlantısı → 8 alıştırma (seçmeli, boşluk, kelime dizme, serbest yazma). %75 ve üstü = tamamlandı.</p>
      ${S.mistakes.length ? `<a class="item" href="#/mistakes"><span class="emoji">🔁</span><span class="grow"><span class="t">Hata defteri</span><br><span class="s">Yanlış yaptığın ${S.mistakes.length} soruyu tekrar çöz</span></span><span class="chev">›</span></a>` : ''}
      ${items}`;
  }

  function viewLesson(id) {
    const u = C.grammar.find((x) => x.id === id);
    if (!u) return go('#/grammar');
    setHeader(u.title, '#/grammar');
    const st = S.grammar[u.id];
    main.innerHTML = `
      <div class="ielts-note"><b>IELTS bağlantısı:</b> ${u.ielts}</div>
      <div class="card explain"><h3>Kural</h3><ul>${u.explain.map((e) => `<li>${e}</li>`).join('')}</ul></div>
      <div class="card"><h3>Örnekler</h3><ul class="ex">${u.examples.map((e) => `<li>${esc(e)} <button class="btn small" data-say="${esc(e)}" aria-label="Dinle">🔊</button></li>`).join('')}</ul></div>
      ${st ? `<p class="muted">En iyi skorun: ${st.best}/${u.exercises.length}</p>` : ''}
      <a class="btn primary block" href="#/grammar/${u.id}/practice">Alıştırmaya başla (${u.exercises.length} soru)</a>`;
    $$('[data-say]', main).forEach((b) => b.addEventListener('click', () => tts.speak(b.dataset.say)));
  }

  function viewGrammarPractice(id) {
    const u = C.grammar.find((x) => x.id === id);
    if (!u) return go('#/grammar');
    setHeader(u.title, '#/grammar/' + u.id);
    const list = u.exercises.map((ex, i) => ({ ex, u: u.id, i }));
    runExercises(list, {
      onFinish(score, total) {
        const prev = S.grammar[u.id] || { best: 0, attempts: 0 };
        S.grammar[u.id] = { best: Math.max(prev.best, score), last: score, attempts: prev.attempts + 1, done: prev.done || score / total >= 0.75 };
        save(); logAct('grammar');
        const nxt = nextGrammarUnit();
        return `<a class="btn" href="#/grammar/${u.id}/practice">Tekrar çöz</a>${nxt && nxt.id !== u.id ? `<a class="btn primary" href="#/grammar/${nxt.id}">Sonraki ünite</a>` : `<a class="btn primary" href="#/today">Bugün</a>`}`;
      }
    });
  }

  function viewMistakes() {
    setHeader('Hata defteri', '#/grammar');
    const list = S.mistakes.map((m) => {
      const u = C.grammar.find((x) => x.id === m.u);
      return u && u.exercises[m.i] ? { ex: u.exercises[m.i], u: m.u, i: m.i } : null;
    }).filter(Boolean);
    if (!list.length) {
      main.innerHTML = '<div class="card">Hata defterin boş. 👏 Yanlış yaptığın sorular buraya otomatik eklenir.</div><a class="btn block" href="#/grammar">Gramer ünitelerine dön</a>';
      return;
    }
    runExercises(shuffle(list), {
      review: true,
      onFinish() { logAct('grammar'); return '<a class="btn primary" href="#/grammar">Ünitelere dön</a>'; }
    });
  }

  function addMistake(u, i) { if (!S.mistakes.some((m) => m.u === u && m.i === i)) { S.mistakes.push({ u, i }); save(); } }
  function removeMistake(u, i) { S.mistakes = S.mistakes.filter((m) => !(m.u === u && m.i === i)); save(); }

  const TYPE_LABEL = { mcq: 'Seçmeli', gap: 'Boşluk doldur', build: 'Cümle kur', write: 'Serbest yaz' };

  function runExercises(list, opts) {
    let idx = 0, score = 0;
    const render = () => {
      if (idx >= list.length) {
        const extra = opts.onFinish(score, list.length);
        main.innerHTML = `<div class="card" style="text-align:center"><div style="font-size:2.4rem">${score / list.length >= 0.75 ? '🎉' : '💪'}</div>
          <h2 style="margin-top:4px">${score} / ${list.length}</h2>
          <p class="muted">${score / list.length >= 0.75 ? 'Harika, bu ünite tamam.' : 'Yanlışların hata defterine eklendi. Tekrar et.'}</p></div>
          <div class="btns">${extra}</div>`;
        return;
      }
      const { ex, u, i } = list[idx];
      const head = `<div class="q-head"><span class="q-type">${TYPE_LABEL[ex.type]}</span><span>${idx + 1} / ${list.length}</span></div>
        <div class="bar" style="margin:6px 0 12px"><span style="width:${pct(idx, list.length)}%"></span></div>`;
      const finish = (ok, fbHtml) => {
        if (ok) { score++; if (opts.review) removeMistake(u, i); } else addMistake(u, i);
        const fb = document.createElement('div');
        fb.className = 'feedback ' + (ok ? 'ok' : 'bad');
        fb.innerHTML = `<b>${ok ? '✓ Doğru' : '✗ Yanlış'}</b>${fbHtml}`;
        const next = document.createElement('button');
        next.className = 'btn primary block'; next.textContent = idx + 1 < list.length ? 'Sonraki →' : 'Sonucu gör';
        next.onclick = () => { idx++; render(); window.scrollTo(0, 0); };
        const box = $('#exbox'); box.appendChild(fb); box.appendChild(next);
        next.scrollIntoView({ behavior: 'smooth', block: 'center' });
      };
      const why = ex.why ? `<div>${esc(ex.why)}</div>` : '';

      if (ex.type === 'mcq') {
        main.innerHTML = `<div class="card" id="exbox">${head}<div class="q-text">${esc(ex.q)}</div>
          <div class="opts">${ex.options.map((o, k) => `<button class="opt" data-k="${k}">${esc(o)}</button>`).join('')}</div></div>`;
        $$('.opt', main).forEach((b) => b.addEventListener('click', () => {
          const k = +b.dataset.k, ok = k === ex.answer;
          $$('.opt', main).forEach((x) => { x.disabled = true; if (+x.dataset.k === ex.answer) x.classList.add('correct'); });
          if (!ok) b.classList.add('incorrect');
          finish(ok, why);
        }));
      } else if (ex.type === 'gap') {
        main.innerHTML = `<div class="card" id="exbox">${head}<div class="q-text">${esc(ex.q)}</div>
          <input type="text" id="gapIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Cevabını yaz">
          <div class="btns"><button class="btn primary" id="chk">Kontrol et</button></div></div>`;
        const inp = $('#gapIn'), chk = $('#chk');
        const check = () => {
          if (!inp.value.trim()) return;
          const ok = ex.answers.map(norm).includes(norm(inp.value));
          inp.disabled = true; chk.remove();
          finish(ok, `<div class="model">Cevap: <b>${esc(ex.answers.join(' / '))}</b></div>${why}`);
        };
        chk.onclick = check;
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
        inp.focus();
      } else if (ex.type === 'build') {
        let pool = shuffle(ex.words.map((w, k) => ({ w, k })));
        if (pool.map((p) => p.w).join(' ') === ex.answer && pool.length > 2) pool = pool.slice(1).concat(pool[0]);
        const chosen = [];
        main.innerHTML = `<div class="card" id="exbox">${head}<div class="q-text">🇹🇷 ${esc(ex.tr)}</div>
          <div class="slot" id="slot"></div><div class="pool" id="pool"></div>
          <div class="btns"><button class="btn" id="rst">Sıfırla</button><button class="btn primary" id="chk" disabled>Kontrol et</button></div></div>`;
        const draw = () => {
          $('#slot').innerHTML = chosen.map((p, n) => `<button class="tok" data-n="${n}">${esc(p.w)}</button>`).join('') || '<span class="muted" style="padding:6px">Kelimelere sırayla dokun…</span>';
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
          $('#rst').remove(); $('#chk').remove();
          finish(ok, `<div class="model">${esc(ex.answer)}.</div>${why} <button class="btn small" id="say">🔊 Dinle</button>`);
          $('#say').onclick = () => tts.speak(ex.answer);
        };
      } else if (ex.type === 'write') {
        main.innerHTML = `<div class="card" id="exbox">${head}<div class="q-text">${esc(ex.prompt)}</div>
          <textarea id="wIn" style="min-height:110px" placeholder="İngilizce yaz…" spellcheck="false"></textarea>
          <div class="btns"><button class="btn primary" id="show">Model cevabı göster</button></div></div>`;
        $('#show').onclick = () => {
          const mine = $('#wIn').value.trim();
          $('#show').parentElement.remove();
          $('#wIn').disabled = true;
          const auto = mine && ex.models.map(norm).includes(norm(mine));
          const box = document.createElement('div');
          box.className = 'feedback';
          box.style.background = 'var(--surface-2)';
          box.innerHTML = `<b>Model cevap${ex.models.length > 1 ? 'lar' : ''}:</b>${ex.models.map((m) => `<div class="model">• ${esc(m)}</div>`).join('')}<div><b>Odak:</b> ${esc(ex.focus)}</div>
            ${auto ? '' : '<p style="margin:10px 0 4px"><b>Kendini değerlendir.</b> Anlam ve gramer olarak modelle aynı mı?</p><div class="btns"><button class="btn" id="selfBad">✗ Hatam var</button><button class="btn primary" id="selfOk">✓ Doğru / çok yakın</button></div>'}`;
          $('#exbox').appendChild(box);
          if (auto) { finish(true, ''); return; }
          $('#selfOk').onclick = () => { box.querySelector('.btns').remove(); finish(true, ''); };
          $('#selfBad').onclick = () => { box.querySelector('.btns').remove(); finish(false, '<div>Bu soru hata defterine eklendi. Modeli bir kez sesli/yazılı tekrar et.</div>'); };
        };
      }
    };
    render();
  }

  // ----- practice hub -----
  function viewPractice() {
    setHeader('Pratik');
    const rItems = C.reading.map((r) => {
      const st = S.reading[r.id];
      return `<a class="item" href="#/reading/${r.id}"><span class="emoji">📖</span><span class="grow"><span class="t">${esc(r.title)}</span><br><span class="s">${r.minutes} dk · ${countReadingQs(r)} soru</span></span>${st ? `<span class="badge ${st.best / st.total >= 0.75 ? 'ok' : 'warn'}">${st.best}/${st.total}</span>` : '<span class="badge">yeni</span>'}</a>`;
    }).join('');
    const d = S.listening.dict;
    const lItems = `<a class="item" href="#/listening/dict"><span class="emoji">🔢</span><span class="grow"><span class="t">Dikte: sayı, tarih, harfleme</span><br><span class="s">Sınırsız · doğruluk %${pct(d.right, d.total)} (${d.total} deneme)</span></span><span class="chev">›</span></a>` +
      C.listening.map((l) => {
        const st = S.listening.scripts[l.id];
        return `<a class="item" href="#/listening/${l.id}"><span class="emoji">🎧</span><span class="grow"><span class="t">${esc(l.title)}</span><br><span class="s">${l.questions.length} soru</span></span>${st ? `<span class="badge ${st.best / st.total >= 0.75 ? 'ok' : 'warn'}">${st.best}/${st.total}</span>` : '<span class="badge">yeni</span>'}</a>`;
      }).join('');
    main.innerHTML = `
      <div class="section-label">Listening</div>${lItems}
      <div class="section-label">Reading (Academic)</div>${rItems}
      <div class="section-label">Writing</div>
      <a class="item" href="#/writing"><span class="emoji">✍️</span><span class="grow"><span class="t">Writing atölyesi</span><br><span class="s">Task 1 & Task 2 · ${S.writing.history.length} yazı kaydedildi</span></span><span class="chev">›</span></a>`;
  }
  const countReadingQs = (r) => r.questions.reduce((n, q) => n + q.items.length, 0);

  // ----- reading -----
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

  function viewReading(id) {
    const r = C.reading.find((x) => x.id === id);
    if (!r) return go('#/practice');
    setHeader('Reading', '#/practice');
    let n = 0;
    const qs = r.questions.map((block, bi) => {
      if (block.kind === 'tfng') {
        return `<div class="card"><h3>Questions ${n + 1}–${n + block.items.length}</h3><p class="muted">TRUE / FALSE / NOT GIVEN</p>` +
          block.items.map((it, k) => { n++; return `<div class="qblock" data-b="${bi}" data-k="${k}"><b>${n}.</b> ${esc(it.s)}<div class="tfng">${['T', 'F', 'NG'].map((v) => `<button class="opt" data-v="${v}">${v === 'T' ? 'TRUE' : v === 'F' ? 'FALSE' : 'NOT GIVEN'}</button>`).join('')}</div><div class="ans-note"></div></div>`; }).join('') + '</div>';
      }
      if (block.kind === 'headings') {
        return `<div class="card"><h3>Questions ${n + 1}–${n + block.items.length}</h3><p class="muted">Her paragraf için doğru başlığı seç.</p><ul class="list" style="font-size:.92rem;margin-bottom:8px">${block.options.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>` +
          block.items.map((it, k) => { n++; return `<div class="qblock" data-b="${bi}" data-k="${k}"><label>${n}. Paragraph ${it.p}</label><select><option value="">— seç —</option>${block.options.map((o, oi) => `<option value="${oi}">${esc(o.split('.')[0])}</option>`).join('')}</select><div class="ans-note"></div></div>`; }).join('') + '</div>';
      }
      return `<div class="card"><h3>Questions ${n + 1}–${n + block.items.length}</h3><p class="muted">${esc(block.note)}</p>` +
        block.items.map((it, k) => { n++; return `<div class="qblock" data-b="${bi}" data-k="${k}"><b>${n}.</b> ${esc(it.s)}<input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" style="margin-top:6px"><div class="ans-note"></div></div>`; }).join('') + '</div>';
    }).join('');
    main.innerHTML = `
      <div class="sticky-tools"><span class="timer" id="tmr"></span><button class="btn small" id="tbtn">▶ Süreyi başlat</button></div>
      <div class="card passage"><h2 style="font-family:var(--font)">${esc(r.title)}</h2>${r.paragraphs.map(([l, t]) => `<p><span class="pl">${l}</span>${esc(t)}</p>`).join('')}</div>
      ${qs}
      <button class="btn primary block" id="check">Cevapları kontrol et</button>
      <div id="result"></div>`;
    const timer = startTimer($('#tmr'), r.minutes * 60);
    $('#tbtn').onclick = () => { $('#tbtn').textContent = timer.toggle() ? '❚❚ Duraklat' : '▶ Devam'; };
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
        $('.ans-note', q).innerHTML = ok ? '<span class="right">✓ Doğru</span>' : `<span style="color:var(--bad)">✗</span> Doğru cevap: <b>${esc(ans)}</b>`;
      });
      $('#check').remove();
      const prev = S.reading[r.id];
      S.reading[r.id] = { best: Math.max(prev ? prev.best : 0, right), last: right, total, attempts: (prev ? prev.attempts : 0) + 1 };
      save(); logAct('reading');
      const band = right / total >= 0.85 ? '7+' : right / total >= 0.7 ? '6–6.5' : right / total >= 0.5 ? '5–5.5' : '5 altı';
      $('#result').innerHTML = `<div class="card" style="text-align:center"><h2 style="margin:0">${right} / ${total}</h2><p class="muted">Süre: ${Math.round(timer.elapsed() / 60)} dk · Kaba band tahmini: <b>${band}</b></p>
        <p class="muted" style="font-size:.85rem">Yanlışlarda metne dönüp kanıt cümlesini bul. Bu Reading\'de en hızlı gelişme yoludur.</p></div>
        <div class="btns"><a class="btn" href="#/reading/${r.id}" id="again">Tekrar çöz</a><a class="btn primary" href="#/practice">Pratik</a></div>`;
      $('#again').onclick = (e) => { e.preventDefault(); route(true); };
      $('#result').scrollIntoView({ behavior: 'smooth' });
    };
  }

  // ----- listening: dictation -----
  const NAMES = ['MACKENZIE', 'HARTLEY', 'FITZGERALD', 'WOODWARD', 'CALLAGHAN', 'PEMBERTON', 'ROSSITER', 'BLACKWELL', 'THOMPSON', 'GALLAGHER', 'PHILLIPS', 'HOLLOWAY', 'ASHWORTH', 'KEMPTON', 'JEFFERSON', 'WHITTAKER', 'HUTCHINSON', 'BRADSHAW', 'ELLWOOD', 'QUENTIN'];
  const STREETS = ['Bridge', 'Station', 'Harbour', 'Mill', 'Church', 'Kingsley', 'Abbott', 'Greenhill'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const ORD = (n) => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
  const digitWord = (d) => (d === '0' ? 'oh' : d);
  function spellOut(word) {
    const out = []; const w = word.toUpperCase();
    for (let i = 0; i < w.length; i++) {
      if (w[i] === w[i + 1]) { out.push('double ' + w[i]); i++; } else out.push(w[i]);
    }
    return out.join(', ');
  }
  function makeDict() {
    const kind = pick(['phone', 'spell', 'spell', 'price', 'date', 'flight', 'year', 'address']);
    if (kind === 'phone') {
      const num = '07' + Array.from({ length: 9 }, () => rnd(10)).join('');
      const g = [num.slice(0, 5), num.slice(5, 8), num.slice(8)];
      return { kind, label: 'Telefon numarası', say: g.map((x) => x.split('').map(digitWord).join(' ')).join(', '), check: (v) => v.replace(/\D/g, '') === num, show: num };
    }
    if (kind === 'spell') {
      const n = pick(NAMES);
      return { kind, label: 'Soyadı (harf harf okunacak)', say: 'The surname is ' + n.charAt(0) + n.slice(1).toLowerCase() + '. ' + spellOut(n) + '.', check: (v) => norm(v) === n.toLowerCase(), show: n.charAt(0) + n.slice(1).toLowerCase() };
    }
    if (kind === 'price') {
      const p = 2 + rnd(198), c = pick([0, 25, 50, 75, 99, 45, 20]);
      const val = p + c / 100;
      return { kind, label: 'Fiyat (£)', say: 'It costs £' + val.toFixed(2).replace('.00', '') + '.', check: (v) => Math.abs(parseFloat(v.replace(/[£\s,]/g, '')) - val) < 0.001, show: '£' + val.toFixed(2) };
    }
    if (kind === 'date') {
      const d = 1 + rnd(28), m = rnd(12);
      return { kind, label: 'Tarih (gün + ay)', say: 'The course starts on the ' + ORD(d) + ' of ' + MONTHS[m] + '.', check: (v) => {
        const num = (v.match(/\d+/) || [])[0];
        const mon = MONTHS.findIndex((x) => norm(v).includes(x.slice(0, 3).toLowerCase()));
        const slash = v.match(/(\d{1,2})\s*[\/.\-]\s*(\d{1,2})/);
        return (+num === d && mon === m) || (!!slash && +slash[1] === d && +slash[2] === m + 1);
      }, show: d + ' ' + MONTHS[m] };
    }
    if (kind === 'flight') {
      const code = pick(['BA', 'TK', 'LH', 'EK', 'QR', 'AF']) + (100 + rnd(9900));
      return { kind, label: 'Uçuş kodu', say: 'Your flight number is ' + code.slice(0, 2).split('').join(' ') + ', ' + code.slice(2).split('').join(' ') + '.', check: (v) => v.replace(/\s/g, '').toUpperCase() === code, show: code };
    }
    if (kind === 'year') {
      const y = 1900 + rnd(130);
      return { kind, label: 'Yıl', say: 'The building was completed in ' + y + '.', check: (v) => v.replace(/\D/g, '') === String(y), show: String(y) };
    }
    const no = 2 + rnd(240), st = pick(STREETS);
    return { kind, label: 'Adres (numara + sokak adı)', say: 'The address is ' + no + ' ' + st + ' Road.', check: (v) => { const s = norm(v); return s.includes(String(no)) && s.includes(st.toLowerCase()); }, show: no + ' ' + st + ' Road' };
  }

  function viewDictation() {
    setHeader('Listening: Dikte', '#/practice');
    let item = null, session = { right: 0, total: 0 };
    const draw = () => {
      item = makeDict();
      main.innerHTML = `${voiceWarning()}
        <div class="card"><div class="q-head"><span class="q-type">${esc(item.label)}</span><span>Bu oturum: ${session.right}/${session.total}</span></div>
        <p class="muted" style="margin-top:8px">Sınavda bu tür sorular (isim harfleme, telefon, tarih) en kolay puanlardır ama yazım hatası = yanlış.</p>
        <div class="btns"><button class="btn primary" id="play">🔊 Dinle</button><button class="btn" id="slow">🐢 Yavaş</button></div>
        <input type="text" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Duyduğunu yaz">
        <div class="btns"><button class="btn primary" id="chk">Kontrol et</button></div><div id="fb"></div></div>
        <div class="card"><label for="rate">Konuşma hızı: <span id="rv">${S.settings.rate}</span></label><input type="range" id="rate" min="0.6" max="1.2" step="0.05" value="${S.settings.rate}" style="width:100%"></div>`;
      $('#play').onclick = () => tts.speak(item.say);
      $('#slow').onclick = () => { const r = S.settings.rate; S.settings.rate = 0.65; tts.speak(item.say); S.settings.rate = r; };
      $('#rate').oninput = (e) => { S.settings.rate = +e.target.value; $('#rv').textContent = S.settings.rate; save(); };
      const check = () => {
        const v = $('#ans').value.trim(); if (!v) return;
        const ok = item.check(v);
        session.total++; S.listening.dict.total++;
        if (ok) { session.right++; S.listening.dict.right++; }
        save(); logAct('listening');
        $('#ans').disabled = true; $('#chk').remove();
        $('#fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'bad'}"><b>${ok ? '✓ Doğru' : '✗ Yanlış'}</b> · Cevap: <b>${esc(item.show)}</b></div><button class="btn primary block" id="nx">Sonraki →</button>`;
        $('#nx').onclick = () => { draw(); setTimeout(() => tts.speak(item.say), 150); };
      };
      $('#chk').onclick = check;
      $('#ans').addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
    };
    draw();
    onCleanup(() => tts.stop());
  }

  // ----- listening: scripts -----
  function viewListening(id) {
    const l = C.listening.find((x) => x.id === id);
    if (!l) return go('#/practice');
    setHeader('Listening', '#/practice');
    const speakers = [...new Set(l.lines.map((x) => x[0]))];
    let plays = 0;
    main.innerHTML = `${voiceWarning()}
      <div class="card"><h3>${esc(l.title)}</h3><p class="muted">${esc(l.note)}</p>
        <p class="muted" style="font-size:.88rem">Önce soruları oku (sınavda da süre verilir), sonra dinle. Gerçek sınavda kayıt <b>tek sefer</b> çalınır.</p>
        <div class="btns"><button class="btn primary" id="play">▶ Dinle</button><button class="btn" id="stop">■ Durdur</button></div>
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
        $('.ans-note', q).innerHTML = ok ? '<span class="right">✓ Doğru</span>' : `<span style="color:var(--bad)">✗</span> Doğru cevap: <b>${esc(it.a[0])}</b>`;
      });
      $('#check').remove();
      const prev = S.listening.scripts[l.id];
      S.listening.scripts[l.id] = { best: Math.max(prev ? prev.best : 0, right), total: l.questions.length };
      save(); logAct('listening', 10);
      $('#result').innerHTML = `<div class="card" style="text-align:center"><h2 style="margin:0">${right} / ${l.questions.length}</h2></div>
        <details class="card"><summary>Metni göster (transcript)</summary><div class="passage">${l.lines.map(([sp, t]) => `<p><b>${esc(sp)}:</b> ${esc(t)}</p>`).join('')}</div></details>
        <p class="muted">İpucu: Yanlış yaptığın yerin transcript\'ini oku, sonra kaydı metne bakarak bir kez daha dinle.</p>
        <a class="btn primary block" href="#/practice">Pratik</a>`;
    };
  }

  // ----- writing -----
  const MODES = {
    1: { full: { label: 'Tam yazı', words: 150, min: 20 }, overview: { label: 'Giriş + overview', words: 40, min: 6 } },
    2: { full: { label: 'Tam essay', words: 250, min: 40 }, intro: { label: 'Giriş paragrafı', words: 50, min: 8 }, body: { label: 'Tek body paragrafı', words: 100, min: 15 } }
  };

  function viewWritingList() {
    setHeader('Writing atölyesi', '#/practice');
    const row = (w) => {
      const n = S.writing.history.filter((h) => h.id === w.id).length;
      return `<a class="item" href="#/writing/${w.id}"><span class="emoji">${w.task === 1 ? '📊' : '📝'}</span><span class="grow"><span class="t">${esc(w.title)}</span></span>${n ? `<span class="badge ok">${n}×</span>` : ''}</a>`;
    };
    const hist = S.writing.history.slice(-5).reverse();
    main.innerHTML = `
      <div class="ielts-note">Task 2, Writing puanının <b>2/3</b>\'ü. Yolda paragraf paragraf çalış; tam essay\'i sınav koşulunda (40 dk) yaz.</div>
      <div class="section-label">Task 1 · 20 dk · 150+ kelime</div>${C.writing.filter((w) => w.task === 1).map(row).join('')}
      <div class="section-label">Task 2 · 40 dk · 250+ kelime</div>${C.writing.filter((w) => w.task === 2).map(row).join('')}
      ${hist.length ? `<div class="section-label">Son yazıların</div>${hist.map((h, k) => `<details class="card"><summary>${esc(h.date)} · ${esc((C.writing.find((w) => w.id === h.id) || {}).title || h.id)} · ${h.words} kelime</summary><p style="white-space:pre-wrap;font-family:var(--serif)">${esc(h.text)}</p></details>`).join('')}` : ''}`;
  }

  function chartHtml(ch) {
    if (ch.type === 'process') {
      return `<div class="flow">${ch.steps.map((s, i) => `${i ? '<div class="arr">↓</div>' : ''}<div>${i + 1}. ${esc(s)}</div>`).join('')}</div>`;
    }
    const W = 340, H = 220, L = 34, R = 10, T = 10, B = 28;
    const colors = ['#1f6feb', '#e8710a', '#12a150'];
    const max = Math.max(...ch.series.flatMap((s) => s.data));
    const step = max > 40 ? 10 : 5;
    const top = Math.ceil(max / step) * step;
    const y = (v) => T + (H - T - B) * (1 - v / top);
    let g = '';
    for (let v = 0; v <= top; v += step) g += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="currentColor" stroke-opacity=".15"/><text x="${L - 5}" y="${y(v) + 4}" text-anchor="end" font-size="10" fill="currentColor" opacity=".7">${v}</text>`;
    const n = ch.labels.length, span = (W - L - R) / n;
    ch.labels.forEach((lb, i) => { g += `<text x="${L + span * (i + 0.5)}" y="${H - 10}" text-anchor="middle" font-size="10" fill="currentColor" opacity=".8">${esc(lb)}</text>`; });
    if (ch.type === 'line') {
      ch.series.forEach((s, si) => {
        const pts = s.data.map((v, i) => `${L + span * (i + 0.5)},${y(v)}`);
        g += `<polyline points="${pts.join(' ')}" fill="none" stroke="${colors[si]}" stroke-width="2.5"/>` + pts.map((p) => `<circle cx="${p.split(',')[0]}" cy="${p.split(',')[1]}" r="3.5" fill="${colors[si]}"/>`).join('');
      });
    } else {
      const bw = (span * 0.7) / ch.series.length;
      ch.series.forEach((s, si) => s.data.forEach((v, i) => {
        const x = L + span * i + span * 0.15 + bw * si;
        g += `<rect x="${x}" y="${y(v)}" width="${bw - 2}" height="${y(0) - y(v)}" rx="2" fill="${colors[si]}"/>`;
      }));
    }
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik">${g}<text x="4" y="${T + 4}" font-size="9" fill="currentColor" opacity=".7">${esc(ch.unit)}</text></svg>
      <div class="legend">${ch.series.map((s, si) => `<span><i style="background:${colors[si]}"></i>${esc(s.name)}</span>`).join('')}</div></div>`;
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

  async function copyText(text, fallbackHost) {
    try { await navigator.clipboard.writeText(text); toast('Kopyalandı. Claude\'a yapıştır.'); return; } catch (e) { /* fall back */ }
    fallbackHost.innerHTML = `<p class="muted">Otomatik kopyalanamadı. Metni seçip kopyala:</p><textarea class="copybox" readonly></textarea>`;
    const ta = $('textarea', fallbackHost); ta.value = text; ta.focus(); ta.select();
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
      <div class="card"><h3>${esc(w.title)}</h3><p class="ex">${esc(w.prompt)}</p>${w.chart ? chartHtml(w.chart) : ''}</div>
      <div class="btns">${Object.entries(modes).map(([k, v]) => `<a class="btn small ${k === mode ? 'primary' : ''}" href="#/writing/${w.id}/${k}">${v.label}</a>`).join('')}</div>
      <details class="card"><summary>📐 Paragraf planı</summary><ul>${guide.plan.map((p) => `<li>${p}</li>`).join('')}</ul></details>
      <details class="card"><summary>🧱 Kalıp cümleler</summary><ul class="ex">${guide.phrases.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></details>
      <div class="sticky-tools"><span><span class="timer" id="tmr"></span> <small class="muted">/ ${m.min} dk</small></span><span id="wc" class="badge">0 / ${m.words}</span><button class="btn small" id="tbtn">▶ Başlat</button></div>
      <textarea id="txt" placeholder="${mode === 'full' ? 'Yazmaya başla…' : m.label + ' yaz…'}" spellcheck="false" autocapitalize="sentences"></textarea>
      <div class="btns"><button class="btn primary" id="done">✓ Bitirdim, kaydet</button><button class="btn" id="ai">🤖 Claude'a değerlendirt</button></div>
      <div id="copyHost"></div>
      <details class="card"><summary>✅ Teslimden önce öz-kontrol</summary><ul>
        <li><b>${w.task === 1 ? 'TA' : 'TR'}:</b> ${w.task === 1 ? 'Overview var mı? Önemli veriler ve karşılaştırmalar var mı? Yorum eklemedin mi?' : 'Sorunun TÜM kısımlarına cevap verdin mi? Pozisyonun baştan sona net mi?'}</li>
        <li><b>CC:</b> Her paragrafın tek bir ana fikri var mı? Bağlaçlar doğal mı, aşırı mı?</li>
        <li><b>LR:</b> Aynı kelimeyi tekrarladın mı? En az 2 collocation kullandın mı?</li>
        <li><b>GRA:</b> En az 1 relative clause, 1 conditional/passive var mı? Artikel ve çoğul -s kontrolü.</li></ul></details>`;
    const ta = $('#txt');
    ta.value = S.writing.drafts[dkey] || '';
    const timer = startTimer($('#tmr'), 0, false);
    const paintWc = () => { const n = countWords(ta.value); const b = $('#wc'); b.textContent = n + ' / ' + m.words; b.className = 'badge ' + (n >= m.words ? 'ok' : ''); };
    paintWc();
    let saveT;
    ta.addEventListener('input', () => {
      paintWc();
      if (!timer.running && ta.value.length === 1) { timer.start(); $('#tbtn').textContent = '❚❚ Duraklat'; }
      clearTimeout(saveT); saveT = setTimeout(() => { S.writing.drafts[dkey] = ta.value; save(); }, 400);
    });
    onCleanup(() => { clearTimeout(saveT); S.writing.drafts[dkey] = ta.value; save(); });
    $('#tbtn').onclick = () => { $('#tbtn').textContent = timer.toggle() ? '❚❚ Duraklat' : '▶ Devam'; };
    $('#done').onclick = () => {
      const text = ta.value.trim();
      if (countWords(text) < 15) { toast('Önce biraz yaz 🙂'); return; }
      timer.pause();
      S.writing.history.push({ id: w.id, mode, text, words: countWords(text), minutes: Math.round(timer.elapsed() / 60), date: today() });
      S.writing.drafts[dkey] = '';
      save(); logAct('writing');
      toast('Kaydedildi ✓');
      $('#copyHost').innerHTML = `<div class="card"><b>Kaydedildi.</b> ${countWords(text)} kelime, ${Math.round(timer.elapsed() / 60)} dk.<p class="muted">Şimdi "Claude'a değerlendirt" ile band tahmini ve hata tablosu al. Düzeltilmiş versiyonu bir kez yeniden yazmak en hızlı gelişme yoludur.</p></div>`;
      ta.dataset.saved = text;
      ta.value = '';
      paintWc();
    };
    $('#ai').onclick = () => {
      const text = ta.value.trim() || ta.dataset.saved || '';
      if (countWords(text) < 15) { toast('Değerlendirme için önce yaz.'); return; }
      copyText(claudePrompt(w, mode, text), $('#copyHost')).then(() => {
        if (!$('#openClaude')) $('#copyHost').insertAdjacentHTML('beforeend', '<a class="btn block" id="openClaude" href="https://claude.ai/new" target="_blank" rel="noopener">Claude\'u aç ↗</a>');
      });
    };
  }

  // ----- vocab (Leitner SRS) -----
  const INTERVAL = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 };
  function vocabQueue() {
    const t = today();
    const due = C.vocab.filter((v) => S.vocab[v.w] && S.vocab[v.w].due <= t);
    const fresh = C.vocab.filter((v) => !S.vocab[v.w]).slice(0, 10);
    return shuffle(due).concat(fresh).slice(0, 25);
  }
  function viewVocab() {
    setHeader('Kelime');
    let queue = vocabQueue();
    const stats = () => {
      const vals = C.vocab.map((v) => S.vocab[v.w]);
      return { learned: vals.filter((s) => s && s.box >= 3).length, learning: vals.filter((s) => s && s.box < 3).length, fresh: vals.filter((s) => !s).length };
    };
    const draw = () => {
      const st = stats();
      const head = `<div class="stat-grid" style="grid-template-columns:repeat(3,1fr)"><div class="stat"><div class="n">${st.learned}</div><div class="l">öğrenildi</div></div><div class="stat"><div class="n">${st.learning}</div><div class="l">tekrarda</div></div><div class="stat"><div class="n">${st.fresh}</div><div class="l">yeni</div></div></div>`;
      if (!queue.length) {
        main.innerHTML = head + `<div class="card" style="text-align:center"><div style="font-size:2rem">✅</div><b>Bugünlük kart kalmadı.</b><p class="muted">Aralıklı tekrar: kartlar unutmak üzere olduğun gün geri gelir. Yarın yeni kartlar açılacak.</p></div>`;
        return;
      }
      const v = queue[0];
      const box = S.vocab[v.w] ? S.vocab[v.w].box : 0;
      main.innerHTML = head + `
        <div class="card flash"><span class="badge">${box ? 'Kutu ' + box : 'Yeni'} · kalan ${queue.length}</span>
          <div class="w">${esc(v.w)}</div><button class="btn small" id="say">🔊</button>
          <div id="back" class="hidden"><div class="tr">${esc(v.tr)}</div><div class="col">${esc(v.col)}</div><div class="exs">${esc(v.ex)}</div></div>
        </div>
        <div id="ctrl"><button class="btn primary block" id="reveal">Anlamını göster</button><p class="muted" style="text-align:center;font-size:.85rem">Önce anlamını ve bir örnek cümleyi içinden söylemeye çalış.</p></div>`;
      $('#say').onclick = () => tts.speak(v.w + '. ' + v.ex);
      $('#reveal').onclick = () => {
        $('#back').classList.remove('hidden');
        $('#ctrl').innerHTML = `<div class="btns"><button class="btn" data-g="0">✗ Bilmiyordum</button><button class="btn" data-g="1">~ Zor</button><button class="btn primary" data-g="2">✓ Biliyorum</button></div>`;
        $$('[data-g]', main).forEach((b) => b.onclick = () => grade(v, +b.dataset.g));
      };
    };
    const grade = (v, g) => {
      const cur = S.vocab[v.w] || { box: 0 };
      let box;
      if (g === 0) box = 1; else if (g === 1) box = Math.max(1, cur.box); else box = Math.min(5, cur.box + 1);
      S.vocab[v.w] = { box, due: g === 0 ? today() : addDays(today(), INTERVAL[box]) };
      queue.shift();
      if (g === 0 && !queue.slice(-3).includes(v)) queue.push(v);
      save(); logAct('vocab');
      draw();
    };
    draw();
    onCleanup(() => tts.stop());
  }

  // ----- progress & settings -----
  function viewProgress() {
    setHeader('İlerleme');
    const gDone = C.grammar.filter((u) => S.grammar[u.id] && S.grammar[u.id].done).length;
    const rs = Object.values(S.reading);
    const rAvg = rs.length ? pct(rs.reduce((a, r) => a + r.best, 0), rs.reduce((a, r) => a + r.total, 0)) : 0;
    const d = S.listening.dict;
    const learned = C.vocab.filter((v) => S.vocab[v.w] && S.vocab[v.w].box >= 3).length;
    const days = Array.from({ length: 21 }, (_, i) => addDays(today(), i - 20));
    const heat = days.map((k) => {
      const l = S.log[k] || {}; const n = Object.keys(DAILY).filter((x) => (l[x] || 0) >= DAILY[x]).length;
      const op = n === 0 ? (activeDay(k) ? 0.25 : 0.08) : 0.25 + n * 0.15;
      return `<span title="${k}: ${n}/5" style="display:inline-block;width:calc((100% - 40px)/21);aspect-ratio:1;margin-right:2px;border-radius:4px;background:var(--accent);opacity:${op}"></span>`;
    }).join('');
    main.innerHTML = `
      <div class="card hero"><b>Gün ${dayNo()} / 84</b> · ${PHASES[phase()]}<div class="bar" style="margin-top:8px"><span style="width:${Math.min(100, pct(dayNo(), 84))}%"></span></div></div>
      <div class="stat-grid">
        <div class="stat"><div class="n">🔥 ${streak()}</div><div class="l">günlük seri</div></div>
        <div class="stat"><div class="n">${gDone}/${C.grammar.length}</div><div class="l">gramer ünitesi</div></div>
        <div class="stat"><div class="n">%${rAvg}</div><div class="l">reading doğruluk</div></div>
        <div class="stat"><div class="n">%${pct(d.right, d.total)}</div><div class="l">dikte doğruluk (${d.total})</div></div>
        <div class="stat"><div class="n">${S.writing.history.length}</div><div class="l">yazı kaydedildi</div></div>
        <div class="stat"><div class="n">${learned}/${C.vocab.length}</div><div class="l">kelime öğrenildi</div></div>
      </div>
      <div class="card"><b>Son 21 gün</b><div style="margin-top:8px;line-height:0">${heat}</div><small class="muted">Koyu = günün 5 görevinden fazlası tamam</small></div>
      <div class="card"><h3>Ayarlar</h3>
        <label for="exam">Sınav tarihi</label><input type="date" id="exam" value="${esc(S.examDate)}">
        <label for="start">Plan başlangıç tarihi (Gün 1)</label><input type="date" id="start" value="${esc(S.start)}">
        <label for="rate">Konuşma hızı: <span id="rv">${S.settings.rate}</span></label><input type="range" id="rate" min="0.6" max="1.2" step="0.05" value="${S.settings.rate}" style="width:100%">
      </div>
      <div class="card"><h3>Yedek</h3><p class="muted">İlerleme sadece bu telefonda saklanır. Tarayıcı verisini silersen kaybolur, ara sıra yedek al.</p>
        <div class="btns"><button class="btn" id="exp">⬇ Yedeği indir</button><label class="btn" style="margin:0">⬆ Yedek yükle<input type="file" id="imp" accept="application/json" hidden></label></div>
        <button class="btn block" id="reset" style="color:var(--bad)">Tüm ilerlemeyi sıfırla</button></div>
      <p class="muted" style="text-align:center;font-size:.8rem">IELTS Yol Koçu · offline çalışır</p>`;
    $('#exam').onchange = (e) => { S.examDate = e.target.value; save(); toast('Sınav tarihi kaydedildi'); };
    $('#start').onchange = (e) => { if (e.target.value) { S.start = e.target.value; save(); toast('Başlangıç güncellendi'); } };
    $('#rate').oninput = (e) => { S.settings.rate = +e.target.value; $('#rv').textContent = S.settings.rate; save(); };
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
        S = Object.assign(fresh(), data); save(); toast('Yedek yüklendi'); route(true);
      }).catch(() => toast('Geçersiz yedek dosyası'));
    };
    $('#reset').onclick = () => { if (confirm('Tüm ilerleme silinsin mi? Bu geri alınamaz.')) { S = fresh(); save(); route(true); toast('Sıfırlandı'); } };
  }

  // ---------- router ----------
  const ROUTES = [
    [/^#\/today$/, viewToday, 'today'],
    [/^#\/grammar$/, viewGrammarList, 'grammar'],
    [/^#\/grammar\/([\w-]+)$/, viewLesson, 'grammar'],
    [/^#\/grammar\/([\w-]+)\/practice$/, viewGrammarPractice, 'grammar'],
    [/^#\/mistakes$/, viewMistakes, 'grammar'],
    [/^#\/practice$/, viewPractice, 'practice'],
    [/^#\/reading\/([\w-]+)$/, viewReading, 'practice'],
    [/^#\/listening\/dict$/, viewDictation, 'practice'],
    [/^#\/listening\/([\w-]+)$/, viewListening, 'practice'],
    [/^#\/writing$/, viewWritingList, 'practice'],
    [/^#\/writing\/([\w-]+)(?:\/(\w+))?$/, viewWriting, 'practice'],
    [/^#\/vocab$/, viewVocab, 'vocab'],
    [/^#\/progress$/, viewProgress, 'progress']
  ];
  function go(h) { location.hash = h; }
  function route(keepScroll) {
    cleanups.forEach((f) => { try { f(); } catch (e) { /* ignore */ } });
    cleanups = [];
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
  window.addEventListener('pagehide', () => cleanups.forEach((f) => { try { f(); } catch (e) { /* ignore */ } }));
  route();

  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline cache optional */ });
  }
})();
