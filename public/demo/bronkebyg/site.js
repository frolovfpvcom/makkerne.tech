(() => {
  const doc = document.documentElement;
  doc.classList.add('js');
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wide = matchMedia('(min-width: 901px)');

  // Topbjælken bliver lys, når man har scrollet forbi toppen af billedet
  const bar = document.querySelector('[data-bar]');
  // På telefon gemmer den sig, når man scroller ned (opkaldsbjælken i bunden tager over), og kommer frem igen på vej op
  let lastY = scrollY;
  const onScrollBar = () => {
    if (!bar) return;
    const y = scrollY;
    bar.classList.toggle('is-solid', y > 40);
    if (!wide.matches && !document.body.classList.contains('menu-open')) {
      if (y > lastY + 6 && y > 300) bar.classList.add('is-up');
      else if (y < lastY - 6 || y < 300) bar.classList.remove('is-up');
    } else bar.classList.remove('is-up');
    lastY = y;
  };

  // Menu på telefon og mindre skærme
  const burger = document.querySelector('[data-burger]');
  const menu = document.querySelector('[data-menu]');
  if (burger && menu) {
    const set = (open) => {
      burger.setAttribute('aria-expanded', open);
      menu.hidden = !open;
      document.body.classList.toggle('menu-open', open);
    };
    burger.addEventListener('click', () => set(menu.hidden));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { set(false); burger.focus(); } });
  }

  // Indgange: overskrift, tekst og billede kommer ind efter hinanden
  const rises = [...document.querySelectorAll('.rise')];
  rises.forEach((el) => {
    const sec = el.closest('section') || document.body;
    const siblings = [...sec.querySelectorAll('.rise')];
    el.style.setProperty('--d', `${Math.min(siblings.indexOf(el), 4) * 60}ms`);
  });
  if ('IntersectionObserver' in window && !calm) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rises.forEach((el) => io.observe(el));
  } else rises.forEach((el) => el.classList.add('is-in'));

  // Langsom krydsfade mellem tre af deres egne fotos i toppen
  const fade = document.querySelector('[data-fade]');
  if (fade && !calm) {
    const pics = [...fade.querySelectorAll('picture')];
    let i = 0, t;
    const next = () => {
      pics[i].classList.remove('is-on');
      i = (i + 1) % pics.length;
      pics[i].classList.add('is-on');
    };
    const start = () => { clearInterval(t); t = setInterval(next, 5600); };
    document.addEventListener('visibilitychange', () => (document.hidden ? clearInterval(t) : start()));
    start();
  }

  // Panoramaet zoomer stille ud, mens det scroller ind
  const panos = [...document.querySelectorAll('[data-pano] img')];
  // Ydelseskortene glider forbi over det fastholdte foto (kun på bred skærm)
  const show = document.querySelector('[data-show]');
  const track = document.querySelector('[data-track]');
  const showH = document.querySelector('[data-show-h]');

  // Opkaldsbjælken på telefon: vises efter toppen, skjules ved formularen og kontaktkortet
  const callbar = document.querySelector('[data-callbar]');
  const hero = document.querySelector('.hero, .phero, .plain-head');
  const hideAt = [...document.querySelectorAll('#tilbud, .visit, .foot')];

  let ticking = false;
  const frame = () => {
    ticking = false;
    onScrollBar();
    const vh = innerHeight;
    if (!calm) for (const pano of panos) {
      const r = pano.parentElement.getBoundingClientRect();
      const p = Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1);
      pano.style.transform = `scale(${1.08 - p * 0.08})`;
    }
    if (show && track && wide.matches) {
      const r = show.getBoundingClientRect();
      const span = show.offsetHeight - vh;
      const p = Math.min(Math.max(-r.top / span, 0), 1);
      const margin = Math.min(Math.max(16, innerWidth * 0.04), 56);
      const dist = track.scrollWidth - innerWidth + margin;
      track.style.transform = `translate3d(${-p * Math.max(dist, 0)}px, -42%, 0)`;
      if (showH) showH.style.opacity = p > 0.12 ? 0 : 1;
    }
    if (callbar && hero) {
      const past = hero.getBoundingClientRect().bottom < vh * 0.4;
      const over = hideAt.some((el) => { const r = el.getBoundingClientRect(); return r.top < vh * 0.85 && r.bottom > vh * 0.15; });
      callbar.classList.toggle('is-on', past && !over);
    }
  };
  // Sikkerhedsnet uden rAF: alt over skærmens bund vises, også ved hop i siden
  let left = rises.length;
  const reveal = () => {
    if (!left) return;
    const vh = innerHeight;
    for (const el of rises) if (!el.classList.contains('is-in') && el.getBoundingClientRect().top < vh) { el.classList.add('is-in'); left--; }
  };
  const req = () => { reveal(); if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  frame();

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
      const place = [v('postnr'), v('by')].filter(Boolean).join(' ');
      const subject = `Tilbud: ${tasks.length ? tasks.join(', ') : 'Mureropgave'}${place ? ` – ${place}` : ''}`;
      const lines = [
        tasks.length ? `Opgave: ${tasks.join(', ')}` : '',
        v('besked') ? `\n${v('besked')}\n` : '',
        v('navn') ? `Navn: ${v('navn')}` : '',
        v('telefon') ? `Telefon: ${v('telefon')}` : '',
        v('email') ? `E-mail: ${v('email')}` : '',
        v('adresse') || place ? `Adresse: ${[v('adresse'), place].filter(Boolean).join(', ')}` : '',
      ].filter(Boolean);
      return { subject, body: lines.join('\n'), tasks, place, any: lines.length > 0 };
    };
    const update = () => {
      const m = build();
      prev.hidden = !m.any;
      subj.textContent = m.subject;
      bodyEl.textContent = m.body;
      if (sms) {
        const txt = `Hej Bronke Byg. Her er billeder af ${m.tasks.length ? m.tasks.join(', ').toLowerCase() : 'min opgave'}${m.place ? ` i ${m.place}` : ''}.`;
        sms.href = `sms:+4525254648?&body=${encodeURIComponent(txt)}`;
      }
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', (e) => {
      if (!form.reportValidity()) return;
      e.preventDefault();
      const m = build();
      location.href = `mailto:bronkebyg@gmail.com?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}`;
    });
    update();
  });
})();
