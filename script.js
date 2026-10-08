/* Ferdousi Mahmud Moon — Portfolio interactions (vanilla JS) */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Footer year (generated dynamically) */
  function setYear() { const y = $('#year'); if (y) y.textContent = new Date().getFullYear(); }

  /* Navbar background on scroll + back-to-top visibility */
  function initScrollUI() {
    const nav = $('#nav'), top = $('#toTop');
    const update = () => {
      nav.classList.toggle('scrolled', window.scrollY > 24);
      top.hidden = window.scrollY < 600;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  }

  /* Mobile menu: toggle, close on link click, close on Escape */
  function initMenu() {
    const btn = $('#navToggle'), menu = $('#navMenu');
    const set = (open) => {
      btn.classList.toggle('open', open);
      menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    btn.addEventListener('click', () => set(!menu.classList.contains('open')));
    $$('a', menu).forEach(a => a.addEventListener('click', () => set(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 860) set(false); });
  }

  /* Active section indicator */
  function initActiveNav() {
    const links = $$('.nav__menu li a');
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const sections = Array.from(map.keys()).map(id => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const a = map.get(en.target.id); if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => io.observe(s));
  }

  /* Scroll reveal + education timeline line */
  function initReveal() {
    const items = $$('.reveal'), tl = $('.timeline');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach(i => i.classList.add('in')); if (tl) tl.classList.add('in'); return;
    }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(i => io.observe(i));
    if (tl) io.observe(tl);
  }

  /* Soft cursor spotlight (desktop, fine pointers only) */
  function initSpotlight() {
    const s = $('.spotlight');
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    window.addEventListener('mousemove', e => {
      s.style.setProperty('--mx', e.clientX + 'px');
      s.style.setProperty('--my', e.clientY + 'px');
      s.classList.add('on');
    }, { passive: true });
    document.addEventListener('mouseleave', () => s.classList.remove('on'));
  }

  /* Photo fallback if photo.jpg is missing */
  function initPhoto() {
    const img = $('.portrait__frame img'); if (!img) return;
    const fail = () => $('.portrait__frame').classList.add('no-photo');
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  }

  document.addEventListener('DOMContentLoaded', () => {
    setYear(); initScrollUI(); initMenu(); initActiveNav(); initReveal();
    initSpotlight(); initPhoto();
  });
})();
