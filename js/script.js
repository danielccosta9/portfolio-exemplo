document.addEventListener('DOMContentLoaded', () => {
  setupMobileNavigation();
  setupSmoothScroll();
  setupScrollReveal();
  setupActiveSection();
});

const setupMobileNavigation = () => {
  const toggle = document.querySelector('.nav__toggle');
  const panel = document.getElementById('nav-mobile');

  if (!toggle || !panel) return;

  const closeMenu = () => {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      closeMenu();
      return;
    }

    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
  });

  panel.querySelectorAll('.nav-mobile__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) closeMenu();
  });
};

const setupSmoothScroll = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });
};

const setupScrollReveal = () => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });

  items.forEach((item) => observer.observe(item));
};

const setupActiveSection = () => {
  const sections = [...document.querySelectorAll('section[id], header[id]')];
  const links = [...document.querySelectorAll('.nav__link')];

  if (!sections.length || !links.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      links.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { threshold: 0.4 });

  sections.forEach((section) => observer.observe(section));
};
