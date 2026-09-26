// Scroll-triggered animations handler
(function() {
  const targets = [
    { selector: '.scene', className: 'is-reveal', threshold: 0.15 },
    { selector: '.stat', className: 'is-reveal', threshold: 0.4 },
    { selector: '.capability-shot', className: 'is-reveal', threshold: 0.3 },
    { selector: '.feat-card', className: 'is-reveal', threshold: 0.35 },
    { selector: '.dl-card', className: 'is-reveal', threshold: 0.4 },
    { selector: '.ks-stage-fade', className: 'is-reveal', threshold: 0.25 }
  ];

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-reveal');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  targets.forEach(target => {
    document.querySelectorAll(target.selector).forEach(el => {
      observer.observe(el);
    });
  });

  // Kill switch stage fade in on scroll
  const ksStage = document.querySelector('.ks-stage-fade');
  if (ksStage) {
    const ksObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ksStage.classList.add('is-reveal');
        }
      });
    }, { threshold: 0.2 });
    ksObserver.observe(ksStage);
  }

  // Parallax effect on capability shots (subtle)
  if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    document.querySelectorAll('.capability-shot img').forEach(img => {
      window.addEventListener('scroll', () => {
        const rect = img.getBoundingClientRect();
        const offset = (window.innerHeight - rect.top) * 0.05;
        img.style.transform = `translateY(${offset}px)`;
      }, { passive: true });
    });
  }

  // Navbar scroll effect
  const nav = document.querySelector('nav');
  if (nav) {
    let lastScrollY = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      lastScrollY = scrollY;
    }, { passive: true });
  }
})();

// Mobile menu toggle
(function() {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mmenu');

  if (burger && menu) {
    burger.addEventListener('click', () => {
      const isOpen = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !isOpen);
      menu.classList.toggle('open');
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.setAttribute('aria-expanded', 'false');
        menu.classList.remove('open');
      });
    });
  }
})();

// Lazy load images with fade effect
(function() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
})();
