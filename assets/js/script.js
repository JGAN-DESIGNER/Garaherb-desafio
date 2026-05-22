/* ============================================================
   SCRIPT.JS — Kymezol / Blinzador
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ─────────────────────────────────────────
     INJETAR CSS DE ANIMAÇÕES
  ───────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = `

    /* ── FAQ ── */
    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.4s ease, padding 0.4s ease, opacity 0.4s ease;
      opacity: 0;
      color: #444;
      font-family: sans-serif;
      font-size: 15px;
      line-height: 1.65;
      padding: 0 16px;
    }
    .faq-item-open {
      background: #fffbea !important;
    }
    .faq-item-open .faq-answer {
      max-height: 300px;
      padding: 12px 16px 16px;
      opacity: 1;
    }
    .faq-arrow {
      transition: transform 0.35s ease !important;
      flex-shrink: 0;
    }
    .faq-item-open .faq-arrow {
      transform: rotate(90deg) !important;
    }

    /* ── KIT SELECIONADO ── */
    .kit-1, .kit-2, .kit-4 {
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease, outline 0.2s ease;
    }
    .kit-selected {
      outline: 3px solid #f7c417 !important;
      box-shadow: 0 0 0 8px rgba(247,196,23,0.18), 0 12px 36px rgba(0,0,0,0.35) !important;
      border-radius: 16px !important;
      transform: scale(1.025) !important;
      position: relative;
      z-index: 2;
    }

    /* ── BOTÕES ── */
    .button {
      cursor: pointer;
      transition: transform 0.12s ease, border-bottom-width 0.12s ease;
    }
    .button:active {
      transform: scale(0.97) !important;
      border-bottom-width: 2px !important;
    }

    /* ── COUNTDOWN ── */
    #offer-countdown {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: rgba(0,0,0,0.65);
      border: 2px solid #f7c417;
      border-radius: 12px;
      padding: 10px 28px;
      margin: 20px auto 0;
      width: fit-content;
      font-family: 'Courier New', monospace;
      font-size: 26px;
      font-weight: 700;
      color: #f7c417;
      letter-spacing: 3px;
    }
    #offer-countdown .cd-label {
      font-size: 13px;
      color: #fff;
      letter-spacing: 1px;
      font-family: sans-serif;
    }

    /* ── STICKY BAR ── */
    #sticky-cta {
      position: fixed;
      top: -90px;
      left: 0;
      width: 100%;
      z-index: 99999;
      background: linear-gradient(80deg,#0b0b0b 0%,#1a0d0c 55%,#aa2315 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      padding: 13px 24px;
      box-shadow: 0 6px 28px rgba(0,0,0,0.55);
      transition: top 0.4s cubic-bezier(.4,0,.2,1);
    }
    #sticky-cta.sticky-visible {
      top: 0 !important;
    }
    #sticky-cta span {
      color: #fff;
      font-family: sans-serif;
      font-size: 15px;
    }
    #sticky-cta button {
      background: linear-gradient(180deg,#fffe4a 0%,#ffd901 100%);
      border: none;
      border-bottom: 4px solid #8e7c02;
      border-radius: 50px;
      padding: 10px 32px;
      font-size: 15px;
      font-weight: 700;
      color: #0b0b0b;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      transition: transform 0.1s;
    }
    #sticky-cta button:active {
      transform: scale(0.96);
    }

    /* ── FADE-IN ── */
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    .anim-fadeinup {
      animation: fadeInUp 0.65s ease both;
    }

    /* ── PULSE no botão principal ── */
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 4px 16px rgba(0,0,0,0.4); }
      50%       { box-shadow: 0 4px 32px rgba(247,196,23,0.7), 0 0 0 6px rgba(247,196,23,0.15); }
    }
    .button {
      animation: pulse-glow 2.4s ease-in-out infinite;
    }

    @media (max-width: 768px) {
      #sticky-cta { gap: 10px; padding: 10px 12px; }
      #sticky-cta span { font-size: 12px; }
      #sticky-cta button { padding: 8px 18px; font-size: 13px; }
      #offer-countdown { font-size: 20px; padding: 8px 16px; }
    }
  `;
  document.head.appendChild(style);


  /* ─────────────────────────────────────────
     1. FAQ ACCORDION
  ───────────────────────────────────────── */
  var faqAnswers = {
    'item-1': 'Take 2 capsules daily with a full glass of water, preferably with a meal. For best results, use consistently for at least 30 days.',
    'item-3': 'Not recommended for individuals under 18, pregnant or nursing women. Consult your doctor if you take prescription medications or have any medical conditions.',
    'item-4': 'Yes! Our formula is 100% natural, manufactured in an FDA-registered GMP facility. All ingredients are carefully tested for purity and potency.',
    'item-5': 'Most customers notice improvements within 2–3 weeks of consistent use. Optimal results are typically experienced after 60–90 days.',
    'item-2': 'Blinzador is our flagship natural vitality formula crafted from premium herbal extracts designed to support male energy, stamina and performance.'
  };

  var faqSection = document.querySelector('.faq .frame-167');
  if (faqSection) {
    var faqItems = faqSection.querySelectorAll('.item-1, .item-2, .item-3, .item-4, .item-5');

    faqItems.forEach(function (item) {
      // descobre qual classe é a chave
      var key = '';
      ['item-1','item-2','item-3','item-4','item-5'].forEach(function(c){
        if (item.classList.contains(c)) key = c;
      });

      var arrow = item.querySelector('img');
      if (arrow) arrow.classList.add('faq-arrow');

      var panel = document.createElement('div');
      panel.className = 'faq-answer';
      panel.textContent = faqAnswers[key] || '';
      item.appendChild(panel);
      item.style.cursor = 'pointer';

      item.addEventListener('click', function () {
        var isOpen = item.classList.contains('faq-item-open');
        faqItems.forEach(function (el) { el.classList.remove('faq-item-open'); });
        if (!isOpen) item.classList.add('faq-item-open');
      });
    });
  }


  /* ─────────────────────────────────────────
     2. SELEÇÃO DE KIT
  ───────────────────────────────────────── */
  var kits = document.querySelectorAll('.kit-1, .kit-2, .kit-4');

  kits.forEach(function (kit) {
    kit.addEventListener('click', function () {
      kits.forEach(function (k) { k.classList.remove('kit-selected'); });
      kit.classList.add('kit-selected');
    });
  });

  // Kit do meio selecionado por padrão
  var best = document.querySelector('.kit-2');
  if (best) best.classList.add('kit-selected');


  /* ─────────────────────────────────────────
     3. CONTADOR REGRESSIVO
  ───────────────────────────────────────── */
  var headerPreco = document.querySelector('.header-pre-o');
  if (headerPreco) {
    var storageKey = 'kymezol_end_v2';
    var DURATION   = 24 * 60 * 60 * 1000;
    var endTime    = parseInt(sessionStorage.getItem(storageKey));
    if (!endTime || endTime < Date.now()) {
      endTime = Date.now() + DURATION;
      sessionStorage.setItem(storageKey, String(endTime));
    }

    var cdEl = document.createElement('div');
    cdEl.id = 'offer-countdown';
    cdEl.innerHTML = '<span class="cd-label">⏳ OFFER ENDS IN:</span><span id="cd-time">24:00:00</span>';
    headerPreco.appendChild(cdEl);

    function pad(n) { return String(n).padStart(2,'0'); }
    function tick() {
      var left = Math.max(0, endTime - Date.now());
      var h = Math.floor(left / 3600000);
      var m = Math.floor((left % 3600000) / 60000);
      var s = Math.floor((left % 60000) / 1000);
      var el = document.getElementById('cd-time');
      if (el) el.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
      if (left === 0) clearInterval(timer);
    }
    tick();
    var timer = setInterval(tick, 1000);
  }


  /* ─────────────────────────────────────────
     4. STICKY BAR
  ───────────────────────────────────────── */
  var bar = document.createElement('div');
  bar.id = 'sticky-cta';
  bar.innerHTML = '<span>🔥 Limited Time Offer — Stock Up &amp; Save!</span>' +
                  '<button id="sticky-btn">🛒 ORDER NOW</button>';
  document.body.insertBefore(bar, document.body.firstChild);

  var heroEl = document.querySelector('.hero');
  window.addEventListener('scroll', function () {
    var threshold = heroEl ? heroEl.getBoundingClientRect().bottom + window.scrollY - 200 : 600;
    if (window.scrollY > threshold) {
      bar.classList.add('sticky-visible');
    } else {
      bar.classList.remove('sticky-visible');
    }
  }, { passive: true });

  document.getElementById('sticky-btn').addEventListener('click', goToKits);


  /* ─────────────────────────────────────────
     5. SCROLL SUAVE — botões Order Now
  ───────────────────────────────────────── */
  function goToKits() {
    var dest = document.querySelector('.kits') || document.querySelector('.oferta');
    if (dest) dest.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  document.querySelectorAll('.button').forEach(function (btn) {
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', goToKits);
  });


  /* ─────────────────────────────────────────
     6. FADE-IN POR SCROLL
     Usa scroll + getBoundingClientRect porque
     position:absolute (Figma export) quebra
     IntersectionObserver em alguns casos
  ───────────────────────────────────────── */
  var fadeEls = Array.from(document.querySelectorAll(
    '.kit-1, .kit-2, .kit-4, ' +
    '.faq .item-1, .faq .item-2, .faq .item-3, .faq .item-4, .faq .item-5, ' +
    '.frame-39, .frame-25, .frame-126, .frame-168'
  ));

  // Esconde todos inicialmente (só se não estiverem na viewport já)
  fadeEls.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  function revealOnScroll() {
    var windowH = window.innerHeight;
    fadeEls.forEach(function (el) {
      if (el.dataset.revealed) return;
      var rect = el.getBoundingClientRect();
      if (rect.top < windowH - 60) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.dataset.revealed = '1';
      }
    });
  }

  // Roda imediatamente e no scroll
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll, { passive: true });

}); // fim DOMContentLoaded
