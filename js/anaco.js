(function () {
  'use strict';

  const nav = document.querySelector('.nav');
  if (nav) {
    const toggle = nav.querySelector('.nav-toggle');
    const links = nav.querySelector('.nav-links');
    const getScrollY = () =>
      window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const onScroll = () => {
      const scrolled = getScrollY() > 16;
      nav.classList.toggle('scrolled', scrolled);
      if (scrolled) links?.classList.remove('open');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toggle && links) {
      toggle.addEventListener('click', () => links.classList.toggle('open'));
    }
  }

  document.querySelectorAll('[data-rotate]').forEach((el) => {
    const words = el.dataset.rotate.split('|').map((s) => s.trim());
    if (words.length < 2) return;
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'text-rotator-word' + (i === 0 ? ' active' : '');
      span.textContent = word;
      el.appendChild(span);
    });
    let idx = 0;
    const spans = el.querySelectorAll('.text-rotator-word');
    setInterval(() => {
      spans[idx].classList.remove('active');
      idx = (idx + 1) % spans.length;
      spans[idx].classList.add('active');
    }, 3200);
  });

  function initScrollReveal() {
    const STAGGER_MS = 55;
    const targets = [];
    const seen = new Set();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function mark(el, delayMs) {
      if (!el || seen.has(el)) return;
      seen.add(el);
      if (!reduced && !el.classList.contains('blur-in')) el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', `${delayMs}ms`);
      targets.push(el);
    }

    function collectSection(section) {
      let i = 0;
      const header = section.querySelector(':scope .layer-float');
      if (header) {
        mark(header, i * STAGGER_MS);
        i += 1;
      }

      if (section.id === 'specs') {
        section.querySelectorAll('.spec-card').forEach((card) => {
          mark(card, i * STAGGER_MS);
          i += 1;
        });
        return;
      }

      if (section.id === 'industries') {
        section.querySelectorAll('.carousel-item').forEach((item) => {
          mark(item, i * STAGGER_MS);
          i += 1;
        });
        return;
      }

      const sheet = section.querySelector(':scope .sheet');
      if (!sheet) return;
      [...sheet.children].forEach((child) => {
        if (child.classList.contains('sheet-hatch')) return;
        if (child.classList.contains('layer-float')) return;
        mark(child, i * STAGGER_MS);
        i += 1;
      });
    }

    document.querySelectorAll('.home .hero-inner > *').forEach((el, i) => mark(el, i * STAGGER_MS));
    document.querySelectorAll('.home .home-section:not(.legal-page)').forEach(collectSection);

    const footer = document.querySelector('.footer');
    if (footer) mark(footer, 0);

    document.querySelectorAll('.site-page .fade-in, .site-page .blur-in').forEach((el, idx) => {
      mark(el, (idx % 6) * STAGGER_MS);
    });

    document.querySelectorAll('.site-page-main > *').forEach((el, idx) => {
      if (el.classList.contains('fade-in') || el.classList.contains('blur-in')) return;
      mark(el, idx * STAGGER_MS);
    });

    document.querySelectorAll('.fade-in:not(.reveal), .blur-in').forEach((el) => {
      if (!seen.has(el)) targets.push(el);
    });

    function show(el) {
      if (el.classList.contains('is-visible')) return;
      el.classList.add('is-visible', 'visible');
    }

    if (reduced) {
      targets.forEach(show);
      return;
    }

    function inView(el) {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < vh * 0.92 && rect.bottom > vh * 0.06;
    }

    function flushInView() {
      targets.forEach((el) => {
        if (!el.classList.contains('is-visible') && inView(el)) show(el);
      });
    }

    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) show(entry.target);
        });
      },
      { threshold: 0, rootMargin: '80px 0px 80px 0px' }
    );

    targets.forEach((el) => revealObs.observe(el));

    requestAnimationFrame(() => {
      requestAnimationFrame(flushInView);
    });

    let scrollTick = false;
    window.addEventListener(
      'scroll',
      () => {
        if (scrollTick) return;
        scrollTick = true;
        requestAnimationFrame(() => {
          scrollTick = false;
          flushInView();
        });
      },
      { passive: true }
    );

    window.addEventListener('load', flushInView, { once: true });
    window.addEventListener('resize', flushInView, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }

  window.scrollCarousel = function (dir) {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    const items = track.querySelectorAll('.carousel-item');
    if (!items.length) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 12;
    const step = (items[0].offsetWidth + gap) * Math.min(3, items.length);
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

})();
