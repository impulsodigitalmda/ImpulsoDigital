'use strict';

const WHATSAPP_NUMBER = '5492233033185';

document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  initHeaderScrollState();
  initMobileNav();
  initActiveNavLinks();
  initRevealOnScroll();
  initBackToTop();
  initContactForm();
  initHeroTilt();
  initMagneticButtons();
});

function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initHeaderScrollState() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 14);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initMobileNav() {
  const toggleBtn = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  const scrim = document.getElementById('navScrim');
  if (!toggleBtn || !nav || !scrim) return;

  const closeNav = () => {
    nav.classList.remove('is-open');
    scrim.classList.remove('is-visible');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Abrir menú');
    document.body.style.overflow = '';
  };

  const openNav = () => {
    nav.classList.add('is-open');
    scrim.classList.add('is-visible');
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Cerrar menú');
    document.body.style.overflow = 'hidden';
  };

  toggleBtn.addEventListener('click', () => {
    nav.classList.contains('is-open') ? closeNav() : openNav();
  });
  scrim.addEventListener('click', closeNav);
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeNav();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeNav();
  });
}

function initActiveNavLinks() {
  const links = [...document.querySelectorAll('.nav-link[href^="#"]')];
  if (!links.length || !('IntersectionObserver' in window)) return;

  const sections = links
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-42% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

function initRevealOnScroll() {
  const elements = document.querySelectorAll('.reveal:not(.is-visible)');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

function initBackToTop() {
  const button = document.getElementById('backToTop');
  if (!button) return;

  const update = () => button.classList.toggle('is-visible', window.scrollY > 700);
  update();
  window.addEventListener('scroll', update, { passive: true });
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  const showStatus = (text, isError = false) => {
    status.textContent = text;
    status.classList.toggle('is-error', isError);
  };

  form.addEventListener('submit', event => {
    event.preventDefault();

    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const message = form.elements.message.value.trim();

    if (!name || !phone || !message) {
      showStatus('Completá nombre, WhatsApp y mensaje para continuar.', true);
      return;
    }

    const whatsappMessage = [
      'Hola Impulso Digital, quiero hacer una consulta.',
      '',
      `Nombre: ${name}`,
      `WhatsApp: ${phone}`,
      '',
      `Necesito: ${message}`
    ].filter(Boolean).join('\n');

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    showStatus('Perfecto. Abrimos WhatsApp con tu consulta lista para enviar.');
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}

function initHeroTilt() {
  const shell = document.getElementById('systemShell');
  if (!shell || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  shell.addEventListener('pointermove', event => {
    const rect = shell.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    shell.style.transform = `rotateY(${x * 5}deg) rotateX(${y * -4}deg) translateY(-2px)`;
  });

  shell.addEventListener('pointerleave', () => {
    shell.style.transform = 'rotateY(-2deg) rotateX(1deg)';
  });
}

function initMagneticButtons() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.magnetic').forEach(element => {
    element.addEventListener('pointermove', event => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * .035}px, ${y * .06}px) translateY(-2px)`;
    });
    element.addEventListener('pointerleave', () => {
      element.style.transform = '';
    });
  });
}
