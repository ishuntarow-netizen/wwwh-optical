/* =========================================================
   A. スクロール演出   B. ナビ   C. 日英切替
   D. テキスト編集モード
   ========================================================= */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- A. スクロール演出 ---------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- B. ヘッダー / ナビ -------------------------------- */
  var bar = document.getElementById('bar');
  var onScroll = function () { bar.classList.toggle('is-stuck', window.scrollY > 24); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.bar__nav a'));
  var targets = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a, i) { a.classList.toggle('is-active', targets[i] === e.target); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (t) { if (t) spy.observe(t); });
  }

  var toggle = document.getElementById('menuToggle');
  var sheet = document.getElementById('sheet');
  function closeSheet() {
    sheet.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.textContent = 'MENU';
    document.body.style.overflow = '';
  }
  toggle.addEventListener('click', function () {
    var open = sheet.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? 'CLOSE' : 'MENU';
    document.body.style.overflow = open ? 'hidden' : '';
  });
  sheet.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeSheet();
  });

  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());

  /* =========================================================
     C. 日英切替
     各要素の日本語は初回に dataset.jp へ退避し、
     英語は data-en 属性の文言を使う。
     ========================================================= */
  var htmlEl = document.documentElement;
  var TITLES = {
    ja: 'WWWH Optical｜形だけで、ブランドだと分かる。',
    en: 'WWWH Optical — Recognised by shape alone.'
  };
  var current = 'ja';

  function collect() {
    return Array.prototype.slice.call(document.querySelectorAll('[data-en]'));
  }

  function setLang(lang, force) {
    if (lang !== 'en') lang = 'ja';
    if (lang === current && !force) return;
    current = lang;
    htmlEl.setAttribute('lang', lang);
    document.title = TITLES[lang];

    collect().forEach(function (el) {
      if (el.dataset.jp == null) el.dataset.jp = el.innerHTML;
      el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.jp;
    });

    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-lang') === lang);
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    try { localStorage.setItem('wwwh-lang', lang); } catch (err) {}
  }

  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (document.body.classList.contains('is-editing')) {
        alert('編集モード中は日本語で表示します。「編集を終了」してから切り替えてください。');
        return;
      }
      setLang(b.getAttribute('data-lang'));
    });
  });

  var savedLang = 'ja';
  try { savedLang = localStorage.getItem('wwwh-lang') || 'ja'; } catch (err) {}
  if (savedLang === 'en') setLang('en', true);

  /* =========================================================
     D. テキスト編集モード（?edit=1）
     ========================================================= */
  var KEY = 'wwwh-edit-v2';
  var editing = /(?:^|[?&])edit=1(?:&|$)/.test(location.search);
  if (!editing) return;

  setLang('ja');
  var fields = Array.prototype.slice.call(document.querySelectorAll('[data-edit]'));
  var editor = document.getElementById('editor');
  var hint = document.getElementById('edHint');
  var dirty = false;

  document.body.classList.add('is-editing');
  document.body.style.paddingBottom = '96px';
  if (editor) editor.classList.add('is-open');

  var stored = null;
  try { stored = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (err) { stored = null; }
  if (stored) {
    fields.forEach(function (el) {
      var k = el.getAttribute('data-edit');
      if (stored[k] != null) el.innerHTML = stored[k];
    });
    fields.forEach(function (el) { el.dataset.jp = el.innerHTML; });
  }

  fields.forEach(function (el) {
    el.setAttribute('contenteditable', 'plaintext-only');
    el.setAttribute('spellcheck', 'false');
    el.addEventListener('input', function () {
      dirty = true;
      el.dataset.jp = el.innerHTML;
      if (hint) hint.classList.add('is-open');
      clearTimeout(el._t);
      el._t = setTimeout(saveLocal, 400);
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); el.blur(); }
    });
  });

  function collectAll() {
    var out = {};
    fields.forEach(function (el) { out[el.getAttribute('data-edit')] = el.innerHTML; });
    return out;
  }
  function saveLocal() {
    try { localStorage.setItem(KEY, JSON.stringify(collectAll())); } catch (err) {}
  }

  function exportHTML() {
    var clone = htmlEl.cloneNode(true);
    clone.setAttribute('lang', 'ja');
    clone.querySelectorAll('[contenteditable]').forEach(function (el) {
      el.removeAttribute('contenteditable');
      el.removeAttribute('spellcheck');
    });
    var ed = clone.querySelector('#editor');
    if (ed) ed.classList.remove('is-open');
    var h = clone.querySelector('#edHint');
    if (h) h.classList.remove('is-open');
    var b = clone.querySelector('body');
    if (b) { b.classList.remove('is-editing'); b.style.paddingBottom = ''; }
    var blob = new Blob(['<!DOCTYPE html>\n' + clone.outerHTML], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    dirty = false;
    if (hint) hint.classList.remove('is-open');
  }

  document.getElementById('edSave').addEventListener('click', exportHTML);
  document.getElementById('edReset').addEventListener('click', function () {
    if (!confirm('このブラウザに保存された編集内容を破棄して、元の文章に戻します。よろしいですか？')) return;
    localStorage.removeItem(KEY);
    location.reload();
  });
  document.getElementById('edExit').addEventListener('click', function () {
    if (dirty && !confirm('まだ書き出していない編集があります。書き出さずに終了しますか？')) return;
    location.href = location.pathname;
  });

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); exportHTML(); }
  });
  window.addEventListener('beforeunload', function (e) {
    if (dirty) { e.preventDefault(); e.returnValue = ''; }
  });
})();
