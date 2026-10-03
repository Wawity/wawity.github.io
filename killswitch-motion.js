(function () {
  'use strict';

  var TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12l5 5L20 7"/></svg>';
  var SPARKS = 8;

  function boot() {
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    var stage = document.querySelector('.ks-stage');
    var screen = stage && stage.querySelector('.ks-stage-fade');
    var win = document.getElementById('ks-app');
    var word = document.querySelector('.ks-oversize-word');
    var note = document.querySelector('.ks-oversize-note');
    if (!gsap || !ScrollTrigger || !stage || !screen || !win || stage.dataset.motion) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    stage.dataset.motion = 'on';
    gsap.registerPlugin(ScrollTrigger);
    var scramble = !!window.ScrambleTextPlugin;
    if (scramble) gsap.registerPlugin(window.ScrambleTextPlugin);

    var toggles = Array.prototype.filter.call(win.querySelectorAll('.toggle'), function (btn) {
      return btn.classList.contains('toggle--accent');
    });
    if (!toggles.length) return;

    var rows = win.querySelectorAll('.page-header, .page > .seg, .card > *');
    var scan = make('div', 'ks-scan');
    var lock = make('div', 'ks-lock');
    win.appendChild(lock);
    win.appendChild(scan);

    var lift = make('div', 'ks-lift');
    stage.appendChild(lift);

    var cards = toggles.map(function (btn) {
      var row = btn.closest('.setting-row');
      var card = make('div', 'ks-card');
      var clip = make('span', 'ks-card-clip');
      var grid = make('span', 'ks-card-grid');
      var burst = make('span', 'ks-card-burst');
      var sweep = make('span', 'ks-card-sweep');
      clip.appendChild(grid);
      clip.appendChild(burst);
      clip.appendChild(sweep);
      var trace = make('span', 'ks-card-trace');
      var icon = make('span', 'ks-card-icon');
      var glyph = row.querySelector('.row-icon');
      if (glyph) icon.appendChild(glyph.cloneNode(true));
      var text = make('div', 'ks-card-text');
      var title = make('p', 'ks-card-title');
      var desc = make('p', 'ks-card-desc');
      title.textContent = row.querySelector('.row-title').textContent;
      desc.textContent = row.querySelector('.row-desc').textContent;
      text.appendChild(title);
      text.appendChild(desc);
      var state = make('span', 'ks-card-state');
      var check = make('span', 'ks-card-check', TICK);
      var ring = make('span', 'ks-card-ring');
      check.appendChild(ring);
      var sparks = [];
      for (var i = 0; i < SPARKS; i++) {
        var spark = make('span', 'ks-spark');
        check.appendChild(spark);
        sparks.push(spark);
      }
      card.appendChild(clip);
      card.appendChild(trace);
      var head = make('div', 'ks-card-head');
      head.appendChild(icon);
      head.appendChild(text);
      card.appendChild(head);
      card.appendChild(state);
      card.appendChild(check);
      lift.appendChild(card);
      var part = {
        row: row,
        btn: btn,
        thumb: btn.querySelector('.toggle-thumb'),
        card: card,
        grid: grid,
        burst: burst,
        sweep: sweep,
        trace: trace,
        state: state,
        check: check,
        tick: check.querySelector('path'),
        ring: ring,
        sparks: sparks,
        on: false
      };
      card.addEventListener('click', function () { flip(part); });
      return part;
    });

    var words = splitNote();

    function make(tag, cls, html) {
      var el = document.createElement(tag);
      el.className = cls;
      el.setAttribute('aria-hidden', 'true');
      if (html) el.innerHTML = html;
      return el;
    }

    function splitNote() {
      if (!note) return [];
      var marked = ['максимальную', 'анонимность,'];
      var parts = note.textContent.trim().split(/\s+/);
      note.setAttribute('aria-label', note.textContent.trim());
      note.textContent = '';
      return parts.map(function (chunk, i) {
        var span = document.createElement('span');
        span.className = 'ks-w' + (marked.indexOf(chunk) > -1 ? ' ks-em' : '');
        span.setAttribute('aria-hidden', 'true');
        span.textContent = chunk;
        note.appendChild(span);
        if (i < parts.length - 1) note.appendChild(document.createTextNode(' '));
        return span;
      });
    }

    function narrow() {
      return window.innerWidth <= 820;
    }

    function place() {
      var box = stage.getBoundingClientRect();
      var width = narrow() ? box.width * 0.94 : Math.min(screen.offsetWidth * 0.8, 820);
      lift.style.width = width + 'px';
      lift.style.left = (box.width - width) / 2 + 'px';
      var mid;
      if (narrow()) {
        var first = cards[0].row.getBoundingClientRect();
        var last = cards[cards.length - 1].row.getBoundingClientRect();
        mid = (first.top + last.bottom) / 2 - box.top;
      } else {
        mid = screen.offsetHeight * 0.5;
      }
      var height = lift.offsetHeight;
      lift.style.top = Math.max(0, Math.min(mid - height / 2, screen.offsetHeight - height - 16)) + 'px';
      return box;
    }

    function setLabel(part, on, animate) {
      var label = on ? 'Включено' : 'Выключено';
      if (animate && scramble) gsap.to(part.state, { duration: 0.7, scrambleText: { text: label, chars: '01#/<>_', speed: 0.6 } });
      else part.state.textContent = label;
    }

    function setInner(part, on) {
      part.btn.classList.toggle('toggle--accent', on);
      part.thumb.classList.toggle('toggle-thumb--on', on);
    }

    function disarm() {
      cards.forEach(function (part) {
        part.on = false;
        part.card.classList.remove('is-on');
        setInner(part, false);
        setLabel(part, false, false);
        gsap.killTweensOf([part.card, part.tick, part.ring, part.burst, part.sweep, part.grid, part.trace, part.check].concat(part.sparks));
        gsap.set(part.card, { '--d': narrow() ? 4 : 5, autoAlpha: 0, x: 0, y: 0, z: 0, scale: 1, rotationX: 0, rotationY: 0 });
        gsap.set(part.tick, { strokeDashoffset: 22 });
        gsap.set([part.ring, part.burst, part.sweep, part.grid, part.trace].concat(part.sparks), { opacity: 0 });
        gsap.set(part.row, { opacity: 1 });
      });
      lift.classList.remove('is-ready');
      gsap.set(rows, { autoAlpha: 0, y: 14, filter: 'blur(6px)' });
      gsap.set(scan, { opacity: 0, y: 0 });
      gsap.set(lock, { opacity: 0 });
      if (word) gsap.set(word, { backgroundSize: '0% 100%' });
      if (note) gsap.set(note, { autoAlpha: 1 });
      if (words.length) gsap.set(words, { autoAlpha: 0, y: 22, rotationX: -70, filter: 'blur(8px)', transformOrigin: '50% 100%' });
    }

    function bloom(part, at, tl) {
      var t = tl || gsap.timeline();
      var reach = narrow() ? 30 : 42;
      t.call(function () {
        part.on = true;
        part.card.classList.add('is-on');
        setInner(part, true);
        setLabel(part, true, true);
      }, null, at)
        .fromTo(part.check, { scale: 0.7 }, { immediateRender: false,  scale: 1, duration: 0.6, ease: 'elastic.out(1.2, 0.4)' }, at)
        .fromTo(part.tick, { strokeDashoffset: 22 }, { immediateRender: false,  strokeDashoffset: 0, duration: 0.4, ease: 'power2.out' }, at + 0.05)
        .fromTo(part.ring, { opacity: 0.9, scale: 1 }, { immediateRender: false,  opacity: 0, scale: 3.2, duration: 0.9, ease: 'power2.out' }, at)
        .fromTo(part.burst, { opacity: 1, clipPath: 'circle(0% at calc(100% - 36px) 50%)' }, { immediateRender: false,  clipPath: 'circle(140% at calc(100% - 36px) 50%)', duration: 1.1, ease: 'power3.out' }, at)
        .to(part.burst, { opacity: 0.35, duration: 0.9, ease: 'power1.out' }, at + 0.7)
        .fromTo(part.grid, { opacity: 0 }, { immediateRender: false,  opacity: 1, duration: 0.25 }, at + 0.05)
        .to(part.grid, { opacity: 0, duration: 1.1, ease: 'power2.out' }, at + 0.35)
        .fromTo(part.sweep, { opacity: 1, xPercent: 300 }, { immediateRender: false,  xPercent: -160, duration: 1.0, ease: 'power2.inOut' }, at + 0.1)
        .to(part.sweep, { opacity: 0, duration: 0.25 }, at + 0.9)
        .fromTo(part.trace, { opacity: 1, '--a': '0deg' }, { immediateRender: false,  '--a': '360deg', duration: 1.25, ease: 'power2.inOut' }, at + 0.05)
        .to(part.trace, { opacity: 0, duration: 0.4 }, at + 1.1);
      part.sparks.forEach(function (spark, i) {
        var angle = (Math.PI * 2 * i) / part.sparks.length + Math.random() * 0.5;
        var dist = reach * (0.6 + Math.random() * 0.6);
        t.fromTo(spark, { opacity: 1, x: 0, y: 0, scale: 1 }, { immediateRender: false,
          x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, scale: 0, opacity: 0,
          duration: 0.7 + Math.random() * 0.35, ease: 'power3.out'
        }, at + 0.02);
      });
      return t;
    }

    function dim(part, at, tl) {
      var t = tl || gsap.timeline();
      t.call(function () {
        part.on = false;
        part.card.classList.remove('is-on');
        setInner(part, false);
        setLabel(part, false, true);
      }, null, at)
        .to(part.tick, { strokeDashoffset: 22, duration: 0.25, ease: 'power2.in' }, at)
        .to(part.burst, { opacity: 0, duration: 0.4 }, at);
      return t;
    }

    function push(part, at, tl) {
      var rest = narrow() ? 4 : 5;
      tl.to(part.card, { '--d': 1, y: rest - 1, scale: 0.99, duration: 0.11, ease: 'power2.in' }, at)
        .to(part.card, { '--d': rest, y: 0, scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)' }, at + 0.11);
    }

    function flip(part) {
      if (!lift.classList.contains('is-ready')) return;
      var tl = gsap.timeline();
      push(part, 0, tl);
      if (part.on) dim(part, 0.11, tl);
      else bloom(part, 0.11, tl);
    }

    function story() {
      place();
      var tl = gsap.timeline({ paused: true });
      var t = 0;
      lift.classList.add('is-ready');

      tl.to(rows, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out', stagger: 0.05 }, 0);

      t = 0.75;
      cards.forEach(function (part, i) {
        var r = part.row.getBoundingClientRect();
        var c = part.card.getBoundingClientRect();
        tl.fromTo(part.card, {
          autoAlpha: 0,
          x: r.left + r.width / 2 - (c.left + c.width / 2),
          y: r.top + r.height / 2 - (c.top + c.height / 2),
          scale: r.width / c.width,
          rotationX: 24,
          rotationY: -10,
          z: -160
        }, {
          autoAlpha: 1, x: 0, y: 0, scale: 1, rotationX: narrow() ? 0 : 4, rotationY: narrow() ? 0 : -4, z: 0,
          duration: 1.15, ease: 'expo.out'
        }, t + i * 0.14);
        tl.to(part.row, { opacity: 0.18, duration: 0.5, ease: 'power2.out' }, t + i * 0.14);
      });

      t += 1.15;
      cards.forEach(function (part) {
        push(part, t, tl);
        bloom(part, t + 0.11, tl);
        t += 0.7;
      });

      t += 0.2;
      cards.forEach(function (part, i) {
        tl.fromTo(part.trace, { opacity: 1, '--a': '180deg' }, { immediateRender: false, '--a': '540deg', duration: 1.4, ease: 'power1.inOut' }, t + i * 0.12)
          .to(part.trace, { opacity: 0, duration: 0.4 }, t + 1.1 + i * 0.12);
      });
      var winH = win.offsetHeight;
      tl.set(scan, { opacity: 1, y: -2 }, t)
        .to(scan, { y: winH + 160, duration: 1.3, ease: 'power1.inOut' }, t)
        .to(scan, { opacity: 0, duration: 0.2 }, t + 1.1)
        .to(lock, { opacity: 1, duration: 0.25, ease: 'power2.out' }, t + 0.15)
        .to(lock, { opacity: 0, duration: 1.1, ease: 'power2.inOut' }, t + 1.2);
      if (word) tl.to(word, { backgroundSize: '100% 100%', duration: 1.4, ease: 'power2.inOut' }, t);
      if (words.length) {
        tl.to(words, { autoAlpha: 1, y: 0, rotationX: 0, filter: 'blur(0px)', duration: 0.9, ease: 'power3.out', stagger: 0.06 }, t + 0.6);
      }

      cards.forEach(function (part, i) {
        tl.add(gsap.timeline({ repeat: -1, repeatDelay: 2.6, delay: i * 0.4 })
          .fromTo(part.ring, { opacity: 0.5, scale: 1 }, { immediateRender: false, opacity: 0, scale: 2.4, duration: 1.5, ease: 'power2.out' }), t + 2);
      });
      tl.call(float, null, t + 1.6);
      return tl;
    }

    var floaters = [];
    function float() {
      if (narrow()) return;
      cards.forEach(function (part, i) {
        floaters.push(gsap.to(part.card, { y: -3, duration: 2.2 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.5 }));
      });
    }

    function still() {
      floaters.forEach(function (tw) { tw.kill(); });
      floaters = [];
    }

    var tiltX = cards.map(function (part) { return gsap.quickTo(part.card, 'rotationY', { duration: 0.8, ease: 'power3.out' }); });
    var tiltY = cards.map(function (part) { return gsap.quickTo(part.card, 'rotationX', { duration: 0.8, ease: 'power3.out' }); });
    stage.addEventListener('pointermove', function (e) {
      if (!lift.classList.contains('is-ready') || narrow()) return;
      var b = stage.getBoundingClientRect();
      var nx = (e.clientX - b.left) / b.width - 0.5;
      var ny = (e.clientY - b.top) / b.height - 0.5;
      cards.forEach(function (part, i) {
        tiltX[i](-4 + nx * 6);
        tiltY[i](4 - ny * 5);
      });
    });

    var mm = gsap.matchMedia();
    mm.add('(min-width: 821px)', function () {
      gsap.fromTo(screen,
        { transformPerspective: 1400, rotationX: 22, rotationY: -26, rotation: 2.5, scale: 0.84, y: 90, autoAlpha: 0.35 },
        {
          transformPerspective: 1400, rotationX: 7, rotationY: -10, rotation: 0.4, scale: 0.98, y: 0, autoAlpha: 1, ease: 'none',
          scrollTrigger: { trigger: stage, start: 'top 98%', end: 'top 30%', scrub: 0.8 }
        });
      if (word) {
        gsap.fromTo(word, { xPercent: -50, x: 0, yPercent: 18, letterSpacing: '-0.02em' }, {
          xPercent: -50, x: 0, yPercent: -6, letterSpacing: '-0.09em', ease: 'none',
          scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
      }
    });

    var run = null;
    disarm();
    ScrollTrigger.create({
      trigger: stage,
      start: 'top 45%',
      onEnter: function () {
        if (run) run.kill();
        still();
        disarm();
        run = story();
        run.play();
      },
      onLeaveBack: function () {
        if (run) run.kill();
        run = null;
        still();
        disarm();
      }
    });

    var pending = 0;
    window.addEventListener('resize', function () {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(function () { if (lift.classList.contains('is-ready')) place(); });
    });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); }, { once: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
