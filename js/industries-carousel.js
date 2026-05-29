(function () {
  'use strict';

  var data = window.INDUSTRIES_DATA;
  var track = document.getElementById('carouselTrack');
  var unfold = document.getElementById('industryUnfold');
  if (!data || !track || !unfold) return;

  var VISIBLE_INITIAL = 5;
  var activeId = null;
  var panels = Object.create(null);

  function thumbSrc(imgPath) {
    var name = imgPath.replace(/^images\//, '').replace(/\.(jpe?g|png|webp)$/i, '');
    return 'images/carousel/' + name + '.jpg';
  }

  function panelHtml(item) {
    var cases = item.cases.map(function (c) {
      return (
        '<div class="usecase-card">' +
          '<div class="usecase-icon">' + c.icon + '</div>' +
          '<div class="usecase-label">' + c.label + '</div>' +
          '<h3>' + c.head + '</h3>' +
          '<p>' + c.text + '</p>' +
        '</div>'
      );
    }).join('');
    return (
      '<h3 class="industry-unfold-heading">' + item.heading + '</h3>' +
      '<div class="usecases-grid">' + cases + '</div>'
    );
  }

  function loadItemImage(wrap) {
    if (!wrap || wrap.dataset.loaded === '1') return;
    var src = wrap.dataset.src;
    if (!src) return;
    var img = wrap.querySelector('img');
    if (!img) return;
    img.src = src;
    wrap.dataset.loaded = '1';
  }

  function prefetchAhead(fromIndex, count) {
    var items = track.querySelectorAll('.carousel-item');
    for (var i = fromIndex; i < Math.min(fromIndex + count, items.length); i++) {
      var wrap = items[i].querySelector('.carousel-item-img');
      if (wrap) loadItemImage(wrap);
    }
  }

  data.forEach(function (item, index) {
    panels[item.id] = panelHtml(item);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'carousel-item';
    btn.dataset.id = item.id;
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'industryUnfold');

    var thumb = thumbSrc(item.img);
    var imgHtml =
      '<div class="carousel-item-img" data-src="' + thumb + '" data-loaded="0">' +
        '<img alt="" decoding="async" width="420" height="280">' +
      '</div>';

    btn.innerHTML = imgHtml + '<span class="carousel-item-title">' + item.title + '</span>';
    btn.addEventListener('click', function () {
      toggle(item.id, btn);
    });
    track.appendChild(btn);

    if (index < VISIBLE_INITIAL) {
      loadItemImage(btn.querySelector('.carousel-item-img'));
    }
  });

  if ('IntersectionObserver' in window) {
    var imgObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          loadItemImage(entry.target);
          imgObserver.unobserve(entry.target);
        });
      },
      { root: track, rootMargin: '120px 0px', threshold: 0.01 }
    );
    track.querySelectorAll('.carousel-item-img[data-loaded="0"]').forEach(function (el) {
      imgObserver.observe(el);
    });
  } else {
    prefetchAhead(VISIBLE_INITIAL, data.length);
  }

  track.addEventListener(
    'scroll',
    function () {
      var items = track.querySelectorAll('.carousel-item');
      if (!items.length) return;
      var gap = parseFloat(getComputedStyle(track).gap) || 12;
      var step = items[0].offsetWidth + gap;
      var index = Math.round(track.scrollLeft / step);
      prefetchAhead(index, VISIBLE_INITIAL + 2);
    },
    { passive: true }
  );

  function closeAll() {
    activeId = null;
    unfold.hidden = true;
    unfold.innerHTML = '';
    track.querySelectorAll('.carousel-item').forEach(function (el) {
      el.classList.remove('is-active');
      el.setAttribute('aria-expanded', 'false');
    });
  }

  function toggle(id, btn) {
    if (activeId === id) {
      closeAll();
      return;
    }
    activeId = id;
    track.querySelectorAll('.carousel-item').forEach(function (el) {
      var on = el === btn;
      el.classList.toggle('is-active', on);
      el.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    unfold.innerHTML = panels[id];
    unfold.hidden = false;
    loadItemImage(btn.querySelector('.carousel-item-img'));
  }
})();
