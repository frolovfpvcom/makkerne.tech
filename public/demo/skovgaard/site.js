(() => {
  const doc = document.documentElement;
  doc.classList.add('js');
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wide = matchMedia('(min-width: 901px)');
  const TEL = '+4521520122';
  const MAIL = 'skovgaardtagdaekning@gmail.com';

  // De to linjer i navnet fylder samme bredde
  const fit = () => {
    const els = [...document.querySelectorAll('[data-fit]')];
    if (!els.length) return;
    els.forEach((el) => { el.style.fontSize = ''; });
    const box = els[0].closest('.hero-head');
    const ps = getComputedStyle(box);
    // på brede skærme begrænses navnet af højden, så tilbudsbanen er med på første skærm
    const avail = Math.min(box.clientWidth - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight), 1500, Math.max(innerHeight * 0.8, 320));
    els.forEach((el) => {
      const rg = document.createRange(); rg.selectNodeContents(el);
      const w = rg.getBoundingClientRect().width;
      if (w > 0) el.style.fontSize = `${parseFloat(getComputedStyle(el).fontSize) * (avail / w) * 0.99}px`;
    });
  };
  fit();
  document.fonts && document.fonts.ready.then(fit);
  addEventListener('resize', fit);

  // Topbjælke på telefon: væk på vej ned, frem på vej op
  const bar = document.querySelector('[data-bar]');
  let lastY = scrollY;
  const onBar = () => {
    if (!bar) return;
    const y = scrollY;
    if (!wide.matches && !document.body.classList.contains('menu-open')) {
      if (y > lastY + 6 && y > 300) bar.classList.add('is-up');
      else if (y < lastY - 6 || y < 300) bar.classList.remove('is-up');
    } else bar.classList.remove('is-up');
    lastY = y;
  };

  // Menu
  const burger = document.querySelector('[data-burger]');
  const menu = document.querySelector('[data-menu]');
  if (burger && menu) {
    const set = (open) => { burger.setAttribute('aria-expanded', open); menu.hidden = !open; document.body.classList.toggle('menu-open', open); };
    burger.addEventListener('click', () => set(menu.hidden));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { set(false); burger.focus(); } });
  }

  // Indgange
  const rises = [...document.querySelectorAll('.rise')];
  rises.forEach((el) => {
    const sec = el.closest('section') || document.body;
    el.style.setProperty('--d', `${Math.min([...sec.querySelectorAll('.rise')].indexOf(el), 4) * 60}ms`);
  });
  if (calm) rises.forEach((el) => el.classList.add('is-in'));
  let left = rises.length;
  const reveal = () => {
    if (!left) return;
    const vh = innerHeight;
    for (const el of rises) if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < vh * 0.94) { el.classList.add('is-in'); left--; }
  };

  // Wow: tre tagpapbaner rulles ud nedefra og op, mens man scroller
  const lay = document.querySelector('[data-lay]');
  const strips = lay ? [...lay.querySelectorAll('[data-strip]')].sort((a, b) => a.style.getPropertyValue('--k') - b.style.getPropertyValue('--k')) : [];
  const layEnd = lay && lay.querySelector('[data-lay-end]');
  const doLay = () => {
    if (!lay || calm) return;
    const span = lay.offsetHeight - innerHeight;
    const raw = Math.min(Math.max(-lay.getBoundingClientRect().top / span, 0), 1);
    strips.forEach((s, k) => {
      const p = Math.min(Math.max((raw - 0.04 - k * 0.27) / 0.25, 0), 1);
      const sheet = s.firstElementChild, roll = s.lastElementChild;
      sheet.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`;
      const w = s.clientWidth - roll.offsetWidth;
      roll.style.transform = `translateX(${p * w}px)`;
      roll.style.opacity = p > 0 && p < 1 ? 1 : 0;
    });
    layEnd.classList.toggle('is-on', raw > 0.86);
  };

  // Filmstrimlen: tæller og pile
  const track = document.querySelector('[data-reel] .reel-track');
  const reelN = document.querySelector('[data-reel-n]');
  if (track) {
    const cards = [...track.children];
    const cur = () => { const x = track.scrollLeft; let best = 0; cards.forEach((c, i) => { if (Math.abs(c.offsetLeft - track.offsetLeft - x) < Math.abs(cards[best].offsetLeft - track.offsetLeft - x)) best = i; }); return best; };
    const go = (d) => { const i = Math.min(Math.max(cur() + d, 0), cards.length - 1); track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), behavior: calm ? 'auto' : 'smooth' }); };
    document.querySelector('[data-reel-prev]')?.addEventListener('click', () => go(-1));
    document.querySelector('[data-reel-next]')?.addEventListener('click', () => go(1));
    track.addEventListener('scroll', () => { if (reelN) reelN.textContent = Math.min(cur() + 1, cards.length); }, { passive: true });
  }

  // Fotos zoomer stille ud, mens de scroller ind
  const drifts = [...document.querySelectorAll('[data-drift] img')];
  const drift = () => {
    if (calm) return;
    const vh = innerHeight;
    for (const img of drifts) {
      const r = img.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const p = Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1);
      img.style.transform = `scale(${1.07 - p * 0.07})`;
    }
  };

  // Opkaldsbjælken på telefon
  const callbar = document.querySelector('[data-callbar]');
  const top = document.querySelector('.hero, .phead');
  const hideAt = [...document.querySelectorAll('.lay, #tilbud, .foot')];

  let ticking = false;
  const frame = () => {
    ticking = false;
    onBar(); doLay(); drift();
    const vh = innerHeight;
    if (callbar && top) {
      const past = top.getBoundingClientRect().bottom < vh * 0.4;
      const over = hideAt.some((el) => { const r = el.getBoundingClientRect(); return r.top < vh * 0.85 && r.bottom > vh * 0.15; });
      callbar.classList.toggle('is-on', past && !over);
    }
  };
  const req = () => { reveal(); if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  reveal(); frame();

  // Tilbud: tagtype, mål (m² vises live på skalaen 1–10.000) og kontakt
  document.querySelectorAll('[data-quote]').forEach((form) => {
    const prev = form.querySelector('[data-preview]');
    const subj = form.querySelector('[data-subject]');
    const bodyEl = form.querySelector('[data-body]');
    const area = form.querySelector('[data-area]');
    const m2El = form.querySelector('[data-m2]');
    const fill = form.querySelector('[data-scale]');
    const sTxt = form.querySelector('[data-scale-txt]');
    const sms = form.closest('section').querySelector('[data-sms]');
    const num = (v) => parseFloat(String(v || '').replace(',', '.')) || 0;
    const build = () => {
      const fd = new FormData(form);
      const v = (k) => (fd.get(k) || '').toString().trim();
      const tasks = fd.getAll('opgave');
      const L = num(v('laengde')), B = num(v('bredde'));
      const m2 = Math.round(L * B * 10) / 10;
      const m2txt = m2 ? `${m2.toLocaleString('da-DK')} m²` : '';
      const subject = `Tilbud: ${tasks.length ? tasks.join(', ') : 'Tagopgave'}${m2txt ? `, ${m2txt}` : ''}${v('adresse') ? ` – ${v('adresse')}` : ''}`;
      const lines = [
        tasks.length ? `Opgave: ${tasks.join(', ')}` : '',
        m2 ? `Mål: ${L.toLocaleString('da-DK')} × ${B.toLocaleString('da-DK')} m = ${m2txt}` : '',
        v('besked') ? `\n${v('besked')}\n` : '',
        v('navn') ? `Navn: ${v('navn')}` : '',
        v('telefon') ? `Telefon: ${v('telefon')}` : '',
        v('adresse') ? `Adresse: ${v('adresse')}` : '',
      ].filter(Boolean);
      return { subject, body: lines.join('\n'), tasks, m2, m2txt, place: v('adresse'), any: lines.length > 0 };
    };
    const update = () => {
      const m = build();
      prev.hidden = !m.any;
      subj.textContent = m.subject;
      bodyEl.textContent = m.body;
      if (area) {
        area.hidden = !m.m2;
        if (m.m2) {
          m2El.textContent = m.m2.toLocaleString('da-DK');
          const pct = Math.min(Math.max(Math.log10(Math.max(m.m2, 1)) / 4, 0), 1) * 100;
          fill.style.width = `${Math.max(pct, 2)}%`;
          sTxt.textContent = m.m2 > 10000 ? 'Større end vores største, ring og hør' : m.m2 >= 1000 ? 'Erhverv og landbrug' : m.m2 >= 100 ? 'Hus, hal eller stald' : 'Garage, carport eller skur';
        }
      }
      if (sms) sms.href = `sms:${TEL}?&body=${encodeURIComponent(`Hej Skovgaard Tagdækning. Her er billeder af ${m.tasks.length ? m.tasks.join(', ').toLowerCase() : 'mit tag'}${m.m2txt ? `, ca. ${m.m2txt}` : ''}${m.place ? ` (${m.place})` : ''}.`)}`;
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', (e) => {
      if (!form.reportValidity()) return;
      e.preventDefault();
      const m = build();
      location.href = `mailto:${MAIL}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}`;
    });
    update();
  });

  // Udført arbejde: vis billedet stort
  const box = document.querySelector('[data-zoombox]');
  if (box && box.showModal) {
    const big = box.querySelector('img');
    document.querySelectorAll('[data-zoom]').forEach((b) => b.addEventListener('click', () => {
      const img = b.querySelector('img'); big.src = img.currentSrc || img.src; big.alt = img.alt; box.showModal();
    }));
    box.addEventListener('click', (e) => { if (e.target === box || e.target.closest('[data-close]')) box.close(); });
  }
})();
