(function () {
  var root = document.querySelector('.bb-root');
  // Menu mobile
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    window.addEventListener('pageshow', function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }
  // Animação de entrada ao rolar
  if ('IntersectionObserver' in window && root) {
    root.classList.add('bb-armed');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  }
  // Depoimentos
  var slides = Array.prototype.slice.call(document.querySelectorAll('.testimonial'));
  var segs = Array.prototype.slice.call(document.querySelectorAll('.av'));
  var active = 0;
  var show = function (n) {
    active = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('active', i === active); });
    segs.forEach(function (b, i) {
      b.classList.toggle('active', i === active);
    });
  };
  segs.forEach(function (b) {
    b.addEventListener('click', function () { show(Number(b.getAttribute('data-i'))); });
  });
  var slider = document.querySelector('.testimonial-slider');
  if (slider) {
    var tx = 0;
    slider.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 40) show(active + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }
  // Linha do tempo (página Sobre)
  var tl = document.querySelector('.timeline');
  var fill = document.querySelector('.tl-progress');
  if (tl && fill) {
    var items = tl.querySelectorAll('li');
    var update = function () {
      var mark = window.innerHeight * 0.6;
      var r = tl.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (mark - r.top) / r.height));
      fill.style.height = (p * 100).toFixed(2) + '%';
      items.forEach(function (li) { li.classList.toggle('on', li.getBoundingClientRect().top + 14 <= mark); });
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
  // Ano no rodapé
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
