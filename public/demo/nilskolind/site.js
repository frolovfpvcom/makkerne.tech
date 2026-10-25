(() => {
  const doc = document.documentElement;
  doc.classList.add('js');
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wide = matchMedia('(min-width: 901px)');
  const TEL = '+4520909003';

  // Store navne fylder præcis bredden (navnet på forsiden, mailen i bunden)
  const fit = () => document.querySelectorAll('[data-fit]').forEach((el) => {
    el.style.fontSize = '';
    const ps = getComputedStyle(el.parentElement);
    const avail = el.parentElement.clientWidth - parseFloat(ps.paddingLeft) - parseFloat(ps.paddingRight);
    const rg = document.createRange(); rg.selectNodeContents(el);
    const w = rg.getBoundingClientRect().width;
    if (w > 0) el.style.fontSize = `${parseFloat(getComputedStyle(el).fontSize) * (avail / w) * 0.99}px`;
  });
  fit();
  document.fonts && document.fonts.ready.then(fit);
  addEventListener('resize', fit);

  // Topbjælke: på telefon gemmer den sig på vej ned og kommer frem på vej op
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

  // Indgange: overskrift, tekst og billede efter hinanden
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

  // Langsom krydsfade mellem tre af deres egne projektfotos i toppen
  const fade = document.querySelector('[data-fade]');
  if (fade && !calm) {
    const pics = [...fade.querySelectorAll('picture')];
    let i = 0, t;
    const next = () => { pics[i].classList.remove('is-on'); i = (i + 1) % pics.length; pics[i].classList.add('is-on'); };
    const start = () => { clearInterval(t); t = setInterval(next, 5600); };
    document.addEventListener('visibilitychange', () => (document.hidden ? clearInterval(t) : start()));
    start();
  }

  // Udført arbejde: billedet i rammen følger det navn, der krydser midten
  const index = document.querySelector('[data-index]');
  const idxPics = index ? [...index.querySelectorAll('.index-frame picture')] : [];
  const idxLinks = index ? [...index.querySelectorAll('.index-list a')] : [];
  let cur = 0;
  const setCur = (n) => {
    if (n === cur) return;
    idxPics[cur]?.classList.remove('is-on'); idxLinks[cur]?.classList.remove('is-cur');
    cur = n;
    idxPics[cur]?.classList.add('is-on'); idxLinks[cur]?.classList.add('is-cur');
  };
  idxLinks.forEach((a, n) => a.addEventListener('mouseenter', () => setCur(n)));

  const drifts = [...document.querySelectorAll('[data-drift] img')];
  const callbar = document.querySelector('[data-callbar]');
  const top = document.querySelector('.hero, .phero, .plain-head');
  const hideAt = [...document.querySelectorAll('#tilbud, .mailsec, .foot')];

  let ticking = false;
  const frame = () => {
    ticking = false;
    onBar();
    const vh = innerHeight;
    if (idxLinks.length) {
      let best = 0, bd = Infinity;
      idxLinks.forEach((a, n) => { const r = a.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - vh / 2); if (d < bd) { bd = d; best = n; } });
      setCur(best);
    }
    if (!calm) for (const img of drifts) {
      const r = img.parentElement.getBoundingClientRect();
      const p = Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1);
      img.style.transform = `scale(${1.08 - p * 0.08})`;
    }
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

  // Tilbudsbyggeren: samler beskeden og viser den, før den sendes
  document.querySelectorAll('[data-quote]').forEach((form) => {
    const prev = form.querySelector('[data-preview]');
    const subj = form.querySelector('[data-subject]');
    const bodyEl = form.querySelector('[data-body]');
    const sms = form.closest('section').querySelector('[data-sms]');
    const build = () => {
      const fd = new FormData(form);
      const tasks = fd.getAll('opgave');
      const v = (k) => (fd.get(k) || '').toString().trim();
      const subject = `Tilbud: ${tasks.length ? tasks.join(', ') : 'Tømreropgave'}${v('adresse') ? ` – ${v('adresse')}` : ''}`;
      const lines = [
        tasks.length ? `Opgave: ${tasks.join(', ')}` : '',
        v('besked') ? `\n${v('besked')}\n` : '',
        v('navn') ? `Navn: ${v('navn')}` : '',
        v('telefon') ? `Telefon: ${v('telefon')}` : '',
        v('email') ? `E-mail: ${v('email')}` : '',
        v('adresse') ? `Adresse: ${v('adresse')}` : '',
      ].filter(Boolean);
      return { subject, body: lines.join('\n'), tasks, place: v('adresse'), any: lines.length > 0 };
    };
    const update = () => {
      const m = build();
      prev.hidden = !m.any;
      subj.textContent = m.subject;
      bodyEl.textContent = m.body;
      if (sms) sms.href = `sms:${TEL}?&body=${encodeURIComponent(`Hej Nils. Her er billeder af ${m.tasks.length ? m.tasks.join(', ').toLowerCase() : 'min opgave'}${m.place ? ` (${m.place})` : ''}.`)}`;
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', (e) => {
      if (!form.reportValidity()) return;
      e.preventDefault();
      const m = build();
      location.href = `mailto:info@nilskolind.dk?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}`;
    });
    update();
  });

  // Lejeberegner for minilæsseren: 1.000 kr. pr. dag (vejledende)
  const calc = document.querySelector('[data-calc]');
  if (calc) {
    const input = calc.querySelector('input');
    const sum = calc.querySelector('[data-sum]');
    const book = calc.querySelector('[data-book]');
    const upd = () => {
      const d = Math.min(Math.max(parseInt(input.value, 10) || 1, 1), 60);
      input.value = d;
      sum.textContent = `${(d * 1000).toLocaleString('da-DK')} kr.`;
      book.href = `sms:${TEL}?&body=${encodeURIComponent(`Hej Nils. Jeg vil gerne leje minilæsseren i ${d} ${d === 1 ? 'dag' : 'dage'}. Fra dato: `)}`;
    };
    calc.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => { input.value = (parseInt(input.value, 10) || 1) + +b.dataset.step; upd(); }));
    input.addEventListener('input', upd);
    input.addEventListener('change', upd);
    upd();
  }

  // Referencer: vis billedet stort
  const box = document.querySelector('[data-zoombox]');
  if (box && box.showModal) {
    const big = box.querySelector('img');
    document.querySelectorAll('[data-zoom]').forEach((b) => b.addEventListener('click', () => {
      const img = b.querySelector('img');
      big.src = img.currentSrc || img.src; big.alt = img.alt;
      box.showModal();
    }));
    box.addEventListener('click', (e) => { if (e.target === box || e.target.closest('[data-close]')) box.close(); });
  }
})();
