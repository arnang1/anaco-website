(function () {
  'use strict';

  var data = window.INDUSTRIES_DATA;
  var track = document.getElementById('carouselTrack');
  var unfold = document.getElementById('industryUnfold');
  if (!data || !track || !unfold) return;

  var activeId = null;
  var panels = Object.create(null);

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

  data.forEach(function (item) {
    panels[item.id] = panelHtml(item);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'carousel-item';
    btn.dataset.id = item.id;
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'industryUnfold');
    btn.innerHTML =
      '<div class="carousel-item-img" style="background-image:url(\'' + item.img + '\')"></div>' +
      '<span class="carousel-item-title">' + item.title + '</span>';
    btn.addEventListener('click', function () {
      toggle(item.id, btn);
    });
    track.appendChild(btn);
  });

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
  }
})();
