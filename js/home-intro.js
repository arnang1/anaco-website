(function () {
  'use strict';

  const STORAGE_KEY = 'anaco-intro-seen';
  const FLY_MS = 720;
  const FLY_EASE = 'cubic-bezier(0.55, 0.06, 0.22, 1)';
  const REVEAL_MS = 620;
  const LAB_BRING_MS = 720;
  const LAB_SETTLE_MS = 340;
  const LINE2_LAB_FLY_DELAY_MS = 420;

  const PIECES = [
    { key: 'meet', fly: '.intro-fly--meet', target: 'main.home .hero-headline .headline-row:first-child' },
    { key: 'tinylab', fly: '.intro-fly--tinylab', target: 'main.home .hero-headline .headline-row--accent' },
    { key: 'mark', fly: '.intro-fly--mark', target: 'nav.nav .nav-logo .brand-mark' },
    { key: 'name', fly: '.intro-fly--name', target: 'nav.nav .nav-logo > span.intro-target' },
  ];

  const TARGET_HIDE = 'main.home .intro-target, nav.nav .intro-target';
  const PAGE_FADE = [
    '.hero .sheet--hero',
    '.hero-tagline',
    '.hero-btns',
    '.hero-visual',
    'main.home .home-section',
    'footer.footer',
    'nav.nav .nav-links',
  ];

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  function finishImmediate() {
    const html = document.documentElement;
    html.classList.remove('intro-pending', 'intro-reveal');
    html.classList.add('intro-done');
    document.querySelectorAll(TARGET_HIDE).forEach((el) => {
      el.classList.remove('intro-target-hidden');
      el.style.opacity = '';
    });
    document.querySelectorAll('.intro-page-fade').forEach((el) => {
      el.classList.remove('intro-page-fade');
      el.style.opacity = '';
    });
    document.getElementById('home-intro')?.remove();
    document.dispatchEvent(new Event('anaco-intro-complete'));
  }

  function markPageFadeTargets() {
    PAGE_FADE.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => el.classList.add('intro-page-fade'));
    });
  }

  function hideRealTargets() {
    document.querySelectorAll(TARGET_HIDE).forEach((el) => {
      el.classList.add('intro-target-hidden');
    });
  }

  function showRealTargets() {
    document.querySelectorAll(TARGET_HIDE).forEach((el) => {
      el.classList.remove('intro-target-hidden');
      el.style.opacity = '';
    });
  }

  function rectOf(el) {
    return el.getBoundingClientRect();
  }

  function isLogoPiece(el) {
    return el.classList.contains('intro-fly--mark');
  }

  function placeFixedDivider(el, rect) {
    el.style.cssText = [
      'position:fixed',
      `left:${rect.left}px`,
      `top:${rect.top}px`,
      `width:${rect.width}px`,
      `height:${rect.height}px`,
      'margin:0',
      'z-index:10003',
      'visibility:visible',
      'pointer-events:none',
      'opacity:1',
      'transform:scaleX(1)',
      'transform-origin:center center',
      'transition:none',
      'box-sizing:border-box',
    ].join(';');
  }

  function shrinkDivider(el, ms, ease) {
    return new Promise((resolve) => {
      void el.offsetWidth;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.transition = `transform ${ms}ms ${ease}, opacity ${ms}ms ${ease}`;
          el.style.transform = 'scaleX(0)';
          el.style.opacity = '0';
          window.setTimeout(resolve, ms + 80);
        });
      });
    });
  }

  function flyLabHorizontal(labWrap, labEl, questionEl, portal, from, toLeft, flyTop, ms = FLY_MS) {
    const hold = document.createElement('span');
    hold.className = 'home-intro__lab-wrap home-intro__lab-wrap--hold';
    hold.style.minWidth = `${from.width}px`;
    labWrap.parentNode.insertBefore(hold, labWrap);

    const shell = document.createElement('span');
    shell.className = 'home-intro__lab-fly-shell';
    shell.appendChild(labWrap);
    portal.appendChild(shell);

    const qcs = getComputedStyle(questionEl);
    shell.style.left = `${from.left}px`;
    shell.style.top = `${flyTop}px`;
    shell.style.fontFamily = qcs.fontFamily;
    shell.style.fontSize = qcs.fontSize;
    shell.style.fontWeight = qcs.fontWeight;
    shell.style.fontStyle = qcs.fontStyle;
    shell.style.lineHeight = qcs.lineHeight;
    shell.style.letterSpacing = qcs.letterSpacing;

    labEl.style.cssText = '';

    const deltaX = toLeft - from.left;

    return new Promise((resolve) => {
      void shell.offsetWidth;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          shell.style.setProperty('--lab-fly-x', `${deltaX}px`);
          shell.style.transition = `transform ${ms}ms ${FLY_EASE}`;
          shell.style.transform = 'translate3d(var(--lab-fly-x), 0, 0)';

          let done = false;
          const finish = () => {
            if (done) return;
            done = true;
            shell.removeEventListener('transitionend', onEnd);
            resolve({ shell, hold, deltaX });
          };
          const onEnd = (e) => {
            if (e.target !== shell) return;
            if (e.propertyName !== 'transform') return;
            finish();
          };
          shell.addEventListener('transitionend', onEnd);
          window.setTimeout(finish, ms + 100);
        });
      });
    });
  }

  function placeFixed(el, rect) {
    const rules = [
      'position:fixed',
      `left:${rect.left}px`,
      `top:${rect.top}px`,
      'margin:0',
      'z-index:10003',
      'visibility:visible',
      'pointer-events:none',
      'opacity:1',
      'transform:none',
      'animation:none',
      'transition:none',
      'box-sizing:border-box',
    ];
    if (isLogoPiece(el)) {
      rules.push(`width:${rect.width}px`, `height:${rect.height}px`);
    } else {
      rules.push('width:auto', 'height:auto');
    }
    el.style.cssText = rules.join(';');
  }

  function slideTo(el, from, to, ms = FLY_MS) {
    return new Promise((resolve) => {
      placeFixed(el, from);
      void el.offsetWidth;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const move = `left ${ms}ms ${FLY_EASE}, top ${ms}ms ${FLY_EASE}`;
          const resize = `, width ${ms}ms ${FLY_EASE}, height ${ms}ms ${FLY_EASE}`;
          el.style.transition = isLogoPiece(el) ? move + resize : move;
          el.style.left = `${to.left}px`;
          el.style.top = `${to.top}px`;
          if (isLogoPiece(el)) {
            el.style.width = `${to.width}px`;
            el.style.height = `${to.height}px`;
          }

          let done = false;
          const finish = () => {
            if (done) return;
            done = true;
            el.removeEventListener('transitionend', onEnd);
            resolve();
          };
          const onEnd = (e) => {
            if (e.target !== el) return;
            if (e.propertyName !== 'left' && e.propertyName !== 'top') return;
            finish();
          };
          el.addEventListener('transitionend', onEnd);
          window.setTimeout(finish, ms + 100);
        });
      });
    });
  }

  async function runIntro() {
    const intro = document.getElementById('home-intro');
    const portal = intro?.querySelector('.home-intro__fly-portal');
    const line1 = intro?.querySelector('.home-intro__line--1');
    const line2 = intro?.querySelector('.home-intro__line--2');
    const labEl = intro?.querySelector('.home-intro__lab');
    const labSlot = intro?.querySelector('.home-intro__lab-slot');
    const sampleEl = intro?.querySelector('.home-intro__sample');
    const labWrap = intro?.querySelector('.home-intro__lab-wrap');
    const question = intro?.querySelector('.home-intro__question');
    const flyer = intro?.querySelector('.home-intro__flyer');

    const items = PIECES.map((p) => ({
      ...p,
      flyEl: intro?.querySelector(p.fly),
      targetEl: p.target ? document.querySelector(p.target) : null,
    }));

    if (
      !intro ||
      !portal ||
      !line1 ||
      !line2 ||
      !labEl ||
      !labSlot ||
      !sampleEl ||
      !flyer ||
      items.some((p) => !p.flyEl || (p.target && !p.targetEl))
    ) {
      finishImmediate();
      return;
    }

    if (document.fonts?.ready) {
      try {
        await document.fonts.ready;
      } catch (e) {
        /* ignore */
      }
    }

    markPageFadeTargets();
    hideRealTargets();

    intro.classList.add('is-active');

    labSlot.style.width = `${rectOf(labEl).width}px`;

    line1.classList.add('is-visible');
    await wait(820);
    line2.classList.add('is-visible');
    await wait(LINE2_LAB_FLY_DELAY_MS);

    const labStart = rectOf(labEl);
    const sampleRect = rectOf(sampleEl);
    const slotRect = rectOf(labSlot);
    const labEndLeft = slotRect.left;
    const flyTop = sampleRect.top;

    let labFly = null;
    if (labWrap) {
      labFly = await flyLabHorizontal(
        labWrap,
        labEl,
        question,
        portal,
        labStart,
        labEndLeft,
        flyTop,
        LAB_BRING_MS
      );
    }
    await wait(LAB_SETTLE_MS);

    question.classList.add('is-vanish');
    if (labFly?.shell) {
      const { shell, deltaX } = labFly;
      shell.style.transition = 'opacity 0.38s ease-in, transform 0.38s ease-in';
      shell.style.transform = `translate3d(${deltaX}px, 10px, 0)`;
      shell.style.opacity = '0';
      void shell.offsetWidth;
    }
    await wait(420);

    labFly?.hold?.remove();
    labFly?.shell?.remove();
    question.hidden = true;
    flyer.hidden = false;

    const dividerEl = intro.querySelector('.intro-fly--divider');
    const meetEl = items.find((p) => p.key === 'meet').flyEl;
    const tinylabEl = items.find((p) => p.key === 'tinylab').flyEl;
    const markEl = items.find((p) => p.key === 'mark').flyEl;
    const nameEl = items.find((p) => p.key === 'name').flyEl;

    meetEl.classList.add('is-flash');
    await wait(240);
    tinylabEl.classList.add('is-flash');
    await wait(240);
    if (dividerEl) dividerEl.classList.add('is-flash');
    markEl.classList.add('is-flash');
    nameEl.classList.add('is-flash');
    await wait(780);

    items.forEach((p) => {
      p.flyEl.classList.remove('is-flash');
      p.flyEl.style.opacity = '1';
    });

    if (dividerEl) {
      dividerEl.classList.remove('is-flash');
      dividerEl.style.removeProperty('animation');
      dividerEl.style.opacity = '1';
    }

    const starts = items.map((p) => ({ piece: p, rect: rectOf(p.flyEl) }));
    const dividerStart = dividerEl ? rectOf(dividerEl) : null;

    portal.append(...items.map((p) => p.flyEl));
    if (dividerEl) portal.append(dividerEl);

    starts.forEach(({ piece, rect }) => placeFixed(piece.flyEl, rect));
    if (dividerEl && dividerStart) placeFixedDivider(dividerEl, dividerStart);

    intro.classList.add('is-flying');
    await wait(32);

    const ends = items.map((p) => rectOf(p.targetEl));

    const revealAt = Math.round(FLY_MS * 0.5);
    const html = document.documentElement;

    const flyTasks = [
      Promise.all(starts.map(({ piece, rect }, i) => slideTo(piece.flyEl, rect, ends[i]))),
      wait(revealAt).then(() => html.classList.add('intro-reveal')),
    ];
    if (dividerEl) flyTasks.push(shrinkDivider(dividerEl, FLY_MS, FLY_EASE));

    await Promise.all(flyTasks);

    items.forEach((p, i) => placeFixed(p.flyEl, ends[i]));

    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (e) {
      /* ignore */
    }

    await wait(REVEAL_MS);

    showRealTargets();
    items.forEach((p) => p.flyEl.remove());
    dividerEl?.remove();

    html.classList.remove('intro-pending', 'intro-reveal');
    html.classList.add('intro-done');
    intro.remove();
    document.dispatchEvent(new Event('anaco-intro-complete'));
  }

  function init() {
    const html = document.documentElement;
    if (!html.classList.contains('intro-pending')) {
      finishImmediate();
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishImmediate();
      return;
    }

    runIntro().catch(finishImmediate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
