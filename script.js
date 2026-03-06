(function () {
  'use strict';

  var nav = document.querySelector('.nav');
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
  }

  document.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.matchMedia('(max-width: 768px)').matches) {
        navLinks.classList.remove('open');
      }
    });
  });

  // 导航栏始终保持浅色玻璃拟态，不随滚动变黑
  window.addEventListener('scroll', function () {
    var y = window.scrollY || window.pageYOffset;
    if (y > 80) {
      nav.style.background = 'rgba(255, 255, 255, 0.88)';
      nav.style.borderBottom = '1px solid rgba(0, 0, 0, 0.08)';
    } else {
      nav.style.background = '';
      nav.style.borderBottom = '';
    }
  }, { passive: true });

  var observerOptions = { root: null, rootMargin: '0px', threshold: 0.08 };
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, observerOptions);

  var animated = document.querySelectorAll('.slash-card, .service-item, .project-card, .article-card, .about-card');
  animated.forEach(function (el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    var delay = (i % 8) * 0.06;
    el.style.transition = 'opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1) ' + delay + 's, transform 0.55s cubic-bezier(0.16, 1, 0.3, 1) ' + delay + 's';
    observer.observe(el);
  });

  var style = document.createElement('style');
  style.textContent = '.slash-card.in-view, .service-item.in-view, .project-card.in-view, .article-card.in-view, .about-card.in-view { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);
})();
