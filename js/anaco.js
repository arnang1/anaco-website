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

  function prefersLiteReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    const cores = navigator.hardwareConcurrency || 8;
    const mem = navigator.deviceMemory;
    if (cores <= 4) return true;
    if (mem !== undefined && mem < 4) return true;
    return false;
  }

  function initScrollReveal() {
    const lite = prefersLiteReveal();
    if (lite) document.documentElement.classList.add('reveal-lite');

    const STAGGER_MS = lite ? 110 : 85;
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

    let revealObs;
    let flushInView = () => {};

    function settleStatic(el) {
      if (!el || seen.has(el)) return;
      seen.add(el);
      el.classList.add('is-visible', 'visible');
      targets.push(el);
    }

    function markHeroInner() {
      document.querySelectorAll('.home .hero-inner > *').forEach((el, i) => mark(el, i * STAGGER_MS));
    }

    const html = document.documentElement;
    if (html.classList.contains('intro-pending')) {
      document.addEventListener(
        'anaco-intro-complete',
        () => {
          document.querySelectorAll('.home .hero-inner > *').forEach((el, i) => {
            if (el.classList.contains('hero-headline') || el.classList.contains('intro-page-fade')) {
              seen.add(el);
              el.classList.add('is-visible', 'visible');
              return;
            }
            mark(el, i * STAGGER_MS);
          });
          document.querySelectorAll('.intro-page-fade, footer.footer').forEach((el) => {
            if (seen.has(el)) return;
            seen.add(el);
            el.classList.add('is-visible', 'visible');
          });
          targets.forEach((el) => revealObs.observe(el));
          flushInView();
        },
        { once: true }
      );
    } else if (html.classList.contains('intro-done')) {
      document
        .querySelectorAll('.home .hero-inner > *, nav.nav .nav-logo, nav.nav .intro-target')
        .forEach(settleStatic);
    } else {
      markHeroInner();
    }
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

    function clearRevealWillChange(el) {
      el.classList.remove('is-revealing');
      el.style.willChange = '';
    }

    function armReveal(el) {
      el.classList.add('is-revealing');
      const onEnd = (e) => {
        if (e.target !== el || e.propertyName !== 'opacity') return;
        el.removeEventListener('transitionend', onEnd);
        clearRevealWillChange(el);
      };
      el.addEventListener('transitionend', onEnd);
      window.setTimeout(() => clearRevealWillChange(el), 1600);
    }

    function show(el) {
      if (el.classList.contains('is-visible')) return;
      if (!reduced) armReveal(el);
      el.classList.add('is-visible', 'visible');
      revealObs?.unobserve(el);
    }

    if (reduced) {
      targets.forEach(show);
      return;
    }

    if (targets.length > 28 && !lite) {
      document.documentElement.classList.add('reveal-lite');
    }

    revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) show(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px 12% 0px' }
    );

    targets.forEach((el) => revealObs.observe(el));

    flushInView = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      targets.forEach((el) => {
        if (el.classList.contains('is-visible')) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.94 && rect.bottom > 0) show(el);
      });
    };

    requestAnimationFrame(flushInView);

    let resizeTick = 0;
    window.addEventListener(
      'resize',
      () => {
        window.clearTimeout(resizeTick);
        resizeTick = window.setTimeout(() => {
          targets.forEach((el) => {
            if (!el.classList.contains('is-visible') && revealObs) revealObs.observe(el);
          });
        }, 200);
      },
      { passive: true }
    );
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
