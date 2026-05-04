(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var burger = document.getElementById('navBurger');
  var menu = document.getElementById('mobileMenu');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('section[id]');
  var menuOpen = false;

  // Nav border on scroll
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Active nav link
  window.addEventListener('scroll', function () {
    var y = window.scrollY + 200;
    sections.forEach(function (s) {
      var id = s.getAttribute('id');
      if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) {
        navLinks.forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { passive: true });

  // Mobile menu
  function toggle() {
    menuOpen = !menuOpen;
    burger.classList.toggle('open', menuOpen);
    menu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }

  burger.addEventListener('click', toggle);

  menu.querySelectorAll('.mobile-link').forEach(function (l) {
    l.addEventListener('click', function () { if (menuOpen) toggle(); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) toggle();
  });

  // Scroll reveal
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { obs.observe(el); });

  // Counter animation
  var counted = new Set();
  var cobs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !counted.has(e.target)) {
        counted.add(e.target);
        animate(e.target);
        cobs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(function (el) { cobs.observe(el); });

  function animate(el) {
    var to = parseInt(el.getAttribute('data-count'), 10);
    var sfx = el.getAttribute('data-suffix') || '';
    var dur = 1200;
    var t0 = null;
    function step(now) {
      if (!t0) t0 = now;
      var p = Math.min((now - t0) / dur, 1);
      var v = Math.round((1 - Math.pow(1 - p, 3)) * to);
      el.textContent = v + sfx;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Smooth scroll con Lenis (Premium, buttery smooth, extra inercia)
  const lenis = new Lenis({
    lerp: 0.05,
    wheelMultiplier: 1,
    smoothWheel: true,
    smoothTouch: false,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Anclas usando Lenis
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var h = this.getAttribute('href');
      if (h === '#') return;
      var t = document.querySelector(h);
      if (t) {
        e.preventDefault();
        lenis.scrollTo(t, { offset: -nav.offsetHeight - 16 });
      }
    });
  });
})();
