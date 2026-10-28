/* ===== CONFIG: edit at launch ===== */
const CONFIG = { CA: 'TBA', X: '', TG: '' };
/* ================================== */
(function () {
  'use strict';
  const root = document.documentElement;
  const SOL = 'So11111111111111111111111111111111111111112';
  const valid = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(CONFIG.CA);
  const ca = valid ? CONFIG.CA : 'TBA';
  const links = {
    buy: 'https://swap.pump.fun/?input=' + SOL + '&output=' + ca,
    chart: 'https://dexscreener.com/solana/' + ca,
    x: CONFIG.X, tg: CONFIG.TG
  };
  document.querySelectorAll('[data-link]').forEach(a => {
    const k = a.dataset.link, u = links[k];
    if (u) { a.href = u; a.target = '_blank'; a.rel = 'noopener'; a.removeAttribute('aria-disabled'); const s = a.querySelector('small'); if (s) s.remove(); }
    else { a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); a.setAttribute('role', 'link'); a.title = 'Coming soon'; }
  });
  document.querySelectorAll('[data-ca]').forEach(e => e.textContent = ca);
  if (valid) {
    const f = document.createElement('iframe');
    f.src = 'https://dexscreener.com/solana/' + ca + '?embed=1&theme=dark&trades=0&info=0';
    f.title = '$SOLHOUSE chart on DexScreener'; f.loading = 'lazy';
    document.getElementById('chartMount').appendChild(f);
    document.querySelector('.chart').classList.add('live');
  }

  /* toast + copy */
  const toast = document.getElementById('toast'); let tt;
  function say(m) { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 2200); }
  function fallbackCopy(t) { const ta = document.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0'; document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e) {} ta.remove(); return ok; }
  document.querySelectorAll('[data-copy-ca]').forEach(b => b.addEventListener('click', async () => {
    if (!valid) { say('CA drops at launch. Only trust this site.'); return; }
    let ok = false;
    try { await navigator.clipboard.writeText(ca); ok = true; } catch (e) { ok = fallbackCopy(ca); }
    say(ok ? 'Copied: keys to the House' : 'Copy failed, select the CA manually');
    if (ok) { b.classList.add('copied'); const l = b.querySelector('span'); const o = l && l.textContent; if (l) l.textContent = 'Copied'; setTimeout(() => { b.classList.remove('copied'); if (l) l.textContent = o; }, 1600); }
  }));
  document.querySelectorAll('[aria-disabled="true"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); say('Socials open soon'); }));

  /* nav hide on scroll */
  const nav = document.getElementById('nav'); let ly = 0;
  addEventListener('scroll', () => { const y = scrollY; nav.classList.toggle('hide', y > 300 && y > ly + 4); if (y < ly - 4 || y < 300) nav.classList.remove('hide'); ly = y; }, { passive: true });

  /* pause off-screen CSS loops */
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('paused', !e.isIntersecting)));
  document.querySelectorAll('.hero, .ribbon, #address').forEach(el => io.observe(el));

  const rm = root.classList.contains('rm');
  const hasG = !!(window.gsap && window.ScrollTrigger);
  if (!hasG) root.classList.add('rm');
  const motion = !rm && hasG;
  const touch = matchMedia('(pointer:coarse)').matches || innerWidth < 768;

  /* falling stars canvas */
  (function sky() {
    const c = document.getElementById('sky'); if (rm) { c.remove(); return; }
    const x = c.getContext('2d'); let w, h, dpr = Math.min(devicePixelRatio || 1, 2), stars = [], raf, on = true;
    function size() { w = c.width = innerWidth * dpr; h = c.height = innerHeight * dpr; }
    size(); addEventListener('resize', size);
    function spawn() { stars.push({ x: Math.random() * w * 1.2, y: -20, v: (2 + Math.random() * 3) * dpr, l: (40 + Math.random() * 80) * dpr, a: 1 }); }
    function tick() {
      x.clearRect(0, 0, w, h);
      if (Math.random() < (touch ? .008 : .015)) spawn();
      stars = stars.filter(s => s.a > 0 && s.y < h);
      for (const s of stars) {
        s.x -= s.v * .6; s.y += s.v; s.a -= .006;
        const g = x.createLinearGradient(s.x, s.y, s.x + s.l * .6, s.y - s.l);
        g.addColorStop(0, 'rgba(230,255,245,' + s.a * .8 + ')'); g.addColorStop(1, 'rgba(153,69,255,0)');
        x.strokeStyle = g; x.lineWidth = 1.4 * dpr; x.beginPath(); x.moveTo(s.x, s.y); x.lineTo(s.x + s.l * .6, s.y - s.l); x.stroke();
      }
      raf = on ? requestAnimationFrame(tick) : 0;
    }
    tick();
    document.addEventListener('visibilitychange', () => { on = !document.hidden; if (on && !raf) tick(); });
  })();

  /* cursor */
  if (!rm && matchMedia('(pointer:fine)').matches) {
    const cu = document.getElementById('cursor');
    addEventListener('pointermove', e => { cu.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; }, { passive: true });
    document.querySelectorAll('a,button').forEach(el => { el.addEventListener('pointerenter', () => cu.classList.add('hov')); el.addEventListener('pointerleave', () => cu.classList.remove('hov')); });
  }

  if (!motion) { finalState(); return; }

  /* split helpers */
  document.querySelectorAll('.title .split').forEach(s => { s.innerHTML = [...s.textContent].map(c => '<span class="ch">' + c + '</span>').join(''); });
  document.querySelectorAll('.words').forEach(h => {
    const walk = n => [...n.childNodes].forEach(ch => {
      if (ch.nodeType === 3) { const f = document.createDocumentFragment(); ch.textContent.split(/(\s+)/).forEach(p => { if (!p) return; if (/^\s+$/.test(p)) f.appendChild(document.createTextNode(p)); else { const s = document.createElement('span'); s.className = 'w'; s.textContent = p; f.appendChild(s); } }); n.replaceChild(f, ch); }
      else if (ch.nodeType === 1 && !ch.classList.contains('grad')) walk(ch);
      else if (ch.nodeType === 1) ch.classList.add('w');
    });
    walk(h);
  });

  gsap.registerPlugin(ScrollTrigger);
  let lenis = null;
  if (!touch && window.Lenis) {
    lenis = new Lenis({ lerp: .1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const t = document.querySelector(a.getAttribute('href')); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -10 }); } }));
  }
  const damp = touch ? .45 : 1;

  /* preloader */
  const pl = document.getElementById('preloader'), num = document.getElementById('plNum');
  gsap.set('.title .ch', { yPercent: 110, opacity: 0, rotateX: -60 });
  gsap.set('.kicker, .sub, .hero-cta, .ca-mini', { opacity: 0, y: 20 });
  const ptl = gsap.timeline({ onComplete: intro });
  const cnt = { v: 0 };
  ptl.to(cnt, { v: 100, duration: 1.7, ease: 'power1.inOut', onUpdate: () => num.textContent = String(Math.round(cnt.v)).padStart(3, '0') }, 0);
  // the <use> clone isn't addressable, so animate the whole logo pieces via wrapper transforms
  const plLogo = document.querySelector('.pl-logo');
  plLogo.innerHTML = document.getElementById('logo-svg').innerHTML;
  ptl.from(plLogo.querySelectorAll('.lg-bar'), { x: -260, opacity: 0, stagger: .18, duration: .6, ease: 'power3.out' }, 0)
     .from(plLogo.querySelector('.lg-roof'), { y: -260, opacity: 0, duration: .55, ease: 'bounce.out' }, .75)
     .add(() => plLogo.classList.add('lit'), 1.4)
     .to(pl, { clipPath: 'circle(0% at 50% 50%)', duration: .8, ease: 'power3.inOut' }, 2.0)
     .set(pl, { display: 'none' });
  gsap.set(pl, { clipPath: 'circle(150% at 50% 50%)' });
  function intro() {
    gsap.timeline()
      .to('.title .ch', { yPercent: 0, opacity: 1, rotateX: 0, stagger: .05, duration: .8, ease: 'back.out(1.6)' })
      .to('.kicker, .sub, .hero-cta, .ca-mini', { opacity: 1, y: 0, stagger: .08, duration: .6 }, '-=.5');
  }

  /* hero parallax (pinned on desktop) */
  const htl = gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: touch ? 'bottom top' : '+=90%', scrub: true, pin: !touch } });
  htl.to('.l-sky', { yPercent: 10 * damp, ease: 'none' }, 0)
     .to('.l-house', { yPercent: 8 * damp, scale: 1 + .08 * damp, ease: 'none' }, 0)
     .to('.l-fg', { yPercent: -10 * damp, scale: 1 + .12 * damp, ease: 'none' }, 0)
     .fromTo('.ghost-word', { xPercent: 0 }, { xPercent: -40 * damp, ease: 'none' }, 0)
     .to('.hero-copy', { yPercent: -25 * damp, opacity: 0, ease: 'none' }, 0);

  /* word reveals */
  document.querySelectorAll('.words').forEach(h => gsap.from(h.querySelectorAll('.w'), { yPercent: 100, opacity: 0, stagger: .05, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 85%' } }));
  document.querySelectorAll('.reveal').forEach(el => gsap.to(el, { opacity: 1, y: 0, duration: .8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' } }));

  /* signature: Moving In */
  const wins = [...document.querySelectorAll('.mv-wins .w')], steps = [...document.querySelectorAll('.mv-steps li')];
  const occ = document.getElementById('occ'), occBar = document.getElementById('occBar');
  gsap.set(occBar, { scaleX: 0 }); gsap.set('.mv-welcome', { opacity: 0, y: 20 });
  gsap.set('.mv-wins', { opacity: 0 });
  const o = { p: 0 };
  const mtl = gsap.timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: '#moving', start: 'top top', end: touch ? '+=160%' : '+=260%', scrub: .6, pin: '.mv-stage',
    onUpdate: s => { const p = s.progress; steps.forEach((li, i) => li.classList.toggle('on', p > (i + .5) / 7.2)); } } });
  gsap.set('.mv-door',{opacity:0});
  mtl.from('.f3', { x: -500, opacity: 0, duration: 1 })
     .from('.f2', { x: 500, opacity: 0, duration: 1 })
     .from('.f1', { x: -500, opacity: 0, duration: 1 })
     .to('.mv-door', { opacity: 1, duration: .3 })
     .from('.mv-roof', { y: -420, opacity: 0, duration: 1, ease: 'bounce.out' })
     .set('.mv-wins', { opacity: 1 })
     .to({}, { duration: 1.6, onUpdate: function () { const n = Math.round(this.progress() * wins.length); wins.forEach((w, i) => w.classList.toggle('on', i < n)); document.querySelector('.mv-door').classList.toggle('on', this.progress() > .5); } })
     .from('.mv-polebar', { scaleY: 0, transformOrigin: '50% 100%', duration: .5 }, '<')
     .fromTo('.mv-flag', { y: 160, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
     .to(o, { p: 100, duration: 6.1, ease: 'none', onUpdate: () => { occ.textContent = Math.round(o.p) + '%'; gsap.set(occBar, { scaleX: o.p / 100 }); } }, 0)
     .to('.mv-welcome', { opacity: 1, y: 0, duration: .6 })
     .to({}, { duration: .4 });

  /* executive orders stamp */
  gsap.utils.toArray('.order').forEach((c, i) => {
    const t = gsap.timeline({ scrollTrigger: { trigger: c, start: 'top 85%' } });
    t.from(c, { y: 60, rotate: i % 2 ? 3 : -3, opacity: 0, duration: .7, delay: i * .08, ease: 'power3.out' })
     .from(c.querySelector('.stamp'), { scale: 3.2, opacity: 0, rotate: -30, duration: .35, ease: 'power4.in' })
     .to(c, { y: 5, duration: .06, yoyo: true, repeat: 1 });
  });
  gsap.from('.pills li', { scale: .6, opacity: 0, stagger: .06, duration: .5, ease: 'back.out(2)', scrollTrigger: { trigger: '.pills', start: 'top 90%' } });

  /* horizontal tour on desktop */
  ScrollTrigger.matchMedia({
    '(min-width:1024px)': function () {
      const tr = document.querySelector('.tour-track');
      const dist = () => tr.scrollWidth - innerWidth + 40;
      gsap.to(tr, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.tour-pin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: .5, invalidateOnRefresh: true } });
    }
  });
  gsap.fromTo('.closer-img', { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.closer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  addEventListener('load', () => ScrollTrigger.refresh());

  function finalState() {
    document.querySelectorAll('.mv-wins .w, .mv-door').forEach(w => w.classList.add('on'));
    document.querySelectorAll('.mv-steps li').forEach(l => l.classList.add('on'));
    const occ = document.getElementById('occ'); if (occ) occ.textContent = '100%';
  }
})();
