/* TransitIQ – vanilla JS (replaces the React state/effects from the original Next.js site) */
(function () {
  'use strict';

  /* ── Mobile navigation toggle ── */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');

  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle('is-open', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(!nav.classList.contains('is-open'));
    });
    // Close the menu after choosing a section link
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenu(false);
    });
  }

  /* ── Fade-in on scroll ── */
  var fadeEls = document.querySelectorAll('.fade-in-section');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('fade-in-visible');
      });
    }, { threshold: 0.1 });
    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('fade-in-visible'); });
  }


  /* ── Highlight the nav link of the section currently in view ── */
  var navLinks = nav ? nav.querySelectorAll('a[href^="#"]') : [];
  if (navLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    navLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id === 'methodology-pipeline' ? 'methodology-pipeline' : entry.target.id;
        navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
        if (map[id]) map[id].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    // nothing highlighted while the hero is on screen
    window.addEventListener('scroll', function () {
      if (window.scrollY < 120) navLinks.forEach(function (a) { a.removeAttribute('aria-current'); });
    }, { passive: true });
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ── Contact form ──
     The original form never sent anything: it only switched the button label.
     Hooking it up to a real backend / form service is still required. */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var label = form.querySelector('.submit-label');
      if (label) label.textContent = 'Message ready to send';
    });
  }

  /* ── Research library downloads ── */
  var fullThesis = Array.prototype.find.call(
    document.querySelectorAll('.resource-row'),
    function (row) {
      var title = row.querySelector('strong');
      return title && title.textContent.trim() === 'Full thesis';
    }
  );
  if (fullThesis) {
    fullThesis.href = 'assets/documents/Group%20Thesis/R26-ISE-004_DRAFT.pdf';
    fullThesis.target = '_blank';
    fullThesis.rel = 'noreferrer';
    fullThesis.setAttribute('download', '');
  }

  var checklistGroup = Array.prototype.find.call(
    document.querySelectorAll('.resource-group'),
    function (group) {
      var title = group.querySelector('summary strong');
      return title && title.textContent.trim() === 'Check Lists';
    }
  );
  if (checklistGroup) {
    var checklistCount = checklistGroup.querySelector('summary b');
    if (checklistCount) checklistCount.textContent = '04 PDF';
  }
})();
